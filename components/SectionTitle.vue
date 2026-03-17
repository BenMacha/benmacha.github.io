<template>
  <div class="mb-12 text-center">
    <div class="inline-block">
      <!-- Arcade level title -->
      <h2 class="font-pixel text-sm sm:text-base mb-3 dark:text-pixel-yellow text-pixel-navy">
        <span class="dark:text-pixel-blue text-pixel-purple">&gt;&gt;</span>
        LEVEL:
        <span class="dark:text-pixel-green text-pixel-purple">{{ title }}</span>
      </h2>
      <!-- Subtitle -->
      <p
        v-if="subtitle"
        class="font-retro text-base sm:text-lg mb-3 max-w-2xl mx-auto dark:text-pixel-gray text-pixel-navy/60"
      >
        {{ subtitle }}
      </p>
      <!-- Pixel separator - dashed pattern -->
      <div class="pixel-separator"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
