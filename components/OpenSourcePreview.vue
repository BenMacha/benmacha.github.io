<template>
  <section class="home-section">
    <SectionTitle
      :eyebrow="$t('sections.openSource')"
      :title="$t('openSource.previewTitle')"
      to="/open-source"
      :link-label="$t('openSource.seeAll')"
    />
    <div v-reveal>
      <OpenSourceMachine compact />
    </div>
  </section>
</template>
