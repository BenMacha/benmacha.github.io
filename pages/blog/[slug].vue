<template>
  <div class="section-container py-20">
    <!-- Back Link -->
    <NuxtLink
      to="/blog"
      class="inline-flex items-center gap-2 text-accent/60 hover:text-accent transition-colors duration-300 mb-8 group font-mono text-sm"
    >
      <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
      {{ $t('blog.backToBlog') }}
    </NuxtLink>

    <template v-if="article">
      <!-- Article Header -->
      <header class="mb-10">
        <!-- Category Badge -->
        <span
          :class="[
            'inline-block px-2 py-0.5 text-[10px] font-mono font-semibold mb-4 border',
            categoryColor(article.category)
          ]"
        >
          {{ article.category }}
        </span>

        <!-- Title -->
        <h1 class="font-mono text-2xl md:text-3xl lg:text-4xl font-bold text-accent mb-5">
          {{ article.title }}
        </h1>

        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-4 text-green-400/30 text-xs font-mono mb-5">
          <span class="flex items-center gap-1.5">
            <Calendar class="w-3.5 h-3.5" />
            {{ article.date }}
          </span>
          <span class="flex items-center gap-1.5">
            <Clock class="w-3.5 h-3.5" />
            {{ article.readTime }}
          </span>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in article.tags"
            :key="tag"
            class="flex items-center gap-1 text-[10px] font-mono bg-accent/5 text-accent/50 px-2 py-0.5 border border-accent/10"
          >
            <Tag class="w-2.5 h-2.5" />
            {{ tag }}
          </span>
        </div>
      </header>

      <!-- Article Content -->
      <article
        class="article-content glass-card glow-border p-5 md:p-8 mb-10 max-w-none"
        v-html="article.content"
      />

      <!-- Previous / Next Navigation -->
      <nav class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          v-if="prevArticle"
          :to="`/blog/${prevArticle.slug}`"
          class="glass-card glow-border p-4 group hover:border-accent/40 transition-all duration-300"
        >
          <span class="flex items-center gap-1 text-[10px] text-green-400/25 mb-2 font-mono">
            <ArrowLeft class="w-3 h-3" />
            {{ $t('blog.previousArticle') }}
          </span>
          <span class="font-mono text-sm font-semibold text-green-400/60 group-hover:text-accent transition-colors duration-300">
            {{ prevArticle.title }}
          </span>
        </NuxtLink>
        <div v-else />

        <NuxtLink
          v-if="nextArticle"
          :to="`/blog/${nextArticle.slug}`"
          class="glass-card glow-border p-4 group hover:border-accent/40 transition-all duration-300 text-right"
        >
          <span class="flex items-center justify-end gap-1 text-[10px] text-green-400/25 mb-2 font-mono">
            {{ $t('blog.nextArticle') }}
            <ArrowRight class="w-3 h-3" />
          </span>
          <span class="font-mono text-sm font-semibold text-green-400/60 group-hover:text-accent transition-colors duration-300">
            {{ nextArticle.title }}
          </span>
        </NuxtLink>
      </nav>
    </template>

    <!-- Not Found -->
    <div v-else class="text-center py-20 text-green-400/30">
      <BookOpen class="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p class="font-mono text-sm">{{ $t('blog.articleNotFound') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, Clock, Tag, ArrowLeft, ArrowRight, BookOpen } from 'lucide-vue-next'
import { blogArticles } from '~/data/blog'
import type { BlogArticle } from '~/data/blog'

const { t: $t } = useI18n()
const route = useRoute()

const slug = computed(() => route.params.slug as string)

const article = computed<BlogArticle | undefined>(() =>
  blogArticles.find(a => a.slug === slug.value)
)

const currentIndex = computed(() =>
  blogArticles.findIndex(a => a.slug === slug.value)
)

const prevArticle = computed<BlogArticle | undefined>(() =>
  currentIndex.value > 0 ? blogArticles[currentIndex.value - 1] : undefined
)

const nextArticle = computed<BlogArticle | undefined>(() =>
  currentIndex.value >= 0 && currentIndex.value < blogArticles.length - 1
    ? blogArticles[currentIndex.value + 1]
    : undefined
)

useHead(() => ({
  title: article.value ? `${article.value.title} - Ben Macha Ali` : 'Blog - Ben Macha Ali',
  meta: [
    {
      name: 'description',
      content: article.value?.description || ''
    },
    {
      name: 'keywords',
      content: article.value?.tags.join(', ') || ''
    }
  ],
  script: article.value
    ? [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.value.title,
            description: article.value.description,
            datePublished: article.value.date,
            author: {
              '@type': 'Person',
              name: 'Ben Macha Ali'
            },
            keywords: article.value.tags.join(', '),
            articleSection: article.value.category
          })
        }
      ]
    : []
}))

function categoryColor(category: string): string {
  const colors: Record<string, string> = {
    Docker: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Linux: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    PHP: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    DevOps: 'bg-accent/10 text-accent border-accent/20'
  }
  return colors[category] || 'bg-accent/10 text-accent border-accent/20'
}
</script>
