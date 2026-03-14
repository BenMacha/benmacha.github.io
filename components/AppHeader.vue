<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      scrolled
        ? 'bg-dark/95 backdrop-blur-sm border-b border-accent/20'
        : 'bg-transparent'
    ]"
  >
    <nav class="section-container flex items-center justify-between h-14 sm:h-16">
      <!-- Logo - Terminal style -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <span class="text-accent font-mono text-sm sm:text-base font-bold">
          <span class="text-accent/50">~/</span><span class="group-hover:glow-text transition-all">benmacha</span><span class="animate-blink">_</span>
        </span>
      </NuxtLink>

      <!-- Desktop Nav - Terminal commands -->
      <div class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-xs font-mono px-3 py-1.5 text-green-400/70 hover:text-accent hover:bg-accent/10
                 border border-transparent hover:border-accent/20 transition-all duration-200"
          active-class="text-accent border-accent/30 bg-accent/5"
        >
          <span class="text-accent/40">./</span>{{ $t(link.label) }}
        </NuxtLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />

        <!-- Mobile menu button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 text-accent hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-colors"
          aria-label="Toggle menu"
        >
          <X v-if="mobileMenuOpen" class="w-4 h-4" />
          <Terminal v-else class="w-4 h-4" />
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
        class="md:hidden bg-dark/98 backdrop-blur-sm border-t border-accent/10"
      >
        <div class="section-container py-3 flex flex-col gap-0.5">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-4 py-2.5 text-xs font-mono text-green-400/70 hover:text-accent hover:bg-accent/5 transition-colors border-l-2 border-transparent hover:border-accent"
            active-class="text-accent border-accent bg-accent/5"
            @click="mobileMenuOpen = false"
          >
            <span class="text-accent/40 mr-1">$</span> cd {{ $t(link.label) }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { Terminal, X } from 'lucide-vue-next'

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
