/**
 * Shared plumbing for the mini-games of the arcade section.
 */

// ---------------------------------------------------------------------------
// Only one game may run at a time: starting a game stops every other one.
// ---------------------------------------------------------------------------
const stoppers = new Map<symbol, () => void>()

export function useArcadeSlot(stop: () => void) {
  const id = Symbol('game')
  stoppers.set(id, stop)

  onBeforeUnmount(() => {
    stop()
    stoppers.delete(id)
  })

  /** Call when this game starts: pauses all the others. */
  function claim() {
    for (const [other, stopOther] of stoppers) {
      if (other !== id) stopOther()
    }
  }

  return { claim }
}

// ---------------------------------------------------------------------------
// Fixed-timestep loop: game speed is independent from the display refresh rate.
// `step` returns false to end the loop.
// ---------------------------------------------------------------------------
export function useFixedLoop(step: () => boolean | void, draw: () => void, hz = 60) {
  const frame = 1000 / hz
  let raf = 0
  let last = 0
  let acc = 0

  function tick(now: number) {
    acc += Math.min(now - last, 250)
    last = now
    while (acc >= frame) {
      acc -= frame
      if (step() === false) {
        draw()
        raf = 0
        return
      }
    }
    draw()
    raf = requestAnimationFrame(tick)
  }

  function start() {
    stop()
    last = performance.now()
    acc = 0
    raf = requestAnimationFrame(tick)
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  onBeforeUnmount(stop)
  return { start, stop }
}

// ---------------------------------------------------------------------------
// Keyboard: calls `onKey` for keydown while `active()` is true and tracks held
// keys (for games with continuous movement). Arrow keys and space are
// prevented from scrolling the page while playing.
// ---------------------------------------------------------------------------
const GAME_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '])

export function useGameKeys(active: () => boolean, onKey?: (key: string, repeat: boolean) => void) {
  const held = new Set<string>()

  function down(event: KeyboardEvent) {
    if (!active()) return
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
    if (GAME_KEYS.has(key)) event.preventDefault()
    held.add(key)
    onKey?.(key, event.repeat)
  }

  function up(event: KeyboardEvent) {
    held.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key)
  }

  onMounted(() => {
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', down)
    window.removeEventListener('keyup', up)
  })

  return { held }
}

// ---------------------------------------------------------------------------
// Pointer position in canvas coordinates (mouse and touch).
// ---------------------------------------------------------------------------
export function usePointer(canvas: Ref<HTMLCanvasElement | null>) {
  const pointer = { x: 0, y: 0, active: false }

  function move(event: PointerEvent) {
    const el = canvas.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * el.width
    pointer.y = ((event.clientY - rect.top) / rect.height) * el.height
    pointer.active = true
  }

  return { pointer, onPointerMove: move }
}

// ---------------------------------------------------------------------------
// Touch: swipe in one of 4 directions, or tap. Bind the returned handlers to
// the canvas (which has `touch-action: none`, so swipes don't scroll the page).
// ---------------------------------------------------------------------------
export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

export function useSwipe(onSwipe: (direction: SwipeDirection) => void, onTap?: () => void, threshold = 24) {
  let startX = 0
  let startY = 0

  function onPointerdown(event: PointerEvent) {
    startX = event.clientX
    startY = event.clientY
  }

  function onPointerup(event: PointerEvent) {
    const dx = event.clientX - startX
    const dy = event.clientY - startY
    if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) {
      onTap?.()
      return
    }
    if (Math.abs(dx) > Math.abs(dy)) onSwipe(dx > 0 ? 'right' : 'left')
    else onSwipe(dy > 0 ? 'down' : 'up')
  }

  return { onPointerdown, onPointerup }
}

// ---------------------------------------------------------------------------
// Drawing helpers
// ---------------------------------------------------------------------------
export function context2d(canvas: Ref<HTMLCanvasElement | null>): CanvasRenderingContext2D | null {
  return canvas.value?.getContext('2d') ?? null
}

/** Filled rectangle with a light top edge and a dark bottom edge. */
export function bevelRect(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
  ctx.fillStyle = 'rgba(255,255,255,.3)'
  ctx.fillRect(x, y, w, 2)
  ctx.fillStyle = 'rgba(0,0,0,.35)'
  ctx.fillRect(x, y + h - 2, w, 2)
}

export const padScore = (value: number, size = 4) => String(value).padStart(size, '0')
