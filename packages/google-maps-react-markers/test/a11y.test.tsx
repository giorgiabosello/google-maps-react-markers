import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { GoogleMap, Marker, type MarkerProps } from '../src'
import { DRAG_HELP } from '../src/internal/a11y'
import { installGoogleMapsMock } from './google-maps-mock'
import { flush } from './utils'

const center = { lat: 0, lng: 0 }

const renderOverlayMarker = async (props: Partial<MarkerProps> = {}, content: ReactNode = <span>Pin</span>) => {
	const mock = installGoogleMapsMock()
	const ui = (next: Partial<MarkerProps>, children: ReactNode) => (
		<GoogleMap defaultCenter={center} defaultZoom={5}>
			<Marker lat={10} lng={20} {...next}>
				{children}
			</Marker>
		</GoogleMap>
	)
	const result = render(ui(props, content))
	await flush()
	expect(mock.overlays).toHaveLength(1)
	const marker = document.querySelector<HTMLElement>('[data-gmrm-marker]')!
	return {
		mock,
		marker,
		rerender: (next: Partial<MarkerProps>, children: ReactNode = content) => result.rerender(ui(next, children)),
	}
}

const key = (target: Element, type: 'keydown' | 'keyup', init: KeyboardEventInit) => {
	const event = new KeyboardEvent(type, { bubbles: true, cancelable: true, ...init })
	target.dispatchEvent(event)
	return event
}

describe('overlay marker accessibility', () => {
	it('stays a plain element when it is not interactive', async () => {
		const { marker } = await renderOverlayMarker()
		expect(marker.getAttribute('role')).toBeNull()
		expect(marker.getAttribute('tabindex')).toBeNull()
	})

	it('is a named group when it only has a title', async () => {
		const { marker } = await renderOverlayMarker({ title: 'Venice' })
		expect(marker.getAttribute('role')).toBe('group')
		expect(marker.getAttribute('aria-label')).toBe('Venice')
		expect(marker.getAttribute('tabindex')).toBeNull()
	})

	it('is a focusable button when clickable, and clicks with Enter and Space', async () => {
		const onClick = vi.fn()
		const { marker } = await renderOverlayMarker({ title: 'Venice, €120', onClick })
		expect(marker.getAttribute('role')).toBe('button')
		expect(marker.getAttribute('tabindex')).toBe('0')
		expect(marker.getAttribute('aria-label')).toBe('Venice, €120')

		const enter = key(marker, 'keydown', { key: 'Enter' })
		expect(enter.defaultPrevented).toBe(true)
		expect(onClick).toHaveBeenCalledTimes(1)

		// Space clicks on release, like a native button, and never scrolls the page.
		const space = key(marker, 'keydown', { key: ' ' })
		expect(space.defaultPrevented).toBe(true)
		expect(onClick).toHaveBeenCalledTimes(1)
		key(marker, 'keyup', { key: ' ' })
		expect(onClick).toHaveBeenCalledTimes(2)
	})

	it('leaves the focus to a button inside the content, without nesting buttons', async () => {
		const onClick = vi.fn()
		const { marker, rerender } = await renderOverlayMarker(
			{ title: 'Venice', onClick },
			<button type="button">Venice</button>,
		)
		expect(marker.getAttribute('role')).toBe('group')
		expect(marker.getAttribute('tabindex')).toBeNull()
		// Keys on the inner button belong to the button.
		key(screen.getByRole('button', { name: 'Venice' }), 'keydown', { key: 'Enter' })
		expect(onClick).not.toHaveBeenCalled()

		// Content changes are noticed: without the inner button the marker is a button again.
		rerender({ title: 'Venice', onClick }, <span>Venice</span>)
		await flush()
		expect(marker.getAttribute('role')).toBe('button')
		expect(marker.getAttribute('tabindex')).toBe('0')
	})

	it('describes the keyboard drag for draggable markers', async () => {
		const { marker } = await renderOverlayMarker({ title: 'Drag me', draggable: true })
		expect(marker.getAttribute('role')).toBe('button')
		expect(marker.getAttribute('aria-roledescription')).toBe('draggable marker')
		const help = document.getElementById(marker.getAttribute('aria-describedby')!)
		expect(help?.textContent).toBe(DRAG_HELP)
	})

	it('drags with Alt + Enter, the arrow keys and Enter', async () => {
		try {
			const onDragStart = vi.fn()
			const onDrag = vi.fn()
			const onDragEnd = vi.fn()
			const { marker, mock } = await renderOverlayMarker({
				title: 'Drag me',
				draggable: true,
				onDragStart,
				onDrag,
				onDragEnd,
			})
			vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
			const mapKeys = vi.fn()
			mock.maps[0]!.div.addEventListener('keydown', mapKeys)

			key(marker, 'keydown', { key: 'Enter', altKey: true })
			expect(onDragStart).toHaveBeenCalledWith(expect.any(KeyboardEvent), { latLng: { lat: 10, lng: 20 } })
			vi.advanceTimersByTime(100)
			expect(document.querySelector('[role="status"]')?.textContent).toMatch(/grabbed/)

			// 10px per press: one degree with the mock projection. Shift moves five times further.
			key(marker, 'keydown', { key: 'ArrowRight' })
			expect(onDrag).toHaveBeenLastCalledWith(expect.any(KeyboardEvent), { latLng: { lat: 10, lng: 21 } })
			key(marker, 'keydown', { key: 'ArrowUp', shiftKey: true })
			expect(onDrag).toHaveBeenLastCalledWith(expect.any(KeyboardEvent), { latLng: { lat: 15, lng: 21 } })
			// The map does not pan with the marker's arrow keys.
			expect(mapKeys).not.toHaveBeenCalled()

			key(marker, 'keydown', { key: 'Enter' })
			expect(onDragEnd).toHaveBeenCalledWith(expect.any(KeyboardEvent), { latLng: { lat: 15, lng: 21 } })
			vi.advanceTimersByTime(100)
			expect(document.querySelector('[role="status"]')?.textContent).toBe('Marker dropped.')
		} finally {
			vi.useRealTimers()
		}
	})

	it('cancels a keyboard drag with Escape and drops it on blur', async () => {
		const onDragEnd = vi.fn()
		const { marker } = await renderOverlayMarker({ title: 'Drag me', draggable: true, onDragEnd })

		key(marker, 'keydown', { key: 'Enter', altKey: true })
		key(marker, 'keydown', { key: 'ArrowLeft' })
		key(marker, 'keydown', { key: 'Escape' })
		expect(onDragEnd).toHaveBeenLastCalledWith(expect.any(KeyboardEvent), { latLng: { lat: 10, lng: 20 } })

		key(marker, 'keydown', { key: 'Enter', altKey: true })
		key(marker, 'keydown', { key: 'ArrowDown' })
		marker.dispatchEvent(new FocusEvent('blur'))
		expect(onDragEnd).toHaveBeenLastCalledWith(expect.any(FocusEvent), { latLng: { lat: 9, lng: 20 } })
	})

	it('adds a focus ring that any class can override', async () => {
		await renderOverlayMarker({ title: 'Venice', onClick: () => {} })
		expect(document.getElementById('gmrm-styles')?.textContent).toContain(
			':where([data-gmrm-marker][tabindex]):focus-visible',
		)
	})

	it('warns in development when an interactive marker has no title', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		vi.resetModules()
		const fresh = await import('../src')
		const mock = installGoogleMapsMock()
		render(
			<fresh.GoogleMap defaultCenter={center} defaultZoom={5}>
				<fresh.Marker lat={1} lng={1} onClick={() => {}}>
					<span>Pin</span>
				</fresh.Marker>
			</fresh.GoogleMap>,
		)
		await flush()
		expect(mock.overlays).toHaveLength(1)
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('has no `title`'))
	})
})

describe('<GoogleMap> accessibility', () => {
	it('is aria-busy while loading, then not', async () => {
		installGoogleMapsMock()
		const { container } = render(<GoogleMap defaultCenter={center} defaultZoom={5} loadingContent="Loading map" />)
		const root = container.firstElementChild!
		expect(root.getAttribute('aria-busy')).toBe('true')
		await flush()
		expect(root.getAttribute('aria-busy')).toBeNull()
		expect(screen.queryByText('Loading map')).toBeNull()
	})

	it('announces errorContent as an alert', async () => {
		const mock = installGoogleMapsMock()
		mock.importLibrary.mockRejectedValue(new Error('offline'))
		const { container } = render(
			<GoogleMap defaultCenter={center} defaultZoom={5} errorContent="The map could not load" />,
		)
		await flush()
		expect(screen.getByRole('alert').textContent).toBe('The map could not load')
		expect(container.firstElementChild!.getAttribute('aria-busy')).toBeNull()
	})
})
