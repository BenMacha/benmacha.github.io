import type { Ref } from 'vue'

/**
 * Live behaviour shared by the isometric figures (utils/anatomy/):
 * - `focus` names the item the reader points at; the stage's `data-focus` dims the rest (assets/css/anatomy.css);
 * - hovering a drawn part that carries `data-p` focuses it, leaving the stage clears it;
 * - the stage's animations pause while it is offscreen.
 */
export function useIsoStage(stage: Ref<HTMLElement | null>, ids: () => readonly string[]) {
  const focus = ref<string | null>(null)
  const paused = ref(false)

  function onPointerOver(event: PointerEvent) {
    const part = (event.target as Element | null)?.closest('[data-p]')
    if (!part) return
    const tokens = (part.getAttribute('data-p') ?? '').split(' ')
    const id = tokens.find(token => ids().includes(token))
    if (id) focus.value = id
  }

  function onPointerLeave() {
    focus.value = null
  }

  let observer: IntersectionObserver | undefined
  onMounted(() => {
    if (!stage.value || typeof IntersectionObserver === 'undefined') return
    observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1]
      if (entry) paused.value = !entry.isIntersecting
    }, { rootMargin: '120px 0px' })
    observer.observe(stage.value)
  })
  onBeforeUnmount(() => observer?.disconnect())

  return { focus, paused, onPointerOver, onPointerLeave }
}
