import { useScript } from './useScript'

/**
 * @returns {"idle" | "loading" | "ready" | "error"} status
 */
export const useGoogleMaps = ({ apiKey, libraries = [], loadScriptExternally = false, status = 'idle', callback }) => {
	// eslint-disable-next-line no-undef
	if (window) window.googleMapsCallback = callback
	const script = apiKey
		? {
				src: `https://maps.googleapis.com/maps/api/js?key=${apiKey}callback=googleMapsCallback&&libraries=${libraries?.join(
					','
				)}`,
				attributes: { id: 'googleMapsApi' },
		  }
		: {
				src: `https://maps.googleapis.com/maps/api/js?callback=googleMapsCallback&libraries=${libraries?.join(',')}`,
				attributes: { id: 'googleMapsApi' },
		  }

	return useScript(script, loadScriptExternally ? status : undefined)
}
