<template>
  <div class="section-container py-20">
    <SectionTitle
      :title="$t('blog.title')"
      :subtitle="$t('blog.subtitle')"
    />

    <!-- Category Filters -->
    <div class="flex flex-wrap justify-center gap-2 mb-12">
      <button
        v-for="cat in categories"
        :key="cat.key"
        :class="[
          'px-3 py-1.5 text-xs font-mono transition-all duration-300 border',
          selectedCategory === cat.key
            ? 'bg-accent/15 text-accent border-accent/40'
            : 'bg-transparent border-accent/10 text-green-400/40 hover:text-accent hover:border-accent/25'
        ]"
        @click="selectedCategory = cat.key"
      >
        <span class="text-accent/30">./</span>{{ $t(cat.label) }}
      </button>
    </div>

    <!-- Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NuxtLink
        v-for="article in filteredArticles"
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
          <h2 class="font-mono text-base font-bold text-green-400/80 mb-2 group-hover:text-accent transition-colors duration-300">
            {{ article.title }}
          </h2>

          <!-- Description -->
          <p class="text-green-400/35 text-xs mb-4 line-clamp-3 font-mono">
            {{ article.description }}
          </p>

          <!-- Meta -->
          <div class="flex items-center gap-4 text-green-400/25 text-[10px] font-mono mb-3">
            <span class="flex items-center gap-1">
              <Calendar class="w-3 h-3" />
              {{ article.date }}
            </span>
            <span class="flex items-center gap-1">
              <Clock class="w-3 h-3" />
              {{ article.readTime }}
            </span>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="flex items-center gap-1 text-[10px] font-mono bg-accent/5 text-accent/40 px-2 py-0.5 border border-accent/10"
            >
              <Tag class="w-2.5 h-2.5" />
              {{ tag }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div v-if="filteredArticles.length === 0" class="text-center py-20 text-green-400/30">
      <BookOpen class="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p class="font-mono text-sm">{{ $t('blog.noArticles') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Clock, Tag, BookOpen } from 'lucide-vue-next'
import { blogArticles } from '~/data/blog'

const { t: $t } = useI18n()

useHead({
  title: 'Blog - Ben Macha Ali blog technique',
  meta: [
    {
      name: 'description',
      content: 'Ben Macha Ali blog technique - Articles sur Docker, Linux, PHP, DevOps et le développement web'
    },
    {
      name: 'keywords',
      content: 'Ben Macha Ali, blog technique, Docker, Linux, PHP, DevOps, développement web'
    }
  ]
})

useScrollReveal()

const selectedCategory = ref('all')

const categories = [
  { key: 'all', label: 'blog.categories.all' },
  { key: 'Docker', label: 'blog.categories.docker' },
  { key: 'Linux', label: 'blog.categories.linux' },
  { key: 'PHP', label: 'blog.categories.php' },
  { key: 'DevOps', label: 'blog.categories.devops' }
]

const filteredArticles = computed(() => {
  if (selectedCategory.value === 'all') return blogArticles
  return blogArticles.filter(a => a.category === selectedCategory.value)
})

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
