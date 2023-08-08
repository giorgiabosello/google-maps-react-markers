import { bool, element, func, number, object, shape, string } from 'prop-types'

// return lat, lng from LatLngLiteral
const getLatLng = (LatLng) => {
	try {
		const latLng = { lat: LatLng.lat(), lng: LatLng.lng() }
		return latLng
	} catch (e) {
		return LatLng
	}
}

/**
 * @param {HTMLElement} container - The HTML container element for the overlay.
 * @param {google.maps.MapPanes} pane - The HTML container element for the overlay.
 * @param {google.maps.LatLng | google.maps.LatLngLiteral} position - The geographical location of the overlay.
 * @param {google.maps} maps - The Google Maps API.
 * @param {object} drag - The drag configuration of the overlay.
 * @param {boolean} drag.draggable - If true, the marker can be dragged. Default value is false.
 * @param {function} drag.onDragStart - This event is fired when the user starts dragging the marker.
 * @param {function} drag.onDrag - This event is repeatedly fired while the user drags the marker.
 * @param {function} drag.onDragEnd - This event is fired when the user stops dragging the marker.
 * @returns {void}
 */
const createOverlay = ({ container, pane, position, maps, drag }) => {
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
			let that = this
			// manage draggable
			if (drag?.draggable) {
				maps.event.addDomListener(this.get('map').getDiv(), 'mouseleave', () => {
					maps.event.trigger(container, 'mouseup')
				})
				maps.event.addDomListener(this.container, 'mousedown', (e) => {
					this.container.style.cursor = 'grabbing'
					that.map.set('draggable', false)
					that.set('origin', e)

					drag.onDragStart(e, { latLng: getLatLng(this.position) })

					that.moveHandler = maps.event.addDomListener(this.get('map').getDiv(), 'mousemove', (e) => {
						let origin = that.get('origin'),
							left = origin.clientX - e.clientX,
							top = origin.clientY - e.clientY,
							pos = that.getProjection().fromLatLngToDivPixel(that.position),
							latLng = that.getProjection().fromDivPixelToLatLng(new maps.Point(pos.x - left, pos.y - top))
						that.set('position', latLng)
						that.set('origin', e)
						that.draw()
						drag.onDrag(e, { latLng: getLatLng(latLng) })
					})
				})

				maps.event.addDomListener(container, 'mouseup', (e) => {
					that.map.set('draggable', true)
					this.container.style.cursor = 'default'
					maps.event.removeListener(that.moveHandler)
					drag.onDragEnd(e, { latLng: getLatLng(that.position) })
				})
			}
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
				// remove DOM listeners
				maps.event.clearInstanceListeners(this.container)
				this.container.parentNode.removeChild(this.container)
			}
		}
	}

	return new Overlay(container, pane, position)
}

createOverlay.propTypes = {
	/**
	 * The HTML container element for the overlay.
	 */
	container: element.isRequired,
	/**
	 * The HTML container element for the overlay.
	 * @ref [MapPanes](https://developers.google.com/maps/documentation/javascript/reference/overlay-view#MapPanes)
	 * @default 'floatPane'
	 * @type {google.maps.MapPanes}
	 * @required
	 */
	pane: string.isRequired,
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
	 * The Google Maps API.
	 */
	maps: object.isRequired,
	/**
	 * The draggable options of the overlay.
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

export default createOverlay
