<template>
  <div class="cabinet" :class="`cabinet--${skin}`">
    <div class="cabinet__hud">
      <span>{{ title }}</span>
      <span ref="scoreEl" class="cabinet__score">{{ score }}</span>
      <span>{{ extra }}</span>
    </div>

    <div class="cabinet__body">
      <div class="cabinet__screen" :class="{ 'cabinet__screen--tall': tall }">
        <slot />
        <div v-if="idle" class="cabinet__overlay">
          <div class="cabinet__message">{{ message }}</div>
          <div v-if="keys || hint" class="cabinet__hint">
            <span v-if="keys" class="arrows">{{ keys }}</span> {{ hint }}
          </div>
        </div>
      </div>
      <slot name="side" />
    </div>

    <div class="cabinet__actions">
      <button type="button" class="cabinet__start" @click="$emit('start')">▶ {{ $t('arcade.start') }}</button>
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
/* A small figure plate of the book: panel, thin rule, mono captions. The screens keep
   the games' own colours. */
.cabinet {
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--panel);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
}

.cabinet__hud {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
}

.cabinet__hud > span:first-child {
  color: var(--ink);
  font-weight: 500;
}

.cabinet__score {
  display: inline-block;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.cabinet__body {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
}

.cabinet__screen {
  position: relative;
  width: 306px;
  max-width: 100%;
  aspect-ratio: 1;
  background: #0b0e14;
  border: 1px solid var(--rule);
  border-radius: 8px;
  overflow: hidden;
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
  gap: 12px;
  padding: 10px;
  text-align: center;
  background: rgba(11, 14, 20, .82);
  color: #eef1f5;
}

.cabinet__message {
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 15px;
  line-height: 1.4;
}

.cabinet__hint {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.7;
  color: #b6bdc8;
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
  min-height: 40px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--rule);
  background: transparent;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.cabinet__start:hover {
  border-color: var(--green);
  color: var(--green-ink);
}
</style>
