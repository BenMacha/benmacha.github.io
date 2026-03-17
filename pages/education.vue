<template>
  <div class="pt-24 pb-20">
    <div class="section-container">
      <SectionTitle :title="$t('education.title')" />

      <div class="max-w-3xl mx-auto space-y-14">

        <!-- Formal Education -->
        <div>
          <div class="grid gap-4">
            <div
              v-for="(item, index) in educationItems"
              :key="item.school"
              class="reveal pixel-card p-5"
              :class="`reveal-delay-${index + 1}`"
            >
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="p-2 border-2
                         border-pixel-orange/30 text-pixel-orange bg-pixel-orange/5
                         dark:border-pixel-yellow/40 dark:text-pixel-yellow dark:bg-pixel-yellow/10"
                  style="box-shadow: 2px 2px 0 0 rgba(0,0,0,0.3);"
                >
                  <GraduationCap class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="font-pixel text-[10px] sm:text-xs text-pixel-navy dark:text-pixel-yellow">
                    {{ item.school }}
                  </h3>
                  <p class="text-xs font-retro text-pixel-darkgray dark:text-pixel-gray/60">
                    {{ item.type }} // {{ item.period }}
                  </p>
                </div>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="skill in item.skills"
                  :key="skill"
                  class="pixel-tag text-xs font-retro"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Internships -->
        <div>
          <h3 class="reveal font-pixel text-[10px] sm:text-xs mb-5 flex items-center gap-3">
            <Briefcase class="w-5 h-5 text-pixel-blue" />
            <span class="text-pixel-navy dark:text-pixel-blue">
              {{ $t('education.internships.title') }}
            </span>
          </h3>
          <div class="grid gap-4">
            <div
              v-for="(item, index) in internships"
              :key="item.company"
              class="reveal pixel-card p-5"
              :class="`reveal-delay-${index + 1}`"
            >
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div>
                  <h4 class="font-pixel text-[10px] text-pixel-navy dark:text-pixel-yellow">
                    {{ item.company }}
                  </h4>
                  <p class="text-sm font-retro text-pixel-blue">
                    {{ item.role }}
                  </p>
                </div>
                <span class="pixel-tag text-xs font-retro">{{ item.period }}</span>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="skill in item.skills"
                  :key="skill"
                  class="pixel-tag text-xs font-retro"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Interests -->
        <div>
          <h3 class="reveal font-pixel text-[10px] sm:text-xs mb-5 flex items-center gap-3">
            <Heart class="w-5 h-5 text-pixel-red" />
            <span class="text-pixel-navy dark:text-pixel-pink">
              {{ $t('education.interests.title') }}
            </span>
          </h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <!-- Sports -->
            <div class="reveal pixel-card p-5 reveal-delay-1">
              <h4 class="font-pixel text-[10px] mb-3 text-pixel-navy dark:text-pixel-green">
                {{ $t('education.interests.items.sports.title') }}
              </h4>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="item in sportsItems"
                  :key="item"
                  class="pixel-tag text-xs font-retro"
                >
                  {{ item }}
                </span>
              </div>
            </div>

            <!-- Associations -->
            <div class="reveal pixel-card p-5 reveal-delay-2">
              <h4 class="font-pixel text-[10px] mb-3 text-pixel-navy dark:text-pixel-orange">
                {{ $t('education.interests.items.associations.title') }}
              </h4>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="item in associationItems"
                  :key="item"
                  class="pixel-tag text-xs font-retro"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GraduationCap, Briefcase, Heart } from 'lucide-vue-next'

const { t, tm, rt } = useI18n()

useScrollReveal()

const educationItems = computed(() => {
  const raw = tm('education.items')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => ({
    school: rt(item.school),
    type: rt(item.type),
    period: rt(item.period),
    skills: (item.skills || []).map((s: any) => rt(s)),
  }))
})

const internships = computed(() => {
  const raw = tm('education.internships.items')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => ({
    company: rt(item.company),
    period: rt(item.period),
    role: rt(item.role),
    skills: (item.skills || []).map((s: any) => rt(s)),
  }))
})

const sportsItems = computed(() => {
  const raw = tm('education.interests.items.sports.items')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => rt(item))
})

const associationItems = computed(() => {
  const raw = tm('education.interests.items.associations.items')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => rt(item))
})

useHead({
  title: `${t('education.title')} - Ben Macha Ali`,
  meta: [
    { name: 'description', content: 'Formation et éducation de Ben Macha Ali - ISI, stages en développement web et sécurité informatique.' },
  ],
})
</script>
