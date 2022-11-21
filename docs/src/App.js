import GoogleMap from 'google-maps-react-markers'
import { useRef, useState } from 'react'
import mapOptions from './map-options.json'
import Marker from './marker'

const coordinates = [
	{
		lat: 45.4046987,
		lng: 12.2472504,
		name: 'Venice',
	},
	{
		lat: 41.9102415,
		lng: 12.3959151,
		name: 'Rome',
	},
	{
		lat: 45.4628328,
		lng: 9.1076927,
		name: 'Milan',
	},
]

const App = () => {
	const mapRef = useRef(null)
	const [mapReady, setMapReady] = useState(false)

	/**
	 * @description This function is called when the map is ready
	 * @param {Object} map - reference to the map instance
	 * @param {Object} maps - reference to the maps library
	 */
	// eslint-disable-next-line no-unused-vars
	const onGoogleApiLoaded = ({ map, maps }) => {
		mapRef.current = map
		setMapReady(true)
	}

	const onMarkerClick = (markerId) => {
		console.log('This is ->', markerId)
	}

	return (
		<>
			{mapReady && <div>Map is ready. See for logs in developer console.</div>}
			<GoogleMap
				defaultCenter={{ lat: 45.4046987, lng: 12.2472504 }}
				defaultZoom={5}
				options={mapOptions}
				mapMinHeight="100vh"
				onGoogleApiLoaded={onGoogleApiLoaded}
				onChange={(map) => console.log('Map moved', map)}
			>
				{coordinates.map(({ lat, lng, name }, index) => (
					<Marker key={index} lat={lat} lng={lng} markerId={name} onClick={onMarkerClick} />
				))}
			</GoogleMap>
		</>
	)
}

export default App
