import { useLayoutEffect, useRef } from 'react'

/** A ref that always holds the latest value. Read it in event handlers, never during render. */
export const useLatest = <T>(value: T) => {
	const ref = useRef(value)
	useLayoutEffect(() => {
		ref.current = value
	})
	return ref
}
