import React from "react";
import GoogleMap from "google-maps-react-markers";
import mapOptions from "./map-options.json";
import Marker from "./marker";

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

const App = () => {
	return (
		<GoogleMap defaultCenter={{ lat: 45.4046987, lng: 12.2472504 }} defaultZoom={5} options={mapOptions}>
			{coordinates.map(({ lat, lng, name }, index) => (
				<Marker key={index} lat={lat} lng={lng} markerId={name} />
			))}
		</GoogleMap>
	);
};

export default App;
