<template>
  <section class="py-20">
    <div class="section-container text-center">
      <div class="reveal max-w-2xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-heading font-bold mb-4">
          {{ $t('home.contact') }}
        </h2>
        <div class="w-20 h-1 bg-accent mx-auto rounded-full mb-6" />
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          {{ $t('home.description') }}
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <a
            :href="`mailto:${socialLinks.email}`"
            class="btn-primary"
          >
            <Mail class="w-4 h-4" />
            {{ socialLinks.email }}
          </a>
          <a
            :href="socialLinks.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary"
          >
            <Linkedin class="w-4 h-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Mail, Linkedin } from 'lucide-vue-next'
import { socialLinks } from '~/data/skills'
</script>
