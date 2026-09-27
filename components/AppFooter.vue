<template>
  <footer class="footer">
    <div class="container footer__mario">
      <img src="/images/mario-sm.png" alt="" width="40" height="53" class="pixelated">
    </div>
    <div class="grass" />
    <div class="bricks">
      <div class="container footer__wrap">
        <div class="footer__panel">
          <div class="footer__brand">
            <div class="footer__prompt">
              <span class="dim">root@</span>benmacha<span class="dim">:~#</span>
            </div>
            <p class="footer__copy">© {{ year }} Ben Macha Ali // {{ $t('footer.rights') }}</p>
          </div>
          <div class="footer__links">
            <a :href="socialLinks.github" target="_blank" rel="noopener">GitHub</a>
            <a :href="socialLinks.linkedin" target="_blank" rel="noopener">LinkedIn</a>
            <a :href="`mailto:${socialLinks.email}`">Email</a>
            <a :href="socialLinks.website" target="_blank" rel="noopener">benmacha.tn</a>
          </div>
          <div class="footer__built">&lt;/&gt; {{ $t('footer.built') }}</div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { socialLinks } from '~/data/site'

const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  margin-top: 80px;
}

.footer__mario {
  display: flex;
  justify-content: flex-end;
}

.footer__mario img {
  display: block;
  width: 40px;
  height: auto;
  margin-inline-end: 40px;
}

.bricks {
  background-color: #c84c0c;
  background-image:
    linear-gradient(#000 3px, transparent 3px),
    linear-gradient(90deg, #000 3px, transparent 3px);
  background-size: 48px 24px;
  border-bottom: 3px solid #000;
}

.footer__wrap {
  padding-block: 28px;
}

.footer__panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px;
  background: #0b0e1f;
  color: #e8ecff;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer__prompt {
  font-size: 14px;
  font-weight: 700;
  color: #00ff41;
}

.dim {
  opacity: .6;
}

.footer__copy {
  margin: 0;
  font-size: 12px;
  color: #a3abd1;
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.footer__links a {
  font-size: 12px;
  padding: 7px 11px;
  border: 2px solid #3b4170;
}

.footer__built {
  flex-basis: 100%;
  padding-top: 14px;
  border-top: 2px dotted #2b3160;
  font-size: 11px;
  color: #6d76a3;
  text-align: center;
}
</style>
