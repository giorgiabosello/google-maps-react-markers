import Link from 'next/link'

/** The 404 page of the static export, with a main landmark like every other page. */
export default function NotFound() {
	return (
		<main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
			<p className="font-mono text-sm text-brand-cyan-text">404</p>
			<h1 className="text-3xl font-extrabold tracking-tight">This page is not on the map</h1>
			<p className="text-fd-muted-foreground">The address may have changed in v3.</p>
			<div className="flex gap-3">
				<Link href="/" className="rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-bold text-fd-primary-foreground">
					Home
				</Link>
				<Link href="/docs" className="rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-fd-accent">
					Documentation
				</Link>
			</div>
		</main>
	)
}
