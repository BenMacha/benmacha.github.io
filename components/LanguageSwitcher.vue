<template>
  <div class="relative" ref="dropdown">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-1.5 px-2 py-1.5 text-xs font-mono text-accent/50
             hover:text-accent border border-transparent hover:border-accent/20 hover:bg-accent/5 transition-all duration-200"
    >
      <Languages class="w-3.5 h-3.5" />
      <span class="uppercase">{{ locale }}</span>
      <ChevronDown class="w-3 h-3 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-1 w-36 py-1 bg-white dark:bg-dark-100 border border-accent/20 shadow-xl shadow-accent/5 z-50"
      >
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          @click="switchLocale(loc.code)"
          class="w-full px-3 py-1.5 text-xs font-mono text-left text-gray-400 dark:text-green-400/50 hover:bg-accent/5 hover:text-accent transition-colors flex items-center gap-2"
          :class="{ 'text-accent font-semibold': locale === loc.code }"
        >
          <span class="text-accent/30">$</span> {{ loc.name }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { Languages, ChevronDown } from 'lucide-vue-next'

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
