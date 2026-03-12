<template>
  <section class="py-20 bg-gray-50/50 dark:bg-dark-50/50">
    <div class="section-container">
      <SectionTitle :title="$t('education.title')" />

      <div class="grid gap-6 max-w-3xl mx-auto">
        <div
          v-for="(item, index) in educationItems"
          :key="item.school"
          class="reveal glass-card glow-border p-6 rounded-2xl"
          :class="`reveal-delay-${index + 1}`"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-accent/10 text-accent">
              <GraduationCap class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-heading font-bold text-lg">{{ item.school }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.type }} &bull; {{ item.period }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in item.skills.slice(0, 4)"
              :key="skill"
              class="px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <div class="text-center mt-10 reveal">
        <NuxtLink to="/education" class="btn-secondary">
          <GraduationCap class="w-4 h-4" />
          {{ $t('nav.education') }}
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { GraduationCap, ArrowRight } from 'lucide-vue-next'

const { tm } = useI18n()

const educationItems = computed(() => {
  return tm('education.items') as Array<{
    school: string
    type: string
    period: string
    skills: string[]
  }>
})
</script>
