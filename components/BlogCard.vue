<template>
  <NuxtLink v-lift :to="`/blog/${article.slug}`" class="post card">
    <div class="post__strip" :style="{ background: category.color }" />
    <div class="post__body">
      <div class="post__meta">
        <span class="post__badge" :style="{ background: category.color, color: badgeInk }">
          {{ $t(`blog.categories.${category.key}`) }}
        </span>
        <span>{{ article.date }}</span>
        <span>· {{ article.readTime }} {{ $t('blogUi.readTime') }}</span>
      </div>
      <h3 class="post__title" :lang="article.lang" :dir="articleDir(article)">{{ article.title }}</h3>
      <span class="post__more">{{ $t('blog.readMore') }} →</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { blogCategories, type BlogCategory } from '~/data/site'

const props = defineProps<{ article: LocalizedArticle }>()

const category = computed(() => blogCategories[props.article.category as BlogCategory] ?? blogCategories.DevOps)
const badgeInk = computed(() => (props.article.category === 'Linux' ? '#10132a' : '#fff'))
</script>

<style scoped>
.post {
  display: flex;
  flex-direction: column;
  color: var(--ink);
  box-shadow: 6px 6px 0 var(--shadow);
}

.post:hover {
  color: var(--ink);
}

.post__strip {
  height: 10px;
  border-bottom: 3px solid #000;
}

.post__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
}

.post__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--muted);
}

.post__badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border: 2px solid #000;
}

.post__title {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  font-weight: 700;
  text-wrap: pretty;
}

.post__more {
  margin-top: auto;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
}
</style>
