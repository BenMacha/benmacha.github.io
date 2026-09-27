import { blogArticles } from './data/blog'

const SITE_URL = 'https://benmacha.tn'
const DEFAULT_LOCALE = 'fr'
const LOCALES = ['fr', 'en', 'ar'] as const

const pagePaths = ['/', '/experience', '/skills', '/projects', '/education', '/blog']
const articlePaths = blogArticles.map(article => `/blog/${article.slug}`)

/** '/blog' in 'en' → '/en/blog'; the default locale has no prefix. */
const localize = (path: string, locale: string) =>
  locale === DEFAULT_LOCALE ? path : `/${locale}${path === '/' ? '' : path}`

const toIsoDate = (date: string) => new Date(`${date} UTC`).toISOString().slice(0, 10)
const articleDates = Object.fromEntries(blogArticles.map(a => [`/blog/${a.slug}`, toIsoDate(a.date)]))

/** One sitemap entry per page and locale, each listing all its language versions. */
const sitemapUrls = [...pagePaths, ...articlePaths].flatMap(path => LOCALES.map(locale => ({
  loc: localize(path, locale),
  lastmod: articleDates[path],
  changefreq: path === '/' || path === '/blog' ? 'weekly' as const : 'monthly' as const,
  priority: (path === '/' ? 1.0 : path.startsWith('/blog/') ? 0.7 : 0.8) as 1 | 0.7 | 0.8,
  alternatives: [
    ...LOCALES.map(l => ({ hreflang: l, href: localize(path, l) })),
    { hreflang: 'x-default', href: localize(path, DEFAULT_LOCALE) },
  ],
})))

const llmsRoutes = ['/llms.txt', '/llms-full.txt', '/en/llms.txt', '/en/llms-full.txt', '/ar/llms.txt', '/ar/llms-full.txt']

// Cloudflare Web Analytics is injected by Cloudflare and must stay allowed
const CONTENT_SECURITY_POLICY = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data:`,
  `font-src 'self'`,
  `connect-src 'self' https://cloudflareinsights.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
].join('; ')

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

  // Title, description, canonical, hreflang and Open Graph are set per page (usePageSeo + layout)
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'author', content: 'Ben Macha Ali' },
        { name: 'keywords', content: 'Ben Macha Ali, créateur de Keytchens, Keytchens, fondateur de Pepprio, Pepprio, ORPI chef de projet SI, CCM Benchmark lead dev, groupe Le Figaro, Manymore, Matalto, UKN, Argolife, Pixel Trade, développeur PHP Symfony, React, Vue.js, Docker, DevOps, Linux, Paris, France, chef de projet SI, blog technique' },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { name: 'theme-color', content: '#0b0e1f' },
        { property: 'og:site_name', content: 'Ben Macha Ali' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        // Markdown profile for AI assistants (https://llmstxt.org)
        { rel: 'alternate', type: 'text/plain', href: '/llms.txt', hreflang: 'fr', title: 'Ben Macha Ali — profil pour les IA' },
        { rel: 'alternate', type: 'text/plain', href: '/en/llms.txt', hreflang: 'en', title: 'Ben Macha Ali — profile for AI assistants' },
        { rel: 'alternate', type: 'text/plain', href: '/ar/llms.txt', hreflang: 'ar', title: 'بن ماشا علي — ملف تعريفي لمساعدي الذكاء الاصطناعي' },
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
    defaultLocale: DEFAULT_LOCALE,
    langDir: 'locales',
    // French at the root, /en/... and /ar/...: every language has its own indexable URL
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
  },

  site: {
    url: SITE_URL,
    name: 'Ben Macha Ali',
  },

  sitemap: {
    excludeAppSources: true,
    autoI18n: false,
    urls: sitemapUrls,
  },

  routeRules: {
    // Common typo: /llm.txt → /llms.txt (the llmstxt.org standard name)
    ...Object.fromEntries(['', '/en', '/ar'].flatMap(prefix => [
      [`${prefix}/llm.txt`, { redirect: { to: `${prefix}/llms.txt`, statusCode: 301 } }],
      [`${prefix}/llm-full.txt`, { redirect: { to: `${prefix}/llms-full.txt`, statusCode: 301 } }],
    ])),
    '/**': {
      headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
        'Content-Security-Policy': CONTENT_SECURITY_POLICY,
      },
    },
  },

  nitro: {
    prerender: {
      routes: [
        ...[...pagePaths, ...articlePaths].flatMap(path => LOCALES.map(locale => localize(path, locale))),
        ...llmsRoutes,
      ],
      crawlLinks: true,
      // Emit /blog.html instead of /blog/index.html: Cloudflare Pages then serves /blog without a 308 to /blog/
      autoSubfolderIndex: false,
    },
  },
})
