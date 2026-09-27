<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { socialLinks } from '~/data/site'

const SITE = 'https://benmacha.tn'
const PERSON_ID = `${SITE}/#person`

// schema.org profile shared by every page (search engines and AI assistants)
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': PERSON_ID,
          'name': 'Ben Macha Ali',
          'alternateName': ['Ali Ben Macha', 'BenMacha'],
          'url': SITE,
          'image': `${SITE}/images/avatar.jpeg`,
          'email': `mailto:${socialLinks.email}`,
          'jobTitle': 'Tech Lead & Développeur Full Stack',
          'description': 'Créateur du projet Keytchens, dont il a réalisé toute la plateforme technique de 2018 à 2024, et fondateur de Pepprio, plateforme SaaS de gestion des commandes pour restaurants. Chef de projet SI chez ORPI.',
          'worksFor': { '@type': 'Organization', 'name': 'ORPI', 'url': 'https://www.orpi.com' },
          'alumniOf': { '@type': 'CollegeOrUniversity', 'name': 'ISI' },
          'address': { '@type': 'PostalAddress', 'addressRegion': 'Île-de-France', 'addressCountry': 'FR' },
          'knowsAbout': ['PHP', 'Symfony', 'API Platform', 'React', 'Vue.js', 'GraphQL', 'Docker', 'DevOps', 'Linux', 'Keytchens', 'Pepprio', 'Uber Eats API', 'Deliveroo API', 'Model Context Protocol'],
          'sameAs': [socialLinks.linkedin, socialLinks.github],
        },
        {
          '@type': 'Organization',
          '@id': 'https://www.pepprio.com/#organization',
          'name': 'Pepprio',
          'url': 'https://www.pepprio.com',
          'description': 'Plateforme SaaS française de gestion des commandes pour restaurants : Uber Eats, Deliveroo, Just Eat et Glovo sur une seule interface, POS, KDS, borne, litiges, marques virtuelles et analytics en temps réel.',
          'founder': { '@id': PERSON_ID },
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE}/#website`,
          'url': SITE,
          'name': 'Ben Macha Ali',
          'inLanguage': ['fr', 'en', 'ar'],
          'author': { '@id': PERSON_ID },
        },
      ],
    }),
  }],
})
</script>
