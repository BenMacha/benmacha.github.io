<template>
  <header class="header">
    <div class="container header__inner">
      <NuxtLink to="/" class="logo pixel">
        <span class="logo__block coin-block" aria-hidden="true">?</span>
        <span><span class="logo__tilde">~/</span>benmacha<span class="blink" aria-hidden="true">█</span></span>
      </NuxtLink>

      <nav class="nav" aria-label="Main">
        <NuxtLink
          v-for="page in navPages"
          :key="page"
          :to="`/${page}`"
          class="nav__link"
        >
          <span class="nav__dot">./</span>{{ $t(`nav.${page}`) }}
        </NuxtLink>
      </nav>

      <div class="header__actions">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { navPages } from '~/data/site'
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--bg2);
  border-bottom: 3px solid var(--line);
  box-shadow: 0 4px 0 var(--shadow);
}

.header__inner {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-block: 12px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  font-size: 12px;
  color: var(--accent);
}

.logo:hover {
  color: var(--accent);
}

.logo__block {
  width: 22px;
  height: 22px;
  font-size: 9px;
  box-shadow: inset -3px -3px 0 var(--coin-dark), inset 3px 3px 0 var(--coin-light);
}

.logo__tilde {
  opacity: .6;
}

.nav {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.nav__link {
  font-size: 12px;
  font-weight: 600;
  padding: 7px 11px;
  border: 3px solid transparent;
  color: var(--nav-ink);
}

.nav__link:hover {
  color: var(--nav-ink);
  border-color: var(--nav-hover);
}

.nav__link.router-link-active {
  background: var(--coin);
  border-color: var(--navy);
  color: var(--navy);
  box-shadow: inset -3px -3px 0 var(--coin-dark);
}

.nav__dot {
  opacity: .55;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}
</style>
