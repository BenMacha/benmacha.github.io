<template>
  <section class="home-section">
    <SectionTitle
      :eyebrow="$t('sections.education')"
      :title="$t('education.title')"
      to="/education"
      :link-label="$t('sections.seeAll')"
    />
    <div class="grid" style="--min: 320px">
      <AchievementCard v-for="(degree, i) in education" :key="degree.school" v-reveal="i" :degree="degree" />
    </div>
  </section>
</template>

<script setup lang="ts">
const { education } = useResume()
</script>
