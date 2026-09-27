import type { MaybeRefOrGetter } from 'vue'

export const SITE_URL = 'https://benmacha.tn'
export const SITE_NAME = 'Ben Macha Ali'
export const PERSON_ID = `${SITE_URL}/#person`
export const OG_IMAGE = `${SITE_URL}/images/og-image.png`

const TITLE_MAX = 60
const OG_LOCALES: Record<string, string> = { fr: 'fr_FR', en: 'en_US', ar: 'ar_AR' }

export interface Crumb {
  name: string
  /** Locale-less path, e.g. '/blog'. */
  path: string
}

interface PageSeo {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  type?: 'website' | 'article' | 'profile'
  /** Breadcrumb after "Home", e.g. [{ name: 'Blog', path: '/blog' }] */
  breadcrumb?: MaybeRefOrGetter<Crumb[]>
  noindex?: boolean
}

/** Absolute URL of the current page (no trailing slash, like the prerendered files). */
export function useCanonicalUrl() {
  const route = useRoute()
  return computed(() => `${SITE_URL}${route.path === '/' ? '/' : route.path.replace(/\/$/, '')}`)
}

/**
 * Per-page SEO: <title> (suffix dropped when it would exceed 60 characters),
 * meta description, Open Graph / Twitter cards and an optional BreadcrumbList.
 * Canonical and hreflang links come from the layout (useLocaleHead).
 */
export function usePageSeo(options: PageSeo) {
  const { t, locale } = useI18n()
  const localePath = useLocalePath()
  const url = useCanonicalUrl()

  const fullTitle = computed(() => {
    const title = toValue(options.title)
    const withName = `${title} | ${SITE_NAME}`
    return title.includes(SITE_NAME) || withName.length > TITLE_MAX ? title : withName
  })
  const description = computed(() => toValue(options.description))

  useSeoMeta({
    title: fullTitle,
    description,
    ogTitle: fullTitle,
    ogDescription: description,
    ogUrl: url,
    ogType: options.type ?? 'website',
    ogImage: OG_IMAGE,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: SITE_NAME,
    ogLocale: () => OG_LOCALES[locale.value],
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: OG_IMAGE,
    robots: options.noindex ? 'noindex, nofollow' : undefined,
  })

  if (options.breadcrumb) {
    useHead(() => ({
      script: [{
        key: 'breadcrumb',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [{ name: t('breadcrumb.home'), path: '/' }, ...toValue(options.breadcrumb)!].map((crumb, i) => ({
            '@type': 'ListItem',
            'position': i + 1,
            'name': crumb.name,
            'item': `${SITE_URL}${localePath(crumb.path) === '/' ? '/' : localePath(crumb.path)}`,
          })),
        }),
      }],
    }))
  }

  return { url, fullTitle }
}
