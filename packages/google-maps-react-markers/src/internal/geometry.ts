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

/** Equality for one option value: identity, plus a structural check for nested values. */
const optionValueEqual = (a: unknown, b: unknown): boolean => {
	if (Object.is(a, b)) return true
	if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false
	try {
		return JSON.stringify(a) === JSON.stringify(b)
	} catch {
		return false
	}
}

/**
 * The options of `next` that are new or different from `previous`. Nested values (`styles`,
 * `restriction`) are compared by structure, so an inline object does not count as a change.
 * Only these go to setOptions: re-applying the others would undo changes the user made on the map,
 * for example the map type picked with Google's control.
 */
export const changedOptions = <T extends object>(previous: T | undefined, next: T | undefined): Partial<T> => {
	const changed: Partial<T> = {}
	if (!next) return changed
	for (const key of Object.keys(next) as (keyof T)[]) {
		if (!optionValueEqual(previous?.[key], next[key])) changed[key] = next[key]
	}
	return changed
}
