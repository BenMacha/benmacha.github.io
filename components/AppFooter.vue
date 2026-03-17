<template>
  <footer class="border-t border-gray-200 dark:border-accent/10 mt-20 relative">
    <div class="section-container py-10">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Terminal style copyright -->
        <div class="flex flex-col items-center md:items-start gap-2">
          <div class="font-mono text-sm">
            <span class="text-accent/50">root@</span><span class="text-accent">benmacha</span><span class="text-accent/50">:~#</span>
          </div>
          <p class="text-xs text-gray-400 dark:text-green-400/40 font-mono">
            &copy; {{ new Date().getFullYear() }} Ben Macha Ali // {{ $t('footer.rights') }}
          </p>
        </div>

        <!-- Social Links - terminal style -->
        <div class="flex items-center gap-2">
          <a
            :href="socialLinks.github"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-gray-400 dark:text-green-400/50 hover:text-accent border border-transparent hover:border-accent/20 hover:bg-accent/5 transition-all"
            aria-label="GitHub"
          >
            <Github class="w-4 h-4" />
          </a>
          <a
            :href="socialLinks.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-gray-400 dark:text-green-400/50 hover:text-accent border border-transparent hover:border-accent/20 hover:bg-accent/5 transition-all"
            aria-label="LinkedIn"
          >
            <Linkedin class="w-4 h-4" />
          </a>
          <a
            :href="`mailto:${socialLinks.email}`"
            class="p-2 text-gray-400 dark:text-green-400/50 hover:text-accent border border-transparent hover:border-accent/20 hover:bg-accent/5 transition-all"
            aria-label="Email"
          >
            <Mail class="w-4 h-4" />
          </a>
          <a
            :href="socialLinks.website"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-gray-400 dark:text-green-400/50 hover:text-accent border border-transparent hover:border-accent/20 hover:bg-accent/5 transition-all"
            aria-label="Website"
          >
            <Globe class="w-4 h-4" />
          </a>
        </div>
      </div>

      <!-- ASCII art decoration -->
      <div class="mt-6 text-center text-[10px] text-accent/15 font-mono leading-none hidden sm:block">
        <pre>╔══════════════════════════════════════════════════════════╗
║  &lt;/&gt; Built with code, coffee &amp; curiosity  //  v3.0.0   ║
╚══════════════════════════════════════════════════════════╝</pre>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Github, Linkedin, Mail, Globe } from 'lucide-vue-next'
import { socialLinks } from '~/data/skills'
</script>
