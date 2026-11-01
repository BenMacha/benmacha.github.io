<template>
  <div class="container lost" data-build-stage>
    <div class="running-head mono" aria-hidden="true">
      <span>Ben Macha Ali — {{ $t('book.volume') }}</span>
      <span>404</span>
    </div>
    <span class="eyebrow eyebrow--red" data-build>Erratum · 404</span>
    <h1 class="lost__title" data-build data-build-kind="text">{{ $t('404.title') }}</h1>
    <p class="lead" data-build>{{ $t('404.description') }}</p>
    <NuxtLink :to="localePath('/')" class="btn btn--primary" data-build @click="$emit('home')"><span class="dir-arrow" aria-hidden="true">←</span> {{ $t('404.back') }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

defineEmits<{ home: [] }>()
</script>

<style scoped>
.lost {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  padding-bottom: 40px;
}

.running-head {
  align-self: stretch;
  display: flex;
  justify-content: space-between;
  padding: 18px 0;
  margin-bottom: 48px;
  border-bottom: 1px solid var(--rule);
  font-size: 12px;
  color: var(--muted);
}

.lost__title {
  margin: 0;
  font-size: clamp(40px, 6vw, 60px);
  line-height: 1.05;
  letter-spacing: -1.4px;
}
</style>
