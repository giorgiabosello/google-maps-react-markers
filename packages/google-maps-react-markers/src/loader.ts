import { type APIOptions, importLibrary, setOptions } from '@googlemaps/js-api-loader'
import type { GoogleMapsLoaderOptions, GoogleMapsStatus } from './types'

type LibraryName = keyof google.maps.ImportLibraryMap

declare global {
	interface Window {
		gm_authFailure?: () => void
	}
}

const isDev = process.env.NODE_ENV !== 'production'

let configured = false
/** The page loaded the API on its own (script tag or another loader). */
let external = false
/** Resolves once a Maps script added by the page has finished loading. */
let externalReady: Promise<void> | null = null
let configuredKey: string | undefined
let status: GoogleMapsStatus = 'loading'
let error: Error | null = null
let mapsPromise: Promise<void> | null = null
const libraries = new Map<LibraryName, unknown>()
const libraryPromises = new Map<LibraryName, Promise<unknown>>()
const listeners = new Set<() => void>()

const emit = () => {
	for (const listener of listeners) listener()
}

const setStatus = (next: GoogleMapsStatus, nextError: Error | null = null) => {
	status = next
	error = nextError
	emit()
}

/** Subscribes to loader changes (status and loaded libraries). */
export const subscribe = (listener: () => void) => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

export const getStatus = (): GoogleMapsStatus => status
export const getServerStatus = (): GoogleMapsStatus => 'loading'
export const getError = (): Error | null => error
export const isConfigured = () => configured
export const getLoadedLibrary = <T extends LibraryName>(name: T) =>
	(libraries.get(name) as google.maps.ImportLibraryMap[T] | undefined) ?? null

const configure = (options: GoogleMapsLoaderOptions) => {
	if (configured) {
		if (isDev && options.apiKey !== configuredKey) {
			console.warn(
				'[google-maps-react-markers] The Google Maps API is already loaded with other options. ' +
					'Only the options of the first <GoogleMap> are used.',
			)
		}
		return
	}
	configured = true
	configuredKey = options.apiKey

	// Google calls this global when the API key is rejected.
	const previousAuthFailure = window.gm_authFailure
	window.gm_authFailure = () => {
		previousAuthFailure?.()
		setStatus('error', new Error('Google Maps rejected the API key. Check the key and its HTTP referrer restrictions.'))
	}

	// If the page already loads the API (script tag or another loader), reuse it.
	const existing = (window as unknown as { google?: { maps?: { importLibrary?: unknown } } }).google
	if (existing?.maps?.importLibrary) {
		external = true
		return
	}
	// A <script> tag for the API is still loading: wait for it instead of loading a second copy.
	const script = document.querySelector<HTMLScriptElement>('script[src*="maps.googleapis.com/maps/api/js"]')
	if (script) {
		external = true
		externalReady = new Promise((resolve, reject) => {
			script.addEventListener('load', () => resolve(), { once: true })
			script.addEventListener('error', () => reject(new Error('The Google Maps script on the page failed to load.')), {
				once: true,
			})
		})
		return
	}

	const apiOptions: APIOptions = {
		key: options.apiKey,
		v: options.version ?? 'weekly',
		language: options.language,
		region: options.region,
		mapIds: options.mapIds?.length ? options.mapIds : undefined,
		authReferrerPolicy: options.authReferrerPolicy,
		channel: options.channel,
		solutionChannel: 'GMP_GMRM_v3',
	}
	// The bootstrap turns every key into a URL parameter: drop empty ones, or Google receives "undefined".
	const defined = Object.fromEntries(
		Object.entries(apiOptions).filter(([, value]) => value !== undefined && value !== ''),
	) as APIOptions
	setOptions(defined)
	emit()
}

/**
 * Loads a Maps JavaScript API library once and caches it.
 * Waits for the first `<GoogleMap>` to configure the loader.
 */
export const loadLibrary = <T extends LibraryName>(name: T): Promise<google.maps.ImportLibraryMap[T]> => {
	let promise = libraryPromises.get(name)
	if (!promise) {
		const imported: Promise<unknown> = external
			? (externalReady ?? Promise.resolve()).then(() => google.maps.importLibrary(name))
			: importLibrary(name)
		promise = imported.then((library) => {
			libraries.set(name, library)
			emit()
			return library
		})
		libraryPromises.set(name, promise)
	}
	return promise as Promise<google.maps.ImportLibraryMap[T]>
}

/** Configures the loader with the first options it receives and loads the core and maps libraries. */
export const loadGoogleMaps = (options: GoogleMapsLoaderOptions): Promise<void> => {
	configure(options)
	if (!mapsPromise) {
		const names: LibraryName[] = ['core', 'maps', ...(options.libraries ?? [])]
		mapsPromise = Promise.all(names.map((name) => loadLibrary(name))).then(
			() => {
				// An auth failure can arrive before the libraries resolve: keep the error.
				if (status !== 'error') setStatus('ready')
			},
			(reason: unknown) => {
				setStatus('error', reason instanceof Error ? reason : new Error(String(reason)))
				throw reason
			},
		)
	}
	return mapsPromise
}

/** @internal Test helper: forgets everything the loader knows. */
export const resetLoaderForTests = () => {
	configured = false
	external = false
	externalReady = null
	configuredKey = undefined
	status = 'loading'
	error = null
	mapsPromise = null
	libraries.clear()
	libraryPromises.clear()
	listeners.clear()
}
