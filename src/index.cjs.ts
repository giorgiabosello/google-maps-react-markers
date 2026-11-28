import GoogleMap from './google-map'
import { useMap, useMapsLibrary } from './map/hooks/useMap'
import MapControl from './map/map-control'

// CommonJS entry. Up to 2.0.x `require()` returned the component itself: keep it that way,
// with `default` and the named exports attached to it.
export default Object.assign(GoogleMap, { default: GoogleMap, MapControl, useMap, useMapsLibrary })
