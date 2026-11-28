'use client'

import { type BBox, Marker } from 'google-maps-react-markers'
import { useState } from 'react'
import { DemoFrame, DemoMap } from './demo-map'
import { Avatar, Dot, PlaceCard, PricePill } from './pins'

const places = [
	{ id: 'venice', name: 'Venice', price: 180, lat: 45.4408, lng: 12.3155 },
	{ id: 'milan', name: 'Milan', price: 150, lat: 45.4642, lng: 9.19 },
	{ id: 'turin', name: 'Turin', price: 95, lat: 45.0703, lng: 7.6869 },
	{ id: 'genoa', name: 'Genoa', price: 88, lat: 44.4056, lng: 8.9463 },
	{ id: 'bologna', name: 'Bologna', price: 110, lat: 44.4949, lng: 11.3426 },
	{ id: 'florence', name: 'Florence', price: 165, lat: 43.7696, lng: 11.2558 },
	{ id: 'rome', name: 'Rome', price: 140, lat: 41.9028, lng: 12.4964 },
	{ id: 'naples', name: 'Naples', price: 90, lat: 40.8518, lng: 14.2681 },
	{ id: 'bari', name: 'Bari', price: 75, lat: 41.1171, lng: 16.8719 },
	{ id: 'palermo', name: 'Palermo', price: 80, lat: 38.1157, lng: 13.3615 },
]

const live = [
	{ id: 'a', lat: 46.5, lng: 11.35, tone: 'green' },
	{ id: 'b', lat: 43.3, lng: 13.5, tone: 'cyan' },
	{ id: 'c', lat: 39.3, lng: 16.25, tone: 'green' },
	{ id: 'd', lat: 44.1, lng: 9.8, tone: 'cyan' },
] as const

const format = (value: number) => value.toFixed(4)

/**
 * About ten hand-made markers on a navy map: price tags that open into cards,
 * glowing dots and a draggable avatar. No mapId, so JSON styles and the overlay renderer.
 */
export const FewMarkersDemo = ({ height = 'h-[480px]', eager = false }: { eager?: boolean; height?: string }) => {
	const [selected, setSelected] = useState<string | null>('florence')
	const [me, setMe] = useState({ lat: 42.35, lng: 13.4 })
	const [view, setView] = useState<{ bbox: BBox; zoom: number } | null>(null)
	const place = places.find((item) => item.id === selected)

	return (
		<DemoFrame
			className={height}
			footer={
				<div className="grid gap-1 font-mono text-xs text-fd-muted-foreground sm:grid-cols-3">
					<span>
						Selected: <span className="text-fd-foreground">{place ? `${place.name}, €${place.price}` : 'none'}</span>
					</span>
					<span>
						You: <span className="text-fd-foreground">{`${format(me.lat)}, ${format(me.lng)}`}</span>
					</span>
					<span>
						Zoom: <span className="text-fd-foreground">{view ? view.zoom : '…'}</span>
						{view ? ` · bbox ${view.bbox.map((value) => value.toFixed(1)).join(', ')}` : null}
					</span>
				</div>
			}
		>
			<DemoMap
				coverStyle
				eager={eager}
				defaultCenter={{ lat: 42.6, lng: 12.4 }}
				defaultZoom={6}
				options={{ gestureHandling: 'cooperative' }}
				onChange={({ bbox, zoom }) => setView({ bbox, zoom })}
				onClick={() => setSelected(null)}
			>
				{places.map((item) => (
					<Marker
						key={item.id}
						lat={item.lat}
						lng={item.lng}
						anchor="bottom"
						// The accessible name of the button. It starts with the visible text, so speech input
						// users can say what they see (WCAG 2.5.3).
						title={
							item.id === selected
								? `Stay in ${item.name}, as a marker, €${item.price} / night`
								: `€${item.price} a night in ${item.name}`
						}
						zIndex={item.id === selected ? 30 : 1}
						onClick={() => setSelected(item.id)}
					>
						{item.id === selected ? (
							<PlaceCard title={`Stay in ${item.name}`} subtitle="as a marker" price={`€${item.price} / night`} />
						) : (
							<PricePill>€{item.price}</PricePill>
						)}
					</Marker>
				))}
				{live.map((dot) => (
					<Marker key={dot.id} lat={dot.lat} lng={dot.lng}>
						<Dot tone={dot.tone} />
					</Marker>
				))}
				<Marker
					lat={me.lat}
					lng={me.lng}
					anchor="bottom"
					// Above the price tags, below the open card.
					zIndex={20}
					// Contains all the visible text ("drag me", "GB"), in order (WCAG 2.5.3).
					title="Drag me GB"
					draggable
					onDragEnd={(_, { latLng }) => setMe(latLng)}
				>
					{/* The label sits above the avatar, so the anchor stays on the tip of the stem. */}
					<div className="flex flex-col items-center gap-1">
						<span className="rounded-full bg-brand-ink/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-brand-cyan shadow-md ring-1 ring-brand-cyan/40">
							drag me
						</span>{' '}
						{/* The space keeps "drag me" and "GB" separate words for assistive technology. */}
						<Avatar initials="GB" stem />
					</div>
				</Marker>
			</DemoMap>
		</DemoFrame>
	)
}
