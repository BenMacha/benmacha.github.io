<template>
  <div>
    <HeroSection />
    <ExperiencePreview />
    <SkillsPreview />
    <ProjectsPreview />
    <EducationPreview />
    <ContactSection />
  </div>
</template>

<script setup lang="ts">
useScrollReveal()

useHead({
  title: 'Ben Macha Ali - Full Stack Developer',
  meta: [
    { name: 'description', content: 'Portfolio de Ben Macha Ali - Développeur Full Stack spécialisé en Symfony, React et Vue.js. Leader technique basé à Paris, France.' },
  ],
})
</script>
