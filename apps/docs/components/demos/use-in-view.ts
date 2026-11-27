'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Becomes true the first time the element gets near the viewport, and stays true.
 * Every Google map counts as a billed map load, so demos create theirs only when needed.
 */
export const useInViewOnce = <T extends Element>(enabled: boolean, rootMargin = '200px') => {
	const ref = useRef<T>(null)
	const [inView, setInView] = useState(!enabled)

	useEffect(() => {
		const element = ref.current
		if (inView || !element) return undefined
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setInView(true)
					observer.disconnect()
				}
			},
			{ rootMargin },
		)
		observer.observe(element)
		return () => observer.disconnect()
	}, [inView, rootMargin])

	return [ref, inView] as const
}
