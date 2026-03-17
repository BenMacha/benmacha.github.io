<template>
  <div class="mb-12 text-center">
    <div class="inline-block">
      <h2 class="text-2xl sm:text-3xl font-mono font-bold mb-3 text-accent">
        <span class="text-accent/30">&gt; </span>{{ title }}
      </h2>
      <p v-if="subtitle" class="text-gray-400 dark:text-green-400/40 text-sm mb-3 max-w-2xl mx-auto font-mono">
        // {{ subtitle }}
      </p>
      <div class="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
