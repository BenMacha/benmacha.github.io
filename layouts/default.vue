<template>
  <div
    class="min-h-screen flex flex-col relative bg-pixel-cream dark:bg-pixel-black dark:bg-pixel-grid dark:bg-[size:8px_8px]"
  >
    <!-- Pixel Background (dark mode only) -->
    <ClientOnly>
      <PixelBackground />
    </ClientOnly>

    <!-- Spider webs in corners -->
    <ClientOnly>
      <PixelSpiderWeb position="top-left" class="z-40" />
      <PixelSpiderWeb position="top-right" class="z-40" />
    </ClientOnly>

    <!-- CRT scanline overlay (dark mode only) -->
    <div
      class="fixed inset-0 pointer-events-none z-[1] opacity-0 dark:opacity-[0.06]"
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
</script>
