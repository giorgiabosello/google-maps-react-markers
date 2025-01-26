const coordinates = [
	{
		lat: 45.4046987,
		lng: 12.2472504,
		name: 'Store draggable',
	},
	...[...Array(300)].map((_, i) => ({
		lat: parseFloat((Math.random() * 180 - 90).toFixed(6)),
		lng: parseFloat((Math.random() * 360 - 180).toFixed(6)),
		name: `Store #${i + 1}`,
	})),
]

export default coordinates
