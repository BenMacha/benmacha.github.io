<template>
  <div>
    <HeroSection />
    <div class="container home">
      <ExperiencePreview />
      <SkillsPreview />
      <ProjectsPreview />
      <BlogPreview />
      <EducationPreview />
      <ArcadeSection />
      <ContactSection />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Ben Macha Ali - Tech Lead & Full Stack Developer | Symfony, React, Vue.js',
})
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 72px;
  padding-block: 64px 24px;
}

.home :deep(.home-section) {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
