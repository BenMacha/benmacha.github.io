import { blogArticles, type ArticleLocale, type BlogArticle } from '~/data/blog'

/** An article resolved for a locale; `lang` is the language its title is actually in. */
export type LocalizedArticle = BlogArticle & { lang: ArticleLocale }

export interface ArticleBody {
  html: string
  lang: ArticleLocale
}

/** Articles, newest first. */
export const sortedArticles: BlogArticle[] = [...blogArticles].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date),
)

/** Uses the translated title/description for `locale` when there is one, the French original otherwise. */
export function localizeArticle(article: BlogArticle, locale: string): LocalizedArticle {
  const translation = locale === 'fr' ? undefined : article.translations?.[locale as Exclude<ArticleLocale, 'fr'>]
  return translation
    ? { ...article, ...translation, lang: locale as ArticleLocale }
    : { ...article, lang: 'fr' }
}

/** Text direction of a language. */
export function articleDir(item: { lang: ArticleLocale }): 'rtl' | 'ltr' {
  return item.lang === 'ar' ? 'rtl' : 'ltr'
}

/** All articles, newest first, in the current locale. */
export function useLocalizedArticles() {
  const { locale } = useI18n()
  return computed(() => sortedArticles.map(article => localizeArticle(article, locale.value)))
}

// One lazily loaded chunk per article body and locale
const bodies = import.meta.glob<string>('../data/articles/*/*.html', { query: '?raw', import: 'default' })

/** Loads an article body in `locale`, falling back to the French original. */
export async function loadArticleBody(slug: string, locale: string): Promise<ArticleBody | null> {
  const path = (lang: string) => `../data/articles/${slug}/${lang}.html`
  const lang = (locale !== 'fr' && bodies[path(locale)] ? locale : 'fr') as ArticleLocale
  const load = bodies[path(lang)]
  return load ? { html: await load(), lang } : null
}
