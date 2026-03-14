<template>
  <div class="min-h-screen flex flex-col bg-dark pixel-grid relative">
    <!-- Matrix Rain Background -->
    <ClientOnly>
      <MatrixRain />
    </ClientOnly>

    <!-- Scanline overlay -->
    <div class="fixed inset-0 pointer-events-none z-[1] opacity-30"
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
