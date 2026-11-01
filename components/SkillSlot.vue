<template>
  <div class="skill">
    <span class="skill__mark mono" :style="{ '--mark': icon.color }" aria-hidden="true">{{ icon.abbr }}</span>
    <span class="skill__name">{{ name }}</span>
  </div>
</template>

<script setup lang="ts">
import { skillIcon } from '~/data/skills'

const props = defineProps<{ name: string }>()
const icon = computed(() => skillIcon(props.name))
</script>

<style scoped>
.skill {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--rule);
}

/* A small index tab in the technology's own colour */
.skill__mark {
  flex: none;
  min-width: 42px;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid var(--rule);
  border-inline-start: 3px solid var(--mark);
  font-size: 11px;
  text-align: center;
  color: var(--ink-2);
}

.skill__name {
  font-weight: 600;
}
</style>
