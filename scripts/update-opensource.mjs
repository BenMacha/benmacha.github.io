#!/usr/bin/env node
// Refreshes data/opensource.ts from GitHub and Packagist.
//
// Usage: node scripts/update-opensource.mjs
//        GITHUB_TOKEN=$(gh auth token) node scripts/update-opensource.mjs   (higher rate limit)
//
// For every repository below it asks the GitHub search API for `is:pr author:<AUTHOR> repo:<repo>`,
// keeps the merged and the open pull requests, and reads the download totals of the Packagist
// packages. Only the generated block between the markers in data/opensource.ts is rewritten:
// the types, the notes and the organizations stay as they are written there.
// Node 20+, built-ins only.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const AUTHOR = 'BenMacha'
const REPOS = ['symfony/symfony', 'api-platform/core', 'api-platform/api-platform', 'caddyserver/caddy', 'ccmbenchmark/ting']
const PACKAGES = ['benmacha/diagram-bundle', 'benmacha/mousetracker', 'benmacha/audit-bundle', 'benmacha/templatebundle']
const FILE = fileURLToPath(new URL('../data/opensource.ts', import.meta.url))
const START = '// <generated> — written by scripts/update-opensource.mjs, do not edit by hand'
const END = '// </generated>'

const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'benmacha-portfolio', 'X-GitHub-Api-Version': '2022-11-28' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

async function getJson(url, init = {}) {
  const response = await fetch(url, init)
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status} ${await response.text()}`)
  return response.json()
}

async function pullRequests(repo) {
  const items = []
  for (let page = 1; page <= 10; page++) {
    const q = encodeURIComponent(`is:pr author:${AUTHOR} repo:${repo}`)
    const data = await getJson(`https://api.github.com/search/issues?q=${q}&per_page=100&page=${page}&sort=created&order=desc`, { headers })
    items.push(...data.items)
    if (items.length >= data.total_count || data.items.length < 100) break
  }
  return items
    .map(item => ({
      repo,
      number: item.number,
      title: item.title.trim(),
      url: item.html_url,
      state: item.pull_request?.merged_at ? 'merged' : item.state === 'open' ? 'open' : 'closed',
      mergedAt: item.pull_request?.merged_at ?? null,
      createdAt: item.created_at,
    }))
    // Closed without being merged: not a contribution
    .filter(pr => pr.state !== 'closed')
    .sort((a, b) => (b.mergedAt ?? b.createdAt).localeCompare(a.mergedAt ?? a.createdAt) || b.number - a.number)
}

async function packageInfo(name) {
  const { package: p } = await getJson(`https://packagist.org/packages/${name}.json`, { headers: { 'User-Agent': 'benmacha-portfolio' } })
  return {
    name,
    description: String(p.description ?? '').trim(),
    url: `https://packagist.org/packages/${name}`,
    repository: p.repository ?? null,
    downloads: Number(p.downloads?.total ?? 0),
  }
}

const prs = []
for (const repo of REPOS) {
  const list = await pullRequests(repo)
  console.log(`${repo}: ${list.filter(pr => pr.state === 'merged').length} merged, ${list.filter(pr => pr.state === 'open').length} open`)
  prs.push(...list)
}
const packages = []
for (const name of PACKAGES) {
  const info = await packageInfo(name)
  console.log(`${name}: ${info.downloads} downloads`)
  packages.push(info)
}

const json = value => JSON.stringify(value, null, 2)
const block = [
  START,
  `export const updatedAt = '${new Date().toISOString().slice(0, 10)}'`,
  '',
  `export const pullRequests: PullRequest[] = ${json(prs)}`,
  '',
  `export const packages: Package[] = ${json(packages)}`,
  END,
].join('\n')

const source = readFileSync(FILE, 'utf8')
const from = source.indexOf(START)
const to = source.indexOf(END)
if (from === -1 || to === -1) throw new Error(`markers not found in ${FILE}`)
writeFileSync(FILE, source.slice(0, from) + block + source.slice(to + END.length))
console.log(`wrote ${FILE}: ${prs.length} pull requests, ${packages.length} packages`)
