<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Sun, Moon, Briefcase, Code2, FolderGit2, GraduationCap, Menu, X } from 'lucide-vue-next'
import { ref, onMounted, watch } from 'vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const isDark = ref(localStorage.getItem('theme') === 'dark')
const isMenuOpen = ref(false)
const { t, locale } = useI18n()

// Watch for locale changes to update menu items
const menuItems = ref([
  { name: t('nav.experience'), icon: Briefcase, path: '/experience' },
  { name: t('nav.skills'), icon: Code2, path: '/skills' },
  { name: t('nav.projects'), icon: FolderGit2, path: '/projects' },
  { name: t('nav.education'), icon: GraduationCap, path: '/education' }
])

// Update menu items when locale changes
watch(locale, () => {
  menuItems.value = [
    { name: t('nav.experience'), icon: Briefcase, path: '/experience' },
    { name: t('nav.skills'), icon: Code2, path: '/skills' },
    { name: t('nav.projects'), icon: FolderGit2, path: '/projects' },
    { name: t('nav.education'), icon: GraduationCap, path: '/education' }
  ]
})

const toggleDark = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', isDark.value)
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// Apply theme on mount
onMounted(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>

<template>
  <header class="container mx-auto px-4 py-6">
    <nav class="relative">
      <div class="flex items-center justify-between">
        <router-link to="/" class="group" @click="closeMenu">
          <div class="flex flex-col">
            <span class="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:to-primary transition-all duration-300">
              Ben Mecha Ali
            </span>
            <span class="text-sm text-muted-foreground tracking-wider">{{ t('home.title') }}</span>
          </div>
        </router-link>
        
        <!-- Mobile menu button -->
        <button 
          class="md:hidden p-2 text-foreground"
          @click="toggleMenu"
          aria-label="Toggle menu"
        >
          <Menu v-if="!isMenuOpen" class="h-6 w-6" />
          <X v-else class="h-6 w-6" />
        </button>

        <!-- Desktop menu -->
        <div class="hidden md:flex items-center gap-6">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.name }}
          </router-link>
          <LanguageSwitcher />
          <button 
            @click="toggleDark" 
            class="p-2 hover:bg-accent rounded-full text-foreground"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <Sun v-if="isDark" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div 
        v-show="isMenuOpen"
        class="absolute top-full left-0 right-0 bg-background border rounded-lg shadow-lg mt-2 p-4 md:hidden z-50"
      >
        <div class="flex flex-col space-y-4">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            @click="closeMenu"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.name }}
          </router-link>
          <div class="flex items-center justify-between pt-4 border-t">
            <LanguageSwitcher />
            <button 
              @click="toggleDark" 
              class="p-2 hover:bg-accent rounded-full text-foreground"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <Sun v-if="isDark" class="h-5 w-5" />
              <Moon v-else class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>