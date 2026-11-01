<template>
  <svg class="os-logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path :d="d" fill-rule="evenodd" />
  </svg>
</template>

<script setup lang="ts">
import { LOGO_PATHS } from '~/utils/anatomy/logos.mjs'
import type { LogoKey } from '~/data/opensource'

const props = defineProps<{ logo: LogoKey }>()
const d = computed(() => (LOGO_PATHS as Record<string, string>)[props.logo] ?? LOGO_PATHS.github)
</script>

<style scoped>
.os-logo {
  width: 18px;
  height: 18px;
  flex: none;
  fill: currentColor;
}
</style>
