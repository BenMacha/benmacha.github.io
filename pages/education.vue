<template>
  <div class="container container--narrow page education">
    <SectionTitle page :eyebrow="$t('educationUi.eyebrow')" :title="$t('education.title')" :subtitle="$t('intro.education')" />

    <div class="stack">
      <AchievementCard v-for="(degree, i) in education" :key="degree.school" v-reveal="i" :degree="degree" />
    </div>

    <section class="stack">
      <h2 class="subtitle pixel"><span>&gt;</span> {{ $t('education.internships.title') }}</h2>
      <div class="grid" style="--min: 280px; gap: 18px">
        <article v-for="(internship, i) in internships" :key="internship.company" v-reveal="i" v-lift class="entry card">
          <div class="entry__head">
            <div>
              <h3 class="entry__company pixel">{{ internship.company }}</h3>
              <p class="entry__role">{{ internship.role }}</p>
            </div>
            <span class="entry__period">{{ internship.period }}</span>
          </div>
          <div class="tags">
            <span v-for="skill in internship.skills" :key="skill" class="tag">{{ skill }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="stack">
      <h2 class="subtitle pixel"><span>&gt;</span> {{ $t('education.interests.title') }}</h2>
      <div class="grid" style="--min: 280px; gap: 18px">
        <article v-for="(interest, i) in interests" :key="interest.title" v-reveal="i" v-lift class="entry card">
          <h3 class="entry__title">{{ interest.title }}</h3>
          <div class="tags">
            <span v-for="item in interest.items" :key="item" class="tag">{{ item }}</span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { education, internships, interests } = useResume()

usePageSeo({
  title: () => t('seo.education.title'),
  description: () => t('seo.education.description'),
  breadcrumb: () => [{ name: t('nav.education'), path: '/education' }],
})
</script>

<style scoped>
.education {
  display: flex;
  flex-direction: column;
  gap: 52px;
}

.education :deep(.section-title--page) {
  margin-bottom: 0;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.subtitle {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: var(--h2);
}

.subtitle span {
  color: var(--coin);
}

.entry {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.entry__head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.entry__company {
  margin: 0 0 6px;
  font-size: 12px;
  color: var(--accent);
}

.entry__role,
.entry__period {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}

.entry__period {
  font-size: 11px;
  white-space: nowrap;
}

.entry__title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}
</style>
