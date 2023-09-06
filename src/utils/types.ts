import React from 'react'

declare global {
	interface Window {
		google?: any
		googleMapsCallback?: () => void
	}
}

window.googleMapsCallback = () => {}
window.google = undefined

export type MapMouseEvent = google.maps.MapMouseEvent
export type Map = google.maps.Map
export type MapsLibrary = typeof google.maps
export type MapPanes = google.maps.MapPanes
export type MapOptions = google.maps.MapOptions
export type LatLng = google.maps.LatLng
export type LatLngLiteral = google.maps.LatLngLiteral
export type LatLngBounds = google.maps.LatLngBounds
export type LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral
export type Noop = () => void

export type Drag = {
	draggable: boolean
	onDrag: (e: MouseEvent, props: {}) => void
	onDragEnd: (e: MouseEvent, props: {}) => void
	onDragStart: (e: MouseEvent, props: {}) => void
}

export type UseScriptStatus = 'idle' | 'loading' | 'ready' | 'error'

export type Pane = 'floatPane' | 'mapPane' | 'markerLayer' | 'overlayLayer' | 'overlayMouseTarget'

export interface IUseGoogleMaps {
	apiKey: string
	callback?: () => void
	externalApiParams?: { [key: string]: any }
	libraries?: string[]
	loadScriptExternally?: boolean
	status?: UseScriptStatus
}

export interface ScriptProps {
	attributes?: { [key: string]: string }
	callbacks?: {
		onErrorCallback?: () => void
		onLoadCallback?: () => void
	}
	elementIdToAppend?: string
	src: string
}

export interface UseScriptOptions {
	removeOnUnmount?: boolean
	shouldPreventLoad?: boolean
}

export interface MapContextProps {
	map: Map
	maps: MapsLibrary
}

export interface OverlayViewProps extends MapContextProps {
	children?: React.ReactElement
	drag?: Drag
	pane?: Pane | undefined
	position: LatLng
	zIndex?: number | 0
}

export interface createOverlayProps {
	container: HTMLDivElement
	drag?: Drag
	maps: MapContextProps['maps']
	pane: Pane
	position: LatLng
}

export interface EventProps {
	handler: (e: any) => void
	name: string
}

export interface onGoogleApiLoadedProps extends MapContextProps {
	ref: HTMLDivElement | null
}

export interface MapMarkersProps extends MapContextProps {
	children: React.ReactNode
}

export interface MapProps {
	children?: React.ReactNode
	defaultCenter: LatLngLiteral
	defaultZoom: number
	events?: EventProps[]
	onChange?: (options: { bounds: LatLngBounds; center: (number | undefined)[]; zoom: number }) => void
	onGoogleApiLoaded?: (props: onGoogleApiLoadedProps) => void
	options?: MapOptions
	style?: React.CSSProperties
}

export interface GoogleMapProps extends MapProps {
	apiKey?: string
	children?: React.ReactNode
	containerProps?: React.HTMLAttributes<HTMLDivElement>
	errorContent?: React.ReactNode
	externalApiParams?: { [key: string]: any }
	idleContent?: React.ReactNode
	libraries?: string[]
	loadScriptExternally?: boolean
	loadingContent?: React.ReactNode
	mapMinHeight?: string
	scriptCallback?: Noop
	status?: UseScriptStatus
}
