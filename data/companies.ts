/**
 * Company logos shown in the commit nodes of the experience graph, keyed like the i18n
 * company names. Small copies (64 px) of each company's own site icon, under
 * public/images/companies/. Matalto and Argolife have no reachable site: their node shows
 * the initial instead.
 */
export const companyLogos: Record<string, { src: string }> = {
  'ORPI': { src: '/images/companies/orpi.png' },
  'PEPPRIO': { src: '/images/companies/pepprio.svg' },
  'CCM BENCHMARK · GROUPE LE FIGARO': { src: '/images/companies/ccm-benchmark.png' },
  'KEYTCHENS': { src: '/images/companies/keytchens.png' },
  'MOBELITE': { src: '/images/companies/mobelite.png' },
  'PIXELS TRADE': { src: '/images/companies/pixels-trade.png' },
}
