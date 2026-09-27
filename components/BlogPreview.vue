<template>
  <section class="home-section">
    <SectionTitle
      :eyebrow="$t('sections.blog')"
      :title="$t('blog.title')"
      to="/blog"
      :link-label="$t('blog.allArticles')"
    />
    <div class="grid">
      <BlogCard v-for="(article, i) in latest" :key="article.slug" v-reveal="i" :article="article" />
    </div>
  </section>
</template>

<script setup lang="ts">
const latest = sortedArticles.slice(0, 3)
</script>
