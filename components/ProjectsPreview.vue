<template>
  <section class="py-20">
    <div class="section-container">
      <SectionTitle :title="$t('projects.title')" />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <a
          v-for="(project, index) in projects"
          :key="project.name"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="reveal glass-card glow-border p-6 rounded-2xl group hover:scale-[1.02] transition-all duration-300 block"
          :class="`reveal-delay-${index + 1}`"
        >
          <div class="flex items-start justify-between mb-3">
            <span class="text-2xl">{{ project.icon }}</span>
            <ExternalLink class="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" />
          </div>
          <h3 class="font-heading font-bold text-lg mb-2 group-hover:text-accent transition-colors">
            {{ project.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ project.description }}
          </p>
          <div class="mt-4 flex items-center gap-2 text-xs text-accent font-medium">
            <Github class="w-3.5 h-3.5" />
            {{ $t('projects.github.viewOn') }} GitHub
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
