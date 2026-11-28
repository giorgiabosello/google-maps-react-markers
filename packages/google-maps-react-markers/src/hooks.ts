import { use, useEffect, useSyncExternalStore } from 'react'
import { GoogleMapContext } from './context'
import { getLoadedLibrary, getServerStatus, getStatus, isConfigured, loadLibrary, subscribe } from './loader'
import type { GoogleMapsStatus } from './types'

/**
 * The `google.maps.Map` instance of the closest `<GoogleMap>`, or `null` while it is loading
 * (and on the server). Throws when used outside `<GoogleMap>`: use its `onLoad` prop there.
 */
export const useMap = (): google.maps.Map | null => {
	const context = use(GoogleMapContext)
	if (!context) {
		throw new Error('[google-maps-react-markers] useMap() must be used inside <GoogleMap>. Outside it, use onLoad.')
	}
	return context.map
}

/** Loading status of the Google Maps JavaScript API. Always `'loading'` on the server. */
export const useGoogleMapsStatus = (): GoogleMapsStatus => useSyncExternalStore(subscribe, getStatus, getServerStatus)

const getServerLibrary = () => null

/**
 * Loads a Maps JavaScript API library, for example `useMapsLibrary('places')`.
 * Returns `null` until it is loaded (and on the server). Works anywhere in the page,
 * as soon as a `<GoogleMap>` has configured the loader.
 */
export const useMapsLibrary = <T extends keyof google.maps.ImportLibraryMap>(
	name: T,
): google.maps.ImportLibraryMap[T] | null => {
	const library = useSyncExternalStore(subscribe, () => getLoadedLibrary(name), getServerLibrary)
	const configured = useSyncExternalStore(subscribe, isConfigured, () => false)

	useEffect(() => {
		if (configured && !library) {
			loadLibrary(name).catch(() => {
				// The status hook reports load errors.
			})
		}
	}, [configured, library, name])

	return library
}
