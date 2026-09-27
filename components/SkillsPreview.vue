<template>
  <section class="home-section">
    <SectionTitle
      :eyebrow="$t('sections.skills')"
      :title="$t('skills.title')"
      to="/skills"
      :link-label="$t('sections.openInventory')"
    />
    <div class="hotbar inventory">
      <SkillSlot v-for="(skill, i) in hotbarSkills" :key="skill" v-reveal.pop="i" :name="skill" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { hotbarSkills } from '~/data/skills'
</script>

<style scoped>
.hotbar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: 6px;
  padding: 14px;
}
</style>
