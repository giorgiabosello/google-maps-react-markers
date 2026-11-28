'use client'

import { Marker } from 'google-maps-react-markers'
import { DemoFrame, DemoMap } from './demo-map'
import { PricePill } from './pins'

const places = [
	{ name: 'دبي', lat: 25.2048, lng: 55.2708 },
	{ name: 'أبو ظبي', lat: 24.4539, lng: 54.3773 },
	{ name: 'الدوحة', lat: 25.2854, lng: 51.531 },
	{ name: 'مسقط', lat: 23.588, lng: 58.3829 },
]

/** The same markers inside a dir="rtl" page: positions do not move. */
export const RtlDemo = () => (
	<div dir="rtl">
		<DemoFrame>
			<DemoMap defaultCenter={{ lat: 24.6, lng: 55 }} defaultZoom={6} options={{ gestureHandling: 'cooperative' }}>
				{places.map((place) => (
					<Marker key={place.name} lat={place.lat} lng={place.lng} anchor="bottom">
						<PricePill>{place.name}</PricePill>
					</Marker>
				))}
			</DemoMap>
		</DemoFrame>
	</div>
)
