// @vitest-environment node
import { renderToString } from 'react-dom/server'
import { prerender } from 'react-dom/static'
import { describe, expect, it } from 'vitest'
import { SsrTree } from './ssr-tree'

describe('server rendering (real Node, no window)', () => {
	it('runs without a DOM', () => {
		expect(typeof window).toBe('undefined')
		expect(typeof document).toBe('undefined')
	})

	it('renderToString renders the container and loadingContent, never markers or controls', () => {
		const html = renderToString(<SsrTree />)
		expect(html).toContain('class="map"')
		expect(html).toContain('Loading map')
		expect(html).toContain('loading:no-map:no-places')
		expect(html).not.toContain('Point 0')
		expect(html).not.toContain('Control')
	})

	it('prerender (static export) completes', async () => {
		const { prelude } = await prerender(<SsrTree />)
		const html = await new Response(prelude).text()
		expect(html).toContain('Loading map')
	})
})
