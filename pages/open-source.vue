<template>
  <div class="container page os">
    <SectionTitle page :title="$t('openSource.title')" :subtitle="$t('openSource.intro')" />

    <OpenSourceMachine />

    <section class="os__section" aria-labelledby="os-prs">
      <h2 id="os-prs" class="os__heading"><span class="mono">4.1</span> {{ $t('openSource.byProject') }}</h2>
      <div class="os__projects">
        <article v-for="(project, i) in projects" :key="project.id" v-reveal="i" class="project card">
          <header class="project__head">
            <span class="project__logo" aria-hidden="true"><OpenSourceLogo :logo="project.logo" /></span>
            <h3 class="project__name">{{ project.name }}</h3>
            <span class="project__badges">
              <span v-if="project.merged.length" class="badge badge--merged mono">{{ project.merged.length }} {{ $t('openSource.merged') }}</span>
              <span v-if="project.open.length" class="badge badge--open mono">{{ project.open.length }} {{ $t('openSource.open') }}</span>
            </span>
            <a :href="project.url" target="_blank" rel="noopener" class="project__repo">{{ $t('openSource.repo') }} ↗</a>
          </header>

          <div class="project__lists">
            <div v-for="group in groups(project)" :key="group.state" class="prs">
              <h4 class="prs__title mono">
                <span class="swatch" :class="group.state === 'merged' ? 'swatch--green' : 'swatch--open'" aria-hidden="true" />
                {{ group.title }} · {{ group.items.length }}
              </h4>
              <ul class="prs__list">
                <li v-for="pr in group.items" :key="pr.url" class="pr">
                  <a :href="pr.url" target="_blank" rel="noopener" class="pr__link">
                    <span class="pr__num">#{{ pr.number }}</span>
                    <span class="pr__title">{{ pr.title }}</span>
                  </a>
                  <time class="pr__date" :datetime="pr.mergedAt ?? pr.createdAt">{{ formatDate(pr.mergedAt ?? pr.createdAt) }}</time>
                </li>
              </ul>
            </div>

            <div v-for="note in notesOf(project.id)" :key="note.url" class="prs">
              <h4 class="prs__title mono">
                <span class="swatch swatch--red" aria-hidden="true" />
                {{ $t('openSource.security') }}
              </h4>
              <p class="note">
                {{ $t(`openSource.notes.${note.key}`) }}
                <a :href="note.url" target="_blank" rel="noopener" class="note__link">{{ note.label }} ↗</a>
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="os__section" aria-labelledby="os-packages">
      <h2 id="os-packages" class="os__heading"><span class="mono">4.2</span> {{ $t('openSource.shelf.heading') }}</h2>
      <OpenSourceShelf />
    </section>

    <section class="os__section" aria-labelledby="os-orgs">
      <h2 id="os-orgs" class="os__heading"><span class="mono">4.3</span> {{ $t('openSource.orgs.heading') }}</h2>
      <OpenSourceStreet />
    </section>

    <p class="os__updated">{{ $t('openSource.updated', { date: formatDate(updatedAt) }) }}</p>
  </div>
</template>

<script setup lang="ts">
import { contributionsByProject, securityNotes, updatedAt, type ProjectContributions } from '~/data/opensource'

const { t, locale } = useI18n()

const projects = contributionsByProject.filter(p => p.merged.length || p.open.length)

const groups = (project: ProjectContributions) => [
  { state: 'merged', title: t('openSource.mergedList'), items: project.merged },
  { state: 'open', title: t('openSource.openList'), items: project.open },
].filter(g => g.items.length)

const notesOf = (id: string) => securityNotes.filter(note => note.project === id)

// Dates are written in UTC so the prerendered page and the browser agree
function formatDate(iso: string) {
  if (!iso) return ''
  const lang = locale.value === 'ar' ? 'ar-u-nu-latn' : locale.value
  return new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(iso))
}

usePageSeo({
  title: () => t('openSource.seo.title'),
  description: () => t('openSource.seo.description'),
  breadcrumb: () => [{ name: t('nav.open-source'), path: '/open-source' }],
})
</script>

<style scoped>
.os {
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.os :deep(.chapter-head) {
  margin-bottom: 0;
}

.os__section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.os__heading {
  margin: 0;
  font-size: clamp(26px, 3.6vw, 32px);
  line-height: 1.2;
}

.os__heading span {
  font-size: 14px;
  font-weight: 400;
  color: var(--green-ink);
  margin-inline-end: 8px;
}

.os__projects {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
}

.project__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
}

.project__logo {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--rule);
  border-radius: 10px;
  color: var(--ink);
}

.project__name {
  margin: 0;
  font-size: 24px;
}

.project__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badge {
  font-size: 12px;
  padding: 2px 10px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  white-space: nowrap;
  color: var(--ink-2);
}

.badge--merged {
  border-color: var(--green);
  color: var(--green-ink);
}

.project__repo {
  margin-inline-start: auto;
  font-size: 14px;
  font-weight: 700;
  color: var(--green-ink);
}

.project__lists {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(380px, 100%), 1fr));
  gap: 18px 32px;
}

.prs__title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--muted);
}

.swatch--open {
  background: var(--muted);
}

.prs__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}

.pr {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 8px 0;
  border-top: 1px solid var(--rule);
}

.pr__link {
  flex: 1;
  min-width: 0;
  display: flex;
  gap: 8px;
  font-size: 15px;
  line-height: 1.55;
  color: var(--ink);
  direction: ltr;
  text-align: left;
}

.pr__link:hover .pr__title {
  color: var(--green-ink);
}

.pr__num {
  flex: none;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
}

.pr__title {
  overflow-wrap: anywhere;
}

.pr__date {
  flex: none;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}

.note {
  margin: 0;
  font-size: 15px;
  line-height: 1.65;
  color: var(--ink-2);
}

.note__link {
  display: inline-block;
  margin-inline-start: 6px;
  font-weight: 700;
  color: var(--green-ink);
  direction: ltr;
}

.os__updated {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
}

@media (max-width: 560px) {
  .pr {
    flex-direction: column;
    gap: 2px;
  }
}
</style>
