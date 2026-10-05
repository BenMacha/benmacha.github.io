/** Best experiences, highlighted on the home page (in this order). */
export const featuredCompanies = ['ORPI', 'PEPPRIO', 'CCM BENCHMARK · GROUPE LE FIGARO']

/**
 * Git-like layout of the experience map, keyed by the company name used in the i18n files.
 * The green pipe is the trunk (salaried jobs); the yellow pipe is a branch (freelance or side
 * project running in parallel). The list goes from the newest job (top) to the oldest (bottom).
 *
 * - `node`: which pipe carries this job's pipe head.
 * - `branch`: what the yellow pipe does on this row:
 *   - `through`: runs along the whole row,
 *   - `open`: runs along the whole row and is still going on above (ongoing project),
 *   - `forkBelow`: comes down to the row's pipe head, then joins the trunk at the bottom of the row,
 *   - `mergeAtHead`: leaves the trunk at the row's pipe head and goes down,
 *   - `forkAtHead`: comes down from above and joins the trunk at the row's pipe head.
 */
export interface Rail {
  node: 'trunk' | 'branch'
  branch?: 'through' | 'open' | 'forkBelow' | 'mergeAtHead' | 'forkAtHead'
  /** i18n key of a short label written along the yellow pipe. */
  label?: string
}

export const rails: Record<string, Rail> = {
  'ORPI': { node: 'trunk', branch: 'open' },
  'PEPPRIO': { node: 'branch', branch: 'forkBelow' },
  'CCM BENCHMARK · GROUPE LE FIGARO': { node: 'trunk' },
  'KEYTCHENS': { node: 'trunk', branch: 'mergeAtHead' },
  'MATALTO': { node: 'trunk', branch: 'through', label: 'experienceUi.freelanceBranch' },
  'MOBELITE': { node: 'trunk', branch: 'through' },
  'PIXELS TRADE': { node: 'trunk', branch: 'forkAtHead' },
  'ARGOLIFE': { node: 'trunk' },
}

/** A "Tunisia → France" milestone is shown just above this company. */
export const countryChangeBefore = 'MOBELITE'
