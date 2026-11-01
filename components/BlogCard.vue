<template>
  <NuxtLink :to="localePath(`/blog/${article.slug}`)" class="post card">
    <div class="post__body">
      <div class="post__meta mono">
        <span class="post__badge" :style="{ '--cat': category.color }">{{ $t(`blog.categories.${category.key}`) }}</span>
        <span>{{ article.date }}</span>
        <span>· {{ article.readTime }} {{ $t('blogUi.readTime') }}</span>
      </div>
      <h3 class="post__title" :lang="article.lang" :dir="articleDir(article)">{{ article.title }}</h3>
      <span class="post__more">{{ $t('blog.readMore') }} <span class="dir-arrow" aria-hidden="true">→</span></span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { blogCategories, type BlogCategory } from '~/data/site'

const props = defineProps<{ article: LocalizedArticle }>()
const localePath = useLocalePath()

const category = computed(() => blogCategories[props.article.category as BlogCategory] ?? blogCategories.DevOps)
</script>

<style scoped>
.post {
  display: flex;
  flex-direction: column;
  color: var(--ink);
  transition: border-color .2s;
}

.post:hover {
  color: var(--ink);
  border-color: var(--rule-strong);
}

.post:hover .post__title {
  color: var(--green-ink);
}

.post__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px;
}

.post__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--muted);
}

/* The category: a small coloured stroke and its name */
.post__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-2);
}

.post__badge::before {
  content: '';
  width: 14px;
  height: 3px;
  border-radius: 2px;
  background: var(--cat);
}

.post__title {
  margin: 0;
  font-size: 20px;
  line-height: 1.3;
  text-wrap: pretty;
  transition: color .2s;
}

.post__more {
  margin-top: auto;
  font-size: 14px;
  font-weight: 700;
  color: var(--green-ink);
}
</style>
