<template>
  <figure class="fig">
    <div class="fig__panel">
      <svg role="img" :aria-label="$t('book.fig1.label')" viewBox="0 0 440 340" class="fig__svg">
        <g fill="none" stroke="var(--line)" stroke-width="1.4" stroke-linejoin="round">
          <!-- bench -->
          <path d="M40 230 L220 320 L400 230 L220 140 Z" fill="var(--slab)" />
          <path d="M40 230 L40 246 L220 336 L400 246 L400 230" />
          <path d="M220 320 L220 336" />
          <!-- 1 · SI & data: a server block with a green status lamp -->
          <g>
            <path d="M90 200 L150 230 L210 200 L150 170 Z" fill="var(--top)" />
            <path d="M90 200 L90 160 L150 130 L210 160 L210 200" fill="var(--side)" />
            <path d="M90 160 L150 190 L210 160" />
            <path d="M150 190 L150 230" />
            <path d="M102 176 L138 194 M102 186 L138 204" stroke="var(--muted)" />
            <path d="M150 130 L150 112 L170 102" stroke="var(--green)" />
            <circle class="fig__lamp" cx="172" cy="101" r="4" fill="var(--green)" stroke="none" />
          </g>
          <!-- 2 · AI: a tall unit with red racks -->
          <g>
            <path d="M230 200 L290 230 L350 200 L290 170 Z" fill="var(--top)" />
            <path d="M230 200 L230 140 L290 110 L350 140 L350 200" fill="var(--side)" />
            <path d="M230 140 L290 170 L350 140" />
            <path d="M290 170 L290 230" />
            <path d="M252 152 L268 160 M252 164 L268 172 M252 176 L268 184" stroke="var(--red)" />
            <path d="M306 160 L330 148 M306 172 L330 160" stroke="var(--red)" />
          </g>
          <!-- 3 · Product: a low module in front -->
          <g>
            <path d="M170 265 L220 290 L270 265 L220 240 Z" fill="var(--top)" />
            <path d="M170 265 L170 245 L220 220 L270 245 L270 265" fill="var(--side)" />
            <path d="M170 245 L220 270 L270 245" />
            <path d="M220 270 L220 290" />
          </g>
          <!-- flows -->
          <path class="fig__flow" d="M210 185 C 225 185, 225 170, 230 170" stroke="var(--green)" stroke-dasharray="4 4" />
          <path class="fig__flow" d="M150 230 C 150 250, 170 255, 180 255" stroke="var(--green)" stroke-dasharray="4 4" />
          <path class="fig__flow" d="M290 230 C 290 250, 270 255, 260 255" stroke="var(--red)" stroke-dasharray="4 4" />
        </g>
        <g font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" fill="var(--muted)">
          <path d="M120 150 L60 90" stroke="var(--muted)" stroke-width="1" />
          <text x="22" y="84">1 · {{ $t('book.fig1.data') }}</text>
          <path d="M320 128 L380 70" stroke="var(--muted)" stroke-width="1" />
          <text x="418" y="62" text-anchor="end">2 · {{ $t('book.fig1.ai') }}</text>
          <path d="M240 280 L330 300" stroke="var(--muted)" stroke-width="1" />
          <text x="334" y="304">3 · {{ $t('book.fig1.product') }}</text>
        </g>
      </svg>
    </div>
    <figcaption class="caption">{{ $t('book.fig1.caption') }}</figcaption>
  </figure>
</template>

<style scoped>
.fig {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fig__panel {
  padding: 20px;
  border: 1px solid var(--rule);
  border-radius: 16px;
  background: var(--panel);
}

.fig__svg {
  display: block;
  width: 100%;
  height: auto;
  direction: ltr;
}

/* The dashed flows circulate; the data lamp breathes */
@media (prefers-reduced-motion: no-preference) {
  .fig__flow {
    animation: flow 1.6s linear infinite;
  }

  .fig__lamp {
    animation: lamp 2.4s ease-in-out infinite;
  }

  .fig:hover .fig__flow {
    animation-duration: .8s;
  }
}

@keyframes flow {
  to { stroke-dashoffset: -16; }
}

@keyframes lamp {
  50% { opacity: .35; }
}
</style>
