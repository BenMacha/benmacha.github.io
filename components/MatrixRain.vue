<template>
  <canvas
    ref="canvas"
    class="fixed inset-0 z-0 pointer-events-none"
    :style="{ opacity: 0.35 }"
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

  // Slow down: only update every ~80ms instead of every frame (60fps = 16ms)
  let lastTime = 0
  const frameInterval = 80

  function draw(timestamp: number) {
    animationId = requestAnimationFrame(draw)

    const delta = timestamp - lastTime
    if (delta < frameInterval) return
    lastTime = timestamp - (delta % frameInterval)

    // Slower fade = longer trails
    ctx!.fillStyle = 'rgba(13, 2, 8, 0.04)'
    ctx!.fillRect(0, 0, c!.width, c!.height)

    ctx!.font = `${fontSize}px "Fira Code", monospace`

    for (let i = 0; i < drops.length; i++) {
      // Only update some columns each frame for more organic feel
      if (Math.random() > 0.6) continue

      const char = chars[Math.floor(Math.random() * chars.length)]

      // Vary brightness
      const brightness = Math.random()
      if (brightness > 0.95) {
        ctx!.fillStyle = '#FFFFFF'
        ctx!.shadowBlur = 10
        ctx!.shadowColor = '#00FF41'
      } else if (brightness > 0.8) {
        ctx!.fillStyle = '#00FF41'
        ctx!.shadowBlur = 4
        ctx!.shadowColor = '#00FF41'
      } else {
        ctx!.fillStyle = `rgba(0, 255, 65, ${0.2 + brightness * 0.4})`
        ctx!.shadowBlur = 0
        ctx!.shadowColor = 'transparent'
      }

      ctx!.fillText(char, i * fontSize, drops[i] * fontSize)

      if (drops[i] * fontSize > c!.height && Math.random() > 0.99) {
        drops[i] = 0
      }
      drops[i]++
    }
  }

  animationId = requestAnimationFrame(draw)

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
  })
})
</script>
