import { GoogleMap, MapControl, Marker, useGoogleMapsStatus, useMap, useMapsLibrary } from '../src'

const HookUser = () => {
	const map = useMap()
	const places = useMapsLibrary('places')
	const status = useGoogleMapsStatus()
	return <p data-hooks="">{`${status}:${map ? 'map' : 'no-map'}:${places ? 'places' : 'no-places'}`}</p>
}

export const points = Array.from({ length: 500 }, (_, index) => ({
	id: index,
	lat: ((index * 37) % 170) - 85,
	lng: ((index * 73) % 360) - 180,
}))

/** Everything the library exports, in one tree. */
export const SsrTree = () => (
	<GoogleMap
		apiKey="key"
		mapId="demo"
		defaultCenter={{ lat: 45, lng: 12 }}
		defaultZoom={4}
		className="map"
		loadingContent={<span>Loading map</span>}
		onChange={() => {}}
		onClick={() => {}}
	>
		{points.map((point) => (
			<Marker key={point.id} lat={point.lat} lng={point.lng} draggable={point.id === 0}>
				<span>{`Point ${point.id}`}</span>
			</Marker>
		))}
		<MapControl position="TOP_RIGHT">
			<button type="button">Control</button>
		</MapControl>
		<HookUser />
	</GoogleMap>
)
