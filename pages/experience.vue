<template>
  <div class="container container--narrow page">
    <SectionTitle page :eyebrow="$t('experienceUi.eyebrow')" :title="$t('experience.title')" />

    <p class="legend" aria-hidden="true">
      <span class="legend__item"><i class="legend__swatch legend__swatch--trunk" />{{ $t('experienceUi.legendTrunk') }}</span>
      <span class="legend__item"><i class="legend__swatch legend__swatch--branch" />{{ $t('experienceUi.legendBranch') }}</span>
    </p>

    <ol class="levels">
      <template v-for="(job, i) in experiences" :key="job.company">
        <!-- Milestone between two countries: both pipes keep running through it -->
        <li v-if="job.company === countryChangeBefore" class="level-row level-row--milestone">
          <div class="rail" aria-hidden="true">
            <div class="rail__trunk" />
            <div class="rail__branch" />
          </div>
          <p class="milestone pixel">{{ $t('experienceUi.countryChange') }}</p>
        </li>

        <li class="level-row">
          <!-- Git-like pipes: green trunk = salaried job, yellow branch = freelance / side project -->
          <div class="rail" aria-hidden="true">
            <div class="rail__trunk" />
            <div v-if="railOf(job).node === 'trunk'" class="rail__lip" />
            <template v-if="railOf(job).branch">
              <div class="rail__branch" :class="`rail__branch--${railOf(job).branch}`" />
              <div v-if="hasElbow(job)" class="rail__elbow" :class="`rail__elbow--${railOf(job).branch}`" />
              <div v-if="railOf(job).node === 'branch' || railOf(job).branch === 'open'" class="rail__blip" />
              <span v-if="railOf(job).label" class="rail__label">{{ $t(railOf(job).label!) }}</span>
            </template>
          </div>

          <article v-reveal="i" v-lift class="job card">
            <div class="job__bar">
              <span class="level">LVL 1-{{ experiences.length - i }}</span>
              <span>session://work</span>
              <span class="job__period">{{ job.period }}</span>
            </div>

            <div class="job__body">
              <div>
                <div class="job__title">
                  <h2 class="job__company pixel">{{ job.company }}</h2>
                </div>
                <p class="job__role">{{ job.role }}</p>
                <p v-if="job.location" class="job__location">⌖ {{ job.location }}</p>
              </div>

              <ul v-if="job.phases.length" class="phases">
                <li v-for="phase in job.phases" :key="phase.period" class="phase" :class="`phase--${phase.kind}`">
                  <span class="phase__label pixel">{{ phase.label }}</span>
                  <span class="phase__period">{{ phase.period }}</span>
                  <span class="phase__text">{{ phase.text }}</span>
                </li>
              </ul>

              <ul class="bullets">
                <li v-for="task in visibleTasks(job.tasks, i)" :key="task">{{ task }}</li>
              </ul>

              <button
                v-if="job.tasks.length > TASK_LIMIT"
                type="button"
                class="job__more pixel"
                :aria-expanded="!!expanded[i]"
                @click="expanded[i] = !expanded[i]"
              >
                {{ expanded[i] ? `▲ ${$t('experienceUi.less')}` : `▼ ${$t('experienceUi.more', { n: job.tasks.length - TASK_LIMIT })}` }}
              </button>

              <div v-if="job.stack.length" class="job__stack">
                <span class="job__stack-label">$ stack:</span>
                <span v-for="tech in job.stack" :key="tech" class="tag">{{ tech }}</span>
              </div>

              <a v-if="job.website" :href="job.website" target="_blank" rel="noopener" class="job__site">↗ {{ job.website }}</a>
            </div>
          </article>
        </li>
      </template>

      <li class="level-row level-row--start">
        <div class="flag" aria-hidden="true"><span /></div>
        <div class="pixel start-label">{{ $t('experienceUi.start') }}</div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { countryChangeBefore, rails, type Rail } from '~/data/experience'
import type { Experience } from '~/composables/useResume'

const TASK_LIMIT = 6

const { t } = useI18n()
const { experiences } = useResume()
const expanded = reactive<Record<number, boolean>>({})

const railOf = (job: Experience): Rail => rails[job.company] ?? { node: 'trunk' }

// A horizontal pipe joins the branch to the trunk where the branch starts or ends
const hasElbow = (job: Experience) => ['forkBelow', 'mergeAtHead', 'forkAtHead'].includes(railOf(job).branch ?? '')

function visibleTasks(tasks: string[], index: number) {
  return expanded[index] ? tasks : tasks.slice(0, TASK_LIMIT)
}

usePageSeo({
  title: () => t('seo.experience.title'),
  description: () => t('seo.experience.description'),
  breadcrumb: () => [{ name: t('nav.experience'), path: '/experience' }],
})
</script>

<style scoped>
.levels {
  margin: 0;
  padding: 0;
  list-style: none;
}

.level-row {
  display: grid;
  grid-template-columns: var(--rail-w) minmax(0, 1fr);
  gap: 18px;
}

.levels {
  /* Pipe geometry, scaled down on small screens */
  --rail-w: 124px;
  --lip-w: 56px;
  --lip-h: 26px;
  --trunk-x: 8px;
  --trunk-w: 40px;
  --branch-x: 84px;
  --branch-w: 30px;
  --blip-x: 79px;
  --blip-w: 40px;
  --blip-h: 22px;
  --elbow-y: 1px;
  --elbow-h: 26px;
  --pipe-branch: var(--coin);
}

/* Git-like pipes running down the timeline */
.rail {
  position: relative;
  min-height: 40px;
}

.rail__trunk,
.rail__branch {
  position: absolute;
  top: 0;
  bottom: 0;
  border-inline: 3px solid #000;
}

.rail__trunk {
  inset-inline-start: var(--trunk-x);
  width: var(--trunk-w);
  background: var(--pipe);
  box-shadow: inset 5px 0 0 #7ee07e, inset -7px 0 0 #1f7a2a;
}

.rail__lip,
.rail__blip {
  position: absolute;
  top: 0;
  z-index: 2;
  border: 3px solid #000;
}

.rail__lip {
  inset-inline-start: 0;
  width: var(--lip-w);
  height: var(--lip-h);
  background: var(--pipe);
  box-shadow: inset 6px 0 0 #7ee07e, inset -8px 0 0 #1f7a2a;
}

.rail__branch {
  inset-inline-start: var(--branch-x);
  width: var(--branch-w);
  background: var(--pipe-branch);
  box-shadow: inset 4px 0 0 var(--coin-light), inset -6px 0 0 var(--coin-dark);
}

.rail__blip {
  inset-inline-start: var(--blip-x);
  width: var(--blip-w);
  height: var(--blip-h);
  background: var(--pipe-branch);
  box-shadow: inset 5px 0 0 var(--coin-light), inset -7px 0 0 var(--coin-dark);
}

/* Where the branch leaves or joins the trunk */
.rail__branch--forkBelow {
  bottom: 18px;
}

.rail__branch--mergeAtHead {
  top: var(--elbow-y);
}

.rail__branch--forkAtHead {
  bottom: auto;
  height: calc(var(--elbow-y) + var(--elbow-h));
}

.rail__elbow {
  position: absolute;
  z-index: 1;
  inset-inline-start: calc(var(--trunk-x) + var(--trunk-w) - 6px);
  width: calc(var(--branch-x) - var(--trunk-x) - var(--trunk-w) + 12px);
  height: var(--elbow-h);
  background: var(--pipe-branch);
  border-block: 3px solid #000;
  box-shadow: inset 0 4px 0 var(--coin-light), inset 0 -5px 0 var(--coin-dark);
}

.rail__elbow--forkBelow {
  bottom: 6px;
}

.rail__elbow--mergeAtHead,
.rail__elbow--forkAtHead {
  top: var(--elbow-y);
}

.rail__label {
  position: absolute;
  top: 50%;
  z-index: 2;
  inset-inline-start: var(--branch-x);
  width: var(--branch-w);
  transform: translateY(-50%);
  writing-mode: vertical-rl;
  text-align: center;
  font-family: var(--font-pixel, monospace);
  font-size: 8px;
  letter-spacing: 1px;
  color: #3d2a00;
}

/* Legend and country milestone */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin: 0 0 22px;
  font-size: 12px;
  color: var(--muted);
}

.legend__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.legend__swatch {
  display: inline-block;
  width: 22px;
  height: 12px;
  border: 2px solid #000;
}

.legend__swatch--trunk {
  background: var(--pipe);
}

.legend__swatch--branch {
  background: var(--coin);
}

.level-row--milestone {
  align-items: center;
}

.level-row--milestone .rail {
  align-self: stretch;
  min-height: 56px;
}

.milestone {
  justify-self: start;
  margin: 0 0 32px;
  padding: 8px 12px;
  font-size: 10px;
  color: var(--coin);
  border: 2px dashed var(--coin);
}

/* Successive contracts within one company */
.phases {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.phase {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  padding: 6px 10px;
  font-size: 12px;
  border-inline-start: 6px solid var(--pipe);
  background: var(--bar);
}

.phase--freelance {
  border-inline-start-color: var(--coin);
}

.phase__label {
  font-size: 9px;
  line-height: 1.8;
  color: var(--accent);
}

.phase--freelance .phase__label {
  color: var(--coin);
}

.phase__period {
  font-weight: 600;
}

.phase__text {
  flex-basis: 100%;
  color: var(--muted);
}

.job {
  margin-bottom: 32px;
}

.job__bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 14px;
  border-bottom: 3px solid var(--line);
  background: var(--bar);
  font-size: 11px;
  color: var(--muted);
}

.job__period {
  margin-inline-start: auto;
}

.job__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
}

.job__title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  margin-bottom: 8px;
}

.job__company {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--accent);
}

.job__role {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.job__location {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--muted);
}

.job__more {
  align-self: flex-start;
  font-size: 9px;
  padding: 8px 10px;
  background: transparent;
  color: var(--accent);
  border: 2px dashed var(--accent);
  cursor: pointer;
}

.job__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 14px;
  border-top: 3px dotted var(--border);
}

.job__stack-label {
  padding: 4px 0;
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
}

.job__site {
  font-size: 12px;
  color: var(--accent);
  overflow-wrap: anywhere;
}

/* Flag at the start of the level map */
.level-row--start {
  align-items: center;
}

.flag {
  position: relative;
  justify-self: center;
  width: 6px;
  height: 60px;
  background: #fff;
  border: 2px solid #000;
}

.flag span {
  position: absolute;
  top: 0;
  left: 4px;
  width: 26px;
  height: 18px;
  background: var(--grass);
  border: 2px solid #000;
}

@media (max-width: 480px) {
  .levels {
    --rail-w: 84px;
    --lip-w: 36px;
    --lip-h: 20px;
    --trunk-x: 5px;
    --trunk-w: 26px;
    --branch-x: 56px;
    --branch-w: 22px;
    --blip-x: 52px;
    --blip-w: 30px;
    --blip-h: 18px;
    --elbow-h: 18px;
  }

  .level-row {
    gap: 12px;
  }

  .job__body {
    padding: 16px;
  }
}

.start-label {
  font-size: 10px;
  color: var(--muted);
}
</style>
