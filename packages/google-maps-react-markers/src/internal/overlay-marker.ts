import type { LatLngLiteral } from '../types'
import { announce, dragHelpId, ensureMarkerStyles } from './a11y'
import type { AnchorPoint } from './anchor'
import type { MarkerHandle, MarkerInit } from './marker-handle'

interface DragState {
	moved: boolean
	originX: number
	originY: number
	pointerId: number
	startX: number
	startY: number
}

/** Pixels per arrow key press during a keyboard drag; Shift moves five times further. */
const KEYBOARD_STEP = 10

const ARROWS: Record<string, [number, number]> = {
	ArrowUp: [0, -1],
	ArrowDown: [0, 1],
	ArrowLeft: [-1, 0],
	ArrowRight: [1, 0],
}

const FOCUSABLE =
	'a[href],button,input,select,textarea,summary,iframe,[contenteditable=""],[contenteditable="true"],[tabindex]:not([tabindex="-1"])'

type OverlayMarkerClass = new (init: MarkerInit) => MarkerHandle

let OverlayMarker: OverlayMarkerClass | null = null
let OverlayBase: typeof google.maps.OverlayView | null = null

/**
 * `google.maps.OverlayView` only exists once the API is loaded, so the class is created lazily.
 * One instance per marker, created once: props changes go through the setters.
 */
const getOverlayMarkerClass = (): OverlayMarkerClass => {
	// Re-create the class if the API was reloaded (tests, hot reload).
	if (OverlayMarker && OverlayBase === google.maps.OverlayView) return OverlayMarker

	class GoogleMapsReactOverlayMarker extends google.maps.OverlayView implements MarkerHandle {
		private readonly container: HTMLDivElement
		private readonly getHandlers: MarkerInit['getHandlers']
		private position: LatLngLiteral = { lat: 0, lng: 0 }
		private anchor: AnchorPoint = { x: 0.5, y: 0.5 }
		private draggable = false
		private drag: DragState | null = null
		/** Position before a keyboard drag, restored by Escape. */
		private keyboardDrag: LatLngLiteral | null = null
		private suppressClick = false
		private clickable = false
		private title: string | undefined
		/** Watches the content of interactive markers for focusable elements of their own. */
		private contentObserver: MutationObserver | null = null

		constructor({ map, container, getHandlers }: MarkerInit) {
			super()
			this.container = container
			this.getHandlers = getHandlers

			container.style.position = 'absolute'
			container.style.left = '0'
			container.style.top = '0'
			// Clicks on a marker must not also fire the map's click.
			google.maps.OverlayView.preventMapHitsFrom(container)

			container.addEventListener('pointerdown', this.handlePointerDown)
			container.addEventListener('pointermove', this.handlePointerMove)
			container.addEventListener('pointerup', this.handlePointerUp)
			container.addEventListener('pointercancel', this.handlePointerUp)
			// Capture phase, so a click that ends a drag never reaches the marker content.
			container.addEventListener('click', this.handleClick, true)
			// The map starts panning on mousedown/touchstart: stop them while the marker is draggable.
			container.addEventListener('mousedown', this.stopWhileDraggable)
			container.addEventListener('touchstart', this.stopWhileDraggable, { passive: true })
			container.addEventListener('keydown', this.handleKeyDown)
			container.addEventListener('keyup', this.handleKeyUp)
			container.addEventListener('blur', this.handleBlur)
			ensureMarkerStyles()

			this.setMap(map)
		}

		override onAdd() {
			this.getPanes()?.overlayMouseTarget.appendChild(this.container)
		}

		override draw() {
			const point = this.getProjection()?.fromLatLngToDivPixel(this.position)
			if (!point) return
			// Percent translate anchors the marker on its own size, without measuring the DOM.
			// Rounded pixels keep text sharp.
			this.container.style.transform = `translate(${Math.round(point.x)}px, ${Math.round(point.y)}px) translate(${
				-this.anchor.x * 100
			}%, ${-this.anchor.y * 100}%)`
		}

		override onRemove() {
			this.container.remove()
		}

		setPosition(position: LatLngLiteral) {
			if (this.drag || this.keyboardDrag) return
			this.position = position
			this.draw()
		}

		setAnchor(anchor: AnchorPoint) {
			this.anchor = anchor
			this.draw()
		}

		setClassName(className: string | undefined) {
			this.container.className = className ?? ''
		}

		setZIndex(zIndex: number | undefined) {
			this.container.style.zIndex = zIndex === undefined ? '' : String(zIndex)
		}

		setDraggable(draggable: boolean) {
			this.draggable = draggable
			this.container.style.cursor = draggable ? 'grab' : ''
			this.container.style.touchAction = draggable ? 'none' : ''
			this.container.style.userSelect = draggable ? 'none' : ''
			if (!draggable && this.keyboardDrag) this.endKeyboardDrag(new KeyboardEvent('keydown'), false)
			this.updateAccessibility()
		}

		setTitle(title: string | undefined) {
			this.title = title
			if (title) this.container.title = title
			else this.container.removeAttribute('title')
			this.updateAccessibility()
		}

		setClickable(clickable: boolean) {
			// Mouse clicks always reach the content; this decides keyboard access and the role.
			this.clickable = clickable
			this.updateAccessibility()
		}

		/**
		 * Clickable or draggable markers are buttons in the tab order, named by `title`, like
		 * Google's advanced markers. Other markers with a title are named groups; the rest stay plain.
		 */
		private updateAccessibility() {
			const { container, title } = this
			const watch = this.clickable || this.draggable
			if (watch && !this.contentObserver && typeof MutationObserver !== 'undefined') {
				this.contentObserver = new MutationObserver(() => this.updateAccessibility())
				this.contentObserver.observe(container, { childList: true, subtree: true })
			} else if (!watch && this.contentObserver) {
				this.contentObserver.disconnect()
				this.contentObserver = null
			}
			// Content with its own button or link handles the keyboard: a button around it would nest
			// interactive elements. Dragging still needs the marker itself in the tab order.
			const interactive = this.draggable || (this.clickable && !container.querySelector(FOCUSABLE))
			const set = (name: string, value: string | null) => {
				if (value === null) container.removeAttribute(name)
				else container.setAttribute(name, value)
			}
			set('role', interactive ? 'button' : title ? 'group' : null)
			set('tabindex', interactive ? '0' : null)
			set('aria-label', title ?? null)
			set('aria-describedby', this.draggable ? dragHelpId() : null)
			set('aria-roledescription', this.draggable ? 'draggable marker' : null)
		}

		setCollisionBehavior() {
			// Only advanced markers support collision behavior.
		}

		destroy() {
			const { container } = this
			container.removeEventListener('pointerdown', this.handlePointerDown)
			container.removeEventListener('pointermove', this.handlePointerMove)
			container.removeEventListener('pointerup', this.handlePointerUp)
			container.removeEventListener('pointercancel', this.handlePointerUp)
			container.removeEventListener('click', this.handleClick, true)
			container.removeEventListener('mousedown', this.stopWhileDraggable)
			container.removeEventListener('touchstart', this.stopWhileDraggable)
			container.removeEventListener('keydown', this.handleKeyDown)
			container.removeEventListener('keyup', this.handleKeyUp)
			container.removeEventListener('blur', this.handleBlur)
			this.contentObserver?.disconnect()
			this.contentObserver = null
			this.setMap(null)
		}

		private readonly stopWhileDraggable = (event: Event) => {
			if (this.draggable) event.stopPropagation()
		}

		private readonly handlePointerDown = (event: PointerEvent) => {
			this.suppressClick = false
			if (!this.draggable || event.button !== 0) return
			const origin = this.getProjection()?.fromLatLngToDivPixel(this.position)
			if (!origin) return
			event.stopPropagation()
			this.container.setPointerCapture?.(event.pointerId)
			this.drag = {
				pointerId: event.pointerId,
				startX: event.clientX,
				startY: event.clientY,
				originX: origin.x,
				originY: origin.y,
				moved: false,
			}
		}

		private readonly handlePointerMove = (event: PointerEvent) => {
			const { drag } = this
			if (!drag || event.pointerId !== drag.pointerId) return
			const dx = event.clientX - drag.startX
			const dy = event.clientY - drag.startY
			if (!drag.moved) {
				// A few pixels of tolerance, so a plain click is not a drag.
				if (Math.hypot(dx, dy) < 3) return
				drag.moved = true
				this.container.style.cursor = 'grabbing'
				this.getHandlers().onDragStart?.(event, { latLng: this.position })
			}
			const latLng = this.getProjection()?.fromDivPixelToLatLng(
				new google.maps.Point(drag.originX + dx, drag.originY + dy),
			)
			if (!latLng) return
			this.position = { lat: latLng.lat(), lng: latLng.lng() }
			this.draw()
			this.getHandlers().onDrag?.(event, { latLng: this.position })
		}

		private readonly handlePointerUp = (event: PointerEvent) => {
			const { drag } = this
			if (!drag || event.pointerId !== drag.pointerId) return
			this.drag = null
			if (this.container.hasPointerCapture?.(event.pointerId)) this.container.releasePointerCapture(event.pointerId)
			if (!drag.moved) return
			this.container.style.cursor = this.draggable ? 'grab' : ''
			// The click that ends a mouse drag arrives in this same task; touch drags fire none.
			this.suppressClick = true
			setTimeout(() => {
				this.suppressClick = false
			}, 0)
			this.getHandlers().onDragEnd?.(event, { latLng: this.position })
		}

		/** Keys only act on the marker itself: buttons or inputs inside the content keep their own. */
		private readonly handleKeyDown = (event: KeyboardEvent) => {
			if (event.target !== this.container) return
			const handled = () => {
				event.preventDefault()
				// The map pans on arrow keys: keep them for the marker.
				event.stopPropagation()
			}

			if (this.keyboardDrag) {
				const arrow = ARROWS[event.key]
				if (arrow) {
					handled()
					this.moveBy(
						arrow[0] * KEYBOARD_STEP * (event.shiftKey ? 5 : 1),
						arrow[1] * KEYBOARD_STEP * (event.shiftKey ? 5 : 1),
						event,
					)
				} else if (event.key === 'Enter' || event.key === ' ') {
					handled()
					this.endKeyboardDrag(event, true)
				} else if (event.key === 'Escape') {
					handled()
					this.endKeyboardDrag(event, false)
				}
				return
			}

			if (event.key === 'Enter' && event.altKey && this.draggable) {
				handled()
				this.keyboardDrag = this.position
				this.container.style.cursor = 'grabbing'
				this.getHandlers().onDragStart?.(event, { latLng: this.position })
				announce('Marker grabbed. Use the arrow keys to move it, Enter to drop, Escape to cancel.')
				return
			}
			if (!this.clickable) return
			if (event.key === 'Enter') {
				handled()
				this.getHandlers().onClick?.(event)
			} else if (event.key === ' ') {
				// Like a native button: Space clicks on release, and must not scroll the page.
				handled()
			}
		}

		private readonly handleKeyUp = (event: KeyboardEvent) => {
			if (event.target !== this.container || event.key !== ' ' || this.keyboardDrag || !this.clickable) return
			event.preventDefault()
			this.getHandlers().onClick?.(event)
		}

		/** Leaving the marker with Tab drops it where it is. */
		private readonly handleBlur = (event: FocusEvent) => {
			if (this.keyboardDrag) this.endKeyboardDrag(event, true)
		}

		private moveBy(dx: number, dy: number, event: Event) {
			const projection = this.getProjection()
			const origin = projection?.fromLatLngToDivPixel(this.position)
			if (!projection || !origin) return
			const latLng = projection.fromDivPixelToLatLng(new google.maps.Point(origin.x + dx, origin.y + dy))
			if (!latLng) return
			this.position = { lat: latLng.lat(), lng: latLng.lng() }
			this.draw()
			this.getHandlers().onDrag?.(event, { latLng: this.position })
		}

		private endKeyboardDrag(event: Event, drop: boolean) {
			const start = this.keyboardDrag
			if (!start) return
			this.keyboardDrag = null
			this.container.style.cursor = this.draggable ? 'grab' : ''
			if (!drop) {
				this.position = start
				this.draw()
			}
			this.getHandlers().onDragEnd?.(event, { latLng: this.position })
			announce(drop ? 'Marker dropped.' : 'Drag cancelled.')
		}

		private readonly handleClick = (event: MouseEvent) => {
			if (this.suppressClick) {
				this.suppressClick = false
				event.stopImmediatePropagation()
				return
			}
			this.getHandlers().onClick?.(event)
		}
	}

	OverlayMarker = GoogleMapsReactOverlayMarker
	OverlayBase = google.maps.OverlayView
	return OverlayMarker
}

export const createOverlayMarker = (init: MarkerInit): MarkerHandle => new (getOverlayMarkerClass())(init)
