export const appName = 'Google Maps React Markers'
export const docsRoute = '/docs'
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const gitConfig = {
	user: 'giorgiabosello',
	repo: 'google-maps-react-markers',
	branch: 'main',
}

export const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`
export const npmUrl = 'https://www.npmjs.com/package/google-maps-react-markers'

/** Public demo configuration. The key is restricted by HTTP referrer, so it is safe in client code. */
export const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
export const demoMapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'

/** Syntax highlighting with WCAG AAA contrast, for MDX and the landing page. */
export const codeThemes = { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' } as const
