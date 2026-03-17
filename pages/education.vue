<template>
  <div class="pt-24 pb-20">
    <div class="section-container">
      <SectionTitle :title="$t('education.title')" />

      <!-- Education -->
      <div class="max-w-3xl mx-auto space-y-14">

        <!-- Formal Education -->
        <div>
          <div class="grid gap-4">
            <div
              v-for="(item, index) in educationItems"
              :key="item.school"
              class="reveal glass-card glow-border p-5"
              :class="`reveal-delay-${index + 1}`"
            >
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 border border-accent/20 text-accent">
                  <GraduationCap class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="font-mono font-bold text-base text-accent">{{ item.school }}</h3>
                  <p class="text-[10px] text-gray-400 dark:text-green-400/30 font-mono">{{ item.type }} // {{ item.period }}</p>
                </div>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="skill in item.skills"
                  :key="skill"
                  class="px-2 py-0.5 text-[10px] font-mono bg-accent/5 text-accent/60 border border-accent/10"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Internships -->
        <div>
          <h3 class="reveal font-mono font-bold text-xl mb-5 flex items-center gap-3">
            <Briefcase class="w-5 h-5 text-accent" />
            <span class="text-accent/30">&gt; </span>
            <span class="text-accent">{{ $t('education.internships.title') }}</span>
          </h3>
          <div class="grid gap-4">
            <div
              v-for="(item, index) in internships"
              :key="item.company"
              class="reveal glass-card glow-border p-5"
              :class="`reveal-delay-${index + 1}`"
            >
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div>
                  <h4 class="font-mono font-bold text-sm text-accent">{{ item.company }}</h4>
                  <p class="text-xs text-accent/50 font-mono">{{ item.role }}</p>
                </div>
                <span class="text-[10px] text-gray-300 dark:text-green-400/25 font-mono">{{ item.period }}</span>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="skill in item.skills"
                  :key="skill"
                  class="px-2 py-0.5 text-[10px] font-mono bg-accent/5 text-gray-400 dark:text-green-400/50 border border-accent/10"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Interests -->
        <div>
          <h3 class="reveal font-mono font-bold text-xl mb-5 flex items-center gap-3">
            <Heart class="w-5 h-5 text-accent" />
            <span class="text-accent/30">&gt; </span>
            <span class="text-accent">{{ $t('education.interests.title') }}</span>
          </h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <!-- Sports -->
            <div class="reveal glass-card glow-border p-5 reveal-delay-1">
              <h4 class="font-mono font-semibold text-sm mb-3 text-gray-600 dark:text-green-400/70">
                {{ $t('education.interests.items.sports.title') }}
              </h4>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="item in sportsItems"
                  :key="item"
                  class="px-2 py-0.5 text-[10px] font-mono bg-accent/5 text-accent/60 border border-accent/10"
                >
                  {{ item }}
                </span>
              </div>
            </div>

            <!-- Associations -->
            <div class="reveal glass-card glow-border p-5 reveal-delay-2">
              <h4 class="font-mono font-semibold text-sm mb-3 text-gray-600 dark:text-green-400/70">
                {{ $t('education.interests.items.associations.title') }}
              </h4>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="item in associationItems"
                  :key="item"
                  class="px-2 py-0.5 text-[10px] font-mono bg-accent/5 text-accent/60 border border-accent/10"
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
