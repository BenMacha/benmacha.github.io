<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Decorative pixel stars scattered around -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <span class="absolute top-24 left-[10%] font-pixel text-[8px] text-pixel-yellow/30 animate-star-twinkle">&#9733;</span>
      <span class="absolute top-32 right-[15%] font-pixel text-[6px] text-pixel-blue/25 animate-star-twinkle" style="animation-delay: 0.5s">&#9679;</span>
      <span class="absolute top-[40%] left-[5%] font-pixel text-[10px] text-pixel-red/20 animate-pixel-float">&#9829;</span>
      <span class="absolute top-[30%] right-[8%] font-pixel text-[8px] text-pixel-green/25 animate-star-twinkle" style="animation-delay: 1s">&#9733;</span>
      <span class="absolute bottom-[30%] left-[12%] font-pixel text-[6px] text-pixel-orange/20 animate-pixel-float" style="animation-delay: 0.7s">&#9632;</span>
      <span class="absolute bottom-[25%] right-[20%] font-pixel text-[8px] text-pixel-pink/20 animate-star-twinkle" style="animation-delay: 1.5s">&#9829;</span>
      <span class="absolute top-[55%] right-[5%] font-pixel text-[10px] text-pixel-yellow/15 animate-pixel-float" style="animation-delay: 0.3s">&#9733;</span>
      <span class="absolute top-[20%] left-[30%] font-pixel text-[6px] text-pixel-green/20 animate-star-twinkle" style="animation-delay: 2s">&#9679;</span>
    </div>

    <div class="section-container relative z-10 text-center pt-20">
      <!-- Pixel Avatar -->
      <div class="mb-8">
        <div class="relative inline-block">
          <!-- Pixel frame -->
          <div class="relative p-1 border-4 dark:border-pixel-yellow border-pixel-purple
                      bg-pixel-navy/20 shadow-lg shadow-pixel-blue/10">
            <img
              src="https://avatars.githubusercontent.com/u/5999976?v=4"
              alt="Ben Macha Ali"
              class="w-28 h-28 sm:w-36 sm:h-36 pixel-avatar"
              style="image-rendering: pixelated;"
              loading="eager"
            />
            <!-- Corner pixel decorations -->
            <div class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-pixel-yellow dark:bg-pixel-yellow"></div>
            <div class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-pixel-yellow dark:bg-pixel-yellow"></div>
            <div class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-pixel-yellow dark:bg-pixel-yellow"></div>
            <div class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-pixel-yellow dark:bg-pixel-yellow"></div>
          </div>
          <!-- Player indicator -->
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2
                      font-pixel text-[6px] dark:text-pixel-green text-pixel-purple
                      dark:bg-pixel-black bg-pixel-cream px-2 border-2 dark:border-pixel-navy border-pixel-navy/30">
            P1
          </div>
        </div>
      </div>

      <!-- Game HUD Stats -->
      <div class="flex items-center justify-center gap-4 sm:gap-6 mb-6 flex-wrap">
        <div class="font-pixel text-[7px] sm:text-[8px] dark:text-pixel-green text-pixel-navy">
          LVL <span class="dark:text-pixel-yellow text-pixel-purple">99</span>
        </div>
        <div class="font-pixel text-[7px] sm:text-[8px] dark:text-pixel-green text-pixel-navy">
          EXP: <span class="dark:text-pixel-yellow text-pixel-purple">10+ YRS</span>
        </div>
        <div class="font-pixel text-[7px] sm:text-[8px] dark:text-pixel-green text-pixel-navy">
          HP: <span class="dark:text-pixel-red text-pixel-red">&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;</span>
          <span class="dark:text-pixel-yellow text-pixel-purple"> 100%</span>
        </div>
      </div>

      <!-- Name - Pixel title -->
      <div class="mb-2">
        <p class="font-pixel text-[8px] sm:text-[10px] dark:text-pixel-blue text-pixel-blue mb-3 tracking-widest uppercase">
          {{ $t('home.greeting') }}
        </p>
        <h1 class="font-pixel text-lg sm:text-2xl lg:text-3xl mb-3 leading-relaxed pixel-title">
          <span class="dark:text-pixel-white text-pixel-navy">{{ $t('home.name') }}</span>
        </h1>
      </div>

      <!-- Title -->
      <div class="mb-6">
        <p class="font-pixel text-[8px] sm:text-[10px] dark:text-pixel-yellow text-pixel-purple tracking-wider">
          {{ $t('home.title') }}
        </p>
      </div>

      <!-- Dialog box description -->
      <div class="max-w-2xl mx-auto mb-8">
        <div class="dialog-box">
          <p class="font-retro text-base sm:text-lg leading-relaxed dark:text-pixel-gray text-pixel-navy/80">
            {{ $t('home.description') }}<span class="animate-pixel-blink dark:text-pixel-green text-pixel-purple">&#9608;</span>
          </p>
        </div>
      </div>

      <!-- PRESS START CTAs -->
      <div class="flex flex-wrap items-center justify-center gap-4 mb-8">
        <a href="/CV.pdf" target="_blank" class="btn-primary font-pixel text-[8px] sm:text-[10px]">
          <Download class="w-4 h-4" />
          {{ $t('home.download') }}
        </a>
        <a :href="`mailto:${socialLinks.email}`" class="btn-secondary font-pixel text-[8px] sm:text-[10px]">
          <Mail class="w-4 h-4" />
          {{ $t('home.contact') }}
        </a>
      </div>

      <!-- PRESS START blink text -->
      <div class="font-pixel text-[8px] dark:text-pixel-yellow text-pixel-purple animate-pixel-blink mb-8">
        &#9654; PRESS START &#9664;
      </div>

      <!-- Social links - pixel icons -->
      <div class="flex items-center justify-center gap-3 mb-10">
        <a
          :href="socialLinks.github"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2.5 border-2 dark:border-pixel-navy border-pixel-navy/30
                 dark:text-pixel-gray text-pixel-navy/60
                 hover:bg-pixel-blue hover:text-pixel-white hover:border-pixel-blue
                 transition-all"
          aria-label="GitHub"
        >
          <Github class="w-4 h-4" />
        </a>
        <a
          :href="socialLinks.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2.5 border-2 dark:border-pixel-navy border-pixel-navy/30
                 dark:text-pixel-gray text-pixel-navy/60
                 hover:bg-pixel-blue hover:text-pixel-white hover:border-pixel-blue
                 transition-all"
          aria-label="LinkedIn"
        >
          <Linkedin class="w-4 h-4" />
        </a>
        <a
          :href="`mailto:${socialLinks.email}`"
          class="p-2.5 border-2 dark:border-pixel-navy border-pixel-navy/30
                 dark:text-pixel-gray text-pixel-navy/60
                 hover:bg-pixel-green hover:text-pixel-black hover:border-pixel-green
                 transition-all"
          aria-label="Email"
        >
          <Mail class="w-4 h-4" />
        </a>
      </div>

      <!-- Scroll indicator - bouncing pixel arrow -->
      <div class="mt-6">
        <div class="flex flex-col items-center gap-2">
          <span class="font-pixel text-[7px] dark:text-pixel-gray/40 text-pixel-navy/30 tracking-wider">
            {{ $t('home.scrollDown') }}
          </span>
          <span class="font-pixel text-sm dark:text-pixel-green/50 text-pixel-purple/50 animate-pixel-bounce">
            &#9660;
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Download, Mail, Github, Linkedin } from 'lucide-vue-next'
import { socialLinks } from '~/data/skills'
</script>
