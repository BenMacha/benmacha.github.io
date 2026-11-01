<template>
  <div class="container page">
    <ChapterHead :title="$t('experience.title')" :lead="$t('book.expIntro')">
      <dl class="legend">
        <div><i class="swatch swatch--green" /><dt>{{ $t('book.legend.salaried') }}</dt><dd>{{ $t('book.legend.salariedNote') }}</dd></div>
        <div><i class="swatch swatch--amber" /><dt>{{ $t('book.legend.freelance') }}</dt><dd>{{ $t('book.legend.freelanceNote') }}</dd></div>
        <div><i class="swatch swatch--red" /><dt>{{ $t('book.legend.own') }}</dt><dd>{{ $t('book.legend.ownNote') }}</dd></div>
      </dl>
    </ChapterHead>

    <ol class="timeline">
      <li v-for="(job, i) in experiences" :key="job.company" class="row" :class="{ 'row--first': i === 0, 'row--last': i === experiences.length - 1 }">
        <!-- The red axis counts the years; each job is a branch opened at its start (bottom) and closed at its end (top) -->
        <div v-draw class="rail" :class="[`rail--${tone(job)}`, { 'rail--switch': contractOf(job.company).switchedFromFreelance }]" aria-hidden="true">
          <span class="rail__year mono">{{ startYear(job.period) }}</span>
          <span class="rail__axis" />
          <span class="rail__tick" />
          <span class="rail__branch" />
          <span class="rail__fork" />
          <span v-if="ongoing(job)" class="rail__open" />
          <span v-else class="rail__end" />
          <template v-if="contractOf(job.company).switchedFromFreelance">
            <span class="rail__freelance" />
            <span class="rail__switch" />
            <span class="rail__switch-label mono">{{ $t('book.cdiMarker') }}</span>
          </template>
        </div>

        <article v-reveal class="job">
          <div class="job__head">
            <h2 class="job__role">{{ job.role }}</h2>
            <span class="job__period mono">{{ job.period }}</span>
          </div>
          <p class="job__company">
            <span :class="`contract--${contractOf(job.company).contract}`">{{ contractOf(job.company).name }}</span>
            <span class="job__where"> · {{ job.location }} · {{ $t(`book.kinds.${contractOf(job.company).kind}`) }}</span>
          </p>

          <ul v-if="job.phases.length" class="phases">
            <li v-for="phase in job.phases" :key="phase.period" class="phase" :class="`phase--${phase.kind}`">
              <span class="phase__label">{{ phase.label }}</span>
              <span class="phase__period mono">{{ phase.period }}</span>
              <span class="phase__text">{{ phase.text }}</span>
            </li>
          </ul>

          <ul class="bullets">
            <li v-for="task in visibleTasks(job.tasks, i)" :key="task">{{ task }}</li>
          </ul>
          <button
            v-if="job.tasks.length > TASK_LIMIT"
            type="button"
            class="job__more mono"
            :aria-expanded="!!expanded[i]"
            @click="expanded[i] = !expanded[i]"
          >
            {{ expanded[i] ? `− ${$t('experienceUi.less')}` : `+ ${job.tasks.length - TASK_LIMIT}` }}
          </button>

          <p v-if="job.stack.length" class="job__stack mono">stack · {{ job.stack.join(', ') }}</p>
          <a v-if="job.website" :href="job.website" target="_blank" rel="noopener" class="job__site mono">{{ job.website.replace(/^https?:\/\//, '') }} ↗</a>
        </article>
      </li>
    </ol>

    <aside class="see-also card">
      <div class="see-also__text">
        <span class="eyebrow eyebrow--green">{{ $t('book.annexA.seeAlso') }}</span>
        <p class="see-also__title">{{ $t('book.annexA.chapterTitle', { n: symfonyMerged }) }}</p>
        <p class="see-also__stats mono">{{ mergedCount }} {{ $t('book.annexA.merged') }} · {{ openCount }} {{ $t('book.annexA.open') }} · {{ packages.length }} {{ $t('book.annexA.bundles') }}</p>
      </div>
      <NuxtLink :to="localePath('/open-source')" class="btn btn--green">{{ $t('book.annexA.cta') }} →</NuxtLink>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { contractOf, startYear } from '~/data/experience'
import { contributionsByProject, mergedCount, openCount, packages } from '~/data/opensource'
import type { Experience } from '~/composables/useResume'

const TASK_LIMIT = 6

const { t } = useI18n()
const localePath = useLocalePath()
const { experiences } = useResume()
const expanded = reactive<Record<number, boolean>>({})

const symfonyMerged = contributionsByProject.find(p => p.id === 'symfony')?.merged.length ?? 0

const tone = (job: Experience) => ({ permanent: 'green', freelance: 'amber', own: 'red' } as const)[contractOf(job.company).contract]
// A period with a single date ("09/25 – Aujourd'hui") is still running
const ongoing = (job: Experience) => (job.period.match(/\d{2}\/\d{2}/g) ?? []).length < 2

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
/* Legend beside the chapter title */
.legend {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 15px;
}

.legend div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend dt {
  font-weight: 700;
}

.legend dd {
  margin: 0;
  color: var(--muted);
}

/* ---------- Timeline ---------- */
.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
  gap: 24px;
}

.rail {
  --c: var(--green);
  position: relative;
  flex: 0 0 140px;
  min-height: 176px;
}

.rail--red { --c: var(--red); }
.rail--amber { --c: var(--amber); }

.rail > span {
  position: absolute;
}

.rail__year {
  inset-inline-start: 0;
  top: 28px;
  font-size: 13px;
  color: var(--muted);
}

.rail__axis {
  inset-inline-start: 56px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--axis);
}

.row--first .rail__axis {
  top: 30px;
}

.rail__tick {
  inset-inline-start: 48px;
  top: 37px;
  width: 18px;
  height: 2px;
  background: var(--axis);
}

/* The job: from its start (connector to the axis, bottom) up to its end (ring, top) */
.rail__branch {
  inset-inline-start: 96px;
  top: 36px;
  bottom: 26px;
  width: 3px;
  border-radius: 3px;
  background: var(--c);
  transform-origin: 50% 100%;
}

.rail__fork {
  inset-inline-start: 57px;
  bottom: 26px;
  width: 42px;
  height: 2px;
  background: var(--c);
  transform-origin: 0 50%;
}

.rail__end,
.rail__open {
  inset-inline-start: 89px;
  top: 28px;
  width: 17px;
  height: 17px;
  border-radius: 999px;
  background: var(--bg);
  border: 3px solid var(--c);
}

/* Still running: the branch stays open at the top (an arrowhead instead of a closing ring) */
.rail__open {
  top: 26px;
  border-radius: 0;
  border-width: 3px 0 0 3px;
  background: transparent;
  transform: rotate(45deg);
  width: 13px;
  height: 13px;
  inset-inline-start: 91px;
}

/* Freelance first (amber, below), then permanent from the ◆ */
.rail__freelance {
  inset-inline-start: 96px;
  top: 110px;
  bottom: 26px;
  width: 3px;
  background: var(--amber);
  transform-origin: 50% 100%;
}

.rail--switch .rail__fork {
  background: var(--amber);
}

.rail__switch {
  inset-inline-start: 91px;
  top: 98px;
  width: 13px;
  height: 13px;
  background: var(--green);
  transform: rotate(45deg);
}

.rail__switch-label {
  inset-inline-start: 112px;
  top: 92px;
  font-size: 11px;
  color: var(--green-ink);
}

/* The branch grows from its start date when it scrolls into view */
.rail.will-draw .rail__branch,
.rail.will-draw .rail__freelance {
  transform: scaleY(0);
}

.rail.will-draw .rail__fork {
  transform: scaleX(0);
}

.rail.will-draw .rail__end,
.rail.will-draw .rail__open,
.rail.will-draw .rail__switch,
.rail.will-draw .rail__switch-label {
  opacity: 0;
}

.rail.will-draw.is-drawn .rail__fork {
  transform: scaleX(1);
  transition: transform .25s var(--ease);
}

.rail.will-draw.is-drawn .rail__branch,
.rail.will-draw.is-drawn .rail__freelance {
  transform: scaleY(1);
  transition: transform .7s var(--ease) .2s;
}

.rail.will-draw.is-drawn .rail__end,
.rail.will-draw.is-drawn .rail__open,
.rail.will-draw.is-drawn .rail__switch,
.rail.will-draw.is-drawn .rail__switch-label {
  opacity: 1;
  transition: opacity .3s .8s;
}

.rail.will-draw.is-drawn .rail__open {
  transform: rotate(45deg);
}

/* RTL: the arrowhead points up in both directions */
[dir='rtl'] .rail__open {
  border-width: 3px 3px 0 0;
  transform: rotate(-45deg);
}

[dir='rtl'] .rail.will-draw.is-drawn .rail__open {
  transform: rotate(-45deg);
}

/* ---------- Job ---------- */
.job {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px 0 30px;
  border-bottom: 1px solid var(--rule);
}

.job__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 6px 24px;
}

.job__role {
  margin: 0;
  font-size: 26px;
  line-height: 1.2;
}

.job__period {
  font-size: 13px;
  color: var(--muted);
}

.job__company {
  margin: 0;
  font-weight: 700;
}

.job__where {
  font-weight: 500;
  color: var(--muted);
}

.phases {
  list-style: none;
  margin: 4px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.phase {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 10px;
  padding: 8px 14px;
  border-inline-start: 3px solid var(--green);
  background: var(--panel);
  border-radius: 0 8px 8px 0;
  font-size: 15px;
}

[dir='rtl'] .phase {
  border-radius: 8px 0 0 8px;
}

.phase--freelance {
  border-inline-start-color: var(--amber);
}

.phase__label {
  font-weight: 700;
  color: var(--green-ink);
}

.phase--freelance .phase__label {
  color: var(--amber-ink);
}

.phase__period {
  font-size: 13px;
  color: var(--muted);
}

.phase__text {
  flex-basis: 100%;
  color: var(--ink-2);
}

.job__more {
  align-self: flex-start;
  padding: 4px 10px;
  border: 1px solid var(--rule);
  border-radius: 6px;
  background: transparent;
  color: var(--ink-2);
  font-size: 12px;
  cursor: pointer;
}

.job__stack {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--muted);
}

.job__site {
  align-self: flex-start;
  font-size: 13px;
  color: var(--green-ink);
}

/* ---------- See also ---------- */
.see-also {
  margin-top: 48px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 28px;
  border-radius: 16px;
}

.see-also__text {
  flex: 999 1 420px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.see-also__title {
  margin: 0;
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 24px;
  line-height: 1.25;
}

.see-also__stats {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
}

@media (max-width: 600px) {
  .row {
    gap: 12px;
  }

  .rail {
    flex-basis: 76px;
  }

  .rail__year {
    font-size: 11px;
  }

  .rail__axis {
    inset-inline-start: 34px;
  }

  .rail__tick {
    inset-inline-start: 28px;
    width: 14px;
  }

  .rail__branch,
  .rail__freelance {
    inset-inline-start: 60px;
  }

  .rail__fork {
    inset-inline-start: 35px;
    width: 27px;
  }

  .rail__end {
    inset-inline-start: 53px;
  }

  .rail__open {
    inset-inline-start: 55px;
  }

  .rail__switch {
    inset-inline-start: 55px;
  }

  .rail__switch-label {
    display: none;
  }

  .rail__year {
    top: 46px;
    inset-inline-start: 0;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }

  .job__role {
    font-size: 21px;
  }
}
</style>
