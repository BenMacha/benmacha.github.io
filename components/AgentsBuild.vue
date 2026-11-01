<template>
  <span ref="anchor" class="ab-anchor" hidden>
    <Teleport v-if="mounted" to="body">
      <div ref="overlay" class="ab-overlay" aria-hidden="true" />
      <div
        v-if="state"
        class="ab-status"
        :class="{ 'is-done': state.phase === 'done', 'is-hidden': hidden }"
        role="status"
        :aria-label="t('agentsBuild.label')"
        @pointerenter="holdPill"
        @pointerleave="schedulePillHide"
        @focusin="holdPill"
        @focusout="schedulePillHide"
      >
        <span class="ab-status__dot" />
        <span class="ab-status__faces" aria-hidden="true">
          <i v-for="[name, color] in crew" :key="name" :style="{ background: color }" />
        </span>
        <span class="ab-status__text">{{ statusText }}</span>
        <button v-if="state.phase === 'building'" type="button" @click="skip">{{ t('agentsBuild.skip') }}</button>
        <button v-else type="button" @click="replay">{{ t('agentsBuild.replay') }}</button>
      </div>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
/**
 * Client side only (the server renders a hidden empty span): plays the "built live by agents" intro on the page it is placed in (its parent
 * element is the root): once per browser session and page, never with reduced motion.
 * Mark sections with `data-build-stage` and blocks with `data-build` (see useAgentsBuild).
 */
import { prefersReducedMotion } from '~/composables/useMotion'
import { AGENTS, createAgentsBuild, type AgentsBuildState } from '~/composables/useAgentsBuild'

const PILL_HIDE_MS = 8000

const { t, locale } = useI18n()
const route = useRoute()

const anchor = ref<HTMLElement | null>(null)
const overlay = ref<HTMLElement | null>(null)
const state = ref<AgentsBuildState | null>(null)
const hidden = ref(false)
const mounted = ref(false)
const crew = ref(AGENTS.slice(0, 10))

let build: ReturnType<typeof createAgentsBuild> | null = null
let pillTimer = 0

const seconds = computed(() => {
  const s = state.value?.seconds
  if (s == null) return ''
  return locale.value === 'fr' ? s.toFixed(1).replace('.', ',') : s.toFixed(1)
})

const statusText = computed(() => {
  const s = state.value
  if (!s) return ''
  const agents = crew.value.length
  if (s.phase === 'building') return t('agentsBuild.building', { agents, built: s.built, total: s.total })
  return s.seconds == null
    ? t('agentsBuild.skipped', { agents, total: s.total })
    : t('agentsBuild.done', { agents, total: s.total, s: seconds.value })
})

function holdPill() {
  window.clearTimeout(pillTimer)
  hidden.value = false
}

function schedulePillHide() {
  window.clearTimeout(pillTimer)
  if (state.value?.phase !== 'done') return
  pillTimer = window.setTimeout(() => (hidden.value = true), PILL_HIDE_MS)
}

function onChange(next: AgentsBuildState) {
  state.value = next
  if (next.phase === 'done') schedulePillHide()
  else holdPill()
}

function skip() {
  build?.skip()
}

function replay() {
  window.scrollTo({ top: 0, behavior: 'instant' })
  build?.start()
}

// Any key press during the build (Escape, Tab, End…) shows the page at once
function onKeydown() {
  if (build?.running) build.skip()
}

const storageKey = () => `agents-build:${route.path}`

function alreadyPlayed() {
  try {
    if (sessionStorage.getItem(storageKey())) return true
    sessionStorage.setItem(storageKey(), '1')
  }
  catch {
    // Storage blocked: play it anyway
  }
  return false
}

onMounted(async () => {
  const root = anchor.value?.parentElement
  if (!root || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return
  if (alreadyPlayed()) return

  // The overlay and the status pill are only rendered on the client
  mounted.value = true
  await nextTick()
  if (!overlay.value || !anchor.value) return

  const small = window.matchMedia('(max-width: 639px)').matches
  crew.value = AGENTS.slice(0, small ? 5 : 10)
  build = createAgentsBuild({ root, overlay: overlay.value, agentCount: crew.value.length, onChange })
  window.addEventListener('keydown', onKeydown)

  try {
    build.start()
  }
  catch {
    build.stop()
    state.value = null
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.clearTimeout(pillTimer)
  build?.stop()
  build = null
})
</script>
