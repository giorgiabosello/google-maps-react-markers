import { act } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { installGoogleMapsMock } from './google-maps-mock'
import { SsrTree } from './ssr-tree'
import { flush } from './utils'

describe('hydration', () => {
	it('hydrates server HTML without mismatches, then mounts markers and controls', async () => {
		const html = renderToString(<SsrTree />)
		const mock = installGoogleMapsMock()
		const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
		const recoverable = vi.fn()

		const container = document.createElement('div')
		container.innerHTML = html
		document.body.appendChild(container)
		let root: ReturnType<typeof hydrateRoot> | undefined
		await act(async () => {
			root = hydrateRoot(container, <SsrTree />, { onRecoverableError: recoverable })
		})
		await flush()

		expect(recoverable).not.toHaveBeenCalled()
		expect(errors).not.toHaveBeenCalled()
		expect(mock.advancedMarkers).toHaveLength(500)
		expect(container.querySelector('[data-hooks]')?.textContent).toBe('ready:map:places')
		act(() => root?.unmount())
		container.remove()
		errors.mockRestore()
	})
})
