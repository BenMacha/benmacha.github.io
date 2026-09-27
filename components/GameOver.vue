<template>
  <div class="container over">
    <img src="/images/mario-sm.png" alt="" width="76" height="100" class="over__mario pixelated">
    <div class="over__code pixel">404</div>
    <div class="over__label pixel">{{ $t('404.gameOver') }}</div>
    <h1 class="over__title">{{ $t('404.title') }}</h1>
    <p class="over__text">{{ $t('404.description') }}</p>
    <NuxtLink to="/" class="btn btn--coin" @click="$emit('home')">▶ {{ $t('404.back') }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ home: [] }>()
</script>

<style scoped>
.over {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding-block: 96px;
  text-align: center;
}

.over__mario {
  width: 76px;
  height: auto;
  filter: drop-shadow(4px 4px 0 #000);
  animation: bob 1.2s steps(2) infinite;
}

.over__code {
  font-size: clamp(40px, 9vw, 80px);
  color: var(--mario);
  text-shadow: 6px 6px 0 #000;
}

.over__label {
  font-size: 16px;
  color: var(--h2);
}

.over__title {
  margin: 0;
  font-size: 20px;
  color: var(--h2);
}

.over__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--h2);
  opacity: .85;
}
</style>
