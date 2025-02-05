import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

export const SUPPORTED_LOCALES = ['en', 'fr', 'ar']

// Get the saved locale from localStorage or default to 'fr'
const savedLocale = localStorage.getItem('locale')
const defaultLocale = savedLocale && SUPPORTED_LOCALES.includes(savedLocale) ? savedLocale : 'fr'

export default createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
    ar
  },
  globalInjection: true,
  sync: true,
  silentTranslationWarn: true,
  missingWarn: false,
  fallbackWarn: false
})