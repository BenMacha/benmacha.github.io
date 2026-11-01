/** Best experiences, highlighted on the home page (in this order). */
export const featuredCompanies = ['ORPI', 'PEPPRIO', 'CCM BENCHMARK · GROUPE LE FIGARO']

/**
 * Contract of each job, keyed by the company name used in the i18n files (from LinkedIn).
 * On the experience timeline every job is a branch of the year axis, coloured by contract:
 * salaried (CDI, CDD, full time) in green, freelance in amber, my own company in red.
 */
export type Contract = 'permanent' | 'freelance' | 'own'

export interface JobContract {
  /** Company name as printed (the i18n key is upper case) */
  name: string
  contract: Contract
  /** i18n key under `book.kinds` printed after the company */
  kind: 'cdi' | 'cdd' | 'fulltime' | 'own' | 'freelanceThenCdi'
  /**
   * A freelance period that turned into a permanent contract with the same company:
   * the branch is amber up to the switch, then green, with a ◆ marker at the switch.
   */
  switchedFromFreelance?: { freelanceEnd: string, permanentStart: string }
}

export const contracts: Record<string, JobContract> = {
  'ORPI': { name: 'ORPI France', contract: 'permanent', kind: 'cdi' },
  'PEPPRIO': { name: 'Pepprio', contract: 'own', kind: 'own' },
  'CCM BENCHMARK · GROUPE LE FIGARO': { name: 'CCM Benchmark – Groupe Le Figaro', contract: 'permanent', kind: 'cdi' },
  // Freelance 09/2018 – 08/2020 (remote from Tunisia), then CDI 09/2020 – 08/2024
  'KEYTCHENS': { name: 'Keytchens', contract: 'permanent', kind: 'freelanceThenCdi', switchedFromFreelance: { freelanceEnd: '08/2020', permanentStart: '09/2020' } },
  'MATALTO': { name: 'Matalto', contract: 'permanent', kind: 'fulltime' },
  'MOBELITE': { name: 'Mobelite', contract: 'permanent', kind: 'cdd' },
  'PIXELS TRADE': { name: 'Pixels Trade', contract: 'permanent', kind: 'fulltime' },
  'ARGOLIFE': { name: 'Argolife', contract: 'permanent', kind: 'fulltime' },
}

export const contractOf = (company: string): JobContract => contracts[company] ?? { name: company, contract: 'permanent', kind: 'cdi' }

/** Start year of a period written "09/18 – 08/24" (2018), used as the year on the axis. */
export const startYear = (period: string) => {
  const yy = period.match(/\d{2}\/(\d{2})/)?.[1]
  return yy ? `20${yy}` : ''
}
