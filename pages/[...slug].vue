<template>
  <div class="min-h-screen flex items-center justify-center pt-20">
    <div class="text-center section-container">
      <div class="mb-8">
        <span class="text-7xl sm:text-8xl font-mono font-bold glow-text">404</span>
      </div>
      <div class="glass-card border border-accent/20 p-6 max-w-md mx-auto mb-8">
        <p class="font-mono text-xs text-accent/40 mb-2">$ find / -name "page" 2>/dev/null</p>
        <h1 class="text-xl sm:text-2xl font-mono font-bold mb-3 text-accent">
          {{ $t('404.title') }}
        </h1>
        <p class="text-green-400/40 font-mono text-sm">
          // {{ $t('404.description') }}
        </p>
      </div>
      <NuxtLink to="/" class="btn-primary">
        <Home class="w-4 h-4" />
        {{ $t('404.back') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Home } from 'lucide-vue-next'

useHead({
  title: '404 - Ben Macha Ali',
})
</script>
