/**
 * Open source contributions: pull requests to other projects, Packagist packages and organizations.
 * The block between the <generated> markers is rewritten by `node scripts/update-opensource.mjs`.
 */

/** merged; open (under review, possibly approved); closed without being merged */
export type PullRequestState = 'merged' | 'open' | 'closed'

export interface PullRequest {
  /** "owner/name" on GitHub */
  repo: string
  number: number
  title: string
  url: string
  state: PullRequestState
  /** Open pull request whose latest review is an approval, waiting for the merge */
  approved: boolean
  /** ISO date-time, null unless merged */
  mergedAt: string | null
  /** ISO date-time, set when closed without being merged */
  closedAt: string | null
  createdAt: string
}

export interface Package {
  /** Packagist name, "vendor/package" */
  name: string
  description: string
  url: string
  repository: string | null
  /** Total installs reported by Packagist */
  downloads: number
}

/** Logo drawn for a project: a Simple Icons path (CC0) or a neutral mark. */
export type LogoKey = 'symfony' | 'apiplatform' | 'caddy' | 'database' | 'github' | 'packagist'

export interface UpstreamProject {
  /** Repositories whose pull requests are counted for this project */
  repos: string[]
  /** Stable id, used for colours and highlights */
  id: string
  name: string
  url: string
  logo: LogoKey
}

export const upstreamProjects: UpstreamProject[] = [
  { id: 'symfony', name: 'Symfony', repos: ['symfony/symfony'], url: 'https://github.com/symfony/symfony', logo: 'symfony' },
  { id: 'apiplatform', name: 'API Platform', repos: ['api-platform/core', 'api-platform/api-platform'], url: 'https://github.com/api-platform', logo: 'apiplatform' },
  { id: 'caddy', name: 'Caddy', repos: ['caddyserver/caddy'], url: 'https://github.com/caddyserver/caddy', logo: 'caddy' },
  { id: 'ting', name: 'Ting', repos: ['ccmbenchmark/ting'], url: 'https://github.com/ccmbenchmark/ting', logo: 'database' },
]

export interface SecurityNote {
  project: string
  /** i18n key under `openSource.notes` */
  key: string
  url: string
  label: string
}

export interface Credit {
  project: string
  /** i18n key under `openSource.credits` */
  key: string
  url: string
  label: string
  /** My pull request it comes from */
  from: string
}

/** Work merged upstream without a pull request of mine: a maintainer took over the change. */
export const credits: Credit[] = [
  // Nicolas Grekas reworked these from #67722 and #67723, in his own pull requests
  { project: 'symfony', key: 'doctrineMessageId', url: 'https://github.com/symfony/symfony/pull/67725', label: 'symfony/symfony#67725', from: '#67722' },
  { project: 'symfony', key: 'legacyReauth', url: 'https://github.com/symfony/symfony/pull/67726', label: 'symfony/symfony#67726', from: '#67723' },
]

/** Contributions that are not pull requests. */
export const securityNotes: SecurityNote[] = [
  // Reported an SQL injection in the PostgreSQL driver, fixed upstream in 4.1.1
  { project: 'ting', key: 'tingSqlInjection', url: 'https://github.com/ccmbenchmark/ting/issues/120', label: 'ccmbenchmark/ting#120' },
]

export interface Organization {
  id: 'pepprio' | 'pignelle' | 'benmacha'
  name: string
  /** i18n key under `openSource.orgs` for the description */
  key: string
  links: { label: string, url: string }[]
}

export const organizations: Organization[] = [
  {
    id: 'pepprio',
    name: 'Pepprio',
    key: 'pepprio',
    links: [
      { label: 'github.com/pepprio', url: 'https://github.com/pepprio' },
      { label: 'pepprio.com', url: 'https://pepprio.com/' },
    ],
  },
  {
    id: 'pignelle',
    name: 'Pignelle',
    key: 'pignelle',
    links: [
      { label: 'github.com/Pignelle', url: 'https://github.com/Pignelle' },
      { label: 'pignelle.com', url: 'https://pignelle.com' },
    ],
  },
  {
    id: 'benmacha',
    name: 'BenMacha',
    key: 'benmacha',
    links: [
      { label: 'github.com/BenMacha', url: 'https://github.com/BenMacha' },
      { label: 'benmacha.tn', url: 'https://benmacha.tn' },
    ],
  },
]

// <generated> — written by scripts/update-opensource.mjs, do not edit by hand
export const updatedAt = '2026-11-08'

export const pullRequests: PullRequest[] = [
  {
    "repo": "symfony/symfony",
    "number": 67699,
    "title": "[Form] Validate the collection entries that keep_as_list doesn't need to renumber",
    "url": "https://github.com/symfony/symfony/pull/67699",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-01T13:27:13Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:52:02Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67712,
    "title": "[Messenger] Stop keeping alive the messages that a listener prevents the worker from handling",
    "url": "https://github.com/symfony/symfony/pull/67712",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-01T09:38:08Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:58:13Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67707,
    "title": "[Security] Reject login links with an out of range \"expires\" parameter",
    "url": "https://github.com/symfony/symfony/pull/67707",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-01T09:08:47Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:57:51Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67722,
    "title": "[Messenger] Ignore ids that are not integers when finding a message of the Doctrine transport",
    "url": "https://github.com/symfony/symfony/pull/67722",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-01T09:08:07Z",
    "closedAt": null,
    "createdAt": "2026-11-01T00:44:07Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67723,
    "title": "[Security] Do not request a re-authentication that cannot prove a recent authentication",
    "url": "https://github.com/symfony/symfony/pull/67723",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-01T09:03:42Z",
    "closedAt": null,
    "createdAt": "2026-11-01T00:45:45Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67708,
    "title": "[Security] Ignore target and failure paths that are neither paths nor absolute URLs",
    "url": "https://github.com/symfony/symfony/pull/67708",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-01T07:52:15Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:57:56Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67703,
    "title": "[Cache] Honor the $save flag set by the callback in EarlyExpirationHandler",
    "url": "https://github.com/symfony/symfony/pull/67703",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-01T07:50:04Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:57:34Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67706,
    "title": "[Security] Reject remember-me cookies with an invalid expiration time",
    "url": "https://github.com/symfony/symfony/pull/67706",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-01T07:38:46Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:57:47Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67705,
    "title": "[RateLimiter] Validate the refill amount, the fixed window interval and the sliding window limit",
    "url": "https://github.com/symfony/symfony/pull/67705",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-01T07:38:04Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:57:43Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67700,
    "title": "[Form] Ignore collection entries with invalid names when allow_add is enabled",
    "url": "https://github.com/symfony/symfony/pull/67700",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-01T07:36:58Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:57:21Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67711,
    "title": "[Messenger] Do not resend the stamp headers of a received AMQP message",
    "url": "https://github.com/symfony/symfony/pull/67711",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-10-31T22:41:21Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:58:09Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67702,
    "title": "[Form] Fix submitting \"0\" to a non-compound root form",
    "url": "https://github.com/symfony/symfony/pull/67702",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-10-31T21:50:45Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:57:30Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67709,
    "title": "[Messenger] Restore the schema assets filter when the Doctrine transport setup fails",
    "url": "https://github.com/symfony/symfony/pull/67709",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-10-31T21:49:38Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:58:00Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67710,
    "title": "[Messenger] Do not expose the Redis DSN in the invalid host query parameter exception",
    "url": "https://github.com/symfony/symfony/pull/67710",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-10-31T21:49:07Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:58:04Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67704,
    "title": "[Cache] Fix the SQL of PdoTagAwareAdapter on MySQL, PostgreSQL, Oracle and SQL Server",
    "url": "https://github.com/symfony/symfony/pull/67704",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-10-31T21:43:54Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:57:38Z"
  },
  {
    "repo": "symfony/symfony",
    "number": 67701,
    "title": "[Form] Fix the post_max_size check when it is set to a negative value",
    "url": "https://github.com/symfony/symfony/pull/67701",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-10-31T21:34:34Z",
    "closedAt": null,
    "createdAt": "2026-10-31T20:57:25Z"
  },
  {
    "repo": "api-platform/core",
    "number": 8777,
    "title": "fix(doctrine): left join collection associations in IriFilter inside OR groups",
    "url": "https://github.com/api-platform/core/pull/8777",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-04T09:09:08Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:05:42Z"
  },
  {
    "repo": "api-platform/core",
    "number": 8778,
    "title": "fix(serializer): reject a non-string id in JSON-LD and JSON:API relations",
    "url": "https://github.com/api-platform/core/pull/8778",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T19:41:08Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:05:44Z"
  },
  {
    "repo": "api-platform/core",
    "number": 8775,
    "title": "fix(doctrine): ignore nested array values in range and search filters",
    "url": "https://github.com/api-platform/core/pull/8775",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T15:31:17Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:05:36Z"
  },
  {
    "repo": "api-platform/core",
    "number": 8776,
    "title": "fix(doctrine): reject too large pages with ODM partial pagination",
    "url": "https://github.com/api-platform/core/pull/8776",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T15:30:01Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:05:39Z"
  },
  {
    "repo": "api-platform/core",
    "number": 8783,
    "title": "fix(laravel): filter on every value given to EqualsFilter",
    "url": "https://github.com/api-platform/core/pull/8783",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T15:05:46Z",
    "closedAt": null,
    "createdAt": "2026-11-01T11:47:14Z"
  },
  {
    "repo": "api-platform/core",
    "number": 8782,
    "title": "fix(laravel): purge the HTTP cache on GraphQL mutations",
    "url": "https://github.com/api-platform/core/pull/8782",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T15:05:42Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:05:54Z"
  },
  {
    "repo": "api-platform/core",
    "number": 8781,
    "title": "fix(laravel): ignore non-string values in search filters",
    "url": "https://github.com/api-platform/core/pull/8781",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T15:05:37Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:05:51Z"
  },
  {
    "repo": "api-platform/core",
    "number": 8780,
    "title": "fix(serializer): unwrap the collection key type, not the collection type",
    "url": "https://github.com/api-platform/core/pull/8780",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T15:05:33Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:05:49Z"
  },
  {
    "repo": "api-platform/core",
    "number": 8779,
    "title": "fix(state): reject invalid GraphQL pagination cursors",
    "url": "https://github.com/api-platform/core/pull/8779",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T15:04:59Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:05:47Z"
  },
  {
    "repo": "api-platform/api-platform",
    "number": 3024,
    "title": "feat(installer): validate --symfony-docker-ref",
    "url": "https://github.com/api-platform/api-platform/pull/3024",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-06T14:07:17Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:06:07Z"
  },
  {
    "repo": "api-platform/api-platform",
    "number": 3023,
    "title": "fix: print the release version",
    "url": "https://github.com/api-platform/api-platform/pull/3023",
    "state": "open",
    "approved": false,
    "mergedAt": null,
    "closedAt": null,
    "createdAt": "2026-11-01T09:06:05Z"
  },
  {
    "repo": "caddyserver/caddy",
    "number": 8343,
    "title": "caddyhttp: lower-case path patterns with placeholders at request time",
    "url": "https://github.com/caddyserver/caddy/pull/8343",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-04T06:37:26Z",
    "closedAt": null,
    "createdAt": "2026-11-03T07:44:08Z"
  },
  {
    "repo": "caddyserver/caddy",
    "number": 8316,
    "title": "caddyfile: reject negative import argument indices",
    "url": "https://github.com/caddyserver/caddy/pull/8316",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T08:15:37Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:28:25Z"
  },
  {
    "repo": "caddyserver/caddy",
    "number": 8317,
    "title": "admin: authorize remote requests matching any permission entry",
    "url": "https://github.com/caddyserver/caddy/pull/8317",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T07:05:43Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:28:28Z"
  },
  {
    "repo": "caddyserver/caddy",
    "number": 8320,
    "title": "reverseproxy: skip unavailable upstream with a single weighted_round_robin weight",
    "url": "https://github.com/caddyserver/caddy/pull/8320",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T07:01:28Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:28:35Z"
  },
  {
    "repo": "caddyserver/caddy",
    "number": 8322,
    "title": "fileserver: handle empty files in size try policies",
    "url": "https://github.com/caddyserver/caddy/pull/8322",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T06:59:34Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:28:39Z"
  },
  {
    "repo": "caddyserver/caddy",
    "number": 8318,
    "title": "reverseproxy: close upstream body when handle_response status is invalid",
    "url": "https://github.com/caddyserver/caddy/pull/8318",
    "state": "merged",
    "approved": false,
    "mergedAt": "2026-11-03T06:58:01Z",
    "closedAt": null,
    "createdAt": "2026-11-01T09:28:30Z"
  },
  {
    "repo": "caddyserver/caddy",
    "number": 8342,
    "title": "fastcgi: fail the request when a param name cannot fit in a record",
    "url": "https://github.com/caddyserver/caddy/pull/8342",
    "state": "open",
    "approved": false,
    "mergedAt": null,
    "closedAt": null,
    "createdAt": "2026-11-03T07:44:05Z"
  },
  {
    "repo": "caddyserver/caddy",
    "number": 8323,
    "title": "logging: close the redialed conn when writing to it fails",
    "url": "https://github.com/caddyserver/caddy/pull/8323",
    "state": "closed",
    "approved": false,
    "mergedAt": null,
    "closedAt": "2026-11-03T06:56:57Z",
    "createdAt": "2026-11-01T09:28:42Z"
  },
  {
    "repo": "caddyserver/caddy",
    "number": 8319,
    "title": "caddyhttp: keep placeholder names intact in path matcher",
    "url": "https://github.com/caddyserver/caddy/pull/8319",
    "state": "closed",
    "approved": false,
    "mergedAt": null,
    "closedAt": "2026-11-03T06:53:13Z",
    "createdAt": "2026-11-01T09:28:32Z"
  },
  {
    "repo": "caddyserver/caddy",
    "number": 8321,
    "title": "fastcgi: skip params whose name cannot fit in a record",
    "url": "https://github.com/caddyserver/caddy/pull/8321",
    "state": "closed",
    "approved": false,
    "mergedAt": null,
    "closedAt": "2026-11-03T06:52:37Z",
    "createdAt": "2026-11-01T09:28:37Z"
  },
  {
    "repo": "ccmbenchmark/ting",
    "number": 137,
    "title": "chore(ci): fix the lowest-deps job, add PHP 8.5, composer audit, Dependabot, issue template and security policy",
    "url": "https://github.com/ccmbenchmark/ting/pull/137",
    "state": "open",
    "approved": false,
    "mergedAt": null,
    "closedAt": null,
    "createdAt": "2026-10-31T10:06:32Z"
  },
  {
    "repo": "ccmbenchmark/ting",
    "number": 136,
    "title": "fix(security): escape SQL identifiers, validate order keys, quote the Pgsql DSN and check timezones",
    "url": "https://github.com/ccmbenchmark/ting/pull/136",
    "state": "open",
    "approved": false,
    "mergedAt": null,
    "closedAt": null,
    "createdAt": "2026-10-31T10:01:17Z"
  },
  {
    "repo": "ccmbenchmark/ting",
    "number": 123,
    "title": "Fix #122: Missing Return Statement in PostgreSQL Driver",
    "url": "https://github.com/ccmbenchmark/ting/pull/123",
    "state": "open",
    "approved": false,
    "mergedAt": null,
    "closedAt": null,
    "createdAt": "2025-08-27T22:14:46Z"
  },
  {
    "repo": "ccmbenchmark/ting",
    "number": 121,
    "title": "Fix #120: SQL Injection Vulnerability in PostgreSQL Driver",
    "url": "https://github.com/ccmbenchmark/ting/pull/121",
    "state": "closed",
    "approved": false,
    "mergedAt": null,
    "closedAt": "2026-10-31T10:01:23Z",
    "createdAt": "2025-08-27T21:56:50Z"
  }
]

export const packages: Package[] = [
  {
    "name": "benmacha/diagram-bundle",
    "description": "Interactive Doctrine entity diagram for Symfony: JSON API + React studio usable from Twig, plain JS, React and Vue.",
    "url": "https://packagist.org/packages/benmacha/diagram-bundle",
    "repository": "https://github.com/BenMacha/diagram-bundle",
    "downloads": 64
  },
  {
    "name": "benmacha/mousetracker",
    "description": "Self-hosted mouse, click and scroll tracker for Symfony: heatmaps, scroll maps and session replay. React dashboard usable from Twig, plain JS, React and Vue.",
    "url": "https://packagist.org/packages/benmacha/mousetracker",
    "repository": "https://github.com/BenMacha/mouseTracker",
    "downloads": 59
  },
  {
    "name": "benmacha/audit-bundle",
    "description": "A comprehensive Symfony bundle for auditing entity changes with rollback functionality, web interface, and REST API",
    "url": "https://packagist.org/packages/benmacha/audit-bundle",
    "repository": "https://github.com/BenMacha/audit-bundle",
    "downloads": 4
  },
  {
    "name": "benmacha/templatebundle",
    "description": "Symfony Template Bundle",
    "url": "https://packagist.org/packages/benmacha/templatebundle",
    "repository": "https://github.com/BenMacha/Templatebundle",
    "downloads": 147
  }
]
// </generated>

export interface ProjectContributions extends UpstreamProject {
  merged: PullRequest[]
  /** Under review, approved ones first */
  open: PullRequest[]
  /** Closed without being merged: kept as history */
  closed: PullRequest[]
}

/** Pull requests grouped by upstream project, in the order of `upstreamProjects`. */
export const contributionsByProject: ProjectContributions[] = upstreamProjects.map(project => {
  const own = pullRequests.filter(pr => project.repos.includes(pr.repo))
  return {
    ...project,
    merged: own.filter(pr => pr.state === 'merged'),
    open: own.filter(pr => pr.state === 'open').sort((a, b) => Number(b.approved) - Number(a.approved)),
    closed: own.filter(pr => pr.state === 'closed'),
  }
})

export const mergedCount = pullRequests.filter(pr => pr.state === 'merged').length
export const openCount = pullRequests.filter(pr => pr.state === 'open').length
export const approvedCount = pullRequests.filter(pr => pr.state === 'open' && pr.approved).length
export const closedCount = pullRequests.filter(pr => pr.state === 'closed').length

/** Has anything to show: a pull request in any state, a credit or a security note. */
export const hasContributions = (p: ProjectContributions) =>
  p.merged.length + p.open.length + p.closed.length > 0
  || credits.some(c => c.project === p.id)
  || securityNotes.some(n => n.project === p.id)
