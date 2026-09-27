/**
 * Personal rating (out of 5) of each company, keyed by the company name used
 * in the i18n files. Companies without a rating show no stars.
 */
export const companyRatings: Record<string, number> = {
  'ORPI': 4.5,
  'CCM BENCHMARK': 4,
  'KEYTCHENS': 1,
  'MANYMORE / MATALTO': 3.5,
  'UKN': 3,
  'ARGOLIFE': 4,
  'PIXEL TRADE': 4.5,
}

/** Best experiences, highlighted on the home page (in this order). */
export const featuredCompanies = ['CCM BENCHMARK', 'ORPI', 'PIXEL TRADE']
