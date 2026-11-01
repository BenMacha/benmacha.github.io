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
            <span class="total__value total__value--merged">{{ mergedCount }}</span>
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
            <span class="total__value">{{ openCount }}</span>
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
              <span class="row__count mono">
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
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: default;
  text-align: start;
}

.total {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-color: var(--rule);
}

.total.is-on,
.row.is-on {
  border-color: var(--rule-strong);
  background: var(--panel-2);
}

.total__value {
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 30px;
  line-height: 1.1;
}

.total__value--merged {
  color: var(--green-ink);
}

.total__label {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
}

.ledger__rows {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}

.ledger__rows li {
  border-top: 1px solid var(--rule);
}

.row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 6px;
  font-size: 15px;
  font-weight: 600;
}

.row__name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row__count {
  font-size: 13px;
  color: var(--muted);
  white-space: nowrap;
  direction: ltr;
}

.is-merged {
  color: var(--green-ink);
}

.is-open {
  color: var(--ink);
}
</style>
