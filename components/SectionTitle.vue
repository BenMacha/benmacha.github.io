<template>
  <div class="section-title" :class="{ 'section-title--page': page }">
    <div>
      <div class="section-title__eyebrow pixel">{{ eyebrow }}</div>
      <component :is="page ? 'h1' : 'h2'" class="section-title__title pixel">{{ title }}</component>
      <div v-if="page" class="section-title__blocks" aria-hidden="true">
        <span style="background: #5cb338" /><span style="background: #8a5a2b" /><span style="background: #fbd000" />
      </div>
      <p v-if="subtitle" class="section-title__subtitle">{{ subtitle }}</p>
    </div>
    <NuxtLink v-if="to && linkLabel" :to="localePath(to)" class="btn btn--ghost">{{ linkLabel }} ▶</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

defineProps<{
  eyebrow: string
  title: string
  subtitle?: string
  /** Page header: renders an h1 with the pixel block decoration. */
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

.section-title--page {
  margin-bottom: 40px;
}

.section-title__eyebrow {
  margin-bottom: 12px;
  font-size: 10px;
  line-height: 1.6;
  color: var(--eyebrow);
}

.section-title--page .section-title__eyebrow {
  margin-bottom: 14px;
}

.section-title__title {
  margin: 0;
  font-size: 22px;
  line-height: 1.4;
  color: var(--h2);
}

.section-title--page .section-title__title {
  font-size: clamp(20px, 3.4vw, 30px);
}

.section-title__blocks {
  display: flex;
  gap: 4px;
  margin-top: 18px;
}

.section-title__blocks span {
  width: 14px;
  height: 14px;
  border: 2px solid #000;
}

.section-title__subtitle {
  max-width: 640px;
  margin: 18px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--h2);
  opacity: .85;
}
</style>
