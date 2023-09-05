import { useEffect, useRef } from 'react'

/**
 * A hook that compares the previous and current values of a reference.
 * @param {any} next - the current value of the reference
 * @param {function} compare - a function that compares the previous and current values
 * @returns {any} the previous value of the reference
 * @ref https://usehooks.com/useMemoCompare/
 */
const useMemoCompare = (next: any, compare: Function): any => {
	// Ref for storing previous value
	const previousRef = useRef()
	const previous = previousRef.current
	// Pass previous and next value to compare function
	// to determine whether to consider them equal.
	const isEqual = compare(previous, next)
	// If not equal update previousRef to next value.
	// We only update if not equal so that this hook continues to return
	// the same old value if compare keeps returning true.
	useEffect(() => {
		if (!isEqual) {
			previousRef.current = next
		}
	})
	// Finally, if equal then return the previous value
	return isEqual ? previous : next
}

export default useMemoCompare
