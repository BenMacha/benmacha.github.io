import type { Directive } from 'vue'
import { animate } from 'motion'

/**
 * `v-reveal` — springs an element in with Motion when it scrolls into view.
 *   v-reveal          → slide up
 *   v-reveal="i"      → slide up, staggered by index i
 *   v-reveal.pop="i"  → scale in (inventory slots)
 *
 * The element is only hidden on the client, so server-rendered HTML stays
 * visible without JavaScript. Elements the user jumped past without them ever
 * entering the viewport (anchor links, End key) are revealed as well.
 */
interface RevealOptions { index: number, pop: boolean }

const pending = new Map<HTMLElement, RevealOptions>()
let observer: IntersectionObserver | null = null
let frame = 0

function reveal(el: HTMLElement) {
  const options = pending.get(el)
  if (!options) return
  pending.delete(el)
  observer?.unobserve(el)

  const { index, pop } = options
  animate(
    el,
    pop ? { scale: [0, 1], opacity: [0, 1] } : { y: [40, 0], opacity: [0, 1] },
    pop
      ? { type: 'spring', bounce: 0.5, delay: index * 0.04 }
      : { type: 'spring', bounce: 0.35, duration: 0.7, delay: index * 0.07 },
  )
}

// IntersectionObserver never fires for an element that goes straight from
// below to above the viewport, so skipped elements are caught on scroll.
function revealSkipped() {
  frame = 0
  for (const el of pending.keys()) {
    if (el.getBoundingClientRect().bottom < 0) reveal(el)
  }
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(revealSkipped)
}

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement)
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    window.addEventListener('scroll', onScroll, { passive: true })
  }
  return observer
}

export const revealDirective: Directive<HTMLElement, number | undefined> = {
  getSSRProps: () => ({}),
  mounted(el, binding) {
    if (prefersReducedMotion()) return
    el.style.opacity = '0'
    pending.set(el, { index: Math.min(binding.value ?? 0, 8), pop: !!binding.modifiers.pop })
    getObserver().observe(el)
  },
  unmounted(el) {
    pending.delete(el)
    observer?.unobserve(el)
  },
}
