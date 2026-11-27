import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useGoogleMapContext } from './context'
import { createAdvancedMarker } from './internal/advanced-marker'
import { anchorKey, resolveAnchor } from './internal/anchor'
import { MARKER_ATTRIBUTE, type MarkerHandle } from './internal/marker-handle'
import { createOverlayMarker } from './internal/overlay-marker'
import { useLatest } from './internal/use-latest'
import type { MarkerProps } from './types'

const isDev = process.env.NODE_ENV !== 'production'
let warnedAboutTitle = false

/**
 * Renders any React content at `lat`/`lng`. Must be inside `<GoogleMap>`.
 * Renders nothing on the server and until the map is ready.
 */
export const Marker = (props: MarkerProps) => {
	const { lat, lng, anchor, zIndex, draggable = false, title, className, collisionBehavior, onClick, children } = props
	const { map, renderer } = useGoogleMapContext('Marker')
	const latest = useLatest(props)
	const handleRef = useRef<MarkerHandle | null>(null)
	const [container, setContainer] = useState<HTMLDivElement | null>(null)

	// One marker per map and renderer. Everything else is updated in place.
	useEffect(() => {
		if (!map || !renderer) return undefined
		const element = document.createElement('div')
		element.setAttribute(MARKER_ATTRIBUTE, '')
		const init = { map, container: element, getHandlers: () => latest.current }
		const handle = renderer === 'advanced' ? createAdvancedMarker(init) : createOverlayMarker(init)
		handleRef.current = handle
		// The portal target is a DOM node created here, after mount: never on the server.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setContainer(element)
		return () => {
			handle.destroy()
			handleRef.current = null
			setContainer(null)
		}
	}, [map, renderer, latest])

	useEffect(() => {
		handleRef.current?.setPosition({ lat, lng })
	}, [container, lat, lng])

	const anchorId = anchorKey(anchor)
	useEffect(() => {
		handleRef.current?.setAnchor(resolveAnchor(anchor))
		// anchorId captures the anchor value, so an inline { x, y } object does not re-run this.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [container, anchorId])

	useEffect(() => {
		handleRef.current?.setZIndex(zIndex)
	}, [container, zIndex])

	useEffect(() => {
		handleRef.current?.setDraggable(draggable)
	}, [container, draggable])

	useEffect(() => {
		handleRef.current?.setTitle(title)
	}, [container, title])

	const clickable = Boolean(onClick)
	useEffect(() => {
		handleRef.current?.setClickable(clickable)
	}, [container, clickable])

	useEffect(() => {
		if (!isDev || warnedAboutTitle || !container || title || !(clickable || draggable)) return
		warnedAboutTitle = true
		console.warn(
			'[google-maps-react-markers] A clickable or draggable <Marker> has no `title`. ' +
				'Screen readers announce it as an unnamed button: pass a short title.',
		)
	}, [container, title, clickable, draggable])

	useEffect(() => {
		handleRef.current?.setCollisionBehavior(collisionBehavior)
	}, [container, collisionBehavior])

	useEffect(() => {
		handleRef.current?.setClassName(className)
	}, [container, className])

	return container ? createPortal(children, container) : null
}
