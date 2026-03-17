<template>
  <div class="pt-24 pb-20">
    <div class="section-container">
      <SectionTitle :title="$t('skills.title')" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        <div
          v-for="(section, index) in skillSections"
          :key="section.key"
          class="reveal pixel-card p-5 group"
          :class="`reveal-delay-${Math.min(index + 1, 5)}`"
        >
          <!-- Header -->
          <div class="flex items-center gap-3 mb-5">
            <div
              class="p-2 border-2
                     border-pixel-blue/30 text-pixel-blue bg-pixel-blue/5
                     dark:border-pixel-blue/40 dark:bg-pixel-blue/10"
              style="box-shadow: 2px 2px 0 0 rgba(0,0,0,0.3);"
            >
              <component :is="getIcon(section.icon)" class="w-5 h-5" />
            </div>
            <h3 class="font-pixel text-[10px] sm:text-xs text-pixel-navy dark:text-pixel-yellow">
              {{ $t(`skills.${section.key}`) }}
            </h3>
          </div>

          <!-- Skills list with logos -->
          <div class="space-y-2.5">
            <div
              v-for="skill in section.skills"
              :key="skill.name"
              class="flex items-center gap-3 font-retro"
            >
              <img
                :src="skill.logo"
                :alt="skill.name"
                class="skill-logo w-6 h-6"
                loading="lazy"
              >
              <span class="text-base text-pixel-navy dark:text-pixel-gray">
                {{ skill.name }}
              </span>
            </div>
          </div>

          <!-- Count badge -->
          <div class="mt-5 pt-3 border-t-2 border-dashed border-pixel-navy/15 dark:border-pixel-navy">
            <span class="text-xs font-retro text-pixel-darkgray/60 dark:text-pixel-gray/50">
              ♦ {{ section.skills.length }} skills unlocked
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
