<template>
  <section class="contact card">
    <div class="contact__text">
      <div class="contact__eyebrow pixel">{{ $t('contactUi.eyebrow') }}</div>
      <h2 class="contact__title pixel">{{ $t('contactUi.title') }}</h2>
      <p class="contact__details">
        {{ socialLinks.email }} · linkedin.com/in/benmacha · github.com/BenMacha
      </p>
    </div>
    <div class="contact__actions">
      <a :href="`mailto:${socialLinks.email}`" class="btn btn--red">✉ {{ $t('home.contact') }}</a>
      <a :href="socialLinks.cv" target="_blank" class="btn btn--coin">▼ {{ $t('contactUi.cv') }}</a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { socialLinks } from '~/data/site'
</script>

<style scoped>
.contact {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding: clamp(24px, 5vw, 40px) clamp(18px, 4vw, 32px);
  box-shadow: inset 3px 3px 0 var(--hi), inset -3px -3px 0 var(--lo), 8px 8px 0 var(--shadow);
}

.contact__text {
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.contact__eyebrow {
  font-size: 10px;
  color: var(--coin);
}

html.light .contact__eyebrow {
  color: var(--eyebrow);
}

.contact__title {
  margin: 0;
  font-size: 22px;
  line-height: 1.4;
}

.contact__details {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.contact__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

@media (max-width: 480px) {
  .contact__actions,
  .contact__actions .btn {
    flex: 1 1 100%;
  }
}
</style>
