import { Children, cloneElement, isValidElement, useMemo } from 'react'
import { MapMarkersProps } from '../utils/types'
import OverlayView from './overlay-view'

const noop = () => {}

const MapMarkers = ({ children, map, maps }: MapMarkersProps) => {
	const markers = useMemo(() => {
		if (!map || !maps) return []

		return Children.map(children, (child) => {
			if (isValidElement(child)) {
				const latLng = { lat: child.props.lat, lng: child.props.lng } as google.maps.LatLngLiteral
				const { zIndex, draggable = false, onDragStart = noop, onDrag = noop, onDragEnd = noop } = child.props || {}

				// clone child without draggable props
				// eslint-disable-next-line no-param-reassign
				child = cloneElement(child, {
					...child.props,
					// draggable: undefined,
					onDragStart: undefined,
					onDrag: undefined,
					onDragEnd: undefined,
				})

				return (
					<OverlayView
						position={new maps.LatLng(latLng.lat, latLng.lng)}
						map={map}
						maps={maps}
						zIndex={zIndex}
						drag={{
							draggable,
							onDragStart,
							onDrag,
							onDragEnd,
						}}
					>
						{child}
					</OverlayView>
				)
			}
			return null
		})
	}, [children, map, maps])

	return <div>{markers}</div>
}

export default MapMarkers
