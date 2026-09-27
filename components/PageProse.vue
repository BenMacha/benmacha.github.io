<template>
  <section v-if="sections.length" class="prose-block card">
    <div v-for="section in sections" :key="section.title" class="prose-block__section">
      <h2 class="prose-block__title pixel"><span>&gt;</span> {{ section.title }}</h2>
      <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
/** Long-form text of a page, stored in the i18n files under `pageProse.<page>`. */
const props = defineProps<{ page: 'projects' | 'skills' | 'education' }>()

const { tm, rt } = useI18n()

const sections = computed(() =>
  ((tm(`pageProse.${props.page}`) as Record<string, any>[] | undefined) ?? []).map(section => ({
    title: rt(section.title),
    paragraphs: (section.paragraphs as unknown[]).map(p => rt(p as any)),
  })),
)
</script>

<style scoped>
.prose-block {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 48px;
  padding: 28px;
}

.prose-block__title {
  margin: 0 0 14px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--h2);
}

.prose-block__title span {
  color: var(--coin);
}

.prose-block p {
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.75;
  color: var(--muted);
}

.prose-block p:last-child {
  margin-bottom: 0;
}

@media (max-width: 600px) {
  .prose-block {
    padding: 20px 16px;
  }
}
</style>
