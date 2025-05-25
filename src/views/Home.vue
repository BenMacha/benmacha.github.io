<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Github, Globe, Linkedin, FileText } from 'lucide-vue-next'
import { socialLinks } from '../constants'
const avatar = ref(null)
const content = ref(null)
const { t } = useI18n()
</script>
<template>
  <div class="container mx-auto px-4 py-16">
    <div class="flex flex-col items-center justify-center text-center">
      <div ref="avatar" class="mb-8">
        <img
          src="https://avatars.githubusercontent.com/u/5999976"
          alt="Ben Mecha Ali"
          class="w-48 h-48 rounded-full border-4 border-primary bg-background"
        />
      </div>
      <div ref="content" class="max-w-2xl">
        <h1 class="text-4xl font-bold mb-4 text-foreground">Ben Mecha Ali</h1>
        <h2 class="text-2xl text-muted-foreground mb-6">{{ t('home.title') }}</h2>
        <p class="text-lg mb-8 text-foreground">
          {{ t('home.description') }}
        </p>
        
        <div class="flex justify-center gap-6 mb-8">
          <a :href="socialLinks.github" target="_blank" class="text-foreground hover:text-primary transition-colors">
            <Github class="w-6 h-6" />
          </a>
          <a :href="socialLinks.linkedin" target="_blank" class="text-foreground hover:text-primary transition-colors">
            <Linkedin class="w-6 h-6" />
          </a>
          <a :href="socialLinks.website" target="_blank" class="text-foreground hover:text-primary transition-colors">
            <Globe class="w-6 h-6" />
          </a>
          <router-link to="/CV.pdf" target="_blank" class="text-foreground hover:text-primary transition-colors">
            <FileText class="w-6 h-6" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
