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
 *   - `forkAtHead`: comes down from above and joins the trunk at the row's pipe head,
 *   - `endBelowHead`: comes up from below and is capped just under the row's pipe head: a freelance
 *     mission closed at its end date, before the next contract starts (no merge into the trunk),
 *   - `levelUp`: comes up from below and joins the trunk through a pipe coupler just under the row's
 *     pipe head: the freelance contract turned into a CDI with the same company.
 */
export interface Rail {
  node: 'trunk' | 'branch'
  branch?: 'through' | 'open' | 'forkBelow' | 'mergeAtHead' | 'forkAtHead' | 'endBelowHead' | 'levelUp'
  /** i18n key of a short label written along the yellow pipe. */
  label?: string
  /** i18n key of the label written under the coupler of a `levelUp` branch. */
  levelUp?: string
}

export const rails: Record<string, Rail> = {
  'ORPI': { node: 'trunk' },
  'PEPPRIO': { node: 'branch', branch: 'forkBelow' },
  'CCM BENCHMARK · GROUPE LE FIGARO': { node: 'trunk' },
  // Keytchens: freelance until 08/20, then a CDI from 09/20; the yellow pipe ends at 08/20 and joins
  // the green trunk through a coupler where the contract changes
  'KEYTCHENS': { node: 'trunk', branch: 'levelUp', levelUp: 'experienceUi.levelUp' },
  'MATALTO': { node: 'trunk', branch: 'through', label: 'experienceUi.freelanceBranch' },
  'MOBELITE': { node: 'trunk', branch: 'through' },
  'PIXELS TRADE': { node: 'trunk', branch: 'forkAtHead' },
  'ARGOLIFE': { node: 'trunk' },
}

/**
 * Contract of each job, keyed like `rails` (from LinkedIn): the company name is drawn in red for a
 * salaried job (CDI; Mobelite was a CDD), in green for a freelance one and in yellow for my own
 * company. Keytchens was freelance (09/18 – 08/20) then CDI (09/20 – 08/24): its name follows the
 * CDI, each phase keeps its own colour.
 */
export const contracts: Record<string, 'permanent' | 'freelance' | 'own'> = {
  'ORPI': 'permanent',
  'PEPPRIO': 'own',
  'CCM BENCHMARK · GROUPE LE FIGARO': 'permanent',
  'KEYTCHENS': 'permanent',
  'MATALTO': 'permanent',
  'MOBELITE': 'permanent',
  'PIXELS TRADE': 'permanent',
  'ARGOLIFE': 'permanent',
}

/** A "Tunisia → France" milestone is shown just above this company. */
export const countryChangeBefore = 'MOBELITE'
