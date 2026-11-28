import { useEffect, useReducer } from 'react'
import { MapsLibraryMap } from '../../utils/types'
import { useGoogleMapContext } from '../context'

/**
 * The `google.maps.Map` instance of the closest `GoogleMap`.
 * Use it in any child of `GoogleMap`: children without `lat` and `lng` are not markers, so they can render anything.
 * Throws when used outside `GoogleMap`: use its `onGoogleApiLoaded` prop there.
 */
export const useMap = (): google.maps.Map => useGoogleMapContext('useMap()').map

// Libraries loaded so far, shared by every map on the page.
const loadedLibraries: Partial<MapsLibraryMap> = {}

/**
 * Loads a Maps JavaScript API library with `google.maps.importLibrary()`, for example `useMapsLibrary('places')`.
 * Returns `null` until it is loaded. Use it inside `GoogleMap`, like `useMap()`.
 */
export const useMapsLibrary = <K extends keyof MapsLibraryMap>(name: K): MapsLibraryMap[K] | null => {
	useGoogleMapContext('useMapsLibrary()')
	const [, rerender] = useReducer((count: number) => count + 1, 0)

	useEffect(() => {
		if (loadedLibraries[name]) return undefined
		if (typeof google.maps.importLibrary !== 'function') {
			// eslint-disable-next-line no-console
			console.error(
				`[google-maps-react-markers] useMapsLibrary('${name}') needs google.maps.importLibrary, missing in this version of the Maps JavaScript API.`,
			)
			return undefined
		}
		let cancelled = false
		google.maps
			.importLibrary(name)
			.then((library) => {
				loadedLibraries[name] = library as MapsLibraryMap[K]
				if (!cancelled) rerender()
			})
			.catch((error: unknown) => {
				// eslint-disable-next-line no-console
				console.error(`[google-maps-react-markers] useMapsLibrary('${name}') could not load the library.`, error)
			})
		return () => {
			cancelled = true
		}
	}, [name])

	return loadedLibraries[name] ?? null
}
