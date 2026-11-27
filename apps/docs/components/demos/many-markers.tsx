'use client'

import { Marker, type MarkerRenderer } from 'google-maps-react-markers'
import { createContext, use, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { generatePoints } from '@/lib/random'
import { demoMapId } from '@/lib/shared'
import { DemoFrame, DemoMap, ToggleGroup } from './demo-map'
import { Dot } from './pins'
import { useFps } from './use-fps'

const COUNTS = [500, 1000, 2000, 5000] as const
const RENDERERS = [
	{ label: 'Advanced', value: 'advanced' },
	{ label: 'Overlay', value: 'overlay' },
] as const

type Renderer = Exclude<MarkerRenderer, 'auto'>

/** Counts mounted markers, so we can time how long N markers take to appear. */
const noop = (_delta: number) => undefined
const MountContext = createContext<(delta: number) => void>(noop)

const CountedDot = () => {
	const report = use(MountContext)
	useLayoutEffect(() => {
		report(1)
		return () => report(-1)
	}, [report])
	return <Dot />
}

/** Hundreds to thousands of React markers, no clustering: pan and zoom and watch the FPS. */
export const ManyMarkersDemo = () => {
	const [count, setCount] = useState<number>(500)
	const [renderer, setRenderer] = useState<Renderer>('advanced')
	const [mountTime, setMountTime] = useState<number | null>(null)
	const points = useMemo(() => generatePoints(count), [count])
	const { fps, lowest, resetLowest } = useFps()

	const mounted = useRef(0)
	const startedAt = useRef<number | null>(null)
	const target = useRef(count)

	const startTimer = () => {
		startedAt.current = performance.now()
		setMountTime(null)
		resetLowest()
	}

	const report = useMemo(
		() => (delta: number) => {
			mounted.current += delta
			if (startedAt.current !== null && mounted.current === target.current) {
				setMountTime(Math.round(performance.now() - startedAt.current))
				startedAt.current = null
			}
		},
		[],
	)

	return (
		<DemoFrame
			className="h-[520px]"
			toolbar={
				<>
					<ToggleGroup
						label="Markers"
						value={count}
						options={COUNTS.map((value) => ({ label: value.toLocaleString('en'), value }))}
						onChange={(value) => {
							// Set the target before rendering: new markers report while they mount.
							target.current = value
							startTimer()
							setCount(value)
						}}
					/>
					<ToggleGroup
						label="Renderer"
						value={renderer}
						options={RENDERERS}
						onChange={(value) => {
							startTimer()
							setRenderer(value)
						}}
					/>
				</>
			}
			footer={
				<div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-fd-muted-foreground">
					<span>
						FPS <span className="text-fd-foreground">{fps ?? '…'}</span>
					</span>
					<span>
						Lowest <span className="text-fd-foreground">{lowest ?? '…'}</span>
					</span>
					<span>
						{`${count.toLocaleString('en')} markers on the map in `}
						<span className="text-fd-foreground">{mountTime === null ? '…' : `${mountTime} ms`}</span>
					</span>
					<span>Same points on every load (seeded).</span>
				</div>
			}
		>
			<MountContext value={report}>
				<DemoMap
					mapId={demoMapId}
					markerRenderer={renderer}
					defaultCenter={{ lat: 48, lng: 10 }}
					defaultZoom={4}
					options={{ gestureHandling: 'greedy' }}
					onLoad={startTimer}
				>
					{points.map((point) => (
						<Marker key={point.id} lat={point.lat} lng={point.lng}>
							<CountedDot />
						</Marker>
					))}
				</DemoMap>
			</MountContext>
		</DemoFrame>
	)
}
