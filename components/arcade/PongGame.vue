<template>
  <ArcadeCabinet
    skin="pong"
    title="PONG"
    :score="`${you} – ${cpu}`"
    extra="VS CPU"
    :idle="!running"
    :message="message"
    keys="↑ ↓"
    :hint="`${$t('arcade.orMouse')} · ${$t('arcade.points')}`"
    pop-color="#e52521"
    @start="start"
  >
    <canvas ref="canvas" :width="W" :height="H" @pointermove="onPointerMove" />
  </ArcadeCabinet>
</template>

<script setup lang="ts">
const W = 300
const H = 300
const PAD_H = 48
const WIN_SCORE = 7
const CPU_SPEED = 3.1

const { t } = useI18n()
const canvas = ref<HTMLCanvasElement | null>(null)
const you = ref(0)
const cpu = ref(0)
const running = ref(false)
const status = ref<'idle' | 'paused' | 'won' | 'lost'>('idle')
const message = computed(() => ({
  idle: t('arcade.pressStart'),
  paused: t('arcade.pause'),
  won: t('arcade.victory'),
  lost: t('arcade.gameOver'),
}[status.value]))

let player = H / 2 - PAD_H / 2
let bot = H / 2 - PAD_H / 2
let ball = { x: W / 2, y: H / 2, vx: 3, vy: 0 }

const { pointer, onPointerMove } = usePointer(canvas)
const { held } = useGameKeys(() => running.value)
const loop = useFixedLoop(update, draw)
const { claim } = useArcadeSlot(() => {
  if (!running.value) return
  loop.stop()
  running.value = false
  status.value = 'paused'
})

function serve(direction: 1 | -1) {
  ball = { x: W / 2, y: H / 2, vx: direction * 3, vy: (Math.random() * 2 - 1) * 2 }
}

function start() {
  claim()
  player = H / 2 - PAD_H / 2
  bot = H / 2 - PAD_H / 2
  you.value = 0
  cpu.value = 0
  pointer.active = false
  serve(1)
  running.value = true
  loop.start()
}

const clampPaddle = (y: number) => Math.max(0, Math.min(H - PAD_H, y))

function bounce(paddleY: number, direction: 1 | -1) {
  ball.vx = direction * Math.min(7, Math.abs(ball.vx) * 1.06)
  ball.vy = ((ball.y - paddleY - PAD_H / 2) / (PAD_H / 2)) * 4
}

function update() {
  if (held.has('ArrowUp')) player -= 5
  if (held.has('ArrowDown')) player += 5
  if (pointer.active) player = pointer.y - PAD_H / 2
  player = clampPaddle(player)

  const target = ball.y - PAD_H / 2
  bot = clampPaddle(bot + Math.max(-CPU_SPEED, Math.min(CPU_SPEED, target - bot)))

  ball.x += ball.vx
  ball.y += ball.vy
  if (ball.y < 4 || ball.y > H - 4) ball.vy *= -1

  if (ball.vx < 0 && ball.x < 22 && ball.x > 10 && ball.y > player - 4 && ball.y < player + PAD_H + 4) bounce(player, 1)
  if (ball.vx > 0 && ball.x > W - 22 && ball.x < W - 10 && ball.y > bot - 4 && ball.y < bot + PAD_H + 4) bounce(bot, -1)

  if (ball.x < -10 || ball.x > W + 10) {
    const playerScored = ball.x > W
    if (playerScored) you.value += 1
    else cpu.value += 1

    if (you.value >= WIN_SCORE || cpu.value >= WIN_SCORE) {
      running.value = false
      status.value = you.value >= WIN_SCORE ? 'won' : 'lost'
      return false
    }
    serve(playerScored ? -1 : 1)
  }
}

function draw() {
  const ctx = context2d(canvas)
  if (!ctx) return
  ctx.fillStyle = '#05070f'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#2b3160'
  for (let y = 4; y < H; y += 16) ctx.fillRect(W / 2 - 2, y, 4, 8)
  bevelRect(ctx, '#00ff41', 10, player, 8, PAD_H)
  bevelRect(ctx, '#e52521', W - 18, bot, 8, PAD_H)
  ctx.fillStyle = '#fbd000'
  ctx.fillRect(ball.x - 4, ball.y - 4, 8, 8)
}

onMounted(draw)
</script>
