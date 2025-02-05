<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Github, Linkedin, Mail } from 'lucide-vue-next'

const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-background border-t">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-6">
          <a 
            href="https://github.com/BenMacha" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub Profile"
          >
            <Github class="h-5 w-5" />
          </a>
          <a 
            href="https://www.linkedin.com/in/ben-mecha-ali" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin class="h-5 w-5" />
          </a>
          <a 
            href="mailto:contact@benmacha.tn"
            class="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Email Contact"
          >
            <Mail class="h-5 w-5" />
          </a>
        </div>
        <div class="text-sm text-muted-foreground">
          © {{ currentYear }} 
          <a 
            href="http://benmacha.tn" 
            target="_blank" 
            rel="noopener noreferrer"
            class="hover:text-foreground transition-colors"
          >
            Ben Mecha Ali
          </a>. {{ t('footer.rights') }}
        </div>
      </div>
    </div>
  </footer>
</template>