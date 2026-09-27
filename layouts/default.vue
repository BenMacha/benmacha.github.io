<template>
  <div class="layout">
    <div ref="progressBar" class="progress" aria-hidden="true" />
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { animate, scroll } from 'motion'

// lang/dir, canonical, hreflang alternates (+ x-default) and og:locale for the current locale
const i18nHead = useLocaleHead({ seo: true })

useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
    dir: i18nHead.value.htmlAttrs?.dir as 'ltr' | 'rtl' | undefined,
  },
  link: i18nHead.value.link ?? [],
  meta: (i18nHead.value.meta ?? []).filter(m => m.property !== 'og:locale'),
}))

// Rainbow reading-progress bar, driven by Motion's scroll timeline
const progressBar = ref<HTMLElement | null>(null)
let stopProgress: (() => void) | undefined

onMounted(() => {
  if (progressBar.value) stopProgress = scroll(animate(progressBar.value, { scaleX: [0, 1] }, { ease: 'linear' }))
})

onBeforeUnmount(() => stopProgress?.())
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.progress {
  position: fixed;
  inset: 0 0 auto;
  height: 5px;
  z-index: 70;
  pointer-events: none;
  transform: scaleX(0);
  transform-origin: 0 50%;
  background: linear-gradient(90deg, #e52521, #fbd000, #5cb338, #2496ed);
}
</style>
