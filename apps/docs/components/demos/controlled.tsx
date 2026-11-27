'use client'

import { type LatLngLiteral, MapControl, Marker } from 'google-maps-react-markers'
import { useState } from 'react'
import { demoMapId } from '@/lib/shared'
import { DemoFrame, DemoMap } from './demo-map'
import { Pin } from './pins'

const lisbon = { lat: 38.7223, lng: -9.1393 }

const cities = [
	{ name: 'Lisbon', center: lisbon },
	{ name: 'Paris', center: { lat: 48.8566, lng: 2.3522 } },
	{ name: 'Berlin', center: { lat: 52.52, lng: 13.405 } },
	{ name: 'Athens', center: { lat: 37.9838, lng: 23.7275 } },
]

const controlButton =
	'flex size-9 items-center justify-center bg-white text-lg font-semibold text-neutral-800 hover:bg-neutral-100'

const minZoom = 2
const maxZoom = 20

/** center and zoom live in React state: buttons change them, onChange keeps them in sync. */
export const ControlledDemo = () => {
	const [center, setCenter] = useState<LatLngLiteral>(lisbon)
	const [zoom, setZoom] = useState(5)

	return (
		<DemoFrame
			toolbar={cities.map((city) => (
				<button
					key={city.name}
					type="button"
					className="rounded-md border px-2 py-0.5 text-xs font-medium hover:bg-fd-accent"
					onClick={() => {
						setCenter(city.center)
						setZoom(11)
					}}
				>
					{city.name}
				</button>
			))}
			footer={
				<span className="font-mono text-xs text-fd-muted-foreground">
					{`center ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)} · zoom ${zoom}`}
				</span>
			}
		>
			<DemoMap
				mapId={demoMapId}
				center={center}
				zoom={zoom}
				options={{ disableDefaultUI: true, gestureHandling: 'cooperative' }}
				onChange={(event) => {
					setCenter(event.center)
					setZoom(event.zoom)
				}}
			>
				{cities.map((city) => (
					<Marker key={city.name} lat={city.center.lat} lng={city.center.lng} anchor="bottom" title={city.name}>
						<Pin label={city.name} className="text-brand-cyan" />
					</Marker>
				))}
				<MapControl position="RIGHT_BOTTOM">
					<div className="m-2.5 flex flex-col overflow-hidden rounded-lg shadow-md">
						<button
							type="button"
							aria-label="Zoom in"
							className={controlButton}
							onClick={() => setZoom((z) => Math.min(z + 1, maxZoom))}
						>
							+
						</button>
						<button
							type="button"
							aria-label="Zoom out"
							className={controlButton}
							onClick={() => setZoom((z) => Math.max(z - 1, minZoom))}
						>
							−
						</button>
					</div>
				</MapControl>
			</DemoMap>
		</DemoFrame>
	)
}
