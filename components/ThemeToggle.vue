<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-lg hover:bg-gray-200/10 transition-colors duration-200"
    :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Sun v-if="colorMode.value === 'dark'" class="w-5 h-5 text-accent" />
    <Moon v-else class="w-5 h-5 text-gray-700" />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
