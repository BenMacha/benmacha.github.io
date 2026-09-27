<template>
  <div class="stars" role="img" :aria-label="$t('experienceUi.rating', { n: label })" :title="$t('experienceUi.rating', { n: label })">
    <span
      v-for="(fill, i) in fills"
      :key="i"
      class="stars__star"
      :class="`stars__star--${fill}`"
      aria-hidden="true"
    >★</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ value: number }>()

const { locale } = useI18n()

/** 'full' | 'half' | 'empty' for each of the 5 stars. */
const fills = computed(() =>
  Array.from({ length: 5 }, (_, i) => {
    const rest = props.value - i
    return rest >= 1 ? 'full' : rest >= 0.5 ? 'half' : 'empty'
  }),
)

const label = computed(() => new Intl.NumberFormat(locale.value).format(props.value))
</script>

<style scoped>
.stars {
  display: inline-flex;
  gap: 2px;
  direction: ltr;
  line-height: 1;
}

.stars__star {
  font-family: system-ui, sans-serif;
  font-size: 16px;
  color: var(--coin);
  text-shadow: 2px 2px 0 #000;
}

.stars__star--empty {
  color: var(--border);
}

.stars__star--half {
  color: transparent;
  background: linear-gradient(90deg, var(--coin) 50%, var(--border) 50%);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(2px 2px 0 #000);
}
</style>
