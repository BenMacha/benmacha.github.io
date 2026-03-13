<template>
  <div class="section-container py-20">
    <!-- Back Link -->
    <NuxtLink
      to="/blog"
      class="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors duration-300 mb-8 group"
    >
      <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
      {{ $t('blog.backToBlog') }}
    </NuxtLink>

    <template v-if="article">
      <!-- Article Header -->
      <header class="mb-12">
        <!-- Category Badge -->
        <span
          :class="[
            'inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4',
            categoryColor(article.category)
          ]"
        >
          {{ article.category }}
        </span>

        <!-- Title -->
        <h1 class="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {{ article.title }}
        </h1>

        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6">
          <span class="flex items-center gap-1.5">
            <Calendar class="w-4 h-4" />
            {{ article.date }}
          </span>
          <span class="flex items-center gap-1.5">
            <Clock class="w-4 h-4" />
            {{ article.readTime }}
          </span>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in article.tags"
            :key="tag"
            class="flex items-center gap-1 text-xs bg-accent/10 text-accent px-3 py-1.5 rounded-md"
          >
            <Tag class="w-3 h-3" />
            {{ tag }}
          </span>
        </div>
      </header>

      <!-- Article Content -->
      <article
        class="article-content glass-card glow-border rounded-2xl p-6 md:p-10 mb-12 max-w-none"
        v-html="article.content"
      />

      <!-- Previous / Next Navigation -->
      <nav class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink
          v-if="prevArticle"
          :to="`/blog/${prevArticle.slug}`"
          class="glass-card glow-border rounded-xl p-5 group hover:scale-[1.02] transition-all duration-300"
        >
          <span class="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <ArrowLeft class="w-3 h-3" />
            {{ $t('blog.previousArticle') }}
          </span>
          <span class="font-heading font-semibold text-gray-900 dark:text-white group-hover:text-accent transition-colors duration-300">
            {{ prevArticle.title }}
          </span>
        </NuxtLink>
        <div v-else />

        <NuxtLink
          v-if="nextArticle"
          :to="`/blog/${nextArticle.slug}`"
          class="glass-card glow-border rounded-xl p-5 group hover:scale-[1.02] transition-all duration-300 text-right"
        >
          <span class="flex items-center justify-end gap-1 text-xs text-gray-500 mb-2">
            {{ $t('blog.nextArticle') }}
            <ArrowRight class="w-3 h-3" />
          </span>
          <span class="font-heading font-semibold text-gray-900 dark:text-white group-hover:text-accent transition-colors duration-300">
            {{ nextArticle.title }}
          </span>
        </NuxtLink>
      </nav>
    </template>

    <!-- Not Found -->
    <div v-else class="text-center py-20 text-gray-500">
      <BookOpen class="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>{{ $t('blog.articleNotFound') }}</p>
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
    Docker: 'bg-blue-500/20 text-blue-400',
    Linux: 'bg-yellow-500/20 text-yellow-400',
    PHP: 'bg-purple-500/20 text-purple-400',
    DevOps: 'bg-green-500/20 text-green-400'
  }
  return colors[category] || 'bg-accent/20 text-accent'
}
</script>
