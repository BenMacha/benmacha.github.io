export const socialLinks = {
  github: 'https://github.com/BenMacha',
  linkedin: 'https://www.linkedin.com/in/benmacha/',
  email: 'contact@benmacha.tn',
  website: 'https://benmacha.tn',
  cv: '/CV.pdf',
}

/** Cookie remembering the language chosen by the visitor. */
export const LOCALE_COOKIE = 'i18n_locale'

export const navPages = ['experience', 'skills', 'projects', 'education', 'blog'] as const

export type BlogCategory = 'Docker' | 'Linux' | 'PHP' | 'DevOps'

/** Blog category → i18n key under `blog.categories` and its pixel color. */
export const blogCategories: Record<BlogCategory, { key: string, color: string }> = {
  Docker: { key: 'docker', color: '#2496ed' },
  Linux: { key: 'linux', color: '#fcc624' },
  PHP: { key: 'php', color: '#777bb4' },
  DevOps: { key: 'devops', color: '#e52521' },
}
