import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc'
import { Atom, ArrowRight, Box, Gauge, Hand, Layers, Server, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { FewMarkersDemo } from '@/components/demos/few-markers'
import { InstallCommand } from '@/components/landing/install-command'
import { cn } from '@/lib/cn'
import { codeThemes, githubUrl } from '@/lib/shared'

const usage = `'use client'
import { GoogleMap, Marker } from 'google-maps-react-markers'

export function StoreMap({ stores }) {
  return (
    <GoogleMap
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      mapId="YOUR_MAP_ID"
      defaultCenter={{ lat: 45.44, lng: 12.32 }}
      defaultZoom={6}
      style={{ height: 480 }}
    >
      {stores.map((store) => (
        <Marker key={store.id} lat={store.lat} lng={store.lng} anchor="bottom">
          <PriceTag price={store.price} />
        </Marker>
      ))}
    </GoogleMap>
  )
}`

const chips = ['Custom markers', 'Draggable', 'Clustering', 'SSR ready']

const features: { icon: ReactNode; title: string; text: string; href: string; tone: string }[] = [
	{
		icon: <Sparkles />,
		title: 'Any component is a marker',
		text: 'State, hooks, context, Tailwind, animations: markers are plain React, rendered with portals.',
		href: '/docs/markers',
		tone: 'text-brand-cyan bg-brand-cyan/10 ring-brand-cyan/25',
	},
	{
		icon: <Layers />,
		title: 'Advanced markers or overlays',
		text: 'AdvancedMarkerElement when you have a mapId, a fast custom overlay when you need JSON styles.',
		href: '/docs/renderers',
		tone: 'text-brand-blue bg-brand-blue/10 ring-brand-blue/25',
	},
	{
		icon: <Hand />,
		title: 'Drag with mouse and touch',
		text: 'One draggable prop, pointer events, and the same callbacks for both renderers.',
		href: '/docs/dragging',
		tone: 'text-brand-magenta bg-brand-magenta/10 ring-brand-magenta/25',
	},
	{
		icon: <Gauge />,
		title: 'Built for thousands of markers',
		text: 'Markers are created once and moved in place. Try 5,000 of them, without clustering.',
		href: '/docs/examples/many-markers',
		tone: 'text-brand-green bg-brand-green/10 ring-brand-green/25',
	},
	{
		icon: <Server />,
		title: 'SSR and Server Components',
		text: 'Import it from a Server Component. It renders on the server, hydrates cleanly, loads the API in the browser.',
		href: '/docs/nextjs',
		tone: 'text-brand-amber bg-brand-amber/10 ring-brand-amber/25',
	},
	{
		icon: <Box />,
		title: 'Typed and tiny',
		text: 'About 6 kB brotli with the official Google loader, ESM only, TypeScript first.',
		href: '/docs/api',
		tone: 'text-brand-violet bg-brand-violet/10 ring-brand-violet/25',
	},
]

/** Decorative glowing dots on the hero grid, like the ones in the cover. */
const dots = [
	{ className: 'top-[14%] left-[48%] size-3 text-brand-cyan' },
	{ className: 'top-[8%] right-[6%] size-3 text-brand-green' },
	{ className: 'bottom-[22%] left-[6%] size-2.5 text-brand-cyan' },
	{ className: 'bottom-[10%] right-[38%] size-2.5 text-brand-green' },
]

export default function HomePage() {
	return (
		<div className="relative w-full overflow-hidden">
			<div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
				<div className="bg-map-grid absolute inset-0" />
				<div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-cyan/10 blur-3xl" />
				<div className="absolute top-[420px] -right-40 h-[420px] w-[620px] rotate-[-18deg] rounded-full bg-brand-blue/10 blur-3xl" />
				{dots.map((dot) => (
					<span key={dot.className} className={cn('glow-dot absolute hidden lg:block', dot.className)} />
				))}
			</div>

			<div className="mx-auto w-full max-w-6xl px-4 pb-24">
				<section className="grid items-center gap-12 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:py-24">
					<div className="flex flex-col items-start gap-7">
						<p className="inline-flex items-center gap-2.5 font-mono text-sm text-fd-muted-foreground">
							<Atom aria-hidden className="size-5 text-brand-cyan" />
							React 19 · Next.js 16 · TypeScript
						</p>
						<h1 className="text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl">
							Google Maps
							<br />
							<span className="text-brand-gradient">React Markers</span>
						</h1>
						<p className="max-w-xl text-lg text-pretty text-fd-muted-foreground">
							Use any React component as a Google Maps marker. Advanced markers or custom overlays, drag and drop,
							clustering, server rendering.
						</p>
						<ul className="flex flex-wrap gap-2" aria-label="Highlights">
							{chips.map((chip) => (
								<li
									key={chip}
									className="inline-flex items-center gap-2 rounded-full border bg-fd-card/70 px-3.5 py-1.5 text-sm font-semibold backdrop-blur"
								>
									<span className="size-1.5 rounded-full bg-brand-cyan" />
									{chip}
								</li>
							))}
						</ul>
						<InstallCommand />
						<div className="flex flex-wrap gap-3">
							<Link
								href="/docs/getting-started"
								className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-bold text-fd-primary-foreground shadow-lg shadow-brand-cyan/20 transition-opacity hover:opacity-90"
							>
								Get started <ArrowRight aria-hidden className="size-4" />
							</Link>
							<Link
								href="/docs/examples"
								className="inline-flex items-center rounded-lg border bg-fd-card/70 px-4 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-fd-accent"
							>
								Live examples
							</Link>
						</div>
					</div>
					<div className="w-full">
						<div className="rounded-2xl shadow-[0_0_80px_-20px_rgb(90_211_245/0.35)]">
							<FewMarkersDemo height="h-[460px]" eager />
						</div>
						<p className="mt-2 text-center font-mono text-xs text-fd-muted-foreground">
							{'<Marker lat={45.44} lng={12.32}>'} · click a price, drag the avatar
						</p>
					</div>
				</section>

				<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Features">
					{features.map((feature) => (
						<Link
							key={feature.title}
							href={feature.href}
							className="group rounded-xl border bg-fd-card/80 p-5 backdrop-blur transition-colors hover:border-brand-cyan/40"
						>
							<div
								className={cn(
									'mb-4 inline-flex size-10 items-center justify-center rounded-lg ring-1 [&_svg]:size-5',
									feature.tone,
								)}
							>
								{feature.icon}
							</div>
							<h2 className="mb-1.5 font-bold">{feature.title}</h2>
							<p className="text-sm text-fd-muted-foreground">{feature.text}</p>
						</Link>
					))}
				</section>

				<section className="mt-24 grid items-start gap-10 lg:grid-cols-2">
					<div className="flex flex-col gap-4">
						<p className="font-mono text-sm text-brand-cyan-text">{'<Marker lat lng />'}</p>
						<h2 className="text-3xl font-extrabold tracking-tight">Markers are just children.</h2>
						<p className="text-fd-muted-foreground">
							Wrap any component in <code className="text-fd-foreground">{'<Marker>'}</code> inside a{' '}
							<code className="text-fd-foreground">{'<GoogleMap>'}</code>. The map loads the Maps JavaScript API once,
							picks the renderer from your <code className="text-fd-foreground">mapId</code>, and keeps every marker in
							sync with your props.
						</p>
						<ul className="flex flex-col gap-2.5 text-sm text-fd-muted-foreground">
							<li className="flex gap-2">
								<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-cyan" />
								<span>
									<span className="font-semibold text-fd-foreground">anchor</span>: pin the bottom, the center or any
									point.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-green" />
								<span>
									<span className="font-semibold text-fd-foreground">onChange</span>: center, zoom, bounds and a
									supercluster bbox.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-magenta" />
								<span>
									<span className="font-semibold text-fd-foreground">useMap()</span>: the map instance, anywhere inside.
								</span>
							</li>
						</ul>
					</div>
					<div className="min-w-0 [&_figure]:my-0">
						<ServerCodeBlock code={usage} lang="tsx" themes={codeThemes} />
					</div>
				</section>

				<section className="mt-24 grid gap-4 md:grid-cols-2">
					<Link
						href="/docs/examples/many-markers"
						className="group relative overflow-hidden rounded-2xl border bg-fd-card p-7 transition-colors hover:border-brand-cyan/40"
					>
						<div aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-brand-blue/15 blur-2xl" />
						<p className="mb-2 font-mono text-sm text-brand-cyan-text">stress test</p>
						<h2 className="mb-2 text-2xl font-extrabold tracking-tight">500 to 5,000 markers, no clustering.</h2>
						<p className="text-sm text-fd-muted-foreground">
							Switch renderer, pan and zoom, and read the FPS live.{' '}
							<span className="inline-flex items-center gap-1 font-semibold text-fd-foreground">
								Open it <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
							</span>
						</p>
					</Link>
					<Link
						href="/docs/migration/v3"
						className="group relative overflow-hidden rounded-2xl border bg-fd-card p-7 transition-colors hover:border-brand-magenta/40"
					>
						<div aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-brand-magenta/15 blur-2xl" />
						<p className="mb-2 font-mono text-sm text-brand-magenta-text">migration</p>
						<h2 className="mb-2 text-2xl font-extrabold tracking-tight">Upgrading from v2?</h2>
						<p className="text-sm text-fd-muted-foreground">
							Markers go inside {'<Marker>'}, the import is named, a few props changed. Every breaking change, with
							before and after.{' '}
							<span className="inline-flex items-center gap-1 font-semibold text-fd-foreground">
								Read the guide{' '}
								<ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
							</span>
						</p>
					</Link>
				</section>

				<footer className="mt-24 flex flex-col items-center gap-2 border-t pt-8 text-center text-sm text-fd-muted-foreground">
					<p>
						MIT licensed. Made in Italy by{' '}
						<a href="https://github.com/giorgiabosello" className="font-semibold text-fd-foreground hover:underline">
							Giorgia Bosello
						</a>
						.
					</p>
					<p className="flex gap-4">
						<a href={githubUrl} className="hover:text-fd-foreground">
							GitHub
						</a>
						<a href="https://www.npmjs.com/package/google-maps-react-markers" className="hover:text-fd-foreground">
							npm
						</a>
						<a href="https://www.buymeacoffee.com/giorgiabosello" className="hover:text-fd-foreground">
							Buy me a coffee
						</a>
					</p>
				</footer>
			</div>
		</div>
	)
}
