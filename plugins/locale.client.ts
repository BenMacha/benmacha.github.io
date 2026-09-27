import type { Composer } from 'vue-i18n'
import { LOCALE_COOKIE } from '~/data/site'

type Locale = Composer['locale']['value']

/**
 * Pages are prerendered in French. Switching to the visitor's language before
 * hydration makes the client render differ from the HTML (hydration mismatch),
 * so the saved or browser language is applied once the app is hydrated.
 */
export default defineNuxtPlugin((nuxtApp) => {
  // onNuxtReady runs once hydration (including async pages) is complete
  onNuxtReady(async () => {
    const i18n = nuxtApp.$i18n as Composer
    const isLocale = (code?: string): code is Locale => !!code && (i18n.availableLocales as string[]).includes(code)

    const saved = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`))?.[1]
    const browser = navigator.language?.slice(0, 2)
    const target = [saved, browser].find(isLocale)

    if (target && target !== i18n.locale.value) await i18n.setLocale(target)
  })
})
