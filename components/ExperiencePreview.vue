<template>
  <section class="py-20">
    <div class="section-container">
      <SectionTitle :title="$t('experience.sectionTitle')" />

      <!-- QUEST LOG Header -->
      <div class="text-center mb-8">
        <div class="inline-block px-4 py-2 border-2 border-pixel-yellow bg-pixel-yellow/10">
          <span class="font-pixel text-xs text-pixel-yellow animate-pixel-blink">
            &#9733; QUEST LOG &#9733;
          </span>
        </div>
      </div>

      <div class="grid gap-6 max-w-3xl mx-auto">
        <div
          v-for="(job, index) in previewJobs"
          :key="job.company"
          class="reveal pixel-card relative overflow-hidden"
          :class="`reveal-delay-${index + 1}`"
        >
          <!-- Quest number header bar -->
          <div class="flex items-center gap-2 mb-4 pb-2 border-b-2 border-dashed border-pixel-yellow/40">
            <span class="font-pixel text-[10px] text-pixel-yellow">
              QUEST #{{ String(index + 1).padStart(2, '0') }}
            </span>
            <div class="flex-1" />
            <span class="font-pixel text-[8px] text-pixel-gray animate-pixel-blink">
              {{ index === 0 ? 'ACTIVE' : 'COMPLETE' }}
            </span>
            <span class="font-pixel text-[8px] text-pixel-gray/60">{{ job.period }}</span>
          </div>

          <!-- Quest giver (company) -->
          <div class="mb-2 flex items-center gap-2">
            <span class="font-retro text-xs text-pixel-gray">QUEST GIVER:</span>
            <span class="font-pixel text-sm text-pixel-blue">{{ job.company }}</span>
          </div>

          <!-- Quest title (role) -->
          <div class="mb-4">
            <span class="font-retro text-xs text-pixel-gray">MISSION:</span>
            <h3 class="font-pixel text-xs text-pixel-red mt-1 leading-relaxed">{{ job.role }}</h3>
          </div>

          <!-- Quest objectives -->
          <div class="space-y-2">
            <span class="font-retro text-xs text-pixel-yellow/80">OBJECTIVES:</span>
            <div
              v-for="(task, tIndex) in job.tasks.slice(0, 2)"
              :key="tIndex"
              class="flex items-start gap-2 font-retro text-sm text-pixel-cream dark:text-pixel-cream/80 light:text-pixel-navy"
            >
              <span class="text-pixel-red mt-0.5 flex-shrink-0">&#9632;</span>
              <span>{{ task }}</span>
            </div>
            <div
              v-if="job.tasks.length > 2"
              class="flex items-start gap-2 font-retro text-sm text-pixel-gray/50"
            >
              <span class="mt-0.5 flex-shrink-0">&#9633;</span>
              <span>+ {{ job.tasks.length - 2 }} more objectives...</span>
            </div>
          </div>

          <!-- XP reward decoration -->
          <div class="mt-4 flex justify-between items-center">
            <span class="font-pixel text-[8px] text-pixel-yellow/60">
              &#9733;&#9733;&#9733; REWARD: +{{ (index + 1) * 500 }} XP
            </span>
            <span class="pixel-tag font-pixel text-[8px] bg-pixel-red/20 text-pixel-red border border-pixel-red/40">
              STATUS: {{ index === 0 ? 'IN PROGRESS' : 'COMPLETE' }}
            </span>
          </div>
        </div>
      </div>

      <!-- View all link -->
      <div class="text-center mt-10 reveal">
        <NuxtLink
          to="/experience"
          class="btn-primary font-pixel text-xs inline-flex items-center gap-2 animate-pixel-bounce"
        >
          VIEW ALL QUESTS &gt;&gt;
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n()
const { setupReveal } = useScrollReveal()

const previewJobs = computed(() => {
  const raw = tm('experience.jobs') as any[]
  return raw.slice(0, 3).map((item: any) => ({
    company: rt(item.company),
    role: rt(item.role),
    period: rt(item.period),
    tasks: (item.tasks || []).map((t: any) => rt(t)),
  }))
})

onMounted(() => {
  setupReveal()
})
</script>
