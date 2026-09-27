import type { Directive } from 'vue'
import { animate, hover } from 'motion'

/**
 * Motion (https://motion.dev) effects shared across the site.
 */

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const cleanups = new WeakMap<HTMLElement, () => void>()

function bind(el: HTMLElement, setup: () => () => void) {
  if (prefersReducedMotion()) return
  cleanups.set(el, setup())
}

function unbind(el: HTMLElement) {
  cleanups.get(el)?.()
  cleanups.delete(el)
}

/** `v-lift` — cards float up and tilt slightly on hover. */
export const liftDirective: Directive<HTMLElement> = {
  getSSRProps: () => ({}),
  mounted: el => bind(el, () => hover(el, () => {
    animate(el, { y: -8, rotate: -0.6 }, { type: 'spring', stiffness: 400, damping: 15 })
    return () => animate(el, { y: 0, rotate: 0 }, { type: 'spring', stiffness: 300, damping: 18 })
  })),
  unmounted: unbind,
}

/** `v-wiggle` — the element's first child hops and wiggles on hover (inventory items). */
export const wiggleDirective: Directive<HTMLElement> = {
  getSSRProps: () => ({}),
  mounted: el => bind(el, () => hover(el, () => {
    const icon = el.firstElementChild
    if (icon) animate(icon, { y: [0, -10, 0], rotate: [0, -8, 8, 0] }, { duration: 0.45 })
  })),
  unmounted: unbind,
}

/**
 * Every button and link squashes when pressed. Delegated from the document so
 * elements rendered after navigation are covered too.
 */
export function installPressFeedback(): () => void {
  if (prefersReducedMotion()) return () => {}

  const onDown = (event: PointerEvent) => {
    const el = (event.target as Element | null)?.closest<HTMLElement>('button, a[href]')
    if (!el) return
    animate(el, { scale: 0.9 }, { duration: 0.08 })
    const release = () => {
      animate(el, { scale: 1 }, { type: 'spring', stiffness: 600, damping: 12 })
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
  }

  document.addEventListener('pointerdown', onDown)
  return () => document.removeEventListener('pointerdown', onDown)
}

/** Score counter "pop" when it increases. */
export function popElement(el: Element | null | undefined, color: string) {
  if (!el || prefersReducedMotion()) return
  animate(el, { scale: [1, 1.5, 1], color: [color, color, getComputedStyle(el).color] }, { duration: 0.35 })
}
