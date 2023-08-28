import { bool, func, node, number, object, shape, string } from 'prop-types'
import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import useMemoCompare from '../hooks/useMemoCompare'
import createOverlay from './overlay'

/**
 * @param {google.maps.MapPanes} pane - The pane on which to display the overlay. This is the Pane name, not the Pane itself. Defaults to floatPane.
 * @param {google.maps.LatLng | google.maps.LatLngLiteral} position - The geographical location of the overlay.
 * @param {google.maps.Map} map - The map on which to display the overlay.
 * @param {google.maps} maps - The Google Maps API.
 * @param {number} zIndex - The z-index of the overlay.
 * @param {ReactNode} children - The children of the OverlayView - the Marker component.
 * @param {object} drag - The drag configuration of the overlay.
 * @param {boolean} drag.draggable - If true, the marker can be dragged. Default value is false.
 * @param {function} drag.onDragStart - This event is fired when the user starts dragging the marker.
 * @param {function} drag.onDrag - This event is repeatedly fired while the user drags the marker.
 * @param {function} drag.onDragEnd - This event is fired when the user stops dragging the marker.
 * @returns {void}
 * @ref [MapPanes](https://developers.google.com/maps/documentation/javascript/reference/overlay-view#MapPanes)
 */
const OverlayView = ({ pane = 'floatPane', position, map, maps, zIndex = 0, children, drag }) => {
	const container = useMemo(() => {
		// eslint-disable-next-line no-undef
		const div = document.createElement('div')
		div.style.position = 'absolute'
		return div
	}, [])

	const overlay = useMemo(() => {
		return createOverlay({ container, pane, position, maps, drag })
	}, [container, drag, maps, pane, position])

	// Because React does not do deep comparisons, a custom hook is used.
	// This fixes the issue where the overlay is not updated when the position changes.
	const childrenProps = useMemoCompare(children?.props, (prev, next) => {
		return prev && prev.lat === next.lat && prev.lng === next.lng
	})

	useEffect(() => {
		if (!overlay.map) {
			overlay?.setMap(map)
			return () => {
				overlay?.setMap(null)
			}
		}
		// overlay depends on map, so we don't need to add it to the dependency array
		// otherwise, it will re-render the overlay every time the map changes
		//? added childrenProps to the dependency array to re-render the overlay when the children props change.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [map, childrenProps])

	// to move the container to the foreground and background
	useEffect(() => {
		container.style.zIndex = `${zIndex}`
	}, [zIndex, container])

	return createPortal(children, container)
}

OverlayView.propTypes = {
	/**
	 * The HTML container element for the overlay.
	 * @ref [MapPanes](https://developers.google.com/maps/documentation/javascript/reference/overlay-view#MapPanes)
	 * @default 'floatPane'
	 * @type {google.maps.MapPanes}
	 */
	pane: string,
	/**
	 * The geographical location of the overlay.
	 * @type {google.maps.LatLng | google.maps.LatLngLiteral}
	 * @required
	 * @ref [LatLng](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng)
	 */
	position: shape({
		lat: number.isRequired,
		lng: number.isRequired,
	}).isRequired,
	/**
	 * The map on which to display the overlay.
	 * @type {google.maps.Map}
	 * @required
	 * @ref [Map](https://developers.google.com/maps/documentation/javascript/reference/map#Map)
	 */
	map: object.isRequired,
	/**
	 * The Google Maps API.
	 * @type {object}
	 * @required
	 * @ref [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference)
	 */
	maps: object.isRequired,
	/**
	 * The z-index of the overlay.
	 * @type {number}
	 * @default 0
	 */
	zIndex: number,
	/**
	 * The children of the OverlayView.
	 * @type {ReactNode}
	 * @required
	 * @ref [ReactNode](https://reactjs.org/docs/react-api.html#reactnode)
	 */
	children: node.isRequired,
	/**
	 * The drag configuration of the overlay.
	 * @type {object}
	 * @default { draggable: false, onDragStart: noop, onDrag: noop, onDragEnd: noop }
	 */
	drag: shape({
		draggable: bool,
		onDragStart: func,
		onDrag: func,
		onDragEnd: func,
	}),
}

export default OverlayView
