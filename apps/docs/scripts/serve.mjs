/**
 * Serves the static export (out/) for the accessibility and Lighthouse checks.
 * Build with DOCS_BASE_PATH='' first, so the site lives at the root.
 *
 *   node scripts/serve.mjs [port]
 */
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('../out', import.meta.url)))

const types = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.ico': 'image/x-icon',
	'.woff2': 'font/woff2',
}

const resolveFile = async (pathname) => {
	// normalize() plus the prefix check keeps requests inside out/.
	const candidate = normalize(join(root, decodeURIComponent(pathname)))
	if (!candidate.startsWith(root)) return null
	for (const file of [candidate, join(candidate, 'index.html'), `${candidate}.html`]) {
		const info = await stat(file).catch(() => null)
		if (info?.isFile()) return file
	}
	return null
}

/** Starts the server and resolves with its base URL. */
export const serve = (port = 0) =>
	new Promise((resolveUrl) => {
		const server = createServer(async (request, response) => {
			const { pathname } = new URL(request.url ?? '/', 'http://localhost')
			const file = await resolveFile(pathname)
			if (!file) {
				response.writeHead(404, { 'content-type': 'text/plain' }).end('Not found')
				return
			}
			response.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
			createReadStream(file).pipe(response)
		})
		server.listen(port, '127.0.0.1', () => {
			const address = server.address()
			resolveUrl({ url: `http://127.0.0.1:${address.port}`, close: () => server.close() })
		})
	})

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const { url } = await serve(Number(process.argv[2] ?? 4173))
	console.log(`Serving ${root} at ${url}`)
}
