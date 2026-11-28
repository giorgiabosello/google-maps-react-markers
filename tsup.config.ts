import type { Options } from 'tsup'

// Consumers get the google.maps types (a dependency) without adding them to their tsconfig.
const dtsBanner = '/// <reference types="google.maps" />'

const shared: Options = {
	treeshake: true,
	sourcemap: false, // process.env.NODE_ENV === 'development',
	minify: true,
	// Both builds write to dist: cleaning in one would delete the files of the other.
	clean: false,
	splitting: false,
	external: ['react'],
	injectStyle: false,
}

const config: Options[] = [
	{
		...shared,
		entry: ['src/index.ts'],
		format: ['esm'],
		dts: { banner: dtsBanner },
	},
	{
		...shared,
		// `require()` returns the component, like in 2.0.x. Types are the same as the ESM build.
		entry: { index: 'src/index.cjs.ts' },
		format: ['cjs'],
		dts: { entry: { index: 'src/index.ts' }, banner: dtsBanner },
	},
]

export default config
