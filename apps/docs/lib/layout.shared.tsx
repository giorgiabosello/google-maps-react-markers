import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { MapPinned } from 'lucide-react'
import { appName, githubUrl } from './shared'

export const baseOptions = (): BaseLayoutProps => ({
	nav: {
		title: (
			<>
				<MapPinned aria-hidden className="size-5 text-brand-cyan" />
				<span className="font-bold">{appName}</span>
			</>
		),
	},
	githubUrl,
	links: [
		{ text: 'Docs', url: '/docs', active: 'nested-url' },
		{ text: 'Examples', url: '/docs/examples', active: 'nested-url' },
	],
})
