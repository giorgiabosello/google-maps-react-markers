import { render } from '@testing-library/react'
import { useEffect } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { GoogleMap, MapControl, type MapControlProps } from '../src'
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

	it('moves to a new position without remounting its content', async () => {
		const mock = installGoogleMapsMock()
		const mounted = vi.fn()
		const Content = () => {
			useEffect(() => mounted(), [])
			return <button type="button">Recenter</button>
		}
		const ui = (position: MapControlProps['position']) => (
			<GoogleMap defaultCenter={{ lat: 0, lng: 0 }} defaultZoom={3}>
				<MapControl position={position}>
					<Content />
				</MapControl>
			</GoogleMap>
		)
		const { rerender, unmount } = render(ui('TOP_RIGHT'))
		await flush()
		const { controls } = mock.maps[0]!
		const element = controls[3]!.getArray()[0]!
		rerender(ui('BOTTOM_LEFT'))
		expect(controls[3]!.getArray()).toHaveLength(0)
		expect(controls[10]!.getArray()).toEqual([element])
		expect(element.textContent).toBe('Recenter')
		expect(mounted).toHaveBeenCalledTimes(1)
		unmount()
		expect(controls[10]!.getArray()).toHaveLength(0)
	})

	it('logs an invalid position instead of failing silently', async () => {
		installGoogleMapsMock()
		const error = vi.spyOn(console, 'error').mockImplementation(() => {})
		render(
			<GoogleMap defaultCenter={{ lat: 0, lng: 0 }} defaultZoom={3}>
				<MapControl position={'NOPE' as MapControlProps['position']}>
					<button type="button">Recenter</button>
				</MapControl>
			</GoogleMap>,
		)
		await flush()
		expect(error).toHaveBeenCalledWith(expect.stringContaining('position "NOPE" is not a google.maps.ControlPosition'))
		error.mockRestore()
	})
})
