<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2
           bg-pixel-cream/95 border-pixel-navy/20
           dark:bg-pixel-black/95 dark:border-pixel-navy"
  >
    <nav class="section-container flex items-center justify-between h-14 sm:h-16">
      <!-- Logo - Pixel arcade style -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <span class="font-pixel text-[8px] sm:text-xs tracking-wider">
          <span class="text-pixel-yellow animate-pixel-blink">&#9654;</span>
          <span
            class="dark:text-pixel-green text-pixel-navy group-hover:text-pixel-blue transition-colors"
          >BEN_MACHA</span>
        </span>
      </NuxtLink>

      <!-- Desktop Nav - Arcade menu items -->
      <div class="hidden md:flex items-center gap-0.5">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="relative font-pixel text-[8px] px-3 py-1.5 transition-all duration-200
                 dark:text-pixel-gray text-pixel-navy/70
                 hover:text-pixel-white hover:bg-pixel-blue
                 group/link"
          active-class="!bg-pixel-blue !text-pixel-white"
        >
          <span class="opacity-0 group-hover/link:opacity-100 transition-opacity mr-0.5 text-pixel-yellow">&#9654;</span>
          {{ $t(link.label) }}
        </NuxtLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1">
        <!-- High score style -->
        <span class="hidden sm:inline font-pixel text-[7px] dark:text-pixel-yellow text-pixel-purple mr-2 animate-pixel-blink">
          HI-SCORE: 99999
        </span>
        <LanguageSwitcher />
        <ThemeToggle />

        <!-- Mobile menu button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 font-pixel text-[10px] dark:text-pixel-green text-pixel-navy
                 border-2 dark:border-pixel-navy border-pixel-navy/30
                 hover:bg-pixel-blue hover:text-pixel-white hover:border-pixel-blue
                 transition-colors"
          aria-label="Toggle menu"
        >
          <span v-if="mobileMenuOpen">&#10005;</span>
          <span v-else>&#9776;</span>
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
        class="md:hidden border-t-2
               bg-pixel-cream/98 border-pixel-navy/20
               dark:bg-pixel-black/98 dark:border-pixel-navy"
      >
        <div class="section-container py-3 flex flex-col gap-0.5">
          <!-- Menu header -->
          <div class="font-pixel text-[7px] dark:text-pixel-yellow text-pixel-purple px-4 py-1 mb-1">
            &#9472;&#9472; SELECT STAGE &#9472;&#9472;
          </div>
          <NuxtLink
            v-for="(link, index) in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-4 py-2.5 font-pixel text-[8px]
                   dark:text-pixel-gray text-pixel-navy/70
                   hover:text-pixel-white hover:bg-pixel-blue
                   border-l-2 border-transparent hover:border-pixel-yellow
                   transition-colors"
            active-class="!text-pixel-white !bg-pixel-blue !border-pixel-yellow"
            @click="mobileMenuOpen = false"
          >
            <span class="dark:text-pixel-yellow text-pixel-purple mr-2">{{ index + 1 }}.</span>
            {{ $t(link.label) }}
          </NuxtLink>
          <!-- Mobile high score -->
          <div class="px-4 pt-3 mt-2 border-t border-pixel-navy/20">
            <span class="font-pixel text-[6px] dark:text-pixel-yellow text-pixel-purple animate-pixel-blink">
              &#9733; HI-SCORE: 99999 &#9733;
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)

const navLinks = [
  { to: '/experience', label: 'nav.experience' },
  { to: '/skills', label: 'nav.skills' },
  { to: '/projects', label: 'nav.projects' },
  { to: '/education', label: 'nav.education' },
  { to: '/blog', label: 'nav.blog' },
]
</script>
