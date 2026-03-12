<template>
  <section class="py-20 bg-gray-50/50 dark:bg-dark-50/50">
    <div class="section-container">
      <SectionTitle :title="$t('skills.title')" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div
          v-for="(section, index) in skillSections"
          :key="section.key"
          class="reveal glass-card glow-border p-6 rounded-2xl group hover:scale-[1.02] transition-transform duration-300"
          :class="`reveal-delay-${index + 1}`"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 rounded-lg bg-accent/10 text-accent">
              <component :is="getIcon(section.icon)" class="w-5 h-5" />
            </div>
            <h3 class="font-heading font-semibold">{{ $t(`skills.${section.key}`) }}</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in section.skills"
              :key="skill"
              class="px-3 py-1 text-xs font-medium rounded-full
                     bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300
                     group-hover:bg-accent/10 group-hover:text-accent transition-colors duration-300"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <div class="text-center mt-10 reveal">
        <NuxtLink to="/skills" class="btn-secondary">
          <Code2 class="w-4 h-4" />
          {{ $t('nav.skills') }}
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Server, Layout, Smartphone, Container, TestTube2, Network,
  Code2, ArrowRight
} from 'lucide-vue-next'
import { skillSections } from '~/data/skills'

const iconMap: Record<string, any> = {
  Server, Layout, Smartphone, Container, TestTube2, Network,
}

function getIcon(name: string) {
  return iconMap[name] || Server
}
</script>
