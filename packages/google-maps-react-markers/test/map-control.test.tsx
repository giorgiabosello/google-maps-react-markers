import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GoogleMap, MapControl } from '../src'
import { installGoogleMapsMock } from './google-maps-mock'
import { flush } from './utils'

describe('<MapControl>', () => {
	it('renders React content as a map control and removes it on unmount', async () => {
		const mock = installGoogleMapsMock()
		const ui = (show: boolean) => (
			<GoogleMap defaultCenter={{ lat: 0, lng: 0 }} defaultZoom={3}>
				{show ? (
					<MapControl position="TOP_RIGHT">
						<button type="button">Recenter</button>
					</MapControl>
				) : null}
			</GoogleMap>
		)
		const { rerender } = render(ui(true))
		await flush()
		const controls = mock.maps[0]!.controls[3]!.getArray()
		expect(controls).toHaveLength(1)
		expect(controls[0]!.textContent).toBe('Recenter')
		rerender(ui(false))
		expect(controls).toHaveLength(0)
	})
})
