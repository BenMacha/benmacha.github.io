<template>
  <section class="py-20">
    <div class="section-container text-center">
      <div class="reveal max-w-2xl mx-auto">
        <!-- Pixel dialog box -->
        <div class="dialog-box p-8 relative">
          <!-- Corner decorations -->
          <div class="absolute top-2 left-2 font-pixel text-[8px] text-pixel-yellow/40">&#9733;</div>
          <div class="absolute top-2 right-2 font-pixel text-[8px] text-pixel-yellow/40">&#9733;</div>
          <div class="absolute bottom-2 left-2 font-pixel text-[8px] text-pixel-yellow/40">&#9733;</div>
          <div class="absolute bottom-2 right-2 font-pixel text-[8px] text-pixel-yellow/40">&#9733;</div>

          <!-- Save point icon -->
          <div class="mb-4 flex justify-center">
            <div class="p-3 bg-pixel-yellow/10 border-2 border-pixel-yellow/40 animate-pixel-float">
              <span class="font-pixel text-2xl text-pixel-yellow">&#9733;</span>
            </div>
          </div>

          <!-- Heading -->
          <h2 class="pixel-heading font-pixel text-sm sm:text-base text-pixel-yellow mb-2 animate-pixel-blink">
            SAVE POINT REACHED!
          </h2>

          <div class="pixel-separator mx-auto max-w-xs mb-4" />

          <p class="font-pixel text-[10px] text-pixel-green mb-2">
            {{ $t('contact.title') }}
          </p>
          <p class="font-retro text-sm text-pixel-gray/70 mb-8 max-w-md mx-auto leading-relaxed">
            {{ $t('contact.description') }}
          </p>

          <!-- Contact buttons -->
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a
              :href="`mailto:${socialLinks.email}`"
              class="btn-primary font-pixel text-xs inline-flex items-center gap-2"
            >
              <Mail class="w-4 h-4" />
              {{ socialLinks.email }}
            </a>
            <a
              :href="socialLinks.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary font-pixel text-xs inline-flex items-center gap-2"
            >
              <Linkedin class="w-4 h-4" />
              LINKEDIN
            </a>
          </div>

          <!-- Pixel decoration at bottom -->
          <div class="mt-8 font-pixel text-[8px] text-pixel-gray/30">
            &#9632;&#9632;&#9632; PROGRESS SAVED &#9632;&#9632;&#9632;
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Mail, Linkedin } from 'lucide-vue-next'
import { socialLinks } from '~/data/skills'

const { setupReveal } = useScrollReveal()

onMounted(() => {
  setupReveal()
})
</script>
