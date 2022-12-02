export default createOverlay;
/**
 * @param {HTMLElement} container
 * @param {google.maps.MapPanes} pane
 * @param {google.maps.LatLng | google.maps.LatLngLiteral} position
 * @param {google.maps} maps
 * @returns {void}
 */
declare function createOverlay({ container, pane, position, maps }: HTMLElement): void;
declare namespace createOverlay {
    namespace propTypes {
        const container: any;
        const pane: google.maps.MapPanes;
        const position: google.maps.LatLng | google.maps.LatLngLiteral;
        const maps: any;
    }
}
//# sourceMappingURL=overlay.d.ts.map