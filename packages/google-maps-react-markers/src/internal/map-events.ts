import type { MapEventProps } from '../types'

/** Prop name → Google Maps event name. Mouse events receive `(event, map)`, the others `(map)`. */
export const MAP_EVENTS = {
	onBoundsChanged: 'bounds_changed',
	onCenterChanged: 'center_changed',
	onClick: 'click',
	onContextMenu: 'contextmenu',
	onDoubleClick: 'dblclick',
	onDrag: 'drag',
	onDragEnd: 'dragend',
	onDragStart: 'dragstart',
	onHeadingChanged: 'heading_changed',
	onIdle: 'idle',
	onMapTypeIdChanged: 'maptypeid_changed',
	onMouseMove: 'mousemove',
	onMouseOut: 'mouseout',
	onMouseOver: 'mouseover',
	onTilesLoaded: 'tilesloaded',
	onTiltChanged: 'tilt_changed',
	onZoomChanged: 'zoom_changed',
} as const satisfies Record<keyof MapEventProps, string>

export const MOUSE_EVENTS = new Set<keyof MapEventProps>([
	'onClick',
	'onContextMenu',
	'onDoubleClick',
	'onMouseMove',
	'onMouseOut',
	'onMouseOver',
])

export const MAP_EVENT_PROPS = Object.keys(MAP_EVENTS) as (keyof MapEventProps)[]
