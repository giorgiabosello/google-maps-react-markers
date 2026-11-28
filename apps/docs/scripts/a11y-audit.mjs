/**
 * Accessibility audit of the static export with axe-core: every page, dark and light theme,
 * WCAG 2.2 A to AAA plus axe best practices. Exits with 1 on any violation.
 *
 * Google's own map UI (controls, footer links, tooltips) is reported but not counted:
 * it cannot be changed from here. Markers rendered by the library are always counted.
 *
 *   DOCS_BASE_PATH='' pnpm --filter docs build && pnpm --filter docs a11y
 */
import { appendFileSync, readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'
import { serve } from './serve.mjs'

const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const outDir = fileURLToPath(new URL('../out', import.meta.url))

const TAGS = [
	'wcag2a',
	'wcag2aa',
	'wcag2aaa',
	'wcag21a',
	'wcag21aa',
	'wcag21aaa',
	'wcag22a',
	'wcag22aa',
	'wcag22aaa',
	'best-practice',
]

const chromePath =
	process.env.CHROME_PATH ??
	(process.platform === 'darwin'
		? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
		: process.platform === 'win32'
			? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
			: '/usr/bin/google-chrome')

/** Every page of the export, as a URL path. */
const pagePaths = (dir = outDir) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = join(dir, entry.name)
		if (entry.isDirectory()) return entry.name.startsWith('_') ? [] : pagePaths(full)
		if (entry.name !== 'index.html') return []
		const path = relative(outDir, dir).split(sep).join('/')
		return [path ? `/${path}/` : '/']
	})

const auditPage = async (browser, url, scheme) => {
	const page = await browser.newPage()
	try {
		await page.setViewport({ width: 1280, height: 900 })
		await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }])
		await page.evaluateOnNewDocument((theme) => {
			try {
				localStorage.setItem('theme', theme)
			} catch {
				// Storage blocked: the theme follows prefers-color-scheme.
			}
		}, scheme)
		await page.goto(url, { waitUntil: 'networkidle2', timeout: 60_000 })
		// Scroll through the page, so the lazy demo maps load, then let them settle.
		await page.evaluate(async () => {
			for (let y = 0; y < document.body.scrollHeight; y += 600) {
				window.scrollTo(0, y)
				await new Promise((resolve) => setTimeout(resolve, 200))
			}
			window.scrollTo(0, 0)
		})
		await new Promise((resolve) => setTimeout(resolve, 3000))
		await page.evaluate(axeSource)
		return await page.evaluate(async (tags) => {
			const result = await window.axe.run(document, { runOnly: { type: 'tag', values: tags } })
			/** Google's map UI: inside the map but not inside a marker rendered by the library. */
			const isGoogle = (selector) => {
				const element = document.querySelector(selector)
				if (!element) return false
				if (element.closest('[data-gmrm-marker]')) return false
				// data-gmrm-map is the element the library gives Google to draw the map in.
				return Boolean(element.closest('[data-gmrm-map]') || element.matches('[aria-roledescription="map"]'))
			}
			return result.violations.flatMap((violation) =>
				violation.nodes.map((node) => {
					const selector = node.target.at(-1)
					return {
						id: violation.id,
						impact: violation.impact,
						help: violation.help,
						target: node.target.join(' '),
						summary: node.failureSummary?.split('\n').slice(1, 2).join(' ').trim(),
						google: typeof selector === 'string' && isGoogle(selector),
					}
				}),
			)
		}, TAGS)
	} finally {
		await page.close()
	}
}

const { url: base, close } = await serve()
const browser = await puppeteer.launch({
	executablePath: chromePath,
	headless: true,
	args: process.env.CI ? ['--no-sandbox'] : [],
})

const paths = pagePaths()
const failures = []
const google = []
try {
	for (const scheme of ['dark', 'light']) {
		for (const path of paths) {
			const violations = await auditPage(browser, base + path, scheme)
			for (const violation of violations) (violation.google ? google : failures).push({ ...violation, scheme, path })
			const own = violations.filter((violation) => !violation.google).length
			console.log(`${own ? '✗' : '✓'} ${scheme.padEnd(5)} ${path}${own ? `  (${own})` : ''}`)
		}
	}
} finally {
	await browser.close()
	close()
}

const group = (list) => {
	const groups = new Map()
	for (const item of list) {
		const key = `${item.id} (${item.impact})`
		const entry = groups.get(key) ?? { help: item.help, items: [] }
		entry.items.push(item)
		groups.set(key, entry)
	}
	return groups
}

const lines = [`## Accessibility (axe-core, WCAG 2.2 AAA)`, '', `${paths.length} pages, dark and light theme.`, '']
if (failures.length) {
	lines.push(`**${failures.length} violations.**`, '')
	for (const [key, { help, items }] of group(failures)) {
		lines.push(`- \`${key}\` ${help}: ${items.length}`)
		for (const item of items.slice(0, 5)) {
			lines.push(`  - ${item.scheme} \`${item.path}\` \`${item.target}\`: ${item.summary ?? ''}`)
		}
	}
} else {
	lines.push('**No violations.**')
}
if (google.length) {
	lines.push('', `In Google's map UI, not counted: ${[...group(google).keys()].join(', ')}.`)
}
const report = lines.join('\n')
console.log(`\n${report}`)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`)
process.exit(failures.length ? 1 : 0)
