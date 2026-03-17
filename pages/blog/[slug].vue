<template>
  <div class="section-container py-20">
    <!-- Back Link -->
    <NuxtLink
      to="/blog"
      class="inline-flex items-center gap-2 font-retro text-base mb-8 group transition-colors"
      :class="isDark ? 'text-pixel-blue hover:text-pixel-cyan' : 'text-pixel-blue hover:text-accent-dark'"
    >
      <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      {{ $t('blog.backToBlog') }}
    </NuxtLink>

    <template v-if="article">
      <!-- Article Header -->
      <header class="mb-10">
        <!-- Category Badge -->
        <span
          :class="[
            'inline-block px-2 py-1 text-xs font-retro mb-4 border-2',
            categoryColor(article.category)
          ]"
          style="box-shadow: 2px 2px 0 0 rgba(0,0,0,0.2);"
        >
          {{ article.category }}
        </span>

        <!-- Title -->
        <h1
          class="font-pixel text-sm sm:text-base md:text-lg leading-relaxed mb-5"
          :class="isDark ? 'text-pixel-yellow' : 'text-pixel-navy'"
          style="text-shadow: 2px 2px 0 rgba(0,0,0,0.3);"
        >
          {{ article.title }}
        </h1>

        <!-- Meta -->
        <div
          class="flex flex-wrap items-center gap-4 text-sm font-retro mb-5"
          :class="isDark ? 'text-pixel-gray/60' : 'text-pixel-darkgray'"
        >
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
            class="pixel-tag text-xs font-retro"
          >
            {{ tag }}
          </span>
        </div>
      </header>

      <!-- Article Content -->
      <article
        class="article-content pixel-card p-5 md:p-8 mb-10 max-w-none"
        v-html="article.content"
      />

      <!-- Previous / Next Navigation -->
      <nav class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          v-if="prevArticle"
          :to="`/blog/${prevArticle.slug}`"
          class="pixel-card p-4 group"
        >
          <span
            class="flex items-center gap-1 text-xs font-retro mb-2"
            :class="isDark ? 'text-pixel-gray/50' : 'text-pixel-darkgray/60'"
          >
            <ArrowLeft class="w-3 h-3" />
            {{ $t('blog.previousArticle') }}
          </span>
          <span
            class="font-pixel text-[9px] sm:text-[10px] group-hover:text-pixel-blue transition-colors leading-relaxed"
            :class="isDark ? 'text-pixel-white' : 'text-pixel-navy'"
          >
            {{ prevArticle.title }}
          </span>
        </NuxtLink>
        <div v-else />

        <NuxtLink
          v-if="nextArticle"
          :to="`/blog/${nextArticle.slug}`"
          class="pixel-card p-4 group text-right"
        >
          <span
            class="flex items-center justify-end gap-1 text-xs font-retro mb-2"
            :class="isDark ? 'text-pixel-gray/50' : 'text-pixel-darkgray/60'"
          >
            {{ $t('blog.nextArticle') }}
            <ArrowRight class="w-3 h-3" />
          </span>
          <span
            class="font-pixel text-[9px] sm:text-[10px] group-hover:text-pixel-blue transition-colors leading-relaxed"
            :class="isDark ? 'text-pixel-white' : 'text-pixel-navy'"
          >
            {{ nextArticle.title }}
          </span>
        </NuxtLink>
      </nav>
    </template>

    <!-- Not Found -->
    <div
      v-else
      class="text-center py-20"
      :class="isDark ? 'text-pixel-gray/40' : 'text-pixel-darkgray/40'"
    >
      <BookOpen class="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p class="font-pixel text-xs">{{ $t('blog.articleNotFound') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen } from 'lucide-vue-next'
import { blogArticles } from '~/data/blog'
import type { BlogArticle } from '~/data/blog'

const { t: $t } = useI18n()
const route = useRoute()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

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
    { name: 'description', content: article.value?.description || '' },
    { name: 'keywords', content: article.value?.tags.join(', ') || '' },
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
              name: 'Ben Macha Ali',
            },
            keywords: article.value.tags.join(', '),
            articleSection: article.value.category,
          }),
        },
      ]
    : [],
}))

function categoryColor(category: string): string {
  const colors: Record<string, string> = {
    Docker: 'bg-pixel-blue/20 text-pixel-blue border-pixel-blue/40',
    Linux: 'bg-pixel-lime/20 text-pixel-lime border-pixel-lime/40',
    PHP: 'bg-pixel-purple/20 text-pixel-pink border-pixel-purple/40',
    DevOps: 'bg-pixel-orange/20 text-pixel-orange border-pixel-orange/40',
  }
  return colors[category] || 'bg-pixel-blue/20 text-pixel-blue border-pixel-blue/40'
}
</script>
