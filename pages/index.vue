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
const { t } = useI18n()

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
