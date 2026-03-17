<template>
  <div
    class="pointer-events-none select-none"
    :class="positionClasses"
    :style="{ width: '120px', height: '120px' }"
  >
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :style="svgTransform"
    >
      <!-- Web radial threads (pixel-stepped lines from corner) -->
      <g stroke="currentColor" stroke-width="1" :opacity="webOpacity">
        <!-- Main diagonal -->
        <line x1="0" y1="0" x2="120" y2="120" />
        <!-- Horizontal from corner -->
        <line x1="0" y1="0" x2="120" y2="0" />
        <!-- Vertical from corner -->
        <line x1="0" y1="0" x2="0" y2="120" />
        <!-- Stepped radial lines for pixel feel -->
        <polyline points="0,0 16,4 32,8 48,12 64,16 80,20 96,24 112,28 120,32" />
        <polyline points="0,0 4,16 8,32 12,48 16,64 20,80 24,96 28,112 32,120" />
        <polyline points="0,0 20,8 40,16 60,28 80,44 100,64 120,88" />
        <polyline points="0,0 8,20 16,40 28,60 44,80 64,100 88,120" />
      </g>

      <!-- Concentric web rings (pixel-stepped arcs) -->
      <g stroke="currentColor" stroke-width="1" :opacity="ringOpacity">
        <!-- Ring 1 (inner ~30px) -->
        <polyline points="30,0 28,4 24,8 20,12 16,16 12,20 8,24 4,28 0,30" />
        <!-- Ring 2 (~55px) -->
        <polyline points="55,0 52,6 48,12 42,18 36,24 30,30 24,36 18,42 12,48 6,52 0,55" />
        <!-- Ring 3 (~80px) -->
        <polyline points="80,0 76,8 72,16 64,24 56,32 48,40 40,48 32,56 24,64 16,72 8,76 0,80" />
        <!-- Ring 4 (~105px) -->
        <polyline points="105,0 100,10 94,20 86,30 76,40 66,50 56,60 46,70 36,80 26,90 16,96 8,102 0,105" />
      </g>

      <!-- Pixel spider -->
      <g :style="spiderAnimationStyle">
        <!-- Spider body -->
        <rect x="42" y="42" width="6" height="8" fill="#ff004d" />
        <!-- Spider head -->
        <rect x="43" y="39" width="4" height="4" fill="#ff004d" />
        <!-- Eyes -->
        <rect x="43" y="40" width="1" height="1" fill="#f4f4f4" />
        <rect x="46" y="40" width="1" height="1" fill="#f4f4f4" />
        <!-- Legs left -->
        <rect x="39" y="43" width="3" height="1" fill="#ff004d" />
        <rect x="38" y="42" width="1" height="1" fill="#ff004d" />
        <rect x="40" y="46" width="2" height="1" fill="#ff004d" />
        <rect x="38" y="47" width="2" height="1" fill="#ff004d" />
        <rect x="39" y="48" width="3" height="1" fill="#ff004d" />
        <rect x="37" y="49" width="2" height="1" fill="#ff004d" />
        <!-- Legs right -->
        <rect x="48" y="43" width="3" height="1" fill="#ff004d" />
        <rect x="51" y="42" width="1" height="1" fill="#ff004d" />
        <rect x="48" y="46" width="2" height="1" fill="#ff004d" />
        <rect x="50" y="47" width="2" height="1" fill="#ff004d" />
        <rect x="48" y="48" width="3" height="1" fill="#ff004d" />
        <rect x="51" y="49" width="2" height="1" fill="#ff004d" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top-left',
})

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const webOpacity = computed(() => isDark.value ? 0.25 : 0.15)
const ringOpacity = computed(() => isDark.value ? 0.18 : 0.12)

const positionClasses = computed(() => {
  switch (props.position) {
    case 'top-left':
      return 'fixed top-0 left-0'
    case 'top-right':
      return 'fixed top-0 right-0'
    case 'bottom-left':
      return 'fixed bottom-0 left-0'
    case 'bottom-right':
      return 'fixed bottom-0 right-0'
    default:
      return 'fixed top-0 left-0'
  }
})

const svgTransform = computed(() => {
  switch (props.position) {
    case 'top-left':
      return {}
    case 'top-right':
      return { transform: 'scaleX(-1)' }
    case 'bottom-left':
      return { transform: 'scaleY(-1)' }
    case 'bottom-right':
      return { transform: 'scale(-1, -1)' }
    default:
      return {}
  }
})

const spiderAnimationStyle = computed(() => ({
  animation: 'spider-crawl 12s steps(24) infinite alternate',
  transformOrigin: '0 0',
}))
</script>

<style scoped>
@keyframes spider-crawl {
  0% {
    transform: translate(0px, 0px);
  }
  25% {
    transform: translate(10px, 6px);
  }
  50% {
    transform: translate(18px, 18px);
  }
  75% {
    transform: translate(8px, 22px);
  }
  100% {
    transform: translate(24px, 30px);
  }
}
</style>
