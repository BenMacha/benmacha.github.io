<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Github, Globe, Linkedin } from 'lucide-vue-next'
import CvGenerator from '../components/CvGenerator.vue'
import { socialLinks } from '../constants'

const avatar = ref(null)
const content = ref(null)
const { t } = useI18n()

const avatarMotion = useMotion(avatar, {
  initial: { scale: 0, opacity: 0 },
  enter: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 100, damping: 15 }
})

const contentMotion = useMotion(content, {
  initial: { y: 50, opacity: 0 },
  enter: { y: 0, opacity: 1 },
  transition: { delay: 200 }
})
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div class="flex flex-col items-center justify-center text-center">
      <div ref="avatar" class="mb-8">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ben"
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
        
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4 text-foreground">{{ t('home.contact') }}</h3>
          <p class="text-foreground">
            <a :href="'mailto:' + socialLinks.email" class="hover:text-primary">{{ socialLinks.email }}</a>
          </p>
        </div>

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
        </div>

        <CvGenerator />
      </div>
    </div>
  </div>
</template>