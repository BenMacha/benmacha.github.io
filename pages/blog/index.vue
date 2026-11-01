<template>
  <div class="container page">
    <SectionTitle
      page
      :title="$t('blog.title')"
      :subtitle="$t('blog.subtitle')"
    />

    <div class="filters" role="group" :aria-label="$t('blog.title')">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        class="filters__btn"
        :class="{ 'is-active': filter.value === active }"
        :aria-pressed="filter.value === active"
        @click="active = filter.value"
      >
        {{ filter.label }} <span class="filters__count">{{ filter.count }}</span>
      </button>
    </div>

    <div v-if="visible.length" class="grid posts">
      <BlogCard v-for="(article, i) in visible" :key="article.slug" v-reveal="i" :article="article" />
    </div>
    <p v-else class="empty">{{ $t('blog.noArticles') }}</p>
  </div>
</template>

<script setup lang="ts">
import { blogCategories, type BlogCategory } from '~/data/site'

const { t } = useI18n()
const active = ref<'all' | BlogCategory>('all')

const filters = computed(() => [
  { value: 'all' as const, label: t('blog.categories.all'), count: sortedArticles.length },
  ...(Object.keys(blogCategories) as BlogCategory[]).map(category => ({
    value: category,
    label: t(`blog.categories.${blogCategories[category].key}`),
    count: sortedArticles.filter(a => a.category === category).length,
  })),
])

const articles = useLocalizedArticles()
const visible = computed(() =>
  active.value === 'all' ? articles.value : articles.value.filter(a => a.category === active.value),
)

usePageSeo({
  title: () => t('seo.blog.title'),
  description: () => t('seo.blog.description'),
  breadcrumb: () => [{ name: t('nav.blog'), path: '/blog' }],
})
</script>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.filters__btn {
  min-height: 40px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--rule);
  background: transparent;
  color: var(--ink-2);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.filters__btn:hover {
  border-color: var(--ink-2);
}

.filters__btn.is-active {
  border-color: var(--ink);
  color: var(--ink);
}

.filters__count {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
}

.posts {
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
}

.empty {
  color: var(--muted);
}
</style>
