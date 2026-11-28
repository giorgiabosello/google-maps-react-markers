'use client'

import { type LatLngLiteral, Marker } from 'google-maps-react-markers'
import { useState } from 'react'
import { DemoFrame, DemoMap } from './demo-map'
import { demoMapId } from '@/lib/shared'
import { Pin } from './pins'

type Phase = 'idle' | 'dragging' | 'dropped'

const format = ({ lat, lng }: LatLngLiteral) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`

/** A draggable advanced marker (the map has a mapId), with mouse, touch or keyboard, anchored at its tip. */
export const DraggableDemo = () => {
	const [position, setPosition] = useState<LatLngLiteral>({ lat: 45.4642, lng: 9.19 })
	const [live, setLive] = useState<LatLngLiteral | null>(null)
	const [phase, setPhase] = useState<Phase>('idle')

	return (
		<DemoFrame
			footer={
				<div className="flex flex-col gap-1">
					<div className="flex flex-wrap gap-x-6 font-mono text-xs text-fd-muted-foreground">
						<span>
							State <span className="text-fd-foreground">{phase}</span>
						</span>
						<span>
							Live <span className="text-fd-foreground">{live ? format(live) : '…'}</span>
						</span>
						{/* Announced when it changes, so the result of a drag is heard too. */}
						<span aria-live="polite">
							Saved <span className="text-fd-foreground">{format(position)}</span>
						</span>
					</div>
					<p className="text-xs text-fd-muted-foreground">
						Keyboard: Tab to the pin, <kbd>Alt</kbd> + <kbd>Enter</kbd> to grab it, arrow keys to move, <kbd>Enter</kbd>{' '}
						to drop, <kbd>Esc</kbd> to cancel.
					</p>
				</div>
			}
		>
			<DemoMap mapId={demoMapId} defaultCenter={position} defaultZoom={11} options={{ gestureHandling: 'cooperative' }}>
				<Marker
					lat={position.lat}
					lng={position.lng}
					anchor="bottom"
					draggable
					title="Drag me"
					onDragStart={() => setPhase('dragging')}
					onDrag={(_, { latLng }) => setLive(latLng)}
					onDragEnd={(_, { latLng }) => {
						setPhase('dropped')
						setPosition(latLng)
					}}
				>
					<Pin label="Drag me" className="cursor-grab text-brand-magenta" />
				</Marker>
			</DemoMap>
		</DemoFrame>
	)
}
