<template>
  <div class="container page">
    <SectionTitle page :title="$t('projects.github.title')" :subtitle="$t('intro.projects')" />

    <ol class="projects">
      <li v-for="(project, i) in projects" :key="project.url" v-reveal="i" class="project card">
        <span class="project__num mono">3.{{ i + 1 }}</span>
        <h2 class="project__name">{{ project.name }}</h2>
        <p class="project__desc">{{ project.description }}</p>
        <ul v-if="project.tasks.length" class="bullets">
          <li v-for="task in project.tasks" :key="task">{{ task }}</li>
        </ul>
        <TechList v-if="projectStacks[project.url]" :items="projectStacks[project.url]!" small class="project__stack" />
        <a :href="project.url" target="_blank" rel="noopener" class="project__link mono">{{ project.url.replace(/^https?:\/\//, '') }} ↗</a>
      </li>
    </ol>

    <PageProse page="projects" />
  </div>
</template>

<script setup lang="ts">
import { projectStacks } from '~/data/projects'

const { t } = useI18n()
const { projects } = useResume()

usePageSeo({
  title: () => t('seo.projects.title'),
  description: () => t('seo.projects.description'),
  breadcrumb: () => [{ name: t('nav.projects'), path: '/projects' }],
})
</script>

<style scoped>
.projects {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(340px, 100%), 1fr));
  gap: 20px;
}

.project {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
}

.project__num {
  font-size: 13px;
  color: var(--red-ink);
}

.project__name {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
}

.project__desc {
  margin: 0;
  color: var(--ink-2);
}

.project__stack {
  margin-top: 4px;
}

.project__link {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--rule);
  font-size: 13px;
  color: var(--green-ink);
  overflow-wrap: anywhere;
}
</style>
