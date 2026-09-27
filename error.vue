<template>
  <NuxtLayout>
    <GameOver @home="clearError({ redirect: '/' })" />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { t } = useI18n()

usePageSeo({
  title: () => `404 – ${t('404.title')}`,
  description: () => t('404.description'),
  noindex: true,
})
</script>
