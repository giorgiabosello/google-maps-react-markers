import { LatLngLiteral } from 'google-maps-react-markers'
import React from 'react'

interface MarkerProps {
	className?: string
	draggable: boolean
	lat: number
	lng: number
	markerId: string
	onClick?: (
		e: React.MouseEvent<HTMLImageElement, MouseEvent>,
		props: { lat: number; lng: number; markerId: string },
	) => void
	onDrag?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>, props: { latLng: LatLngLiteral }) => void
	onDragEnd?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>, props: { latLng: LatLngLiteral }) => void
	onDragStart?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>, props: { latLng: LatLngLiteral }) => void
}

const Marker = ({
	className,
	lat,
	lng,
	markerId,
	onClick,
	draggable,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onDrag,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onDragEnd,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onDragStart,
	...props
}: MarkerProps) =>
	lat && lng ? (
		// eslint-disable-next-line @next/next/no-img-element, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
		<img
			className={className}
			src={`${process.env.NEXT_PUBLIC_MEDIA_URL ?? '/google-maps-react-markers'}/marker-pin${
				draggable ? '-draggable' : ''
			}.png`}
			// lat={lat}
			// lng={lng}
			onClick={(e) => (onClick ? onClick(e, { markerId, lat, lng }) : null)}
			style={{ fontSize: 40 }}
			alt={markerId}
			width={35}
			height={35}
			{...props}
		/>
	) : null

export default Marker
