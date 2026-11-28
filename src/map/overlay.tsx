import { Drag, Pane, createOverlayProps } from '../utils/types'

// return lat, lng from LatLngLiteral
const getLatLng = (LatLng: google.maps.LatLng | null) => {
	try {
		const latLng = { lat: LatLng?.lat(), lng: LatLng?.lng() } as google.maps.LatLngLiteral
		return latLng
	} catch (e) {
		return LatLng
	}
}

/**
 * While a marker is dragged the map must not pan. Several markers can be dragged at once (multi touch),
 * so the map is locked by the first drag and gets back its own `draggable` option when the last one ends.
 */
const mapLocks = new WeakMap<google.maps.Map, { count: number; mapDraggable: unknown }>()

const lockMap = (map: google.maps.Map) => {
	const lock = mapLocks.get(map) ?? { count: 0, mapDraggable: map.get('draggable') }
	lock.count++
	mapLocks.set(map, lock)
	map.set('draggable', false)
}

const unlockMap = (map: google.maps.Map) => {
	const lock = mapLocks.get(map)
	if (!lock) return
	lock.count--
	if (lock.count > 0) return
	mapLocks.delete(map)
	map.set('draggable', lock.mapDraggable !== false)
}

interface ActiveDrag {
	/** The map being dragged on, kept so the drag can be undone even after the overlay is removed. */
	map: google.maps.Map | null
	pointerId: number
	x: number
	y: number
}

// Capture phase on window: the drag follows the pointer outside the marker and the map,
// even if something on the way stops the event from bubbling.
const windowListenerOptions = { capture: true }

const createOverlay = ({ container, pane, position, maps, drag }: createOverlayProps) => {
	class Overlay extends google.maps.OverlayView {
		/**
		 * onAdd is called when the map's panes are ready and the overlay has been
		 * added to the map.
		 */
		onAdd = () => {
			// The listeners are removed in onRemove, so adding the overlay again never stacks them.
			this.container.addEventListener('pointerdown', this.handlePointerDown)
			this.container.addEventListener('dragstart', this.handleNativeDragStart)

			// Add the element to the pane.
			const currentPane = this.getPanes()?.[this.pane] as HTMLElement
			currentPane?.classList.add('google-map-markers-overlay')
			currentPane?.appendChild(this.container)
		}

		draw = () => {
			if (!this.container) return
			// We use the south-west and north-east points of the overlay to peg it to the correct position and size.
			// To do this, we need to retrieve the projection from the overlay.
			const overlayProjection = this.getProjection() as google.maps.MapCanvasProjection
			// Computes the pixel coordinates of the given geographical location in the DOM element that holds the draggable map.
			const point = overlayProjection?.fromLatLngToDivPixel(this.position) as google.maps.Point

			// Manage offset for the overlay, since the overlay is centered on the point
			// we need to offset the overlay by half of its width and height
			// to make the overlay appear where the point is
			const offset = { x: this.container.offsetWidth / 2, y: this.container.offsetHeight / 2 }

			// Hide the overlay if it is outside the map
			if (!point) return

			// Set the overlay's position
			this.container.style.transform = `translate(${point.x - offset.x}px, ${point.y - offset.y}px)`
		}

		/**
		 * The onRemove() method will be called automatically from the API if
		 * we ever set the overlay's map property to 'null'.
		 */
		onRemove = () => {
			this.cancelDrag()
			this.container.removeEventListener('pointerdown', this.handlePointerDown)
			this.container.removeEventListener('dragstart', this.handleNativeDragStart)
			if (this.container.parentNode !== null) {
				this.container.parentNode.removeChild(this.container)
			}
		}

		/** Moves the overlay to a new position, without recreating it. */
		setPosition = (next: google.maps.LatLng) => {
			this.position = next
			this.draw()
		}

		/** Updates the drag configuration, so the handlers always call the latest callbacks. */
		setDrag = (next?: Drag) => {
			this.drag = next
			const draggable = !!next?.draggable
			// Touch: stop the browser from scrolling or zooming the page while the marker is dragged.
			this.container.style.touchAction = draggable ? 'none' : ''
			this.container.style.userSelect = draggable ? 'none' : ''
			if (!draggable) this.cancelDrag()
		}

		public handlePointerDown = (e: PointerEvent) => {
			if (!this.drag?.draggable || this.activeDrag) return
			// Only the main mouse button starts a drag, touch and pen always do.
			if (e.pointerType === 'mouse' && e.button !== 0) return

			const map = (this.getMap() as google.maps.Map | null) ?? null
			this.activeDrag = { map, pointerId: e.pointerId, x: e.clientX, y: e.clientY }
			// Listen on window instead of capturing the pointer: the drag ends on release anywhere,
			// and a click on the marker's content still reaches its own element.
			window.addEventListener('pointermove', this.handlePointerMove, windowListenerOptions)
			window.addEventListener('pointerup', this.handlePointerUp, windowListenerOptions)
			window.addEventListener('pointercancel', this.handlePointerUp, windowListenerOptions)
			this.container.style.cursor = 'grabbing'
			if (map) lockMap(map)

			this.drag.onDragStart(e, { latLng: getLatLng(this.position) })
		}

		public handlePointerMove = (e: PointerEvent) => {
			const active = this.activeDrag
			if (!active || e.pointerId !== active.pointerId) return

			const projection = this.getProjection()
			const pos = projection?.fromLatLngToDivPixel(this.position)
			if (!projection || !pos) return
			const latLng = projection.fromDivPixelToLatLng(
				new maps.Point(pos.x + e.clientX - active.x, pos.y + e.clientY - active.y),
			)
			if (!latLng) return

			active.x = e.clientX
			active.y = e.clientY
			this.position = latLng
			this.draw()
			this.drag?.onDrag(e, { latLng: getLatLng(latLng) })
		}

		public handlePointerUp = (e: PointerEvent) => {
			const active = this.activeDrag
			if (!active || e.pointerId !== active.pointerId) return

			this.cancelDrag()
			this.drag?.onDragEnd(e, { latLng: getLatLng(this.position) })
		}

		// Stop the browser's native drag and drop (for example on an `img`), which would cancel the pointer events.
		public handleNativeDragStart = (e: DragEvent) => {
			if (this.drag?.draggable) e.preventDefault()
		}

		/** Ends the current drag, if any, without calling onDragEnd. */
		public cancelDrag = () => {
			const active = this.activeDrag
			if (!active) return
			this.activeDrag = null
			window.removeEventListener('pointermove', this.handlePointerMove, windowListenerOptions)
			window.removeEventListener('pointerup', this.handlePointerUp, windowListenerOptions)
			window.removeEventListener('pointercancel', this.handlePointerUp, windowListenerOptions)
			this.container.style.cursor = ''
			if (active.map) unlockMap(active.map)
		}

		public container: HTMLDivElement

		public pane: Pane

		public position: google.maps.LatLng

		public drag?: Drag

		public activeDrag: ActiveDrag | null = null

		// eslint-disable-next-line no-shadow
		constructor(container: HTMLDivElement, pane: Pane, position: google.maps.LatLng, drag?: Drag) {
			super()

			// Initialize all properties.
			this.container = container
			this.pane = pane
			this.position = position
			this.setDrag(drag)
		}
	}

	return new Overlay(container, pane, position, drag)
}

export default createOverlay
