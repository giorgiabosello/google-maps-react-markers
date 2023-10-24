import { useCallback, useEffect, useRef, useState } from 'react'
import { EventProps, Map, MapProps, MapsLibrary } from '../utils/types'
import { isArraysEqualEps } from '../utils/utils'
import MapMarkers from './markers'

function MapComponent({
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
	defaultCenter,
	defaultZoom,
	onGoogleApiLoaded,
	onChange,
	options = {},
	events = [],
}: MapProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const prevBoundsRef = useRef<number[]>([])
	const [map, setMap] = useState<Map>()
	const [maps, setMaps] = useState<MapsLibrary>()
	const [googleApiCalled, setGoogleApiCalled] = useState<boolean>(false)

	const onIdle = useCallback(() => {
		try {
			if (!map) {
				return
			}

			const zoom = map.getZoom() ?? defaultZoom
			const bounds = map.getBounds()
			const centerLatLng = [map.getCenter()?.lng(), map.getCenter()?.lat()]

			const ne = bounds?.getNorthEast()
			const sw = bounds?.getSouthWest()

			if (!ne || !sw || !bounds) {
				return
			}

			// east, north, south, west
			const boundsArray = [sw.lng(), sw.lat(), ne.lng(), ne.lat()]

			if (!isArraysEqualEps(boundsArray, prevBoundsRef.current)) {
				if (onChange) {
					onChange({
						zoom,
						center: centerLatLng,
						bounds,
					})
				}
				prevBoundsRef.current = boundsArray
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}, [map, onChange])

	useEffect(() => {
		if (mapRef.current && !map) {
			setMap(
				new google.maps.Map(mapRef.current as HTMLElement, {
					center: defaultCenter,
					zoom: defaultZoom,
					...(options as google.maps.MapOptions),
				}),
			)
			setMaps(google.maps)
		}
	}, [defaultCenter, defaultZoom, map, mapRef, options])

	useEffect(() => {
		if (map) {
			if (!googleApiCalled) {
				if (onGoogleApiLoaded && maps) onGoogleApiLoaded({ map, maps, ref: mapRef.current })
				setGoogleApiCalled(true)
			}

			google.maps.event.clearListeners(map, 'idle')
			// Idle event is fired when the map becomes idle after panning or zooming.
			google.maps.event.addListener(map, 'idle', onIdle)
		}
	}, [googleApiCalled, map, maps, onChange, onGoogleApiLoaded, onIdle])

	useEffect(
		() =>
			// clear listeners on unmount
			() => {
				if (map) {
					google.maps.event.clearListeners(map, 'idle')
				}
			},
		[map],
	)

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
			{children && map && maps && (
				<MapMarkers map={map} maps={maps}>
					{children}
				</MapMarkers>
			)}
		</>
	)
}

export default MapComponent
