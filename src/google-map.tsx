import { forwardRef } from 'react'
import { useGoogleMaps } from './map/hooks/useGoogleMaps'
import MapComponent from './map/map'
import { GoogleMapProps } from './utils/types'

const GoogleMap = forwardRef<HTMLDivElement, GoogleMapProps>(
	(
		{
			apiKey = '',
			libraries = ['places', 'geometry'],
			children = null,
			loadingContent = 'Google Maps is loading',
			idleContent = 'Google Maps is on idle',
			errorContent = 'Google Maps is on error',
			mapMinHeight = 'unset',
			containerProps = {},
			loadScriptExternally = false,
			status: statusProp = 'idle',
			scriptCallback = () => {},
			externalApiParams = {},
			...props
		},
		ref,
	) => {
		const renderers = {
			ready: <MapComponent {...props}>{children}</MapComponent>,
			loading: loadingContent,
			idle: idleContent,
			error: errorContent,
		}

		const status = useGoogleMaps({
			apiKey,
			libraries,
			loadScriptExternally,
			status: statusProp,
			externalApiParams,
			callback: scriptCallback,
		})

		return (
			<div
				ref={ref}
				style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'relative', minHeight: mapMinHeight }}
				{...containerProps}
			>
				{renderers[status] || null}
			</div>
		)
	},
)

export default GoogleMap
