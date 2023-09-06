import type { Options } from 'tsup'

const config: Options = {
	entry: ['src/index.ts'],
	treeshake: true,
	sourcemap: true,
	minify: true,
	clean: true,
	dts: true,
	splitting: false,
	format: ['cjs', 'esm'],
	external: ['react'],
	injectStyle: false,
}

export default config
