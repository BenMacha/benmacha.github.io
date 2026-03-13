<template>
  <div class="mb-12 text-center">
    <h2 class="text-3xl sm:text-4xl font-heading font-bold mb-4">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="text-gray-400 text-lg mb-4 max-w-2xl mx-auto">
      {{ subtitle }}
    </p>
    <div class="w-20 h-1 bg-accent mx-auto rounded-full" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
