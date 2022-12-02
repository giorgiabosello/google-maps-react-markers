export default MapComponent;
declare function MapComponent({ children, style, defaultCenter, defaultZoom, onGoogleApiLoaded, onChange, ...props }: {
    [x: string]: any;
    children: any;
    style: any;
    defaultCenter: any;
    defaultZoom: any;
    onGoogleApiLoaded: any;
    onChange: any;
}): any;
declare namespace MapComponent {
    namespace defaultProps {
        namespace style {
            const width: string;
            const height: string;
            const left: number;
            const top: number;
            const margin: number;
            const padding: number;
            const position: string;
        }
        function onGoogleApiLoaded(): void;
        function onChange(): void;
    }
    namespace propTypes {
        export const children: any;
        export { object as style };
        export const defaultCenter: any;
        export const defaultZoom: any;
        export { func as onGoogleApiLoaded };
        export { func as onChange };
    }
}
//# sourceMappingURL=map.d.ts.map