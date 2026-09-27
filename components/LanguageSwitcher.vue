<template>
  <nav class="langs" :aria-label="$t('language.label')">
    <NuxtLink
      v-for="item in locales"
      :key="item.code"
      :to="switchLocalePath(item.code)"
      :hreflang="item.language"
      :lang="item.code"
      class="langs__btn pixel"
      :class="{ 'is-active': item.code === locale }"
      :aria-current="item.code === locale ? 'true' : undefined"
      :title="item.name"
      @click="remember(item.code)"
    >
      {{ item.code.toUpperCase() }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { LOCALE_COOKIE } from '~/data/site'

// Real links to the translated page: crawlable, and they work without JavaScript
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const savedLocale = useCookie(LOCALE_COOKIE, { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })

function remember(code: string) {
  savedLocale.value = code
}
</script>

<style scoped>
.langs {
  display: flex;
  border: 3px solid var(--line);
  background: var(--card);
}

.langs__btn {
  font-size: 9px;
  padding: 8px 9px;
  border: none;
  cursor: pointer;
  background: transparent;
  color: var(--nav-ink);
}

.langs__btn.is-active {
  background: #00ff41;
  color: #0b0e1f;
}
</style>
