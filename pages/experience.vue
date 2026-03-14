<template>
  <div class="pt-24 pb-20">
    <div class="section-container">
      <SectionTitle :title="$t('experience.title')" />

      <!-- Timeline -->
      <div class="relative max-w-3xl mx-auto">
        <!-- Timeline line - pixelated -->
        <div class="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-accent/15" style="box-shadow: 0 0 5px rgba(0,255,65,0.1);" />

        <div
          v-for="(item, index) in experiences"
          :key="item.company"
          class="reveal relative pl-12 sm:pl-20 pb-10 last:pb-0"
          :class="`reveal-delay-${Math.min(index + 1, 5)}`"
        >
          <!-- Timeline dot -->
          <div class="absolute left-3 sm:left-7 top-1 w-2.5 h-2.5 bg-accent border border-accent" style="box-shadow: 0 0 8px rgba(0,255,65,0.5);" />

          <!-- Card -->
          <div class="glass-card glow-border p-5">
            <!-- Terminal bar -->
            <div class="flex items-center gap-2 mb-3 text-[10px] text-accent/25 border-b border-accent/10 pb-2">
              <span class="w-1.5 h-1.5 rounded-full bg-accent/30" />
              <span class="w-1.5 h-1.5 rounded-full bg-accent/20" />
              <span class="w-1.5 h-1.5 rounded-full bg-accent/15" />
              <span class="ml-1 font-mono">session://work</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
              <div>
                <h3 class="font-mono font-bold text-lg text-accent">{{ item.company }}</h3>
                <p class="text-sm font-mono font-semibold mt-1 text-green-400/70">{{ item.role }}</p>
                <p v-if="item.location" class="text-[10px] text-green-400/30 flex items-center gap-1 mt-1 font-mono">
                  <MapPin class="w-3 h-3" />
                  {{ item.location }}
                </p>
              </div>
              <span class="text-[10px] text-green-400/30 font-mono bg-accent/5 px-2 py-1 border border-accent/10 whitespace-nowrap self-start">
                {{ item.period }}
              </span>
            </div>

            <!-- Tasks -->
            <ul class="space-y-1.5 mb-4">
              <li
                v-for="task in item.tasks"
                :key="task"
                class="text-xs text-green-400/50 flex items-start gap-2 font-mono"
              >
                <span class="text-accent mt-0.5 shrink-0">&gt;</span>
                {{ task }}
              </li>
            </ul>

            <!-- Stack -->
            <div v-if="item.stack" class="pt-3 border-t border-accent/10">
              <p class="text-[10px] text-green-400/30 font-mono">
                <span class="text-accent/60 font-medium">$ stack:</span> {{ item.stack }}
              </p>
            </div>

            <!-- Website -->
            <a
              v-if="item.website"
              :href="item.website"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 mt-3 text-[10px] text-accent/50 hover:text-accent font-mono transition-colors"
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
  title: `${t('experience.title')} - Ben Macha Ali | ORPI, CCM Benchmark, Keytchens, Matalto`,
  meta: [
    { name: 'description', content: 'Expériences professionnelles de Ben Macha Ali - Chef de projet SI chez ORPI, Lead Dev PHP chez CCM Benchmark, Tech Lead chez Keytchens, Consultant chez Matalto/Manymore. Symfony, React, Vue.js, Docker, GraphQL.' },
    { name: 'keywords', content: 'Ben Macha Ali expérience, ORPI chef de projet SI, CCM Benchmark lead dev PHP, Keytchens tech lead, Matalto consultant Symfony, Manymore développeur, Pixel Trade, Argolife, UKN' },
  ],
})
</script>
