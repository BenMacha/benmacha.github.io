<template>
  <ArcadeCabinet
    skin="breakout"
    :title="$t('arcade.breakout')"
    :score="`${$t('arcade.score')} ${padScore(score)}`"
    :extra="`♥${lives}`"
    :idle="!running"
    :message="message"
    keys="← →"
    :hint="$t('arcade.orMouse')"
    pop-color="#fbd000"
    @start="start"
  >
    <canvas ref="canvas" :width="W" :height="H" @pointermove="onPointerMove" />
  </ArcadeCabinet>
</template>

<script setup lang="ts">
interface Brick { x: number, y: number, color: string, on: boolean }

const W = 300
const H = 300
const PAD_W = 56
const COLORS = ['#e52521', '#ff9900', '#fbd000', '#5cb338', '#2496ed']

const { t } = useI18n()
const canvas = ref<HTMLCanvasElement | null>(null)
const score = ref(0)
const lives = ref(3)
const running = ref(false)
const status = ref<'idle' | 'paused' | 'over'>('idle')
const message = computed(() => ({
  idle: t('arcade.pressStart'),
  paused: t('arcade.pause'),
  over: t('arcade.gameOver'),
}[status.value]))

let bricks: Brick[] = []
let pad = W / 2 - PAD_W / 2
let ball = { x: W / 2, y: H - 40, vx: 2.2, vy: -2.8 }
let speed = 1

const { pointer, onPointerMove } = usePointer(canvas)
const { held } = useGameKeys(() => running.value)
const loop = useFixedLoop(update, draw)
const { claim } = useArcadeSlot(() => {
  if (!running.value) return
  loop.stop()
  running.value = false
  status.value = 'paused'
})

function resetLevel() {
  bricks = []
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 8; c++) bricks.push({ x: 8 + c * 36, y: 34 + r * 16, color: COLORS[r], on: true })
  }
  pad = W / 2 - PAD_W / 2
  ball = { x: W / 2, y: H - 40, vx: 2.2, vy: -2.8 }
}

function start() {
  claim()
  resetLevel()
  speed = 1
  score.value = 0
  lives.value = 3
  pointer.active = false
  running.value = true
  loop.start()
}

function update() {
  if (held.has('ArrowLeft')) pad -= 6
  if (held.has('ArrowRight')) pad += 6
  if (pointer.active) pad = pointer.x - PAD_W / 2
  pad = Math.max(0, Math.min(W - PAD_W, pad))

  const b = ball
  b.x += b.vx * speed
  b.y += b.vy * speed
  if (b.x < 4 || b.x > W - 4) {
    b.vx *= -1
    b.x = Math.max(4, Math.min(W - 4, b.x))
  }
  if (b.y < 4) b.vy = Math.abs(b.vy)

  // Paddle: bounce angle depends on where the ball hits
  if (b.vy > 0 && b.y > H - 22 && b.y < H - 12 && b.x > pad - 4 && b.x < pad + PAD_W + 4) {
    b.vy = -Math.abs(b.vy)
    b.vx = ((b.x - pad - PAD_W / 2) / (PAD_W / 2)) * 3.2
  }

  const hit = bricks.find(k => k.on && b.x > k.x && b.x < k.x + 32 && b.y > k.y && b.y < k.y + 12)
  if (hit) {
    hit.on = false
    b.vy *= -1
    score.value += 10
  }

  if (bricks.every(k => !k.on)) {
    resetLevel()
    speed += 0.25
  }

  if (b.y > H + 10) {
    lives.value -= 1
    if (lives.value <= 0) {
      running.value = false
      status.value = 'over'
      return false
    }
    ball = { x: pad + PAD_W / 2, y: H - 40, vx: 2.2, vy: -2.8 }
  }
}

function draw() {
  const ctx = context2d(canvas)
  if (!ctx) return
  ctx.fillStyle = '#05070f'
  ctx.fillRect(0, 0, W, H)
  for (const k of bricks) if (k.on) bevelRect(ctx, k.color, k.x, k.y, 32, 12)
  bevelRect(ctx, '#e8ecff', pad, H - 18, PAD_W, 8)
  ctx.fillStyle = '#fbd000'
  ctx.fillRect(ball.x - 4, ball.y - 4, 8, 8)
}

onMounted(() => {
  resetLevel()
  draw()
})
</script>
