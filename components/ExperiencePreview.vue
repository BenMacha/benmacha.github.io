<template>
  <section class="py-20">
    <div class="section-container">
      <SectionTitle :title="$t('experience.title')" />

      <div class="grid gap-4 max-w-3xl mx-auto">
        <div
          v-for="(item, index) in previewItems"
          :key="item.company"
          class="reveal glass-card glow-border p-5 claw-marks"
          :class="`reveal-delay-${index + 1}`"
        >
          <!-- Terminal header bar -->
          <div class="flex items-center gap-2 mb-3 text-[10px] text-accent/30 border-b border-accent/10 pb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-accent/40" />
            <span class="w-1.5 h-1.5 rounded-full bg-accent/30" />
            <span class="w-1.5 h-1.5 rounded-full bg-accent/20" />
            <span class="ml-1 font-mono">process://{{ item.company.toLowerCase().replace(/\s/g, '-') }}</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div>
              <h3 class="font-mono font-bold text-base text-accent">{{ item.company }}</h3>
              <p class="text-accent/60 text-xs font-mono">{{ item.role }}</p>
            </div>
            <span class="text-[10px] text-gray-400 dark:text-green-400/30 font-mono bg-accent/5 px-2 py-1 border border-accent/10 whitespace-nowrap">
              {{ item.period }}
            </span>
          </div>
          <ul class="space-y-1">
            <li
              v-for="task in item.tasks.slice(0, 3)"
              :key="task"
              class="text-xs text-gray-500 dark:text-green-400/60 flex items-start gap-2 font-mono"
            >
              <span class="text-accent mt-0.5">&gt;</span>
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

const { tm, rt } = useI18n()

const previewItems = computed(() => {
  const raw = tm('experience.items') as any[]
  return raw.slice(0, 3).map((item: any) => ({
    company: rt(item.company),
    period: rt(item.period),
    role: rt(item.role),
    tasks: (item.tasks || []).map((t: any) => rt(t)),
  }))
})
</script>
