import { arrayOf, node, number, object, oneOfType, string } from 'prop-types'
import { forwardRef } from 'react'
import { useGoogleMaps } from './hooks/useGoogleMaps'
import MapComponent from './map/map'

const GoogleMap = forwardRef(function GoogleMap(
	{ apiKey, libraries, children, loadingContent, idleContent, errorContent, mapMinHeight, containerProps, ...props },
	ref
) {
	const status = useGoogleMaps({ apiKey, libraries })
	return (
		<div
			style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'relative', minHeight: mapMinHeight }}
			ref={ref}
			{...containerProps}
		>
			{status === 'ready' ? (
				<MapComponent {...props}>{children}</MapComponent>
			) : status === 'loading' ? (
				loadingContent
			) : status === 'idle' ? (
				idleContent
			) : status === 'error' ? (
				errorContent
			) : null}
		</div>
	)
})

GoogleMap.defaultProps = {
	...MapComponent.defaultProps,
	loadingContent: 'Google Maps is loading',
	idleContent: 'Google Maps is on idle',
	errorContent: 'Google Maps is on error',
	mapMinHeight: 'unset',
	apiKey: '',
	libraries: ['places', 'geometry'],
}

GoogleMap.propTypes = {
	...MapComponent.propTypes,
	/**
	 * The Markers on the Map.
	 */
	children: oneOfType([node, arrayOf(node)]),
	/**
	 * Content to be displayed while the map is loading.
	 */
	loadingContent: node,
	/**
	 * Content to be displayed while the map is idle.
	 */
	idleContent: node,
	/**
	 * Content to be displayed when there is an error loading the map.
	 */
	errorContent: node,
	/**
	 * The minimum height of the map.
	 */
	mapMinHeight: oneOfType([number, string]),
	/**
	 * Props to be passed to the container div.
	 */
	containerProps: object,
}

export default GoogleMap
