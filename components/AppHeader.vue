<template>
  <header class="header" :class="{ 'is-open': menuOpen }">
    <div class="container header__inner">
      <NuxtLink to="/" class="logo pixel">
        <span class="logo__block coin-block" aria-hidden="true">?</span>
        <span><span class="logo__tilde">~/</span>benmacha<span class="blink" aria-hidden="true">█</span></span>
      </NuxtLink>

      <button
        type="button"
        class="burger"
        :aria-expanded="menuOpen"
        aria-controls="site-menu"
        :aria-label="$t('menu.toggle')"
        @click="menuOpen = !menuOpen"
      >
        <span /><span /><span />
      </button>

      <div id="site-menu" class="menu">
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
    </div>
  </header>
</template>

<script setup lang="ts">
import { navPages } from '~/data/site'

const route = useRoute()
const menuOpen = ref(false)

// Close the mobile menu after navigating or on Escape
watch(() => route.fullPath, () => {
  menuOpen.value = false
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
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
  gap: 16px;
  padding-block: 12px;
}

.logo {
  direction: ltr;
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

.menu {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
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

.burger {
  display: none;
  margin-inline-start: auto;
  width: 44px;
  height: 40px;
  padding: 8px 9px;
  flex-direction: column;
  justify-content: space-between;
  background: var(--coin);
  border: 3px solid var(--navy);
  box-shadow: inset -3px -3px 0 var(--coin-dark), 3px 3px 0 var(--shadow);
  cursor: pointer;
}

.burger span {
  display: block;
  height: 3px;
  background: var(--navy);
  transition: transform .2s, opacity .2s;
}

.is-open .burger span:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}

.is-open .burger span:nth-child(2) {
  opacity: 0;
}

.is-open .burger span:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

/* Mobile: logo + burger, the menu unfolds below */
@media (max-width: 1000px) {
  .header__inner {
    flex-wrap: wrap;
    padding-block: 10px;
  }

  .burger {
    display: flex;
  }

  .menu {
    display: none;
    flex-basis: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    padding-block: 6px 4px;
  }

  .is-open .menu {
    display: flex;
  }

  .nav {
    flex-direction: column;
    gap: 4px;
  }

  .nav__link {
    font-size: 14px;
    padding: 12px 14px;
    border-color: var(--nav-hover);
  }

  .header__actions {
    justify-content: space-between;
  }
}
</style>
