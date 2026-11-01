export const socialLinks = {
  github: 'https://github.com/BenMacha',
  linkedin: 'https://www.linkedin.com/in/benmacha/',
  email: 'contact@benmacha.tn',
  website: 'https://benmacha.tn',
  cv: '/CV.pdf',
}

/** Cookie remembering the language chosen by the visitor. */
export const LOCALE_COOKIE = 'i18n_locale'

export const navPages = ['experience', 'skills', 'projects', 'open-source', 'blog', 'education'] as const

/** The site is a technical book, vol. 2026: one chapter per page, with its number and page. */
export const BOOK_VOLUME = '2026'

export interface Chapter {
  page: typeof navPages[number]
  /** Chapter number as printed in the table of contents */
  num: string
  /** Page number printed at the bottom of the chapter */
  folio: number
  /** Accent of the chapter number: red or green, alternating */
  accent: 'red' | 'green'
}

export const chapters: Chapter[] = [
  { page: 'experience', num: '01', folio: 12, accent: 'red' },
  { page: 'skills', num: '02', folio: 38, accent: 'green' },
  { page: 'projects', num: '03', folio: 52, accent: 'red' },
  { page: 'open-source', num: '04', folio: 67, accent: 'green' },
  { page: 'blog', num: '05', folio: 80, accent: 'red' },
  { page: 'education', num: '06', folio: 94, accent: 'green' },
]

export type BlogCategory = 'Docker' | 'Linux' | 'PHP' | 'DevOps'

/** Blog category → i18n key under `blog.categories` and its pixel color. */
export const blogCategories: Record<BlogCategory, { key: string, color: string }> = {
  Docker: { key: 'docker', color: '#2496ed' },
  Linux: { key: 'linux', color: '#fcc624' },
  PHP: { key: 'php', color: '#777bb4' },
  DevOps: { key: 'devops', color: '#e52521' },
}
