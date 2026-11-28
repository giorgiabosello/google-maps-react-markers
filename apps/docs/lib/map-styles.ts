import coverDark from '@/map-styles/cover-dark.json'
import coverLight from '@/map-styles/cover-light.json'

/**
 * Map styles matching the repository cover. The same JSON can be imported in the Google Cloud
 * console (Map styles) for maps with a mapId. In code, JSON styles work only without a mapId.
 */
export const coverMapStyles = coverDark as google.maps.MapTypeStyle[]
export const coverLightMapStyles = coverLight as google.maps.MapTypeStyle[]
