import { settleReveals } from './useScrollReveal'
import type { BuildSound } from './useBuildSound'

/**
 * "Built live by agents": a swarm of multiplayer cursors builds the page block
 * by block, section by section, as each section scrolls into view, the way a
 * team would in a design tool. The real page is built (not a picture of it), so
 * it stays clickable; the cursors live in an overlay that ignores the pointer.
 *
 *   data-build-stage            a section, built when it enters the viewport
 *   data-build                  a block (layer) inside it, a dashed wireframe until built
 *   data-build-kind="text"      typed: a text box is dragged, then typed letter by letter
 *   data-build-kind="draw"      a `v-draw` figure: drawn with the pen tool
 *   data-build-split="N"        a long container (article body, card grid): its children are
 *                               built in N consecutive groups; each group after the first is
 *                               duplicated from the previous one (alt-drag, red spacing)
 *   data-build-troll            once its section is built, a "critic" cursor vandalises this block
 *                               (struck text, garish colours, a 1/5 rating), then two agents fix it
 *
 * Other blocks are drawn with the crosshair: a frame with handles and a live
 * "W × H" badge over a grey placeholder, then the block fades in.
 *
 * Nothing is hidden until `start()` adds `ab-armed` to the root on the client, so
 * the server HTML stays complete. Styles: assets/css/agents-build.css.
 *
 * Intro: on opening the site (and on replay) the cursors swim around the site
 * mark until the page is fully loaded, make a last lap and fan out; after a route
 * change they swirl briefly in the middle, without the mark. At the end they
 * flock around the mouse, then fade away.
 *
 * Motion and sounds are written for this site; the idea comes from Swarm by
 * Joel Califa (https://califa.github.io/swarm-site/).
 */

export const AGENT_COLORS = [
  '#ec3b33', '#7bc313', '#3d8bff', '#b06ad9', '#f5a524', '#14b8a6', '#e8467c', '#2496ed',
  '#ff7a1a', '#41b883', '#9b7bff', '#0bc5ea', '#e0533d', '#00b37a', '#d97757', '#38bdf8',
]

/** A stage that takes longer than this is considered stuck: everything is revealed. */
const SAFETY_MS = 9000
/** Swarming around the mouse once the page is built */
const FLOCK_MS = 2600

export interface AgentsBuildState {
  phase: 'building' | 'done'
  built: number
  total: number
  /** Build time, once done (null when skipped) */
  seconds: number | null
}

type Shape = 'arrow' | 'cross' | 'beam' | 'pen'

interface Agent {
  el: HTMLElement
  icon: HTMLElement
  tag: HTMLElement
  color: string
  shape: Shape
  x: number
  y: number
  /** Velocity (px/s) while swimming in the school */
  vx: number
  vy: number
  busy: boolean
}

interface Box { x: number, y: number, w: number, h: number }

/** The arrow points up-left: its heading at rest */
const REST_HEADING = Math.atan2(-1, -1)

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const easeOut = (t: number) => 1 - (1 - t) ** 3

function shapeSvg(shape: Shape, color: string) {
  switch (shape) {
    case 'cross':
      return `<svg width="17" height="17" viewBox="-8.5 -8.5 17 17" class="ab-icon--cross" aria-hidden="true"><path d="M0 -7V7M-7 0H7" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M0 -7V7M-7 0H7" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/></svg>`
    case 'beam':
      return `<svg width="10" height="20" viewBox="-5 -10 10 20" class="ab-icon--beam" aria-hidden="true"><path d="M-3 -8.5H3M0 -8.5V8.5M-3 8.5H3" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/><path d="M-3 -8.5H3M0 -8.5V8.5M-3 8.5H3" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/></svg>`
    case 'pen':
      return `<svg width="18" height="18" viewBox="0 0 18 18" class="ab-icon--pen" aria-hidden="true"><path d="M1 17 L3 10 L11 2 L16 7 L8 15 Z" fill="${color}" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/><circle cx="5.4" cy="12.6" r="1.3" fill="#fff"/></svg>`
    default:
      return `<svg width="15" height="17" viewBox="0 0 15 17" class="ab-icon--arrow" aria-hidden="true"><path d="M1 1 L1 13.5 L4.6 10.2 L7.2 15.6 L9.5 14.6 L7 9.3 L11.8 9.3 Z" fill="${color}" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></svg>`
  }
}

export function createAgentsBuild(options: {
  root: HTMLElement
  overlay: HTMLElement
  agentCount: number
  onChange: (state: AgentsBuildState) => void
  /** Site mark (HTML) in the middle of the loader */
  icon: string
  labels: Record<'loading' | 'troll' | 'trolling' | 'fix' | 'rating', string>
  sound: BuildSound | null
}) {
  const { root, overlay, onChange, labels } = options
  const colors = AGENT_COLORS.slice(0, options.agentCount)
  const timers = new Set<number>()
  const sound = options.sound

  /** Every hidden element, and the layers (groups of elements) the agents build */
  let blocks: HTMLElement[] = []
  let units: HTMLElement[][] = []
  /** For the groups of a split container: the group it is duplicated from */
  let masters = new Map<HTMLElement[], HTMLElement[]>()
  let agents: Agent[] = []
  let io: IntersectionObserver | null = null
  let run = 0
  let built = 0
  let t0 = 0
  let skipping = false
  let finished = true
  let loader: HTMLElement | null = null
  let rulers: HTMLElement | null = null
  let frame = 0
  let speed = 1
  let pointer: { x: number, y: number } | null = null
  /** Cursors still swimming in the school: each one leaves it when it gets a block */
  const school = new Set<Agent>()
  /** Stages that already showed a guide */
  const guided = new Set<Element>()

  function later(fn: () => void, ms: number) {
    const id = window.setTimeout(() => {
      timers.delete(id)
      fn()
    }, ms)
    timers.add(id)
  }

  const sleep = (ms: number) => new Promise<void>(resolve => later(resolve, skipping ? 0 : ms / speed))

  function clearTimers() {
    timers.forEach(id => window.clearTimeout(id))
    timers.clear()
  }

  /** Runs `step(eased progress)` every frame for `ms`; resolves early when stopped */
  function tween(ms: number, token: number, step: (e: number, p: number) => void, ease = easeInOut) {
    const duration = ms / speed
    if (skipping || duration < 16) {
      step(1, 1)
      return Promise.resolve()
    }
    const start = performance.now()
    return new Promise<void>((resolve) => {
      const tick = (now: number) => {
        if (token !== run) return resolve()
        const p = Math.min(1, (now - start) / duration)
        step(ease(p), p)
        if (p < 1) requestAnimationFrame(tick)
        else resolve()
      }
      requestAnimationFrame(tick)
    })
  }

  /** Document coordinates */
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
    masters = new Map()
    for (const container of splits) {
      const children = [...container.children] as HTMLElement[]
      const groups = Math.max(1, Math.min(Number(container.dataset.buildSplit) || 4, children.length))
      const size = Math.ceil(children.length / groups)
      let previous: HTMLElement[] | null = null
      for (let i = 0; i < children.length; i += size) {
        const group = children.slice(i, i + size)
        group.forEach(el => el.setAttribute('data-build', ''))
        found.push(group)
        if (previous) masters.set(group, previous)
        previous = group
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

  const rtl = () => document.documentElement.dir === 'rtl'

  // ------------------------------------------------------------------ cursors

  function place(a: Agent, x: number, y: number) {
    a.x = x
    a.y = y
    a.el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`
  }

  /** Points the arrow along a heading (radians), or back to rest */
  function head(a: Agent, heading: number | null) {
    a.icon.style.transform = heading == null || a.shape !== 'arrow' ? '' : `rotate(${heading - REST_HEADING}rad)`
  }

  function setShape(a: Agent, shape: Shape) {
    if (a.shape === shape) return
    a.shape = shape
    a.icon.innerHTML = shapeSvg(shape, a.color)
    a.el.dataset.shape = shape
    head(a, null)
  }

  function makeAgent(color: string, label = ''): Agent {
    const el = document.createElement('div')
    el.className = 'ab-agent'
    el.dataset.shape = 'arrow'
    el.innerHTML = `<span class="ab-agent__icon">${shapeSvg('arrow', color)}</span><span class="ab-agent__tag"></span>`
    const tag = el.querySelector<HTMLElement>('.ab-agent__tag')!
    tag.style.background = color
    tag.textContent = label
    overlay.appendChild(el)
    return {
      el,
      icon: el.querySelector('.ab-agent__icon')!,
      tag,
      color,
      shape: 'arrow',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      busy: false,
    }
  }

  function makeAgents() {
    overlay.replaceChildren()
    agents = colors.map(color => makeAgent(color))
  }

  /**
   * Swims like a fish to (x, y): a curved path with a light side-to-side wiggle
   * that fades on arrival, the arrow turned along the way. Leaving the school,
   * the path starts in the direction the cursor was swimming.
   */
  function swimTo(a: Agent, x: number, y: number, token: number) {
    const momentum = school.delete(a) ? Math.hypot(a.vx, a.vy) : 0
    setShape(a, 'arrow')
    const [x0, y0] = [a.x, a.y]
    const dx = x - x0
    const dy = y - y0
    const dist = Math.hypot(dx, dy)
    if (dist < 4 || skipping) {
      place(a, x, y)
      return Promise.resolve()
    }
    const ms = Math.min(1000, 320 + dist * 0.8)
    let cx: number
    let cy: number
    if (momentum > 1) {
      const reach = Math.min(220, dist * 0.45)
      cx = x0 + (a.vx / momentum) * reach
      cy = y0 + (a.vy / momentum) * reach
    }
    else {
      const bend = (Math.random() < 0.5 ? -1 : 1) * Math.min(140, dist * 0.3)
      cx = x0 + dx / 2 + (-dy / dist) * bend
      cy = y0 + dy / 2 + (dx / dist) * bend
    }
    const waves = Math.max(1, Math.round(dist / 180))
    const amp = Math.min(7, dist / 36)
    a.el.classList.add('is-swim')
    return tween(ms, token, (e) => {
      const u = 1 - e
      const bx = u * u * x0 + 2 * u * e * cx + e * e * x
      const by = u * u * y0 + 2 * u * e * cy + e * e * y
      const tx = 2 * u * (cx - x0) + 2 * e * (x - cx)
      const ty = 2 * u * (cy - y0) + 2 * e * (y - cy)
      const tl = Math.hypot(tx, ty) || 1
      const wiggle = Math.sin(e * Math.PI * 2 * waves) * amp * (1 - e)
      place(a, bx - (ty / tl) * wiggle, by + (tx / tl) * wiggle)
      head(a, e < 0.85 ? Math.atan2(ty, tx) : null)
    }).then(() => {
      a.el.classList.remove('is-swim')
      place(a, x, y)
      head(a, null)
    })
  }

  // ------------------------------------------------------------ rulers, frames

  /** Design-tool rulers along the top and the left edge while the page is built */
  function showRulers() {
    if (rulers) return
    rulers = document.createElement('div')
    rulers.className = 'ab-rulers'
    rulers.innerHTML = '<div class="ab-rulers__top"></div><div class="ab-rulers__left"></div>'
    const top = rulers.firstElementChild as HTMLElement
    const width = document.documentElement.clientWidth
    for (let x = 100; x < width; x += 100) {
      const n = document.createElement('span')
      n.style.left = `${x}px`
      n.textContent = String(x)
      top.appendChild(n)
    }
    document.body.appendChild(rulers)
    updateLeftRuler()
    requestAnimationFrame(() => rulers?.classList.add('is-on'))
    window.addEventListener('scroll', onScroll, { passive: true })
  }

  let scrollFrame = 0
  function onScroll() {
    cancelAnimationFrame(scrollFrame)
    scrollFrame = requestAnimationFrame(updateLeftRuler)
  }

  /** Numbers of the left ruler follow the scroll (document coordinates) */
  function updateLeftRuler() {
    const left = rulers?.lastElementChild as HTMLElement | undefined
    if (!left) return
    const y0 = window.scrollY
    left.style.backgroundPositionY = `${-y0 % 100}px`
    left.replaceChildren()
    for (let y = Math.ceil(y0 / 100) * 100; y < y0 + window.innerHeight; y += 100) {
      if (y === 0) continue
      const n = document.createElement('span')
      n.style.top = `${y - y0}px`
      n.textContent = String(y)
      left.appendChild(n)
    }
  }

  function hideRulers() {
    window.removeEventListener('scroll', onScroll)
    const r = rulers
    rulers = null
    if (!r) return
    r.classList.remove('is-on')
    window.setTimeout(() => r.remove(), 500)
  }

  /** A selection frame with handles and a size badge, in document coordinates */
  function makeFrame(kind: 'draw' | 'text' | 'select' | 'ghost') {
    const el = document.createElement('div')
    el.className = `ab-frame ab-frame--${kind}`
    el.innerHTML = '<i></i><i></i><i></i><i></i><b></b>'
    overlay.appendChild(el)
    const badge = el.querySelector('b')!
    const set = (x: number, y: number, w: number, h: number, size = true) => {
      el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`
      el.style.width = `${Math.max(0, Math.round(w))}px`
      el.style.height = `${Math.max(0, Math.round(h))}px`
      if (size) badge.textContent = `${Math.round(w)} × ${Math.round(h)}`
    }
    const drop = (delay = 0) => later(() => {
      el.classList.add('is-out')
      later(() => el.remove(), 300)
    }, delay)
    return { el, set, drop }
  }

  // ------------------------------------------------------------------- blocks

  function markBuilt(el: HTMLElement, animate: boolean) {
    el.classList.add('ab-built')
    if (animate) {
      el.classList.add('ab-building')
      later(() => el.classList.remove('ab-building'), 700)
    }
    if (el.dataset.buildKind === 'draw') el.classList.add('is-drawn')
  }

  function placed(unit: HTMLElement[], b: Box, animate = true) {
    unit.forEach(el => markBuilt(el, animate))
    built++
    emit()
    sound?.note(b.x, b.w, b.h)
  }

  function emit() {
    onChange({ phase: 'building', built, total: units.length, seconds: null })
  }

  /** Crosshair: press, drag a frame from corner to corner over a grey placeholder, release */
  async function drawRect(unit: HTMLElement[], b: Box, a: Agent, token: number) {
    const [sx, ex] = rtl() ? [b.x + b.w, b.x] : [b.x, b.x + b.w]
    await swimTo(a, sx, b.y, token)
    if (token !== run) return
    setShape(a, 'cross')
    sound?.press(sx)
    const f = makeFrame('draw')
    const ms = clamp(260 + Math.sqrt(b.w * b.h) * 0.6, 280, 720)
    await tween(ms, token, (e) => {
      const w = b.w * e
      const h = b.h * e
      f.set(rtl() ? sx - w : sx, b.y, w, h)
      place(a, lerp(sx, ex, e), b.y + h)
    }, easeOut)
    if (token !== run) return
    sound?.release(ex)
    placed(unit, b)
    f.el.classList.add('is-filled')
    await sleep(260)
    f.drop()
    setShape(a, 'arrow')
  }

  /** Lines of text of a block, in document coordinates, top to bottom */
  function textLines(el: HTMLElement): Box[] {
    const range = document.createRange()
    range.selectNodeContents(el)
    const lines: Box[] = []
    for (const r of range.getClientRects()) {
      if (r.width < 1 || r.height < 1) continue
      const y = r.top + window.scrollY
      const x = r.left + window.scrollX
      const line = lines.find(l => Math.abs(l.y + l.h / 2 - (y + r.height / 2)) < Math.max(4, r.height / 3))
      if (line) {
        const right = Math.max(line.x + line.w, x + r.width)
        const bottom = Math.max(line.y + line.h, y + r.height)
        line.x = Math.min(line.x, x)
        line.y = Math.min(line.y, y)
        line.w = right - line.x
        line.h = bottom - line.y
      }
      else {
        lines.push({ x, y, w: r.width, h: r.height })
      }
    }
    return lines.sort((p, q) => p.y - q.y)
  }

  /** A red guide dragged out of the left ruler to the text's edge, which snaps on it */
  async function dragGuide(stage: Element, x: number, a: Agent, token: number) {
    const s = box([stage])
    const guide = document.createElement('div')
    guide.className = 'ab-guide'
    guide.style.top = `${s.y - 40}px`
    guide.style.height = `${s.h + 80}px`
    overlay.appendChild(guide)
    const from = window.scrollX + 10
    const y = clamp(a.y, window.scrollY + 40, window.scrollY + window.innerHeight - 40)
    await swimTo(a, from, y, token)
    if (token !== run) return guide
    sound?.press(from)
    await tween(380, token, (e) => {
      const gx = lerp(from, x, e)
      guide.style.transform = `translateX(${Math.round(gx)}px)`
      place(a, gx, y)
    })
    sound?.snap(x)
    guide.classList.add('is-set')
    return guide
  }

  /** Text: drag a text box, then type it letter by letter with a caret */
  async function typeText(unit: HTMLElement[], b: Box, a: Agent, token: number, stage: Element) {
    const el = unit[0]!
    let guide: HTMLElement | null = null
    if (!guided.has(stage) && b.w > 120) {
      guided.add(stage)
      guide = await dragGuide(stage, rtl() ? b.x + b.w : b.x, a, token)
      if (token !== run) return
    }
    const [sx, ex] = rtl() ? [b.x + b.w, b.x] : [b.x, b.x + b.w]
    await swimTo(a, sx, b.y, token)
    if (token !== run) return
    setShape(a, 'cross')
    sound?.press(sx)
    const f = makeFrame('text')
    await tween(220, token, (e) => {
      f.set(rtl() ? sx - b.w * e : sx, b.y, b.w * e, b.h * Math.min(1, e * 1.3))
      place(a, lerp(sx, ex, e), b.y + b.h * Math.min(1, e * 1.3))
    }, easeOut)
    if (token !== run) return
    sound?.release(ex)
    setShape(a, 'beam')

    const lines = textLines(el)
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
    unit.forEach(u => markBuilt(u, false))
    if (!lines.length || !text) {
      placed([], b)
      f.drop(200)
      return
    }
    const er = box([el])
    const total = lines.reduce((sum, l) => sum + l.w, 0)
    const caret = document.createElement('div')
    caret.className = 'ab-caret'
    caret.style.background = a.color
    overlay.appendChild(caret)
    const pad = 6
    let typed = -1
    const ms = clamp(text.length * 16, 320, 1500)
    await tween(ms, token, (_e, p) => {
      // Typing goes at an even pace: no easing
      let left = p * total
      let k = 0
      while (k < lines.length - 1 && left > lines[k]!.w) {
        left -= lines[k]!.w
        k++
      }
      const line = lines[k]!
      const cx = rtl() ? line.x + line.w - left : line.x + left
      const rx = cx - er.x
      const top = line.y - er.y
      const bottom = top + line.h
      const W = er.w
      el.style.clipPath = rtl()
        ? `polygon(${-pad}px ${-pad}px, ${W + pad}px ${-pad}px, ${W + pad}px ${bottom}px, ${rx}px ${bottom}px, ${rx}px ${top}px, ${-pad}px ${top}px)`
        : `polygon(${-pad}px ${-pad}px, ${W + pad}px ${-pad}px, ${W + pad}px ${top}px, ${rx}px ${top}px, ${rx}px ${bottom}px, ${-pad}px ${bottom}px)`
      caret.style.transform = `translate(${Math.round(cx)}px, ${Math.round(line.y)}px)`
      caret.style.height = `${Math.round(line.h)}px`
      place(a, cx + (rtl() ? -6 : 6), line.y + line.h * 0.55)
      const chars = Math.floor(p * text.length)
      if (chars !== typed) {
        typed = chars
        sound?.key(cx, text[chars] === ' ')
      }
    }, t => t)
    el.style.clipPath = ''
    caret.remove()
    if (token !== run) return
    placed([], b)
    f.drop(120)
    if (guide) {
      const g = guide
      later(() => {
        g.classList.add('is-out')
        later(() => g.remove(), 400)
      }, 500)
    }
    setShape(a, 'arrow')
  }

  /** Figures: the pen goes around the block while its lines are drawn */
  async function penDraw(unit: HTMLElement[], b: Box, a: Agent, token: number) {
    await swimTo(a, b.x, b.y, token)
    if (token !== run) return
    setShape(a, 'pen')
    const f = makeFrame('select')
    f.set(b.x, b.y, b.w, b.h, false)
    sound?.press(b.x)
    placed(unit, b, false)
    const corners: [number, number][] = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h], [b.x, b.y]]
    await tween(900, token, (e) => {
      const seg = Math.min(3, Math.floor(e * 4))
      const t = e * 4 - seg
      const [x0, y0] = corners[seg]!
      const [x1, y1] = corners[seg + 1]!
      place(a, lerp(x0, x1, t), lerp(y0, y1, t))
    }, t => t)
    sound?.release(b.x)
    f.drop(150)
    setShape(a, 'arrow')
  }

  /** Duplicate: select the previous group, alt-drag a copy into place, red spacing measured */
  async function duplicate(unit: HTMLElement[], b: Box, master: HTMLElement[], a: Agent, token: number) {
    const mb = box(master)
    if (!mb.w) return drawRect(unit, b, a, token)
    const grab = { x: mb.x + mb.w / 2, y: mb.y + Math.min(mb.h / 2, 30) }
    await swimTo(a, grab.x, grab.y, token)
    if (token !== run) return
    const sel = makeFrame('select')
    sel.set(mb.x, mb.y, mb.w, mb.h, false)
    sound?.press(grab.x)
    await sleep(120)
    const ghost = makeFrame('ghost')
    const measure = document.createElement('div')
    measure.className = 'ab-measure'
    measure.innerHTML = '<b></b>'
    overlay.appendChild(measure)
    const below = b.y >= mb.y + mb.h - 2
    await tween(520, token, (e) => {
      const gx = lerp(mb.x, b.x, e)
      const gy = lerp(mb.y, b.y, e)
      const gw = lerp(mb.w, b.w, e)
      const gh = lerp(mb.h, b.h, e)
      ghost.set(gx, gy, gw, gh, false)
      place(a, gx + (grab.x - mb.x), gy + (grab.y - mb.y))
      if (below) {
        const gap = Math.max(0, gy - (mb.y + mb.h))
        measure.className = 'ab-measure is-v'
        measure.style.transform = `translate(${Math.round(gx + gw / 2)}px, ${Math.round(mb.y + mb.h)}px)`
        measure.style.width = ''
        measure.style.height = `${Math.round(gap)}px`
        measure.firstElementChild!.textContent = String(Math.round(gap))
      }
      else {
        const gap = Math.max(0, gx - (mb.x + mb.w))
        measure.className = 'ab-measure is-h'
        measure.style.transform = `translate(${Math.round(mb.x + mb.w)}px, ${Math.round(gy + gh / 2)}px)`
        measure.style.height = ''
        measure.style.width = `${Math.round(gap)}px`
        measure.firstElementChild!.textContent = String(Math.round(gap))
      }
    })
    if (token !== run) return
    sound?.release(b.x)
    sound?.snap(b.x)
    placed(unit, b)
    await sleep(240)
    sel.drop()
    ghost.drop()
    measure.classList.add('is-out')
    later(() => measure.remove(), 300)
  }

  async function buildBlock(unit: HTMLElement[], a: Agent, token: number, stage: Element) {
    const b = box(unit)
    // Not rendered at this width (display: none): nothing to draw
    if (!b.w && !b.h) {
      unit.forEach(el => markBuilt(el, false))
      built++
      emit()
      return
    }
    a.busy = true
    const kind = unit[0]!.dataset.buildKind
    const master = masters.get(unit)
    if (kind === 'text' && unit.length === 1) await typeText(unit, b, a, token, stage)
    else if (kind === 'draw') await penDraw(unit, b, a, token)
    else if (master && master.every(el => el.classList.contains('ab-built'))) await duplicate(unit, b, master, a, token)
    else await drawRect(unit, b, a, token)
    a.busy = false
  }

  async function buildStage(stage: Element, token: number) {
    sizeOverlay()
    const own = units.filter(unit => stage.contains(unit[0]!) && !unit[0]!.classList.contains('ab-built'))
    let next = 0
    await Promise.all(agents.map(async (a, k) => {
      // Straight from the school; otherwise a short stagger
      if (!school.has(a)) await sleep(k * 45)
      while (next < own.length && token === run) {
        const unit = own[next++]!
        // A duplicate waits for its master (built by another cursor)
        const master = masters.get(unit)
        for (let i = 0; master && i < 40 && token === run && !master.every(el => el.classList.contains('ab-built')); i++) await sleep(50)
        await buildBlock(unit, a, token, stage)
        await sleep(40)
      }
    }))
    // Idle cursors drift around the section they just built
    if (token === run) {
      agents.forEach((a) => {
        if (!a.busy) void swimTo(a, a.x + (Math.random() * 120 - 60), a.y + (Math.random() * 70 - 35), token)
      })
    }
  }

  // --------------------------------------------------------------- the critic

  /**
   * The critic: a cursor comes in, strikes the text of the block, paints it in
   * garish colours and pins a 1/5 rating on it; two agents then fix the block
   * and the critic swims away. The block is left exactly as it was.
   */
  async function troll(block: HTMLElement, token: number) {
    const b = box([block])
    if (!b.w || !b.h) return
    const critic = makeAgent('#ff2bd6', `${labels.troll} · ${labels.trolling}`)
    critic.el.classList.add('ab-agent--troll')
    place(critic, document.documentElement.clientWidth + 40, b.y - 60)
    await sleep(60)
    await swimTo(critic, b.x + b.w * 0.25, b.y + 20, token)
    if (token !== run) return

    block.classList.add('ab-troll-strike')
    sound?.press(b.x)
    await tween(650, token, e => place(critic, lerp(b.x + b.w * 0.25, b.x + b.w * 0.8, e), lerp(b.y + 20, b.y + b.h * 0.6, e)))
    if (token !== run) return
    block.classList.add('ab-troll-paint')
    sound?.release(b.x + b.w)
    await swimTo(critic, b.x + b.w - 30, b.y + 14, token)
    if (token !== run) return

    const sticker = document.createElement('div')
    sticker.className = 'ab-rating'
    sticker.innerHTML = '<span class="ab-rating__stars">★<i>★★★★</i></span>'
    sticker.append(labels.rating)
    sticker.style.transform = `translate(${Math.round(b.x + b.w - 40)}px, ${Math.round(b.y - 22)}px)`
    overlay.appendChild(sticker)
    sound?.snap(b.x + b.w)
    await sleep(1600)
    if (token !== run) return

    // Two agents come and fix it
    const fixers = agents.filter(a => !a.busy).slice(0, 2)
    fixers.forEach((a) => {
      a.busy = true
      a.tag.textContent = labels.fix
      a.el.classList.add('has-tag')
    })
    critic.tag.textContent = labels.troll
    void swimTo(critic, document.documentElement.clientWidth + 60, b.y - 120, token)
    await Promise.all(fixers.map((a, k) => swimTo(a, k ? b.x + b.w - 30 : b.x + 20, k ? b.y + 14 : b.y + b.h - 20, token)))
    if (token !== run) return
    sticker.classList.add('is-torn')
    block.classList.remove('ab-troll-paint')
    sound?.press(b.x)
    await sleep(380)
    block.classList.remove('ab-troll-strike')
    sound?.note(b.x, b.w, b.h)
    await sleep(500)
    sticker.remove()
    critic.el.remove()
    fixers.forEach((a) => {
      a.el.classList.remove('has-tag')
      a.busy = false
    })
  }

  function untroll() {
    root.querySelectorAll('.ab-troll-strike, .ab-troll-paint')
      .forEach(el => el.classList.remove('ab-troll-strike', 'ab-troll-paint'))
  }

  // -------------------------------------------------------------------- swarm

  /**
   * A school of fish: each cursor steers toward its spot in a stream circling
   * (cx, cy), keeps its distance from its neighbours and from the centre, and
   * swims at a bounded speed with a slight wobble. `target()` can move the centre.
   */
  function schoolSwim(token: number, centre: () => { x: number, y: number }, radius: number) {
    let phase = 0
    let pace = 0.8
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      phase += pace * dt
      const { x: cx, y: cy } = centre()
      agents.forEach((a, i) => {
        if (!school.has(a)) return
        const lag = i * (Math.PI * 2 / Math.max(agents.length, 6)) * 0.7
        const r = radius + Math.sin(phase * 1.7 + i) * 12 + ((i % 3) - 1) * 9
        const tx = cx + Math.cos(phase - lag) * r
        const ty = cy + Math.sin(phase - lag) * r * 0.82
        let ax = (tx - a.x) * 5 - a.vx * 1.6
        let ay = (ty - a.y) * 5 - a.vy * 1.6
        for (const b of school) {
          if (b === a) continue
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > 0 && d2 < 900) {
            ax += (dx / d2) * 3600
            ay += (dy / d2) * 3600
          }
        }
        const mx = a.x - cx
        const my = a.y - cy
        const md = Math.hypot(mx, my) || 1
        if (md < radius * 0.55) {
          ax += (mx / md) * 900
          ay += (my / md) * 900
        }
        ax += Math.sin(now / 260 + i * 1.3) * 40
        ay += Math.cos(now / 310 + i * 0.7) * 40
        a.vx += ax * dt
        a.vy += ay * dt
        const v = Math.hypot(a.vx, a.vy)
        const max = 120 + pace * 260
        if (v > max) {
          a.vx *= max / v
          a.vy *= max / v
        }
        place(a, a.x + a.vx * dt, a.y + a.vy * dt)
        if (v > 8) head(a, Math.atan2(a.vy, a.vx))
      })
      if (token === run && school.size) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return {
      /** One last, faster lap */
      lap(ms: number) {
        const from = phase
        pace = 2.4
        const t1 = performance.now()
        return new Promise<void>((resolve) => {
          const wait = (now: number) => {
            if (token !== run || skipping || phase - from >= Math.PI * 2 || now - t1 > ms) return resolve()
            requestAnimationFrame(wait)
          }
          requestAnimationFrame(wait)
        })
      },
    }
  }

  function gather(cx: number, cy: number, spread: number) {
    agents.forEach((a, i) => {
      a.el.classList.add('is-swim')
      const t = (i / agents.length) * Math.PI * 2
      place(a, cx + Math.cos(t) * spread, cy + Math.sin(t) * spread)
      a.vx = -Math.sin(t) * 90
      a.vy = Math.cos(t) * 90
      school.add(a)
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

  /**
   * Intro. With the mark (opening the site, replay): a loader with the site mark,
   * the school circling it until the page is loaded. Without it (route change):
   * a short swirl in the middle of the screen. Then a last lap and they fan out.
   */
  async function intro(token: number, withMark: boolean) {
    const small = window.innerWidth < 640
    const radius = withMark ? (small ? 78 : 112) : (small ? 60 : 90)
    const cx = document.documentElement.clientWidth / 2
    const cy = window.scrollY + window.innerHeight / 2
    if (withMark) {
      loader = document.createElement('div')
      loader.className = 'ab-loader'
      loader.innerHTML = `<div class="ab-loader__mark">${options.icon}</div><p class="ab-loader__text">${labels.loading}</p>`
      document.body.appendChild(loader)
      document.documentElement.classList.add('ab-loading')
    }
    gather(cx, cy, radius + 40)
    sound?.swell()
    const swim = schoolSwim(token, () => ({ x: cx, y: cy }), radius)

    await (withMark ? pageLoaded(1400) : sleep(450))
    if (token !== run) return
    await swim.lap(withMark ? 1300 : 700)
    if (token !== run) return

    if (loader) {
      loader.classList.add('is-out')
      const gone = loader
      later(() => gone.remove(), 600)
      loader = null
    }
    document.documentElement.classList.remove('ab-loading')
    sound?.arpeggio()
    t0 = performance.now()
  }

  function dropLoader() {
    cancelAnimationFrame(frame)
    school.clear()
    loader?.remove()
    loader = null
    document.documentElement.classList.remove('ab-loading')
  }

  function onPointer(e: PointerEvent) {
    pointer = { x: e.clientX + window.scrollX, y: e.clientY + window.scrollY }
  }

  /** Finale: the swarm gathers around the mouse (or the middle of the screen), then fades */
  function flockToPointer(token: number) {
    agents.forEach((a) => {
      a.busy = false
      school.add(a)
    })
    const centre = () => pointer && pointer.y > window.scrollY && pointer.y < window.scrollY + window.innerHeight
      ? pointer
      : { x: document.documentElement.clientWidth / 2, y: window.scrollY + window.innerHeight / 2 }
    schoolSwim(token, centre, 46)
  }

  // ---------------------------------------------------------------- lifecycle

  function withSafety(work: Promise<void>) {
    return Promise.race([
      work,
      new Promise<void>((_, reject) => later(() => reject(new Error('agents build: stage timed out')), SAFETY_MS)),
    ])
  }

  function cleanup() {
    untroll()
    blocks.forEach((el) => {
      el.style.clipPath = ''
      markBuilt(el, false)
    })
    overlay.querySelectorAll('.ab-frame, .ab-caret, .ab-guide, .ab-measure, .ab-rating, .ab-agent--troll').forEach(el => el.remove())
  }

  function finish(skipped: boolean) {
    if (finished) return
    finished = true
    io?.disconnect()
    io = null
    clearTimers()
    dropLoader()
    cleanup()
    built = units.length
    hideRulers()
    const token = ++run
    const seconds = skipped ? null : Math.round((performance.now() - t0) / 100) / 10
    onChange({ phase: 'done', built, total: units.length, seconds })

    if (!skipped) {
      sound?.chord()
      flockToPointer(token)
    }
    // The swarm fades away
    later(() => {
      agents.forEach((a, i) => later(() => a.el.classList.add('is-gone'), i * 30))
      later(() => {
        if (token !== run) return
        cancelAnimationFrame(frame)
        school.clear()
        overlay.replaceChildren()
        root.classList.remove('ab-armed')
      }, 900)
    }, skipped ? 100 : FLOCK_MS)
    if (skipped) root.classList.remove('ab-armed')
  }

  /**
   * `withIntro`: the loader with the site mark first (opening the site, replay);
   * otherwise a short swirl without it (route change).
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
    guided.clear()
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
    window.addEventListener('pointermove', onPointer, { passive: true })

    const pending = new Set<Element>(stages)
    let chain = ready.then(() => {
      if (token !== run) return
      sizeOverlay()
      makeAgents()
      showRulers()
      return intro(token, withIntro)
    })
    const queue = (stage: Element) => {
      if (!pending.delete(stage)) return
      chain = chain
        .then(() => (token === run ? withSafety(buildStage(stage, token)) : undefined))
        .then(() => {
          const target = stage.querySelector<HTMLElement>('[data-build-troll]')
          return target && token === run && !skipping ? troll(target, token) : undefined
        })
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
    cleanup()
    hideRulers()
    window.removeEventListener('pointermove', onPointer)
    root.classList.remove('ab-armed')
    overlay.replaceChildren()
    finished = true
  }

  return {
    start,
    skip,
    stop,
    /** Build speed: 1, 2 or 3 */
    setSpeed(n: number) {
      speed = clamp(n, 1, 3)
    },
    get running() {
      return !finished
    },
  }
}
