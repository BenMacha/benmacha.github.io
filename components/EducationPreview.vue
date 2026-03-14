<template>
  <section class="py-20">
    <div class="section-container">
      <SectionTitle :title="$t('education.title')" />

      <div class="grid gap-4 max-w-3xl mx-auto">
        <div
          v-for="(item, index) in educationItems"
          :key="item.school"
          class="reveal glass-card glow-border p-5"
          :class="`reveal-delay-${index + 1}`"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 border border-accent/20 text-accent">
              <GraduationCap class="w-4 h-4" />
            </div>
            <div>
              <h3 class="font-mono font-bold text-sm text-accent">{{ item.school }}</h3>
              <p class="text-[10px] text-gray-400 dark:text-green-400/30 font-mono">{{ item.type }} // {{ item.period }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="skill in item.skills.slice(0, 4)"
              :key="skill"
              class="px-2 py-0.5 text-[10px] font-mono bg-accent/5 text-accent/60 border border-accent/10"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <div class="text-center mt-10 reveal">
        <NuxtLink to="/education" class="btn-secondary">
          <GraduationCap class="w-4 h-4" />
          {{ $t('nav.education') }}
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { GraduationCap, ArrowRight } from 'lucide-vue-next'

const { tm, rt } = useI18n()

const educationItems = computed(() => {
  const raw = tm('education.items') as any[]
  return raw.map((item: any) => ({
    school: rt(item.school),
    type: rt(item.type),
    period: rt(item.period),
    skills: (item.skills || []).map((s: any) => rt(s)),
  }))
})
</script>
