<template>
  <div class="container page">
    <ChapterHead :title="$t('experience.title')" :lead="$t('book.expIntro')">
      <dl class="legend">
        <div><i class="swatch swatch--green" /><dt>{{ $t('book.legend.salaried') }}</dt><dd>{{ $t('book.legend.salariedNote') }}</dd></div>
        <div><i class="swatch swatch--amber" /><dt>{{ $t('book.legend.freelance') }}</dt><dd>{{ $t('book.legend.freelanceNote') }}</dd></div>
        <div><i class="swatch swatch--red" /><dt>{{ $t('book.legend.own') }}</dt><dd>{{ $t('book.legend.ownNote') }}</dd></div>
      </dl>
    </ChapterHead>

    <!-- The career as a git graph (GitKraken-style): one lane per kind of contract, one commit per job -->
    <ol class="graph-list">
      <li v-for="(job, i) in experiences" :key="job.company" class="row" :style="laneVars" data-build-stage>
        <span class="row__year mono" aria-hidden="true" data-build>{{ startYear(job.period) }}</span>

        <div class="row__refs" aria-hidden="true" data-build>
          <span class="row__year-inline mono">{{ startYear(job.period) }}</span>
          <span v-for="ref in rowOf(job).refs" :key="ref.text" class="ref mono" :class="[`ref--${ref.kind}`, `ref--${ref.lane}`]">{{ ref.text }}</span>
          <span v-for="ref in rowOf(job).endRefs ?? []" :key="ref.text" class="ref-end">
            <span class="ref mono" :class="[`ref--${ref.kind}`, `ref--${ref.lane}`]">{{ ref.text }}</span>
            <span v-if="ref.closed" class="ref__closed mono">✕ {{ ref.closed }}</span>
          </span>
        </div>

        <div v-draw class="graph" aria-hidden="true" data-build data-build-kind="draw">
          <template v-for="(shape, lane) in rowOf(job).lanes" :key="lane">
            <span v-if="shape !== 'forkFromNode'" class="lane" :class="[`lane--${lane}`, `shape--${shape}`]" />
            <svg v-else class="fork" :class="`fork--${lane}`" :viewBox="`0 0 ${GW} ${NODE_Y}`" preserveAspectRatio="none">
              <path :d="forkPath(lane)" pathLength="1" />
            </svg>
            <span v-if="shape === 'open'" class="arrow" :class="`lane--${lane}`" />
            <template v-if="shape === 'endBelow'">
              <span class="endcap" :class="`lane--${lane}`" />
              <span class="node node--end" :class="`lane--${lane}`" />
            </template>
          </template>
          <span class="node" :class="`lane--${rowOf(job).node}`">
            <img v-if="logoOf(job.company)" :src="logoOf(job.company)" alt="" width="28" height="28" loading="lazy">
            <span v-else>{{ contractOf(job.company).name.charAt(0) }}</span>
          </span>
        </div>

        <article v-reveal class="job" data-build>
          <div class="job__head">
            <h2 class="job__role">{{ job.role }}</h2>
            <span class="job__commit mono"><span class="job__hash">{{ commitHash(job.company) }}</span> · {{ job.period }}</span>
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

          <TechList v-if="job.stack.length" :items="job.stack" class="job__stack" />
          <a v-if="job.website" :href="job.website" target="_blank" rel="noopener" class="job__site mono">{{ job.website.replace(/^https?:\/\//, '') }} ↗</a>
        </article>
      </li>
    </ol>

    <aside class="see-also card" data-build-stage data-build>
      <div class="see-also__text">
        <span class="eyebrow eyebrow--green">{{ $t('book.annexA.seeAlso') }}</span>
        <p class="see-also__title">{{ $t('book.annexA.chapterTitle', { n: symfonyMerged }) }}</p>
        <p class="see-also__stats mono">{{ mergedCount }} {{ $t('book.annexA.merged') }} · {{ openCount }} {{ $t('book.annexA.open') }} · {{ packages.length }} {{ $t('book.annexA.bundles') }}</p>
      </div>
      <NuxtLink :to="localePath('/open-source')" class="btn btn--green">{{ $t('book.annexA.cta') }} <span class="dir-arrow" aria-hidden="true">→</span></NuxtLink>
    </aside>

    <AgentsBuild />
  </div>
</template>

<script setup lang="ts">
import { commitHash, contractOf, graph, startYear, type GraphRow, type Lane } from '~/data/experience'
import { companyLogos } from '~/data/companies'
import { contributionsByProject, mergedCount, openCount, packages } from '~/data/opensource'
import type { Experience } from '~/composables/useResume'

const TASK_LIMIT = 6

const { t } = useI18n()
const localePath = useLocalePath()
const { experiences } = useResume()
const expanded = reactive<Record<number, boolean>>({})

const symfonyMerged = contributionsByProject.find(p => p.id === 'symfony')?.merged.length ?? 0

// Graph geometry (px): lane positions from the inline start, row commit height, graph width
const LANE_X: Record<Lane, number> = { main: 22, freelance: 58, pepprio: 94 }
const NODE_Y = 44
const GW = 116
const laneVars = {
  '--x-main': `${LANE_X.main}px`,
  '--x-freelance': `${LANE_X.freelance}px`,
  '--x-pepprio': `${LANE_X.pepprio}px`,
  '--node-y': `${NODE_Y}px`,
  '--gw': `${GW}px`,
}

const rowOf = (job: Experience): GraphRow => graph[job.company] ?? { node: 'main', lanes: { main: 'full' }, refs: [] }
const logoOf = (company: string) => companyLogos[company]?.src

// S curve from the main lane at the commit up to the branch lane at the top of the row
function forkPath(lane: Lane) {
  const x0 = LANE_X.main + 3
  const x1 = LANE_X[lane] + 3
  return `M${x0} ${NODE_Y} C${x0} ${NODE_Y * 0.45} ${x1} ${NODE_Y * 0.55} ${x1} 0`
}

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

/* ---------- Git graph (GitKraken-style) ---------- */
.graph-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  --lane-w: 6px;
  --node: 34px;
  display: grid;
  grid-template-columns: 44px 180px var(--gw) minmax(0, 1fr);
  grid-template-areas: 'year refs graph job';
  column-gap: 12px;
}

.row__year {
  grid-area: year;
  padding-top: calc(var(--node-y) - 11px);
  font-size: 13px;
  color: var(--muted);
}

.row__year-inline {
  display: none;
}

/* Ref badges, like GitKraken's branch and tag pills */
.row__refs {
  grid-area: refs;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  padding-top: calc(var(--node-y) - 12px);
}

.ref {
  --c: var(--green);
  max-width: 100%;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid var(--c);
  background: color-mix(in srgb, var(--c) 14%, transparent);
  color: var(--ink);
  font-size: 12px;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ref--freelance { --c: var(--amber); }
.ref--pepprio { --c: var(--red); }

.ref--head {
  background: var(--c);
  color: #0e1116;
  font-weight: 500;
}

/* A tag: pointed start, outlined */
.ref--tag {
  border-radius: 4px 999px 999px 4px;
  background: transparent;
  color: var(--green-ink);
}

.ref--tag::before {
  content: '◆ ';
}

.ref-end {
  position: absolute;
  inset-inline-end: 0;
  top: calc(var(--node-y) + 60px - 12px);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.ref__closed {
  font-size: 12px;
  color: var(--muted);
}

/* Lanes, commits, forks */
.graph {
  grid-area: graph;
  position: relative;
  min-height: 150px;
}

.lane,
.arrow,
.node,
.endcap {
  position: absolute;
}

.lane {
  --c: var(--green);
  top: 0;
  bottom: 0;
  inset-inline-start: var(--x);
  width: var(--lane-w);
  border-radius: var(--lane-w);
  background: var(--c);
  transform-origin: 50% 100%;
}

.lane--main { --c: var(--green); --x: var(--x-main); }
.lane--freelance { --c: var(--amber); --x: var(--x-freelance); }
.lane--pepprio { --c: var(--red); --x: var(--x-pepprio); }

.shape--fromNode { top: var(--node-y); }
.shape--toNode { bottom: auto; height: var(--node-y); }
.shape--open { top: 14px; }
.shape--endBelow { top: calc(var(--node-y) + 60px); }

/* Still running: arrowhead at the top of the lane */
.arrow {
  top: 4px;
  inset-inline-start: calc(var(--x) - 5px);
  width: 16px;
  height: 16px;
  border-top: var(--lane-w) solid var(--c);
  border-left: var(--lane-w) solid var(--c);
  border-radius: 3px;
  transform: rotate(45deg);
}

[dir='rtl'] .arrow {
  border-left: 0;
  border-right: var(--lane-w) solid var(--c);
  transform: rotate(-45deg);
}

.fork {
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: var(--gw);
  height: var(--node-y);
  overflow: visible;
}

[dir='rtl'] .fork {
  transform: scaleX(-1);
}

.fork path {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.fork--freelance path { stroke: var(--amber); }
.fork--pepprio path { stroke: var(--red); }

/* Commit nodes: large circles with the company mark inside */
.node {
  --c: var(--green);
  top: calc(var(--node-y) - var(--node) / 2);
  inset-inline-start: calc(var(--x) + var(--lane-w) / 2 - var(--node) / 2);
  z-index: 1;
  width: var(--node);
  height: var(--node);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 999px;
  border: 3px solid var(--c);
  background: var(--panel);
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 14px;
  color: var(--ink);
}

.node img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #fff;
}

/* Node colour follows its lane (declared after .node) */
.node.lane--main { --c: var(--green); }
.node.lane--freelance { --c: var(--amber); }
.node.lane--pepprio { --c: var(--red); }

/* The last commit of a closed branch, and the end-cap above it */
.node--end {
  --node: 20px;
  top: calc(var(--node-y) + 60px - 10px);
  background: var(--c);
}

.endcap {
  top: calc(var(--node-y) + 60px - 22px);
  inset-inline-start: calc(var(--x) - 6px);
  width: 18px;
  height: 4px;
  border-radius: 2px;
  background: var(--c);
}

/* Branches draw themselves when they scroll into view */
.graph.will-draw .lane {
  transform: scaleY(0);
}

.graph.will-draw .fork path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

.graph.will-draw .node,
.graph.will-draw .arrow,
.graph.will-draw .endcap {
  opacity: 0;
  transform: scale(.6);
}

.graph.will-draw .arrow {
  transform: rotate(45deg) scale(.6);
}

.graph.will-draw.is-drawn .lane {
  transform: scaleY(1);
  transition: transform .7s var(--ease);
}

.graph.will-draw.is-drawn .fork path {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset .5s var(--ease) .4s;
}

.graph.will-draw.is-drawn .node,
.graph.will-draw.is-drawn .endcap {
  opacity: 1;
  transform: none;
  transition: opacity .3s .5s, transform .3s .5s;
}

.graph.will-draw.is-drawn .arrow {
  opacity: 1;
  transform: rotate(45deg);
  transition: opacity .3s .6s;
}

[dir='rtl'] .graph.will-draw.is-drawn .arrow {
  transform: rotate(-45deg);
}

/* ---------- Job ---------- */
.job {
  grid-area: job;
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

.job__commit {
  font-size: 13px;
  color: var(--muted);
}

.job__hash {
  color: var(--amber-ink);
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
  margin-top: 6px;
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

@media (max-width: 760px) {
  .row {
    --node: 28px;
    --lane-w: 5px;
    /* matches the fork curves, drawn in a 116px box scaled to 64px */
    --x-main: 11px !important;
    --x-freelance: 31px !important;
    --x-pepprio: 51px !important;
    --gw: 64px !important;
    grid-template-columns: 64px minmax(0, 1fr);
    grid-template-areas: 'graph refs' 'graph job';
    column-gap: 10px;
  }

  .row__year {
    display: none;
  }

  .row__year-inline {
    display: inline;
    font-size: 12px;
    color: var(--muted);
    align-self: center;
  }

  .row__refs {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    padding-top: calc(var(--node-y) - 12px);
  }

  .ref-end {
    position: static;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }

  .fork {
    width: 64px;
  }

  .job {
    padding-top: 8px;
  }

  .job__role {
    font-size: 21px;
  }
}
</style>
