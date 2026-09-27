<template>
  <NuxtLayout>
    <GameOver @home="clearError({ redirect: '/' })" />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({ title: '404 - Ben Macha Ali', meta: [{ name: 'robots', content: 'noindex' }] })
</script>
