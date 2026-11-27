import type { LatLngLiteral, MarkerProps } from '../types'
import type { AnchorPoint } from './anchor'

export type MarkerHandlers = Pick<MarkerProps, 'onClick' | 'onDrag' | 'onDragEnd' | 'onDragStart'>

/** What `<Marker>` needs from a renderer. Each setter is cheap and never recreates the marker. */
export interface MarkerHandle {
	destroy(): void
	setAnchor(anchor: AnchorPoint): void
	setClassName(className: string | undefined): void
	setClickable(clickable: boolean): void
	setCollisionBehavior(behavior: google.maps.CollisionBehaviorString | undefined): void
	setDraggable(draggable: boolean): void
	setPosition(position: LatLngLiteral): void
	setTitle(title: string | undefined): void
	setZIndex(zIndex: number | undefined): void
}

/** Set on every marker container: map mouse events coming from a marker are ignored. */
export const MARKER_ATTRIBUTE = 'data-gmrm-marker'

export interface MarkerInit {
	container: HTMLDivElement
	/** Returns the latest handlers from props. */
	getHandlers: () => MarkerHandlers
	map: google.maps.Map
}
