import type { CSSProperties, ReactNode, Ref } from 'react'

export type LatLngLiteral = google.maps.LatLngLiteral

/** Map bounds as `[westLng, southLat, eastLng, northLat]`, ready for supercluster's `getClusters()`. */
export type BBox = [west: number, south: number, east: number, north: number]

/** Loading status of the Google Maps JavaScript API. */
export type GoogleMapsStatus = 'loading' | 'ready' | 'error'

/**
 * How markers are drawn.
 * - `advanced`: `google.maps.marker.AdvancedMarkerElement`. Needs a `mapId`.
 * - `overlay`: a custom `google.maps.OverlayView`. Works without `mapId`, so JSON `styles` keep working.
 * - `auto`: `advanced` when the map has a `mapId`, `overlay` otherwise.
 */
export type MarkerRenderer = 'auto' | 'advanced' | 'overlay'

/** Options for loading the Google Maps JavaScript API. Only the first mounted map applies them. */
export interface GoogleMapsLoaderOptions {
	/** Your Google Maps Platform API key. */
	apiKey?: string
	/**
	 * Optional `auth_referrer_policy` parameter.
	 * @see https://developers.google.com/maps/documentation/javascript/load-maps-js-api#optional_parameters
	 */
	authReferrerPolicy?: string
	/** Optional `channel` parameter, used for usage reports. */
	channel?: string
	/** Language of map labels and controls, for example `'it'`. */
	language?: string
	/**
	 * Extra libraries to load together with the map, for example `['places', 'geometry']`.
	 * You can also load them later with `useMapsLibrary()`.
	 */
	libraries?: (keyof google.maps.ImportLibraryMap)[]
	/** Map IDs to preload. */
	mapIds?: string[]
	/** Region bias, for example `'IT'`. */
	region?: string
	/**
	 * API version: `'weekly'`, `'quarterly'`, `'beta'` or a specific version.
	 * @default 'weekly'
	 */
	version?: string
}

/** Values passed to `onChange` every time the map settles after a pan or a zoom. */
export interface MapChangeEvent {
	/** Bounds as `[westLng, southLat, eastLng, northLat]`. */
	bbox: BBox
	bounds: google.maps.LatLngBounds
	center: LatLngLiteral
	map: google.maps.Map
	zoom: number
}

export interface MapLoadEvent {
	map: google.maps.Map
	/** The `google.maps` namespace. */
	maps: typeof google.maps
}

type MapMouseHandler = (event: google.maps.MapMouseEvent, map: google.maps.Map) => void
type MapHandler = (map: google.maps.Map) => void

/** Google Maps events, exposed as props. Handlers always see your latest props. */
export interface MapEventProps {
	onBoundsChanged?: MapHandler
	onCenterChanged?: MapHandler
	onClick?: MapMouseHandler
	onContextMenu?: MapMouseHandler
	onDoubleClick?: MapMouseHandler
	onDrag?: MapHandler
	onDragEnd?: MapHandler
	onDragStart?: MapHandler
	onHeadingChanged?: MapHandler
	onIdle?: MapHandler
	onMapTypeIdChanged?: MapHandler
	onMouseMove?: MapMouseHandler
	onMouseOut?: MapMouseHandler
	onMouseOver?: MapMouseHandler
	onTilesLoaded?: MapHandler
	onTiltChanged?: MapHandler
	onZoomChanged?: MapHandler
}

export interface GoogleMapProps extends GoogleMapsLoaderOptions, MapEventProps {
	/**
	 * Controlled center. When it changes, the map moves there. Users can still pan:
	 * keep your state in sync with `onChange`.
	 */
	center?: LatLngLiteral
	/** Markers, controls and any component that uses `useMap()`. */
	children?: ReactNode
	/** Class name of the outer container. Give it a height, or the map has none. */
	className?: string
	/** Initial center, when `center` is not set. */
	defaultCenter?: LatLngLiteral
	/** Initial zoom, when `zoom` is not set. */
	defaultZoom?: number
	/**
	 * Rendered when the API fails to load or the API key is rejected.
	 * @default null
	 */
	errorContent?: ReactNode
	/** `id` of the outer container. */
	id?: string
	/**
	 * Rendered while the API is loading, and on the server.
	 * @default null
	 */
	loadingContent?: ReactNode
	/**
	 * Cloud map ID. Enables `AdvancedMarkerElement` markers and cloud-based styling.
	 * Changing it creates a new map.
	 */
	mapId?: string
	/**
	 * How `<Marker>` children are drawn.
	 * @default 'auto'
	 */
	markerRenderer?: MarkerRenderer
	/** Fired every time the map settles (`idle`) with a new center, zoom or bounds. */
	onChange?: (event: MapChangeEvent) => void
	/** Fired once, when the map has been created. */
	onLoad?: (event: MapLoadEvent) => void
	/**
	 * Any `google.maps.MapOptions`. Changes are applied with `map.setOptions()`.
	 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
	 */
	options?: Omit<google.maps.MapOptions, 'center' | 'zoom' | 'mapId'>
	/** Ref to the outer container `div`. */
	ref?: Ref<HTMLDivElement>
	/** Style of the outer container, merged over `{ position: 'relative', width: '100%', height: '100%' }`. */
	style?: CSSProperties
	/** Controlled zoom. Pair it with `onChange`. */
	zoom?: number
}

export type MarkerAnchorPreset =
	'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

/**
 * Which point of the marker sits on its coordinates.
 * A preset, or `{ x, y }` as fractions of the marker size (`{ x: 0.5, y: 1 }` is bottom center).
 */
export type MarkerAnchor = MarkerAnchorPreset | { x: number; y: number }

export type MarkerDragHandler = (event: Event, data: { latLng: LatLngLiteral }) => void

export interface MarkerProps {
	/**
	 * Which point of the marker sits on `lat`/`lng`.
	 * @default 'center'
	 */
	anchor?: MarkerAnchor
	/** Any React content: this is your marker. */
	children?: ReactNode
	/** Class name of the marker container. */
	className?: string
	/**
	 * Collision behavior, `advanced` renderer only.
	 * @see https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.collisionBehavior
	 */
	collisionBehavior?: google.maps.CollisionBehaviorString
	/**
	 * Whether users can drag the marker: with mouse or touch, or from the keyboard
	 * (Alt + Enter, arrow keys, Enter to drop, Escape to cancel) on both renderers.
	 * @default false
	 */
	draggable?: boolean
	lat: number
	lng: number
	/**
	 * Fired on click, and on Enter or Space when the marker has keyboard focus.
	 * A clickable marker becomes a focusable button named by `title`. With the `overlay` renderer,
	 * content that already has its own button or link keeps the focus instead.
	 */
	onClick?: (event: Event) => void
	/** Fired repeatedly while dragging. */
	onDrag?: MarkerDragHandler
	/** Fired when dragging ends. Update your `lat`/`lng` state here. */
	onDragEnd?: MarkerDragHandler
	/** Fired when dragging starts. */
	onDragStart?: MarkerDragHandler
	/**
	 * Accessible name of the marker, read by screen readers and shown as a tooltip.
	 * Give one to every clickable or draggable marker.
	 */
	title?: string
	/** Stacking order. Higher values are drawn on top. */
	zIndex?: number
}

export interface MapControlProps {
	children?: ReactNode
	/** Where to place the control, for example `'TOP_RIGHT'`. */
	position: keyof typeof google.maps.ControlPosition | google.maps.ControlPosition
}
