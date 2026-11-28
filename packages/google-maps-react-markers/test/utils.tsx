import { act } from '@testing-library/react'

/** Lets pending promises (library loading) and the effects they trigger settle. */
export const flush = async () => {
	await act(async () => {
		// A macrotask runs only after every queued microtask (promise chain) has settled.
		await new Promise((resolve) => setTimeout(resolve, 0))
	})
}
