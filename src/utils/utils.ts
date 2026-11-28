import { MarkerAnchor } from './types'

export const isArraysEqualEps = (arrayA: number[], arrayB: number[], eps = 0.000001): boolean => {
	if (arrayA.length && arrayB.length) {
		for (let i = 0; i !== arrayA.length; ++i) {
			if (Math.abs(arrayA[i] - arrayB[i]) > eps) {
				return false
			}
		}
		return true
	}
	return false
}

/** Shallow equality for plain option objects. */
export const shallowEqual = (a: object | undefined, b: object | undefined): boolean => {
	if (a === b) return true
	if (!a || !b) return false
	const keysA = Object.keys(a)
	if (keysA.length !== Object.keys(b).length) return false
	return keysA.every((key) => Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
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
	return keysA.every((key) =>
		optionValueEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
	)
}

/** Equality for one option value: identity, or the same JSON for nested values. */
const optionValueEqual = (valueA: unknown, valueB: unknown): boolean => {
	if (Object.is(valueA, valueB)) return true
	if (typeof valueA !== 'object' || typeof valueB !== 'object' || !valueA || !valueB) return false
	try {
		return JSON.stringify(valueA) === JSON.stringify(valueB)
	} catch {
		return false
	}
}

/**
 * The options that are new or different in `next`. Only these are passed to setOptions,
 * so a change to one option does not reset the others (for example a map type picked by the user).
 */
export const changedOptions = <T extends object>(previous: T | undefined, next: T): Partial<T> => {
	const changes: Partial<T> = {}
	;(Object.keys(next) as (keyof T)[]).forEach((key) => {
		if (!previous || !(key in previous) || !optionValueEqual(previous[key], next[key])) changes[key] = next[key]
	})
	return changes
}

const ANCHORS = {
	center: { x: 0.5, y: 0.5 },
	top: { x: 0.5, y: 0 },
	bottom: { x: 0.5, y: 1 },
	left: { x: 0, y: 0.5 },
	right: { x: 1, y: 0.5 },
	'top-left': { x: 0, y: 0 },
	'top-right': { x: 1, y: 0 },
	'bottom-left': { x: 0, y: 1 },
	'bottom-right': { x: 1, y: 1 },
} as const

/** Converts an anchor to fractions of the marker size. Unknown values fall back to the center. */
export const resolveAnchor = (anchor: MarkerAnchor = 'center'): { x: number; y: number } =>
	(typeof anchor === 'string' ? ANCHORS[anchor] : anchor) ?? ANCHORS.center

/** The containers of the markers, so map mouse events on a marker can be told apart. */
export const markerContainers = new WeakSet<Element>()

const isInMarker = (element: Element | null) => {
	for (let node = element; node; node = node.parentElement) {
		if (markerContainers.has(node)) return true
	}
	return false
}

/**
 * Whether a map mouse event happened over a marker. Google reports the event on its own
 * layer, so the target is not enough: check what is under the pointer too.
 */
export const isOnMarker = (event: google.maps.MapMouseEvent | undefined): boolean => {
	const domEvent = event?.domEvent
	if (!domEvent) return false
	if (domEvent.target instanceof Element && isInMarker(domEvent.target)) return true
	if (!('clientX' in domEvent) || typeof document.elementsFromPoint !== 'function') return false
	return document.elementsFromPoint(domEvent.clientX, domEvent.clientY).some(isInMarker)
}
