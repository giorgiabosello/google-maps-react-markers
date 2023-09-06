import { Pane, createOverlayProps } from '../utils/types'

// return lat, lng from LatLngLiteral
const getLatLng = (LatLng: google.maps.LatLng | null) => {
	try {
		const latLng = { lat: LatLng?.lat(), lng: LatLng?.lng() }
		return latLng
	} catch (e) {
		return LatLng
	}
}

const createOverlay = ({ container, pane, position, maps, drag }: createOverlayProps) => {
	class Overlay extends google.maps.OverlayView {
		/**
		 * onAdd is called when the map's panes are ready and the overlay has been
		 * added to the map.
		 */
		onAdd = () => {
			const that = this
			// manage draggable
			if (drag?.draggable) {
				this.get('map')
					.getDiv()
					.addEventListener('mouseleave', () => {
						google.maps.event.trigger(this.container, 'mouseup')
					})
				this.container.addEventListener('mousedown', (e: MouseEvent) => {
					this.container.style.cursor = 'grabbing'
					that.map?.set('draggable', false)
					that.set('origin', e)

					drag.onDragStart(e, { latLng: getLatLng(this.position) })

					// eslint-disable-next-line no-shadow
					that.moveHandler = this.get('map')
						.getDiv()
						.addEventListener('mousemove', (evt: MouseEvent) => {
							const origin = that.get('origin')
							const left = origin.clientX - evt.clientX
							const top = origin.clientY - evt.clientY
							const pos = that.getProjection().fromLatLngToDivPixel(that.position)
							if (pos === null) return
							const latLng = that.getProjection().fromDivPixelToLatLng(new maps.Point(pos.x - left, pos.y - top))
							that.set('position', latLng)
							that.set('origin', evt)
							that.draw()
							drag.onDrag(evt, { latLng: getLatLng(latLng) })
						})
				})

				this.container.addEventListener('mouseup', (e) => {
					that.map?.set('draggable', true)
					this.container.style.cursor = 'default'
					if (that.moveHandler) {
						google.maps.event.removeListener(that.moveHandler)
						that.moveHandler = null
					}
					drag.onDragEnd(e, { latLng: getLatLng(that.position) })
				})
			}
			// Add the element to the pane.
			const currentPane = this.getPanes()?.[this.pane]
			currentPane?.classList.add('google-map-markers-overlay')
			currentPane?.appendChild(this.container)
		}

		draw = () => {
			const projection = this.getProjection()
			// Computes the pixel coordinates of the given geographical location in the DOM element that holds the draggable map.
			const point = projection.fromLatLngToDivPixel(this.position)
			if (point === null) return
			this.container.style.transform = `translate(${point.x}px, ${point.y}px)`
			this.container.style.width = '0px'
			this.container.style.height = '0px'
		}

		/**
		 * The onRemove() method will be called automatically from the API if
		 * we ever set the overlay's map property to 'null'.
		 */
		onRemove = () => {
			if (this.container.parentNode !== null) {
				// remove DOM listeners
				google.maps.event.clearInstanceListeners(this.container)
				this.container.parentNode.removeChild(this.container)
			}
		}

		public container: HTMLDivElement

		public pane: Pane

		public position: google.maps.LatLng

		public map = this.getMap()

		public moveHandler: google.maps.MapsEventListener | null

		// eslint-disable-next-line no-shadow
		constructor(container: HTMLDivElement, pane: Pane, position: google.maps.LatLng) {
			super()

			// Initialize all properties.
			this.container = container
			this.pane = pane
			this.position = position

			this.moveHandler = null
		}
	}

	return new Overlay(container, pane, position)
}

export default createOverlay
