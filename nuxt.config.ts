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
      title: 'Ben Macha Ali - Full Stack Developer',
      meta: [
        { name: 'description', content: 'Portfolio de Ben Macha Ali - Développeur Full Stack spécialisé en Symfony, React et Vue.js. Leader technique avec une forte expérience en gestion d\'équipe et en architecture logicielle.' },
        { name: 'author', content: 'Ben Macha Ali' },
        { name: 'keywords', content: 'Ben Macha Ali, développeur, full stack, PHP, Symfony, React, Vue.js, TypeScript, Node.js, Paris, France, lead developer, portfolio' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Ben Macha Ali - Full Stack Developer' },
        { property: 'og:description', content: 'Portfolio de Ben Macha Ali - Développeur Full Stack spécialisé en Symfony, React et Vue.js.' },
        { property: 'og:image', content: 'https://avatars.githubusercontent.com/u/5999976' },
        { property: 'og:url', content: 'https://benmacha.tn' },
        { property: 'og:site_name', content: 'Ben Macha Ali Portfolio' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Ben Macha Ali - Full Stack Developer' },
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
    name: 'Ben Macha Ali - Full Stack Developer Portfolio',
  },

  sitemap: {
    urls: [
      { loc: '/', changefreq: 'weekly', priority: 1.0 },
      { loc: '/experience', changefreq: 'monthly', priority: 0.8 },
      { loc: '/skills', changefreq: 'monthly', priority: 0.8 },
      { loc: '/projects', changefreq: 'monthly', priority: 0.8 },
      { loc: '/education', changefreq: 'monthly', priority: 0.7 },
    ],
  },

  nitro: {
    prerender: {
      routes: ['/', '/experience', '/skills', '/projects', '/education'],
      crawlLinks: true,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/experience': { prerender: true },
    '/skills': { prerender: true },
    '/projects': { prerender: true },
    '/education': { prerender: true },
  },
})
