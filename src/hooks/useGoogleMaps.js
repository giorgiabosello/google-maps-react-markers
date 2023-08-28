import { useScript } from './useScript'

/**
 * @returns {"idle" | "loading" | "ready" | "error"} status
 */
export const useGoogleMaps = ({
	apiKey,
	libraries = [],
	loadScriptExternally = false,
	status = 'idle',
	externalApiParams,
	callback,
}) => {
	// eslint-disable-next-line no-undef
	if (typeof window !== 'undefined') window.googleMapsCallback = callback
	const apiParams = new URLSearchParams(externalApiParams)?.toString()
	const script = apiKey
		? {
				src: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=googleMapsCallback&libraries=${libraries?.join(
					',',
				)}${apiParams ? '&' + apiParams : ''}`,
				attributes: { id: 'googleMapsApi' },
		  }
		: {
				src: `https://maps.googleapis.com/maps/api/js?callback=googleMapsCallback&libraries=${libraries?.join(',')}`,
				attributes: { id: 'googleMapsApi' },
		  }

	return useScript(script, loadScriptExternally ? status : undefined)
}
