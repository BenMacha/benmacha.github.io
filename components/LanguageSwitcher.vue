<template>
  <div class="langs" role="group" aria-label="Language">
    <button
      v-for="item in locales"
      :key="item.code"
      type="button"
      class="langs__btn pixel"
      :class="{ 'is-active': item.code === locale }"
      :aria-pressed="item.code === locale"
      :title="item.name"
      @click="setLocale(item.code)"
    >
      {{ item.code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
</script>

<style scoped>
.langs {
  display: flex;
  border: 3px solid var(--line);
  background: var(--card);
}

.langs__btn {
  font-size: 9px;
  padding: 8px 9px;
  border: none;
  cursor: pointer;
  background: transparent;
  color: var(--nav-ink);
}

.langs__btn.is-active {
  background: #00ff41;
  color: #0b0e1f;
}
</style>
