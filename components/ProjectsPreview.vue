<template>
  <section class="py-20">
    <div class="section-container">
      <SectionTitle :title="$t('projects.sectionTitle')" />

      <!-- ACHIEVEMENTS Header -->
      <div class="text-center mb-8">
        <div class="inline-block px-4 py-2 border-2 border-pixel-yellow bg-pixel-yellow/10">
          <span class="font-pixel text-xs text-pixel-yellow animate-pixel-blink">
            &#9733; ACHIEVEMENTS UNLOCKED &#9733;
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <a
          v-for="(project, index) in projects"
          :key="project.name"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="reveal pixel-card group relative overflow-hidden hover:border-pixel-yellow/60 transition-all duration-300 block"
          :class="`reveal-delay-${index + 1}`"
        >
          <!-- Achievement unlocked banner -->
          <div class="flex items-center gap-2 mb-3 pb-2 border-b-2 border-dashed border-pixel-yellow/30">
            <span class="font-pixel text-[10px] text-pixel-yellow">
              &#9733; ACHIEVEMENT #{{ String(index + 1).padStart(2, '0') }}
            </span>
            <div class="flex-1" />
            <ExternalLink class="w-3 h-3 text-pixel-gray/40 group-hover:text-pixel-yellow transition-colors" />
          </div>

          <!-- Trophy icon and name -->
          <div class="flex items-start gap-3 mb-3">
            <div class="p-2 bg-pixel-yellow/10 border-2 border-pixel-yellow/30 flex-shrink-0">
              <span class="text-lg">{{ project.icon }}</span>
            </div>
            <div>
              <h3 class="font-pixel text-xs text-pixel-green group-hover:text-pixel-yellow transition-colors leading-relaxed">
                {{ project.name }}
              </h3>
              <p class="font-retro text-sm text-pixel-gray/70 mt-1 leading-relaxed line-clamp-2">
                {{ project.description }}
              </p>
            </div>
          </div>

          <!-- Tasks/features if available -->
          <div v-if="project.tasks && project.tasks.length > 0" class="mb-3 space-y-1">
            <div
              v-for="(task, tIdx) in project.tasks.slice(0, 2)"
              :key="tIdx"
              class="flex items-center gap-2 font-retro text-xs text-pixel-gray/50"
            >
              <span class="text-pixel-green">&#9632;</span>
              <span>{{ task }}</span>
            </div>
          </div>

          <!-- GitHub link decoration -->
          <div class="flex items-center justify-between mt-3 pt-2 border-t border-pixel-navy/30">
            <span class="font-pixel text-[8px] text-pixel-yellow/50">
              &#9733;&#9733;&#9733; UNLOCKED
            </span>
            <span class="btn-secondary font-pixel text-[8px] px-2 py-1 inline-flex items-center gap-1">
              <ExternalLink class="w-3 h-3" />
              GITHUB
            </span>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'

const { tm, rt } = useI18n()

const projects = computed(() => {
  const raw = tm('projects.list') as any[]
  return raw.map((item: any) => ({
    name: rt(item.name),
    icon: rt(item.icon),
    description: rt(item.description),
    url: rt(item.url),
    tasks: (item.tasks || []).map((t: any) => rt(t)),
  }))
})
</script>
