import { chapters, type Chapter } from '~/data/site'

/**
 * The chapter of the current page (the site reads as a technical book): its number,
 * page number and accent, from the route without its locale prefix.
 */
export function useChapter() {
  const route = useRoute()
  const { t } = useI18n()

  const path = computed(() => route.path.replace(/^\/(en|ar)(?=\/|$)/, '') || '/')
  const chapter = computed<Chapter | undefined>(() => {
    const first = path.value.split('/')[1] ?? ''
    return chapters.find(c => c.page === first)
  })

  /** "Chapitre 01 · Expérience", or nothing on the home page */
  const label = computed(() => (chapter.value ? `${t('book.chapter')} ${chapter.value.num} · ${t(`nav.${chapter.value.page}`)}` : ''))

  /** Page number of the page: chapter folio, + 1 for an article inside the blog chapter, 1 for the preface */
  const folio = computed(() => {
    if (!chapter.value) return 1
    return chapter.value.folio + (path.value.split('/').length > 2 ? 1 : 0)
  })

  return { chapter, label, folio, path }
}
