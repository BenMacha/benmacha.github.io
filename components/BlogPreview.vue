<template>
  <section class="py-20">
    <div class="section-container">
      <SectionTitle :title="$t('blog.sectionTitle')" />

      <!-- NEWS SCROLL Header -->
      <div class="text-center mb-8">
        <div class="inline-block px-4 py-2 border-2 border-pixel-orange bg-pixel-orange/10">
          <span class="font-pixel text-xs text-pixel-orange animate-pixel-blink">
            &#9733; NEWS SCROLL &#9733;
          </span>
        </div>
      </div>

      <!-- Latest 3 Articles -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-10">
        <NuxtLink
          v-for="(article, index) in latestArticles"
          :key="article.slug"
          :to="`/blog/${article.slug}`"
          class="reveal pixel-card group hover:border-pixel-yellow/50 transition-all duration-300 block overflow-hidden"
          :class="`reveal-delay-${index + 1}`"
        >
          <!-- Category badge -->
          <div class="mb-3">
            <span
              class="pixel-tag font-pixel text-[8px] border"
              :class="categoryColor(article.category)"
            >
              {{ article.category }}
            </span>
          </div>

          <!-- Title -->
          <h3 class="font-pixel text-[10px] text-pixel-cream dark:text-pixel-cream group-hover:text-pixel-yellow transition-colors leading-relaxed mb-2 line-clamp-2">
            {{ article.title }}
          </h3>

          <!-- Description -->
          <p class="font-retro text-sm text-pixel-gray/60 mb-4 line-clamp-2 leading-relaxed">
            {{ article.description }}
          </p>

          <!-- Meta info -->
          <div class="flex items-center gap-3 text-pixel-gray/40 font-retro text-xs mb-3 pt-2 border-t border-pixel-navy/30">
            <span class="inline-flex items-center gap-1">
              <Calendar class="w-3 h-3" />
              {{ article.date }}
            </span>
            <span class="inline-flex items-center gap-1">
              <Clock class="w-3 h-3" />
              {{ article.readTime }}
            </span>
          </div>

          <!-- Read more -->
          <span class="font-pixel text-[8px] text-pixel-green group-hover:text-pixel-yellow transition-colors">
            &gt; READ SCROLL...
          </span>
        </NuxtLink>
      </div>

      <!-- View all link -->
      <div class="text-center reveal">
        <NuxtLink
          to="/blog"
          class="btn-primary font-pixel text-xs inline-flex items-center gap-2 animate-pixel-bounce"
        >
          READ MORE SCROLLS &gt;&gt;
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Calendar, Clock } from 'lucide-vue-next'
import { blogArticles } from '~/data/blog'

const { setupReveal } = useScrollReveal()

const latestArticles = computed(() => blogArticles.slice(0, 3))

function categoryColor(category: string): string {
  const colors: Record<string, string> = {
    Docker: 'bg-pixel-blue/20 text-pixel-blue border-pixel-blue/40',
    Linux: 'bg-pixel-green/20 text-pixel-green border-pixel-green/40',
    PHP: 'bg-pixel-purple/20 text-pixel-pink border-pixel-purple/40',
    DevOps: 'bg-pixel-orange/20 text-pixel-orange border-pixel-orange/40',
  }
  return colors[category] || 'bg-pixel-gray/20 text-pixel-gray border-pixel-gray/40'
}

onMounted(() => {
  setupReveal()
})
</script>
