<template>
  <div class="container container--narrow page">
    <div class="running-head mono" aria-hidden="true">
      <span>Ben Macha Ali — {{ $t('book.volume') }}</span>
      <span>{{ label }}</span>
    </div>
    <NuxtLink :to="localePath('/blog')" class="back">← {{ $t('blog.backToBlog') }}</NuxtLink>

    <template v-if="article">
      <header class="head">
        <span class="badge mono" :style="{ '--cat': category.color }">{{ $t(`blog.categories.${category.key}`) }}</span>
        <h1 class="title" :lang="article.lang" :dir="articleDir(article)">{{ article.title }}</h1>
        <div class="meta mono">
          <span>{{ $t('blog.publishedOn') }} {{ article.date }}</span>
          <span>· {{ article.readTime }} {{ $t('blogUi.readTime') }}</span>
        </div>
        <div class="tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </header>

      <!-- Article bodies are trusted, first-party HTML from data/articles/ -->
      <article v-if="body" class="content" :lang="body.lang" :dir="articleDir(body)" v-html="body.html" />

      <nav class="pager">
        <NuxtLink v-if="prev" :to="localePath(`/blog/${prev.slug}`)" class="pager__link card">
          <span class="pager__label mono">← {{ $t('blog.previousArticle') }}</span>
          <span class="pager__title" :lang="prev.lang" :dir="articleDir(prev)">{{ prev.title }}</span>
        </NuxtLink>
        <span v-else />
        <NuxtLink v-if="next" :to="localePath(`/blog/${next.slug}`)" class="pager__link pager__link--next card">
          <span class="pager__label mono">{{ $t('blog.nextArticle') }} →</span>
          <span class="pager__title" :lang="next.lang" :dir="articleDir(next)">{{ next.title }}</span>
        </NuxtLink>
      </nav>
    </template>

    <p v-else class="missing">{{ $t('blog.articleNotFound') }}</p>
  </div>
</template>

<script setup lang="ts">
import { blogCategories, type BlogCategory } from '~/data/site'

const route = useRoute()
const { label } = useChapter()
const localePath = useLocalePath()
const slug = computed(() => route.params.slug as string)

const articles = useLocalizedArticles()
const index = computed(() => articles.value.findIndex(a => a.slug === slug.value))
const article = computed(() => articles.value[index.value])
const prev = computed(() => (index.value > 0 ? articles.value[index.value - 1] : undefined))
const next = computed(() => (index.value >= 0 ? articles.value[index.value + 1] : undefined))
const category = computed(() => blogCategories[article.value?.category as BlogCategory] ?? blogCategories.DevOps)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: false })
}

// Body in the page's locale (each locale has its own prerendered URL)
const { t, locale } = useI18n()
const { data: body } = await useAsyncData(
  () => `article:${locale.value}:${slug.value}`,
  () => loadArticleBody(slug.value, locale.value),
)

const { url } = usePageSeo({
  title: () => article.value?.title ?? t('blog.title'),
  description: () => article.value?.description ?? '',
  type: 'article',
  breadcrumb: () => [
    { name: t('nav.blog'), path: '/blog' },
    { name: article.value?.title ?? '', path: `/blog/${slug.value}` },
  ],
})

const published = computed(() => (article.value ? new Date(`${article.value.date} UTC`).toISOString().slice(0, 10) : undefined))

useSeoMeta({
  articlePublishedTime: published,
  articleModifiedTime: published,
  articleAuthor: [SITE_URL],
  articleSection: () => article.value?.category,
  articleTag: () => article.value?.tags,
  keywords: () => article.value?.tags.join(', '),
})

useHead(() => ({
  script: article.value
    ? [{
        key: 'blog-posting',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': `${url.value}#article`,
          'mainEntityOfPage': url.value,
          'url': url.value,
          'headline': article.value.title,
          'description': article.value.description,
          'image': OG_IMAGE,
          'inLanguage': body.value?.lang ?? article.value.lang,
          'datePublished': published.value,
          'dateModified': published.value,
          'author': { '@id': PERSON_ID, '@type': 'Person', 'name': SITE_NAME, 'url': SITE_URL },
          'publisher': { '@id': PERSON_ID },
          'keywords': article.value.tags.join(', '),
          'articleSection': article.value.category,
        }),
      }]
    : [],
}))
</script>

<style scoped>
.running-head {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 18px 0;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--rule);
  font-size: 12px;
  color: var(--muted);
}

.back {
  display: inline-block;
  margin-bottom: 28px;
  font-size: 14px;
  font-weight: 700;
  color: var(--green-ink);
}

.head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 32px;
  margin-bottom: 36px;
  border-bottom: 1px solid var(--rule);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: .06em;
}

.badge::before {
  content: '';
  width: 18px;
  height: 3px;
  border-radius: 2px;
  background: var(--cat);
}

.title {
  margin: 0;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.1;
  letter-spacing: -1px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: var(--muted);
}

/* Article body: a readable measure, book-like rhythm */
.content {
  max-width: 760px;
  margin-bottom: 48px;
  font-size: 18px;
  line-height: 1.8;
  color: var(--ink-2);
}

.content :deep(h2),
.content :deep(h3) {
  font-family: var(--font-head);
  font-weight: 800;
  line-height: 1.25;
  color: var(--ink);
}

.content :deep(h2) {
  margin: 48px 0 16px;
  font-size: 28px;
}

.content :deep(h2:first-child) {
  margin-top: 0;
}

.content :deep(h3) {
  margin: 32px 0 12px;
  font-size: 21px;
}

.content :deep(p) {
  margin: 0 0 18px;
}

.content :deep(ul),
.content :deep(ol) {
  margin: 0 0 18px;
  padding-inline-start: 24px;
}

.content :deep(li) {
  margin-bottom: 6px;
}

.content :deep(li::marker) {
  color: var(--muted);
}

.content :deep(strong) {
  color: var(--ink);
}

.content :deep(a) {
  color: var(--green-ink);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.content :deep(code) {
  font-family: var(--font-mono);
  font-size: .85em;
  padding: 1px 6px;
  border-radius: 5px;
  background: var(--panel);
  border: 1px solid var(--rule);
  color: var(--ink);
}

.content :deep(pre) {
  margin: 0 0 24px;
  padding: 18px 20px;
  overflow-x: auto;
  border-radius: 12px;
  background: #0b0e14;
  color: #d6dde8;
  border: 1px solid var(--rule);
  font-size: 14px;
  line-height: 1.65;
  direction: ltr;
}

/* Long inline identifiers/URLs may break anywhere rather than widen the page */
.content :deep(:not(pre) > code) {
  overflow-wrap: anywhere;
}

.content :deep(pre code) {
  padding: 0;
  background: none;
  border: 0;
  color: inherit;
}

.content :deep(table) {
  display: block;
  overflow-x: auto;
  margin: 0 0 24px;
  border-collapse: collapse;
  font-size: 15px;
}

.content :deep(th),
.content :deep(td) {
  padding: 8px 12px;
  border-bottom: 1px solid var(--rule);
  text-align: start;
}

.content :deep(th) {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
  font-weight: 500;
}

.pager {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 16px;
}

.pager__link {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  color: var(--ink);
}

.pager__link:hover {
  color: var(--ink);
  border-color: var(--rule-strong);
}

.pager__link--next {
  text-align: end;
}

.pager__label {
  font-size: 12px;
  color: var(--muted);
}

.pager__title {
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 18px;
  line-height: 1.3;
}

.missing {
  color: var(--muted);
}
</style>
