<template>
  <section class="container recess" aria-labelledby="annex-b">
    <div class="recess__head">
      <span class="eyebrow eyebrow--red">{{ $t('book.annexB.eyebrow') }}</span>
      <h2 id="annex-b" class="recess__title">{{ $t('book.annexB.title') }}</h2>
      <p class="recess__text">{{ $t('book.annexB.text') }}</p>
    </div>
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
.recess {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-block: 32px 24px;
  border-top: 1px solid var(--rule);
}

.recess__head {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 680px;
}

.recess__title {
  margin: 0;
  font-size: clamp(28px, 4vw, 36px);
  line-height: 1.15;
}

.recess__text {
  margin: 0;
  color: var(--ink-2);
}

.arcade {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 20px;
}

@media (max-width: 480px) {
  .arcade {
    justify-content: center;
  }
}
</style>
