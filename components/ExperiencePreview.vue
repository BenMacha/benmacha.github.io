<template>
  <section class="home-section">
    <SectionTitle
      :eyebrow="$t('sections.experience')"
      :title="$t('experience.title')"
      to="/experience"
      :link-label="$t('sections.seeAll')"
    />
    <div class="grid">
      <article v-for="(job, i) in latest" :key="job.company" v-reveal="i" v-lift class="job card">
        <div class="job__head">
          <span class="level">LVL 1-{{ experiences.length - i }}</span>
          <span class="job__period">{{ job.period }}</span>
        </div>
        <h3 class="job__company pixel">{{ job.company }}</h3>
        <p class="job__role">{{ job.role }}</p>
        <p class="job__task">▸ {{ job.tasks[0] }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const { experiences } = useResume()
const latest = computed(() => experiences.value.slice(0, 3))
</script>

<style scoped>
.job {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.job__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.job__period {
  font-size: 11px;
  color: var(--muted);
}

.job__company {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--accent);
}

.job__role {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.job__task {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
}
</style>
