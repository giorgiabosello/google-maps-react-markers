export default OverlayView;
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
declare function OverlayView({ pane, position, map, maps, zIndex, children, drag }: google.maps.MapPanes): void;
declare namespace OverlayView {
    namespace propTypes {
        export { string as pane };
        export let position: google.maps.LatLng | google.maps.LatLngLiteral;
        export let map: google.maps.Map;
        export let maps: object;
        export { number as zIndex };
        export let children: ReactNode;
        export let drag: object;
    }
}
//# sourceMappingURL=overlay-view.d.ts.map