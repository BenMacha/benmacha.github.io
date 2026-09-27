<template>
  <section class="home-section">
    <SectionTitle
      :eyebrow="$t('sections.projects')"
      :title="$t('projects.github.title')"
      to="/projects"
      :link-label="$t('sections.seeAll')"
    />
    <div class="grid" style="--min: 220px">
      <a
        v-for="(project, i) in projects"
        :key="project.url"
        v-reveal="i"
        :href="project.url"
        target="_blank"
        rel="noopener"
        v-lift
        class="repo card"
      >
        <span class="repo__icon coin-block" aria-hidden="true">{{ project.icon }}</span>
        <span class="repo__name pixel">{{ project.name }}</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
const { projects } = useResume()
</script>

<style scoped>
.repo {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  color: var(--ink);
}

.repo:hover {
  color: var(--ink);
}

.repo__icon {
  flex: none;
  width: 48px;
  height: 48px;
  font-size: 20px;
}

.repo__name {
  font-size: 10px;
  line-height: 1.6;
}
</style>
