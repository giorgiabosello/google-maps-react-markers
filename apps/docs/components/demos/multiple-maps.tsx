'use client'

import { Marker } from 'google-maps-react-markers'
import { demoMapId } from '@/lib/shared'
import { DemoMap } from './demo-map'
import { PricePill } from './pins'

const maps = [
	{ city: 'Rome', center: { lat: 41.9028, lng: 12.4964 }, renderer: 'advanced' as const },
	{ city: 'Milan', center: { lat: 45.4642, lng: 9.19 }, renderer: 'overlay' as const },
]

/** Two maps on the same page share one API load. */
export const MultipleMapsDemo = () => (
	<div className="not-prose demo-frame my-6 grid gap-3 sm:grid-cols-2">
		{maps.map((item) => (
			<div key={item.city} className="overflow-hidden rounded-xl border bg-fd-card shadow-sm">
				<div className="relative h-72">
					<DemoMap
						mapId={demoMapId}
						markerRenderer={item.renderer}
						defaultCenter={item.center}
						defaultZoom={12}
						options={{ disableDefaultUI: true, gestureHandling: 'cooperative' }}
					>
						<Marker lat={item.center.lat} lng={item.center.lng} anchor="bottom">
							<PricePill active>{item.city}</PricePill>
						</Marker>
					</DemoMap>
				</div>
				<p className="border-t px-3 py-2 text-xs text-fd-muted-foreground">{`${item.city} · ${item.renderer} renderer`}</p>
			</div>
		))}
	</div>
)
