<template>
  <div>
    <!-- Preface -->
    <section class="container preface">
      <div class="preface__text">
        <span class="eyebrow eyebrow--green">{{ $t('book.preface') }}</span>
        <h1 class="preface__title">{{ $t('book.heroLead') }} <span class="accent">{{ $t('book.heroAccent') }}</span></h1>
        <p class="lead">{{ $t('book.heroText') }}</p>
        <div class="preface__cta">
          <a :href="socialLinks.cv" target="_blank" class="btn btn--primary">{{ $t('book.cv') }}</a>
          <a :href="`mailto:${socialLinks.email}`" class="btn">{{ $t('book.contact') }}</a>
        </div>
        <dl class="facts">
          <div v-for="fact in facts" :key="fact.label" class="facts__item">
            <dt class="mono">{{ fact.label }}</dt>
            <dd :class="fact.tone">
              <template v-if="fact.unit">{{ fact.unitBefore }}<span v-count="fact.value">{{ fact.value }}</span>{{ fact.unitAfter }}</template>
              <span v-else v-count="fact.value">{{ fact.value }}</span>
            </dd>
          </div>
        </dl>
      </div>
      <BookWorkbench class="preface__fig" />
    </section>

    <!-- Table of contents -->
    <section class="toc" aria-labelledby="toc-title">
      <div class="container toc__inner">
        <div class="toc__head">
          <h2 id="toc-title" class="h2">{{ $t('book.toc') }}</h2>
          <span class="caption">{{ $t('book.tocSummary') }}</span>
        </div>
        <ol class="toc__list">
          <li v-for="(chapter, i) in chapters" :key="chapter.page" v-reveal="i">
            <NuxtLink :to="localePath(`/${chapter.page}`)" class="toc__link">
              <span class="toc__num mono" :class="chapter.accent === 'green' ? 'eyebrow--green' : 'eyebrow--red'">{{ chapter.num }}</span>
              <span class="toc__title">{{ $t(`nav.${chapter.page}`) }}</span>
              <span class="toc__text">{{ $t(`book.chapters.${chapter.page}`) }}</span>
              <span class="toc__page mono">{{ $t('book.page') }} {{ chapter.folio }}</span>
            </NuxtLink>
          </li>
        </ol>
      </div>
    </section>

    <!-- Latest chapters (jobs) -->
    <section class="container latest" aria-labelledby="latest-title">
      <div class="latest__intro">
        <span class="eyebrow eyebrow--red">{{ $t('book.chapter') }} 01</span>
        <h2 id="latest-title" class="h2">{{ $t('book.latestTitle') }}</h2>
        <p class="latest__text">{{ $t('book.latestText') }}</p>
        <p class="legend">
          <span><i class="swatch swatch--green" />{{ $t('book.legend.salaried') }}</span>
          <span><i class="swatch swatch--amber" />{{ $t('book.legend.freelance') }}</span>
          <span><i class="swatch swatch--red" />{{ $t('book.legend.own') }}</span>
        </p>
      </div>
      <div class="latest__jobs">
        <article v-for="(job, i) in latest" :key="job.company" v-reveal="i" class="job card">
          <span class="job__stroke" :class="`swatch--${tone(job.company)}`" />
          <span class="mono job__meta">{{ job.period }} · {{ $t(`book.kinds.${contractOf(job.company).kind}`) }}</span>
          <h3 class="job__company">{{ companyName(job.company) }}</h3>
          <p class="job__role">{{ job.role }}</p>
          <p class="job__text">{{ job.tasks[0] }}</p>
        </article>
        <NuxtLink :to="localePath('/experience')" class="latest__more btn btn--ghost">{{ $t('sections.seeAll') }} →</NuxtLink>
      </div>
    </section>

    <!-- Appendix A: open source -->
    <section class="container annex" aria-labelledby="annex-a">
      <div class="annex__card card">
        <div class="annex__text">
          <span class="eyebrow eyebrow--green">{{ $t('book.annexA.eyebrow') }}</span>
          <h2 id="annex-a" class="h2 annex__title">{{ $t('book.annexA.title', { n: symfonyMerged }) }}</h2>
          <p class="annex__lead">{{ $t('book.annexA.text') }}</p>
          <NuxtLink :to="localePath('/open-source')" class="btn btn--green annex__cta">{{ $t('book.annexA.cta') }} →</NuxtLink>
        </div>
        <dl class="annex__stats">
          <div class="stat"><dd class="stat__value green" v-count="mergedCount">{{ mergedCount }}</dd><dt class="mono">{{ $t('book.annexA.merged') }}</dt></div>
          <div class="stat"><dd class="stat__value" v-count="openCount">{{ openCount }}</dd><dt class="mono">{{ $t('book.annexA.open') }}</dt></div>
          <div class="stat"><dd class="stat__value" v-count="upstream">{{ upstream }}</dd><dt class="mono">{{ $t('book.annexA.projects') }}</dt></div>
          <div class="stat"><dd class="stat__value red" v-count="packages.length">{{ packages.length }}</dd><dt class="mono">{{ $t('book.annexA.bundles') }}</dt></div>
        </dl>
      </div>
    </section>

    <!-- Appendix B: recess (the mini-games) -->
    <ArcadeSection />
  </div>
</template>

<script setup lang="ts">
import { chapters, socialLinks } from '~/data/site'
import { contractOf } from '~/data/experience'
import { contributionsByProject, mergedCount, openCount, packages } from '~/data/opensource'

const { t } = useI18n()
const localePath = useLocalePath()
const { experiences } = useResume()

const symfonyMerged = contributionsByProject.find(p => p.id === 'symfony')?.merged.length ?? 0
const upstream = contributionsByProject.filter(p => p.merged.length || p.open.length).length

// "10 ans" / "10 years" / "10 سنوات": the number is animated, the unit stays around it
const yearsParts = computed(() => t('book.facts.years', { n: '§' }).split('§'))
const facts = computed(() => [
  { label: t('book.facts.experience'), value: 10, unit: true, unitBefore: yearsParts.value[0], unitAfter: yearsParts.value[1], tone: '' },
  { label: t('book.facts.merged'), value: mergedCount, tone: 'green' },
  { label: t('book.facts.bundles'), value: packages.length, tone: 'red' },
  { label: t('book.facts.products'), value: 2, tone: '' },
])

const latest = computed(() => experiences.value.slice(0, 3))
const tone = (company: string) => ({ permanent: 'green', freelance: 'amber', own: 'red' } as const)[contractOf(company).contract]
const companyName = (company: string) => contractOf(company).name

usePageSeo({
  title: () => t('seo.home.title'),
  description: () => t('seo.home.description'),
  type: 'profile',
})

// The home page is Ben Macha Ali's profile (schema.org ProfilePage)
useHead({
  script: [{
    key: 'profile-page',
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      'mainEntity': { '@id': PERSON_ID },
      'about': { '@id': PERSON_ID },
    }),
  }],
})
</script>

<style scoped>
.h2 {
  margin: 0;
  font-size: clamp(28px, 4vw, 36px);
  line-height: 1.15;
  letter-spacing: -.6px;
}

.accent {
  color: var(--red-ink);
}

.green {
  color: var(--green-ink);
}

.red {
  color: var(--red-ink);
}

/* Preface */
.preface {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 56px;
  padding-block: 88px 72px;
}

.preface__text {
  flex: 999 1 520px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.preface__title {
  margin: 0;
  font-size: clamp(38px, 6.2vw, 64px);
  line-height: 1.04;
  letter-spacing: -1.5px;
}

.preface__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.preface__fig {
  flex: 1 1 420px;
  min-width: 0;
}

.facts {
  margin: 8px 0 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--rule);
}

.facts__item {
  padding: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.facts dt {
  font-size: 12px;
  color: var(--muted);
}

.facts dd {
  margin: 0;
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 30px;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

/* Table of contents */
.toc {
  border-block: 1px solid var(--rule);
  background: var(--panel);
}

.toc__inner {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-block: 64px;
}

.toc__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
}

.toc__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc__list li {
  border-top: 1px solid var(--rule);
}

.toc__link {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 24px;
  padding: 20px 0;
}

.toc__link:hover .toc__title {
  color: var(--green-ink);
}

.toc__num {
  flex: 0 0 64px;
  font-size: 14px;
}

.toc__title {
  flex: 1 1 260px;
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 26px;
  line-height: 1.2;
  color: var(--ink);
  transition: color .2s;
}

.toc__text {
  flex: 999 1 320px;
  color: var(--ink-2);
}

.toc__page {
  flex: 0 0 auto;
  font-size: 13px;
  color: var(--muted);
}

/* Latest chapters */
.latest {
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
  padding-block: 72px;
}

.latest__intro {
  flex: 1 1 280px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.latest__text {
  margin: 0;
  color: var(--ink-2);
}

.legend {
  margin: 8px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: var(--ink-2);
}

.legend span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.latest__jobs {
  flex: 999 1 640px;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.latest__more {
  grid-column: 1 / -1;
  justify-self: start;
}

.job {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.job__stroke {
  width: 40px;
  height: 3px;
  border-radius: 2px;
}

.job__meta {
  font-size: 12px;
  color: var(--muted);
}

.job__company {
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
}

.job__role {
  margin: 0;
  font-weight: 600;
}

.job__text {
  margin: 0;
  font-size: 15px;
  color: var(--ink-2);
}

/* Appendix A */
.annex {
  padding-bottom: 72px;
}

.annex__card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px;
  padding: 36px;
  border-radius: 18px;
}

.annex__text {
  flex: 999 1 420px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.annex__title {
  font-size: clamp(26px, 3.4vw, 32px);
}

.annex__lead {
  margin: 0;
  color: var(--ink-2);
}

.annex__cta {
  align-self: flex-start;
}

.annex__stats {
  flex: 1 1 300px;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat {
  display: flex;
  flex-direction: column-reverse;
  padding: 16px;
  border: 1px solid var(--rule);
  border-radius: 12px;
}

.stat__value {
  margin: 0;
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 36px;
  line-height: 1.1;
}

.stat dt {
  font-size: 12px;
  color: var(--muted);
}

@media (max-width: 900px) {
  .latest__jobs {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .preface {
    padding-block: 40px 28px;
    gap: 32px;
  }

  .preface__cta .btn {
    flex: 1 1 100%;
  }

  .facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .toc__inner {
    padding-block: 28px;
  }

  .toc__link {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2px 12px;
    padding: 14px 0;
  }

  .toc__link > span {
    flex: none;
  }

  .toc__num {
    grid-row: 1;
    grid-column: 1;
    font-size: 12px;
  }

  .toc__page {
    grid-row: 1;
    grid-column: 2;
    font-size: 12px;
  }

  .toc__title,
  .toc__text {
    grid-column: 1 / -1;
  }

  .toc__title {
    font-size: 21px;
  }

  .toc__text {
    font-size: 14px;
  }

  .latest {
    padding-block: 40px;
    gap: 24px;
  }

  .annex__card {
    padding: 22px;
  }
}
</style>
