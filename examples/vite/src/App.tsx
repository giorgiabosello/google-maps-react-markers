import { GoogleMap, Marker } from 'google-maps-react-markers'
import { useMemo, useState } from 'react'

/** Deterministic points around Europe, so runs are comparable. */
const createPoints = (count: number) => {
	let seed = 1
	const random = () => {
		seed = (seed * 16807) % 2147483647
		return (seed - 1) / 2147483646
	}
	return Array.from({ length: count }, (_, id) => ({ id, lat: 36 + random() * 24, lng: -10 + random() * 40 }))
}

const dot = { width: 12, height: 12, borderRadius: '50%', background: '#e11d48', border: '2px solid white' }

export function App() {
	const [count, setCount] = useState(1000)
	const [mapId, setMapId] = useState<string | undefined>('DEMO_MAP_ID')
	const points = useMemo(() => createPoints(count), [count])

	return (
		<div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100dvh' }}>
			<header style={{ display: 'flex', gap: 12, padding: 8, alignItems: 'center' }}>
				<strong>Vite + StrictMode</strong>
				<label>
					Markers{' '}
					<select value={count} onChange={(event) => setCount(Number(event.target.value))}>
						{[100, 1000, 5000].map((value) => (
							<option key={value}>{value}</option>
						))}
					</select>
				</label>
				<label>
					<input
						type="checkbox"
						checked={Boolean(mapId)}
						onChange={() => setMapId(mapId ? undefined : 'DEMO_MAP_ID')}
					/>{' '}
					mapId (advanced markers)
				</label>
			</header>
			<GoogleMap
				apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
				mapId={mapId}
				defaultCenter={{ lat: 48, lng: 10 }}
				defaultZoom={4}
				loadingContent="Loading…"
				errorContent="Google Maps could not load."
			>
				{points.map((point) => (
					<Marker key={point.id} lat={point.lat} lng={point.lng} title={`Point ${point.id}`}>
						<div style={dot} />
					</Marker>
				))}
			</GoogleMap>
		</div>
	)
}
