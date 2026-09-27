<template>
  <div class="container container--narrow page">
    <SectionTitle page :eyebrow="$t('experienceUi.eyebrow')" :title="$t('experience.title')" />

    <ol class="levels">
      <li v-for="(job, i) in experiences" :key="job.company" class="level-row">
        <div class="pipe" aria-hidden="true">
          <div class="pipe__lip" />
          <div class="pipe__body" />
        </div>

        <article v-reveal="i" v-lift class="job card">
          <div class="job__bar">
            <span class="level">LVL 1-{{ experiences.length - i }}</span>
            <span>session://work</span>
            <span class="job__period">{{ job.period }}</span>
          </div>

          <div class="job__body">
            <div>
              <div class="job__title">
                <h2 class="job__company pixel">{{ job.company }}</h2>
                <StarRating v-if="job.rating" :value="job.rating" />
              </div>
              <p class="job__role">{{ job.role }}</p>
              <p v-if="job.location" class="job__location">⌖ {{ job.location }}</p>
            </div>

            <ul class="bullets">
              <li v-for="task in visibleTasks(job.tasks, i)" :key="task">{{ task }}</li>
            </ul>

            <button
              v-if="job.tasks.length > TASK_LIMIT"
              type="button"
              class="job__more pixel"
              :aria-expanded="!!expanded[i]"
              @click="expanded[i] = !expanded[i]"
            >
              {{ expanded[i] ? `▲ ${$t('experienceUi.less')}` : `▼ ${$t('experienceUi.more', { n: job.tasks.length - TASK_LIMIT })}` }}
            </button>

            <div v-if="job.stack.length" class="job__stack">
              <span class="job__stack-label">$ stack:</span>
              <span v-for="tech in job.stack" :key="tech" class="tag">{{ tech }}</span>
            </div>

            <a v-if="job.website" :href="job.website" target="_blank" rel="noopener" class="job__site">↗ {{ job.website }}</a>
          </div>
        </article>
      </li>

      <li class="level-row level-row--start">
        <div class="flag" aria-hidden="true"><span /></div>
        <div class="pixel start-label">{{ $t('experienceUi.start') }}</div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
const TASK_LIMIT = 6

const { t } = useI18n()
const { experiences } = useResume()
const expanded = reactive<Record<number, boolean>>({})

function visibleTasks(tasks: string[], index: number) {
  return expanded[index] ? tasks : tasks.slice(0, TASK_LIMIT)
}

useHead({
  title: `${t('experience.title')} - Ben Macha Ali | ORPI, CCM Benchmark, Keytchens, Matalto`,
  meta: [
    { name: 'description', content: 'Parcours de Ben Macha Ali : Chef de projet SI chez ORPI, Lead Dev PHP chez CCM Benchmark (groupe Le Figaro), créateur et Tech Lead du projet Keytchens, consultant Symfony chez Manymore / Matalto, développeur chez UKN, Argolife et Pixel Trade. Fondateur de Pepprio.' },
  ],
})
</script>

<style scoped>
.levels {
  margin: 0;
  padding: 0;
  list-style: none;
}

.level-row {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 18px;
}

/* Green warp pipe running down the timeline */
.pipe {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pipe__lip {
  width: 56px;
  height: 26px;
  background: var(--pipe);
  border: 3px solid #000;
  box-shadow: inset 6px 0 0 #7ee07e, inset -8px 0 0 #1f7a2a;
}

.pipe__body {
  flex: 1;
  width: 40px;
  min-height: 40px;
  background: var(--pipe);
  border-inline: 3px solid #000;
  box-shadow: inset 5px 0 0 #7ee07e, inset -7px 0 0 #1f7a2a;
}

.job {
  margin-bottom: 32px;
}

.job__bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 14px;
  border-bottom: 3px solid var(--line);
  background: var(--bar);
  font-size: 11px;
  color: var(--muted);
}

.job__period {
  margin-inline-start: auto;
}

.job__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
}

.job__title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  margin-bottom: 8px;
}

.job__company {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--accent);
}

.job__role {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.job__location {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--muted);
}

.job__more {
  align-self: flex-start;
  font-size: 9px;
  padding: 8px 10px;
  background: transparent;
  color: var(--accent);
  border: 2px dashed var(--accent);
  cursor: pointer;
}

.job__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 14px;
  border-top: 3px dotted var(--border);
}

.job__stack-label {
  padding: 4px 0;
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
}

.job__site {
  font-size: 12px;
  color: var(--accent);
  overflow-wrap: anywhere;
}

/* Flag at the start of the level map */
.level-row--start {
  align-items: center;
}

.flag {
  position: relative;
  justify-self: center;
  width: 6px;
  height: 60px;
  background: #fff;
  border: 2px solid #000;
}

.flag span {
  position: absolute;
  top: 0;
  left: 4px;
  width: 26px;
  height: 18px;
  background: var(--grass);
  border: 2px solid #000;
}

@media (max-width: 480px) {
  .level-row {
    grid-template-columns: 36px minmax(0, 1fr);
    gap: 12px;
  }

  .pipe__lip {
    width: 36px;
    height: 20px;
  }

  .pipe__body {
    width: 26px;
  }

  .job__body {
    padding: 16px;
  }
}

.start-label {
  font-size: 10px;
  color: var(--muted);
}
</style>
