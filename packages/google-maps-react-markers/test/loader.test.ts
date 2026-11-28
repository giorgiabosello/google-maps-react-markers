import { describe, expect, it } from 'vitest'
import { getStatus, loadGoogleMaps, loadLibrary } from '../src/loader'
import { installGoogleMapsMock } from './google-maps-mock'

describe('loader with an API already on the page', () => {
	it('reuses google.maps.importLibrary and becomes ready', async () => {
		const mock = installGoogleMapsMock()
		expect(getStatus()).toBe('loading')
		await loadGoogleMaps({ apiKey: 'key', libraries: ['places'] })
		expect(getStatus()).toBe('ready')
		expect(mock.importLibrary.mock.calls.map(([name]) => name)).toEqual(['core', 'maps', 'places'])
	})

	it('loads each library only once, even with several maps', async () => {
		const mock = installGoogleMapsMock()
		await Promise.all([loadGoogleMaps({ apiKey: 'key' }), loadGoogleMaps({ apiKey: 'key' })])
		await Promise.all([loadLibrary('marker'), loadLibrary('marker')])
		const names = mock.importLibrary.mock.calls.map(([name]) => name)
		expect(names.filter((name) => name === 'maps')).toHaveLength(1)
		expect(names.filter((name) => name === 'marker')).toHaveLength(1)
	})

	it('switches to error when Google rejects the key', async () => {
		installGoogleMapsMock()
		await loadGoogleMaps({ apiKey: 'bad' })
		window.gm_authFailure?.()
		expect(getStatus()).toBe('error')
	})

	it('switches to error when a library fails to load', async () => {
		const mock = installGoogleMapsMock()
		mock.importLibrary.mockRejectedValueOnce(new Error('offline'))
		await expect(loadGoogleMaps({ apiKey: 'key' })).rejects.toThrow('offline')
		expect(getStatus()).toBe('error')
	})
})

describe('loader with a Maps script tag still loading', () => {
	it('waits for the script instead of loading the API again', async () => {
		const script = document.createElement('script')
		script.src = 'https://maps.googleapis.com/maps/api/js?key=page'
		document.head.append(script)
		try {
			const loading = loadGoogleMaps({ apiKey: 'key' })
			await Promise.resolve()
			expect(getStatus()).toBe('loading')
			// The page's script finishes: google.maps now exists.
			const mock = installGoogleMapsMock()
			script.dispatchEvent(new Event('load'))
			await loading
			expect(getStatus()).toBe('ready')
			expect(mock.importLibrary).toHaveBeenCalledWith('maps')
		} finally {
			script.remove()
		}
	})
})
