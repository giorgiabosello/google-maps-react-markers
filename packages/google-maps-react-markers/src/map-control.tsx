import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useGoogleMapContext } from './context'
import type { MapControlProps } from './types'

/** Renders React content as a native map control, for example `<MapControl position="TOP_RIGHT">`. */
export const MapControl = ({ position, children }: MapControlProps) => {
	const { map } = useGoogleMapContext('MapControl')
	const [container, setContainer] = useState<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!map) return undefined
		const element = document.createElement('div')
		const controlPosition = typeof position === 'string' ? google.maps.ControlPosition[position] : position
		const controls = map.controls[controlPosition]
		if (!controls) return undefined
		controls.push(element)
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setContainer(element)
		return () => {
			const index = controls.getArray().indexOf(element)
			if (index !== -1) controls.removeAt(index)
			setContainer(null)
		}
	}, [map, position])

	return container ? createPortal(children, container) : null
}
