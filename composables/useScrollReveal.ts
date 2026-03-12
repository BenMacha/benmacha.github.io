export function useScrollReveal() {
  const observer = ref<IntersectionObserver | null>(null)

  const initReveal = () => {
    if (typeof window === 'undefined') return

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.value?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.value?.observe(el)
    })
  }

  const cleanup = () => {
    observer.value?.disconnect()
  }

  onMounted(() => {
    nextTick(() => {
      initReveal()
    })
  })

  onUnmounted(() => {
    cleanup()
  })

  return { initReveal, cleanup }
}
