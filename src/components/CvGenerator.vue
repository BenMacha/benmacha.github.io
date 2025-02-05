<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { skillSections } from '../constants'

const { t, tm } = useI18n()
const cvRef = ref<HTMLElement | null>(null)
const isGenerating = ref(false)

const generatePDF = async () => {
  if (!cvRef.value) return
  
  isGenerating.value = true
  
  try {
    const canvas = await html2canvas(cvRef.value, {
      scale: 2,
      useCORS: true,
      logging: false
    })
    
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight)
    
    // Save the PDF
    pdf.save(`CV_Ben_Mecha_Ali_${t('home.title')}.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <div>
    <!-- PDF Generation Button -->
    <button
      @click="generatePDF"
      :disabled="isGenerating"
      class="mb-8 inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      <span v-if="isGenerating">{{ t('cv.generating') }}...</span>
      <span v-else>{{ t('home.download') }}</span>
    </button>

    <!-- CV Content -->
    <div ref="cvRef" class="bg-background p-8 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold mb-2">Ben Mecha Ali</h1>
        <p class="text-xl text-muted-foreground">{{ t('home.title') }}</p>
        <p class="mt-4">{{ t('home.description') }}</p>
      </div>

      <!-- Experience -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">{{ t('experience.title') }}</h2>
        <div class="space-y-6">
          <div v-for="exp in tm('experience.items')" :key="exp.company">
            <h3 class="text-xl font-semibold">{{ exp.company }}</h3>
            <p class="text-muted-foreground">{{ exp.period }} | {{ exp.role }}</p>
            <ul class="mt-2 list-disc list-inside">
              <li v-for="task in exp.tasks" :key="task">{{ task }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Skills -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">{{ t('skills.title') }}</h2>
        <div class="grid grid-cols-2 gap-6">
          <div v-for="section in skillSections" :key="section.title">
            <h3 class="text-xl font-semibold mb-2">{{ t(`skills.${section.title}`) }}</h3>
            <ul class="list-disc list-inside">
              <li v-for="skill in section.skills" :key="skill">{{ skill }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">{{ t('education.title') }}</h2>
        <div class="space-y-4">
          <div v-for="edu in tm('education.items')" :key="edu.school">
            <h3 class="text-xl font-semibold">{{ edu.school }} | {{ edu.type }}</h3>
            <p class="text-muted-foreground">{{ edu.period }}</p>
            <ul class="mt-2 list-disc list-inside">
              <li v-for="skill in edu.skills" :key="skill">{{ skill }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Contact -->
      <section>
        <h2 class="text-2xl font-bold mb-4">{{ t('home.contact') }}</h2>
        <div class="flex flex-col gap-2">
          <p>Email: contact@benmacha.tn</p>
          <p>GitHub: github.com/BenMacha</p>
          <p>LinkedIn: linkedin.com/in/ben-mecha-ali</p>
          <p>Website: benmacha.tn</p>
        </div>
      </section>
    </div> </div>
</template>