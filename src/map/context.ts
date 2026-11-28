import { createContext, useContext } from 'react'
import { MapContextProps } from '../utils/types'

export const GoogleMapContext = createContext<MapContextProps | null>(null)

export const useGoogleMapContext = (name: string): MapContextProps => {
	const context = useContext(GoogleMapContext)
	if (!context) throw new Error(`[google-maps-react-markers] ${name} must be used inside <GoogleMap>.`)
	return context
}
