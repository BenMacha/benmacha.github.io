<template>
  <div class="container page" style="max-width: 960px">
    <SectionTitle page :eyebrow="$t('projectsUi.eyebrow')" :title="$t('projects.github.title')" :subtitle="$t('intro.projects')" />

    <div class="grid" style="--min: 300px; gap: 28px">
      <div v-for="(project, i) in projects" :key="project.url" class="project">
        <div class="project__block-wrap">
          <div class="coin" :class="{ 'is-out': hits[i] }" aria-hidden="true" />
          <button
            type="button"
            class="question pixel"
            :class="{ 'is-hit': hits[i] }"
            :aria-label="$t('projectsUi.hit')"
            @click="hit(i, $event)"
          >
            {{ hits[i] ? project.icon : '?' }}
          </button>
        </div>

        <article v-reveal="i" v-lift class="project__card card">
          <h2 class="project__name pixel">{{ project.name }}</h2>
          <p class="project__desc">{{ project.description }}</p>
          <ul v-if="project.tasks.length" class="bullets project__tasks">
            <li v-for="task in project.tasks" :key="task">{{ task }}</li>
          </ul>
          <a :href="project.url" target="_blank" rel="noopener" class="project__link">{{ $t('projectsUi.view') }} ↗</a>
        </article>
      </div>
    </div>

    <PageProse page="projects" />
  </div>
</template>

<script setup lang="ts">
import { animate } from 'motion'

const { t } = useI18n()
const { projects } = useResume()

const hits = reactive<Record<number, boolean>>({})

function hit(index: number, event: MouseEvent) {
  hits[index] = true
  if (prefersReducedMotion()) return
  const block = event.currentTarget as HTMLElement
  animate(block, { y: [0, -22, 0] }, { duration: 0.28, ease: 'easeOut' })
  const coin = block.previousElementSibling
  if (coin) animate(coin, { rotateY: [0, 720] }, { duration: 0.6 })
}

usePageSeo({
  title: () => t('seo.projects.title'),
  description: () => t('seo.projects.description'),
  breadcrumb: () => [{ name: t('nav.projects'), path: '/projects' }],
})
</script>

<style scoped>
.project {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.project__block-wrap {
  position: relative;
  height: 92px;
  margin-inline-start: 20px;
  display: flex;
  align-items: flex-end;
}

.question {
  position: relative;
  z-index: 2;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: var(--navy);
  background: var(--coin);
  border: 4px solid var(--navy);
  box-shadow: inset -5px -5px 0 var(--coin-dark), inset 5px 5px 0 var(--coin-light), 5px 5px 0 #000;
  cursor: pointer;
}

.question.is-hit {
  font-size: 28px;
  background: #c8762c;
  box-shadow: inset -5px -5px 0 #8a4d15, inset 5px 5px 0 #e6a060, 5px 5px 0 #000;
}

.coin {
  position: absolute;
  z-index: 1;
  left: 22px;
  bottom: 20px;
  width: 28px;
  height: 34px;
  border-radius: 50%;
  background: var(--coin);
  border: 3px solid var(--navy);
  box-shadow: inset -4px 0 0 var(--coin-dark);
  opacity: 0;
  transition: bottom .35s cubic-bezier(.2, 1.6, .4, 1), opacity .2s;
}

.coin.is-out {
  bottom: 82px;
  opacity: 1;
}

.project__card {
  align-self: stretch;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
  padding: 22px;
}

.project__name {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--accent);
}

.project__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  color: var(--muted);
}

.project__tasks {
  gap: 6px;
}

.project__tasks :deep(li) {
  font-size: 12px;
}

.project__link {
  margin-top: auto;
  padding-top: 14px;
  border-top: 3px dotted var(--border);
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
}
</style>
