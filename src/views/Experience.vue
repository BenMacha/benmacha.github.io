<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { Briefcase, MapPin } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const content = ref(null)
const { t, tm } = useI18n()

const contentMotion = useMotion(content, {
  initial: { y: 50, opacity: 0 },
  enter: { y: 0, opacity: 1 }
})

const experiences = tm('experience.items')
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div ref="content" class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <Briefcase class="h-8 w-8" />
        {{ t('experience.title') }}
      </h1>
      <div class="space-y-8">
        <div v-for="exp in experiences" :key="exp.company" class="border-l-2 border-primary pl-4">
          <h3 class="text-xl font-semibold text-foreground">{{ exp.company }}</h3>
          <p class="text-muted-foreground">{{ exp.period }} | {{ exp.role }}</p>
          <p v-if="exp.location" class="text-muted-foreground flex items-center gap-2 mt-1">
            <MapPin class="h-4 w-4" />
            {{ exp.location }}
          </p>
          <ul class="mt-4 list-disc list-inside space-y-2 text-foreground">
            <li v-for="task in exp.tasks" :key="task">{{ task }}</li>
          </ul>
          <p v-if="exp.stack" class="mt-2 text-sm text-muted-foreground">
            Stack technique : {{ exp.stack }}
          </p>
          <a v-if="exp.website" :href="exp.website" target="_blank" class="text-primary hover:underline">
            {{ exp.website.replace('https://', '') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>