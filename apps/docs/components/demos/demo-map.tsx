'use client'

import { GoogleMap, type GoogleMapProps } from 'google-maps-react-markers'
import { useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { coverLightMapStyles, coverMapStyles } from '@/lib/map-styles'
import { mapsApiKey } from '@/lib/shared'
import { useInViewOnce } from './use-in-view'

const MapLoading = () => (
	<div className="flex size-full animate-pulse items-center justify-center bg-fd-muted text-sm text-fd-muted-foreground">
		Loading map…
	</div>
)

const MapPlaceholder = () => (
	<div className="flex size-full items-center justify-center bg-fd-muted text-sm text-fd-muted-foreground">
		The map loads when you scroll to it.
	</div>
)

const MapError = () => (
	<div className="flex size-full items-center justify-center bg-fd-muted p-6 text-center text-sm text-fd-muted-foreground">
		Google Maps could not load. Check the API key and its HTTP referrer restrictions.
	</div>
)

interface DemoMapProps extends GoogleMapProps {
	/** Use the cover JSON styles (maps without a mapId), light or dark with the site theme. */
	coverStyle?: boolean
	/** Create the map right away instead of when it scrolls into view. For maps above the fold. */
	eager?: boolean
}

/**
 * GoogleMap with the demo key and a skeleton while loading. It follows the site theme:
 * maps with a mapId get a colorScheme, maps with `coverStyle` get the cover JSON styles.
 * The map is created only when it comes near the viewport: each map is a billed map load.
 */
export const DemoMap = ({ options, coverStyle, eager = false, ...props }: DemoMapProps) => {
	const [ref, inView] = useInViewOnce<HTMLDivElement>(!eager)
	const { resolvedTheme } = useTheme()
	const dark = resolvedTheme !== 'light'
	const colorScheme = props.mapId ? (dark ? 'DARK' : 'LIGHT') : undefined
	// JSON styles change in place through the reactive options, no new map needed.
	const styles = coverStyle && !props.mapId ? (dark ? coverMapStyles : coverLightMapStyles) : undefined
	if (!inView) {
		return (
			<div ref={ref} className="size-full">
				<MapPlaceholder />
			</div>
		)
	}
	return (
		<GoogleMap
			// colorScheme can only be set when the map is created.
			key={colorScheme ?? 'default'}
			apiKey={mapsApiKey}
			loadingContent={<MapLoading />}
			errorContent={<MapError />}
			options={{
				colorScheme,
				clickableIcons: false,
				...(styles ? { styles, backgroundColor: dark ? '#0d1219' : '#f4f7fb' } : {}),
				...options,
			}}
			{...props}
		/>
	)
}

export const DemoFrame = ({
	children,
	toolbar,
	footer,
	className,
}: {
	children: ReactNode
	className?: string
	footer?: ReactNode
	toolbar?: ReactNode
}) => (
	<div className="not-prose demo-frame my-6 overflow-hidden rounded-xl border bg-fd-card shadow-sm">
		{toolbar ? <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2 text-sm">{toolbar}</div> : null}
		<div className={cn('relative h-[420px] w-full', className)}>{children}</div>
		{!mapsApiKey ? (
			<p className="border-t px-3 py-1.5 text-xs text-fd-muted-foreground">
				No API key configured: Google shows the map in development mode.
			</p>
		) : null}
		{footer ? <div className="border-t px-3 py-2 text-sm">{footer}</div> : null}
	</div>
)

export const ToggleGroup = <T extends string | number>({
	label,
	value,
	options,
	onChange,
}: {
	label: string
	onChange: (value: T) => void
	options: readonly { label: string; value: T }[]
	value: T
}) => (
	<div className="flex items-center gap-1.5" role="group" aria-label={label}>
		<span className="text-fd-muted-foreground">{label}</span>
		<div className="flex rounded-lg border p-0.5">
			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					aria-pressed={option.value === value}
					onClick={() => onChange(option.value)}
					className={cn(
						'rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
						option.value === value ? 'bg-fd-primary text-fd-primary-foreground' : 'hover:bg-fd-accent',
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	</div>
)
