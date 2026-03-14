<template>
  <div class="pt-24 pb-20">
    <div class="section-container">
      <SectionTitle :title="$t('skills.title')" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <div
          v-for="(section, index) in skillSections"
          :key="section.key"
          class="reveal glass-card glow-border p-6 group hover:border-accent/40 transition-all duration-300"
          :class="`reveal-delay-${Math.min(index + 1, 5)}`"
        >
          <!-- Header -->
          <div class="flex items-center gap-3 mb-5">
            <div class="p-2.5 border border-accent/20 text-accent group-hover:bg-accent/10 group-hover:border-accent/40 transition-all duration-300">
              <component :is="getIcon(section.icon)" class="w-5 h-5" />
            </div>
            <h3 class="font-mono font-bold text-base text-accent">{{ $t(`skills.${section.key}`) }}</h3>
          </div>

          <!-- Skills list -->
          <div class="space-y-2">
            <div
              v-for="skill in section.skills"
              :key="skill"
              class="flex items-center gap-3 font-mono"
            >
              <span class="text-accent/40 text-xs">&gt;</span>
              <span class="text-xs text-green-400/60 group-hover:text-green-400/80 transition-colors">
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Count badge -->
          <div class="mt-5 pt-3 border-t border-accent/10">
            <span class="text-[10px] text-green-400/25 font-mono">
              // {{ section.skills.length }} modules loaded
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Server, Layout, Smartphone, Container, TestTube2, Network,
} from 'lucide-vue-next'
import { skillSections } from '~/data/skills'

const { t } = useI18n()

useScrollReveal()

const iconMap: Record<string, any> = {
  Server, Layout, Smartphone, Container, TestTube2, Network,
}

function getIcon(name: string) {
  return iconMap[name] || Server
}

useHead({
  title: `${t('skills.title')} - Ben Macha Ali`,
  meta: [
    { name: 'description', content: 'Compétences techniques de Ben Macha Ali - PHP, Symfony, React, Vue.js, Node.js, Docker, AWS et plus.' },
  ],
})
</script>
