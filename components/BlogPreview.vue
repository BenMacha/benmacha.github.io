<template>
  <section class="section-container py-20">
    <SectionTitle
      :title="$t('blog.title')"
      :subtitle="$t('blog.subtitle')"
    />

    <!-- Latest 3 Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <NuxtLink
        v-for="article in latestArticles"
        :key="article.slug"
        :to="`/blog/${article.slug}`"
        class="glass-card glow-border rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 reveal"
      >
        <div class="p-5">
          <!-- Category Badge -->
          <span
            :class="[
              'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3',
              categoryColor(article.category)
            ]"
          >
            {{ article.category }}
          </span>

          <!-- Title -->
          <h3 class="font-heading text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
            {{ article.title }}
          </h3>

          <!-- Description -->
          <p class="text-gray-400 text-sm mb-4 line-clamp-2">
            {{ article.description }}
          </p>

          <!-- Meta -->
          <div class="flex items-center gap-3 text-gray-500 text-xs mb-3">
            <span class="flex items-center gap-1">
              <Calendar class="w-3 h-3" />
              {{ article.date }}
            </span>
            <span class="flex items-center gap-1">
              <Clock class="w-3 h-3" />
              {{ article.readTime }}
            </span>
          </div>

          <!-- Read More -->
          <span class="inline-flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-2 transition-all duration-300">
            {{ $t('blog.readMore') }}
            <ChevronRight class="w-4 h-4" />
          </span>
        </div>
      </NuxtLink>
    </div>

    <!-- View All Button -->
    <div class="text-center">
      <NuxtLink
        to="/blog"
        class="btn-secondary inline-flex items-center gap-2"
      >
        <BookOpen class="w-4 h-4" />
        {{ $t('blog.allArticles') }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, Clock, ChevronRight, BookOpen } from 'lucide-vue-next'
import { blogArticles } from '~/data/blog'

const { t: $t } = useI18n()

const latestArticles = computed(() => blogArticles.slice(0, 3))

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
