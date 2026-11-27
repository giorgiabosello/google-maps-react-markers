'use client'

import { useCallback, useEffect, useState } from 'react'

/** Measures frames per second with requestAnimationFrame, plus the lowest value since the last reset. */
export const useFps = () => {
	const [fps, setFps] = useState<number | null>(null)
	const [lowest, setLowest] = useState<number | null>(null)

	useEffect(() => {
		let frames = 0
		let last = performance.now()
		let raf = 0
		const loop = (time: number) => {
			frames++
			const elapsed = time - last
			if (elapsed >= 500) {
				const value = Math.round((frames * 1000) / elapsed)
				setFps(value)
				setLowest((current) => (current === null ? value : Math.min(current, value)))
				frames = 0
				last = time
			}
			raf = requestAnimationFrame(loop)
		}
		raf = requestAnimationFrame(loop)
		return () => cancelAnimationFrame(raf)
	}, [])

	const resetLowest = useCallback(() => setLowest(null), [])
	return { fps, lowest, resetLowest }
}
