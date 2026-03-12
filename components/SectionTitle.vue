<template>
  <div class="mb-12 text-center">
    <h2 class="text-3xl sm:text-4xl font-heading font-bold mb-4">
      {{ title }}
    </h2>
    <div class="w-20 h-1 bg-accent mx-auto rounded-full" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
