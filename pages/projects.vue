<template>
  <div class="pt-24 pb-20">
    <div class="section-container">
      <SectionTitle :title="$t('projects.github.title')" />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
        <a
          v-for="(project, index) in projects"
          :key="project.name"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="reveal pixel-card p-5 group block"
          :class="`reveal-delay-${Math.min(index + 1, 5)}`"
        >
          <!-- Achievement header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-pixel-yellow text-lg">★</span>
              <span class="text-2xl">{{ project.icon }}</span>
            </div>
            <div
              class="p-1.5 border-2"
              :class="isDark
                ? 'border-pixel-navy text-pixel-gray/40 group-hover:border-pixel-blue group-hover:text-pixel-blue'
                : 'border-pixel-navy/20 text-pixel-darkgray/40 group-hover:border-pixel-blue group-hover:text-pixel-blue'"
              style="box-shadow: 2px 2px 0 0 rgba(0,0,0,0.2);"
            >
              <ExternalLink class="w-3.5 h-3.5" />
            </div>
          </div>

          <!-- Content -->
          <h3
            class="font-pixel text-[10px] sm:text-xs mb-2 group-hover:text-pixel-blue transition-colors"
            :class="isDark ? 'text-pixel-white' : 'text-pixel-navy'"
          >
            {{ project.name }}
          </h3>
          <p
            class="text-sm font-retro leading-relaxed mb-4"
            :class="isDark ? 'text-pixel-gray/70' : 'text-pixel-darkgray'"
          >
            {{ project.description }}
          </p>

          <!-- Tasks if available -->
          <ul v-if="project.tasks?.length" class="space-y-1 mb-4">
            <li
              v-for="task in project.tasks"
              :key="task"
              class="text-xs font-retro flex items-start gap-2"
              :class="isDark ? 'text-pixel-gray/50' : 'text-pixel-darkgray/70'"
            >
              <span class="text-pixel-green mt-0.5">■</span>
              {{ task }}
            </li>
          </ul>

          <!-- Footer -->
          <div
            class="pt-3 border-t-2 border-dashed flex items-center gap-2 text-xs font-retro"
            :class="isDark ? 'border-pixel-navy text-pixel-blue/60' : 'border-pixel-navy/15 text-pixel-blue'"
          >
            <Github class="w-3.5 h-3.5" />
            {{ $t('projects.github.viewOn') }} GitHub
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExternalLink, Github } from 'lucide-vue-next'

const { t, tm, rt } = useI18n()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

useScrollReveal()

const projects = computed(() => {
  const raw = tm('projects.github.items') as any[]
  return raw.map((item: any) => ({
    name: rt(item.name),
    icon: rt(item.icon),
    description: rt(item.description),
    url: rt(item.url),
    tasks: item.tasks ? (item.tasks as any[]).map((task: any) => rt(task)) : undefined,
  }))
})

useHead({
  title: `${t('projects.title')} - Ben Macha Ali`,
  meta: [
    { name: 'description', content: 'Projets open source de Ben Macha Ali - UberEat PHP SDK, Symfony Bundles et plus sur GitHub.' },
  ],
})
</script>
