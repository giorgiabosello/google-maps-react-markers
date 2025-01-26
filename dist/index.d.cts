import * as React from 'react';
import React__default from 'react';

declare global {
    interface Window {
        google?: any;
        googleMapsCallback?: () => void;
    }
}
type MapMouseEvent = google.maps.MapMouseEvent;
type Map = google.maps.Map;
type MapsLibrary = typeof google.maps;
type MapPanes = google.maps.MapPanes;
type MapOptions = google.maps.MapOptions;
type LatLng = google.maps.LatLng;
type LatLngLiteral = google.maps.LatLngLiteral;
type LatLngBounds = google.maps.LatLngBounds;
type LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
/**
 * The drag configuration of the overlay.
 */
type Drag = {
    /**
     * Whether the overlay is draggable.
     * @default false
     */
    draggable: boolean;
    /**
     * Callback fired repeatedly when the overlay is dragged.
     * @param e The event.
     * @param props The props.
     */
    onDrag: (e: MouseEvent, props: {}) => void;
    /**
     * Callback fired when the drag has ended.
     * @param e The event.
     * @param props The props.
     */
    onDragEnd: (e: MouseEvent, props: {}) => void;
    /**
     * Callback fired when the drag has started.
     * @param e The event.
     * @param props The props.
     */
    onDragStart: (e: MouseEvent, props: {}) => void;
};
type UseScriptStatus = 'idle' | 'loading' | 'ready' | 'error';
type Pane = 'floatPane' | 'mapPane' | 'markerLayer' | 'overlayLayer' | 'overlayMouseTarget';
interface IUseGoogleMaps {
    /**
     * The Google Maps API key.
     */
    apiKey?: string;
    /**
     * The Google Maps API callback.
     */
    callback?: () => void;
    /**
     * The Google Maps API params to be appended to the script URL.
     * @example
     * {
     * language: 'en',
     * region: 'GB',
     * }
     */
    externalApiParams?: {
        [key: string]: any;
    };
    /**
     * The Google Maps API libraries to be loaded.
     * @default ['places', 'geometry']
     */
    libraries?: string[];
    /**
     * Whether to manage the script loading externally.
     * @default false
     */
    loadScriptExternally?: boolean;
    /**
     * The status of the script loading.
     * To be used only if `loadScriptExternally` is `true`.
     */
    status?: UseScriptStatus;
}
interface ScriptProps {
    /**
     * The attributes to be passed to the script element.
     */
    attributes?: {
        [key: string]: string;
    };
    /**
     * The callback to be called when the script has loaded
     * successfully or has failed to load.
     */
    callbacks?: {
        onErrorCallback?: () => void;
        onLoadCallback?: () => void;
    };
    /**
     * The ID of the HTML element where the script will be appended.
     * If not provided, the script will be appended to the `body` element.
     */
    elementIdToAppend?: string;
    /**
     * The URL of the script to be loaded.
     */
    src: string;
}
interface UseScriptOptions {
    /**
     * Whether to remove the script when the component unmounts.
     */
    removeOnUnmount?: boolean;
    /**
     * Whether to prevent the script from loading.
     * @default false
     */
    shouldPreventLoad?: boolean;
}
interface MapContextProps {
    /**
     * The Google Maps instance.
     */
    map: Map;
    /**
     * The Google Maps API object.
     */
    maps: MapsLibrary;
}
interface OverlayViewProps extends MapContextProps {
    /**
     * The children to be rendered within the overlay.
     */
    children?: React__default.ReactElement;
    /**
     * The drag configuration of the overlay.
     * @default { draggable: false }
     */
    drag?: Drag;
    /**
     * The map pane in which to render the overlay.
     * @default 'floatPane'
     */
    pane?: Pane | undefined;
    /**
     * The geographical coordinates of the overlay.
     */
    position: LatLng;
    /**
     * The z-index of the overlay.
     * @default 0
     */
    zIndex?: number | 0;
}
interface createOverlayProps {
    /**
     * The HTML container element in which to render the overlay.
     */
    container: HTMLDivElement;
    /**
     * The drag configuration of the overlay.
     * @default { draggable: false }
     */
    drag?: Drag;
    /**
     * The Google Maps API object.
     */
    maps: MapContextProps['maps'];
    /**
     * The map pane in which to render the overlay.
     * @default 'floatPane'
     */
    pane: Pane;
    /**
     * The geographical coordinates of the overlay.
     */
    position: LatLng;
}
interface EventProps {
    /**
     * The event handler.
     * @param e The event.
     */
    handler: (e: any) => void;
    /**
     * The HTML Event attribute name.
     * @reference https://www.w3schools.com/tags/ref_eventattributes.asp
     * @example
     * 'onClick'
     */
    name: string;
}
interface onGoogleApiLoadedProps extends MapContextProps {
    /**
     * The ref of the Map.
     */
    ref: HTMLDivElement | null;
}
interface MapMarkersProps extends MapContextProps {
    /**
     * The Markers to be rendered on the map.
     */
    children: React__default.ReactNode;
}
interface MapProps {
    /**
     * The Markers to be rendered on the map
     */
    children?: React__default.ReactNode;
    /**
     * The default center of the map.
     */
    defaultCenter: LatLngLiteral;
    /**
     * The default zoom of the map.
     */
    defaultZoom: number;
    /**
     * The events to pass to the Google Maps instance (`div`).
     * @type {Array}
     * @example
     * [
     *  {
     *   name: 'onClick',
     *   handler: (event) => { ... }
     *  }
     * ]
     */
    events?: EventProps[];
    /**
     * The callback fired when the map changes (center, zoom, bounds).
     */
    onChange?: (options: {
        bounds: LatLngBounds;
        center: (number | undefined)[];
        zoom: number;
    }) => void;
    /**
     * The callback fired when the map is loaded.
     */
    onGoogleApiLoaded?: (props: onGoogleApiLoadedProps) => void;
    /**
     * The options to pass to the Google Maps instance.
     * @reference https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
     */
    options?: MapOptions;
    /**
     * The style of the map container.
     * @default
     * {
     *  width: '100%',
     *  height: '100%',
     *  left: 0,
     *  top: 0,
     *  margin: 0,
     *  padding: 0,
     *  position: 'absolute'
     * }
     */
    style?: React__default.CSSProperties;
}
interface GoogleMapProps extends MapProps, IUseGoogleMaps {
    /**
     * The props to pass to the `div` container element.
     */
    containerProps?: React__default.HTMLAttributes<HTMLDivElement>;
    /**
     * The content to be rendered when the script fails to load.
     * @default 'Google Maps is on error'
     */
    errorContent?: React__default.ReactNode;
    /**
     * The content to be rendered when the script is on idle.
     * @default 'Google Maps is on idle'
     */
    idleContent?: React__default.ReactNode;
    /**
     * The content to be rendered while the script is loading.
     * @default 'Google Maps is loading'
     */
    loadingContent?: React__default.ReactNode;
    /**
     * The minimum height of the map container.
     * @default 'unset'
     */
    mapMinHeight?: string;
    /**
     * The Google Maps API script callback
     */
    scriptCallback?: () => void;
}

declare const GoogleMap: React.ForwardRefExoticComponent<GoogleMapProps & React.RefAttributes<HTMLDivElement>>;

export { type Drag, type EventProps, type GoogleMapProps, type IUseGoogleMaps, type LatLng, type LatLngBounds, type LatLngBoundsLiteral, type LatLngLiteral, type Map, type MapContextProps, type MapMarkersProps, type MapMouseEvent, type MapOptions, type MapPanes, type MapProps, type MapsLibrary, type OverlayViewProps, type Pane, type ScriptProps, type UseScriptOptions, type UseScriptStatus, type createOverlayProps, GoogleMap as default, type onGoogleApiLoadedProps };
