import type { Composer } from 'vue-i18n'
import { LOCALE_COOKIE } from '~/data/site'

/**
 * The URL decides the language (/, /en/..., /ar/...). A visitor who picked
 * another language before (cookie set by the language switcher) is sent to
 * that version once the page is hydrated. Crawlers have no cookie: they are
 * never redirected.
 */
export default defineNuxtPlugin((nuxtApp) => {
  onNuxtReady(async () => {
    const i18n = nuxtApp.$i18n as Composer
    const saved = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`))?.[1]
    if (!saved || saved === i18n.locale.value || !(i18n.availableLocales as string[]).includes(saved)) return

    const switchLocalePath = await nuxtApp.runWithContext(() => useSwitchLocalePath())
    const target = switchLocalePath(saved as Composer['locale']['value'])
    if (target) await navigateTo(target, { replace: true })
  })
})
