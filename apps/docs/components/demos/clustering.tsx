'use client'

import { type BBox, Marker } from 'google-maps-react-markers'
import { useMemo, useRef, useState } from 'react'
import Supercluster from 'supercluster'
import { generatePoints } from '@/lib/random'
import { demoMapId } from '@/lib/shared'
import { DemoFrame, DemoMap } from './demo-map'
import { ClusterBubble, Dot } from './pins'

const points = generatePoints(5000, 7)

/** 5,000 points clustered with supercluster, from the bbox and zoom given by onChange. */
export const ClusteringDemo = () => {
	const mapRef = useRef<google.maps.Map | null>(null)
	const [view, setView] = useState<{ bbox: BBox; zoom: number } | null>(null)

	const index = useMemo(() => {
		const cluster = new Supercluster<{ id: number }>({ radius: 60, maxZoom: 16 })
		cluster.load(
			points.map((point) => ({
				type: 'Feature',
				properties: { id: point.id },
				geometry: { type: 'Point', coordinates: [point.lng, point.lat] },
			})),
		)
		return cluster
	}, [])

	const clusters = view ? index.getClusters(view.bbox, Math.round(view.zoom)) : []

	return (
		<DemoFrame
			footer={
				<span className="font-mono text-xs text-fd-muted-foreground">
					{`${points.length.toLocaleString('en')} points, ${clusters.length} markers rendered. Click a cluster to zoom in.`}
				</span>
			}
		>
			<DemoMap
				mapId={demoMapId}
				defaultCenter={{ lat: 48, lng: 10 }}
				defaultZoom={4}
				options={{ gestureHandling: 'greedy' }}
				onLoad={({ map }) => {
					mapRef.current = map
				}}
				onChange={({ bbox, zoom }) => setView({ bbox, zoom })}
			>
				{clusters.map((feature) => {
					const [lng, lat] = feature.geometry.coordinates as [number, number]
					if (!('cluster' in feature.properties)) {
						return (
							<Marker key={`point-${feature.properties.id}`} lat={lat} lng={lng}>
								<Dot />
							</Marker>
						)
					}
					const { cluster_id: clusterId, point_count: count } = feature.properties
					const size = 28 + Math.min(32, Math.sqrt(count) * 1.4)
					return (
						<Marker
							key={`cluster-${clusterId}`}
							lat={lat}
							lng={lng}
							zIndex={count}
							title={`${count} points`}
							onClick={() => {
								mapRef.current?.moveCamera({
									center: { lat, lng },
									zoom: Math.min(index.getClusterExpansionZoom(clusterId), 16),
								})
							}}
						>
							<ClusterBubble count={count} size={size} />
						</Marker>
					)
				})}
			</DemoMap>
		</DemoFrame>
	)
}
