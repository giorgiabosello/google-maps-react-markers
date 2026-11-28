/**
 * Renames the Changesets sections of every package CHANGELOG to the conventional-changelog
 * names, with an emoji. Runs after `changeset version`, so the GitHub releases
 * (made from the CHANGELOG) get the same headings. Safe to run more than once.
 *
 *   node scripts/changelog-headings.mjs
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HEADINGS = {
	'Major Changes': '💥 BREAKING CHANGES',
	'Minor Changes': '✨ Features',
	'Patch Changes': '🐛 Bug Fixes',
}

const packages = fileURLToPath(new URL('../packages', import.meta.url))

for (const name of readdirSync(packages)) {
	const file = join(packages, name, 'CHANGELOG.md')
	if (!existsSync(file)) continue
	const before = readFileSync(file, 'utf8')
	const after = before.replace(
		/^### (Major Changes|Minor Changes|Patch Changes)$/gm,
		(_, heading) => `### ${HEADINGS[heading]}`,
	)
	if (after !== before) writeFileSync(file, after)
}
