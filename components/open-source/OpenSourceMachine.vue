<template>
  <OpenSourcePlate
    :fig="$t('openSource.fig', { n: 1 })"
    :title="$t('openSource.machine.title')"
    :hint="$t('openSource.machine.hint')"
    :readout="readout"
    :caption="compact ? undefined : $t('openSource.machine.caption')"
  >
    <template #side>
      <div class="ledger">
        <div class="ledger__totals">
          <button
            type="button"
            class="total"
            :class="{ 'is-on': focus === 'merged' }"
            @pointerenter="focus = 'merged'"
            @pointerleave="focus = null"
            @focus="focus = 'merged'"
            @blur="focus = null"
          >
            <span class="total__icon total__icon--coin" aria-hidden="true" />
            <span class="total__value pixel">{{ mergedCount }}</span>
            <span class="total__label">{{ $t('openSource.merged') }}</span>
          </button>
          <button
            type="button"
            class="total"
            :class="{ 'is-on': focus === 'open' }"
            @pointerenter="focus = 'open'"
            @pointerleave="focus = null"
            @focus="focus = 'open'"
            @blur="focus = null"
          >
            <span class="total__icon total__icon--q pixel" aria-hidden="true">?</span>
            <span class="total__value total__value--open pixel">{{ openCount }}</span>
            <span class="total__label">{{ $t('openSource.open') }}</span>
          </button>
        </div>
        <ul class="ledger__rows">
          <li v-for="project in rows" :key="project.id">
            <button
              type="button"
              class="row"
              :class="{ 'is-on': focus === project.id }"
              @pointerenter="focus = project.id"
              @pointerleave="focus = null"
              @focus="focus = project.id"
              @blur="focus = null"
            >
              <OpenSourceLogo :logo="project.logo" />
              <span class="row__name">{{ project.name }}</span>
              <span class="row__count pixel">
                <span :class="{ 'is-merged': project.merged.length }">{{ project.merged.length }}</span>
                ·
                <span :class="{ 'is-open': project.open.length }">{{ project.open.length }}</span>
              </span>
            </button>
          </li>
        </ul>
      </div>
    </template>

    <div
      ref="stage"
      class="iso iso-stage"
      :data-focus="focus || undefined"
      :data-paused="paused || undefined"
      @pointerover="onPointerOver"
      @pointerleave="onPointerLeave"
      v-html="figure.svg"
    />
  </OpenSourcePlate>
</template>

<script setup lang="ts">
import { contributionsByProject, mergedCount, openCount } from '~/data/opensource'
import { prMachine } from '~/utils/anatomy/pr-machine.mjs'

const props = defineProps<{
  /** Home page preview: no caption, its own animation names. */
  compact?: boolean
}>()

const { t } = useI18n()

const rows = contributionsByProject.filter(p => p.merged.length || p.open.length)
const share = mergedCount + openCount ? Math.round((mergedCount / (mergedCount + openCount)) * 100) : 0

const figure = computed(() => prMachine({
  idPrefix: props.compact ? 'prh' : 'prm',
  projects: rows.map(p => ({ id: p.id, merged: p.merged.length, open: p.open.length })),
  label: t('openSource.machine.label', { merged: mergedCount, open: openCount, share }),
}))

const stage = ref<HTMLElement | null>(null)
const ids = ['merged', 'open', ...rows.map(p => p.id)]
const { focus, paused, onPointerOver, onPointerLeave } = useIsoStage(stage, () => ids)

const readout = computed(() => {
  const project = rows.find(p => p.id === focus.value)
  if (project) return `${project.name} · ${project.merged.length} ${t('openSource.merged')} · ${project.open.length} ${t('openSource.open')}`
  return `${mergedCount} ${t('openSource.merged')} · ${openCount} ${t('openSource.open')} · ${t('openSource.mergedShare', { n: share })}`
})
</script>

<style scoped>
.ledger {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ledger__totals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.total,
.row {
  font: inherit;
  color: var(--ink);
  background: none;
  border: 3px solid transparent;
  cursor: default;
  text-align: start;
}

.total {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 6px 8px;
  padding: 6px 4px;
}

.total.is-on,
.row.is-on {
  border-color: var(--border);
  background: var(--chip);
}

.total__icon {
  grid-row: span 2;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--navy);
}

.total__icon--coin {
  width: 16px;
  margin-inline: 3px;
  border-radius: 50%;
  background: var(--coin);
  box-shadow: inset -3px 0 0 var(--coin-dark);
}

.total__icon--q {
  font-size: 10px;
  color: var(--navy);
  background: var(--coin);
  box-shadow: inset -2px -2px 0 var(--coin-dark), inset 2px 2px 0 var(--coin-light);
}

.total__value {
  font-size: 20px;
  line-height: 1;
  color: var(--coin);
}

html.light .total__value {
  color: #b07a00;
}

.total__value--open,
html.light .total__value--open {
  color: var(--accent);
}

.total__label {
  grid-column: 2;
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
}

.ledger__rows {
  margin: 0;
  padding: 12px 0 0;
  list-style: none;
  border-top: 3px dotted var(--border);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 6px;
  font-size: 13px;
}

.row__name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row__count {
  font-size: 9px;
  color: var(--muted);
  white-space: nowrap;
  direction: ltr;
}

.is-merged {
  color: var(--coin);
}

html.light .is-merged {
  color: #b07a00;
}

.is-open {
  color: var(--accent);
}
</style>
