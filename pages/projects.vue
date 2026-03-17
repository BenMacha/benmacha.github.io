<template>
  <div class="pt-24 pb-20">
    <div class="section-container">
      <SectionTitle :title="$t('projects.github.title')" />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <a
          v-for="(project, index) in projects"
          :key="project.name"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="reveal glass-card glow-border p-6 group hover:border-accent/40 transition-all duration-300 block"
          :class="`reveal-delay-${Math.min(index + 1, 5)}`"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <span class="text-2xl">{{ project.icon }}</span>
            <div class="p-1.5 border border-accent/15 text-accent/40 group-hover:border-accent/40 group-hover:text-accent group-hover:bg-accent/5 transition-all">
              <ExternalLink class="w-3.5 h-3.5" />
            </div>
          </div>

          <!-- Content -->
          <h3 class="font-mono font-bold text-base mb-2 text-gray-700 dark:text-green-400/80 group-hover:text-accent transition-colors">
            {{ project.name }}
          </h3>
          <p class="text-xs text-gray-400 dark:text-green-400/40 leading-relaxed mb-4 font-mono">
            {{ project.description }}
          </p>

          <!-- Tasks if available -->
          <ul v-if="project.tasks?.length" class="space-y-1 mb-4">
            <li
              v-for="task in project.tasks"
              :key="task"
              class="text-[10px] text-gray-400 dark:text-green-400/30 flex items-start gap-2 font-mono"
            >
              <span class="text-accent/40 mt-0.5">&gt;</span>
              {{ task }}
            </li>
          </ul>

          <!-- Footer -->
          <div class="pt-3 border-t border-accent/10 flex items-center gap-2 text-[10px] text-accent/50 font-mono">
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
