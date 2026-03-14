<template>
  <canvas
    ref="canvas"
    class="fixed inset-0 z-0 pointer-events-none"
    :style="{ opacity: 0.4 }"
  />
</template>

<script setup lang="ts">
const canvas = ref<HTMLCanvasElement | null>(null)
let animationId: number

onMounted(() => {
  const c = canvas.value
  if (!c) return

  const ctx = c.getContext('2d')
  if (!ctx) return

  function resize() {
    c!.width = window.innerWidth
    c!.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/\\|@#$%^&*()+=~`!?;:._-'
  const fontSize = 14
  const columns = Math.floor(c.width / fontSize)
  const drops: number[] = Array(columns).fill(1)

  // Randomize initial positions
  for (let i = 0; i < drops.length; i++) {
    drops[i] = Math.random() * -100
  }

  function draw() {
    ctx!.fillStyle = 'rgba(13, 2, 8, 0.05)'
    ctx!.fillRect(0, 0, c!.width, c!.height)

    ctx!.fillStyle = '#00FF41'
    ctx!.font = `${fontSize}px "Fira Code", monospace`
    ctx!.shadowBlur = 2
    ctx!.shadowColor = '#00FF41'

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)]

      // Vary brightness
      const brightness = Math.random()
      if (brightness > 0.95) {
        ctx!.fillStyle = '#FFFFFF'
        ctx!.shadowBlur = 8
      } else if (brightness > 0.8) {
        ctx!.fillStyle = '#00FF41'
        ctx!.shadowBlur = 4
      } else {
        ctx!.fillStyle = `rgba(0, 255, 65, ${0.3 + brightness * 0.5})`
        ctx!.shadowBlur = 1
      }

      ctx!.fillText(char, i * fontSize, drops[i] * fontSize)

      if (drops[i] * fontSize > c!.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
  })
})
</script>
