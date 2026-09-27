<template>
  <section class="hero">
    <div class="container hero__inner">
      <dl class="hud pixel">
        <div><dt>{{ $t('hero.player') }}</dt><dd>BEN MACHA</dd></div>
        <div><dt>{{ $t('hero.xp') }}</dt><dd class="hud__coin"><span class="coin" aria-hidden="true" />{{ $t('hero.years') }}</dd></div>
        <div><dt>{{ $t('hero.world') }}</dt><dd>{{ $t('hero.worldValue') }}</dd></div>
        <div><dt>{{ $t('hero.class') }}</dt><dd>{{ $t('hero.classValue') }}</dd></div>
      </dl>

      <div class="hero__main">
        <div class="hero__text">
          <p class="hero__role pixel">{{ $t('home.title') }}</p>
          <h1 ref="heroName" class="hero__name pixel">Ben Macha <span>Ali</span></h1>

          <div class="terminal">
            <div class="terminal__bar">
              <span style="background: #e52521" /><span style="background: #fbd000" /><span style="background: #5cb338" />
              <span class="terminal__label">{{ $t('hero.terminal') }}</span>
            </div>
            <p class="terminal__body">
              <span class="terminal__prompt">$</span> {{ $t('home.description') }}<span class="blink" aria-hidden="true">█</span>
            </p>
          </div>

          <div class="hero__cta">
            <a :href="socialLinks.cv" target="_blank" class="btn btn--coin">▼ {{ $t('home.download') }}</a>
            <a :href="`mailto:${socialLinks.email}`" class="btn btn--red">✉ {{ $t('home.contact') }}</a>
          </div>

          <div class="hero__links">
            <a :href="socialLinks.github" target="_blank" rel="noopener" class="link-chip">GitHub</a>
            <a :href="socialLinks.linkedin" target="_blank" rel="noopener" class="link-chip">LinkedIn</a>
            <a :href="`mailto:${socialLinks.email}`" class="link-chip">{{ socialLinks.email }}</a>
          </div>
        </div>

        <div class="hero__side">
          <div class="avatar">
            <span v-for="corner in corners" :key="corner" class="avatar__corner" :class="`avatar__corner--${corner}`" />
            <img src="/images/avatar.jpeg" alt="Ben Macha Ali" width="220" height="220" class="pixelated">
          </div>
          <div ref="blocksEl" class="blocks" aria-hidden="true">
            <span
              v-for="block in blocks"
              :key="block.label"
              class="blocks__item pixel"
              :style="{ background: block.color, color: block.ink, fontSize: block.label.length > 2 ? '12px' : '20px' }"
            >{{ block.label }}</span>
          </div>
        </div>
      </div>

      <div class="xp">
        <div class="xp__labels pixel">
          <span>{{ $t('hero.level') }}</span>
          <span class="xp__years">{{ $t('hero.xpLabel') }}</span>
        </div>
        <div class="xp__bar" role="progressbar" aria-valuemin="0" aria-valuemax="18" aria-valuenow="14">
          <span v-for="i in 18" :key="i" :class="{ 'is-full': i <= 14 }" />
        </div>
      </div>
    </div>
  </section>

  <div class="grass">
    <button
      type="button"
      class="runner"
      :title="$t('hero.jump')"
      :aria-label="$t('hero.jump')"
      @click="jump"
    >
      <img ref="mario" src="/images/mario-sm.png" alt="" width="36" height="47" class="pixelated">
    </button>
  </div>
  <div class="dirt" />
</template>

<script setup lang="ts">
import { animate, stagger } from 'motion'
import { socialLinks } from '~/data/site'

const corners = ['tl', 'tr', 'bl', 'br'] as const

const blocks = [
  { label: 'PHP', color: '#777bb4', ink: '#fff' },
  { label: '⚛', color: '#61dafb', ink: '#10132a' },
  { label: 'V', color: '#42b883', ink: '#fff' },
  { label: '🐳', color: '#2496ed', ink: '#fff' },
]

const heroName = ref<HTMLElement | null>(null)
const blocksEl = ref<HTMLElement | null>(null)
const mario = ref<HTMLElement | null>(null)

function jump() {
  if (mario.value) animate(mario.value, { y: [0, -80, 0], rotate: [0, 0, 360] }, { duration: 0.6, ease: [0.3, 0.7, 0.4, 1] })
}

onMounted(() => {
  if (prefersReducedMotion()) return
  if (heroName.value) {
    animate(heroName.value, { opacity: [0, 1], y: [-40, 0], scale: [0.9, 1] }, { type: 'spring', bounce: 0.5, duration: 0.9 })
  }
  if (blocksEl.value) {
    animate(blocksEl.value.children, { y: [-60, 0], opacity: [0, 1] }, { type: 'spring', bounce: 0.55, delay: stagger(0.09, { startDelay: 0.3 }) })
  }
})
</script>

<style scoped>
.hero {
  background-color: var(--hero-bg);
  background-image: var(--stars);
  background-size: 44px 44px;
}

.hero__inner {
  padding-block: 40px 48px;
}

/* ---- HUD ---- */
.hud {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin: 0 0 44px;
  font-size: 10px;
  line-height: 1.9;
  color: var(--hero-fg);
}

.hud dt {
  opacity: .7;
}

.hud dd {
  margin: 0;
}

.hud__coin {
  display: flex;
  align-items: center;
  gap: 8px;
}

.coin {
  width: 12px;
  height: 14px;
  background: var(--coin);
  border: 2px solid var(--navy);
  border-radius: 50%;
}

/* ---- Main ---- */
.hero__main {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 48px;
}

.hero__text {
  flex: 1 1 520px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.hero__role {
  margin: 0;
  font-size: 11px;
  line-height: 1.8;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--accent);
}

.hero__name {
  margin: 0;
  font-size: clamp(30px, 5vw, 56px);
  line-height: 1.25;
  color: var(--hero-fg);
  text-shadow: 4px 4px 0 #000;
}

.hero__name span {
  color: var(--coin);
}

.terminal {
  max-width: 640px;
  background: var(--term);
  border: 3px solid #000;
  box-shadow: 6px 6px 0 var(--shadow);
}

.terminal__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-bottom: 3px solid #000;
  background: #1d2140;
  font-size: 11px;
  color: #9aa3c7;
}

.terminal__bar > span:not(.terminal__label) {
  width: 10px;
  height: 10px;
}

.terminal__label {
  margin-inline-start: 8px;
}

.terminal__body {
  margin: 0;
  padding: 16px 18px;
  font-size: 13.5px;
  line-height: 1.75;
  color: #b9f5c6;
  text-wrap: pretty;
}

.terminal__prompt {
  color: #00ff41;
}

.hero__cta,
.hero__links {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.hero__links {
  gap: 10px;
}

/* ---- Avatar & blocks ---- */
.hero__side {
  flex: 0 1 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

.avatar {
  position: relative;
  padding: 14px;
}

.avatar img {
  display: block;
  width: 220px;
  height: 220px;
  object-fit: cover;
  border: 4px solid #000;
  box-shadow: 8px 8px 0 #000;
}

.avatar__corner {
  position: absolute;
  width: 22px;
  height: 22px;
  border: 0 solid var(--coin);
}

.avatar__corner--tl { top: 0; left: 0; border-top-width: 5px; border-left-width: 5px; }
.avatar__corner--tr { top: 0; right: 0; border-top-width: 5px; border-right-width: 5px; }
.avatar__corner--bl { bottom: 0; left: 0; border-bottom-width: 5px; border-left-width: 5px; }
.avatar__corner--br { bottom: 0; right: 0; border-bottom-width: 5px; border-right-width: 5px; }

.blocks {
  display: grid;
  grid-template-columns: repeat(4, 64px);
  margin-top: 26px;
  direction: ltr;
}

.blocks__item {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #000;
  box-shadow: inset -5px -5px 0 rgba(0, 0, 0, .3), inset 5px 5px 0 rgba(255, 255, 255, .35);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, .4);
}

.blocks__item + .blocks__item {
  margin-left: -3px;
}

/* ---- XP bar ---- */
.xp {
  max-width: 640px;
  margin-top: 48px;
}

.xp__labels {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 9px;
  line-height: 1.6;
  color: var(--hero-fg);
}

.xp__years {
  color: #7cfc5c;
}

.xp__bar {
  display: grid;
  grid-template-columns: repeat(18, 1fr);
  gap: 2px;
  padding: 3px;
  background: #000;
  border: 2px solid #000;
}

.xp__bar span {
  height: 12px;
  background: #1d2a10;
}

.xp__bar span.is-full {
  background: #7cfc5c;
  box-shadow: inset 0 -3px 0 var(--grass-dark);
}

/* ---- Mario runner ---- */
.runner {
  position: absolute;
  bottom: 100%;
  margin-bottom: 3px;
  width: 36px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  animation: run 24s linear infinite;
}

.runner img {
  display: block;
  width: 36px;
  height: auto;
}

@keyframes run {
  0% { left: -60px; transform: scaleX(1); }
  49% { left: calc(100% + 10px); transform: scaleX(1); }
  50% { left: calc(100% + 10px); transform: scaleX(-1); }
  99% { left: -60px; transform: scaleX(-1); }
  100% { left: -60px; transform: scaleX(1); }
}

.grass {
  overflow-x: clip;
}
</style>
