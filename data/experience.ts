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

/**
 * Git graph of the career (GitKraken-style), one row per job, newest first.
 * Lanes: `main` = salaried career (green), `freelance` = freelance missions (amber),
 * `pepprio` = my own company (red). Each row says what every lane does on that row:
 *  - `full`: passes through the whole row,
 *  - `fromNode`: starts at the row's commit and goes down (newest commit of the lane),
 *  - `toNode`: comes from above and ends at the row's commit (first commit of the lane),
 *  - `open`: passes through and is still running above (arrowhead at the top),
 *  - `forkFromNode`: leaves the main lane at the row's commit with an S curve and goes up,
 *  - `endBelow`: comes from below and stops at a closed end-cap under the row's commit
 *    (a branch that ended without being merged).
 */
export type Lane = 'main' | 'freelance' | 'pepprio'
export type LaneShape = 'full' | 'fromNode' | 'toNode' | 'open' | 'forkFromNode' | 'endBelow'

export interface GraphRef {
  kind: 'head' | 'branch' | 'tag'
  lane: Lane
  text: string
  /** End date of a branch closed without merge, shown on its badge */
  closed?: string
}

export interface GraphRow {
  /** Lane that carries this row's commit */
  node: Lane
  lanes: Partial<Record<Lane, LaneShape>>
  refs: GraphRef[]
  /** Refs of a second, closed commit drawn lower in the row (the end of a branch) */
  endRefs?: GraphRef[]
}

export const graph: Record<string, GraphRow> = {
  'ORPI': { node: 'main', lanes: { main: 'fromNode', pepprio: 'open' }, refs: [{ kind: 'head', lane: 'main', text: 'HEAD -> main' }] },
  'PEPPRIO': { node: 'pepprio', lanes: { main: 'full', pepprio: 'full' }, refs: [{ kind: 'head', lane: 'pepprio', text: 'HEAD -> pepprio' }] },
  // Pepprio forks from main at 11/2024, during the CCM Benchmark job
  'CCM BENCHMARK · GROUPE LE FIGARO': { node: 'main', lanes: { main: 'full', pepprio: 'forkFromNode' }, refs: [{ kind: 'branch', lane: 'main', text: 'main' }] },
  // Freelance until 08/2020, closed without merge; the CDI starts on main in 09/2020 (tag)
  'KEYTCHENS': {
    node: 'main',
    lanes: { main: 'full', freelance: 'endBelow' },
    refs: [{ kind: 'branch', lane: 'main', text: 'main' }, { kind: 'tag', lane: 'main', text: 'v-cdi 09/2020' }],
    endRefs: [{ kind: 'branch', lane: 'freelance', text: 'freelance/keytchens', closed: '08/2020' }],
  },
  'MATALTO': { node: 'main', lanes: { main: 'full', freelance: 'full' }, refs: [{ kind: 'branch', lane: 'main', text: 'main' }] },
  'MOBELITE': { node: 'main', lanes: { main: 'full', freelance: 'full' }, refs: [{ kind: 'branch', lane: 'main', text: 'main' }] },
  // The Keytchens freelance branch forks from main at 09/2018, during the Pixels Trade job
  'PIXELS TRADE': { node: 'main', lanes: { main: 'full', freelance: 'forkFromNode' }, refs: [{ kind: 'branch', lane: 'main', text: 'main' }] },
  'ARGOLIFE': { node: 'main', lanes: { main: 'toNode' }, refs: [{ kind: 'branch', lane: 'main', text: 'main' }] },
}

/** A short, stable commit-like hash for a row ("ORPI" → "4f1c9a2"). */
export function commitHash(text: string) {
  let h = 2166136261
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7)
}
