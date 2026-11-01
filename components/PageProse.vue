<template>
  <section v-if="sections.length" class="prose" data-build-stage>
    <div v-for="section in sections" :key="section.title" class="prose__section" data-build>
      <h2 class="prose__title">{{ section.title }}</h2>
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
.prose {
  margin-top: 56px;
  padding-top: 40px;
  border-top: 1px solid var(--rule);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(420px, 100%), 1fr));
  gap: 32px 56px;
}

.prose__title {
  margin: 0 0 12px;
  font-size: 24px;
  line-height: 1.25;
}

.prose__section p {
  margin: 0 0 14px;
  color: var(--ink-2);
}
</style>
