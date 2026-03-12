<template>
  <div class="min-h-screen flex items-center justify-center pt-20">
    <div class="text-center section-container">
      <div class="mb-8">
        <span class="text-8xl sm:text-9xl font-heading font-bold text-gradient">404</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-heading font-bold mb-4">
        {{ $t('404.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {{ $t('404.description') }}
      </p>
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
