<template>
  <div class="min-h-screen flex flex-col relative"
    :class="isDark ? 'bg-dark pixel-grid' : 'bg-gray-100'"
  >
    <!-- Matrix Rain Background (dark mode only) -->
    <ClientOnly>
      <MatrixRain v-if="isDark" />
    </ClientOnly>

    <!-- Scanline overlay (dark mode only) -->
    <div
      v-if="isDark"
      class="fixed inset-0 pointer-events-none z-[1] opacity-30"
      style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px);"
    />

    <!-- Content -->
    <div class="relative z-10">
      <AppHeader />
      <main class="flex-1">
        <slot />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
</script>
