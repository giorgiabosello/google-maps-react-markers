import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import createOverlay from './overlay'

/**
 * @param {HTMLElement} container
 * @param {google.maps.MapPanes} pane - The pane on which to display the overlay. This is the Pane name, not the Pane itself. Defaults to floatPane.
 * @param {google.maps.LatLng | google.maps.LatLngLiteral} position
 * @returns {void}
 * @ref [MapPanes](https://developers.google.com/maps/documentation/javascript/reference/overlay-view#MapPanes)
 */
const OverlayView = ({ position, pane = 'floatPane', map, maps, zIndex, children }) => {
	const container = useMemo(() => {
		// eslint-disable-next-line no-undef
		const div = document.createElement('div')
		div.style.position = 'absolute'
		return div
	}, [])

	const overlay = useMemo(() => {
		return createOverlay({ container, pane, position, maps })
	}, [container, maps, pane, position])

	useEffect(() => {
		if (!overlay.map) {
			overlay?.setMap(map)
			return () => {
				overlay?.setMap(null)
			}
		}
		// overlay depends on map, so we don't need to add it to the dependency array
		// otherwise, it will re-render the overlay every time the map changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [map])

	// to move the container to the foreground and background
	useEffect(() => {
		container.style.zIndex = `${zIndex}`
	}, [zIndex, container])

	return createPortal(children, container)
}

export default OverlayView
