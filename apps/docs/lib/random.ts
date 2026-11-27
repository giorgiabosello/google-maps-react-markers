/** Small seeded PRNG (mulberry32): the same seed gives the same points on every load. */
export const createRandom = (seed: number) => {
	let state = seed >>> 0
	return () => {
		state = (state + 0x6d2b79f5) >>> 0
		let t = state
		t = Math.imul(t ^ (t >>> 15), t | 1)
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

export interface DemoPoint {
	id: number
	lat: number
	lng: number
}

/** Points spread over Europe, deterministic for a given seed. */
export const generatePoints = (count: number, seed = 42): DemoPoint[] => {
	const random = createRandom(seed)
	return Array.from({ length: count }, (_, id) => ({
		id,
		lat: 36 + random() * 24,
		lng: -10 + random() * 40,
	}))
}
