<template>
  <section class="py-20">
    <div class="section-container">
      <SectionTitle :title="$t('skills.title')" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <div
          v-for="(section, index) in skillSections"
          :key="section.key"
          class="reveal glass-card glow-border p-5 group hover:border-accent/40 transition-all duration-300"
          :class="`reveal-delay-${index + 1}`"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 border border-accent/20 text-accent group-hover:bg-accent/10 transition-colors">
              <component :is="getIcon(section.icon)" class="w-4 h-4" />
            </div>
            <h3 class="font-mono font-semibold text-sm text-accent">{{ $t(`skills.${section.key}`) }}</h3>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="skill in section.skills"
              :key="skill"
              class="px-2 py-0.5 text-[10px] font-mono
                     bg-accent/5 text-green-400/60 border border-accent/10
                     group-hover:border-accent/20 group-hover:text-accent/70 transition-colors duration-300"
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
