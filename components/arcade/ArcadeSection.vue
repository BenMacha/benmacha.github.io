<template>
  <section class="home-section">
    <SectionTitle :eyebrow="$t('sections.arcade')" :title="$t('arcade.title')" />
    <div class="arcade">
      <ArcadeSnakeGame />
      <ArcadeTetrisGame />
      <ArcadeBreakoutGame />
      <ArcadePongGame />
      <ArcadeInvadersGame />
    </div>
  </section>
</template>

<style scoped>
.arcade {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 28px;
}
</style>
