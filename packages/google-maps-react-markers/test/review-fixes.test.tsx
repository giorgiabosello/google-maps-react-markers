import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GoogleMap, Marker } from '../src'
import { installGoogleMapsMock } from './google-maps-mock'
import { flush } from './utils'

const center = { lat: 0, lng: 0 }

describe('fixes from the v3 review', () => {
	it('still runs React mouse handlers inside a draggable overlay marker', async () => {
		installGoogleMapsMock()
		const onMouseDown = vi.fn()
		render(
			<GoogleMap defaultCenter={center} defaultZoom={3}>
				<Marker lat={1} lng={1} draggable>
					<button type="button" onMouseDown={onMouseDown}>
						Pin
					</button>
				</Marker>
			</GoogleMap>,
		)
		await flush()
		screen.getByText('Pin').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
		expect(onMouseDown).toHaveBeenCalledTimes(1)
	})

	it('ignores map clicks that come from a marker', async () => {
		const mock = installGoogleMapsMock()
		const onMapClick = vi.fn()
		render(
			<GoogleMap defaultCenter={center} defaultZoom={3} onClick={onMapClick}>
				<Marker lat={1} lng={1}>
					<span>Pin</span>
				</Marker>
			</GoogleMap>,
		)
		await flush()
		const map = mock.maps[0]!
		mock.event.trigger(map, 'click', { domEvent: { target: screen.getByText('Pin') } })
		expect(onMapClick).not.toHaveBeenCalled()
		mock.event.trigger(map, 'click', { domEvent: { target: map.div } })
		expect(onMapClick).toHaveBeenCalledTimes(1)
	})

	it('lets a className decide the size', () => {
		installGoogleMapsMock()
		const { container, rerender } = render(<GoogleMap className="h-96" />)
		const element = container.firstElementChild as HTMLElement
		expect(element.style.height).toBe('')
		rerender(<GoogleMap />)
		expect(element.style.height).toBe('100%')
	})

	it('shows errorContent when the marker library fails to load', async () => {
		const mock = installGoogleMapsMock()
		vi.spyOn(console, 'error').mockImplementation(() => {})
		const original = mock.importLibrary.getMockImplementation()!
		mock.importLibrary.mockImplementation(async (name: string) => {
			if (name === 'marker') throw new Error('blocked')
			return original(name)
		})
		render(<GoogleMap defaultCenter={center} defaultZoom={3} mapId="demo" errorContent="Map error" />)
		await flush()
		expect(screen.getByText('Map error')).toBeTruthy()
		vi.restoreAllMocks()
	})

	it('does not call setOptions for an equal inline styles array', async () => {
		const mock = installGoogleMapsMock()
		const styles = () => [{ elementType: 'geometry', stylers: [{ color: '#000000' }] }]
		const { rerender } = render(<GoogleMap defaultCenter={center} defaultZoom={3} options={{ styles: styles() }} />)
		await flush()
		rerender(<GoogleMap defaultCenter={center} defaultZoom={3} options={{ styles: styles() }} />)
		expect(mock.maps[0]!.setOptions).not.toHaveBeenCalled()
	})
})
