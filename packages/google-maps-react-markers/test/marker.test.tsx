import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GoogleMap, Marker, type MarkerProps } from '../src'
import { installGoogleMapsMock } from './google-maps-mock'
import { flush } from './utils'

const center = { lat: 0, lng: 0 }

const renderMarker = (
	props: Partial<MarkerProps> = {},
	mapProps: { mapId?: string; markerRenderer?: 'overlay' } = {},
) => {
	const ui = (next: Partial<MarkerProps>) => (
		<GoogleMap defaultCenter={center} defaultZoom={5} {...mapProps}>
			<Marker lat={10} lng={20} {...next}>
				<span>Pin</span>
			</Marker>
		</GoogleMap>
	)
	const result = render(ui(props))
	return { ...result, rerenderMarker: (next: Partial<MarkerProps>) => result.rerender(ui(next)) }
}

const pointer = (type: string, target: Element, init: { clientX: number; clientY: number }) => {
	const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, ...init })
	Object.defineProperty(event, 'pointerId', { value: 1 })
	target.dispatchEvent(event)
}

describe('<Marker> with the overlay renderer (no mapId)', () => {
	it('renders its children in the overlay pane, centered on its coordinates', async () => {
		const mock = installGoogleMapsMock()
		renderMarker()
		await flush()
		const pin = screen.getByText('Pin')
		const container = pin.parentElement!
		expect(container.parentElement?.dataset.pane).toBe('overlayMouseTarget')
		// lat 10, lng 20 → x 200, y -100 in the mock projection.
		expect(container.style.transform).toBe('translate(200px, -100px) translate(-50%, -50%)')
		expect(mock.overlays).toHaveLength(1)
	})

	it('updates position, anchor and zIndex in place, without recreating the overlay', async () => {
		const mock = installGoogleMapsMock()
		const { rerenderMarker } = renderMarker()
		await flush()
		rerenderMarker({ lat: 1, lng: 2, anchor: 'bottom', zIndex: 7 })
		const container = screen.getByText('Pin').parentElement!
		expect(mock.overlays).toHaveLength(1)
		expect(container.style.transform).toBe('translate(20px, -10px) translate(-50%, -100%)')
		expect(container.style.zIndex).toBe('7')
		rerenderMarker({ lat: 1, lng: 2, anchor: { x: 0, y: 0 }, className: 'pin' })
		expect(container.style.transform).toBe('translate(20px, -10px) translate(0%, 0%)')
		expect(container.className).toBe('pin')
	})

	it('drags with pointer events and reports coordinates', async () => {
		installGoogleMapsMock()
		const onDragStart = vi.fn()
		const onDrag = vi.fn()
		const onDragEnd = vi.fn()
		const onClick = vi.fn()
		renderMarker({ draggable: true, onDragStart, onDrag, onDragEnd, onClick })
		await flush()
		const container = screen.getByText('Pin').parentElement!
		expect(container.style.touchAction).toBe('none')

		pointer('pointerdown', container, { clientX: 0, clientY: 0 })
		pointer('pointermove', container, { clientX: 10, clientY: 20 })
		pointer('pointerup', container, { clientX: 10, clientY: 20 })
		fireEvent.click(screen.getByText('Pin'))

		// +10px x → +1° lng, +20px y → -2° lat.
		const latLng = { lat: 8, lng: 21 }
		expect(onDragStart).toHaveBeenCalledWith(expect.anything(), { latLng: { lat: 10, lng: 20 } })
		expect(onDrag).toHaveBeenLastCalledWith(expect.anything(), { latLng })
		expect(onDragEnd).toHaveBeenCalledWith(expect.anything(), { latLng })
		expect(onClick).not.toHaveBeenCalled()
		expect(container.style.transform).toBe('translate(210px, -80px) translate(-50%, -50%)')
	})

	it('treats a press without movement as a click', async () => {
		installGoogleMapsMock()
		const onClick = vi.fn()
		const onDragEnd = vi.fn()
		renderMarker({ draggable: true, onClick, onDragEnd })
		await flush()
		const container = screen.getByText('Pin').parentElement!
		pointer('pointerdown', container, { clientX: 0, clientY: 0 })
		pointer('pointerup', container, { clientX: 1, clientY: 0 })
		fireEvent.click(screen.getByText('Pin'))
		expect(onDragEnd).not.toHaveBeenCalled()
		expect(onClick).toHaveBeenCalledTimes(1)
	})

	it('lets clicks reach elements inside a draggable marker', async () => {
		installGoogleMapsMock()
		const onButtonClick = vi.fn()
		const onClick = vi.fn()
		render(
			<GoogleMap defaultCenter={center} defaultZoom={5}>
				<Marker lat={10} lng={20} draggable onClick={onClick}>
					<button type="button" onClick={onButtonClick}>
						Open
					</button>
				</Marker>
			</GoogleMap>,
		)
		await flush()
		const button = screen.getByText('Open')
		// Pointer capture would send the click to the marker container instead of the button.
		const capture = vi.fn()
		button.parentElement!.setPointerCapture = capture
		pointer('pointerdown', button, { clientX: 0, clientY: 0 })
		pointer('pointerup', button, { clientX: 1, clientY: 0 })
		fireEvent.click(button)
		expect(capture).not.toHaveBeenCalled()
		expect(onButtonClick).toHaveBeenCalledTimes(1)
		expect(onClick).toHaveBeenCalledTimes(1)
	})

	it('follows the pointer outside the marker and swallows the click that ends the drag', async () => {
		installGoogleMapsMock()
		const onDragEnd = vi.fn()
		const onPageClick = vi.fn()
		renderMarker({ draggable: true, onDragEnd })
		await flush()
		const container = screen.getByText('Pin').parentElement!
		document.body.addEventListener('click', onPageClick)

		pointer('pointerdown', container, { clientX: 0, clientY: 0 })
		// Released away from the marker, for example over the map.
		pointer('pointermove', document.body, { clientX: 30, clientY: 0 })
		pointer('pointerup', document.body, { clientX: 30, clientY: 0 })
		fireEvent.click(document.body)
		expect(onDragEnd).toHaveBeenCalledWith(expect.anything(), { latLng: { lat: 10, lng: 23 } })
		expect(onPageClick).not.toHaveBeenCalled()

		// Later clicks are not swallowed, and the drag no longer follows the pointer.
		await flush()
		fireEvent.click(document.body)
		expect(onPageClick).toHaveBeenCalledTimes(1)
		pointer('pointermove', document.body, { clientX: 90, clientY: 0 })
		expect(container.style.transform).toBe('translate(230px, -100px) translate(-50%, -50%)')
		document.body.removeEventListener('click', onPageClick)
	})

	it('stops following the pointer when unmounted mid-drag', async () => {
		installGoogleMapsMock()
		const onDrag = vi.fn()
		const { unmount } = renderMarker({ draggable: true, onDrag })
		await flush()
		pointer('pointerdown', screen.getByText('Pin').parentElement!, { clientX: 0, clientY: 0 })
		unmount()
		pointer('pointermove', document.body, { clientX: 50, clientY: 50 })
		expect(onDrag).not.toHaveBeenCalled()
	})

	it('does not drag when draggable is false', async () => {
		installGoogleMapsMock()
		const onDrag = vi.fn()
		renderMarker({ onDrag })
		await flush()
		const container = screen.getByText('Pin').parentElement!
		pointer('pointerdown', container, { clientX: 0, clientY: 0 })
		pointer('pointermove', container, { clientX: 50, clientY: 50 })
		expect(onDrag).not.toHaveBeenCalled()
	})

	it('removes the overlay on unmount', async () => {
		installGoogleMapsMock()
		const { unmount } = renderMarker()
		await flush()
		const container = screen.getByText('Pin').parentElement!
		unmount()
		expect(container.isConnected).toBe(false)
	})
})

describe('<Marker> with the advanced renderer (mapId)', () => {
	it('uses AdvancedMarkerElement and maps props to it', async () => {
		const mock = installGoogleMapsMock()
		const { rerenderMarker } = renderMarker(
			{ anchor: 'bottom', zIndex: 3, title: 'Shop', draggable: true },
			{ mapId: 'demo' },
		)
		await flush()
		expect(mock.overlays).toHaveLength(0)
		const marker = mock.advancedMarkers[0]
		expect(mock.advancedMarkers).toHaveLength(1)
		expect(marker.contains(screen.getByText('Pin'))).toBe(true)
		expect(marker.position).toEqual({ lat: 10, lng: 20 })
		expect(marker.map).toBe(mock.maps[0])
		expect(marker).toMatchObject({
			anchorLeft: '-50%',
			anchorTop: '-100%',
			zIndex: 3,
			title: 'Shop',
			gmpDraggable: true,
		})

		rerenderMarker({ anchor: 'top-left', onClick: () => {} })
		expect(mock.advancedMarkers).toHaveLength(1)
		expect(marker).toMatchObject({ anchorLeft: '0%', anchorTop: '0%', gmpClickable: true })
	})

	it('forwards native drag and click events', async () => {
		const mock = installGoogleMapsMock()
		const onDragEnd = vi.fn()
		const onClick = vi.fn()
		renderMarker({ draggable: true, onDragEnd, onClick }, { mapId: 'demo' })
		await flush()
		const marker = mock.advancedMarkers[0]
		const domEvent = new Event('pointerup')
		mock.event.trigger(marker, 'dragend', { latLng: new mock.namespace.LatLng(1, 1), domEvent })
		marker.dispatchEvent(new Event('gmp-click'))
		expect(onDragEnd).toHaveBeenCalledWith(domEvent, { latLng: { lat: 1, lng: 1 } })
		expect(onClick).toHaveBeenCalledTimes(1)
	})

	it('can be forced to the overlay renderer', async () => {
		const mock = installGoogleMapsMock()
		renderMarker({}, { mapId: 'demo', markerRenderer: 'overlay' })
		await flush()
		expect(mock.advancedMarkers).toHaveLength(0)
		expect(mock.overlays).toHaveLength(1)
	})
})

describe('<Marker> outside <GoogleMap>', () => {
	it('throws a clear error', () => {
		vi.spyOn(console, 'error').mockImplementation(() => {})
		expect(() => render(<Marker lat={0} lng={0} />)).toThrow('<Marker> must be rendered inside <GoogleMap>')
		vi.restoreAllMocks()
	})
})
