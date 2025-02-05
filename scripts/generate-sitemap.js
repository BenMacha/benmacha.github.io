import { writeFileSync } from 'fs'
import { resolve } from 'path'

const BASE_URL = 'https://benmacha.tn'
const SUPPORTED_LOCALES = ['en', 'fr', 'ar']
const ROUTES = ['', 'experience', 'skills', 'projects', 'education']

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${ROUTES.map(route => `
  <url>
    <loc>${BASE_URL}${route ? `/${route}` : ''}</loc>
    ${SUPPORTED_LOCALES.map(locale => `
    <xhtml:link 
      rel="alternate" 
      hreflang="${locale}" 
      href="${BASE_URL}${locale === 'fr' ? '' : `/${locale}`}${route ? `/${route}` : ''}"
    />`).join('')}
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('')}
</urlset>`

  writeFileSync(resolve('public', 'sitemap.xml'), sitemap)
}

generateSitemap()