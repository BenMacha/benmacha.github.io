<template>
  <div class="pt-24 pb-20">
    <div class="section-container">
      <SectionTitle :title="$t('projects.github.title')" />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <a
          v-for="(project, index) in projects"
          :key="project.name"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="reveal glass-card glow-border p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-300 block"
          :class="`reveal-delay-${Math.min(index + 1, 5)}`"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <span class="text-3xl">{{ project.icon }}</span>
            <div class="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-dark transition-colors">
              <ExternalLink class="w-4 h-4" />
            </div>
          </div>

          <!-- Content -->
          <h3 class="font-heading font-bold text-xl mb-3 group-hover:text-accent transition-colors">
            {{ project.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ project.description }}
          </p>

          <!-- Tasks if available -->
          <ul v-if="project.tasks?.length" class="space-y-1.5 mb-4">
            <li
              v-for="task in project.tasks"
              :key="task"
              class="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2"
            >
              <span class="text-accent mt-1 text-[5px]">&#9679;</span>
              {{ task }}
            </li>
          </ul>

          <!-- Footer -->
          <div class="pt-4 border-t border-gray-200/10 dark:border-white/5 flex items-center gap-2 text-sm text-accent font-medium">
            <Github class="w-4 h-4" />
            {{ $t('projects.github.viewOn') }} GitHub
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExternalLink, Github } from 'lucide-vue-next'

const { t, tm } = useI18n()

useScrollReveal()

const projects = computed(() => {
  return tm('projects.github.items') as Array<{
    name: string
    icon: string
    description: string
    url: string
    tasks?: string[]
  }>
})

useHead({
  title: `${t('projects.title')} - Ben Macha Ali`,
  meta: [
    { name: 'description', content: 'Projets open source de Ben Macha Ali - UberEat PHP SDK, Symfony Bundles et plus sur GitHub.' },
  ],
})
</script>
