<template>
  <section class="py-20">
    <div class="section-container text-center">
      <div class="reveal max-w-2xl mx-auto">
        <!-- Terminal box -->
        <div class="glass-card border border-accent/20 p-8">
          <div class="flex items-center gap-2 mb-4 text-[10px] text-accent/30 border-b border-accent/10 pb-2 justify-center">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500/60" />
            <span class="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
            <span class="w-1.5 h-1.5 rounded-full bg-green-500/60" />
            <span class="ml-2 font-mono">contact@benmacha.tn</span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-mono font-bold mb-3 text-accent">
            <span class="text-accent/30">&gt; </span>{{ $t('home.contact') }}
          </h2>
          <div class="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mb-4" />
          <p class="text-gray-400 dark:text-green-400/40 mb-8 font-mono text-sm">
            // {{ $t('home.description') }}
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { Mail, Linkedin } from 'lucide-vue-next'
import { socialLinks } from '~/data/skills'
</script>
