<template>
  <div class="pt-24 pb-20">
    <div class="section-container">
      <SectionTitle :title="$t('experience.title')" />

      <!-- Quest Log Timeline -->
      <div class="relative max-w-3xl mx-auto">
        <!-- Pixel timeline line -->
        <div
          class="absolute left-4 sm:left-8 top-0 bottom-0 w-1 bg-pixel-navy/15 dark:bg-pixel-navy"
          style="background-image: repeating-linear-gradient(180deg, currentColor 0px, currentColor 4px, transparent 4px, transparent 8px);"
        />

        <div
          v-for="(item, index) in experiences"
          :key="item.company"
          class="reveal relative pl-14 sm:pl-20 pb-10 last:pb-0"
          :class="`reveal-delay-${Math.min(index + 1, 5)}`"
        >
          <!-- Pixel dot on timeline -->
          <div
            class="absolute left-2.5 sm:left-6.5 top-1 w-4 h-4 border-2 bg-pixel-yellow border-pixel-orange"
            style="box-shadow: 2px 2px 0 0 rgba(0,0,0,0.4);"
          />

          <!-- Quest Card -->
          <div class="pixel-card p-5">
            <!-- Quest header bar -->
            <div
              class="flex items-center gap-2 mb-3 text-xs pb-2 border-b-2 border-dashed
                     border-pixel-navy/15 text-pixel-darkgray/50
                     dark:border-pixel-navy dark:text-pixel-gray/50"
            >
              <span class="text-pixel-yellow">★</span>
              <span class="font-retro">QUEST #{{ String(experiences.length - index).padStart(2, '0') }}</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
              <div>
                <h3 class="font-pixel text-xs sm:text-sm text-pixel-navy dark:text-pixel-yellow">
                  {{ item.company }}
                </h3>
                <p class="font-retro text-lg mt-1 text-pixel-blue">
                  {{ item.role }}
                </p>
                <p v-if="item.location" class="text-sm font-retro flex items-center gap-1 mt-1 text-pixel-darkgray dark:text-pixel-gray/60">
                  <MapPin class="w-3 h-3" />
                  {{ item.location }}
                </p>
              </div>
              <span class="pixel-tag whitespace-nowrap self-start text-xs font-retro text-pixel-green">
                {{ item.period }}
              </span>
            </div>

            <!-- Quest objectives -->
            <ul class="space-y-1.5 mb-4">
              <li
                v-for="task in item.tasks"
                :key="task"
                class="text-sm font-retro flex items-start gap-2 text-pixel-navy dark:text-pixel-gray"
              >
                <span class="text-pixel-green mt-0.5 shrink-0">■</span>
                {{ task }}
              </li>
            </ul>

            <!-- Stack -->
            <div v-if="item.stack" class="pt-3 border-t-2 border-dashed border-pixel-navy/15 dark:border-pixel-navy">
              <p class="text-xs font-retro text-pixel-darkgray dark:text-pixel-gray/60">
                <span class="text-pixel-blue font-bold">ITEMS:</span> {{ item.stack }}
              </p>
            </div>

            <!-- Website -->
            <a
              v-if="item.website"
              :href="item.website"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 mt-3 text-xs font-retro text-pixel-blue hover:text-pixel-cyan transition-colors"
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
  const raw = tm('experience.items')
  if (!Array.isArray(raw)) return []
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
