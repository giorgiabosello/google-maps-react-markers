import React, { useEffect, useLayoutEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { OverlayViewProps } from '../utils/types'
import createOverlay from './overlay'

const OverlayView = ({
	pane = 'floatPane',
	position,
	map,
	maps,
	zIndex = 0,
	children,
	drag,
}: OverlayViewProps): React.JSX.Element => {
	const container = useMemo<HTMLDivElement>(() => {
		const div = document.createElement('div') as HTMLDivElement
		div.style.position = 'absolute'
		return div as HTMLDivElement
	}, [])

	// One overlay for the whole life of the marker: position and drag only set its initial state,
	// later changes go through setPosition and setDrag instead of creating a new overlay on every render.
	const overlay = useMemo(
		() => createOverlay({ container, pane, position, maps, drag }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[container, maps, pane],
	)

	useEffect(() => {
		overlay.setMap(map)
		return () => {
			overlay.setMap(null)
		}
	}, [overlay, map])

	// Move the overlay only when the coordinates really change, since `position` is a new object on every render.
	// Layout effect: a marker controlled from onDrag is moved before the next pointer event, so it never lags behind.
	const lat = position.lat()
	const lng = position.lng()
	useLayoutEffect(() => {
		overlay.setPosition(position)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [overlay, lat, lng])

	// Keep the latest drag callbacks, so they never read stale props or state.
	useLayoutEffect(() => {
		overlay.setDrag(drag)
	})

	// to move the container to the foreground and background
	useEffect(() => {
		container.style.zIndex = `${zIndex}`
	}, [zIndex, container])

	return createPortal(children, container)
}

export default OverlayView
