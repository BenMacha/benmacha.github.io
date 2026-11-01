<template>
  <ChapterHead v-if="page" :title="title" :lead="subtitle" />
  <div v-else class="section-title">
    <div>
      <div class="eyebrow eyebrow--red">{{ eyebrow }}</div>
      <h2 class="section-title__title">{{ title }}</h2>
      <p v-if="subtitle" class="section-title__subtitle">{{ subtitle }}</p>
    </div>
    <NuxtLink v-if="to && linkLabel" :to="localePath(to)" class="btn btn--ghost">{{ linkLabel }} →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

/** Page header (`page`: the chapter opening) or a section heading inside a page. */
defineProps<{
  eyebrow: string
  title: string
  subtitle?: string
  page?: boolean
  to?: string
  linkLabel?: string
}>()
</script>

<style scoped>
.section-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title__title {
  margin: 8px 0 0;
  font-size: clamp(26px, 3.6vw, 34px);
  line-height: 1.2;
}

.section-title__subtitle {
  max-width: 640px;
  margin: 12px 0 0;
  color: var(--ink-2);
}
</style>
