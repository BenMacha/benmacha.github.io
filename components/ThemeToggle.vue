<template>
  <button
    @click="toggleTheme"
    class="p-2 text-accent/50 hover:text-accent border border-transparent hover:border-accent/20 hover:bg-accent/5 transition-all duration-200"
    :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Sun v-if="colorMode.value === 'dark'" class="w-4 h-4" />
    <Moon v-else class="w-4 h-4" />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
