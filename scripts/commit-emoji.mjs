/**
 * Adds the emoji for the commit type after the Conventional Commits prefix:
 * `feat(marker): add anchor` becomes `feat(marker): ✨ add anchor`.
 * Runs from the prepare-commit-msg hook. Leaves merges, messages without a type
 * and subjects that already start with an emoji alone.
 *
 *   node scripts/commit-emoji.mjs <message file> [source]
 */
import { readFileSync, writeFileSync } from 'node:fs'

const EMOJI = {
	feat: '✨',
	fix: '🐛',
	docs: '📝',
	style: '💄',
	refactor: '♻️',
	perf: '⚡️',
	test: '✅',
	build: '📦',
	ci: '👷',
	chore: '🔧',
	revert: '⏪',
}

const HEADER = /^(?<type>[a-z]+)(?:\((?<scope>[^)]*)\))?(?<breaking>!)?: (?<subject>.*)$/

/** Returns the header with its emoji, or the header unchanged. */
const withEmoji = (header) => {
	const match = HEADER.exec(header)
	if (!match?.groups) return header
	const { type, scope, breaking, subject } = match.groups
	if (!(type in EMOJI) || /^\p{Extended_Pictographic}/u.test(subject)) return header
	const emoji = breaking ? '💥' : type === 'build' && scope?.startsWith('deps') ? '⬆️' : EMOJI[type]
	return `${header.slice(0, header.length - subject.length)}${emoji} ${subject}`
}

const [file, source] = process.argv.slice(2)
if (file && source !== 'merge') {
	const [header = '', ...rest] = readFileSync(file, 'utf8').split('\n')
	const next = withEmoji(header)
	if (next !== header) writeFileSync(file, [next, ...rest].join('\n'))
}
