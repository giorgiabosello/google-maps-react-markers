import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: ['./test/setup.ts'],
		include: ['test/**/*.test.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			include: ['src/**'],
		},
	},
})
