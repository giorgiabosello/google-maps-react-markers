export default OverlayView;
/**
 * @param {HTMLElement} container
 * @param {google.maps.MapPanes} pane - The pane on which to display the overlay. This is the Pane name, not the Pane itself. Defaults to floatPane.
 * @param {google.maps.LatLng | google.maps.LatLngLiteral} position
 * @returns {void}
 * @ref [MapPanes](https://developers.google.com/maps/documentation/javascript/reference/overlay-view#MapPanes)
 */
declare function OverlayView({ position, pane, map, maps, zIndex, children }: HTMLElement): void;
declare namespace OverlayView {
    namespace defaultProps {
        const zIndex: number;
    }
    namespace propTypes {
        export { string as pane };
        export const position: google.maps.LatLng | google.maps.LatLngLiteral;
        export const map: google.maps.Map;
        export const maps: object;
        export { number as zIndex };
        export const children: ReactNode;
    }
}
//# sourceMappingURL=overlay-view.d.ts.map