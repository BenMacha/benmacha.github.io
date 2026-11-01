import { settleReveals } from './useScrollReveal'

/**
 * "Built live by agents" intro: labelled cursors build the page block by block,
 * section by section, as each section scrolls into view.
 *
 *   data-build-stage            a section, built when it enters the viewport
 *   data-build                  a block (layer) inside it, shown as a dashed wireframe until built
 *   data-build-kind="text"      typed in: revealed in the reading direction
 *   data-build-kind="draw"      a `v-draw` figure: its branches are drawn when the block is built
 *
 * Nothing is hidden until `start()` adds `ab-armed` to the root on the client, so
 * the server HTML stays complete. Styles: assets/css/agents-build.css.
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

interface Agent { el: HTMLElement, x: number, y: number, busy: boolean }
interface Box { x: number, y: number, w: number, h: number }

export function createAgentsBuild(options: {
  root: HTMLElement
  overlay: HTMLElement
  agentCount: number
  onChange: (state: AgentsBuildState) => void
}) {
  const { root, overlay, onChange } = options
  const crew = AGENTS.slice(0, options.agentCount)
  const timers = new Set<number>()

  let blocks: HTMLElement[] = []
  let agents: Agent[] = []
  let io: IntersectionObserver | null = null
  let run = 0
  let built = 0
  let t0 = 0
  let skipping = false
  let finished = true

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
  function box(el: Element): Box {
    const r = el.getBoundingClientRect()
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height }
  }

  function sizeOverlay() {
    overlay.style.height = `${document.documentElement.scrollHeight}px`
  }

  function place(a: Agent, x: number, y: number) {
    a.x = x
    a.y = y
    a.el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`
  }

  function cursor(color: string) {
    return `<svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true"><path d="M1 1 L1 16 L5 12 L8 19 L11 18 L8 11 L14 11 Z" fill="${color}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`
  }

  function makeAgents() {
    overlay.replaceChildren()
    const width = document.documentElement.clientWidth
    const step = Math.max(24, (width - 120) / crew.length)
    agents = crew.map(([name, color], i) => {
      const el = document.createElement('div')
      el.className = 'ab-agent'
      el.innerHTML = `${cursor(color)}<span style="background:${color}">${name}</span>`
      overlay.appendChild(el)
      const a: Agent = { el, x: 0, y: 0, busy: false }
      place(a, 20 + i * step, window.scrollY + 80 + (i % 3) * 40)
      return a
    })
  }

  function label(el: HTMLElement, b: Box) {
    const cls = [...el.classList].find(c => !c.startsWith('ab-') && !c.includes('draw'))
    return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''} · ${Math.round(b.w)}×${Math.round(b.h)}`
  }

  function markBuilt(el: HTMLElement, animate: boolean) {
    el.classList.add('ab-built')
    if (animate) el.classList.add('ab-building')
    if (el.dataset.buildKind === 'draw') el.classList.add('is-drawn')
  }

  function emit() {
    onChange({ phase: 'building', built, total: blocks.length, seconds: null })
  }

  async function buildBlock(el: HTMLElement, a: Agent, token: number) {
    const b = box(el)
    // Not rendered at this width (display: none): nothing to draw
    if (!b.w && !b.h) {
      markBuilt(el, false)
      built++
      emit()
      return
    }
    a.busy = true
    place(a, b.x + Math.min(24, b.w / 3), b.y + Math.min(14, b.h / 2))
    await sleep(480)
    if (token !== run) return

    const sel = document.createElement('div')
    sel.className = 'ab-sel'
    sel.style.transform = `translate(${Math.round(b.x - 4)}px, ${Math.round(b.y - 4)}px)`
    sel.style.width = `${Math.round(b.w + 8)}px`
    sel.style.height = `${Math.round(b.h + 8)}px`
    sel.innerHTML = '<i></i><i></i><i></i><i></i><b></b>'
    sel.querySelector('b')!.textContent = label(el, b)
    overlay.appendChild(sel)

    markBuilt(el, true)
    // The entrance animation is dropped once played (its final clip-path would clip overflowing glyphs)
    later(() => el.classList.remove('ab-building'), 800)
    // Drag to the far corner, like resizing the layer
    place(a, b.x + b.w - 10, b.y + b.h - 6)
    built++
    emit()

    await sleep(520)
    sel.style.opacity = '0'
    later(() => sel.remove(), 320)
    a.busy = false
  }

  async function buildStage(stage: Element, token: number) {
    sizeOverlay()
    const own = blocks.filter(el => stage.contains(el) && !el.classList.contains('ab-built'))
    let next = 0
    await Promise.all(agents.map(async (a, k) => {
      await sleep(k * 70)
      while (next < own.length && token === run) {
        await buildBlock(own[next++]!, a, token)
        await sleep(60)
      }
    }))
    // Idle agents drift around the section they just built
    if (token === run) {
      agents.forEach((a) => {
        if (!a.busy) place(a, a.x + (Math.random() * 80 - 40), a.y + (Math.random() * 50 - 25))
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

    blocks.forEach(el => markBuilt(el, false))
    built = blocks.length
    overlay.querySelectorAll('.ab-sel').forEach(el => el.remove())
    agents.forEach((a, i) => later(() => a.el.classList.add('is-gone'), 200 + i * 40))
    later(() => {
      overlay.replaceChildren()
      root.classList.remove('ab-armed')
    }, 1200)

    const seconds = skipped ? null : Math.round((performance.now() - t0) / 100) / 10
    onChange({ phase: 'done', built, total: blocks.length, seconds })
  }

  function start() {
    stop()
    const token = ++run
    finished = false
    skipping = false
    built = 0
    t0 = performance.now()

    blocks = [...root.querySelectorAll<HTMLElement>('[data-build]')]
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
    sizeOverlay()
    makeAgents()
    emit()

    const pending = new Set<Element>(stages)
    let chain = Promise.resolve()
    const queue = (stage: Element) => {
      if (!pending.delete(stage)) return
      chain = chain
        .then(() => (token === run ? withSafety(buildStage(stage, token)) : undefined))
        .then(() => {
          if (token === run && !pending.size) finish(false)
        })
        .catch(() => finish(true))
    }

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
