<template>
  <article v-lift class="achievement">
    <div class="achievement__star coin-block pixel" aria-hidden="true">★</div>
    <div class="achievement__body">
      <div class="achievement__unlocked pixel">{{ $t('educationUi.unlocked') }} · {{ degree.period }}</div>
      <h3 class="achievement__school pixel">
        {{ degree.school }} <span>// {{ degree.type }}</span>
      </h3>
      <div class="tags">
        <span v-for="skill in degree.skills" :key="skill" class="achievement__tag">{{ skill }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Degree } from '~/composables/useResume'

defineProps<{ degree: Degree }>()
</script>

<style scoped>
.achievement {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 20px;
  background: #1e1e2a;
  color: #fff;
  border: 3px solid #000;
  box-shadow: inset 0 0 0 3px #5a5a6e, 6px 6px 0 var(--shadow);
}

.achievement__star {
  flex: none;
  width: 60px;
  height: 60px;
  font-size: 16px;
}

.achievement__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.achievement__unlocked {
  font-size: 9px;
  line-height: 1.6;
  color: var(--coin);
}

.achievement__school {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.achievement__school span {
  font-size: 10px;
  color: #c9c9d8;
}

.achievement__tag {
  font-size: 11px;
  padding: 3px 8px;
  background: #2d2d3e;
  border: 2px solid #000;
  color: #e8e8f2;
}
</style>
