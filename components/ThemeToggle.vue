<template>
  <button
    @click="toggleTheme"
    class="p-2 font-pixel text-sm border-2 transition-all duration-200
           dark:border-pixel-navy border-pixel-navy/30
           dark:text-pixel-yellow text-pixel-purple
           hover:bg-pixel-blue hover:text-pixel-white hover:border-pixel-blue
           active:scale-90"
    :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <span v-if="colorMode.value === 'dark'" class="inline-block animate-pixel-bounce">&#9788;</span>
    <span v-else class="inline-block animate-pixel-bounce">&#9790;</span>
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
