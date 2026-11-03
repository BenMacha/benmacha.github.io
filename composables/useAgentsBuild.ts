import { settleReveals } from './useScrollReveal'

/**
 * "Built live by agents" intro: labelled cursors build the page block by block,
 * section by section, as each section scrolls into view.
 *
 *   data-build-stage            a section, built when it enters the viewport
 *   data-build                  a block (layer) inside it, shown as a dashed wireframe until built
 *   data-build-kind="text"      typed in: revealed in the reading direction
 *   data-build-kind="draw"      a `v-draw` figure: its branches are drawn when the block is built
 *   data-build-split="N"        a long container (article body, card grid): its children are built
 *                               in N consecutive groups, one layer each
 *
 * Nothing is hidden until `start()` adds `ab-armed` to the root on the client, so
 * the server HTML stays complete. Styles: assets/css/agents-build.css.
 *
 * With the intro (`start(true)`, first load of the site and replay), a loader shows
 * the site mark in the middle with the cursors orbiting it until the page is fully
 * loaded; they make one last turn, the mark disappears and each cursor leaves for
 * the block it builds: some type text, some design, some select.
 */

export const AGENTS: ReadonlyArray<readonly [name: string, color: string]> = [
  ['symfony', '#ec3b33'], ['vue', '#41b883'], ['react', '#3d8bff'], ['docker', '#2496ed'], ['mcp', '#b06ad9'],
  ['php', '#7a86b8'], ['nuxt', '#00b37a'], ['redis', '#e0533d'], ['tailwind', '#38bdf8'], ['rag', '#d97757'],
]

/** A stage that takes longer than this is considered stuck: everything is revealed. */
const SAFETY_MS = 6000

export interface AgentsBuildState {
  phase: 'building' | 'done'
  built: number
  total: number
  /** Build time, once done (null when skipped) */
  seconds: number | null
}

type Action = 'write' | 'design' | 'select'

interface Agent {
  el: HTMLElement
  arrow: SVGElement
  tag: HTMLElement
  name: string
  role: Action
  x: number
  y: number
  /** Velocity (px/s) while swimming in the school */
  vx: number
  vy: number
  busy: boolean
}

/** The arrow of the cursor points up-left: its heading at rest */
const REST_HEADING = Math.atan2(-1, -1)
interface Box { x: number, y: number, w: number, h: number }

export function createAgentsBuild(options: {
  root: HTMLElement
  overlay: HTMLElement
  agentCount: number
  onChange: (state: AgentsBuildState) => void
  /** Loader mark (HTML) and the words shown next to the cursors */
  icon: string
  labels: Record<Action | 'loading', string>
}) {
  const { root, overlay, onChange, labels } = options
  const crew = AGENTS.slice(0, options.agentCount)
  const timers = new Set<number>()

  /** Every hidden element, and the layers (groups of elements) the agents build */
  let blocks: HTMLElement[] = []
  let units: HTMLElement[][] = []
  let agents: Agent[] = []
  let io: IntersectionObserver | null = null
  let run = 0
  let built = 0
  let t0 = 0
  let skipping = false
  let finished = true
  let loader: HTMLElement | null = null
  let frame = 0
  /** Cursors still swimming in the school: each one leaves it when it gets a block */
  const school = new Set<Agent>()

  function later(fn: () => void, ms: number) {
    const id = window.setTimeout(() => {
      timers.delete(id)
      fn()
    }, ms)
    timers.add(id)
  }

  const sleep = (ms: number) => new Promise<void>(resolve => later(resolve, skipping ? 0 : ms))

  function clearTimers() {
    timers.forEach(id => window.clearTimeout(id))
    timers.clear()
  }

  /** Document coordinates, measured once per block */
  function box(els: Element[]): Box {
    let [left, top, right, bottom] = [Infinity, Infinity, -Infinity, -Infinity]
    for (const el of els) {
      const r = el.getBoundingClientRect()
      if (!r.width && !r.height) continue
      left = Math.min(left, r.left)
      top = Math.min(top, r.top)
      right = Math.max(right, r.right)
      bottom = Math.max(bottom, r.bottom)
    }
    if (left === Infinity) return { x: 0, y: 0, w: 0, h: 0 }
    return { x: left + window.scrollX, y: top + window.scrollY, w: right - left, h: bottom - top }
  }

  /** Layers: each [data-build] block, plus the children of [data-build-split] containers in N groups */
  function collect() {
    const splits = [...root.querySelectorAll<HTMLElement>('[data-build-split]')]
    const own = [...root.querySelectorAll<HTMLElement>('[data-build]')]
      .filter(el => !el.parentElement?.closest('[data-build-split]'))
    const found: HTMLElement[][] = own.map(el => [el])
    for (const container of splits) {
      const children = [...container.children] as HTMLElement[]
      const groups = Math.max(1, Math.min(Number(container.dataset.buildSplit) || 4, children.length))
      const size = Math.ceil(children.length / groups)
      for (let i = 0; i < children.length; i += size) {
        const group = children.slice(i, i + size)
        group.forEach(el => el.setAttribute('data-build', ''))
        found.push(group)
      }
    }
    // Document order, so a section is built top to bottom
    found.sort((a, b) => (a[0]!.compareDocumentPosition(b[0]!) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
    units = found
    blocks = found.flat()
  }

  function sizeOverlay() {
    overlay.style.height = `${document.documentElement.scrollHeight}px`
  }

  function place(a: Agent, x: number, y: number) {
    a.x = x
    a.y = y
    a.el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`
  }

  const rtl = () => document.documentElement.dir === 'rtl'

  /** The word next to a cursor: its name, and what it is doing */
  function act(a: Agent, action: Action | null) {
    a.tag.textContent = action ? `${a.name} · ${labels[action]}` : a.name
    a.el.classList.toggle('is-typing', action === 'write')
  }

  /** Points the arrow along a heading (radians), or back to rest */
  function head(a: Agent, heading: number | null) {
    a.arrow.style.transform = heading == null ? '' : `rotate(${heading - REST_HEADING}rad)`
  }

  /**
   * Swims like a fish to (x, y): a curved path with a light side-to-side wiggle
   * that fades on arrival, the arrow turned along the way.
   */
  function swimTo(a: Agent, x: number, y: number, token: number) {
    const momentum = school.delete(a) ? Math.hypot(a.vx, a.vy) : 0
    const [x0, y0] = [a.x, a.y]
    const dx = x - x0
    const dy = y - y0
    const dist = Math.hypot(dx, dy)
    if (dist < 4 || skipping) {
      place(a, x, y)
      return sleep(skipping ? 0 : 200)
    }
    const ms = Math.min(1100, 380 + dist * 0.9)
    let cx: number
    let cy: number
    if (momentum > 1) {
      // Leaving the school: the path starts in the direction it was swimming
      const reach = Math.min(220, dist * 0.45)
      cx = x0 + (a.vx / momentum) * reach
      cy = y0 + (a.vy / momentum) * reach
    }
    else {
      // Control point off the straight line, on a random side
      const bend = (Math.random() < 0.5 ? -1 : 1) * Math.min(160, dist * 0.35)
      cx = x0 + dx / 2 + (-dy / dist) * bend
      cy = y0 + dy / 2 + (dx / dist) * bend
    }
    const waves = Math.max(1, Math.round(dist / 160))
    const amp = Math.min(9, dist / 30)
    a.el.classList.add('is-swim')
    const t1 = performance.now()
    return new Promise<void>((resolve) => {
      const step = (now: number) => {
        if (token !== run) return resolve()
        const p = Math.min(1, (now - t1) / ms)
        const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2
        const u = 1 - e
        // Quadratic Bezier point and tangent
        const bx = u * u * x0 + 2 * u * e * cx + e * e * x
        const by = u * u * y0 + 2 * u * e * cy + e * e * y
        const tx = 2 * u * (cx - x0) + 2 * e * (x - cx)
        const ty = 2 * u * (cy - y0) + 2 * e * (y - cy)
        const tl = Math.hypot(tx, ty) || 1
        const wiggle = Math.sin(e * Math.PI * 2 * waves) * amp * (1 - e)
        place(a, bx - (ty / tl) * wiggle, by + (tx / tl) * wiggle)
        // Turned along the path, straightening up on arrival
        head(a, p < 0.85 ? Math.atan2(ty, tx) : null)
        if (p < 1) requestAnimationFrame(step)
        else {
          a.el.classList.remove('is-swim')
          head(a, null)
          resolve()
        }
      }
      requestAnimationFrame(step)
    })
  }

  /** Moves a cursor with a given duration (ms), then back to the default easing */
  function glide(a: Agent, x: number, y: number, ms: number, easing = 'linear') {
    a.el.style.transition = `transform ${ms}ms ${easing}, opacity .4s`
    place(a, x, y)
    later(() => (a.el.style.transition = ''), ms)
  }

  function cursor(color: string) {
    return `<svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true"><path d="M1 1 L1 16 L5 12 L8 19 L11 18 L8 11 L14 11 Z" fill="${color}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`
  }

  const ROLES: Action[] = ['write', 'design', 'select']

  function makeAgents() {
    overlay.replaceChildren()
    const width = document.documentElement.clientWidth
    const step = Math.max(24, (width - 120) / crew.length)
    agents = crew.map(([name, color], i) => {
      const el = document.createElement('div')
      el.className = 'ab-agent'
      el.innerHTML = `${cursor(color)}<i class="ab-caret" style="background:${color}"></i><span style="background:${color}">${name}</span>`
      overlay.appendChild(el)
      const a: Agent = {
        el,
        arrow: el.querySelector('svg')!,
        tag: el.querySelector('span')!,
        name,
        role: ROLES[i % ROLES.length]!,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        busy: false,
      }
      place(a, 20 + i * step, window.scrollY + 80 + (i % 3) * 40)
      return a
    })
  }

  /** The page is fully loaded: window load event and web fonts, at least `min` ms, at most 6 s */
  function pageLoaded(min: number) {
    const load = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })
    const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve()
    return Promise.race([
      Promise.all([load, fonts, sleep(min)]).then(() => undefined),
      sleep(6000),
    ])
  }

  /** Loader: the mark in the middle, the cursors orbiting it until the page is loaded */
  async function intro(token: number) {
    loader = document.createElement('div')
    loader.className = 'ab-loader'
    loader.innerHTML = `<div class="ab-loader__mark">${options.icon}</div><p class="ab-loader__text">${labels.loading}</p>`
    document.body.appendChild(loader)
    document.documentElement.classList.add('ab-loading')

    const small = window.innerWidth < 640
    const radius = small ? 78 : 112
    const cx = document.documentElement.clientWidth / 2
    const cy = window.scrollY + window.innerHeight / 2
    // The school starts gathered below the mark, heading right
    agents.forEach((a, i) => {
      a.el.classList.add('is-swim')
      place(a, cx - 60 + (i % 5) * 18, cy + radius + 30 + Math.floor(i / 5) * 16)
      a.vx = 80
      a.vy = 0
      school.add(a)
    })

    // A school of fish: each one steers toward its spot in a stream that circles
    // the mark, keeps its distance from its neighbours and from the mark, and
    // swims at a bounded speed with a slight individual wobble.
    let phase = 0
    let pace = 0.75 // angular speed of the stream (rad/s)
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      phase += pace * dt
      agents.forEach((a, i) => {
        if (!school.has(a)) return
        const lag = i * 0.42
        const r = radius + Math.sin(phase * 1.7 + i) * 14 + ((i % 3) - 1) * 10
        const tx = cx + Math.cos(phase - lag) * r
        const ty = cy + Math.sin(phase - lag) * r * 0.82
        let ax = (tx - a.x) * 5 - a.vx * 1.6
        let ay = (ty - a.y) * 5 - a.vy * 1.6
        for (const b of agents) {
          if (b === a) continue
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > 0 && d2 < 1600) {
            ax += (dx / d2) * 4200
            ay += (dy / d2) * 4200
          }
        }
        const mx = a.x - cx
        const my = a.y - cy
        const md = Math.hypot(mx, my) || 1
        if (md < radius * 0.6) {
          ax += (mx / md) * 900
          ay += (my / md) * 900
        }
        ax += Math.sin(now / 260 + i * 1.3) * 40
        ay += Math.cos(now / 310 + i * 0.7) * 40
        a.vx += ax * dt
        a.vy += ay * dt
        const speed = Math.hypot(a.vx, a.vy)
        const max = 120 + pace * 260
        if (speed > max) {
          a.vx *= max / speed
          a.vy *= max / speed
        }
        place(a, a.x + a.vx * dt, a.y + a.vy * dt)
        if (speed > 8) head(a, Math.atan2(a.vy, a.vx))
      })
      if (token === run && school.size) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    await pageLoaded(1400)
    if (token !== run) return

    // One last, faster lap around the mark
    const from = phase
    const t1 = performance.now()
    const LAP_MS = 1300
    pace = 2.4
    await new Promise<void>((resolve) => {
      const wait = (now: number) => {
        if (token !== run || phase - from >= Math.PI * 2 || now - t1 > LAP_MS * 1.6) return resolve()
        requestAnimationFrame(wait)
      }
      requestAnimationFrame(wait)
    })
    if (token !== run) return

    // The mark disappears, the cursors leave for their blocks
    loader.classList.add('is-out')
    document.documentElement.classList.remove('ab-loading')
    const gone = loader
    later(() => gone.remove(), 600)
    loader = null
    t0 = performance.now()
  }

  function dropLoader() {
    cancelAnimationFrame(frame)
    school.clear()
    loader?.remove()
    loader = null
    document.documentElement.classList.remove('ab-loading')
  }

  function label(unit: HTMLElement[], b: Box) {
    const el = unit.length > 1 ? unit[0]!.parentElement! : unit[0]!
    const cls = [...el.classList].find(c => !c.startsWith('ab-') && !c.includes('draw'))
    return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''} · ${Math.round(b.w)}×${Math.round(b.h)}`
  }

  function markBuilt(el: HTMLElement, animate: boolean) {
    el.classList.add('ab-built')
    if (animate) el.classList.add('ab-building')
    if (el.dataset.buildKind === 'draw') el.classList.add('is-drawn')
  }

  function emit() {
    onChange({ phase: 'building', built, total: units.length, seconds: null })
  }

  /** What a cursor does with a block: text is typed, figures designed, the rest designed or selected */
  function actionFor(unit: HTMLElement[], a: Agent): Action {
    const kind = unit[0]!.dataset.buildKind
    if (kind === 'text') return 'write'
    if (kind === 'draw') return 'design'
    return a.role === 'write' ? 'select' : a.role
  }

  /** Typing: the cursor starts the line and follows the text as it appears */
  async function writeBlock(unit: HTMLElement[], b: Box, a: Agent, token: number) {
    const line = Math.min(b.h / 2, 14)
    const [start, end] = rtl() ? [b.x + b.w - 4, b.x + 4] : [b.x + 2, b.x + b.w - 6]
    await swimTo(a, start, b.y + line, token)
    if (token !== run) return
    unit.forEach(el => markBuilt(el, true))
    later(() => unit.forEach(el => el.classList.remove('ab-building')), 800)
    glide(a, end, b.y + Math.max(line, b.h - 12), 700)
    built++
    emit()
    await sleep(720)
  }

  /** Selecting: a marquee is dragged from one corner to the other, then the block appears in it */
  async function selectBlock(unit: HTMLElement[], b: Box, a: Agent, token: number) {
    await swimTo(a, b.x - 6, b.y - 6, token)
    if (token !== run) return
    const marquee = document.createElement('div')
    marquee.className = 'ab-marquee'
    marquee.style.transform = `translate(${Math.round(b.x - 6)}px, ${Math.round(b.y - 6)}px)`
    overlay.appendChild(marquee)
    // Next frame, so the size transition starts from zero
    await sleep(16)
    marquee.style.width = `${Math.round(b.w + 12)}px`
    marquee.style.height = `${Math.round(b.h + 12)}px`
    glide(a, b.x + b.w + 6, b.y + b.h + 6, 420, 'cubic-bezier(.4, 0, .2, 1)')
    await sleep(430)
    if (token !== run) return
    unit.forEach(el => markBuilt(el, true))
    later(() => unit.forEach(el => el.classList.remove('ab-building')), 800)
    built++
    emit()
    await sleep(420)
    marquee.style.opacity = '0'
    later(() => marquee.remove(), 320)
  }

  async function buildBlock(unit: HTMLElement[], a: Agent, token: number) {
    const b = box(unit)
    // Not rendered at this width (display: none): nothing to draw
    if (!b.w && !b.h) {
      unit.forEach(el => markBuilt(el, false))
      built++
      emit()
      return
    }
    a.busy = true
    const action = actionFor(unit, a)
    act(a, action)
    if (action !== 'design') {
      await (action === 'write' ? writeBlock : selectBlock)(unit, b, a, token)
      act(a, null)
      a.busy = false
      return
    }

    await swimTo(a, b.x + Math.min(24, b.w / 3), b.y + Math.min(14, b.h / 2), token)
    if (token !== run) return

    const sel = document.createElement('div')
    sel.className = 'ab-sel'
    sel.style.transform = `translate(${Math.round(b.x - 4)}px, ${Math.round(b.y - 4)}px)`
    sel.style.width = `${Math.round(b.w + 8)}px`
    sel.style.height = `${Math.round(b.h + 8)}px`
    sel.innerHTML = '<i></i><i></i><i></i><i></i><b></b>'
    sel.querySelector('b')!.textContent = label(unit, b)
    overlay.appendChild(sel)

    unit.forEach(el => markBuilt(el, true))
    // The entrance animation is dropped once played (its final clip-path would clip overflowing glyphs)
    later(() => unit.forEach(el => el.classList.remove('ab-building')), 800)
    // Drag to the far corner, like resizing the layer
    place(a, b.x + b.w - 10, b.y + b.h - 6)
    built++
    emit()

    await sleep(520)
    sel.style.opacity = '0'
    later(() => sel.remove(), 320)
    act(a, null)
    a.busy = false
  }

  async function buildStage(stage: Element, token: number) {
    sizeOverlay()
    const own = units.filter(unit => stage.contains(unit[0]!) && !unit[0]!.classList.contains('ab-built'))
    let next = 0
    await Promise.all(agents.map(async (a, k) => {
      // Straight from the school; otherwise a short stagger
      if (!school.has(a)) await sleep(k * 70)
      while (next < own.length && token === run) {
        await buildBlock(own[next++]!, a, token)
        await sleep(60)
      }
    }))
    // Idle agents drift around the section they just built
    if (token === run) {
      agents.forEach((a) => {
        if (!a.busy) void swimTo(a, a.x + (Math.random() * 80 - 40), a.y + (Math.random() * 50 - 25), token)
      })
    }
  }

  function withSafety(work: Promise<void>) {
    return Promise.race([
      work,
      new Promise<void>((_, reject) => later(() => reject(new Error('agents build: stage timed out')), SAFETY_MS)),
    ])
  }

  function finish(skipped: boolean) {
    if (finished) return
    finished = true
    run++
    io?.disconnect()
    io = null
    clearTimers()
    dropLoader()

    blocks.forEach(el => markBuilt(el, false))
    built = units.length
    overlay.querySelectorAll('.ab-sel, .ab-marquee').forEach(el => el.remove())
    agents.forEach((a, i) => later(() => a.el.classList.add('is-gone'), 200 + i * 40))
    later(() => {
      overlay.replaceChildren()
      root.classList.remove('ab-armed')
    }, 1200)

    const seconds = skipped ? null : Math.round((performance.now() - t0) / 100) / 10
    onChange({ phase: 'done', built, total: units.length, seconds })
  }

  /**
   * `withIntro`: the loader first (first load of the site, replay).
   * `ready`: the page is armed at once, but the cursors only come in once it
   * resolves (after a route change: the page transition is over and the
   * window has scrolled back to the top, so positions are measured right).
   */
  function start(withIntro = false, ready: Promise<void> = Promise.resolve()) {
    stop()
    const token = ++run
    finished = false
    skipping = false
    built = 0
    t0 = performance.now()

    collect()
    const stages = [...root.querySelectorAll<HTMLElement>('[data-build-stage]')]
    if (!blocks.length || !stages.length) return

    // Blocks with their own entrance (v-reveal) are taken over by the build
    settleReveals(root)
    blocks.forEach((el) => {
      el.classList.remove('ab-built', 'ab-building')
      if (el.dataset.buildKind === 'draw') {
        el.classList.add('will-draw')
        el.classList.remove('is-drawn')
      }
    })
    root.classList.add('ab-armed')
    agents = []
    emit()

    const pending = new Set<Element>(stages)
    let chain = ready.then(() => {
      if (token !== run) return
      sizeOverlay()
      makeAgents()
      return withIntro ? intro(token) : undefined
    })
    const queue = (stage: Element) => {
      if (!pending.delete(stage)) return
      chain = chain
        .then(() => (token === run ? withSafety(buildStage(stage, token)) : undefined))
        .then(() => {
          if (token === run && !pending.size) finish(false)
        })
        .catch(() => finish(true))
    }

    const observe = () => {
      if (token !== run) return
      io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          io?.unobserve(entry.target)
          queue(entry.target)
        }
      }, { rootMargin: '0px 0px -12% 0px' })
      stages.forEach(stage => io!.observe(stage))

      // Nothing built at all after a while (observer or timers blocked): show the page
      later(() => {
        if (token === run && built === 0) finish(true)
      }, SAFETY_MS)
    }
    // The intro has its own time limit (pageLoaded): the stages start after it
    chain = chain.then(observe).catch(() => finish(true))
  }

  /** Passer / a key press: everything is shown at once */
  function skip() {
    skipping = true
    finish(true)
  }

  /** Teardown (unmount, route change): the page is left fully visible */
  function stop() {
    run++
    io?.disconnect()
    io = null
    clearTimers()
    dropLoader()
    blocks.forEach(el => markBuilt(el, false))
    root.classList.remove('ab-armed')
    overlay.replaceChildren()
    finished = true
  }

  return {
    start,
    skip,
    stop,
    get running() {
      return !finished
    },
  }
}
