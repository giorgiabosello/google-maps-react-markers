# google-maps-react-markers

> Google Maps library with markers as react components

[![NPM](https://img.shields.io/npm/v/google-maps-react-markers.svg)](https://www.npmjs.com/package/google-maps-react-markers) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn install --save google-maps-react-markers
```

or

```bash
npm install --save google-maps-react-markers
```

## Usage

```jsx
import GoogleMap from "google-maps-react-markers";

const coordinates = [
	{
		lat: 45.4046987,
		lng: 12.2472504,
		name: "Venice",
	},
	{
		lat: 41.9102415,
		lng: 12.3959151,
		name: "Rome",
	},
	{
		lat: 45.4628328,
		lng: 9.1076927,
		name: "Milan",
	},
];

const Map = () => {
	return (
		<GoogleMap defaultCenter={{ lat: 45.4046987, lng: 12.2472504 }} defaultZoom={5} options={mapOptions}>
			{coordinates.map(({ lat, lng, name }, index) => (
				<Marker key={index} lat={lat} lng={lng} markerId={name} />
			))}
		</GoogleMap>
	);
};

export default Map;
```

## Props

| Prop                       | Type     | Default                     | Description                               |
| -------------------------- | -------- | --------------------------- | ----------------------------------------- |
| apiKey - _required_        | string   | `''`                        | Api Key to load Google Maps               |
| defaultCenter - _required_ | object   | `{ lat: 0, lng: 0 }`        | Default center of the map                 |
| defaultZoom - _required_   | number   | `1-20`                      | Default zoom of the map                   |
| libraries                  | array    | `['places', 'geometry']`    | Libraries to load                         |
| options                    | object   | `{}`                        | Options for the map                       |
| onGoogleApiLoaded          | function | `() => {}`                  | Callback when the map is loaded           |
| onChange                   | function | `() => {}`                  | Callback when the map has changed         |
| children                   | node     | `null`                      | Markers of the map                        |
| loadingContent             | node     | `'Google Maps is loading'`  | Content to show while the map is loading  |
| idleContent                | node     | `'Google Maps is on idle'`  | Content to show when the map is idle      |
| errorContent               | node     | `'Google Maps is on error'` | Content to show when the map has an error |
| mapMinHeight               | string   | `'unset'`                   | Min height of the map                     |
| containerProps             | object   | `{}`                        | Props for the div container of the map    |

## License

MIT © [giorgiabosello](https://github.com/giorgiabosello)
