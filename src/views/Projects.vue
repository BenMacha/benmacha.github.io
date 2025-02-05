<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { FolderGit2, ExternalLink } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const content = ref(null)
const { t, tm } = useI18n()

const contentMotion = useMotion(content, {
  initial: { y: 50, opacity: 0 },
  enter: { y: 0, opacity: 1 }
})

const projects = tm('projects.items')
const githubProjects = tm('projects.github.items')
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div ref="content" class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <FolderGit2 class="h-8 w-8" />
        {{ t('projects.title') }}
      </h1>
      <div class="space-y-8">
        <div v-for="project in projects" :key="project.name" class="border rounded-lg p-6">
          <h2 class="text-2xl font-semibold mb-2 text-foreground flex items-center gap-2">
            <span>{{ project.icon }}</span>
            {{ project.name }}
          </h2>
          <p class="text-muted-foreground mb-4">{{ project.description }}</p>
          <ul class="list-disc list-inside space-y-2 mb-4 text-foreground">
            <li v-for="task in project.tasks" :key="task">{{ task }}</li>
          </ul>
          <a 
            v-if="project.website" 
            :href="project.website" 
            target="_blank" 
            class="text-primary hover:underline inline-flex items-center gap-2"
          >
            {{ project.website.replace('https://', '') }}
            <ExternalLink class="h-4 w-4" />
          </a>
        </div>
      </div>

      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-6 text-foreground">{{ t('projects.github.title') }}</h2>
        <div class="space-y-4">
          <div v-for="project in githubProjects" :key="project.name" class="border rounded-lg p-4">
            <h3 class="text-xl font-semibold text-foreground flex items-center gap-2">
              <span>{{ project.icon }}</span>
              {{ project.name }}
            </h3>
            <p class="text-muted-foreground">{{ project.description }}</p>
            <ul v-if="project.tasks" class="list-disc list-inside space-y-2 mt-2 text-foreground">
              <li v-for="task in project.tasks" :key="task">{{ task }}</li>
            </ul>
            <a 
              v-if="project.url" 
              :href="project.url" 
              target="_blank" 
              class="text-primary hover:underline inline-flex items-center gap-2 mt-2"
            >
              {{ t('projects.github.viewOn') }} GitHub
              <ExternalLink class="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>