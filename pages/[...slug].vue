<template>
  <div class="min-h-screen flex items-center justify-center pt-20">
    <div class="text-center section-container">
      <!-- Big pixel 404 -->
      <div class="mb-8">
        <span
          class="font-pixel text-6xl sm:text-7xl text-pixel-red"
          style="text-shadow: 4px 4px 0 rgba(0,0,0,0.5);"
        >
          404
        </span>
      </div>

      <!-- Game Over dialog -->
      <div class="pixel-card p-6 max-w-md mx-auto mb-8">
        <p class="font-pixel text-[10px] mb-4 text-pixel-orange dark:text-pixel-yellow">
          GAME OVER
        </p>
        <h1
          class="font-pixel text-xs sm:text-sm mb-3 leading-relaxed text-pixel-navy dark:text-pixel-white"
        >
          {{ $t('404.title') }}
        </h1>
        <p class="font-retro text-lg text-pixel-darkgray dark:text-pixel-gray">
          {{ $t('404.description') }}
        </p>
      </div>

      <!-- Continue button -->
      <NuxtLink to="/" class="btn-primary">
        <Home class="w-4 h-4" />
        {{ $t('404.back') }}
      </NuxtLink>

      <!-- Insert coin text -->
      <p
        class="mt-8 font-pixel text-[8px] animate-pixel-blink text-pixel-darkgray/40 dark:text-pixel-gray/40"
      >
        INSERT COIN TO CONTINUE
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Home } from 'lucide-vue-next'

useHead({
  title: '404 - Ben Macha Ali',
})
</script>
