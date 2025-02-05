<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { User2 } from 'lucide-vue-next'
import { ref } from 'vue'

const content = ref(null)

const contentMotion = useMotion(content, {
  initial: { y: 50, opacity: 0 },
  enter: { y: 0, opacity: 1 }
})
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div ref="content" class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <User2 class="h-8 w-8" />
        À propos
      </h1>
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 class="text-xl font-semibold mb-4 text-foreground">Informations personnelles</h2>
            <ul class="space-y-3 text-foreground">
              <li><span class="font-medium">Nom:</span> Ben Mecha Ali</li>
              <li><span class="font-medium">Date de naissance:</span> 26 décembre 1992</li>
              <li><span class="font-medium">État civil:</span> Marié</li>
              <li><span class="font-medium">Adresse:</span> Paris, France</li>
            </ul>
          </div>
          <div>
            <h2 class="text-xl font-semibold mb-4 text-foreground">Contact</h2>
            <ul class="space-y-3 text-foreground">
              <li><span class="font-medium">Téléphone:</span> +33 7 73 64 97 22</li>
              <li><span class="font-medium">Email:</span> contact@benmacha.tn</li>
            </ul>
          </div>
        </div>
        <div>
          <h2 class="text-xl font-semibold mb-4 text-foreground">Liens professionnels</h2>
          <div class="flex gap-4">
            <a href="#" class="text-primary hover:underline">Portfolio</a>
            <a href="#" class="text-primary hover:underline">LinkedIn</a>
            <a href="https://github.com/BenMacha" target="_blank" class="text-primary hover:underline">GitHub</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>