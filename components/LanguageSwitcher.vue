<template>
  <div class="relative" ref="dropdown">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-1 px-2 py-1.5 font-pixel text-[8px]
             dark:text-pixel-gray text-pixel-navy/70
             border-2 dark:border-pixel-navy border-pixel-navy/30
             hover:bg-pixel-blue hover:text-pixel-white hover:border-pixel-blue
             transition-all duration-200"
    >
      <span class="uppercase">{{ locale }}</span>
      <span class="text-[6px] transition-transform inline-block" :class="{ 'rotate-180': isOpen }">&#9660;</span>
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-1 w-28 py-1 z-50
               border-2 dark:border-pixel-navy border-pixel-navy/30
               dark:bg-pixel-black bg-pixel-cream
               shadow-lg"
      >
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          @click="switchLocale(loc.code)"
          class="w-full px-3 py-1.5 font-pixel text-[8px] text-left
                 dark:text-pixel-gray text-pixel-navy/70
                 hover:bg-pixel-blue hover:text-pixel-white
                 transition-colors flex items-center gap-2"
          :class="{
            'dark:!text-pixel-yellow !text-pixel-purple dark:bg-pixel-navy/30 bg-pixel-navy/10': locale === loc.code
          }"
        >
          <span class="text-[6px]" :class="locale === loc.code ? 'text-pixel-yellow' : 'opacity-40'">&#9654;</span>
          {{ loc.name }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale, locales } = useI18n()
const isOpen = ref(false)
const dropdown = ref<HTMLElement | null>(null)

const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string; dir: string }>)
)

function switchLocale(code: string) {
  setLocale(code)
  isOpen.value = false

  const localeData = availableLocales.value.find(l => l.code === code)
  if (localeData) {
    document.documentElement.dir = localeData.dir || 'ltr'
    document.documentElement.lang = code
  }
}

function handleClickOutside(event: MouseEvent) {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  const localeData = availableLocales.value.find(l => l.code === locale.value)
  if (localeData) {
    document.documentElement.dir = localeData.dir || 'ltr'
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
