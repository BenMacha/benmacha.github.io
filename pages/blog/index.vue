<template>
  <div class="section-container py-20">
    <SectionTitle
      :title="$t('blog.title')"
      :subtitle="$t('blog.subtitle')"
    />

    <!-- Category Filters -->
    <div class="flex flex-wrap justify-center gap-3 mb-12">
      <button
        v-for="cat in categories"
        :key="cat.key"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
          selectedCategory === cat.key
            ? 'bg-accent text-white shadow-lg shadow-accent/25'
            : 'glass-card hover:bg-accent/10 text-gray-300 hover:text-accent'
        ]"
        @click="selectedCategory = cat.key"
      >
        {{ $t(cat.label) }}
      </button>
    </div>

    <!-- Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <NuxtLink
        v-for="article in filteredArticles"
        :key="article.slug"
        :to="`/blog/${article.slug}`"
        class="glass-card glow-border rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 reveal"
      >
        <div class="p-6">
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
          <h2 class="font-heading text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-accent transition-colors duration-300">
            {{ article.title }}
          </h2>

          <!-- Description -->
          <p class="text-gray-400 text-sm mb-4 line-clamp-3">
            {{ article.description }}
          </p>

          <!-- Meta -->
          <div class="flex items-center gap-4 text-gray-500 text-xs mb-4">
            <span class="flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5" />
              {{ article.date }}
            </span>
            <span class="flex items-center gap-1">
              <Clock class="w-3.5 h-3.5" />
              {{ article.readTime }}
            </span>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-1 rounded-md"
            >
              <Tag class="w-3 h-3" />
              {{ tag }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div v-if="filteredArticles.length === 0" class="text-center py-20 text-gray-500">
      <BookOpen class="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>{{ $t('blog.noArticles') }}</p>
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
      content: 'Ben Macha Ali blog technique - Articles sur Docker, Linux, PHP, DevOps et le d\u00e9veloppement web'
    },
    {
      name: 'keywords',
      content: 'Ben Macha Ali, blog technique, Docker, Linux, PHP, DevOps, d\u00e9veloppement web'
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
    Docker: 'bg-blue-500/20 text-blue-400',
    Linux: 'bg-yellow-500/20 text-yellow-400',
    PHP: 'bg-purple-500/20 text-purple-400',
    DevOps: 'bg-green-500/20 text-green-400'
  }
  return colors[category] || 'bg-accent/20 text-accent'
}
</script>
