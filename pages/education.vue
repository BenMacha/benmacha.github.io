<template>
  <div class="pt-24 pb-20">
    <div class="section-container">
      <SectionTitle :title="$t('education.title')" />

      <!-- Education -->
      <div class="max-w-3xl mx-auto space-y-16">

        <!-- Formal Education -->
        <div>
          <div class="grid gap-6">
            <div
              v-for="(item, index) in educationItems"
              :key="item.school"
              class="reveal glass-card glow-border p-6 rounded-2xl"
              :class="`reveal-delay-${index + 1}`"
            >
              <div class="flex items-center gap-4 mb-4">
                <div class="p-3 rounded-xl bg-accent/10 text-accent">
                  <GraduationCap class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-heading font-bold text-xl">{{ item.school }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.type }} &bull; {{ item.period }}</p>
                </div>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in item.skills"
                  :key="skill"
                  class="px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Internships -->
        <div>
          <h3 class="reveal font-heading font-bold text-2xl mb-6 flex items-center gap-3">
            <Briefcase class="w-6 h-6 text-accent" />
            {{ $t('education.internships.title') }}
          </h3>
          <div class="grid gap-6">
            <div
              v-for="(item, index) in internships"
              :key="item.company"
              class="reveal glass-card glow-border p-6 rounded-2xl"
              :class="`reveal-delay-${index + 1}`"
            >
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div>
                  <h4 class="font-heading font-bold text-lg">{{ item.company }}</h4>
                  <p class="text-sm text-accent">{{ item.role }}</p>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ item.period }}</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in item.skills"
                  :key="skill"
                  class="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Interests -->
        <div>
          <h3 class="reveal font-heading font-bold text-2xl mb-6 flex items-center gap-3">
            <Heart class="w-6 h-6 text-accent" />
            {{ $t('education.interests.title') }}
          </h3>
          <div class="grid sm:grid-cols-2 gap-6">
            <!-- Sports -->
            <div class="reveal glass-card glow-border p-6 rounded-2xl reveal-delay-1">
              <h4 class="font-heading font-semibold mb-4">
                {{ $t('education.interests.items.sports.title') }}
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="item in sportsItems"
                  :key="item"
                  class="px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent"
                >
                  {{ item }}
                </span>
              </div>
            </div>

            <!-- Associations -->
            <div class="reveal glass-card glow-border p-6 rounded-2xl reveal-delay-2">
              <h4 class="font-heading font-semibold mb-4">
                {{ $t('education.interests.items.associations.title') }}
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="item in associationItems"
                  :key="item"
                  class="px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent"
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
  const raw = tm('education.items') as any[]
  return raw.map((item: any) => ({
    school: rt(item.school),
    type: rt(item.type),
    period: rt(item.period),
    skills: (item.skills || []).map((s: any) => rt(s)),
  }))
})

const internships = computed(() => {
  const raw = tm('education.internships.items') as any[]
  return raw.map((item: any) => ({
    company: rt(item.company),
    period: rt(item.period),
    role: rt(item.role),
    skills: (item.skills || []).map((s: any) => rt(s)),
  }))
})

const sportsItems = computed(() => {
  const raw = tm('education.interests.items.sports.items') as any[]
  return raw.map((item: any) => rt(item))
})

const associationItems = computed(() => {
  const raw = tm('education.interests.items.associations.items') as any[]
  return raw.map((item: any) => rt(item))
})

useHead({
  title: `${t('education.title')} - Ben Macha Ali`,
  meta: [
    { name: 'description', content: 'Formation et éducation de Ben Macha Ali - ISI, stages en développement web et sécurité informatique.' },
  ],
})
</script>
