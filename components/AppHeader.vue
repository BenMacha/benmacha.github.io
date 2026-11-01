<template>
  <header class="header" :class="{ 'is-open': menuOpen }">
    <div class="container header__inner">
      <NuxtLink :to="localePath('/')" class="brand">
        <span class="brand__name">Ben Macha <span class="brand__accent">Ali</span></span>
        <span class="brand__vol mono">{{ $t('book.volume') }}</span>
      </NuxtLink>

      <button
        type="button"
        class="burger"
        :aria-expanded="menuOpen"
        aria-controls="site-menu"
        :aria-label="$t('book.menu')"
        @click="menuOpen = !menuOpen"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
      </button>

      <div id="site-menu" class="menu">
        <nav class="nav" :aria-label="$t('book.toc')">
          <NuxtLink
            v-for="chapter in chapters"
            :key="chapter.page"
            :to="localePath(`/${chapter.page}`)"
            class="nav__link"
          >
            <span class="nav__num mono">{{ chapter.num }}</span> {{ $t(`nav.${chapter.page}`) }}
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
import { chapters } from '~/data/site'

const route = useRoute()
const localePath = useLocalePath()
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
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--rule);
}

.header__inner {
  display: flex;
  align-items: center;
  gap: 28px;
  padding-block: 16px;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex: none;
}

.brand:hover {
  color: var(--ink);
}

.brand__name {
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -.2px;
}

.brand__accent {
  color: var(--red-ink);
}

.brand__vol {
  font-size: 12px;
  color: var(--muted);
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
  gap: 2px;
}

.nav__link {
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-2);
}

.nav__link:hover {
  color: var(--ink);
  background: var(--panel);
}

.nav__link.router-link-active {
  color: var(--ink);
  box-shadow: inset 0 -2px 0 var(--red);
  border-radius: 0;
}

.nav__num {
  font-size: 12px;
  color: var(--muted);
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
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid var(--rule);
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}

@media (max-width: 1080px) {
  .header__inner {
    flex-wrap: wrap;
    gap: 12px;
    padding-block: 12px;
  }

  .burger {
    display: inline-flex;
  }

  .menu {
    display: none;
    flex-basis: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    padding-block: 6px 10px;
  }

  .is-open .menu {
    display: flex;
  }

  .nav {
    flex-direction: column;
  }

  .nav__link {
    padding: 12px 4px;
    border-top: 1px solid var(--rule);
    border-radius: 0;
    font-size: 18px;
    font-family: var(--font-head);
    font-weight: 800;
  }

  .nav__link.router-link-active {
    box-shadow: none;
    color: var(--red-ink);
  }

  .header__actions {
    justify-content: space-between;
  }
}
</style>
