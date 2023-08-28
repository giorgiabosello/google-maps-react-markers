export default createOverlay;
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
declare function createOverlay({ container, pane, position, maps, drag }: HTMLElement): void;
declare namespace createOverlay {
    namespace propTypes {
        let container: any;
        let pane: google.maps.MapPanes;
        let position: google.maps.LatLng | google.maps.LatLngLiteral;
        let maps: any;
        let drag: object;
    }
}
//# sourceMappingURL=overlay.d.ts.map