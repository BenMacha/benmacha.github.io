import { blogArticles, type ArticleLocale, type BlogArticle } from '~/data/blog'

/** An article resolved for a locale; `lang` is the language its text is actually in. */
export type LocalizedArticle = BlogArticle & { lang: ArticleLocale }

/** Articles, newest first. */
export const sortedArticles: BlogArticle[] = [...blogArticles].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date),
)

/** Uses the translation for `locale` when there is one, the French original otherwise. */
export function localizeArticle(article: BlogArticle, locale: string): LocalizedArticle {
  const translation = locale === 'fr' ? undefined : article.translations?.[locale as Exclude<ArticleLocale, 'fr'>]
  return translation
    ? { ...article, ...translation, lang: locale as ArticleLocale }
    : { ...article, lang: 'fr' }
}

/** Text direction of an article's language. */
export function articleDir(article: LocalizedArticle): 'rtl' | 'ltr' {
  return article.lang === 'ar' ? 'rtl' : 'ltr'
}

/** All articles, newest first, in the current locale. */
export function useLocalizedArticles() {
  const { locale } = useI18n()
  return computed(() => sortedArticles.map(article => localizeArticle(article, locale.value)))
}
