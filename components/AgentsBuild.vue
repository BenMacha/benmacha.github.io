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
 * element is the root): on every load of the page, never with reduced motion.
 * Mark sections with `data-build-stage` and blocks with `data-build` (see useAgentsBuild).
 */
import { prefersReducedMotion } from '~/composables/useMotion'
import { AGENTS, createAgentsBuild, type AgentsBuildState } from '~/composables/useAgentsBuild'
import { introPlayed } from '~/composables/useAgentsIntro'

const PILL_HIDE_MS = 8000

/** Site mark in the middle of the loader: "BA" between code brackets */
const MARK = `<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
  <rect x="2" y="2" width="60" height="60" rx="14" fill="var(--panel)" stroke="var(--rule-strong)" stroke-width="1.5"/>
  <path d="M17 22 L10 32 L17 42" fill="none" stroke="#ec3b33" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M47 22 L54 32 L47 42" fill="none" stroke="#7bc313" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="32" y="38.5" text-anchor="middle" font-family="var(--font-mono), monospace" font-size="17" font-weight="700" fill="var(--ink)">BA</text>
</svg>`

const { t, locale } = useI18n()

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
  build?.start(true)
}

/**
 * After a route change, the new page is mounted while it is still sliding in
 * and the window is still where the previous page was scrolled: wait for the
 * page transition to end, then for the scroll back to the top to stop.
 */
function pageSettled(maxMs = 2500) {
  return new Promise<void>((resolve) => {
    const t0 = performance.now()
    let lastY = -1
    let still = 0
    const check = () => {
      const moving = document.querySelector('.page-enter-active, .page-leave-active')
      const y = window.scrollY
      still = !moving && y === lastY ? still + 1 : 0
      lastY = y
      if (still >= 6 || performance.now() - t0 > maxMs) resolve()
      else requestAnimationFrame(check)
    }
    requestAnimationFrame(check)
  })
}

// Any key press during the build (Escape, Tab, End…) shows the page at once
function onKeydown() {
  if (build?.running) build.skip()
}

onMounted(async () => {
  const root = anchor.value?.parentElement
  if (!root || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return

  // The overlay and the status pill are only rendered on the client
  mounted.value = true
  await nextTick()
  if (!overlay.value || !anchor.value) return

  const small = window.matchMedia('(max-width: 639px)').matches
  crew.value = AGENTS.slice(0, small ? 5 : 10)
  build = createAgentsBuild({
    root,
    overlay: overlay.value,
    agentCount: crew.value.length,
    onChange,
    icon: MARK,
    labels: {
      loading: t('agentsBuild.loading'),
      write: t('agentsBuild.actions.write'),
      design: t('agentsBuild.actions.design'),
      select: t('agentsBuild.actions.select'),
    },
  })
  window.addEventListener('keydown', onKeydown)

  try {
    // The loader only when the site is opened, not on every page change
    const first = !introPlayed.value
    introPlayed.value = true
    build.start(first, first ? Promise.resolve() : pageSettled())
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
