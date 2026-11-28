import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['src/index.ts'],
	format: 'esm',
	platform: 'neutral',
	target: 'es2022',
	dts: true,
	sourcemap: true,
	clean: true,
	// Every export is a client component or a hook: mark the whole bundle so it can be
	// imported straight from a React Server Component (Next.js App Router).
	banner: {
		js: "'use client';",
		// Consumers get google.maps types without installing them, whatever their package manager.
		dts: '/// <reference types="google.maps" />',
	},
})
