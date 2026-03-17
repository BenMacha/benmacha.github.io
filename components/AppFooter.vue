<template>
  <footer class="relative mt-20">
    <!-- Pixel decorative border -->
    <div class="w-full h-2 flex">
      <div class="flex-1 bg-pixel-red"></div>
      <div class="flex-1 bg-pixel-orange"></div>
      <div class="flex-1 bg-pixel-yellow"></div>
      <div class="flex-1 bg-pixel-red"></div>
      <div class="flex-1 bg-pixel-blue"></div>
      <div class="flex-1 bg-pixel-purple"></div>
    </div>

    <div class="dark:bg-pixel-black bg-pixel-cream">
      <div class="section-container py-10">
        <!-- GAME OVER ASCII art -->
        <div class="text-center mb-8 hidden sm:block">
          <pre class="font-pixel text-[6px] sm:text-[8px] dark:text-pixel-red text-pixel-red/60 leading-relaxed inline-block text-left">
&#9484;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488;
&#9474;                                   &#9474;
&#9474;    &#9733; &#9733;  GAME  OVER  &#9733; &#9733;         &#9474;
&#9474;       THANKS FOR PLAYING         &#9474;
&#9474;                                   &#9474;
&#9474;      INSERT COIN TO CONTINUE      &#9474;
&#9474;                                   &#9474;
&#9492;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496;</pre>
        </div>

        <!-- Mobile GAME OVER -->
        <div class="text-center mb-6 sm:hidden">
          <div class="font-pixel text-[8px] dark:text-pixel-red text-pixel-red/60 animate-pixel-blink">
            &#9733; GAME OVER &#9733;
          </div>
          <div class="font-retro text-xs dark:text-pixel-gray text-pixel-navy/50 mt-1">
            THANKS FOR PLAYING
          </div>
        </div>

        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <!-- Copyright - retro style -->
          <div class="flex flex-col items-center md:items-start gap-2">
            <div class="font-pixel text-[8px] dark:text-pixel-yellow text-pixel-purple animate-pixel-blink">
              &#9829; &#9829; &#9829; INSERT COIN &#9829; &#9829; &#9829;
            </div>
            <p class="font-pixel text-[6px] sm:text-[7px] dark:text-pixel-gray text-pixel-navy/50">
              &copy; {{ new Date().getFullYear() }} BEN MACHA ALI // {{ $t('footer.rights') }}
            </p>
            <div class="font-retro text-xs dark:text-pixel-navy text-pixel-navy/30">
              &#9632; &#9632; &#9632; &#9632; &#9632; &#9632; &#9632; &#9632;
            </div>
          </div>

          <!-- Social Links - pixel buttons -->
          <div class="flex items-center gap-2">
            <a
              :href="socialLinks.github"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 border-2 dark:border-pixel-navy border-pixel-navy/30
                     dark:text-pixel-gray text-pixel-navy/60
                     hover:bg-pixel-blue hover:text-pixel-white hover:border-pixel-blue
                     transition-all font-pixel text-[8px]"
              aria-label="GitHub"
            >
              <Github class="w-4 h-4" />
            </a>
            <a
              :href="socialLinks.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 border-2 dark:border-pixel-navy border-pixel-navy/30
                     dark:text-pixel-gray text-pixel-navy/60
                     hover:bg-pixel-blue hover:text-pixel-white hover:border-pixel-blue
                     transition-all font-pixel text-[8px]"
              aria-label="LinkedIn"
            >
              <Linkedin class="w-4 h-4" />
            </a>
            <a
              :href="`mailto:${socialLinks.email}`"
              class="p-2 border-2 dark:border-pixel-navy border-pixel-navy/30
                     dark:text-pixel-gray text-pixel-navy/60
                     hover:bg-pixel-red hover:text-pixel-white hover:border-pixel-red
                     transition-all font-pixel text-[8px]"
              aria-label="Email"
            >
              <Mail class="w-4 h-4" />
            </a>
            <a
              :href="socialLinks.website"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 border-2 dark:border-pixel-navy border-pixel-navy/30
                     dark:text-pixel-gray text-pixel-navy/60
                     hover:bg-pixel-yellow hover:text-pixel-black hover:border-pixel-yellow
                     transition-all font-pixel text-[8px]"
              aria-label="Website"
            >
              <Globe class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Bottom pixel decoration -->
        <div class="mt-8 text-center">
          <div class="font-retro text-sm dark:text-pixel-navy/40 text-pixel-navy/20 mb-2">
            &#9733; BUILT WITH PIXELS &amp; PASSION &#9733;
          </div>
          <div class="font-pixel text-[6px] dark:text-pixel-navy/30 text-pixel-navy/15 tracking-widest">
            &#9829; &#9733; &#9632; &#9679; &#9632; &#9733; &#9829;
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Github, Linkedin, Mail, Globe } from 'lucide-vue-next'
import { socialLinks } from '~/data/skills'
</script>
