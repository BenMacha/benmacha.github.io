<template>
  <div class="container page">
    <SectionTitle page :title="$t('skills.title')" :subtitle="$t('intro.skills')" />

    <div class="grid" style="--min: 320px; gap: 20px" data-build-stage>
      <section v-for="(section, s) in skillSections" :key="section.key" v-reveal="s" class="bag card" data-build>
        <div class="bag__head">
          <span class="bag__num mono">2.{{ s + 1 }}</span>
          <h2 class="bag__title">{{ $t(`skills.${section.key}`) }}</h2>
          <span class="bag__count mono">{{ section.skills.length }}</span>
        </div>
        <div class="bag__list">
          <SkillSlot v-for="skill in section.skills" :key="skill" :name="skill" />
        </div>
      </section>
    </div>

    <PageProse page="skills" />

    <AgentsBuild />
  </div>
</template>

<script setup lang="ts">
import { skillSections } from '~/data/skills'

const { t } = useI18n()

usePageSeo({
  title: () => t('seo.skills.title'),
  description: () => t('seo.skills.description'),
  breadcrumb: () => [{ name: t('nav.skills'), path: '/skills' }],
})
</script>

<style scoped>
.bag {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
}

.bag__head {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.bag__num {
  font-size: 13px;
  color: var(--green-ink);
}

.bag__title {
  flex: 1;
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
}

.bag__count {
  font-size: 12px;
  color: var(--muted);
}
</style>
