import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useGoogleMapContext } from './context'
import type { MapControlProps } from './types'

/** Renders React content as a native map control, for example `<MapControl position="TOP_RIGHT">`. */
export const MapControl = ({ position, children }: MapControlProps) => {
	const { map } = useGoogleMapContext('MapControl')
	// One element for the life of the control, created in the effect (never on the server).
	// A new position moves it, so the React content inside keeps its state.
	const elementRef = useRef<HTMLDivElement | null>(null)
	const [container, setContainer] = useState<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!map) return undefined
		const controlPosition = typeof position === 'string' ? google.maps.ControlPosition[position] : position
		const controls = controlPosition === undefined ? undefined : map.controls[controlPosition]
		if (!controls) {
			console.error(
				`[google-maps-react-markers] <MapControl> position ${JSON.stringify(position)} is not a google.maps.ControlPosition.`,
			)
			return undefined
		}
		const element = (elementRef.current ??= document.createElement('div'))
		controls.push(element)
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setContainer(element)
		return () => {
			const index = controls.getArray().indexOf(element)
			if (index !== -1) controls.removeAt(index)
		}
	}, [map, position])

	return container ? createPortal(children, container) : null
}
