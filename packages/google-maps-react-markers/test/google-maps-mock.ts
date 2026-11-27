import { vi } from 'vitest'

type Listener = (...args: any[]) => void

const markerState: { instances: any[] } = { instances: [] }

/** Custom elements can be defined only once per document: one class, shared by every mock. */
const getAdvancedMarkerClass = () => {
	const existing = customElements.get('gmp-advanced-marker')
	if (existing) return existing
	class AdvancedMarkerElement extends HTMLElement {
		position: any = null
		zIndex: number | null = null
		gmpDraggable = false
		gmpClickable = false
		collisionBehavior: string | null = null
		anchorLeft = '-50%'
		anchorTop = '-100%'
		private mapValue: any = null
		addListener(name: string, handler: Listener) {
			return (globalThis as any).google.maps.event.addListener(this, name, handler)
		}
		constructor() {
			super()
			markerState.instances.push(this)
		}
		get map() {
			return this.mapValue
		}
		set map(map: any) {
			this.mapValue = map
			if (map) map.panes.markerLayer?.appendChild(this)
			else this.remove()
		}
	}
	customElements.define('gmp-advanced-marker', AdvancedMarkerElement)
	return AdvancedMarkerElement
}

/**
 * A small, behavior-faithful stand-in for the Maps JavaScript API: enough to test
 * map creation, listeners, overlays, advanced markers and controls in jsdom.
 */
export const createGoogleMapsMock = () => {
	const registry = new Map<object, Map<string, Set<Listener>>>()

	const listenersOf = (instance: object, name: string) => {
		let byName = registry.get(instance)
		if (!byName) registry.set(instance, (byName = new Map()))
		let set = byName.get(name)
		if (!set) byName.set(name, (set = new Set()))
		return set
	}

	const event = {
		addListener: vi.fn((instance: object, name: string, handler: Listener) => {
			listenersOf(instance, name).add(handler)
			return { remove: () => listenersOf(instance, name).delete(handler) }
		}),
		trigger: (instance: object, name: string, ...args: any[]) => {
			for (const handler of [...listenersOf(instance, name)]) handler(...args)
		},
		// Records the call but keeps the registry, so leak tests see listeners that were never removed one by one.
		clearInstanceListeners: vi.fn((_instance: object) => {}),
		hasListeners: (instance: object, name: string) => listenersOf(instance, name).size > 0,
	}

	/** Number of live listeners on an instance, for leak checks. */
	const countListeners = (instance: object) =>
		[...(registry.get(instance)?.values() ?? [])].reduce((total, set) => total + set.size, 0)

	class LatLng {
		constructor(
			private readonly latValue: number,
			private readonly lngValue: number,
		) {}
		lat() {
			return this.latValue
		}
		lng() {
			return this.lngValue
		}
		toJSON() {
			return { lat: this.latValue, lng: this.lngValue }
		}
	}

	class LatLngBounds {
		constructor(
			private readonly sw: LatLng,
			private readonly ne: LatLng,
		) {}
		getSouthWest() {
			return this.sw
		}
		getNorthEast() {
			return this.ne
		}
	}

	class Point {
		constructor(
			public x: number,
			public y: number,
		) {}
	}

	class MVCArray<T> {
		private items: T[] = []
		push(item: T) {
			this.items.push(item)
			return this.items.length
		}
		getArray() {
			return this.items
		}
		removeAt(index: number) {
			return this.items.splice(index, 1)[0]
		}
	}

	const ControlPosition = { TOP_LEFT: 1, TOP_CENTER: 2, TOP_RIGHT: 3, BOTTOM_LEFT: 10, BOTTOM_RIGHT: 12 } as const

	const toLiteral = (value: any) =>
		typeof value?.lat === 'function' ? { lat: value.lat(), lng: value.lng() } : { lat: value.lat, lng: value.lng }

	const maps: MockMap[] = []

	class MockMap {
		options: Record<string, any>
		center: { lat: number; lng: number }
		zoom: number
		controls: Record<number, MVCArray<HTMLElement>> = {}
		panes: Record<string, HTMLDivElement>
		setOptions = vi.fn((options: Record<string, any>) => {
			this.options = { ...this.options, ...options }
		})
		setCenter = vi.fn((center: any) => {
			this.center = toLiteral(center)
		})
		setZoom = vi.fn((zoom: number) => {
			this.zoom = zoom
		})

		constructor(
			public div: HTMLElement,
			options: Record<string, any> = {},
		) {
			this.options = options
			this.center = options.center ?? { lat: 0, lng: 0 }
			this.zoom = options.zoom ?? 1
			for (const position of Object.values(ControlPosition)) this.controls[position] = new MVCArray()
			this.panes = Object.fromEntries(
				['floatPane', 'mapPane', 'markerLayer', 'overlayLayer', 'overlayMouseTarget'].map((name) => {
					const pane = document.createElement('div')
					pane.dataset.pane = name
					div.appendChild(pane)
					return [name, pane]
				}),
			)
			maps.push(this)
		}
		get(key: string) {
			return this.options[key]
		}
		getDiv() {
			return this.div
		}
		getCenter() {
			return new LatLng(this.center.lat, this.center.lng)
		}
		getZoom() {
			return this.zoom
		}
		getBounds() {
			const { lat, lng } = this.center
			const span = 10 / this.zoom
			return new LatLngBounds(new LatLng(lat - span, lng - span), new LatLng(lat + span, lng + span))
		}
		addListener(name: string, handler: Listener) {
			return event.addListener(this, name, handler)
		}
		/** Test helper: moves the camera like a user would, then fires idle. */
		simulateMove(center: { lat: number; lng: number }, zoom = this.zoom) {
			this.center = center
			this.zoom = zoom
			event.trigger(this, 'idle')
		}
	}

	/** Simple linear projection: 10px per degree, y grows southwards. */
	const projection = {
		fromLatLngToDivPixel: (latLng: any) => {
			const { lat, lng } = toLiteral(latLng)
			return new Point(lng * 10, -lat * 10)
		},
		fromDivPixelToLatLng: (point: Point) => new LatLng(-point.y / 10, point.x / 10),
	}

	const overlays: OverlayView[] = []

	class OverlayView {
		static preventMapHitsFrom = vi.fn()
		static preventMapHitsAndGesturesFrom = vi.fn()
		map: MockMap | null = null
		constructor() {
			overlays.push(this)
		}
		onAdd() {}
		draw() {}
		onRemove() {}
		setMap(map: MockMap | null) {
			if (this.map) this.onRemove()
			this.map = map
			if (map) {
				this.onAdd()
				this.draw()
			}
		}
		getMap() {
			return this.map
		}
		getPanes() {
			return this.map?.panes ?? null
		}
		getProjection() {
			return this.map ? projection : null
		}
	}

	const advancedMarkers: any[] = []
	markerState.instances = advancedMarkers
	const AdvancedMarker = getAdvancedMarkerClass()

	const libraries: Record<string, any> = {
		core: { LatLng, LatLngBounds, Point, MVCArray, ControlPosition, event },
		maps: { Map: MockMap, OverlayView },
		marker: { AdvancedMarkerElement: AdvancedMarker },
		places: { name: 'places' },
		geometry: { name: 'geometry' },
	}

	const importLibrary = vi.fn(async (name: string) => {
		const library = libraries[name]
		if (!library) throw new Error(`Unknown library ${name}`)
		return library
	})

	const namespace = {
		importLibrary,
		event,
		LatLng,
		LatLngBounds,
		Point,
		MVCArray,
		ControlPosition,
		Map: MockMap,
		OverlayView,
		marker: { AdvancedMarkerElement: AdvancedMarker },
	}

	return { namespace, importLibrary, maps, overlays, advancedMarkers, event, countListeners }
}

export type GoogleMapsMock = ReturnType<typeof createGoogleMapsMock>

export const installGoogleMapsMock = (): GoogleMapsMock => {
	const mock = createGoogleMapsMock()
	const google = { maps: mock.namespace }
	;(window as any).google = google
	;(globalThis as any).google = google
	return mock
}

export const uninstallGoogleMapsMock = () => {
	if (typeof window === 'undefined') return
	delete (window as any).google
	delete (globalThis as any).google
	delete (window as any).gm_authFailure
}
