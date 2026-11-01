<template>
  <figure class="plate">
    <div class="plate__card card">
      <div class="plate__corner plate__corner--fig pixel">{{ fig }}</div>
      <div class="plate__corner plate__corner--title pixel">{{ title }}</div>
      <div class="plate__body" :class="{ 'plate__body--side': $slots.side }">
        <div v-if="$slots.side" class="plate__side">
          <slot name="side" />
        </div>
        <div class="plate__art">
          <slot />
        </div>
      </div>
      <div class="plate__corner plate__corner--hint pixel" aria-hidden="true">{{ hint }}</div>
      <div class="plate__corner plate__corner--readout pixel" aria-live="polite">{{ readout }}</div>
    </div>
    <figcaption v-if="caption" class="plate__caption">{{ caption }}</figcaption>
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
  padding: 18px 20px;
}

.plate__corner {
  font-size: 8px;
  line-height: 1.7;
  color: var(--muted);
  letter-spacing: .04em;
}

.plate__corner--fig {
  color: var(--eyebrow);
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
  gap: 20px;
  align-items: center;
}

.plate__art {
  min-width: 0;
}

.plate__caption {
  max-width: 760px;
  margin-top: 14px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--h2);
  opacity: .85;
}

@media (max-width: 760px) {
  .plate__card {
    padding: 14px 12px;
  }

  .plate__body--side {
    grid-template-columns: 1fr;
  }

  /* The drawing is wide: let it bleed a little so it stays readable on phones */
  .plate__art {
    margin-inline: -8px;
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
