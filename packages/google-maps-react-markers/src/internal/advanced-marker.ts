import type { AnchorPoint } from './anchor'
import { toLatLngLiteral } from './geometry'
import type { MarkerHandle, MarkerInit } from './marker-handle'

/** A marker backed by `google.maps.marker.AdvancedMarkerElement`. Needs a map with a `mapId`. */
export const createAdvancedMarker = ({ map, container, getHandlers }: MarkerInit): MarkerHandle => {
	const marker = new google.maps.marker.AdvancedMarkerElement()
	// Older API versions have no anchorLeft/anchorTop: fall back to a transform on the content.
	const supportsAnchor = 'anchorLeft' in marker
	marker.append(container)

	// Drag events go through addListener: their MapMouseEvent carries the live position,
	// while marker.position only updates when the drag ends.
	const dragData = (event: google.maps.MapMouseEvent) => ({
		latLng: toLatLngLiteral(event.latLng) ?? toLatLngLiteral(marker.position) ?? { lat: 0, lng: 0 },
	})
	const onClick = (event: Event) => getHandlers().onClick?.(event)
	const dragListeners = (
		[
			['dragstart', 'onDragStart'],
			['drag', 'onDrag'],
			['dragend', 'onDragEnd'],
		] as const
	).map(([name, handler]) =>
		marker.addListener(name, (event: google.maps.MapMouseEvent) =>
			getHandlers()[handler]?.(event.domEvent as Event, dragData(event)),
		),
	)

	marker.addEventListener('gmp-click', onClick)
	marker.map = map

	return {
		setPosition: (position) => {
			marker.position = position
		},
		setAnchor: ({ x, y }: AnchorPoint) => {
			if (supportsAnchor) {
				marker.anchorLeft = `${-x * 100}%`
				marker.anchorTop = `${-y * 100}%`
			} else {
				// The default anchor is bottom center.
				container.style.transform = `translate(${(0.5 - x) * 100}%, ${(1 - y) * 100}%)`
			}
		},
		setClassName: (className) => {
			container.className = className ?? ''
		},
		setZIndex: (zIndex) => {
			marker.zIndex = zIndex ?? null
		},
		setDraggable: (draggable) => {
			marker.gmpDraggable = draggable
		},
		setTitle: (title) => {
			marker.title = title ?? ''
		},
		setClickable: (clickable) => {
			marker.gmpClickable = clickable
		},
		setCollisionBehavior: (behavior) => {
			marker.collisionBehavior = behavior ?? null
		},
		destroy: () => {
			marker.removeEventListener('gmp-click', onClick)
			for (const listener of dragListeners) listener.remove()
			marker.map = null
			marker.remove()
		},
	}
}
