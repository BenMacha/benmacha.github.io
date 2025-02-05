<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Languages } from 'lucide-vue-next'
import { SUPPORTED_LOCALES } from '../i18n'
import { onMounted } from 'vue'

const { locale } = useI18n()

const localeNames = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية'
}

const switchLocale = (newLocale: string) => {
  // Update locale in i18n
  locale.value = newLocale
  
  // Save to localStorage
  localStorage.setItem('locale', newLocale)
  
  // Update HTML attributes
  document.documentElement.lang = newLocale
  document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
  
  // Force a re-render of the entire app
  window.dispatchEvent(new Event('locale-changed'))
}

// Initialize locale and direction on mount
onMounted(() => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
    switchLocale(savedLocale)
  }
})
</script>

<template>
  <div class="relative group">
    <button class="p-2 hover:bg-accent rounded-full text-foreground flex items-center gap-2">
      <Languages class="h-5 w-5" />
    </button>
    <div class="absolute right-0 mt-2 py-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
      <button
        v-for="loc in SUPPORTED_LOCALES"
        :key="loc"
        @click="switchLocale(loc)"
        class="w-full px-4 py-2 text-left hover:bg-accent text-foreground"
        :class="{ 'bg-accent/50': locale === loc }"
      >
        {{ localeNames[loc as keyof typeof localeNames] }}
      </button>
    </div>
  </div>
</template>