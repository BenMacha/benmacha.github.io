<template>
  <div class="pt-24 pb-20">
    <div class="section-container">
      <SectionTitle :title="$t('skills.title')" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div
          v-for="(section, index) in skillSections"
          :key="section.key"
          class="reveal glass-card glow-border p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-300"
          :class="`reveal-delay-${Math.min(index + 1, 5)}`"
        >
          <!-- Header -->
          <div class="flex items-center gap-4 mb-6">
            <div class="p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-dark transition-colors duration-300">
              <component :is="getIcon(section.icon)" class="w-6 h-6" />
            </div>
            <h3 class="font-heading font-bold text-xl">{{ $t(`skills.${section.key}`) }}</h3>
          </div>

          <!-- Skills list -->
          <div class="space-y-3">
            <div
              v-for="(skill, i) in section.skills"
              :key="skill"
              class="flex items-center gap-3"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-accent/80 transition-colors">
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Count badge -->
          <div class="mt-6 pt-4 border-t border-gray-200/10 dark:border-white/5">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ section.skills.length }} {{ $t(`skills.${section.key}`).toLowerCase() }}
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
