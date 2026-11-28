import { useEffect, useMemo, useRef, useState } from 'react'
import { BBox, EventProps, Map, MapContextProps, MapProps, MapsLibrary } from '../utils/types'
import { isArraysEqualEps, isOnMarker, optionsEqual } from '../utils/utils'
import { GoogleMapContext } from './context'
import { MAP_EVENTS, MAP_EVENT_PROPS, MOUSE_EVENTS } from './map-events'
import MapMarkers from './markers'

function MapComponent(props: MapProps) {
	const {
		children = null,
		style = {
			width: '100%',
			height: '100%',
			left: 0,
			top: 0,
			margin: 0,
			padding: 0,
			position: 'absolute',
		},
		center,
		defaultCenter,
		defaultZoom,
		zoom,
		onGoogleApiLoaded,
		options = {},
		events = [],
	} = props
	const mapRef = useRef<HTMLDivElement>(null)
	const prevBoundsRef = useRef<number[]>([])
	const [map, setMap] = useState<Map>()
	const [maps, setMaps] = useState<MapsLibrary>()
	const [googleApiCalled, setGoogleApiCalled] = useState<boolean>(false)

	// Listeners are registered once per map: they read the latest props from here,
	// so they never call a callback with stale props or state.
	const latestRef = useRef(props)
	useEffect(() => {
		latestRef.current = props
	})

	// The map is kept in a ref too: in StrictMode effects run twice on mount,
	// and the second run must reuse the map instead of creating another one on the same div.
	const instanceRef = useRef<Map | undefined>(undefined)
	const appliedOptionsRef = useRef<MapProps['options']>(undefined)
	useEffect(() => {
		if (!mapRef.current || map) return
		if (!instanceRef.current) {
			appliedOptionsRef.current = options
			instanceRef.current = new google.maps.Map(mapRef.current as HTMLElement, {
				center: center ?? defaultCenter,
				zoom: zoom ?? defaultZoom,
				...(options as google.maps.MapOptions),
			})
		}
		setMap(instanceRef.current)
		setMaps(google.maps)
		// The map is created once: later changes go through the effects below.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [map])

	// Options: apply only real changes, so an inline object does not call setOptions on every render.
	useEffect(() => {
		if (!map || optionsEqual(appliedOptionsRef.current, options)) return
		appliedOptionsRef.current = options
		map.setOptions(options)
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

	useEffect(() => {
		if (map && !googleApiCalled) {
			if (typeof onGoogleApiLoaded === 'function' && maps) {
				onGoogleApiLoaded({ map, maps, ref: mapRef.current })
			}
			setGoogleApiCalled(true)
		}
	}, [googleApiCalled, map, maps, onGoogleApiLoaded])

	// Event props: one listener per event in use. Handlers are read from the latest props.
	const activeEvents = MAP_EVENT_PROPS.filter((name) => props[name]).join(',')
	useEffect(() => {
		if (!map || !activeEvents) return undefined
		const listeners = activeEvents.split(',').map((name) => {
			const prop = name as (typeof MAP_EVENT_PROPS)[number]
			return google.maps.event.addListener(map, MAP_EVENTS[prop], (event?: google.maps.MapMouseEvent) => {
				const handler = latestRef.current[prop]
				if (!handler) return
				if (MOUSE_EVENTS.has(prop)) {
					// A click on a marker is the marker's, not the map's.
					if (!event || isOnMarker(event)) return
					;(handler as (e: google.maps.MapMouseEvent, m: google.maps.Map) => void)(event, map)
				} else {
					;(handler as (m: google.maps.Map) => void)(map)
				}
			})
		})
		return () => {
			listeners.forEach((listener) => google.maps.event.removeListener(listener))
		}
	}, [map, activeEvents])

	useEffect(() => {
		if (!map) return undefined

		// Idle event is fired when the map becomes idle after panning or zooming.
		const onIdle = () => {
			try {
				const { onChange: currentOnChange, defaultZoom: currentDefaultZoom } = latestRef.current
				const currentZoom = map.getZoom() ?? currentDefaultZoom
				const bounds = map.getBounds()
				const centerLatLng = [map.getCenter()?.lng(), map.getCenter()?.lat()]

				const ne = bounds?.getNorthEast()
				const sw = bounds?.getSouthWest()

				if (!ne || !sw || !bounds) {
					return
				}

				// west, south, east, north
				const bbox: BBox = [sw.lng(), sw.lat(), ne.lng(), ne.lat()]

				if (!isArraysEqualEps(bbox, prevBoundsRef.current)) {
					if (currentOnChange) {
						currentOnChange({
							zoom: currentZoom as number,
							center: centerLatLng,
							bounds,
							bbox,
						})
					}
					prevBoundsRef.current = bbox
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			}
		}

		// Remove only this listener: idle listeners added by the user (for example in onGoogleApiLoaded) stay.
		const listener = google.maps.event.addListener(map, 'idle', onIdle)
		return () => {
			google.maps.event.removeListener(listener)
		}
	}, [map])

	const contextValue = useMemo<MapContextProps | null>(() => (map && maps ? { map, maps } : null), [map, maps])

	return (
		<>
			<div
				ref={mapRef}
				style={style}
				className="google-map"
				// spread the events as props
				{...events?.reduce(
					(acc, { name, handler }: EventProps) => {
						acc[name] = handler
						return acc
					},
					{} as { [key: string]: any },
				)}
			/>
			{children && contextValue && (
				<GoogleMapContext.Provider value={contextValue}>
					<MapMarkers map={contextValue.map} maps={contextValue.maps}>
						{children}
					</MapMarkers>
				</GoogleMapContext.Provider>
			)}
		</>
	)
}

export default MapComponent
