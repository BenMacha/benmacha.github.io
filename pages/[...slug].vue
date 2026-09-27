<template>
  <GameOver />
</template>

<script setup lang="ts">
const event = useRequestEvent()
if (event) setResponseStatus(event, 404)

const { t } = useI18n()

usePageSeo({
  title: () => `404 – ${t('404.title')}`,
  description: () => t('404.description'),
  noindex: true,
})
</script>
