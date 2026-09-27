<template>
  <div class="container container--narrow page">
    <NuxtLink to="/blog" class="back">◀ {{ $t('blog.backToBlog') }}</NuxtLink>

    <template v-if="article">
      <header class="head">
        <span class="badge" :style="{ background: category.color, color: article.category === 'Linux' ? '#10132a' : '#fff' }">
          {{ $t(`blog.categories.${category.key}`) }}
        </span>
        <h1 class="title pixel" :lang="article.lang" :dir="articleDir(article)">{{ article.title }}</h1>
        <div class="meta">
          <span>{{ $t('blog.publishedOn') }} {{ article.date }}</span>
          <span>· {{ article.readTime }} {{ $t('blogUi.readTime') }}</span>
        </div>
        <div class="tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </header>

      <!-- Article bodies are trusted, first-party HTML from data/articles/ -->
      <article v-if="body" class="content card" :lang="body.lang" :dir="articleDir(body)" v-html="body.html" />

      <nav class="pager">
        <NuxtLink v-if="prev" :to="`/blog/${prev.slug}`" v-lift class="pager__link card">
          <span class="pager__label pixel">◀ {{ $t('blog.previousArticle') }}</span>
          <span class="pager__title" :lang="prev.lang" :dir="articleDir(prev)">{{ prev.title }}</span>
        </NuxtLink>
        <span v-else />
        <NuxtLink v-if="next" :to="`/blog/${next.slug}`" v-lift class="pager__link pager__link--next card">
          <span class="pager__label pixel">{{ $t('blog.nextArticle') }} ▶</span>
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

// Body loaded on demand in the current locale (French in the prerendered HTML);
// the previous body stays visible while another language loads.
const { locale } = useI18n()
const { data: body } = await useAsyncData(
  () => `article:${slug.value}`,
  () => loadArticleBody(slug.value, locale.value),
  { watch: [locale] },
)

useHead(() => ({
  title: article.value ? `${article.value.title} - Ben Macha Ali` : 'Blog - Ben Macha Ali',
  meta: [
    { name: 'description', content: article.value?.description ?? '' },
    { name: 'keywords', content: article.value?.tags.join(', ') ?? '' },
  ],
  script: article.value
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': article.value.title,
          'description': article.value.description,
          'datePublished': new Date(article.value.date).toISOString().slice(0, 10),
          'author': { '@type': 'Person', 'name': 'Ben Macha Ali' },
          'keywords': article.value.tags.join(', '),
          'articleSection': article.value.category,
        }),
      }]
    : [],
}))
</script>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 32px;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
}

.head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
}

.badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border: 2px solid #000;
}

.title {
  margin: 0;
  font-size: clamp(18px, 3vw, 26px);
  line-height: 1.5;
  color: var(--h2);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--h2);
  opacity: .8;
}

.content {
  padding: clamp(20px, 4vw, 36px);
  margin-bottom: 40px;
  font-size: 15px;
  line-height: 1.8;
}

.content :deep(h2),
.content :deep(h3) {
  font-family: var(--font-pixel);
  line-height: 1.6;
  color: var(--accent);
}

.content :deep(h2) {
  margin: 0 0 20px;
  font-size: 15px;
}

.content :deep(h3) {
  margin: 32px 0 14px;
  font-size: 12px;
}

.content :deep(p) {
  margin: 0 0 16px;
}

.content :deep(ul),
.content :deep(ol) {
  margin: 0 0 16px;
  padding-inline-start: 22px;
}

.content :deep(li) {
  margin-bottom: 6px;
}

.content :deep(li::marker) {
  color: var(--coin);
}

.content :deep(strong) {
  color: var(--accent);
}

.content :deep(a) {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.content :deep(code) {
  font-family: var(--font-mono);
  font-size: .9em;
  padding: 1px 5px;
  background: var(--chip);
  border: 2px solid var(--line);
}

.content :deep(pre) {
  margin: 0 0 20px;
  padding: 16px;
  overflow-x: auto;
  background: var(--term);
  color: #b9f5c6;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 var(--shadow);
  font-size: 13px;
  line-height: 1.6;
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
}

.content :deep(table) {
  display: block;
  overflow-x: auto;
  margin: 0 0 20px;
  border-collapse: collapse;
}

.content :deep(th),
.content :deep(td) {
  padding: 8px 12px;
  border: 2px solid var(--line);
  text-align: start;
}

.content :deep(th) {
  background: var(--bar);
}

.pager {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 20px;
}

.pager__link {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  color: var(--ink);
}

.pager__link:hover {
  color: var(--ink);
}

.pager__link--next {
  text-align: end;
}

.pager__label {
  font-size: 9px;
  color: var(--muted);
}

.pager__title {
  font-size: 14px;
  font-weight: 700;
}

.missing {
  color: var(--muted);
}
</style>
