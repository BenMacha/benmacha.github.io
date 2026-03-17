<template>
  <div class="section-container py-20">
    <SectionTitle
      :title="$t('blog.title')"
      :subtitle="$t('blog.subtitle')"
    />

    <!-- Category Filter Buttons -->
    <div class="flex flex-wrap justify-center gap-2 mb-12">
      <button
        v-for="cat in categories"
        :key="cat.key"
        :class="[
          'px-4 py-2 text-xs font-retro border-2 transition-all cursor-pointer',
          selectedCategory === cat.key
            ? 'border-pixel-blue text-pixel-white bg-pixel-blue shadow-pixel-sm'
            : isDark
              ? 'border-pixel-navy text-pixel-gray hover:border-pixel-blue/50 hover:text-pixel-blue bg-pixel-navy/50'
              : 'border-pixel-navy/20 text-pixel-darkgray hover:border-pixel-blue/50 hover:text-pixel-blue bg-white'
        ]"
        style="box-shadow: 2px 2px 0 0 rgba(0,0,0,0.3);"
        @click="selectedCategory = cat.key"
      >
        {{ $t(cat.label) }}
      </button>
    </div>

    <!-- Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <NuxtLink
        v-for="article in filteredArticles"
        :key="article.slug"
        :to="`/blog/${article.slug}`"
        class="pixel-card overflow-hidden group reveal"
      >
        <div class="p-5">
          <!-- Category Badge -->
          <span
            :class="[
              'inline-block px-2 py-1 text-xs font-retro mb-3 border-2',
              categoryColor(article.category)
            ]"
            style="box-shadow: 2px 2px 0 0 rgba(0,0,0,0.2);"
          >
            {{ article.category }}
          </span>

          <!-- Title -->
          <h2
            class="font-pixel text-[10px] sm:text-xs mb-2 group-hover:text-pixel-blue transition-colors leading-relaxed"
            :class="isDark ? 'text-pixel-white' : 'text-pixel-navy'"
          >
            {{ article.title }}
          </h2>

          <!-- Description -->
          <p
            class="font-retro text-base mb-4 line-clamp-3"
            :class="isDark ? 'text-pixel-gray/70' : 'text-pixel-darkgray'"
          >
            {{ article.description }}
          </p>

          <!-- Meta -->
          <div
            class="flex items-center gap-4 text-xs font-retro mb-3"
            :class="isDark ? 'text-pixel-gray/50' : 'text-pixel-darkgray/60'"
          >
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
              class="pixel-tag text-xs font-retro"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredArticles.length === 0"
      class="text-center py-20"
      :class="isDark ? 'text-pixel-gray/40' : 'text-pixel-darkgray/40'"
    >
      <BookOpen class="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p class="font-pixel text-xs">{{ $t('blog.noArticles') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Clock, BookOpen } from 'lucide-vue-next'
import { blogArticles } from '~/data/blog'

const { t: $t } = useI18n()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

useHead({
  title: 'Blog - Ben Macha Ali blog technique',
  meta: [
    { name: 'description', content: 'Ben Macha Ali blog technique - Articles sur Docker, Linux, PHP, DevOps et le développement web' },
    { name: 'keywords', content: 'Ben Macha Ali, blog technique, Docker, Linux, PHP, DevOps, développement web' },
  ],
})

useScrollReveal()

const selectedCategory = ref('all')

const categories = [
  { key: 'all', label: 'blog.categories.all' },
  { key: 'Docker', label: 'blog.categories.docker' },
  { key: 'Linux', label: 'blog.categories.linux' },
  { key: 'PHP', label: 'blog.categories.php' },
  { key: 'DevOps', label: 'blog.categories.devops' },
]

const filteredArticles = computed(() => {
  if (selectedCategory.value === 'all') return blogArticles
  return blogArticles.filter(a => a.category === selectedCategory.value)
})

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
