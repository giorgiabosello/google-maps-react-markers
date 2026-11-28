'use client'

import { Marker } from 'google-maps-react-markers'
import { DemoFrame, DemoMap } from './demo-map'
import { Avatar } from './pins'

const team = [
	{ initials: 'GB', lat: 45.4408, lng: 12.3155 },
	{ initials: 'AL', lat: 51.5072, lng: -0.1276 },
	{ initials: 'MR', lat: 40.4168, lng: -3.7038 },
	{ initials: 'KS', lat: 52.52, lng: 13.405 },
]

/**
 * JSON `styles` need a map without mapId: the overlay renderer kicks in automatically.
 * `coverStyle` swaps the light and dark JSON with the site theme, through the reactive options.
 */
export const StyledMapDemo = () => (
	<DemoFrame>
		<DemoMap
			coverStyle
			defaultCenter={{ lat: 47, lng: 6 }}
			defaultZoom={4}
			options={{ disableDefaultUI: true, gestureHandling: 'cooperative' }}
		>
			{team.map((member) => (
				<Marker key={member.initials} lat={member.lat} lng={member.lng} anchor="bottom">
					<Avatar initials={member.initials} stem />
				</Marker>
			))}
		</DemoMap>
	</DemoFrame>
)
