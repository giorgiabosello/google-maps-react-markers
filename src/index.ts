declare global {
	interface Window {
		google?: any
		googleMapsCallback?: () => void
	}
}

export { default as GoogleMap } from './google-map'
