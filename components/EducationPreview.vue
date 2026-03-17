<template>
  <section class="py-20">
    <div class="section-container">
      <SectionTitle :title="$t('education.title')" />

      <!-- TRAINING Header -->
      <div class="text-center mb-8">
        <div class="inline-block px-4 py-2 border-2 border-pixel-purple bg-pixel-purple/10">
          <span class="font-pixel text-xs text-pixel-pink animate-pixel-blink">
            &#9733; TRAINING LOG &#9733;
          </span>
        </div>
      </div>

      <div class="grid gap-4 max-w-3xl mx-auto">
        <div
          v-for="(item, index) in educationItems"
          :key="item.name"
          class="reveal pixel-card relative overflow-hidden"
          :class="`reveal-delay-${index + 1}`"
        >
          <!-- Training entry header -->
          <div class="flex items-center gap-3 mb-3 pb-2 border-b-2 border-dashed border-pixel-purple/30">
            <div class="p-2 bg-pixel-purple/20 border-2 border-pixel-purple/40">
              <GraduationCap class="w-4 h-4 text-pixel-pink" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-pixel text-[10px] text-pixel-pink leading-relaxed">{{ item.name }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="font-retro text-xs text-pixel-gray/70">{{ item.type }}</span>
                <span class="font-pixel text-[8px] text-pixel-gray/40">// {{ item.period }}</span>
              </div>
            </div>
            <span class="font-pixel text-[8px] text-pixel-green flex-shrink-0">LVL UP!</span>
          </div>

          <!-- Skill points earned -->
          <div class="mt-2">
            <span class="font-retro text-[10px] text-pixel-gray/60 mb-2 block">SKILL POINTS EARNED:</span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="skill in item.skills"
                :key="skill"
                class="pixel-tag font-retro text-xs"
              >
                +{{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- View all link -->
      <div class="text-center mt-10 reveal">
        <NuxtLink
          to="/education"
          class="btn-primary font-pixel text-xs inline-flex items-center gap-2 animate-pixel-bounce"
        >
          <GraduationCap class="w-4 h-4" />
          VIEW ALL TRAINING &gt;&gt;
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { GraduationCap } from 'lucide-vue-next'

const { tm, rt } = useI18n()
const { setupReveal } = useScrollReveal()

const educationItems = computed(() => {
  const raw = tm('education.items') as any[]
  return raw.map((item: any) => ({
    name: rt(item.name),
    type: rt(item.type),
    period: rt(item.period),
    skills: (item.skills || []).map((s: any) => rt(s)),
  }))
})

onMounted(() => {
  setupReveal()
})
</script>
