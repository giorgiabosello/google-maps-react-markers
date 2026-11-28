import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** A price tag. White by default, navy with a cyan ring when active. Anchor it at the bottom. */
export const PricePill = ({ children, active }: { active?: boolean; children: ReactNode }) => {
	return (
		<div className="relative pb-2">
			<div
				className={cn(
					'rounded-full px-3 py-1 text-sm font-bold whitespace-nowrap shadow-lg transition-transform',
					active
						? 'scale-110 bg-brand-ink text-white ring-2 ring-brand-cyan'
						: 'bg-white text-brand-ink ring-1 ring-black/5 hover:scale-105',
				)}
			>
				{children}
			</div>
			<div
				className={cn(
					'absolute bottom-0.5 left-1/2 size-2.5 -translate-x-1/2 rotate-45',
					active ? 'bg-brand-cyan' : 'bg-white',
				)}
			/>
		</div>
	)
}

/** A magenta-to-violet avatar. With `stem` it stands on a pin, anchor it at the bottom. */
export const Avatar = ({
	initials,
	stem,
	className,
	'aria-hidden': ariaHidden,
}: {
	'aria-hidden'?: boolean
	className?: string
	initials: string
	stem?: boolean
}) => (
	<div className={cn('flex flex-col items-center', className)} aria-hidden={ariaHidden}>
		{/* Deep fuchsia to violet: white initials stay above 7:1 (WCAG AAA). */}
		<div className="flex size-11 items-center justify-center rounded-full bg-linear-135 from-fuchsia-800 to-violet-800 text-sm font-bold text-white shadow-lg ring-3 ring-white">
			{initials}
		</div>
		{stem ? <div className="h-3 w-0.5 rounded-full bg-white shadow" /> : null}
	</div>
)

const Stars = ({ count = 5 }: { count?: number }) => (
	// An image of stars: 3:1 against the white card (WCAG 1.4.11), named for screen readers.
	<span className="text-amber-600" role="img" aria-label={`${count} stars`}>
		{'★'.repeat(count)}
	</span>
)

/** A rich card: the "Any React component as a marker" of the cover. Anchor it at the bottom. */
export const PlaceCard = ({ title, subtitle, price }: { price: string; subtitle: string; title: string }) => (
	<div className="relative pb-2">
		<div className="flex w-60 items-center gap-3 rounded-xl bg-white p-2 pr-3 text-brand-ink shadow-2xl ring-1 ring-black/5">
			<div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-linear-to-b from-amber-400 to-orange-500">
				<div className="absolute top-2 right-2 size-3 rounded-full bg-amber-100" />
				<div className="absolute -bottom-3 -left-2 h-7 w-20 rounded-[50%] bg-green-600" />
			</div>
			<div className="min-w-0">
				<p className="truncate text-sm font-bold">{title}</p>
				<p className="text-xs text-slate-700">
					<Stars /> {subtitle}
				</p>
				<p className="text-xs font-semibold">{price}</p>
			</div>
		</div>
		<div className="absolute bottom-0.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-white" />
	</div>
)

/** A cluster bubble: blue disc with a soft halo, like the "24" in the cover. */
export const ClusterBubble = ({ count, size }: { count: number; size: number }) => (
	<div
		className="flex items-center justify-center rounded-full bg-blue-800 text-sm font-bold text-white shadow-lg ring-8 ring-brand-blue/30"
		style={{ width: size, height: size }}
	>
		{count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
	</div>
)

/** A classic map pin. Anchor it at the bottom. */
export const Pin = ({ label, className }: { className?: string; label?: string }) => (
	<svg viewBox="0 0 32 40" className={cn('h-10 w-8 drop-shadow-lg', className)} aria-label={label} role="img">
		<path fill="currentColor" d="M16 0C7.2 0 0 7 0 15.6 0 27.3 16 40 16 40s16-12.7 16-24.4C32 7 24.8 0 16 0Z" />
		<circle cx="16" cy="15.5" r="6" fill="#fff" />
	</svg>
)

/** The smallest useful marker, for stress tests: a glowing dot. */
export const Dot = ({ tone = 'cyan' }: { tone?: 'cyan' | 'green' }) => (
	<div
		className={cn(
			'size-3 rounded-full ring-2 ring-white/90',
			tone === 'cyan' ? 'bg-brand-cyan shadow-[0_0_0_4px_rgb(90_211_245/0.25)]' : 'bg-brand-green',
		)}
	/>
)
