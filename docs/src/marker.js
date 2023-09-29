import { func, number, oneOfType, string } from 'prop-types'
import React from 'react'
import markerPin from './marker-pin.png'

const Marker = ({ className, lat, lng, markerId, onClick, ...props }) =>
	lat && lng ? (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
		<img
			className={className}
			src={markerPin}
			// eslint-disable-next-line react/no-unknown-property
			lat={lat}
			// eslint-disable-next-line react/no-unknown-property
			lng={lng}
			onClick={(e) => (onClick ? onClick(e, { markerId, lat, lng }) : null)}
			style={{ cursor: 'pointer', fontSize: 40 }}
			alt={markerId}
			{...props}
		/>
	) : null

Marker.propTypes = {
	className: string,
	/**
	 * The id of the marker.
	 */
	markerId: oneOfType([number, string]).isRequired,
	/**
	 * The latitude of the marker.
	 */
	lat: number.isRequired,
	/**
	 * The longitude of the marker.
	 */
	lng: number.isRequired,
	/**
	 * The function to call when the marker is clicked.
	 */
	onClick: func,
}

export default Marker
