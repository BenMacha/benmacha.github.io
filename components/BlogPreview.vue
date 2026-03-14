<template>
  <section class="section-container py-20">
    <SectionTitle
      :title="$t('blog.title')"
      :subtitle="$t('blog.subtitle')"
    />

    <!-- Latest 3 Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <NuxtLink
        v-for="article in latestArticles"
        :key="article.slug"
        :to="`/blog/${article.slug}`"
        class="glass-card glow-border overflow-hidden group hover:border-accent/40 transition-all duration-300 reveal"
      >
        <div class="p-5">
          <!-- Category Badge -->
          <span
            :class="[
              'inline-block px-2 py-0.5 text-[10px] font-mono font-semibold mb-3 border',
              categoryColor(article.category)
            ]"
          >
            {{ article.category }}
          </span>

          <!-- Title -->
          <h3 class="font-mono text-sm font-bold text-green-400/80 mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
            {{ article.title }}
          </h3>

          <!-- Description -->
          <p class="text-green-400/35 text-xs mb-4 line-clamp-2 font-mono">
            {{ article.description }}
          </p>

          <!-- Meta -->
          <div class="flex items-center gap-3 text-green-400/25 text-[10px] font-mono mb-3">
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
          <span class="inline-flex items-center gap-1 text-accent/60 text-xs font-mono group-hover:text-accent group-hover:gap-2 transition-all duration-300">
            {{ $t('blog.readMore') }}
            <ChevronRight class="w-3 h-3" />
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
    Docker: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Linux: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    PHP: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    DevOps: 'bg-accent/10 text-accent border-accent/20'
  }
  return colors[category] || 'bg-accent/10 text-accent border-accent/20'
}
</script>
