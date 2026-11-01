<template>
  <div class="skill">
    <svg class="skill__icon" viewBox="0 0 24 24" :style="{ '--brand': brand }" aria-hidden="true" focusable="false"><path :d="techIcon(name)" /></svg>
    <span class="skill__name">{{ name }}</span>
  </div>
</template>

<script setup lang="ts">
import { skillIcon } from '~/data/skills'
import { techIcon } from '~/data/tech'

const props = defineProps<{ name: string }>()
const brand = computed(() => skillIcon(props.name).color)
</script>

<style scoped>
.skill {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--rule);
}

/* Monochrome logo in the text colour, brand colour on hover */
.skill__icon {
  width: 20px;
  height: 20px;
  flex: none;
  fill: var(--ink-2);
  transition: fill .2s;
}

.skill:hover .skill__icon {
  fill: var(--brand);
}

.skill__name {
  font-weight: 600;
}
</style>
