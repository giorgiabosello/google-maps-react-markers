# google-maps-react-markers

## 3.0.0

### Major Changes

- [#395](https://github.com/giorgiabosello/google-maps-react-markers/pull/395) [`948c94c`](https://github.com/giorgiabosello/google-maps-react-markers/commit/948c94c) Thanks [@giorgiabosello](https://github.com/giorgiabosello)! - v3: rewrite for React 19 and Next.js 16.

  - New `<Marker lat lng>` component: put any React content inside. Children with `lat`/`lng` are no longer cloned.
  - Markers use `AdvancedMarkerElement` when the map has a `mapId`, and a rewritten overlay otherwise (`markerRenderer` to choose).
  - Drag and drop with mouse and touch on both renderers; `anchor`, `zIndex`, `title`, `onClick` on markers.
  - Map events as props, reactive `options`, controlled `center` and `zoom`, `onChange` with `{ center, zoom, bounds, bbox }`.
  - `useMap()`, `useMapsLibrary()`, `useGoogleMapsStatus()` and `<MapControl>`.
  - Loads the API with `@googlemaps/js-api-loader`, once per page, and reuses an API already on the page.
  - Server rendering and React Server Components: no `window` access during render, hydration without mismatches.
  - ESM only, React 19 peer dependency, Node.js 22.12+.

  See the migration guide: https://giorgiabosello.github.io/google-maps-react-markers/docs/migration/v3
