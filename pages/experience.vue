<template>
  <div class="pt-24 pb-20">
    <div class="section-container">
      <SectionTitle :title="$t('experience.title')" />

      <!-- Timeline -->
      <div class="relative max-w-3xl mx-auto">
        <!-- Timeline line -->
        <div class="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-accent/20" />

        <div
          v-for="(item, index) in experiences"
          :key="item.company"
          class="reveal relative pl-12 sm:pl-20 pb-12 last:pb-0"
          :class="`reveal-delay-${Math.min(index + 1, 5)}`"
        >
          <!-- Timeline dot -->
          <div class="absolute left-2.5 sm:left-6.5 top-1 w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20 dark:ring-dark" />

          <!-- Card -->
          <div class="glass-card glow-border p-6 rounded-2xl">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
              <div>
                <h3 class="font-heading font-bold text-xl text-accent">{{ item.company }}</h3>
                <p class="text-sm font-semibold mt-1">{{ item.role }}</p>
                <p v-if="item.location" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin class="w-3 h-3" />
                  {{ item.location }}
                </p>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full whitespace-nowrap self-start">
                {{ item.period }}
              </span>
            </div>

            <!-- Tasks -->
            <ul class="space-y-2 mb-4">
              <li
                v-for="task in item.tasks"
                :key="task"
                class="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
              >
                <span class="text-accent mt-1.5 text-[6px] shrink-0">&#9679;</span>
                {{ task }}
              </li>
            </ul>

            <!-- Stack -->
            <div v-if="item.stack" class="pt-3 border-t border-gray-200/10 dark:border-white/5">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                <span class="text-accent font-medium">Stack:</span> {{ item.stack }}
              </p>
            </div>

            <!-- Website -->
            <a
              v-if="item.website"
              :href="item.website"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 mt-3 text-xs text-accent hover:underline"
            >
              <ExternalLink class="w-3 h-3" />
              {{ item.website }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin, ExternalLink } from 'lucide-vue-next'

useScrollReveal()

const { t, tm, rt } = useI18n()

const experiences = computed(() => {
  const raw = tm('experience.items') as any[]
  return raw.map((item: any) => ({
    company: rt(item.company),
    period: rt(item.period),
    role: rt(item.role),
    location: item.location ? rt(item.location) : undefined,
    tasks: (item.tasks || []).map((task: any) => rt(task)),
    stack: item.stack ? rt(item.stack) : undefined,
    website: item.website ? rt(item.website) : undefined,
  }))
})

useHead({
  title: `${t('experience.title')} - Ben Macha Ali`,
  meta: [
    { name: 'description', content: 'Expériences professionnelles de Ben Macha Ali - Lead PHP Developer, Full Stack Developer. Symfony, React, Vue.js.' },
  ],
})
</script>
