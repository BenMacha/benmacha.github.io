<template>
  <div>
    <HeroSection />
    <ExperiencePreview />
    <SkillsPreview />
    <ProjectsPreview />
    <EducationPreview />
    <BlogPreview />
    <ContactSection />
  </div>
</template>

<script setup lang="ts">
useScrollReveal()

useHead({
  title: 'Ben Macha Ali - Tech Lead & Full Stack Developer | ORPI, CCM Benchmark, Keytchens',
  meta: [
    { name: 'description', content: 'Portfolio de Ben Macha Ali - Tech Lead & Développeur Full Stack. Chef de projet SI chez ORPI, ex-Lead Dev PHP chez CCM Benchmark, ex-Tech Lead chez Keytchens. Symfony, React, Vue.js, Docker.' },
    { name: 'keywords', content: 'Ben Macha Ali, ORPI développeur, CCM Benchmark lead dev, Keytchens tech lead, développeur PHP Symfony, React, Vue.js, Docker, Paris, France, chef de projet SI' },
  ],
})
</script>
