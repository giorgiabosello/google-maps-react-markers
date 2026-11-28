import type { MarkerAnchor } from '../types'

const PRESETS = {
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

export interface AnchorPoint {
	x: number
	y: number
}

export const resolveAnchor = (anchor: MarkerAnchor = 'center'): AnchorPoint =>
	typeof anchor === 'string' ? PRESETS[anchor] : anchor

/** Stable key for an anchor, so effects re-run only when it really changes. */
export const anchorKey = (anchor: MarkerAnchor | undefined): string => {
	const { x, y } = resolveAnchor(anchor)
	return `${x},${y}`
}
