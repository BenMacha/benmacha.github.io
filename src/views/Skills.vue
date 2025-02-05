<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { Code2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { skillSections } from '../constants'

const content = ref(null)

const contentMotion = useMotion(content, {
  initial: { y: 50, opacity: 0 },
  enter: { y: 0, opacity: 1 }
})
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div ref="content" class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <Code2 class="h-8 w-8" />
        {{ $t('skills.title') }}
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="section in skillSections" :key="section.title" class="space-y-4">
          <div class="flex items-center gap-2">
            <component :is="section.icon" class="h-6 w-6 text-primary" />
            <h2 class="text-xl font-semibold text-foreground">{{ $t(`skills.${section.title}`) }}</h2>
          </div>
          <ul class="space-y-3">
            <li 
              v-for="skill in section.skills" 
              :key="skill"
              class="flex items-center gap-2 text-foreground pl-8 relative before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-primary before:rounded-full"
            >
              {{ skill }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>