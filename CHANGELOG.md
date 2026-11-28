# Changelog

This file covers the 2.x line, which lives on the `v2` branch. 3.x is the current major and lives on `main`.

2.x releases are published with the `latest-v2` dist-tag, so they never replace `latest`. To stay on 2.x:

```bash
npm install google-maps-react-markers@2
```

Releases up to 2.0.15 are described in the [GitHub releases](https://github.com/giorgiabosello/google-maps-react-markers/releases).

## 2.1.0

Minor release with features backported from 3.x. Nothing is removed, React 18 is still supported and the default export is the same, also with `require()`.

### Features

- `options` are reactive: changes after the first render are applied with `map.setOptions()`. Options are compared by value, so an inline object does not call `setOptions` on every render.
- Controlled `center` and `zoom` props, next to `defaultCenter` and `defaultZoom`. When they change, the map moves there. Keep them in sync with `onChange`. `defaultCenter` and `defaultZoom` are now optional in the types, since you can pass `center` and `zoom` instead.
- `onChange` also receives `bbox`, the bounds as `[westLng, southLat, eastLng, northLat]`, ready for supercluster. `center` is still `[lng, lat]`.
- Google Maps events as typed props: `onBoundsChanged`, `onCenterChanged`, `onClick`, `onContextMenu`, `onDoubleClick`, `onDrag`, `onDragEnd`, `onDragStart`, `onHeadingChanged`, `onIdle`, `onMapTypeIdChanged`, `onMouseMove`, `onMouseOut`, `onMouseOver`, `onTilesLoaded`, `onTiltChanged`, `onZoomChanged`. Mouse events receive `(event, map)` and are not fired when they happen on a marker, the others receive `(map)`. Handlers always use the latest props and state. The `events` prop is still there.
- `useMap()` and `useMapsLibrary(name)` hooks, for any component inside `GoogleMap`. `useMapsLibrary('places')` loads the library with `google.maps.importLibrary()` and returns `null` until it is loaded.
- `MapControl` component: `<MapControl position="TOP_RIGHT">` renders its children as a native map control.
- `anchor` prop on markers: which point of the marker sits on `lat`/`lng`. A preset (`'center'`, `'bottom'`, `'top-left'`, ...) or `{ x, y }` as fractions of the marker size. The default is `'center'`, as before. Use `'bottom'` for pins.
- New exported types: `MarkerProps`, `MarkerDragHandler`, `MarkerAnchor`, `MarkerAnchorPreset`, `MapEventProps`, `MapControlProps`, `MapsLibraryMap`, `BBox`.
- `@types/google.maps` is a dependency, and the type declarations start with `/// <reference types="google.maps" />`. You no longer need to install it or add it to your `tsconfig` to use the types.

### Fixes

- In React StrictMode (development), the map was created twice on the same element. Now it is created once.

### Behaviour changes

- Children of `GoogleMap` without `lat` and `lng` are rendered as they are, behind the map. Before, they were wrapped in a marker and shown at a fixed point, the initial center of the map. This is what lets `MapControl` and components that use `useMap()` live inside the map. If you used a child without coordinates as an overlay, give it `lat` and `lng`.
- `options` that really change after the first render are now applied. Before, they were ignored.
- If your project has its own `@types/google.maps`, keep it on 3.58.1 or later, so npm installs a single copy.

### Chores

- The ESM and CommonJS builds have separate entries, so `require('google-maps-react-markers')` still returns the component, now with `default`, `useMap`, `useMapsLibrary` and `MapControl` attached.
- `yarn type-check` passes again with `@types/react` 19.

## 2.0.16

Bugfix release. The API is the same as 2.0.15 and React 18 is still supported.

### Fixes

- Draggable markers: each time a marker's `lat` or `lng` changed (for example when you save the new position in `onDragEnd`), the marker got a new set of listeners without losing the old ones. After N updates, `onDragStart` and `onDragEnd` were called N+1 times per drag. Each marker now has one overlay for its whole life, and its listeners are removed when it leaves the map.
- Draggable markers: releasing the mouse outside the marker or outside the map left the drag stuck: the map stayed locked and the marker kept following the cursor. The drag now uses pointer events and ends on release anywhere, so it also works with touch and pen. The callbacks receive a `PointerEvent`, which extends `MouseEvent`.
- Draggable markers: `onDragStart`, `onDrag` and `onDragEnd` always use the latest props and state.
- Draggable markers: after a drag the map is draggable again only if it was before, so `options={{ draggable: false }}` is kept. With several markers dragged at once (multi touch), the map stays locked until the last drag ends.
- Markers are no longer recreated on every render. A re-render moves a marker only when its `lat` or `lng` change.
- `onChange` always calls the latest callback, not the one from the first render.
- `idle` listeners you add to the map (for example in `onGoogleApiLoaded`) are no longer removed by the component.

### Behaviour changes

- Only the main mouse button starts a drag. Touch and pen always do.
- While a marker is draggable, its container has `touch-action: none` and `user-select: none`, and the browser's native drag and drop (for example on an `img`) is blocked.
- During a drag the marker follows the pointer even outside the map, until you release it.
- Setting `draggable` to `false` or unmounting a marker in the middle of a drag stops the drag without calling `onDragEnd`.
- Drag needs Pointer Events, available in every current browser (Safari 13 and later).

### Chores

- Removed `docs/.env.prod` from the repository and ignored `.env*` files.
- Added `publishConfig.tag: "latest-v2"`, so a 2.x publish never takes the `latest` tag by mistake.
- `CHANGELOG.md` is now part of the npm package.
