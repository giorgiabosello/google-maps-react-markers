import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Provider } from '@/components/provider'
import { appName } from '@/lib/shared'
import './global.css'

// Same fonts as giorgiabosello.dev. Downloaded at build time and served by the site:
// the browser never calls Google Fonts.
const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
	title: { default: appName, template: `%s | ${appName}` },
	description:
		'Render any React component as a Google Maps marker. React 19, Next.js 16, advanced markers or custom overlays, drag and drop, clustering, SSR safe and fully typed.',
	// Origin only: Next adds the basePath to relative metadata URLs itself.
	metadataBase: new URL('https://giorgiabosello.github.io'),
}

export default function Layout({ children }: LayoutProps<'/'>) {
	return (
		<html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
			<body className="flex min-h-screen flex-col font-sans antialiased">
				<Provider>{children}</Provider>
			</body>
		</html>
	)
}
