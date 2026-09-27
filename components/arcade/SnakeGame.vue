<template>
  <ArcadeCabinet
    skin="gameboy"
    title="SNAKE"
    :score="`${$t('arcade.score')} ${padScore(score, 3)}`"
    :extra="`${$t('arcade.best')} ${padScore(best, 3)}`"
    :idle="!running"
    :message="over ? $t('arcade.gameOver') : $t('arcade.pressStart')"
    keys="← ↑ → ↓"
    hint="/ ZQSD"
    pop-color="#e52521"
    @start="start"
  >
    <canvas ref="canvas" :width="SIZE" :height="SIZE" />
  </ArcadeCabinet>
</template>

<script setup lang="ts">
type Cell = [number, number]

const GRID = 17
const CELL = 18
const SIZE = GRID * CELL
const TICK_MS = 110

const DIRECTIONS: Record<string, Cell> = {
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  z: [0, -1], s: [0, 1], q: [-1, 0], d: [1, 0], // AZERTY
  w: [0, -1], a: [-1, 0], // QWERTY
}

const canvas = ref<HTMLCanvasElement | null>(null)
const score = ref(0)
const best = ref(0)
const running = ref(false)
const over = ref(false)

let snake: Cell[] = []
let dir: Cell = [1, 0]
let next: Cell = [1, 0]
let food: Cell | null = null
let timer: ReturnType<typeof setInterval> | undefined

const { claim } = useArcadeSlot(stop)

useGameKeys(() => running.value, (key) => {
  const d = DIRECTIONS[key]
  if (!d || (d[0] === -dir[0] && d[1] === -dir[1])) return
  next = d
})

function randomFood(): Cell {
  let cell: Cell
  do {
    cell = [Math.floor(Math.random() * GRID), Math.floor(Math.random() * GRID)]
  } while (snake.some(([x, y]) => x === cell[0] && y === cell[1]))
  return cell
}

function start() {
  claim()
  stop()
  snake = [[8, 8], [7, 8], [6, 8]]
  dir = [1, 0]
  next = [1, 0]
  food = randomFood()
  score.value = 0
  over.value = false
  running.value = true
  timer = setInterval(tick, TICK_MS)
}

function stop() {
  clearInterval(timer)
  running.value = false
}

function tick() {
  dir = next
  const [hx, hy] = snake[0]
  const head: Cell = [hx + dir[0], hy + dir[1]]
  const hitWall = head[0] < 0 || head[1] < 0 || head[0] >= GRID || head[1] >= GRID
  const hitSelf = snake.some(([x, y]) => x === head[0] && y === head[1])

  if (hitWall || hitSelf) {
    stop()
    over.value = true
    best.value = Math.max(best.value, score.value)
    return
  }

  snake.unshift(head)
  if (food && head[0] === food[0] && head[1] === food[1]) {
    score.value += 10
    food = randomFood()
  }
  else {
    snake.pop()
  }
  draw()
}

function draw() {
  const ctx = context2d(canvas)
  if (!ctx) return
  ctx.fillStyle = '#8bac0f'
  ctx.fillRect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#7a9a0c'
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      if ((i + j) % 2) ctx.fillRect(i * CELL, j * CELL, CELL, CELL)
    }
  }
  if (food) {
    ctx.fillStyle = '#e52521'
    ctx.fillRect(food[0] * CELL + 4, food[1] * CELL + 4, CELL - 8, CELL - 8)
  }
  snake.forEach(([x, y], i) => {
    ctx.fillStyle = i ? '#306230' : '#0f380f'
    ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2)
  })
}

onMounted(draw)
</script>
