<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Radial glow behind -->
    <div class="absolute inset-0 hero-gradient" />

    <!-- Claw marks decoration -->
    <div class="absolute top-20 right-10 sm:right-20 opacity-20 pointer-events-none">
      <svg width="120" height="120" viewBox="0 0 120 120" class="text-accent">
        <line x1="20" y1="10" x2="80" y2="100" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        <line x1="40" y1="5" x2="90" y2="95" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        <line x1="60" y1="10" x2="100" y2="90" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </div>

    <div class="absolute bottom-20 left-5 sm:left-20 opacity-15 pointer-events-none rotate-180">
      <svg width="80" height="80" viewBox="0 0 120 120" class="text-accent">
        <line x1="20" y1="10" x2="80" y2="100" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        <line x1="40" y1="5" x2="90" y2="95" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        <line x1="60" y1="10" x2="100" y2="90" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </div>

    <div class="section-container relative z-10 text-center pt-20">
      <!-- Terminal-style avatar -->
      <div class="mb-8 reveal">
        <div class="relative inline-block">
          <div class="relative">
            <img
              src="https://avatars.githubusercontent.com/u/5999976?v=4"
              alt="Ben Macha Ali"
              class="w-28 h-28 sm:w-36 sm:h-36 border-2 border-accent/50 shadow-lg shadow-accent/20 pixelated"
              style="clip-path: polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%);"
              loading="eager"
            />
            <!-- Corner brackets -->
            <div class="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-accent" />
            <div class="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-accent" />
            <div class="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-accent" />
            <div class="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-accent" />
          </div>
          <div class="absolute -bottom-3 -right-3 w-8 h-8 bg-dark border border-accent flex items-center justify-center">
            <Terminal class="w-4 h-4 text-accent" />
          </div>
        </div>
      </div>

      <!-- Glitch Title -->
      <div class="reveal reveal-delay-1">
        <p class="text-accent/60 font-mono text-xs sm:text-sm mb-3 tracking-[0.3em] uppercase">
          {{ $t('home.title') }}
        </p>
        <h1
          class="text-4xl sm:text-6xl lg:text-7xl font-mono font-bold mb-4 leading-tight glitch-text"
          data-text="Ben Macha Ali"
        >
          <span class="text-green-400">Ben Macha</span>
          <span class="glow-text"> Ali</span>
        </h1>
      </div>

      <!-- Terminal-style description -->
      <div class="reveal reveal-delay-2 max-w-2xl mx-auto mb-10">
        <div class="inline-block text-left bg-dark/80 border border-accent/15 p-4 sm:p-5">
          <div class="flex items-center gap-2 mb-2 text-[10px] text-accent/40 border-b border-accent/10 pb-2">
            <span class="w-2 h-2 rounded-full bg-red-500/80" />
            <span class="w-2 h-2 rounded-full bg-yellow-500/80" />
            <span class="w-2 h-2 rounded-full bg-green-500/80" />
            <span class="ml-2">terminal — bash</span>
          </div>
          <p class="text-green-400/70 text-sm sm:text-base leading-relaxed font-mono">
            <span class="text-accent">$</span> {{ $t('home.description') }}<span class="animate-blink text-accent">█</span>
          </p>
        </div>
      </div>

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
      <div class="reveal reveal-delay-4 flex items-center justify-center gap-3 mt-10">
        <a
          :href="socialLinks.github"
          target="_blank"
          rel="noopener noreferrer"
          class="p-3 border border-accent/15 hover:border-accent/40 hover:bg-accent/5 text-green-400/60 hover:text-accent transition-all"
          aria-label="GitHub"
        >
          <Github class="w-5 h-5" />
        </a>
        <a
          :href="socialLinks.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="p-3 border border-accent/15 hover:border-accent/40 hover:bg-accent/5 text-green-400/60 hover:text-accent transition-all"
          aria-label="LinkedIn"
        >
          <Linkedin class="w-5 h-5" />
        </a>
        <a
          :href="`mailto:${socialLinks.email}`"
          class="p-3 border border-accent/15 hover:border-accent/40 hover:bg-accent/5 text-green-400/60 hover:text-accent transition-all"
          aria-label="Email"
        >
          <Mail class="w-5 h-5" />
        </a>
      </div>

      <!-- Scroll indicator -->
      <div class="reveal reveal-delay-5 mt-16">
        <div class="flex flex-col items-center gap-2 text-accent/30">
          <span class="text-[10px] font-mono tracking-wider">SCROLL</span>
          <ChevronDown class="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Terminal, FileDown, Mail, Github, Linkedin, ChevronDown } from 'lucide-vue-next'
import { socialLinks } from '~/data/skills'
</script>
