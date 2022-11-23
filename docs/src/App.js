import GoogleMap from 'google-maps-react-markers'
import { useEffect, useRef, useState } from 'react'
import mapOptions from './map-options.json'
import Marker from './marker'
import './style.css'

const coordinates = [
	[
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
	],
	[
		{
			lat: 40.8518,
			lng: 14.2681,
			name: 'Naples',
		},
		{
			lat: 43.7696,
			lng: 11.2558,
			name: 'Florence',
		},
		{
			lat: 37.5023,
			lng: 15.0873,
			name: 'Catania',
		},
	],
]

const App = () => {
	const mapRef = useRef(null)
	const [mapReady, setMapReady] = useState(false)
	const [mapBounds, setMapBounds] = useState({})
	const [usedCoordinates, setUsedCoordinates] = useState(0)
	const [currCoordinates, setCurrCoordinates] = useState(coordinates[usedCoordinates])

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

	const onMapChange = ({ bounds, zoom }) => {
		const ne = bounds.getNorthEast()
		const sw = bounds.getSouthWest()
		// useSupercluster accepts bounds in the form of [westLng, southLat, eastLng, northLat]
		setMapBounds({ ...mapBounds, bounds: [sw.lng(), sw.lat(), ne.lng(), ne.lat()], zoom })

		console.log('New bounds and zoom -> ', { bounds, zoom })
	}

	const updateCoordinates = () => setUsedCoordinates(!usedCoordinates ? 1 : 0)

	useEffect(() => {
		setCurrCoordinates(coordinates[usedCoordinates])
	}, [usedCoordinates])

	return (
		<>
			{mapReady && (
				<div className="container">
					<div>
						<div>Map is ready. See for logs in developer console.</div>
						<div>Click UPDATE below to trigger markers coordinates change.</div>
						<button onClick={updateCoordinates}>UPDATE</button>
					</div>
					<div>
						<a href="https://github.com/giorgiabosello/google-maps-react-markers" style={{ display: 'block' }}>
							<img
								src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"
								alt="Github repository"
							/>
						</a>
					</div>
				</div>
			)}
			<GoogleMap
				defaultCenter={{ lat: 45.4046987, lng: 12.2472504 }}
				defaultZoom={5}
				options={mapOptions}
				mapMinHeight="100vh"
				onGoogleApiLoaded={onGoogleApiLoaded}
				onChange={onMapChange}
			>
				{currCoordinates.map(({ lat, lng, name }, index) => (
					<Marker key={index} lat={lat} lng={lng} markerId={name} onClick={onMarkerClick} className="marker" />
				))}
			</GoogleMap>
		</>
	)
}

export default App
