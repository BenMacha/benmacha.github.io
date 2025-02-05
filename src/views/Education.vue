<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { GraduationCap } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import type { Education, Internship, Category } from '../types/i18n'

const content = ref(null)
const { t, tm } = useI18n()

useMotion(content, {
  initial: { y: 50, opacity: 0 },
  enter: { y: 0, opacity: 1 }
})

const education = tm('education.items') as Education[]   || []
const internships = tm('education.internships.items') as Internship[]  || []
const interests = tm('education.interests.items') as Record<string, Category>
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div ref="content" class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <GraduationCap class="h-8 w-8" />
        {{ t('education.title') }}
      </h1>
      
      <!-- Education -->
      <div class="space-y-8">
        <div v-for="edu in education" :key="edu.school" class="border-l-2 border-primary pl-4">
          <h2 class="text-xl font-semibold text-foreground">{{ edu.school }} | {{ edu.type }}</h2>
          <p class="text-muted-foreground">{{ edu.period }}</p>
          <ul class="mt-4 list-disc list-inside space-y-2 text-foreground">
            <li v-for="skill in edu.skills" :key="skill">{{ skill }}</li>
          </ul>
        </div>
      </div>

      <!-- Internships -->
      <h2 class="text-2xl font-bold mt-12 mb-6 text-foreground">{{ t('education.internships.title') }}</h2>
      <div class="space-y-8">
        <div v-for="internship in internships" :key="internship.company" class="border-l-2 border-primary pl-4">
          <h3 class="text-xl font-semibold text-foreground">{{ internship.company }}</h3>
          <p class="text-muted-foreground">{{ internship.period }} | {{ internship.role }}</p>
          <ul class="mt-4 list-disc list-inside text-foreground">
            <li v-for="skill in internship.skills" :key="skill">{{ skill }}</li>
          </ul>
        </div>
      </div>

      <!-- Interests -->
      <h2 class="text-2xl font-bold mt-12 mb-6 text-foreground">{{ t('education.interests.title') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="(category, key) in interests" :key="key">
          <h3 class="text-xl font-semibold mb-4 text-foreground">{{ category.title }}</h3>
          <ul class="list-disc list-inside space-y-2 text-foreground">
            <li v-for="item in category.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>