<template>
  <ul class="tech" :class="{ 'tech--small': small }">
    <li v-for="name in items" :key="name" class="tech__chip">
      <svg class="tech__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path :d="techIcon(name)" /></svg>
      <span>{{ name }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { techIcon } from '~/data/tech'

/** A list of technologies as chips: monochrome logo (decorative) + the name as text. */
defineProps<{ items: string[], small?: boolean }>()
</script>

<style scoped>
.tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tech__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px 3px 8px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.5;
  color: var(--ink-2);
  direction: ltr;
}

.tech__icon {
  width: 14px;
  height: 14px;
  flex: none;
  fill: currentColor;
}

.tech--small .tech__chip {
  padding: 2px 8px 2px 6px;
  font-size: 11px;
}
</style>
