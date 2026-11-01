<template>
  <div class="street">
    <OpenSourcePlate
      :fig="$t('openSource.fig', { n: 3 })"
      :title="$t('openSource.orgs.title')"
      :hint="$t('openSource.orgs.hint')"
      :readout="readout"
      :caption="$t('openSource.orgs.caption')"
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

    <ul class="grid orgs" style="--min: 240px">
      <li
        v-for="(org, i) in organizations"
        :key="org.id"
        v-reveal="i"
        class="org card"
        :class="{ 'is-on': focus === org.id }"
        @pointerenter="focus = org.id"
        @pointerleave="focus = null"
      >
        <h3 class="org__name">{{ org.name }}</h3>
        <p class="org__desc">{{ $t(`openSource.orgs.${org.key}`) }}</p>
        <div class="org__links">
          <a
            v-for="link in org.links"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener"
            @focus="focus = org.id"
            @blur="focus = null"
          >{{ link.label }} ↗</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { organizations } from '~/data/opensource'
import { orgStreet } from '~/utils/anatomy/org-street.mjs'

const { t } = useI18n()

const figure = computed(() => orgStreet({ label: t('openSource.orgs.label') }))

const stage = ref<HTMLElement | null>(null)
const ids = organizations.map(o => o.id)
const { focus, onPointerOver, onPointerLeave } = useIsoStage(stage, () => ids)

const readout = computed(() => {
  const org = organizations.find(o => o.id === focus.value)
  return org ? `${org.name} · ${org.links[org.links.length - 1]?.label}` : organizations.map(o => o.name).join(' · ')
})
</script>

<style scoped>
.street {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.orgs {
  margin: 0;
  padding: 0;
  list-style: none;
}

.org {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  transition: translate .3s;
}

.org.is-on {
  translate: 0 -4px;
}

.org__name {
  margin: 0;
  font-size: 22px;
  color: var(--ink);
}

.org__desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.65;
  color: var(--muted);
}

.org__links {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--rule);
  font-size: 12px;
  font-weight: 600;
  direction: ltr;
  text-align: start;
}

.org__links a {
  color: var(--accent);
}
</style>
