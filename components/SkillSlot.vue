<template>
  <div v-wiggle class="slot">
    <span
      class="slot__icon pixel"
      :class="{ 'slot__icon--long': icon.abbr.length > 2 }"
      :style="{ background: icon.color, color: icon.ink }"
      aria-hidden="true"
    >{{ icon.abbr }}</span>
    <span class="slot__name">{{ name }}</span>
  </div>
</template>

<script setup lang="ts">
import { skillIcon } from '~/data/skills'

const props = defineProps<{ name: string }>()
const icon = computed(() => skillIcon(props.name))
</script>

<style scoped>
.slot {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px;
  background: var(--slot);
  box-shadow: inset 3px 3px 0 var(--slot-lo), inset -3px -3px 0 var(--slot-hi);
}

.slot:hover {
  outline: 3px solid #fff;
}

.slot__icon {
  min-width: 40px;
  height: 34px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 2px solid #000;
  box-shadow: inset -3px -3px 0 rgba(0, 0, 0, .3), inset 3px 3px 0 rgba(255, 255, 255, .35);
}

.slot__icon--long {
  font-size: 11px;
}

.slot__name {
  max-width: 100%;
  font-size: 10px;
  line-height: 1.3;
  text-align: center;
  color: var(--ink);
  overflow-wrap: anywhere;
}
</style>
