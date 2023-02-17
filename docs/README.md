<h1 align="center">google-maps-react-markers</h1>

<p align="center">
<a href="https://www.npmjs.com/package/google-maps-react-markers" target="_blank">
<img src="https://img.shields.io/npm/v/google-maps-react-markers.svg?style=flat-square" alt="NPM" />
</a>
<a href="https://npm-stat.com/charts.html?package=google-maps-react-markers" target="_blank">
<img src="https://img.shields.io/npm/dt/google-maps-react-markers.svg?style=flat-square" alt="NPM total downloads" title="last year">
</a>
<img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square" alt="Maintained" />
<a href="https://github.com/giorgiabosello/google-maps-react-markers/blob/master/LICENCE.md" target="_blank">
<img src="https://img.shields.io/github/license/giorgiabosello/google-maps-react-markers?style=flat-square" alt="GitHub license: MIT" />
</a>
<img src="https://img.shields.io/github/stars/giorgiabosello/google-maps-react-markers?style=flat-square" alt="GitHub stars" />
<a href="https://github.com/giorgiabosello/google-maps-react-markers/issues" target="_blank">
<img src="https://img.shields.io/github/issues/giorgiabosello/google-maps-react-markers?style=flat-square" alt="GitHub open issues" />
</a>
</p>

Google Maps library that accepts markers as react components and works with React 18+.

It supports a small set of the props of [Google Map React](https://github.com/google-map-react/google-map-react). Clustering also is possible.
The library implements [Google Maps Custom Overlays](https://developers.google.com/maps/documentation/javascript/customoverlays) official library.

**If you like this library, please consider supporting me ❤️**

[![Buy me a Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/giorgiabosello)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.me/giorgiabosello)

## 🚀 Demo

<a href="https://giorgiabosello.github.io/google-maps-react-markers/" target="blank">
<img src="https://img.shields.io/website?url=https%3A%2F%2Fgiorgiabosello.github.io%2Fgoogle-maps-react-markers&logo=github&style=flat-square" />
</a>

See it in action [here](https://giorgiabosello.github.io/google-maps-react-markers/) _(API KEY not provided)_.

Demo source code is available [here](https://github.com/giorgiabosello/google-maps-react-markers/tree/master/docs/src)

## 🛠 Install

```bash
pnpm add google-maps-react-markers
```

or

```bash
yarn add google-maps-react-markers
```

or

```bash
npm install --save google-maps-react-markers
```

## 💻 Usage

```jsx
const App = () => {
  const mapRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)

  /**
   * @description This function is called when the map is ready
   * @param {Object} map - reference to the map instance
   * @param {Object} maps - reference to the maps library
   */
  const onGoogleApiLoaded = ({ map, maps }) => {
    mapRef.current = map
    setMapReady(true)
  }

  const onMarkerClick = (markerId) => {
    console.log('This is ->', markerId)
  }

  return (
    <>
      {mapReady && <div>Map is ready. See for logs in developer console.</div>}
      <GoogleMap
        apiKey=""
        defaultCenter={{ lat: 45.4046987, lng: 12.2472504 }}
        defaultZoom={5}
        options={mapOptions}
        mapMinHeight="100vh"
        onGoogleApiLoaded={onGoogleApiLoaded}
        onChange={(map) => console.log('Map moved', map)}
      >
        {coordinates.map(({ lat, lng, name }, index) => (
          <Marker key={index} lat={lat} lng={lng} markerId={name} onClick={onMarkerClick} />
        ))}
      </GoogleMap>
    </>
  )
}

export default App
```

## 🧐 Props

| Prop                 | Type     | Required | Default                     | Description                                                                                                                                             |
| -------------------- | -------- | -------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiKey               | string   | **yes**  | `''`                        | Api Key to load Google Maps                                                                                                                             |
| defaultCenter        | object   | **yes**  | `{ lat: 0, lng: 0 }`        | Default center of the map                                                                                                                               |
| defaultZoom          | number   | **yes**  | `1-20`                      | Default zoom of the map                                                                                                                                 |
| libraries            | array    | no       | `['places', 'geometry']`    | Libraries to load                                                                                                                                       |
| options              | object   | no       | `{}`                        | Options for the map                                                                                                                                     |
| onGoogleApiLoaded    | function | no       | `() => {}`                  | Callback when the map is loaded                                                                                                                         |
| onChange             | function | no       | `() => {}`                  | Callback when the map has changed                                                                                                                       |
| children             | node     | no       | `null`                      | Markers of the map                                                                                                                                      |
| loadScriptExternally | bool     | no       | `false`                     | Whether to load the Google Maps script externally.<br>If `true`, the `status` prop is required and it will be used to control the loading of the script |
| status               | string   | no       | `idle`                      | The forced status of the Google Maps script. Depends on `loadScriptExternally`.<br>It can be one of `idle`, `loading`, `ready`, `error`.                |
| loadingContent       | node     | no       | `'Google Maps is loading'`  | Content to show while the map is loading                                                                                                                |
| idleContent          | node     | no       | `'Google Maps is on idle'`  | Content to show when the map is idle                                                                                                                    |
| errorContent         | node     | no       | `'Google Maps is on error'` | Content to show when the map has an error                                                                                                               |
| mapMinHeight         | string   | no       | `'unset'`                   | Min height of the map                                                                                                                                   |
| containerProps       | object   | no       | `{}`                        | Props for the div container of the map                                                                                                                  |
| scriptCallback       | function | no       | `() => {}`                  | window global callback passed to the Google Script.                                                                                                     |

## 📍 Clustering

For clustering, follow this [guide](https://www.leighhalliday.com/google-maps-clustering) using [useSupercluster Hook](https://github.com/leighhalliday/use-supercluster), but use bounds in this way:

```jsx
const onMapChange = ({ bounds, zoom }) => {
  const ne = bounds.getNorthEast()
  const sw = bounds.getSouthWest()
  /**
   * useSupercluster accepts bounds in the form of [westLng, southLat, eastLng, northLat]
   * const { clusters, supercluster } = useSupercluster({
   *	points: points,
   *	bounds: mapBounds.bounds,
   *	zoom: mapBounds.zoom,
   * })
   */
  setMapBounds({ ...mapBounds, bounds: [sw.lng(), sw.lat(), ne.lng(), ne.lat()], zoom })
}
```

## 💻 Built with

- [React](https://reactjs.org/)
- [Google Maps Custom Overlays](https://developers.google.com/maps/documentation/javascript/customoverlays)
- [ESLint](https://eslint.org/): for linting
- [Prettier](https://prettier.io/): for code formatting

## 🗒 License

MIT © [giorgiabosello](https://github.com/giorgiabosello)

## 🙏 Support

[![Buy me a Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/giorgiabosello)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.me/giorgiabosello)

<hr>
<p align="center">
Developed with ❤️ in Italy 🇮🇹 
</p>
