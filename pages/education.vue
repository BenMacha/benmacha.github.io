<template>
  <div class="container container--narrow page education">
    <SectionTitle page :title="$t('education.title')" :subtitle="$t('intro.education')" />

    <div class="stack">
      <AchievementCard v-for="(degree, i) in education" :key="degree.school" v-reveal="i" :degree="degree" />
    </div>

    <section class="stack">
      <h2 class="subtitle"><span class="mono">6.2</span> {{ $t('education.internships.title') }}</h2>
      <div class="grid" style="--min: 280px; gap: 18px">
        <article v-for="(internship, i) in internships" :key="internship.company" v-reveal="i" class="entry card">
          <div class="entry__head">
            <div>
              <h3 class="entry__company">{{ internship.company }}</h3>
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
      <h2 class="subtitle"><span class="mono">6.3</span> {{ $t('education.interests.title') }}</h2>
      <div class="grid" style="--min: 280px; gap: 18px">
        <article v-for="(interest, i) in interests" :key="interest.title" v-reveal="i" class="entry card">
          <h3 class="entry__title">{{ interest.title }}</h3>
          <div class="tags">
            <span v-for="item in interest.items" :key="item" class="tag">{{ item }}</span>
          </div>
        </article>
      </div>
    </section>

    <PageProse page="education" class="education__prose" />
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
  gap: 48px;
}

.education :deep(.chapter-head) {
  margin-bottom: 0;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.subtitle {
  margin: 0;
  font-size: 26px;
  line-height: 1.25;
}

.subtitle span {
  font-size: 14px;
  font-weight: 400;
  color: var(--green-ink);
  margin-inline-end: 8px;
}

.entry {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px;
}

.entry__head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.entry__company {
  margin: 0 0 4px;
  font-size: 20px;
  line-height: 1.25;
}

.entry__role {
  margin: 0;
  color: var(--ink-2);
}

.entry__period {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}

.entry__title {
  margin: 0;
  font-size: 18px;
}

.education > .prose {
  margin-top: 0;
}
</style>
