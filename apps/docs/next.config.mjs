import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()
const isProduction = process.env.NODE_ENV === 'production'
/**
 * GitHub Pages serves the site under /google-maps-react-markers.
 * CI sets DOCS_BASE_PATH='' to audit the export from the root of a local server.
 */
const basePath = process.env.DOCS_BASE_PATH ?? (isProduction ? '/google-maps-react-markers' : '')

/**
 * Local hostname for development with a real Maps key: the key is restricted to this name
 * instead of localhost. Map it to 127.0.0.1 in /etc/hosts (see CONTRIBUTING.md).
 */
export const devHost = 'google-maps-react-markers.test'

/** @type {import('next').NextConfig} */
const config = {
	// Static export for GitHub Pages, served under /google-maps-react-markers.
	output: 'export',
	basePath,
	trailingSlash: true,
	images: { unoptimized: true },
	reactStrictMode: true,
	// Next blocks dev resources (hot reload) requested from origins other than localhost.
	allowedDevOrigins: [devHost],
	env: {
		NEXT_PUBLIC_BASE_PATH: basePath,
	},
}

export default withMDX(config)
