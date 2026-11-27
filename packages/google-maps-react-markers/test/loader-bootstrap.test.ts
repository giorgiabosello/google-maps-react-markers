import { describe, expect, it, vi } from 'vitest'
import { installGoogleMapsMock } from './google-maps-mock'

const { setOptions, importLibrary } = vi.hoisted(() => ({
	setOptions: vi.fn(),
	importLibrary: vi.fn(async (name: string) => ({ name })),
}))
vi.mock('@googlemaps/js-api-loader', () => ({ setOptions, importLibrary }))

describe('loader without an API on the page', () => {
	it('configures @googlemaps/js-api-loader once with the first options', async () => {
		// setup.ts already imported the loader with the real js-api-loader: load a fresh copy that sees the mock.
		vi.resetModules()
		const { loadGoogleMaps } = await import('../src/loader')
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const loading = loadGoogleMaps({ apiKey: 'key', language: 'it', region: 'IT', libraries: ['places'] })
		// Installed after configuration, as the real loader would.
		installGoogleMapsMock()
		await loading
		await loadGoogleMaps({ apiKey: 'other-key' })

		expect(setOptions).toHaveBeenCalledTimes(1)
		expect(setOptions).toHaveBeenCalledWith(
			expect.objectContaining({ key: 'key', v: 'weekly', language: 'it', region: 'IT' }),
		)
		expect(importLibrary.mock.calls.map(([name]) => name)).toEqual(['core', 'maps', 'places'])
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('already loaded with other options'))
		warn.mockRestore()
	})

	it('never sends empty options to Google', async () => {
		vi.resetModules()
		setOptions.mockClear()
		const { loadGoogleMaps } = await import('../src/loader')
		const loading = loadGoogleMaps({ apiKey: '' })
		installGoogleMapsMock()
		await loading
		expect(setOptions).toHaveBeenCalledWith({ v: 'weekly', solutionChannel: 'GMP_GMRM_v3' })
	})
})
