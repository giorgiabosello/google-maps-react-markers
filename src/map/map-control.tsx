import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MapControlProps } from '../utils/types'
import { useGoogleMapContext } from './context'

/** Renders React content as a native map control, for example `<MapControl position="TOP_RIGHT">`. */
const MapControl = ({ position, children }: MapControlProps) => {
	const { map } = useGoogleMapContext('<MapControl>')
	// One container for the whole life of the control: moving it to another position keeps the children mounted.
	const [container] = useState(() => document.createElement('div'))
	// Becomes true once the container is in the map, and stays true while it moves between positions.
	const [added, setAdded] = useState(false)

	useEffect(() => {
		const controlPosition = typeof position === 'string' ? google.maps.ControlPosition[position] : position
		const controls = controlPosition === undefined ? undefined : map.controls[controlPosition]
		if (!controls) {
			// eslint-disable-next-line no-console
			console.error(`[google-maps-react-markers] <MapControl> got an invalid position: ${String(position)}.`)
			return undefined
		}
		controls.push(container)
		setAdded(true)
		return () => {
			const index = controls.getArray().indexOf(container)
			if (index !== -1) controls.removeAt(index)
		}
	}, [map, position, container])

	return added ? createPortal(children, container) : null
}

export default MapControl
