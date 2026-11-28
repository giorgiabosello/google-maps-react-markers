<p align="center">
<img src="https://raw.githubusercontent.com/giorgiabosello/google-maps-react-markers/main/.github/cover.png" alt="Google Maps React Markers" width="100%" />
</p>

<p align="center">
<a href="https://www.npmjs.com/package/google-maps-react-markers"><img src="https://img.shields.io/npm/v/google-maps-react-markers.svg?style=flat-square&labelColor=000000" alt="npm version" /></a>
<a href="https://npm-stat.com/charts.html?package=google-maps-react-markers"><img src="https://img.shields.io/npm/dm/google-maps-react-markers.svg?style=flat-square&labelColor=000000" alt="npm downloads" /></a>
<a href="https://bundlejs.com/?q=google-maps-react-markers"><img src="https://img.shields.io/bundlejs/size/google-maps-react-markers?externals=react,react-dom,react/jsx-runtime&style=flat-square&labelColor=000000" alt="bundle size" /></a>
<a href="https://github.com/giorgiabosello/google-maps-react-markers/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/giorgiabosello/google-maps-react-markers/ci.yml?style=flat-square&labelColor=000000&label=CI" alt="CI" /></a>
<a href="https://github.com/giorgiabosello/google-maps-react-markers/blob/main/LICENCE.md"><img src="https://img.shields.io/github/license/giorgiabosello/google-maps-react-markers?style=flat-square&labelColor=000000" alt="MIT license" /></a>
</p>

**Render any React component as a Google Maps marker.** React 19, Next.js 16, advanced markers or custom overlays, drag and drop, clustering-ready, SSR safe, fully typed.

**[Documentation and live demos →](https://giorgiabosello.github.io/google-maps-react-markers/)**

## Install

```bash
npm i google-maps-react-markers
# or
pnpm add google-maps-react-markers
yarn add google-maps-react-markers
bun add google-maps-react-markers
```

- **React 19** (`react` and `react-dom` are peer dependencies).
- **ESM only.** Node.js 22.12+ for server rendering and builds.
- A **Google Maps Platform API key**, restricted to your sites. A [map ID](https://giorgiabosello.github.io/google-maps-react-markers/docs/renderers) is optional: it enables advanced markers.

Works with Next.js (App Router and Server Components), Vite, React Router, TanStack Start and Astro.

## Usage

```tsx
import { GoogleMap, Marker } from 'google-maps-react-markers'

export function StoreMap({ stores, onSelect }) {
  return (
    <GoogleMap
      apiKey="YOUR_API_KEY"
      mapId="YOUR_MAP_ID"
      defaultCenter={{ lat: 45.44, lng: 12.32 }}
      defaultZoom={6}
      style={{ height: 480 }}
      onChange={({ center, zoom, bbox }) => console.log(center, zoom, bbox)}
    >
      {stores.map((store) => (
        <Marker
          key={store.id}
          lat={store.lat}
          lng={store.lng}
          anchor="bottom"
          title={`${store.price} at ${store.name}`}
          onClick={() => onSelect(store.id)}
        >
          <PriceTag price={store.price} />
        </Marker>
      ))}
    </GoogleMap>
  )
}
```

## Features

- **Any component is a marker.** Markers are React portals: state, hooks, context and your CSS all work.
- **Two renderers, one API.** `AdvancedMarkerElement` when the map has a `mapId`, a custom overlay when it does not (so JSON `styles` keep working).
- **Drag and drop** with mouse, touch and keyboard, `anchor`, `zIndex` and clicks.
- **Fast.** Markers are created once and updated in place. The [stress test](https://giorgiabosello.github.io/google-maps-react-markers/docs/examples/many-markers) renders up to 5,000 markers.
- **Accessible.** Clickable and draggable markers are keyboard buttons with screen reader names and announcements, on both renderers.
- **SSR and React Server Components.** No `window` during render, clean hydration, `'use client'` included.
- **Hooks and controls.** `useMap()`, `useMapsLibrary()`, `useGoogleMapsStatus()`, `<MapControl>`.
- **Small and typed.** About 6 kB brotli with the official `@googlemaps/js-api-loader` included, ESM only.

## Upgrading from v2

v3 is a breaking release: markers go inside `<Marker>`, the import is named, and a few props changed. Follow the [migration guide](https://giorgiabosello.github.io/google-maps-react-markers/docs/migration/v3).

## Contributing

See [CONTRIBUTING.md](https://github.com/giorgiabosello/google-maps-react-markers/blob/main/CONTRIBUTING.md).

## Support

If this library saves you time, you can [buy me a coffee](https://www.buymeacoffee.com/giorgiabosello) or [send a PayPal tip](https://www.paypal.me/giorgiabosello).

## License

MIT © [Giorgia Bosello](https://github.com/giorgiabosello)
