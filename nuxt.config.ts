import { blogArticles } from './data/blog'

const SITE_URL = 'https://benmacha.tn'
const TITLE = 'Ben Macha Ali - Tech Lead & Full Stack Developer'
const DESCRIPTION = 'Ben Macha Ali - Tech Lead & Développeur Full Stack, créateur du projet Keytchens et fondateur de Pepprio. Chef de projet SI chez ORPI, ex-Lead Dev PHP chez CCM Benchmark (groupe Le Figaro). Symfony, React, Vue.js, Docker. Blog technique sur PHP, DevOps, Linux, Docker.'
const OG_IMAGE = `${SITE_URL}/images/avatar.jpeg`

const staticPages = ['/', '/experience', '/skills', '/projects', '/education', '/blog']
const blogPages = blogArticles.map(article => `/blog/${article.slug}`)

export default defineNuxtConfig({
  compatibilityDate: '2024-12-01',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxtjs/sitemap',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: TITLE,
      meta: [
        { name: 'description', content: DESCRIPTION },
        { name: 'author', content: 'Ben Macha Ali' },
        { name: 'keywords', content: 'Ben Macha Ali, créateur de Keytchens, Keytchens, fondateur de Pepprio, Pepprio, ORPI chef de projet SI, CCM Benchmark lead dev, Matalto, Manymore, développeur PHP Symfony, React, Vue.js, Docker, DevOps, Linux, Paris, France, chef de projet SI, blog technique' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#0b0e1f' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: TITLE },
        { property: 'og:description', content: 'Portfolio de Ben Macha Ali - Développeur Full Stack spécialisé en Symfony, React et Vue.js.' },
        { property: 'og:image', content: OG_IMAGE },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:site_name', content: 'Ben Macha Ali Portfolio' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: TITLE },
        { name: 'twitter:description', content: 'Portfolio de Ben Macha Ali - Développeur Full Stack spécialisé en Symfony, React et Vue.js.' },
        { name: 'twitter:image', content: OG_IMAGE },
      ],
      link: [
        { rel: 'canonical', href: SITE_URL },
        { rel: 'icon', type: 'image/jpeg', href: '/logo.jpeg' },
        // Markdown profile for AI assistants (https://llmstxt.org)
        { rel: 'alternate', type: 'text/plain', href: '/llms.txt', hreflang: 'fr', title: 'Ben Macha Ali — profil pour les IA' },
        { rel: 'alternate', type: 'text/plain', href: '/en/llms.txt', hreflang: 'en', title: 'Ben Macha Ali — profile for AI assistants' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
  },

  googleFonts: {
    families: {
      'Press Start 2P': [400],
      'Fira Code': [400, 500, 600, 700],
      'Noto Sans Arabic': [400, 600, 700],
    },
    display: 'swap',
  },

  i18n: {
    locales: [
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json', dir: 'ltr' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json', dir: 'ltr' },
      { code: 'ar', language: 'ar', name: 'العربية', file: 'ar.json', dir: 'rtl' },
    ],
    baseUrl: SITE_URL,
    bundle: { optimizeTranslationDirective: false },
    defaultLocale: 'fr',
    langDir: 'locales',
    strategy: 'no_prefix',
    // Applied after hydration by plugins/locale.client.ts (pages are prerendered in French)
    detectBrowserLanguage: false,
  },

  site: {
    url: SITE_URL,
    name: 'Ben Macha Ali - Tech Lead & Full Stack Developer Portfolio',
  },

  sitemap: {
    urls: [...staticPages, ...blogPages].map(loc => ({
      loc,
      changefreq: loc === '/' || loc === '/blog' ? 'weekly' : 'monthly',
      priority: loc === '/' ? 1.0 : loc.startsWith('/blog/') ? 0.7 : 0.8,
    })),
  },

  nitro: {
    prerender: {
      routes: [...staticPages, ...blogPages, '/llms.txt', '/llms-full.txt', '/en/llms.txt', '/en/llms-full.txt'],
      crawlLinks: true,
    },
  },
})
