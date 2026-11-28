import React from 'react'

declare global {
	interface Window {
		google?: any
		googleMapsCallback?: () => void
	}
}

export type MapMouseEvent = google.maps.MapMouseEvent
export type Map = google.maps.Map
export type MapsLibrary = typeof google.maps
export type MapPanes = google.maps.MapPanes
export type MapOptions = google.maps.MapOptions
export type LatLng = google.maps.LatLng
export type LatLngLiteral = google.maps.LatLngLiteral
export type LatLngBounds = google.maps.LatLngBounds
export type LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral

/** Map bounds as `[westLng, southLat, eastLng, northLat]`, ready for supercluster's `getClusters()`. */
export type BBox = [west: number, south: number, east: number, north: number]

export type MarkerAnchorPreset =
	| 'center'
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'

/**
 * Which point of the marker sits on its coordinates.
 * A preset, or `{ x, y }` as fractions of the marker size (`{ x: 0.5, y: 1 }` is bottom center).
 */
export type MarkerAnchor = MarkerAnchorPreset | { x: number; y: number }

/** Drag callback of a marker. The event is a `PointerEvent`. */
export type MarkerDragHandler = (event: MouseEvent, data: { latLng: LatLngLiteral }) => void

/**
 * The props read from every child of `GoogleMap` that has `lat` and `lng`.
 * Extend it in your own marker component, for example `const Pin = (props: MarkerProps) => ...`.
 * Children without `lat` and `lng` are rendered as they are, so they can use `useMap()`.
 */
export interface MarkerProps {
	/**
	 * Which point of the marker sits on `lat`/`lng`.
	 * @default 'center'
	 */
	anchor?: MarkerAnchor
	/**
	 * Whether the marker can be dragged.
	 * @default false
	 */
	draggable?: boolean
	lat: number
	lng: number
	/** Fired repeatedly while the marker is dragged. */
	onDrag?: MarkerDragHandler
	/** Fired when the drag ends. Update your `lat`/`lng` state here. */
	onDragEnd?: MarkerDragHandler
	/** Fired when the drag starts. */
	onDragStart?: MarkerDragHandler
	/** Stacking order. Higher values are drawn on top. */
	zIndex?: number
}

/** The libraries `useMapsLibrary()` can load, by name. */
export interface MapsLibraryMap {
	core: google.maps.CoreLibrary
	drawing: google.maps.DrawingLibrary
	elevation: google.maps.ElevationLibrary
	geocoding: google.maps.GeocodingLibrary
	geometry: google.maps.GeometryLibrary
	journeySharing: google.maps.JourneySharingLibrary
	maps: google.maps.MapsLibrary
	maps3d: google.maps.Maps3DLibrary
	marker: google.maps.MarkerLibrary
	places: google.maps.PlacesLibrary
	routes: google.maps.RoutesLibrary
	streetView: google.maps.StreetViewLibrary
	visualization: google.maps.VisualizationLibrary
}

export interface MapControlProps {
	children?: React.ReactNode
	/** Where to place the control, for example `'TOP_RIGHT'`. */
	position: keyof typeof google.maps.ControlPosition | google.maps.ControlPosition
}

type MapMouseHandler = (event: google.maps.MapMouseEvent, map: google.maps.Map) => void
type MapHandler = (map: google.maps.Map) => void

/**
 * Google Maps events, as props. Handlers always see your latest props and state.
 * Mouse events (click, double click, context menu, mouse move/over/out) are not fired
 * when they happen on a marker.
 */
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

/**
 * The drag configuration of the overlay.
 */
export type Drag = {
	/**
	 * Whether the overlay is draggable.
	 * @default false
	 */
	draggable: boolean
	/**
	 * Callback fired repeatedly when the overlay is dragged.
	 * @param e The event.
	 * @param props The props.
	 */
	onDrag: (e: MouseEvent, props: {}) => void
	/**
	 * Callback fired when the drag has ended.
	 * @param e The event.
	 * @param props The props.
	 */
	onDragEnd: (e: MouseEvent, props: {}) => void
	/**
	 * Callback fired when the drag has started.
	 * @param e The event.
	 * @param props The props.
	 */
	onDragStart: (e: MouseEvent, props: {}) => void
}

export type UseScriptStatus = 'idle' | 'loading' | 'ready' | 'error'

export type Pane = 'floatPane' | 'mapPane' | 'markerLayer' | 'overlayLayer' | 'overlayMouseTarget'

export interface IUseGoogleMaps {
	/**
	 * The Google Maps API key.
	 */
	apiKey?: string
	/**
	 * The Google Maps API callback.
	 */
	callback?: () => void
	/**
	 * The Google Maps API params to be appended to the script URL.
	 * @example
	 * {
	 * language: 'en',
	 * region: 'GB',
	 * }
	 */
	externalApiParams?: { [key: string]: any }
	/**
	 * The Google Maps API libraries to be loaded.
	 * @default ['places', 'geometry']
	 */
	libraries?: string[]
	/**
	 * Whether to manage the script loading externally.
	 * @default false
	 */
	loadScriptExternally?: boolean
	/**
	 * The status of the script loading.
	 * To be used only if `loadScriptExternally` is `true`.
	 */
	status?: UseScriptStatus
}

export interface ScriptProps {
	/**
	 * The attributes to be passed to the script element.
	 */
	attributes?: { [key: string]: string }
	/**
	 * The callback to be called when the script has loaded
	 * successfully or has failed to load.
	 */
	callbacks?: {
		onErrorCallback?: () => void
		onLoadCallback?: () => void
	}
	/**
	 * The ID of the HTML element where the script will be appended.
	 * If not provided, the script will be appended to the `body` element.
	 */
	elementIdToAppend?: string
	/**
	 * The URL of the script to be loaded.
	 */
	src: string
}

export interface UseScriptOptions {
	/**
	 * Whether to remove the script when the component unmounts.
	 */
	removeOnUnmount?: boolean
	/**
	 * Whether to prevent the script from loading.
	 * @default false
	 */
	shouldPreventLoad?: boolean
}

export interface MapContextProps {
	/**
	 * The Google Maps instance.
	 */
	map: Map
	/**
	 * The Google Maps API object.
	 */
	maps: MapsLibrary
}

export interface OverlayViewProps extends MapContextProps {
	/**
	 * The children to be rendered within the overlay.
	 */
	children?: React.ReactElement
	/**
	 * The drag configuration of the overlay.
	 * @default { draggable: false }
	 */
	drag?: Drag
	/**
	 * The map pane in which to render the overlay.
	 * @default 'floatPane'
	 */
	pane?: Pane | undefined
	/**
	 * The geographical coordinates of the overlay.
	 */
	position: LatLng
	/**
	 * Which point of the overlay sits on its position.
	 * @default 'center'
	 */
	anchor?: MarkerAnchor
	/**
	 * The z-index of the overlay.
	 * @default 0
	 */
	zIndex?: number | 0
}

export interface createOverlayProps {
	/**
	 * Which point of the overlay sits on its position.
	 * @default 'center'
	 */
	anchor?: MarkerAnchor
	/**
	 * The HTML container element in which to render the overlay.
	 */
	container: HTMLDivElement
	/**
	 * The drag configuration of the overlay.
	 * @default { draggable: false }
	 */
	drag?: Drag
	/**
	 * The Google Maps API object.
	 */
	maps: MapContextProps['maps']
	/**
	 * The map pane in which to render the overlay.
	 * @default 'floatPane'
	 */
	pane: Pane
	/**
	 * The geographical coordinates of the overlay.
	 */
	position: LatLng
}

export interface EventProps {
	/**
	 * The event handler.
	 * @param e The event.
	 */
	handler: (e: any) => void
	/**
	 * The HTML Event attribute name.
	 * @reference https://www.w3schools.com/tags/ref_eventattributes.asp
	 * @example
	 * 'onClick'
	 */
	name: string
}

export interface onGoogleApiLoadedProps extends MapContextProps {
	/**
	 * The ref of the Map.
	 */
	ref: HTMLDivElement | null
}

export interface MapMarkersProps extends MapContextProps {
	/**
	 * The Markers to be rendered on the map.
	 */
	children: React.ReactNode
}

export interface MapProps extends MapEventProps {
	/**
	 * Controlled center. When it changes, the map moves there. Users can still pan:
	 * keep your state in sync with `onChange`.
	 */
	center?: LatLngLiteral
	/**
	 * The Markers to be rendered on the map: every child with `lat` and `lng`.
	 * Other children (for example `MapControl`, or components that use `useMap()`) are rendered as they are.
	 */
	children?: React.ReactNode
	/**
	 * The default center of the map. Pass it, or `center`.
	 */
	defaultCenter?: LatLngLiteral
	/**
	 * The default zoom of the map. Pass it, or `zoom`.
	 */
	defaultZoom?: number
	/**
	 * The events to pass to the Google Maps instance (`div`).
	 * @type {Array}
	 * @example
	 * [
	 *  {
	 *   name: 'onClick',
	 *   handler: (event) => { ... }
	 *  }
	 * ]
	 */
	events?: EventProps[]
	/**
	 * The callback fired when the map changes (center, zoom, bounds).
	 */
	onChange?: (options: {
		/** Bounds as `[westLng, southLat, eastLng, northLat]`, ready for supercluster. */
		bbox: BBox
		bounds: LatLngBounds
		/** Center as `[lng, lat]`. */
		center: (number | undefined)[]
		zoom: number
	}) => void
	/**
	 * The callback fired when the map is loaded.
	 */
	onGoogleApiLoaded?: (props: onGoogleApiLoadedProps) => void
	/**
	 * The options to pass to the Google Maps instance. Changes are applied with `map.setOptions()`.
	 * @reference https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
	 */
	options?: MapOptions
	/**
	 * The style of the map container.
	 * @default {
	 *  width: '100%',
	 *  height: '100%',
	 *  left: 0,
	 *  top: 0,
	 *  margin: 0,
	 *  padding: 0,
	 *  position: 'absolute'
	 * }
	 */
	style?: React.CSSProperties
	/**
	 * Controlled zoom. Pair it with `onChange`.
	 */
	zoom?: number
}

export interface GoogleMapProps extends MapProps, IUseGoogleMaps {
	/**
	 * The props to pass to the `div` container element.
	 */
	containerProps?: React.HTMLAttributes<HTMLDivElement>
	/**
	 * The content to be rendered when the script fails to load.
	 * @default 'Google Maps is on error'
	 */
	errorContent?: React.ReactNode
	/**
	 * The content to be rendered when the script is on idle.
	 * @default 'Google Maps is on idle'
	 */
	idleContent?: React.ReactNode
	/**
	 * The content to be rendered while the script is loading.
	 * @default 'Google Maps is loading'
	 */
	loadingContent?: React.ReactNode
	/**
	 * The minimum height of the map container.
	 * @default 'unset'
	 */
	mapMinHeight?: string
	/**
	 * The Google Maps API script callback
	 */
	scriptCallback?: () => void
}
