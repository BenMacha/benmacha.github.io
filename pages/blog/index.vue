<template>
  <div class="container page">
    <SectionTitle
      page
      :eyebrow="$t('blogUi.eyebrow')"
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

const visible = computed(() =>
  active.value === 'all' ? sortedArticles : sortedArticles.filter(a => a.category === active.value),
)

useHead({
  title: `${t('blog.title')} - Ben Macha Ali | PHP, Symfony, Docker, Linux, DevOps`,
  meta: [
    { name: 'description', content: 'Blog technique de Ben Macha Ali : articles sur PHP, Symfony, Docker, Linux et DevOps. Retours d\'expérience et bonnes pratiques.' },
  ],
})
</script>

<style scoped>
.filters {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 5px;
  margin-bottom: 32px;
  background: var(--card);
  border: 3px solid var(--line);
  box-shadow: 4px 4px 0 var(--shadow);
}

.filters__btn {
  font-size: 12px;
  font-weight: 600;
  padding: 8px 12px;
  cursor: pointer;
  border: 3px solid transparent;
  background: transparent;
  color: var(--nav-ink);
}

.filters__btn.is-active {
  background: var(--coin);
  border-color: var(--navy);
  color: var(--navy);
}

.filters__count {
  opacity: .6;
}

.posts {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.empty {
  color: var(--muted);
}
</style>
