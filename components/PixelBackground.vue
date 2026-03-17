<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 w-full h-full pointer-events-none hidden dark:block"
    :style="{ zIndex: 0, opacity: 0.4 }"
  />
</template>

<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let lastFrameTime = 0
const TARGET_FPS = 24
const FRAME_INTERVAL = 1000 / TARGET_FPS

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
}

interface TetrisBlock {
  x: number
  y: number
  size: number
  color: string
  speed: number
  shape: number[][]
}

interface FloatingIcon {
  x: number
  y: number
  speed: number
  opacity: number
  type: 'heart' | 'star' | 'coin'
  size: number
  phase: number
}

const COLORS = {
  blue: '#29adff',
  green: '#00e436',
  yellow: '#ffec27',
  red: '#ff004d',
  pink: '#ff77a8',
  orange: '#ffa300',
  purple: '#5d275d',
  cyan: '#41a6f6',
}

const TETRIS_COLORS = [COLORS.blue, COLORS.green, COLORS.yellow, COLORS.red, COLORS.orange, COLORS.pink, COLORS.cyan]

// Simple tetris shapes (2x2 or 3x2 pixel grids)
const SHAPES = [
  [[1, 1], [1, 1]],                    // O
  [[1, 1, 1], [0, 1, 0]],              // T
  [[1, 1, 0], [0, 1, 1]],              // S
  [[0, 1, 1], [1, 1, 0]],              // Z
  [[1, 0], [1, 0], [1, 1]],            // L
  [[1, 1, 1, 1]],                       // I
]

let stars: Star[] = []
let blocks: TetrisBlock[] = []
let floatingIcons: FloatingIcon[] = []
let canvasWidth = 0
let canvasHeight = 0

function initStars(count: number) {
  stars = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() > 0.7 ? 2 : 1,
      opacity: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    })
  }
}

function spawnTetrisBlock() {
  if (blocks.length > 4) return
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  blocks.push({
    x: Math.random() * (canvasWidth - 30),
    y: -20,
    size: 4,
    color: TETRIS_COLORS[Math.floor(Math.random() * TETRIS_COLORS.length)],
    speed: 0.15 + Math.random() * 0.25,
    shape,
  })
}

function spawnFloatingIcon() {
  if (floatingIcons.length > 3) return
  const types: Array<'heart' | 'star' | 'coin'> = ['heart', 'star', 'coin']
  floatingIcons.push({
    x: Math.random() * canvasWidth,
    y: canvasHeight + 10,
    speed: 0.2 + Math.random() * 0.3,
    opacity: 0.3 + Math.random() * 0.3,
    type: types[Math.floor(Math.random() * types.length)],
    size: 4,
    phase: Math.random() * Math.PI * 2,
  })
}

function drawPixelHeart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.fillStyle = color
  // Simple pixel heart pattern
  const pattern = [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ]
  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        ctx.fillRect(x + col * s, y + row * s, s, s)
      }
    }
  }
}

function drawPixelStar(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.fillStyle = color
  const pattern = [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ]
  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        ctx.fillRect(x + col * s, y + row * s, s, s)
      }
    }
  }
}

function drawPixelCoin(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.fillStyle = color
  const pattern = [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 0, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
  ]
  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        ctx.fillRect(x + col * s, y + row * s, s, s)
      }
    }
  }
}

function render(ctx: CanvasRenderingContext2D, time: number) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // Draw twinkling stars
  for (const star of stars) {
    star.twinklePhase += star.twinkleSpeed
    const alpha = star.opacity * (0.5 + 0.5 * Math.sin(star.twinklePhase))
    ctx.fillStyle = `rgba(244, 244, 244, ${alpha})`
    ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size)
  }

  // Draw and update tetris blocks
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i]
    block.y += block.speed
    ctx.globalAlpha = 0.25
    for (let row = 0; row < block.shape.length; row++) {
      for (let col = 0; col < block.shape[row].length; col++) {
        if (block.shape[row][col]) {
          ctx.fillStyle = block.color
          ctx.fillRect(
            Math.floor(block.x + col * block.size),
            Math.floor(block.y + row * block.size),
            block.size,
            block.size,
          )
        }
      }
    }
    ctx.globalAlpha = 1
    if (block.y > canvasHeight + 20) {
      blocks.splice(i, 1)
    }
  }

  // Draw and update floating icons
  for (let i = floatingIcons.length - 1; i >= 0; i--) {
    const icon = floatingIcons[i]
    icon.y -= icon.speed
    icon.phase += 0.015
    const wobble = Math.sin(icon.phase) * 8
    ctx.globalAlpha = icon.opacity
    const drawX = Math.floor(icon.x + wobble)
    const drawY = Math.floor(icon.y)
    if (icon.type === 'heart') {
      drawPixelHeart(ctx, drawX, drawY, icon.size, COLORS.red)
    } else if (icon.type === 'star') {
      drawPixelStar(ctx, drawX, drawY, icon.size, COLORS.yellow)
    } else {
      drawPixelCoin(ctx, drawX, drawY, icon.size, COLORS.orange)
    }
    ctx.globalAlpha = 1
    if (icon.y < -30) {
      floatingIcons.splice(i, 1)
    }
  }
}

function animate(time: number) {
  const delta = time - lastFrameTime
  if (delta >= FRAME_INTERVAL) {
    lastFrameTime = time - (delta % FRAME_INTERVAL)
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    render(ctx, time)
  }
  animationId = requestAnimationFrame(animate)
}

function handleResize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  canvasWidth = window.innerWidth
  canvasHeight = window.innerHeight
  canvas.width = canvasWidth * dpr
  canvas.height = canvasHeight * dpr
  canvas.style.width = `${canvasWidth}px`
  canvas.style.height = `${canvasHeight}px`
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
  }
  // Reinit stars to fill new size
  const starCount = Math.floor((canvasWidth * canvasHeight) / 8000)
  initStars(Math.min(starCount, 150))
}

let spawnBlockInterval: ReturnType<typeof setInterval> | null = null
let spawnIconInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  animationId = requestAnimationFrame(animate)

  // Spawn tetris blocks occasionally
  spawnBlockInterval = setInterval(() => {
    if (Math.random() > 0.5) spawnTetrisBlock()
  }, 4000)

  // Spawn floating icons occasionally
  spawnIconInterval = setInterval(() => {
    if (Math.random() > 0.4) spawnFloatingIcon()
  }, 5000)
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  window.removeEventListener('resize', handleResize)
  if (spawnBlockInterval) clearInterval(spawnBlockInterval)
  if (spawnIconInterval) clearInterval(spawnIconInterval)
  stars = []
  blocks = []
  floatingIcons = []
})
</script>
