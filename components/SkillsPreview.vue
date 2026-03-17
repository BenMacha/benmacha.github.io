<template>
  <section class="py-20">
    <div class="section-container">
      <SectionTitle :title="$t('skills.sectionTitle')" />

      <!-- INVENTORY Header -->
      <div class="text-center mb-8">
        <div class="inline-block px-4 py-2 border-2 border-pixel-yellow bg-pixel-yellow/10">
          <span class="font-pixel text-xs text-pixel-yellow animate-pixel-blink">
            &#9733; INVENTORY &#9733;
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <div
          v-for="(section, index) in skillSections"
          :key="section.key"
          class="reveal pixel-card group"
          :class="`reveal-delay-${index + 1}`"
        >
          <!-- Category header with icon -->
          <div class="flex items-center gap-3 mb-4 pb-2 border-b-2 border-dashed border-pixel-blue/30">
            <div class="p-2 bg-pixel-navy/50 border-2 border-pixel-blue/40">
              <component :is="getIcon(section.icon)" class="w-4 h-4 text-pixel-blue" />
            </div>
            <div>
              <h3 class="font-pixel text-[10px] text-pixel-blue">{{ $t(`skills.categories.${section.key}`) }}</h3>
              <span class="font-retro text-[10px] text-pixel-gray/60">{{ section.skills.length }} ITEMS</span>
            </div>
          </div>

          <!-- Skills as pixel tags with logos -->
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="skill in section.skills"
              :key="skill.name"
              class="pixel-tag inline-flex items-center gap-1 font-retro text-xs"
            >
              <img
                :src="skill.logo"
                :alt="skill.name"
                class="w-5 h-5 pixelated"
                loading="lazy"
              />
              {{ skill.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- View all link -->
      <div class="text-center mt-10 reveal">
        <NuxtLink
          to="/skills"
          class="btn-primary font-pixel text-xs inline-flex items-center gap-2 animate-pixel-bounce"
        >
          VIEW FULL INVENTORY &gt;&gt;
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Server, Layout, Smartphone, Container, TestTube2, Network,
} from 'lucide-vue-next'
import { skillSections } from '~/data/skills'

const { setupReveal } = useScrollReveal()

const iconMap: Record<string, any> = {
  Server, Layout, Smartphone, Container, TestTube2, Network,
}

function getIcon(name: string) {
  return iconMap[name] || Server
}

onMounted(() => {
  setupReveal()
})
</script>
