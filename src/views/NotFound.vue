<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 class="text-2xl font-semibold mb-4 text-foreground">{{ t('404.title') }}</h2>
      <p class="text-muted-foreground mb-8">{{ t('404.description') }}</p>
      <router-link
        to="/"
        class="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        {{ t('404.back') }}
      </router-link>
    </div>
  </div>
</template>