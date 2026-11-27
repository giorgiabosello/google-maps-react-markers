import { render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { GoogleMap } from '../src'
import { installGoogleMapsMock } from './google-maps-mock'
import { flush } from './utils'

const center = { lat: 45, lng: 12 }

describe('<GoogleMap>', () => {
	it('shows loadingContent, then creates one map with the initial camera', async () => {
		const mock = installGoogleMapsMock()
		const onLoad = vi.fn()
		render(
			<StrictMode>
				<GoogleMap
					apiKey="key"
					defaultCenter={center}
					defaultZoom={5}
					options={{ disableDefaultUI: true }}
					loadingContent="Loading map"
					onLoad={onLoad}
				/>
			</StrictMode>,
		)
		expect(screen.getByText('Loading map')).toBeTruthy()
		await flush()

		expect(mock.maps).toHaveLength(1)
		expect(mock.maps[0]?.options).toMatchObject({ center, zoom: 5, disableDefaultUI: true })
		expect(onLoad).toHaveBeenCalledTimes(1)
		expect(onLoad).toHaveBeenCalledWith({ map: mock.maps[0], maps: window.google?.maps })
		expect(screen.queryByText('Loading map')).toBeNull()
	})

	it('shows errorContent when the API fails to load', async () => {
		const mock = installGoogleMapsMock()
		mock.importLibrary.mockRejectedValue(new Error('offline'))
		render(<GoogleMap apiKey="key" defaultCenter={center} defaultZoom={5} errorContent="Map error" />)
		await flush()
		expect(screen.getByText('Map error')).toBeTruthy()
		expect(mock.maps).toHaveLength(0)
	})

	it('removes every listener on unmount', async () => {
		const mock = installGoogleMapsMock()
		const tree = () => (
			<StrictMode>
				<GoogleMap
					defaultCenter={center}
					defaultZoom={5}
					onChange={() => {}}
					onClick={() => {}}
					onZoomChanged={() => {}}
				/>
			</StrictMode>
		)
		const { rerender, unmount } = render(tree())
		await flush()
		const map = mock.maps.at(-1)!
		const count = mock.countListeners(map)
		expect(count).toBeGreaterThan(0)
		// New handler functions on every render must not add listeners.
		rerender(tree())
		rerender(tree())
		expect(mock.countListeners(map)).toBe(count)
		unmount()
		expect(mock.countListeners(map)).toBe(0)
	})

	it('applies options only when they really change', async () => {
		const mock = installGoogleMapsMock()
		const { rerender } = render(<GoogleMap defaultCenter={center} defaultZoom={5} options={{ minZoom: 3 }} />)
		await flush()
		const map = mock.maps[0]!
		rerender(<GoogleMap defaultCenter={center} defaultZoom={5} options={{ minZoom: 3 }} />)
		expect(map.setOptions).not.toHaveBeenCalled()
		rerender(<GoogleMap defaultCenter={center} defaultZoom={5} options={{ minZoom: 4 }} />)
		expect(map.setOptions).toHaveBeenCalledWith({ minZoom: 4 })
	})

	it('calls the latest onChange with center, zoom, bounds and bbox, once per real change', async () => {
		const mock = installGoogleMapsMock()
		const first = vi.fn()
		const second = vi.fn()
		const { rerender } = render(<GoogleMap defaultCenter={center} defaultZoom={5} onChange={first} />)
		await flush()
		rerender(<GoogleMap defaultCenter={center} defaultZoom={5} onChange={second} />)
		const map = mock.maps[0]!

		map.simulateMove({ lat: 10, lng: 20 }, 10)
		map.simulateMove({ lat: 10, lng: 20 }, 10)

		expect(first).not.toHaveBeenCalled()
		expect(second).toHaveBeenCalledTimes(1)
		expect(second).toHaveBeenCalledWith(
			expect.objectContaining({ map, zoom: 10, center: { lat: 10, lng: 20 }, bbox: [19, 9, 21, 11] }),
		)
	})

	it('forwards map events to props, with the latest handler', async () => {
		const mock = installGoogleMapsMock()
		const first = vi.fn()
		const second = vi.fn()
		const { rerender } = render(<GoogleMap defaultCenter={center} defaultZoom={5} onClick={first} />)
		await flush()
		rerender(<GoogleMap defaultCenter={center} defaultZoom={5} onClick={second} />)
		const map = mock.maps[0]!
		const event = { latLng: null }
		mock.event.trigger(map, 'click', event)
		expect(first).not.toHaveBeenCalled()
		expect(second).toHaveBeenCalledWith(event, map)
	})

	it('moves the map when controlled center and zoom change', async () => {
		const mock = installGoogleMapsMock()
		const { rerender } = render(<GoogleMap center={center} zoom={5} />)
		await flush()
		const map = mock.maps[0]!
		rerender(<GoogleMap center={{ lat: 1, lng: 2 }} zoom={8} />)
		expect(map.setCenter).toHaveBeenCalledWith({ lat: 1, lng: 2 })
		expect(map.setZoom).toHaveBeenCalledWith(8)
		// A new object with the same values does nothing.
		rerender(<GoogleMap center={{ lat: 1, lng: 2 }} zoom={8} />)
		expect(map.setCenter).toHaveBeenCalledTimes(1)
	})

	it('creates a new map when mapId changes', async () => {
		const mock = installGoogleMapsMock()
		const { rerender } = render(<GoogleMap defaultCenter={center} defaultZoom={5} mapId="a" />)
		await flush()
		rerender(<GoogleMap defaultCenter={center} defaultZoom={5} mapId="b" />)
		await flush()
		expect(mock.maps.map((map) => map.options.mapId)).toEqual(['a', 'b'])
	})

	it('forwards ref, className, id and style to the container', async () => {
		installGoogleMapsMock()
		let element: HTMLDivElement | null = null
		render(
			<GoogleMap
				ref={(node) => {
					element = node
				}}
				id="map"
				className="my-map"
				style={{ height: 400 }}
			/>,
		)
		expect(element).toBe(document.getElementById('map'))
		expect(element!.className).toBe('my-map')
		expect(element!.style.height).toBe('400px')
		expect(element!.style.position).toBe('relative')
	})
})
