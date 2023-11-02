import React, { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { OverlayViewProps } from '../utils/types'
import useMemoCompare from './hooks/useMemoCompare'
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

	const overlay = useMemo(
		() => createOverlay({ container, pane, position, maps, drag }),
		[container, drag, maps, pane, position],
	)

	// Because React does not do deep comparisons, a custom hook is used.
	// This fixes the issue where the overlay is not updated when the position changes.
	const childrenProps = useMemoCompare(
		children?.props as any,
		(prev: { lat: any; lng: any }, next: { lat: any; lng: any }) =>
			prev && prev.lat === next.lat && prev.lng === next.lng,
	)

	useEffect(() => {
		if (!overlay.map && map) {
			overlay?.setMap(map)
			return () => {
				overlay?.setMap(null)
			}
		}
		return () => {}
		// overlay depends on map, so we don't need to add it to the dependency array
		// otherwise, it will re-render the overlay every time the map changes
		// ? added childrenProps to the dependency array to re-render the overlay when the children props change.
	}, [map, childrenProps])

	// to move the container to the foreground and background
	useEffect(() => {
		container.style.zIndex = `${zIndex}`
	}, [zIndex, container])

	return createPortal(children, container)
}

export default OverlayView
