<template>
  <figure class="plate">
    <div class="plate__card card">
      <div class="plate__corner plate__corner--fig mono">{{ fig }}</div>
      <div class="plate__corner plate__corner--title mono">{{ title }}</div>
      <div class="plate__body" :class="{ 'plate__body--side': $slots.side }">
        <div v-if="$slots.side" class="plate__side">
          <slot name="side" />
        </div>
        <div class="plate__art">
          <slot />
        </div>
      </div>
      <div class="plate__corner plate__corner--hint mono" aria-hidden="true">{{ hint }}</div>
      <div class="plate__corner plate__corner--readout mono" aria-live="polite">{{ readout }}</div>
    </div>
    <figcaption v-if="caption" class="plate__caption caption">{{ fig }} — {{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
defineProps<{
  fig: string
  title: string
  hint: string
  readout: string
  caption?: string
}>()
</script>

<style scoped>
.plate {
  margin: 0;
}

.plate__card {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr auto;
  gap: 10px 16px;
  padding: 18px 22px;
  border-radius: 16px;
}

.plate__corner {
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
}

.plate__corner--fig {
  color: var(--red-ink);
}

.plate__corner--title,
.plate__corner--readout {
  text-align: end;
}

.plate__corner--readout {
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.plate__body {
  grid-column: 1 / -1;
  min-width: 0;
}

.plate__body--side {
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
  gap: 24px;
  align-items: center;
}

.plate__art {
  min-width: 0;
}

.plate__caption {
  max-width: 820px;
  margin-top: 12px;
}

@media (max-width: 760px) {
  .plate__card {
    padding: 14px 12px;
  }

  .plate__body--side {
    grid-template-columns: 1fr;
  }

  .plate__art {
    margin-inline: -6px;
  }

  .plate__corner--hint {
    display: none;
  }

  .plate__corner--readout {
    grid-column: 1 / -1;
    text-align: start;
  }
}
</style>
