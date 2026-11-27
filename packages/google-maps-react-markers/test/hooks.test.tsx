import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GoogleMap, useGoogleMapsStatus, useMap, useMapsLibrary } from '../src'
import { installGoogleMapsMock } from './google-maps-mock'
import { flush } from './utils'

const Probe = () => {
	const map = useMap()
	const places = useMapsLibrary('places') as { name: string } | null
	const status = useGoogleMapsStatus()
	return <p>{`${status} map:${map ? 'yes' : 'no'} places:${places?.name ?? 'no'}`}</p>
}

describe('hooks', () => {
	it('expose the map, extra libraries and the loading status', async () => {
		installGoogleMapsMock()
		render(
			<GoogleMap defaultCenter={{ lat: 0, lng: 0 }} defaultZoom={3}>
				<Probe />
			</GoogleMap>,
		)
		expect(screen.getByText('loading map:no places:no')).toBeTruthy()
		await flush()
		expect(screen.getByText('ready map:yes places:places')).toBeTruthy()
	})

	it('useMap throws outside <GoogleMap>', () => {
		vi.spyOn(console, 'error').mockImplementation(() => {})
		expect(() => render(<Probe />)).toThrow('useMap() must be used inside <GoogleMap>')
		vi.restoreAllMocks()
	})
})
