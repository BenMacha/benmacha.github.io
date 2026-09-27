<template>
  <div class="cabinet" :class="`cabinet--${skin}`">
    <div class="cabinet__hud pixel">
      <span>{{ title }}</span>
      <span ref="scoreEl" class="cabinet__score">{{ score }}</span>
      <span>{{ extra }}</span>
    </div>

    <div class="cabinet__body">
      <div class="cabinet__screen" :class="{ 'cabinet__screen--tall': tall }">
        <slot />
        <div v-if="idle" class="cabinet__overlay pixel">
          <div class="cabinet__message">{{ message }}</div>
          <div v-if="keys || hint" class="cabinet__hint">
            <span v-if="keys" class="arrows">{{ keys }}</span> {{ hint }}
          </div>
        </div>
      </div>
      <slot name="side" />
    </div>

    <div class="cabinet__actions">
      <button type="button" class="cabinet__start pixel" @click="$emit('start')">▶ {{ $t('arcade.start') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  skin: 'gameboy' | 'tetris' | 'breakout' | 'pong' | 'invaders'
  title: string
  score: string
  extra: string
  idle: boolean
  message: string
  /** Arrow glyphs, rendered in a system font. */
  keys?: string
  hint?: string
  popColor?: string
  /** Tetris-shaped screen (half width). */
  tall?: boolean
}>()

defineEmits<{ start: [] }>()

const scoreEl = ref<HTMLElement | null>(null)

// Pop the counter whenever the score changes during a game
watch(() => props.score, () => {
  if (!props.idle) popElement(scoreEl.value, props.popColor ?? '#e52521')
})
</script>

<style scoped>
.cabinet {
  flex: 0 0 auto;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--c-bg);
  border: 3px solid #000;
  box-shadow: inset 3px 3px 0 var(--c-hi), inset -3px -3px 0 var(--c-lo), 6px 6px 0 var(--shadow);
}

.cabinet--gameboy {
  --c-bg: #9bbc0f; --c-hi: #c4df4a; --c-lo: #6b8a0a; --c-fg: #0f380f;
  --s-border: #0f380f; --s-bg: #8bac0f; --o-bg: rgba(139, 172, 15, .85); --o-fg: #0f380f; --o-hint: #0f380f;
  --b-bg: #e52521; --b-fg: #fff; --b-border: #0f380f;
}

.cabinet--tetris {
  --c-bg: #c4c0b8; --c-hi: #e6e2da; --c-lo: #8a867e; --c-fg: #1a1a2e;
  --s-border: #1a1a2e; --s-bg: #0b0e1f; --o-bg: rgba(11, 14, 31, .85); --o-fg: #fbd000; --o-hint: #e8ecff;
  --b-bg: #fbd000; --b-fg: #1a1a2e; --b-border: #1a1a2e;
}

.cabinet--breakout {
  --c-bg: #2496ed; --c-hi: #6fc0ff; --c-lo: #11579a; --c-fg: #fff;
  --s-border: #000; --s-bg: #05070f; --o-bg: rgba(5, 7, 15, .82); --o-fg: #fbd000; --o-hint: #e8ecff;
  --b-bg: #fbd000; --b-fg: #1a1a2e; --b-border: #000;
}

.cabinet--pong {
  --c-bg: #e8e4dc; --c-hi: #fff; --c-lo: #a8a49c; --c-fg: #1a1a2e;
  --s-border: #000; --s-bg: #05070f; --o-bg: rgba(5, 7, 15, .82); --o-fg: #fbd000; --o-hint: #e8ecff;
  --b-bg: #e52521; --b-fg: #fff; --b-border: #000;
}

.cabinet--invaders {
  --c-bg: #1d2140; --c-hi: #3b4170; --c-lo: #0b0e1f; --c-fg: #fff;
  --s-border: #000; --s-bg: #05070f; --o-bg: rgba(5, 7, 15, .82); --o-fg: #fbd000; --o-hint: #e8ecff;
  --b-bg: #5cb338; --b-fg: #0b0e1f; --b-border: #000;
}

.cabinet__hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 10px;
  color: var(--c-fg);
}

.cabinet__score {
  display: inline-block;
}

.cabinet__body {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.cabinet__screen {
  position: relative;
  width: 306px;
  max-width: 100%;
  aspect-ratio: 1;
  background: var(--s-bg);
  border: 3px solid var(--s-border);
  direction: ltr;
}

.cabinet__screen--tall {
  width: 156px;
  aspect-ratio: 156 / 306;
  flex: none;
}

.cabinet__screen :slotted(canvas) {
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  touch-action: none;
}

.cabinet__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 10px;
  text-align: center;
  background: var(--o-bg);
  color: var(--o-fg);
}

.cabinet__message {
  font-size: 11px;
  line-height: 1.6;
}

.cabinet__hint {
  font-size: 8px;
  line-height: 1.9;
  color: var(--o-hint);
}

.arrows {
  font-family: system-ui, sans-serif;
  font-size: 13px;
}

.cabinet__actions {
  display: flex;
  justify-content: center;
}

.cabinet__start {
  font-size: 10px;
  padding: 10px 14px;
  background: var(--b-bg);
  color: var(--b-fg);
  border: 3px solid var(--b-border);
  box-shadow: 3px 3px 0 var(--b-border);
  cursor: pointer;
}

.cabinet__start:active {
  box-shadow: none;
}
</style>
