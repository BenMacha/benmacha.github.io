<template>
  <section class="py-20">
    <div class="section-container">
      <SectionTitle :title="$t('projects.title')" />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <a
          v-for="(project, index) in projects"
          :key="project.name"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="reveal glass-card glow-border p-5 group hover:border-accent/40 transition-all duration-300 block"
          :class="`reveal-delay-${index + 1}`"
        >
          <div class="flex items-start justify-between mb-3">
            <span class="text-xl">{{ project.icon }}</span>
            <ExternalLink class="w-3.5 h-3.5 text-gray-400 dark:text-green-400/30 group-hover:text-accent transition-colors" />
          </div>
          <h3 class="font-mono font-bold text-sm mb-2 text-gray-700 dark:text-green-400/80 group-hover:text-accent transition-colors">
            {{ project.name }}
          </h3>
          <p class="text-xs text-gray-400 dark:text-green-400/40 leading-relaxed font-mono">
            {{ project.description }}
          </p>
          <div class="mt-3 flex items-center gap-2 text-[10px] text-accent/50 font-mono">
            <Github class="w-3 h-3" />
            git clone {{ project.name.toLowerCase().replace(/\s/g, '-') }}
          </div>
        </a>
      </div>

      <div class="text-center mt-10 reveal">
        <NuxtLink to="/projects" class="btn-secondary">
          <FolderGit2 class="w-4 h-4" />
          {{ $t('nav.projects') }}
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ExternalLink, Github, FolderGit2, ArrowRight } from 'lucide-vue-next'

const { tm, rt } = useI18n()

const projects = computed(() => {
  const raw = tm('projects.github.items') as any[]
  return raw.map((item: any) => ({
    name: rt(item.name),
    icon: rt(item.icon),
    description: rt(item.description),
    url: rt(item.url),
  }))
})
</script>
