import { node, object } from 'prop-types'
import { Children, isValidElement, useMemo } from 'react'
import OverlayView from './overlay-view'

const MapMarkers = ({ children, map, maps }) => {
	const markers = useMemo(() => {
		if (!map || !maps) return []

		return Children.map(children, (child) => {
			if (isValidElement(child)) {
				const latLng = { lat: child.props.lat, lng: child.props.lng }
				// set the map prop on the child component
				return (
					<OverlayView position={latLng} map={map} maps={maps}>
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
