import React from 'react'

interface MarkerProps {
	className?: string
	lat: number
	lng: number
	markerId: string
	onClick?: (
		e: React.MouseEvent<HTMLImageElement, MouseEvent>,
		props: { lat: number; lng: number; markerId: string },
	) => void
}

const Marker = ({ className, lat, lng, markerId, onClick, ...props }: MarkerProps) =>
	lat && lng ? (
		// eslint-disable-next-line @next/next/no-img-element, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
		<img
			className={className}
			src={`${process.env.NEXT_PUBLIC_MEDIA_URL ?? '/google-maps-react-markers'}/marker-pin.png`}
			// lat={lat}
			// lng={lng}
			onClick={(e) => (onClick ? onClick(e, { markerId, lat, lng }) : null)}
			style={{ cursor: 'pointer', fontSize: 40 }}
			alt={markerId}
			width={35}
			height={35}
			{...props}
		/>
	) : null

export default Marker
