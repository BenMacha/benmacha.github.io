<template>
  <div class="shelf">
    <OpenSourcePlate
      :fig="$t('openSource.fig', { n: 2 })"
      :title="$t('openSource.shelf.title')"
      :hint="$t('openSource.shelf.hint')"
      :readout="readout"
      :caption="$t('openSource.shelf.caption')"
    >
      <div
        ref="stage"
        class="iso iso-stage"
        :data-focus="focus || undefined"
        @pointerover="onPointerOver"
        @pointerleave="onPointerLeave"
        v-html="figure.svg"
      />
    </OpenSourcePlate>

    <ul class="grid packages" style="--min: 240px">
      <li
        v-for="(pkg, i) in packages"
        :key="pkg.name"
        v-reveal="i"
        class="package card"
        :class="{ 'is-on': focus === `pkg${i}` }"
        @pointerenter="focus = `pkg${i}`"
        @pointerleave="focus = null"
      >
        <div class="package__head">
          <span class="package__num mono" aria-hidden="true">{{ i + 1 }}</span>
          <h3 class="package__name">{{ pkg.name }}</h3>
        </div>
        <p class="package__desc">{{ description(pkg) }}</p>
        <p class="package__downloads">{{ format(pkg.downloads) }} <span>{{ $t('openSource.downloads') }}</span></p>
        <div class="package__links">
          <a :href="pkg.url" target="_blank" rel="noopener" @focus="focus = `pkg${i}`" @blur="focus = null">Packagist ↗</a>
          <a v-if="pkg.repository" :href="pkg.repository" target="_blank" rel="noopener">GitHub ↗</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { packages, type Package } from '~/data/opensource'
import { packageShelf } from '~/utils/anatomy/package-shelf.mjs'

const { t, te, locale } = useI18n()

const format = (n: number) => new Intl.NumberFormat(locale.value === 'ar' ? 'ar-u-nu-latn' : locale.value).format(n)
// "benmacha/diagram-bundle" → openSource.pkg.diagramBundle
const descriptionKey = (pkg: Package) => `openSource.pkg.${(pkg.name.split('/')[1] ?? pkg.name).replace(/-(\w)/g, (_, c: string) => c.toUpperCase())}`
const description = (pkg: Package) => (te(descriptionKey(pkg)) ? t(descriptionKey(pkg)) : pkg.description)

const figure = computed(() => packageShelf({
  packages: packages.map(p => ({ name: p.name, downloads: p.downloads })),
  label: t('openSource.shelf.label', {
    count: packages.length,
    list: packages.map(p => `${p.name} ${format(p.downloads)} ${t('openSource.downloads')}`).join(', '),
  }),
}))

const stage = ref<HTMLElement | null>(null)
const ids = packages.map((_, i) => `pkg${i}`)
const { focus, onPointerOver, onPointerLeave } = useIsoStage(stage, () => ids)

const total = packages.reduce((s, p) => s + p.downloads, 0)
const readout = computed(() => {
  const i = ids.indexOf(focus.value ?? '')
  const pkg = packages[i]
  if (pkg) return `${pkg.name} · ${format(pkg.downloads)} ${t('openSource.downloads')}`
  return `${packages.length} ${t('openSource.packages')} · ${format(total)} ${t('openSource.downloads')}`
})
</script>

<style scoped>
.shelf {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.packages {
  margin: 0;
  padding: 0;
  list-style: none;
}

.package {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  transition: translate .3s;
}

.package.is-on {
  translate: 0 -4px;
}

.package__head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.package__num {
  flex: none;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--rule);
  border-radius: 8px;
  font-size: 12px;
  color: var(--green-ink);
}

.package__name {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--ink);
  overflow-wrap: anywhere;
  direction: ltr;
}

.package__desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.65;
  color: var(--muted);
}

.package__downloads {
  margin: 0;
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 22px;
  color: var(--ink);
}

.package__downloads span {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
}

.package__links {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--rule);
  font-size: 12px;
  font-weight: 600;
}

.package__links a {
  color: var(--accent);
}
</style>
