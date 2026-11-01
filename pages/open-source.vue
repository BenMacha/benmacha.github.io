<template>
  <div class="container page os">
    <SectionTitle page :eyebrow="$t('sections.openSource')" :title="$t('openSource.title')" :subtitle="$t('openSource.intro')" />

    <OpenSourceMachine />

    <section class="os__section" aria-labelledby="os-prs">
      <h2 id="os-prs" class="os__heading pixel">{{ $t('openSource.byProject') }}</h2>
      <div class="os__projects">
        <article v-for="(project, i) in projects" :key="project.id" v-reveal="i" class="project card">
          <header class="project__head">
            <span class="project__logo" aria-hidden="true"><OpenSourceLogo :logo="project.logo" /></span>
            <h3 class="project__name pixel">{{ project.name }}</h3>
            <span class="project__badges">
              <span v-if="project.merged.length" class="badge badge--merged pixel">{{ project.merged.length }} {{ $t('openSource.merged') }}</span>
              <span v-if="project.open.length" class="badge badge--open pixel">{{ project.open.length }} {{ $t('openSource.open') }}</span>
            </span>
            <a :href="project.url" target="_blank" rel="noopener" class="project__repo">{{ $t('openSource.repo') }} ↗</a>
          </header>

          <div class="project__lists">
            <div v-for="group in groups(project)" :key="group.state" class="prs">
              <h4 class="prs__title pixel">
                <span class="prs__icon" :class="`prs__icon--${group.state}`" aria-hidden="true">{{ group.state === 'open' ? '?' : '' }}</span>
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
              <h4 class="prs__title pixel">
                <span class="prs__icon prs__icon--note" aria-hidden="true">!</span>
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
      <h2 id="os-packages" class="os__heading pixel">{{ $t('openSource.shelf.heading') }}</h2>
      <OpenSourceShelf />
    </section>

    <section class="os__section" aria-labelledby="os-orgs">
      <h2 id="os-orgs" class="os__heading pixel">{{ $t('openSource.orgs.heading') }}</h2>
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

.os :deep(.section-title--page) {
  margin-bottom: 0;
}

.os__section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.os__heading {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: var(--h2);
}

.os__projects {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.project {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
}

.project__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
}

.project__logo {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--chip);
  border: 3px solid var(--line);
  color: var(--ink);
}

.project__name {
  margin: 0;
  font-size: 13px;
  color: var(--accent);
}

.project__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badge {
  font-size: 8px;
  padding: 5px 7px;
  border: 2px solid #000;
  white-space: nowrap;
}

.badge--merged {
  background: var(--coin);
  color: var(--navy);
}

.badge--open {
  background: var(--grass);
  color: #0b0e1f;
}

.project__repo {
  margin-inline-start: auto;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
}

.project__lists {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(380px, 100%), 1fr));
  gap: 18px 28px;
}

.prs__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 10px;
  font-size: 9px;
  line-height: 1.6;
  color: var(--muted);
}

.prs__icon {
  flex: none;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: var(--navy);
  border: 2px solid var(--navy);
}

.prs__icon--merged {
  width: 12px;
  border-radius: 50%;
  background: var(--coin);
  box-shadow: inset -2px 0 0 var(--coin-dark);
}

.prs__icon--open {
  background: var(--coin);
  box-shadow: inset -2px -2px 0 var(--coin-dark);
}

.prs__icon--note {
  background: var(--mario);
  color: #fff;
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
  padding: 7px 0;
  border-bottom: 2px dotted var(--border);
}

.pr:last-child {
  border-bottom: 0;
}

.pr__link {
  flex: 1;
  min-width: 0;
  display: flex;
  gap: 8px;
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--ink);
  direction: ltr;
  text-align: left;
}

.pr__link:hover .pr__title {
  color: var(--accent);
  text-decoration: underline;
}

.pr__num {
  flex: none;
  font-weight: 600;
  color: var(--muted);
}

.pr__title {
  overflow-wrap: anywhere;
}

.pr__date {
  flex: none;
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
}

@media (max-width: 560px) {
  .pr {
    flex-direction: column;
    gap: 2px;
  }
}

.note {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--ink);
}

.note__link {
  display: inline-block;
  margin-inline-start: 6px;
  font-weight: 600;
  color: var(--accent);
  direction: ltr;
}

.os__updated {
  margin: 0;
  font-size: 11px;
  color: var(--h2);
  opacity: .8;
}
</style>
