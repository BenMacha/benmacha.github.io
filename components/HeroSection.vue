<template>
  <section class="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
    <!-- Animated particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        v-for="i in 6"
        :key="i"
        class="absolute rounded-full bg-accent/10 animate-float"
        :style="{
          width: `${20 + i * 15}px`,
          height: `${20 + i * 15}px`,
          left: `${10 + i * 15}%`,
          top: `${10 + i * 12}%`,
          animationDelay: `${i * 0.8}s`,
          animationDuration: `${5 + i}s`,
        }"
      />
    </div>

    <div class="section-container relative z-10 text-center pt-20">
      <!-- Avatar -->
      <div class="mb-8 reveal">
        <div class="relative inline-block">
          <img
            src="https://avatars.githubusercontent.com/u/5999976?v=4"
            alt="Ben Macha Ali"
            class="w-28 h-28 sm:w-36 sm:h-36 rounded-full ring-4 ring-accent/30 shadow-2xl shadow-accent/10"
            loading="eager"
          />
          <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
            <Code2 class="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <!-- Title -->
      <div class="reveal reveal-delay-1">
        <p class="text-accent font-medium mb-2 text-sm sm:text-base tracking-wider uppercase">
          {{ $t('home.title') }}
        </p>
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold mb-4 leading-tight">
          Ben Macha
          <span class="text-gradient"> Ali</span>
        </h1>
      </div>

      <!-- Description -->
      <p class="reveal reveal-delay-2 max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-10 leading-relaxed">
        {{ $t('home.description') }}
      </p>

      <!-- CTAs -->
      <div class="reveal reveal-delay-3 flex flex-wrap items-center justify-center gap-4">
        <a href="/CV.pdf" target="_blank" class="btn-primary">
          <FileDown class="w-4 h-4" />
          {{ $t('home.download') }}
        </a>
        <a :href="`mailto:${socialLinks.email}`" class="btn-secondary">
          <Mail class="w-4 h-4" />
          {{ $t('home.contact') }}
        </a>
      </div>

      <!-- Social links -->
      <div class="reveal reveal-delay-4 flex items-center justify-center gap-4 mt-10">
        <a
          :href="socialLinks.github"
          target="_blank"
          rel="noopener noreferrer"
          class="p-3 rounded-xl glass-card hover:text-accent hover:border-accent/30 transition-all"
          aria-label="GitHub"
        >
          <Github class="w-5 h-5" />
        </a>
        <a
          :href="socialLinks.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="p-3 rounded-xl glass-card hover:text-accent hover:border-accent/30 transition-all"
          aria-label="LinkedIn"
        >
          <Linkedin class="w-5 h-5" />
        </a>
        <a
          :href="`mailto:${socialLinks.email}`"
          class="p-3 rounded-xl glass-card hover:text-accent hover:border-accent/30 transition-all"
          aria-label="Email"
        >
          <Mail class="w-5 h-5" />
        </a>
      </div>

      <!-- Scroll indicator -->
      <div class="reveal reveal-delay-5 mt-16 animate-bounce">
        <ChevronDown class="w-6 h-6 mx-auto text-accent/50" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Code2, FileDown, Mail, Github, Linkedin, ChevronDown } from 'lucide-vue-next'
import { socialLinks } from '~/data/skills'
</script>
