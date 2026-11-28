import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { GoogleMapContext, type GoogleMapContextValue } from './context'
import { useGoogleMapsStatus } from './hooks'
import { boundsToBbox, isArraysEqualEps, optionsEqual } from './internal/geometry'
import { MARKER_ATTRIBUTE } from './internal/marker-handle'
import { MAP_EVENTS, MAP_EVENT_PROPS, MOUSE_EVENTS } from './internal/map-events'
import { useLatest } from './internal/use-latest'
import { loadGoogleMaps, loadLibrary } from './loader'
import type { GoogleMapProps } from './types'

const isDev = process.env.NODE_ENV !== 'production'

/**
 * Whether a map mouse event happened over a marker. Google reports the event on its own
 * layer, so the target is not enough: check what is under the pointer too.
 */
const isOnMarker = (event: google.maps.MapMouseEvent | undefined) => {
	const domEvent = event?.domEvent
	if (!domEvent) return false
	const selector = `[${MARKER_ATTRIBUTE}]`
	if (domEvent.target instanceof Element && domEvent.target.closest(selector)) return true
	if (!('clientX' in domEvent) || typeof document.elementsFromPoint !== 'function') return false
	return document
		.elementsFromPoint(domEvent.clientX, domEvent.clientY)
		.some((element) => element.closest(selector) !== null)
}

const baseStyle: CSSProperties = { position: 'relative', overflow: 'hidden' }
/** Without a className the map fills its parent. With one, the class decides the size. */
const fillStyle: CSSProperties = { ...baseStyle, width: '100%', height: '100%' }
const layerStyle: CSSProperties = { position: 'absolute', inset: 0 }

/**
 * A Google Map. Renders `loadingContent` on the server and while the API loads, then the map.
 * Put `<Marker>`, `<MapControl>` and components that use `useMap()` inside it.
 */
export const GoogleMap = (props: GoogleMapProps) => {
	const {
		apiKey,
		version,
		language,
		region,
		libraries,
		mapIds,
		authReferrerPolicy,
		channel,
		mapId,
		markerRenderer = 'auto',
		center,
		zoom,
		options,
		loadingContent = null,
		errorContent = null,
		className,
		style,
		id,
		ref,
		children,
	} = props

	const mapDivRef = useRef<HTMLDivElement>(null)
	const latest = useLatest(props)
	const [map, setMap] = useState<google.maps.Map | null>(null)
	const [failed, setFailed] = useState(false)
	const status = useGoogleMapsStatus()

	// Create the map once per mapId (a map ID cannot change on an existing map).
	useEffect(() => {
		const div = mapDivRef.current
		if (!div) return undefined
		let cancelled = false
		let instance: google.maps.Map | null = null
		const initial = latest.current

		loadGoogleMaps({ apiKey, version, language, region, libraries, mapIds, authReferrerPolicy, channel })
			.then(() => (mapId ? loadLibrary('marker') : undefined))
			.then(() => {
				if (cancelled) return
				if (
					isDev &&
					!(initial.center ?? initial.defaultCenter) &&
					initial.zoom === undefined &&
					initial.defaultZoom === undefined
				) {
					console.warn(
						'[google-maps-react-markers] Pass center/defaultCenter and zoom/defaultZoom, or the map stays blank.',
					)
				}
				instance = new google.maps.Map(div, {
					...initial.options,
					center: initial.center ?? initial.defaultCenter,
					zoom: initial.zoom ?? initial.defaultZoom,
					mapId,
				})
				setMap(instance)
				latest.current.onLoad?.({ map: instance, maps: google.maps })
			})
			.catch((error: unknown) => {
				// Core load errors also set the global status; a failed `marker` library or map creation only fails this map.
				if (cancelled) return
				if (isDev) console.error('[google-maps-react-markers] The map could not be created.', error)
				setFailed(true)
			})

		return () => {
			cancelled = true
			if (instance) {
				google.maps.event.clearInstanceListeners(instance)
				setMap(null)
			}
		}
		// The loader only uses the options of the first map, so they are not dependencies.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mapId])

	// Options: apply only real changes, so an inline object does not call setOptions on every render.
	const appliedOptions = useRef(options)
	useEffect(() => {
		if (!map || optionsEqual(appliedOptions.current, options)) return
		appliedOptions.current = options
		if (options) map.setOptions(options)
	}, [map, options])

	// Controlled center and zoom.
	const centerLat = center?.lat
	const centerLng = center?.lng
	useEffect(() => {
		if (!map || centerLat === undefined || centerLng === undefined) return
		const current = map.getCenter()
		if (current && isArraysEqualEps([current.lat(), current.lng()], [centerLat, centerLng], 1e-9)) return
		map.setCenter({ lat: centerLat, lng: centerLng })
	}, [map, centerLat, centerLng])

	useEffect(() => {
		if (!map || zoom === undefined || map.getZoom() === zoom) return
		map.setZoom(zoom)
	}, [map, zoom])

	// Event props: one listener per event in use. Handlers are read from the latest props.
	const activeEvents = MAP_EVENT_PROPS.filter((name) => props[name]).join(',')
	useEffect(() => {
		if (!map || !activeEvents) return undefined
		const listeners = activeEvents.split(',').map((name) => {
			const prop = name as (typeof MAP_EVENT_PROPS)[number]
			return map.addListener(MAP_EVENTS[prop], (event?: google.maps.MapMouseEvent) => {
				const handler = latest.current[prop]
				if (!handler) return
				// A click on a marker is the marker's, not the map's.
				if (MOUSE_EVENTS.has(prop) && isOnMarker(event)) return
				if (MOUSE_EVENTS.has(prop) && event)
					(handler as (e: google.maps.MapMouseEvent, m: google.maps.Map) => void)(event, map)
				else (handler as (m: google.maps.Map) => void)(map)
			})
		})
		return () => {
			for (const listener of listeners) listener.remove()
		}
	}, [map, activeEvents, latest])

	// onChange: fired on idle, only when center, zoom or bounds really changed.
	useEffect(() => {
		if (!map) return undefined
		let previous: number[] = []
		const listener = map.addListener('idle', () => {
			const onChange = latest.current.onChange
			const bounds = map.getBounds()
			const mapCenter = map.getCenter()
			const mapZoom = map.getZoom()
			if (!onChange || !bounds || !mapCenter || mapZoom === undefined) return
			const bbox = boundsToBbox(bounds)
			const next = [...bbox, mapZoom]
			if (isArraysEqualEps(next, previous)) return
			previous = next
			onChange({ map, bounds, bbox, zoom: mapZoom, center: { lat: mapCenter.lat(), lng: mapCenter.lng() } })
		})
		return () => listener.remove()
	}, [map, latest])

	const renderer: GoogleMapContextValue['renderer'] = !map
		? null
		: markerRenderer === 'overlay' || !mapId
			? 'overlay'
			: 'advanced'

	useEffect(() => {
		if (isDev && markerRenderer === 'advanced' && !mapId) {
			console.warn('[google-maps-react-markers] markerRenderer="advanced" needs a mapId. Falling back to "overlay".')
		}
	}, [markerRenderer, mapId])

	const contextValue = useMemo<GoogleMapContextValue>(() => ({ map, renderer, status }), [map, renderer, status])

	const hasError = status === 'error' || failed
	const loading = !hasError && (status !== 'ready' || !map)

	return (
		<div
			ref={ref}
			id={id}
			className={className}
			style={{ ...(className ? baseStyle : fillStyle), ...style }}
			// Assistive technology waits for the map instead of reading a half-built one.
			aria-busy={loading || undefined}
		>
			{/* Google draws the map here. The attribute lets tests and styles tell its UI apart. */}
			<div key={mapId ?? ''} ref={mapDivRef} style={layerStyle} data-gmrm-map="" />
			{hasError ? (
				// role="alert" is announced as soon as it appears.
				<div role="alert" style={layerStyle}>
					{errorContent}
				</div>
			) : loading ? (
				<div style={layerStyle}>{loadingContent}</div>
			) : null}
			<GoogleMapContext value={contextValue}>{children}</GoogleMapContext>
		</div>
	)
}
