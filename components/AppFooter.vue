<template>
  <footer class="footer">
    <div class="folio mono" aria-hidden="true">— {{ folio }} —</div>
    <div class="footer__bar">
      <div class="container footer__inner">
        <p class="footer__cta">{{ $t('book.footer') }}</p>
        <nav class="footer__links" aria-label="Contact">
          <a :href="`mailto:${socialLinks.email}`">{{ socialLinks.email }}</a>
          <a :href="socialLinks.linkedin" target="_blank" rel="noopener">LinkedIn</a>
          <a :href="socialLinks.github" target="_blank" rel="noopener">GitHub</a>
          <a :href="socialLinks.cv" target="_blank">CV</a>
        </nav>
        <p class="footer__copy mono">© {{ year }} Ben Macha Ali · {{ $t('book.volume') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { socialLinks } from '~/data/site'

const { folio } = useChapter()
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  margin-top: 56px;
}

.folio {
  display: flex;
  justify-content: center;
  padding: 0 0 32px;
  font-size: 12px;
  color: var(--muted);
}

.footer__bar {
  border-top: 1px solid var(--rule);
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 28px;
  padding-block: 40px;
}

.footer__cta {
  margin: 0;
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 22px;
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  font-weight: 600;
}

.footer__copy {
  margin: 0;
  flex-basis: 100%;
  font-size: 12px;
  color: var(--muted);
}
</style>
