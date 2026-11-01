/**
 * Company logos shown in the commit nodes of the experience graph, keyed like the i18n
 * company names. Small copies (64 px) under public/images/companies/: each company's own site
 * icon, Matalto's LinkedIn logo, and Argolife's mark from its 2017 site (Web Archive).
 */
export const companyLogos: Record<string, { src: string }> = {
  'ORPI': { src: '/images/companies/orpi.png' },
  'PEPPRIO': { src: '/images/companies/pepprio.svg' },
  'CCM BENCHMARK · GROUPE LE FIGARO': { src: '/images/companies/ccm-benchmark.png' },
  'KEYTCHENS': { src: '/images/companies/keytchens.png' },
  'MOBELITE': { src: '/images/companies/mobelite.png' },
  'PIXELS TRADE': { src: '/images/companies/pixels-trade.png' },
  'MATALTO': { src: '/images/companies/matalto.png' },
  'ARGOLIFE': { src: '/images/companies/argolife.png' },
}
