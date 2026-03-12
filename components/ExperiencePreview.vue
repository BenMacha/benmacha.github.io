<template>
  <section class="py-20">
    <div class="section-container">
      <SectionTitle :title="$t('experience.title')" />

      <div class="grid gap-6 max-w-3xl mx-auto">
        <div
          v-for="(item, index) in previewItems"
          :key="item.company"
          class="reveal glass-card glow-border p-6 rounded-2xl"
          :class="`reveal-delay-${index + 1}`"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div>
              <h3 class="font-heading font-bold text-lg">{{ item.company }}</h3>
              <p class="text-accent text-sm font-medium">{{ item.role }}</p>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400 font-mono whitespace-nowrap">
              {{ item.period }}
            </span>
          </div>
          <ul class="space-y-1.5">
            <li
              v-for="task in item.tasks.slice(0, 3)"
              :key="task"
              class="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
            >
              <span class="text-accent mt-1.5 text-[6px]">&#9679;</span>
              {{ task }}
            </li>
          </ul>
        </div>
      </div>

      <div class="text-center mt-10 reveal">
        <NuxtLink to="/experience" class="btn-secondary">
          <Briefcase class="w-4 h-4" />
          {{ $t('nav.experience') }}
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Briefcase, ArrowRight } from 'lucide-vue-next'

const { t, tm } = useI18n()

const previewItems = computed(() => {
  const items = tm('experience.items') as Array<{
    company: string
    period: string
    role: string
    tasks: string[]
  }>
  return items.slice(0, 3)
})
</script>
