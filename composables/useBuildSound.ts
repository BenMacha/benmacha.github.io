/**
 * Sounds of the agents build, synthesised live with the Web Audio API (no audio
 * files): keyboard clicks while typing, mouse press and release, a crisp snap
 * for guides, a soft bell when a block is placed (pitch from its position and
 * size, panned to its cursor), a swell, an arpeggio and a chord for the intro
 * and the end.
 *
 * Browsers keep audio locked until the visitor clicks or presses a key: the
 * engine stays silent until then, `unlock()` is called on the first gesture.
 * On by default; the choice is remembered in localStorage.
 *
 * On phones (Android; iOS has no vibration API) the same moments vibrate
 * lightly: each typed key, each click, each snap and block placed, the final
 * chord. Like audio, browsers only allow it after the first tap, and muting
 * the sound stops the vibrations too.
 */

const STORAGE_KEY = 'ba-build-sound'

/** D major pentatonic over three octaves (Hz), low to high */
const SCALE = [146.83, 164.81, 185.0, 220.0, 246.94, 293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99, 880.0]

export type SoundState = 'on' | 'off' | 'locked'

export function createBuildSound(onState: (state: SoundState) => void) {
  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let noise: AudioBuffer | null = null
  let enabled = readPref()
  let lastKey = 0
  let lastNote = 0
  let lastBuzz = 0
  const canBuzz = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
    && typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  /** A short vibration, at most one every `gap` ms, once the visitor has tapped the page */
  function buzz(pattern: number | number[], gap = 45) {
    if (!enabled || !canBuzz) return
    const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation
    if (activation && !activation.hasBeenActive) return
    const now = performance.now()
    if (now - lastBuzz < gap) return
    lastBuzz = now
    try {
      navigator.vibrate(pattern)
    }
    catch {
      // not allowed here: stay still
    }
  }

  function readPref() {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'off'
    }
    catch {
      return true
    }
  }

  function state(): SoundState {
    if (!enabled) return 'off'
    return ctx && ctx.state === 'running' ? 'on' : 'locked'
  }

  function emit() {
    onState(state())
  }

  /** Creates or resumes the audio context; only works during a user gesture */
  async function unlock() {
    if (!enabled) return
    try {
      if (!ctx) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!Ctx) return
        ctx = new Ctx()
        master = ctx.createGain()
        master.gain.value = 0.55
        const comp = ctx.createDynamicsCompressor()
        master.connect(comp).connect(ctx.destination)
        noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate)
        const data = noise.getChannelData(0)
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      }
      if (ctx.state !== 'running') await ctx.resume()
    }
    catch {
      // no audio on this device: stay silent
    }
    emit()
  }

  function toggle() {
    enabled = !enabled
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
    }
    catch {
      // private mode: the choice lasts for this page only
    }
    if (enabled) void unlock()
    else emit()
  }

  function ready() {
    return enabled && ctx && master && ctx.state === 'running' ? ctx : null
  }

  /** Stereo position from a document x coordinate */
  function panner(c: AudioContext, x: number | undefined) {
    const p = c.createStereoPanner()
    const width = document.documentElement.clientWidth || 1
    p.pan.value = x == null ? 0 : Math.max(-0.8, Math.min(0.8, (x - window.scrollX) / width * 1.6 - 0.8))
    p.connect(master!)
    return p
  }

  /** A short filtered noise burst */
  function burst(c: AudioContext, out: AudioNode, at: number, freq: number, q: number, gain: number, len: number) {
    const src = c.createBufferSource()
    src.buffer = noise
    src.playbackRate.value = 0.8 + Math.random() * 0.4
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = freq
    bp.Q.value = q
    const g = c.createGain()
    g.gain.setValueAtTime(gain, at)
    g.gain.exponentialRampToValueAtTime(0.0001, at + len)
    src.connect(bp).connect(g).connect(out)
    src.start(at, Math.random() * 0.3, len + 0.02)
  }

  /** A short pitched thump */
  function thump(c: AudioContext, out: AudioNode, at: number, freq: number, gain: number, len: number) {
    const o = c.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(freq * 1.6, at)
    o.frequency.exponentialRampToValueAtTime(freq, at + len * 0.5)
    const g = c.createGain()
    g.gain.setValueAtTime(gain, at)
    g.gain.exponentialRampToValueAtTime(0.0001, at + len)
    o.connect(g).connect(out)
    o.start(at)
    o.stop(at + len + 0.02)
  }

  /** One key of a mechanical keyboard; a space is deeper */
  function key(x?: number, space = false) {
    buzz(space ? 9 : 5, 55)
    const c = ready()
    if (!c) return
    const now = c.currentTime
    // At most one click every 28 ms, so a fast typist does not buzz
    if (now - lastKey < 0.028) return
    lastKey = now
    const out = panner(c, x)
    burst(c, out, now, space ? 1800 : 3200 + Math.random() * 900, 4, 0.16, 0.025)
    thump(c, out, now, space ? 90 : 140 + Math.random() * 30, space ? 0.22 : 0.14, space ? 0.07 : 0.045)
  }

  /** Mouse button pressed / released */
  function press(x?: number) {
    buzz(10)
    const c = ready()
    if (!c) return
    burst(c, panner(c, x), c.currentTime, 2600, 6, 0.12, 0.02)
  }

  function release(x?: number) {
    buzz(6)
    const c = ready()
    if (!c) return
    burst(c, panner(c, x), c.currentTime, 3400, 6, 0.08, 0.016)
  }

  /** A guide snapping into place */
  function snap(x?: number) {
    buzz([8, 30, 8])
    const c = ready()
    if (!c) return
    const out = panner(c, x)
    burst(c, out, c.currentTime, 5200, 8, 0.14, 0.018)
    thump(c, out, c.currentTime, 520, 0.05, 0.03)
  }

  /**
   * A soft bell when a block is placed: big blocks low, small ones high,
   * higher to the right; on an eighth-note grid, never two at once.
   */
  function note(x: number, w: number, h: number) {
    buzz(14, 120)
    const c = ready()
    if (!c) return
    const now = c.currentTime
    const step = 0.16
    const at = Math.max(now, Math.ceil(now / step) * step)
    if (at - lastNote < step * 0.9) return
    lastNote = at
    const width = document.documentElement.clientWidth || 1
    const size = Math.min(1, Math.sqrt(w * h) / 600)
    const across = Math.max(0, Math.min(1, (x + w / 2 - window.scrollX) / width))
    const idx = Math.round((1 - size) * 8 + across * 5)
    const freq = SCALE[Math.max(0, Math.min(SCALE.length - 1, idx))]!
    bell(c, panner(c, x + w / 2), at, freq, 0.07, 1.4)
  }

  function bell(c: AudioContext, out: AudioNode, at: number, freq: number, gain: number, len: number) {
    for (const [mult, part] of [[1, 1], [2.01, 0.35], [3.98, 0.12]] as const) {
      const o = c.createOscillator()
      o.type = 'sine'
      o.frequency.value = freq * mult
      const g = c.createGain()
      g.gain.setValueAtTime(0.0001, at)
      g.gain.exponentialRampToValueAtTime(gain * part, at + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0001, at + len / mult)
      o.connect(g).connect(out)
      o.start(at)
      o.stop(at + len + 0.05)
    }
  }

  /** Airy swell while the swarm gathers */
  function swell() {
    const c = ready()
    if (!c) return
    const now = c.currentTime
    const src = c.createBufferSource()
    src.buffer = noise
    src.loop = true
    const lp = c.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(300, now)
    lp.frequency.exponentialRampToValueAtTime(2400, now + 1.2)
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.05, now + 0.9)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.8)
    src.connect(lp).connect(g).connect(master!)
    src.start(now)
    src.stop(now + 1.9)
  }

  /** Rising arpeggio as the swarm fans out */
  function arpeggio() {
    buzz([12, 50, 12, 50, 12], 0)
    const c = ready()
    if (!c) return
    const now = c.currentTime
    ;[5, 7, 9, 10, 12].forEach((i, k) => bell(c, master!, now + k * 0.07, SCALE[i]!, 0.05, 0.9))
  }

  /** Soft chord when the page is built */
  function chord() {
    buzz([30, 60, 30, 60, 60], 0)
    const c = ready()
    if (!c) return
    const now = c.currentTime
    ;[0, 3, 5, 7].forEach((i, k) => bell(c, master!, now + k * 0.03, SCALE[i]!, 0.06, 2.4))
  }

  emit()

  return { unlock, toggle, key, press, release, snap, note, swell, arpeggio, chord, get state() { return state() } }
}

export type BuildSound = ReturnType<typeof createBuildSound>
