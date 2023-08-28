export default MapComponent;
declare function MapComponent({ children, style, defaultCenter, defaultZoom, onGoogleApiLoaded, onChange, options, events, }: {
    children?: any;
    style?: {
        width: string;
        height: string;
        left: number;
        top: number;
        margin: number;
        padding: number;
        position: string;
    };
    defaultCenter: any;
    defaultZoom: any;
    onGoogleApiLoaded?: () => void;
    onChange?: () => void;
    options?: {};
    events?: any[];
}): any;
declare namespace MapComponent {
    namespace propTypes {
        export let children: any;
        export { object as style };
        export let defaultCenter: any;
        export let defaultZoom: any;
        export { func as onGoogleApiLoaded };
        export { func as onChange };
        export { object as options };
        export let events: any[];
    }
}
//# sourceMappingURL=map.d.ts.map