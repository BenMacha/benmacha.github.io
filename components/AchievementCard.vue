<template>
  <article class="degree card">
    <span class="degree__period mono">{{ degree.period }}</span>
    <h3 class="degree__school">{{ degree.school }}</h3>
    <p class="degree__type">{{ degree.type }}</p>
    <div class="tags">
      <span v-for="skill in degree.skills" :key="skill" class="tag">{{ skill }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Degree } from '~/composables/useResume'

defineProps<{ degree: Degree }>()
</script>

<style scoped>
.degree {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  border-top: 3px solid var(--green);
}

.degree__period {
  font-size: 13px;
  color: var(--muted);
}

.degree__school {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
}

.degree__type {
  margin: 0 0 6px;
  font-weight: 600;
  color: var(--ink-2);
}
</style>
