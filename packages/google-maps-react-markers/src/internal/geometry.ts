import type { BBox, LatLngLiteral } from '../types'

/** Compares two numeric arrays element by element, within `eps`. Empty arrays are never equal. */
export const isArraysEqualEps = (arrayA: readonly number[], arrayB: readonly number[], eps = 0.000001): boolean => {
	if (!arrayA.length || arrayA.length !== arrayB.length) return false
	for (let i = 0; i < arrayA.length; i++) {
		if (Math.abs((arrayA[i] as number) - (arrayB[i] as number)) > eps) return false
	}
	return true
}

/** Converts map bounds to `[westLng, southLat, eastLng, northLat]`, the format used by supercluster. */
export const boundsToBbox = (bounds: google.maps.LatLngBounds): BBox => {
	const ne = bounds.getNorthEast()
	const sw = bounds.getSouthWest()
	return [sw.lng(), sw.lat(), ne.lng(), ne.lat()]
}

export const toLatLngLiteral = (
	value: google.maps.LatLng | google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral | null | undefined,
): LatLngLiteral | null => {
	if (!value) return null
	if (typeof (value as google.maps.LatLng).lat === 'function') {
		const latLng = value as google.maps.LatLng
		return { lat: latLng.lat(), lng: latLng.lng() }
	}
	const literal = value as google.maps.LatLngLiteral
	return { lat: literal.lat, lng: literal.lng }
}

/**
 * Equality for map options: shallow, plus a structural check for nested values
 * (`styles`, `restriction`), so inline objects do not call setOptions on every render.
 */
export const optionsEqual = (a: object | undefined, b: object | undefined): boolean => {
	if (shallowEqual(a, b)) return true
	if (!a || !b) return false
	const keysA = Object.keys(a)
	if (keysA.length !== Object.keys(b).length) return false
	return keysA.every((key) => {
		const valueA = (a as Record<string, unknown>)[key]
		const valueB = (b as Record<string, unknown>)[key]
		if (Object.is(valueA, valueB)) return true
		if (typeof valueA !== 'object' || typeof valueB !== 'object' || !valueA || !valueB) return false
		try {
			return JSON.stringify(valueA) === JSON.stringify(valueB)
		} catch {
			return false
		}
	})
}

/** Shallow equality for plain option objects. */
export const shallowEqual = (a: object | undefined, b: object | undefined): boolean => {
	if (a === b) return true
	if (!a || !b) return false
	const keysA = Object.keys(a)
	if (keysA.length !== Object.keys(b).length) return false
	return keysA.every((key) => Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
}
