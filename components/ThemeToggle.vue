<template>
  <button
    type="button"
    class="toggle pixel"
    :aria-label="$t('theme.toggle')"
    @click="toggle"
  >
    <ClientOnly>
      <span class="toggle__icon" aria-hidden="true">{{ isDark ? '☾' : '☀' }}</span>{{ isDark ? $t('theme.night') : $t('theme.day') }}
      <template #fallback>
        <span class="toggle__icon" aria-hidden="true">☾</span>{{ $t('theme.night') }}
      </template>
    </ClientOnly>
  </button>
</template>

<script setup lang="ts">
import { animate } from 'motion'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggle(event: MouseEvent) {
  colorMode.preference = isDark.value ? 'light' : 'dark'
  if (prefersReducedMotion()) return
  animate(event.currentTarget as HTMLElement, { rotate: [0, 360] }, { type: 'spring', bounce: 0.4, duration: 0.7 })
  // Retro "screen flash" when switching palettes
  animate(document.body, { filter: ['brightness(2.2) contrast(1.4)', 'brightness(1) contrast(1)'] }, { duration: 0.4 })
}
</script>

<style scoped>
.toggle {
  font-size: 9px;
  padding: 9px 12px;
  background: var(--coin);
  color: var(--navy);
  border: 3px solid var(--navy);
  box-shadow: inset -3px -3px 0 var(--coin-dark), inset 3px 3px 0 var(--coin-light), 3px 3px 0 var(--shadow);
  cursor: pointer;
}

.toggle:active {
  box-shadow: none;
}

.toggle__icon {
  font-family: system-ui, sans-serif;
  font-size: 14px;
  margin-inline-end: 6px;
}
</style>
