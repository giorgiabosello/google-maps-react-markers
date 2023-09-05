export const isArraysEqualEps = (arrayA: number[], arrayB?: number[], eps = 0.000001) => {
	if (arrayA && arrayB) {
		for (let i = 0; i !== arrayA.length; ++i) {
			if (Math.abs(arrayA[i] - arrayB[i]) > eps) {
				return false
			}
		}
		return true
	}
	return false
}
