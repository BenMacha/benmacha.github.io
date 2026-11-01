<template>
  <header class="chapter-head">
    <div class="running-head mono" aria-hidden="true">
      <span>Ben Macha Ali — {{ $t('book.volume') }}</span>
      <span>{{ running }}</span>
    </div>
    <div class="chapter-head__main">
      <div class="chapter-head__text">
        <span class="eyebrow" :class="accent === 'green' ? 'eyebrow--green' : 'eyebrow--red'">{{ eyebrow }}</span>
        <h1 class="chapter-head__title">{{ title }}</h1>
        <p v-if="lead" class="lead">{{ lead }}</p>
      </div>
      <div v-if="$slots.default" class="chapter-head__side">
        <slot />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * Opening of a chapter page: the running head (book title — chapter), the chapter
 * number as an eyebrow, the h1 and a lead paragraph. The default slot sits beside it
 * (a legend, key figures…).
 */
const props = defineProps<{
  title: string
  lead?: string
  /** Overrides "Chapitre NN" (e.g. an appendix) */
  eyebrowText?: string
}>()

const { t } = useI18n()
const { chapter, label } = useChapter()

const accent = computed(() => chapter.value?.accent ?? 'red')
const eyebrow = computed(() => props.eyebrowText ?? (chapter.value ? `${t('book.chapter')} ${chapter.value.num}` : ''))
const running = computed(() => label.value)
</script>

<style scoped>
.chapter-head {
  border-bottom: 1px solid var(--rule);
  margin-bottom: 40px;
}

.running-head {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--rule);
  font-size: 12px;
  color: var(--muted);
}

.chapter-head__main {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 32px;
  padding: 64px 0 40px;
}

.chapter-head__text {
  flex: 999 1 520px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chapter-head__title {
  margin: 0;
  font-size: clamp(40px, 6vw, 60px);
  line-height: 1.04;
  letter-spacing: -1.4px;
}

.chapter-head__side {
  flex: 1 1 300px;
  min-width: 0;
}

@media (max-width: 600px) {
  .chapter-head__main {
    padding: 40px 0 28px;
  }
}
</style>
