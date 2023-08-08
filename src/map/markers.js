import { node, object } from 'prop-types'
import React, { Children, cloneElement, isValidElement, useMemo } from 'react'
import OverlayView from './overlay-view'

const noop = () => {}

const MapMarkers = ({ children, map, maps }) => {
	const markers = useMemo(() => {
		if (!map || !maps) return []

		return Children.map(children, (child) => {
			if (isValidElement(child)) {
				const latLng = { lat: child.props.lat, lng: child.props.lng }
				const { zIndex, draggable = false, onDragStart = noop, onDrag = noop, onDragEnd = noop } = child.props || {}

				// clone child without draggable props
				child = cloneElement(child, {
					...child.props,
					draggable: undefined,
					onDragStart: undefined,
					onDrag: undefined,
					onDragEnd: undefined,
				})

				return (
					<OverlayView
						position={latLng}
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
		})
	}, [children, map, maps])

	return <div>{markers}</div>
}

MapMarkers.propTypes = {
	/**
	 * The Markers on the Map.
	 * @type {ReactNode}
	 * @required
	 */
	children: node.isRequired,
	/**
	 * The Google Maps instance.
	 * @type {object}
	 * @required
	 */
	map: object,
	/**
	 * The Google Maps API.
	 * @type {object}
	 * @required
	 */
	maps: object.isRequired,
}

export default MapMarkers
