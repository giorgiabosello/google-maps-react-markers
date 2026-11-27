import { createContext, use } from 'react'
import type { GoogleMapsStatus } from './types'

export interface GoogleMapContextValue {
	map: google.maps.Map | null
	/** Resolved renderer for markers, `null` until the map exists. */
	renderer: 'advanced' | 'overlay' | null
	status: GoogleMapsStatus
}

export const GoogleMapContext = createContext<GoogleMapContextValue | null>(null)

export const useGoogleMapContext = (component: string): GoogleMapContextValue => {
	const context = use(GoogleMapContext)
	if (!context) throw new Error(`[google-maps-react-markers] <${component}> must be rendered inside <GoogleMap>.`)
	return context
}
