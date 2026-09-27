<template>
  <ArcadeCabinet
    skin="invaders"
    title="SPACE INVADERS"
    :score="`${$t('arcade.score')} ${padScore(score)}`"
    :extra="`♥${lives}`"
    :idle="!running"
    :message="message"
    keys="← →"
    :hint="`${$t('arcade.move')} · ${$t('arcade.shoot')}`"
    pop-color="#fbd000"
    @start="start"
  >
    <canvas ref="canvas" :width="W" :height="H" @pointermove="onPointerMove" @pointerdown="shoot" />
  </ArcadeCabinet>
</template>

<script setup lang="ts">
interface Alien { x: number, y: number, row: number, on: boolean }
interface Bullet { x: number, y: number }

const W = 300
const H = 300
const SHIP_W = 24
const ROW_COLORS = ['#e52521', '#fbd000', '#5cb338', '#2496ed']
const TOTAL = 32

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

let aliens: Alien[] = []
let shots: Bullet[] = []
let bombs: Bullet[] = []
let direction = 1
let ship = W / 2 - SHIP_W / 2
let frame = 0
let baseSpeed = 0.35

const { pointer, onPointerMove } = usePointer(canvas)
const { held } = useGameKeys(() => running.value, (key, repeat) => {
  if (key === ' ' && !repeat) shoot()
})
const loop = useFixedLoop(update, draw)
const { claim } = useArcadeSlot(() => {
  if (!running.value) return
  loop.stop()
  running.value = false
  status.value = 'paused'
})

function resetWave() {
  aliens = []
  for (let row = 0; row < 4; row++) {
    for (let c = 0; c < 8; c++) aliens.push({ x: 24 + c * 32, y: 30 + row * 24, row, on: true })
  }
  direction = 1
  ship = W / 2 - SHIP_W / 2
  shots = []
  bombs = []
  frame = 0
}

function shoot() {
  if (running.value && shots.length < 2) shots.push({ x: ship + 11, y: H - 30 })
}

function start() {
  claim()
  resetWave()
  baseSpeed = 0.35
  score.value = 0
  lives.value = 3
  pointer.active = false
  running.value = true
  loop.start()
}

function update() {
  frame++
  if (held.has('ArrowLeft')) ship -= 4
  if (held.has('ArrowRight')) ship += 4
  if (pointer.active) ship = pointer.x - SHIP_W / 2
  ship = Math.max(0, Math.min(W - SHIP_W, ship))

  // Fleet movement speeds up as aliens die
  const alive = aliens.filter(a => a.on)
  const speed = baseSpeed + (TOTAL - alive.length) * 0.05
  let edge = false
  for (const a of alive) {
    a.x += direction * speed
    if (a.x < 4 || a.x > W - 24) edge = true
  }
  if (edge) {
    direction *= -1
    for (const a of alive) a.y += 10
  }

  if (frame % 40 === 0 && alive.length) {
    const shooter = alive[Math.floor(Math.random() * alive.length)]
    bombs.push({ x: shooter.x + 10, y: shooter.y + 14 })
  }

  shots = shots.map(s => ({ ...s, y: s.y - 6 })).filter(s => s.y > 0)
  bombs = bombs.map(b => ({ ...b, y: b.y + 3 })).filter(b => b.y < H)

  shots = shots.filter((s) => {
    const target = alive.find(a => a.on && s.x > a.x && s.x < a.x + 20 && s.y > a.y && s.y < a.y + 14)
    if (!target) return true
    target.on = false
    score.value += (4 - target.row) * 10
    return false
  })

  const before = bombs.length
  bombs = bombs.filter(b => !(b.x > ship && b.x < ship + SHIP_W && b.y > H - 26))
  const hit = bombs.length < before
  const landed = alive.some(a => a.on && a.y > H - 50)

  if (hit || landed) {
    lives.value = landed ? 0 : lives.value - 1
    if (lives.value <= 0) {
      running.value = false
      status.value = 'over'
      return false
    }
  }

  if (aliens.every(a => !a.on)) {
    resetWave()
    baseSpeed += 0.2
  }
}

function drawAlien(ctx: CanvasRenderingContext2D, a: Alien, legsOut: boolean) {
  const color = ROW_COLORS[a.row]
  ctx.fillStyle = color
  ctx.fillRect(a.x + 4, a.y, 12, 4)
  ctx.fillRect(a.x, a.y + 4, 20, 6)
  ctx.fillStyle = '#05070f'
  ctx.fillRect(a.x + 5, a.y + 5, 3, 3)
  ctx.fillRect(a.x + 12, a.y + 5, 3, 3)
  ctx.fillStyle = color
  ctx.fillRect(a.x + (legsOut ? 0 : 4), a.y + 10, 4, 4)
  ctx.fillRect(a.x + (legsOut ? 16 : 12), a.y + 10, 4, 4)
}

function draw() {
  const ctx = context2d(canvas)
  if (!ctx) return
  ctx.fillStyle = '#05070f'
  ctx.fillRect(0, 0, W, H)

  const legsOut = Math.floor(frame / 20) % 2 === 1
  for (const a of aliens) if (a.on) drawAlien(ctx, a, legsOut)

  ctx.fillStyle = '#00ff41'
  ctx.fillRect(ship, H - 16, SHIP_W, 8)
  ctx.fillRect(ship + 9, H - 22, 6, 6)

  ctx.fillStyle = '#fff'
  for (const s of shots) ctx.fillRect(s.x - 1, s.y, 3, 8)
  ctx.fillStyle = '#ff9900'
  for (const b of bombs) ctx.fillRect(b.x - 2, b.y, 4, 8)
}

onMounted(() => {
  resetWave()
  draw()
})
</script>
