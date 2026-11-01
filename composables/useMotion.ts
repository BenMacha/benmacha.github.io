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
    animate(el, { y: -3 }, { duration: 0.25 })
    return () => animate(el, { y: 0 }, { duration: 0.25 })
  })),
  unmounted: unbind,
}

/** `v-wiggle` — the element's first child hops and wiggles on hover (inventory items). */
export const wiggleDirective: Directive<HTMLElement> = {
  getSSRProps: () => ({}),
  mounted: el => bind(el, () => hover(el, () => {
    const icon = el.firstElementChild
    if (icon) animate(icon, { y: [0, -3, 0] }, { duration: 0.3 })
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
    animate(el, { scale: 0.97 }, { duration: 0.08 })
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

/**
 * `v-count` — counts a number up from 0 when it scrolls into view ("15" → 0, 1, … 15).
 * The server renders the final value; the client only animates it.
 */
export const countDirective: Directive<HTMLElement, number> = {
  getSSRProps: () => ({}),
  mounted(el, binding) {
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return
    const target = binding.value
    const io = new IntersectionObserver((entries) => {
      if (!entries.some(e => e.isIntersecting)) return
      io.disconnect()
      animate(0, target, { duration: 1.1, ease: [0.22, 0.8, 0.2, 1], onUpdate: v => (el.textContent = String(Math.round(v))) })
    }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
    cleanups.set(el, () => io.disconnect())
  },
  unmounted: unbind,
}

/**
 * `v-draw` — on the client, an element below the fold gets `will-draw`, then `is-drawn` once
 * it scrolls into view, so CSS can draw it (timeline branches grow from their start date).
 * The server HTML, and reduced motion, show the finished drawing.
 */
export const drawDirective: Directive<HTMLElement> = {
  getSSRProps: () => ({}),
  mounted(el) {
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return
    el.classList.add('will-draw')
    const io = new IntersectionObserver((entries) => {
      if (!entries.some(e => e.isIntersecting)) return
      io.disconnect()
      el.classList.add('is-drawn')
    }, { rootMargin: '0px 0px -15% 0px' })
    io.observe(el)
    cleanups.set(el, () => io.disconnect())
  },
  unmounted: unbind,
}
