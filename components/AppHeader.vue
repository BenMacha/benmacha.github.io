<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      scrolled
        ? 'bg-white/80 dark:bg-dark/80 backdrop-blur-lg shadow-lg shadow-black/5 dark:shadow-black/20'
        : 'bg-transparent'
    ]"
  >
    <nav class="section-container flex items-center justify-between h-16 sm:h-20">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <img
          src="/logo.jpeg"
          alt="Ben Macha Ali"
          class="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-accent/30 group-hover:ring-accent transition-all"
        />
        <span class="font-heading font-bold text-lg sm:text-xl hidden sm:block">
          <span class="text-accent">Ben</span>Macha
        </span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-6">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium hover:text-accent transition-colors duration-200 relative group"
          active-class="text-accent"
        >
          {{ $t(link.label) }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
        </NuxtLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 sm:gap-2">
        <LanguageSwitcher />
        <ThemeToggle />

        <!-- Mobile menu button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-gray-200/10 transition-colors"
          aria-label="Toggle menu"
        >
          <X v-if="mobileMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-white/95 dark:bg-dark-50/95 backdrop-blur-lg border-t border-gray-200/10 dark:border-white/5"
      >
        <div class="section-container py-4 flex flex-col gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent/10 hover:text-accent transition-colors"
            active-class="text-accent bg-accent/5"
            @click="mobileMenuOpen = false"
          >
            {{ $t(link.label) }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'

const mobileMenuOpen = ref(false)
const scrolled = ref(false)

const navLinks = [
  { to: '/experience', label: 'nav.experience' },
  { to: '/skills', label: 'nav.skills' },
  { to: '/projects', label: 'nav.projects' },
  { to: '/education', label: 'nav.education' },
  { to: '/blog', label: 'nav.blog' },
]

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
