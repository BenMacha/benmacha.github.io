<template>
  <nav class="langs" :aria-label="$t('language.label')">
    <template v-for="(item, i) in locales" :key="item.code">
      <span v-if="i" class="langs__dot" aria-hidden="true">·</span>
      <NuxtLink
        :to="switchLocalePath(item.code)"
        :hreflang="item.language"
        :lang="item.code"
        class="langs__btn"
        :class="{ 'is-active': item.code === locale }"
        :aria-current="item.code === locale ? 'true' : undefined"
        :title="item.name"
        @click="remember(item.code)"
      >
        {{ item.code.toUpperCase() }}
      </NuxtLink>
    </template>
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
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 6px;
  border: 1px solid var(--rule);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.langs__btn {
  padding: 6px 5px;
  color: var(--muted);
}

.langs__btn.is-active {
  color: var(--ink);
  font-weight: 800;
}

.langs__dot {
  color: var(--muted);
}
</style>
