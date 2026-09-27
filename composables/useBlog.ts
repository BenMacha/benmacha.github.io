import { blogArticles, type BlogArticle } from '~/data/blog'

/** Articles, newest first. */
export const sortedArticles: BlogArticle[] = [...blogArticles].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date),
)

export function findArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find(article => article.slug === slug)
}
