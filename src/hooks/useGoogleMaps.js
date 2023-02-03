import { useScript } from './useScript'

/**
 * @returns {"idle" | "loading" | "ready" | "error"} status
 */
export const useGoogleMaps = ({ apiKey, libraries = [], loadScriptExternally = false, status = 'idle' }) => {
	const script = apiKey
		? {
				src: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries?.join(',')}`,
				attributes: { id: 'googleMapsApi' },
		  }
		: {
				src: `https://maps.googleapis.com/maps/api/js?libraries=${libraries?.join(',')}`,
				attributes: { id: 'googleMapsApi' },
		  }

	return useScript(script, loadScriptExternally ? status : undefined)
}
