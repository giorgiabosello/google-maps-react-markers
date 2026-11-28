import { Children, cloneElement, isValidElement } from 'react'
import { Drag, MapMarkersProps, MarkerProps } from '../utils/types'
import OverlayView from './overlay-view'

const noop = () => {}

const MapMarkers = ({ children, map, maps }: MapMarkersProps) => {
	const markers = Children.map(children, (child) => {
		if (!isValidElement(child)) return null

		const props = (child.props ?? {}) as Partial<MarkerProps> & Record<string, unknown>
		// Not a marker (for example MapControl, or a component that uses useMap()): render it as it is.
		if (props.lat === undefined && props.lng === undefined) return child

		const { lat, lng, anchor, zIndex, draggable = false, onDragStart = noop, onDrag = noop, onDragEnd = noop } = props

		// clone child without draggable props
		const marker = cloneElement(child, {
			...props,
			onDragStart: undefined,
			onDrag: undefined,
			onDragEnd: undefined,
		} as Record<string, unknown>)

		return (
			<OverlayView
				position={new maps.LatLng(lat as number, lng as number)}
				map={map}
				maps={maps}
				zIndex={zIndex}
				anchor={anchor}
				drag={
					{
						draggable,
						onDragStart,
						onDrag,
						onDragEnd,
					} as Drag
				}
			>
				{marker}
			</OverlayView>
		)
	})

	return <div>{markers}</div>
}

export default MapMarkers
