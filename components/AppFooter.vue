<template>
  <footer class="border-t border-gray-200/10 dark:border-white/5 mt-20">
    <div class="section-container py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Logo & Copyright -->
        <div class="flex flex-col items-center md:items-start gap-2">
          <NuxtLink to="/" class="font-heading font-bold text-xl">
            <span class="text-accent">Ben</span>Macha
          </NuxtLink>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            &copy; {{ new Date().getFullYear() }} Ben Macha Ali. {{ $t('footer.rights') }}
          </p>
        </div>

        <!-- Social Links -->
        <div class="flex items-center gap-4">
          <a
            :href="socialLinks.github"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"
            aria-label="GitHub"
          >
            <Github class="w-5 h-5" />
          </a>
          <a
            :href="socialLinks.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin class="w-5 h-5" />
          </a>
          <a
            :href="`mailto:${socialLinks.email}`"
            class="p-2 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"
            aria-label="Email"
          >
            <Mail class="w-5 h-5" />
          </a>
          <a
            :href="socialLinks.website"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"
            aria-label="Website"
          >
            <Globe class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Github, Linkedin, Mail, Globe } from 'lucide-vue-next'
import { socialLinks } from '~/data/skills'
</script>
