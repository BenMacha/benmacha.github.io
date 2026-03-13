export default defineNuxtConfig({
  compatibilityDate: '2024-12-01',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxtjs/sitemap',
    '@vueuse/nuxt',
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Ben Macha Ali - Tech Lead & Full Stack Developer',
      meta: [
        { name: 'description', content: 'Ben Macha Ali - Tech Lead & Développeur Full Stack. Chef de projet SI chez ORPI, ex-Lead Dev PHP chez CCM Benchmark, ex-Tech Lead chez Keytchens. Spécialisé en Symfony, React, Vue.js, Docker. Blog technique sur PHP, DevOps, Linux, Docker.' },
        { name: 'author', content: 'Ben Macha Ali' },
        { name: 'keywords', content: 'Ben Macha Ali, ORPI développeur, CCM Benchmark lead dev, Keytchens tech lead, Matalto, Manymore, développeur PHP Symfony, React, Vue.js, Docker, DevOps, Linux, Paris, France, chef de projet SI, blog technique' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Ben Macha Ali - Tech Lead & Full Stack Developer' },
        { property: 'og:description', content: 'Portfolio de Ben Macha Ali - Développeur Full Stack spécialisé en Symfony, React et Vue.js.' },
        { property: 'og:image', content: 'https://avatars.githubusercontent.com/u/5999976' },
        { property: 'og:url', content: 'https://benmacha.tn' },
        { property: 'og:site_name', content: 'Ben Macha Ali Portfolio' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Ben Macha Ali - Tech Lead & Full Stack Developer' },
        { name: 'twitter:description', content: 'Portfolio de Ben Macha Ali - Développeur Full Stack spécialisé en Symfony, React et Vue.js.' },
        { name: 'twitter:image', content: 'https://avatars.githubusercontent.com/u/5999976' },
      ],
      link: [
        { rel: 'canonical', href: 'https://benmacha.tn' },
        { rel: 'icon', type: 'image/jpeg', href: '/logo.jpeg' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
  },

  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700, 800, 900],
      'Space Grotesk': [400, 500, 600, 700],
    },
    display: 'swap',
  },

  i18n: {
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json', dir: 'ltr' },
      { code: 'en', name: 'English', file: 'en.json', dir: 'ltr' },
      { code: 'ar', name: 'العربية', file: 'ar.json', dir: 'rtl' },
    ],
    defaultLocale: 'fr',
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      fallbackLocale: 'fr',
    },
  },

  site: {
    url: 'https://benmacha.tn',
    name: 'Ben Macha Ali - Tech Lead & Full Stack Developer Portfolio',
  },

  sitemap: {
    urls: [
      { loc: '/', changefreq: 'weekly', priority: 1.0 },
      { loc: '/experience', changefreq: 'monthly', priority: 0.8 },
      { loc: '/skills', changefreq: 'monthly', priority: 0.8 },
      { loc: '/projects', changefreq: 'monthly', priority: 0.8 },
      { loc: '/education', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog', changefreq: 'weekly', priority: 0.9 },
      { loc: '/blog/docker-multi-stage-builds', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/docker-compose-production', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/docker-php-development', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/docker-ci-cd-pipeline', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/docker-security-best-practices', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/docker-networking-guide', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/linux-server-hardening', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/linux-performance-monitoring', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/linux-shell-scripting', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/linux-nginx-vs-apache', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/linux-systemd-services', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/php-8-features', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/symfony-api-platform', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/symfony-migration-guide', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/php-performance-optimization', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/symfony-messenger-async', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/php-design-patterns', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/symfony-docker-dev', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/graphql-php', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/ci-cd-github-actions', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/monitoring-sentry', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/jenkins-pipeline', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/redis-caching-strategies', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/database-migration-zero-downtime', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/zapier-api-automation', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog/my-journey-tech-lead', changefreq: 'monthly', priority: 0.8 },
    ],
  },

  nitro: {
    prerender: {
      routes: [
        '/', '/experience', '/skills', '/projects', '/education', '/blog',
        '/blog/docker-multi-stage-builds', '/blog/docker-compose-production',
        '/blog/docker-php-development', '/blog/docker-ci-cd-pipeline',
        '/blog/docker-security-best-practices', '/blog/docker-networking-guide',
        '/blog/linux-server-hardening', '/blog/linux-performance-monitoring',
        '/blog/linux-shell-scripting', '/blog/linux-nginx-vs-apache',
        '/blog/linux-systemd-services', '/blog/php-8-features',
        '/blog/symfony-api-platform', '/blog/symfony-migration-guide',
        '/blog/php-performance-optimization', '/blog/symfony-messenger-async',
        '/blog/php-design-patterns', '/blog/symfony-docker-dev',
        '/blog/graphql-php', '/blog/ci-cd-github-actions',
        '/blog/monitoring-sentry', '/blog/jenkins-pipeline',
        '/blog/redis-caching-strategies', '/blog/database-migration-zero-downtime',
        '/blog/zapier-api-automation',
        '/blog/my-journey-tech-lead',
      ],
      crawlLinks: true,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/experience': { prerender: true },
    '/skills': { prerender: true },
    '/projects': { prerender: true },
    '/education': { prerender: true },
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
  },
})
