# Changelog

This file covers the 2.x line, which lives on the `v2` branch. 3.x is the current major and lives on `main`.

2.x releases are published with the `latest-v2` dist-tag, so they never replace `latest`. To stay on 2.x:

```bash
npm install google-maps-react-markers@2
```

Releases up to 2.0.15 are described in the [GitHub releases](https://github.com/giorgiabosello/google-maps-react-markers/releases).

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
