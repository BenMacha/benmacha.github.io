<template>
  <div
    class="min-h-screen flex flex-col relative"
    :class="isDark ? 'bg-pixel-black bg-pixel-grid bg-[size:8px_8px]' : 'bg-pixel-cream'"
  >
    <!-- Pixel Background (dark mode only) -->
    <ClientOnly>
      <PixelBackground v-if="isDark" />
    </ClientOnly>

    <!-- Spider webs in corners -->
    <PixelSpiderWeb position="top-left" class="z-40" />
    <PixelSpiderWeb position="top-right" class="z-40" />

    <!-- CRT scanline overlay (dark mode only) -->
    <div
      v-if="isDark"
      class="fixed inset-0 pointer-events-none z-[1] opacity-[0.06]"
      style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px);"
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
