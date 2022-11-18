import { element, number, object, shape, string } from 'prop-types'

/**
 * @param {HTMLElement} container
 * @param {google.maps.MapPanes} pane
 * @param {google.maps.LatLng | google.maps.LatLngLiteral} position
 * @param {google.maps} maps
 * @returns {void}
 */
const createOverlay = ({ container, pane, position, maps }) => {
	class Overlay extends maps.OverlayView {
		constructor(container, pane, position) {
			super()
			this.container = container
			this.pane = pane
			this.position = position
		}

		/**
		 * onAdd is called when the map's panes are ready and the overlay has been
		 * added to the map.
		 */
		onAdd = () => {
			// Add the element to the pane.
			const pane = this.getPanes()[this.pane]
			pane?.classList.add('google-map-markers-overlay')
			pane?.appendChild(this.container)
		}

		draw = () => {
			const projection = this.getProjection()
			// Computes the pixel coordinates of the given geographical location in the DOM element that holds the draggable map.
			const point = projection.fromLatLngToDivPixel(this.position)
			if (point === null) return
			this.container.style.transform = `translate(${point.x}px, ${point.y}px)`
		}

		/**
		 * The onRemove() method will be called automatically from the API if
		 * we ever set the overlay's map property to 'null'.
		 */
		onRemove = () => {
			if (this.container.parentNode !== null) {
				this.container.parentNode.removeChild(this.container)
			}
		}
	}

	return new Overlay(container, pane, position)
}

createOverlay.propTypes = {
	container: element.isRequired,
	pane: string.isRequired,
	position: shape({
		lat: number.isRequired,
		lng: number.isRequired,
	}).isRequired,
	maps: object.isRequired,
}

export default createOverlay
