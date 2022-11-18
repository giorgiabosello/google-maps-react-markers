import { func, number, oneOfType, shape, string } from "prop-types";
import markerPin from "./marker-pin.png";

const Marker = ({ className, lat, lng, markerId, onClick, markerProps }) => {
	return (
		<img
			className={className}
			src={markerPin}
			lat={lat}
			lng={lng}
			onClick={() => (onClick ? onClick(markerId) : null)}
			sx={{ cursor: "pointer", fontSize: 40 }}
			alt={markerId}
			{...markerProps}
		/>
	);
};

Marker.defaultProps = {};
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
	markerProps: shape({ ...Image.propTypes }),
};

export default Marker;
