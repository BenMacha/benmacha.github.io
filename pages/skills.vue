<template>
  <div class="container page">
    <SectionTitle page :eyebrow="$t('skillsUi.eyebrow')" :title="$t('skills.title')" />

    <div class="grid" style="--min: 340px; gap: 24px">
      <section v-for="section in skillSections" :key="section.key" class="bag inventory">
        <div class="bag__head">
          <h2 class="bag__title pixel">{{ $t(`skills.${section.key}`) }}</h2>
          <span class="bag__count">{{ $t('skillsUi.count', { n: section.skills.length }) }}</span>
        </div>
        <div class="bag__slots">
          <SkillSlot v-for="(skill, i) in section.skills" :key="skill" v-reveal.pop="i" :name="skill" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { skillSections } from '~/data/skills'

const { t } = useI18n()

useHead({
  title: `${t('skills.title')} - Ben Macha Ali | PHP, Symfony, React, Vue.js, Docker`,
  meta: [
    { name: 'description', content: 'Compétences techniques de Ben Macha Ali : PHP, Symfony, Laravel, React, Vue.js, Docker, Jenkins, AWS, GraphQL, Kafka, tests automatisés.' },
  ],
})
</script>

<style scoped>
.bag {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
}

.bag__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bag__title {
  margin: 0;
  font-size: 12px;
  color: var(--inv-fg);
}

.bag__count {
  font-size: 11px;
  color: var(--inv-fg);
  opacity: .75;
}

.bag__slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 6px;
}
</style>
