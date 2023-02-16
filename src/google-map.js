import { arrayOf, bool, func, node, number, object, oneOf, oneOfType, string } from 'prop-types'
import React, { forwardRef } from 'react'
import { useGoogleMaps } from './hooks/useGoogleMaps'
import MapComponent from './map/map'

const GoogleMap = forwardRef(function GoogleMap(
	{
		apiKey,
		libraries,
		children,
		loadingContent,
		idleContent,
		errorContent,
		mapMinHeight,
		containerProps,
		loadScriptExternally,
		status,
		scriptCallback,
		...props
	},
	ref
) {
	const renderers = {
		ready: <MapComponent {...props}>{children}</MapComponent>,
		loading: loadingContent,
		idle: idleContent,
		error: errorContent,
	}

	const _status = useGoogleMaps({ apiKey, libraries, loadScriptExternally, status, callback: scriptCallback })

	return (
		<div
			style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'relative', minHeight: mapMinHeight }}
			ref={ref}
			{...containerProps}
		>
			{renderers[_status] || null}
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
	loadScriptExternally: false,
	status: 'idle',
	scriptCallback: () => {},
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
	/**
	 * Whether to load the Google Maps script externally.
	 * If true, the status prop will be used to control the loading of the script.
	 * If false, the script will be loaded automatically.
	 * @default false
	 */
	loadScriptExternally: bool,
	/**
	 * The forced status of the Google Maps script.
	 * @default 'idle'
	 */
	status: oneOf(['idle', 'loading', 'ready', 'error']),
	/**
	 * The callback function to pass to the Google Maps script.
	 * @default () => {}
	 */
	scriptCallback: func,
}

export default GoogleMap
