<template>
  <ArcadeCabinet
    skin="tetris"
    title="TETRIS"
    :score="`${$t('arcade.score')} ${padScore(score)}`"
    :extra="`${$t('arcade.lines')} ${padScore(lines, 2)}`"
    :idle="!running"
    :message="over ? $t('arcade.gameOver') : $t('arcade.pressStart')"
    pop-color="#e52521"
    tall
    @start="start"
  >
    <canvas ref="canvas" :width="COLS * CELL" :height="ROWS * CELL" />

    <template #side>
      <ul class="controls pixel">
        <li>{{ $t('arcade.best') }}<br>{{ padScore(best) }}</li>
        <li><span class="arrows">← →</span> {{ $t('arcade.move') }}</li>
        <li><span class="arrows">↑</span> {{ $t('arcade.rotate') }}</li>
        <li><span class="arrows">↓</span> {{ $t('arcade.down') }}</li>
        <li>{{ $t('arcade.drop') }}</li>
      </ul>
    </template>
  </ArcadeCabinet>
</template>

<script setup lang="ts">
type Matrix = number[][]
interface Piece { m: Matrix, color: string, x: number, y: number }

const COLS = 10
const ROWS = 20
const CELL = 15
const DROP_MS = 500
const LINE_POINTS = [0, 100, 300, 500, 800]

const SHAPES: { color: string, m: Matrix }[] = [
  { color: '#38bdf8', m: [[1, 1, 1, 1]] },
  { color: '#fbd000', m: [[1, 1], [1, 1]] },
  { color: '#9f5de2', m: [[0, 1, 0], [1, 1, 1]] },
  { color: '#5cb338', m: [[0, 1, 1], [1, 1, 0]] },
  { color: '#e52521', m: [[1, 1, 0], [0, 1, 1]] },
  { color: '#2496ed', m: [[1, 0, 0], [1, 1, 1]] },
  { color: '#ff9900', m: [[0, 0, 1], [1, 1, 1]] },
]

const canvas = ref<HTMLCanvasElement | null>(null)
const score = ref(0)
const lines = ref(0)
const best = ref(0)
const running = ref(false)
const over = ref(false)

let board: (string | null)[][] = emptyBoard()
let piece: Piece | null = null
let timer: ReturnType<typeof setInterval> | undefined

const { claim } = useArcadeSlot(stop)

useGameKeys(() => running.value, (key) => {
  if (!piece) return
  if (key === 'ArrowLeft' || key === 'q') tryMove(-1, 0)
  else if (key === 'ArrowRight' || key === 'd') tryMove(1, 0)
  else if (key === 'ArrowDown' || key === 's') return step()
  else if (key === 'ArrowUp' || key === 'z') rotate()
  else if (key === ' ') hardDrop()
  else return
  draw()
})

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array<string | null>(COLS).fill(null))
}

function collides(m: Matrix, x: number, y: number): boolean {
  return m.some((row, r) => row.some((filled, c) => {
    if (!filled) return false
    const X = x + c
    const Y = y + r
    return X < 0 || X >= COLS || Y >= ROWS || (Y >= 0 && board[Y][X] !== null)
  }))
}

function spawn() {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  piece = { m: shape.m.map(row => [...row]), color: shape.color, x: Math.floor((COLS - shape.m[0].length) / 2), y: 0 }
  if (collides(piece.m, piece.x, piece.y)) {
    piece = null
    stop()
    over.value = true
    best.value = Math.max(best.value, score.value)
  }
}

function lock() {
  if (!piece) return
  const { m, x, y, color } = piece
  m.forEach((row, r) => row.forEach((filled, c) => {
    if (filled && y + r >= 0) board[y + r][x + c] = color
  }))
  const kept = board.filter(row => row.some(cell => cell === null))
  const cleared = ROWS - kept.length
  board = [...emptyBoard().slice(0, cleared), ...kept]
  if (cleared) {
    lines.value += cleared
    score.value += LINE_POINTS[cleared]
  }
  spawn()
}

function tryMove(dx: number, dy: number): boolean {
  if (!piece || collides(piece.m, piece.x + dx, piece.y + dy)) return false
  piece.x += dx
  piece.y += dy
  return true
}

function rotate() {
  if (!piece) return
  const rotated = piece.m[0].map((_, i) => piece!.m.map(row => row[i]).reverse())
  for (const kick of [0, -1, 1, -2, 2]) {
    if (!collides(rotated, piece.x + kick, piece.y)) {
      piece.m = rotated
      piece.x += kick
      return
    }
  }
}

function hardDrop() {
  while (tryMove(0, 1));
  lock()
}

function step() {
  if (!piece) return
  if (!tryMove(0, 1)) lock()
  draw()
}

function start() {
  claim()
  stop()
  board = emptyBoard()
  score.value = 0
  lines.value = 0
  over.value = false
  running.value = true
  spawn()
  timer = setInterval(step, DROP_MS)
  draw()
}

function stop() {
  clearInterval(timer)
  running.value = false
}

function draw() {
  const ctx = context2d(canvas)
  if (!ctx) return
  ctx.fillStyle = '#0b0e1f'
  ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL)
  ctx.fillStyle = '#161a33'
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) ctx.fillRect(i * CELL + 7, j * CELL + 7, 1, 1)
  }

  const cell = (i: number, j: number, color: string) => {
    const x = i * CELL
    const y = j * CELL
    ctx.fillStyle = color
    ctx.fillRect(x, y, CELL, CELL)
    ctx.fillStyle = 'rgba(255,255,255,.35)'
    ctx.fillRect(x, y, CELL, 3)
    ctx.fillRect(x, y, 3, CELL)
    ctx.fillStyle = 'rgba(0,0,0,.35)'
    ctx.fillRect(x, y + CELL - 3, CELL, 3)
    ctx.fillRect(x + CELL - 3, y, 3, CELL)
  }

  board.forEach((row, j) => row.forEach((color, i) => color && cell(i, j, color)))
  if (piece) {
    const { m, x, y, color } = piece
    m.forEach((row, r) => row.forEach((filled, c) => {
      if (filled && y + r >= 0) cell(x + c, y + r, color)
    }))
  }
}

onMounted(draw)
</script>

<style scoped>
.controls {
  width: 96px;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 8px;
  line-height: 2;
  color: #1a1a2e;
}

.arrows {
  font-family: system-ui, sans-serif;
  font-size: 13px;
}
</style>
