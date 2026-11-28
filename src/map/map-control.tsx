import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MapControlProps } from '../utils/types'
import { useGoogleMapContext } from './context'

/** Renders React content as a native map control, for example `<MapControl position="TOP_RIGHT">`. */
const MapControl = ({ position, children }: MapControlProps) => {
	const { map } = useGoogleMapContext('<MapControl>')
	const [container, setContainer] = useState<HTMLDivElement | null>(null)

	useEffect(() => {
		const element = document.createElement('div')
		const controlPosition = typeof position === 'string' ? google.maps.ControlPosition[position] : position
		const controls = map.controls[controlPosition]
		if (!controls) return undefined
		controls.push(element)
		setContainer(element)
		return () => {
			const index = controls.getArray().indexOf(element)
			if (index !== -1) controls.removeAt(index)
			setContainer(null)
		}
	}, [map, position])

	return container ? createPortal(children, container) : null
}

export default MapControl
