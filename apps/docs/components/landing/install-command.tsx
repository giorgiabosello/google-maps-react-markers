'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { cn } from '@/lib/cn'

const PACKAGE = 'google-maps-react-markers'

const MANAGERS = [
	{ id: 'npm', command: `npm i ${PACKAGE}` },
	{ id: 'pnpm', command: `pnpm add ${PACKAGE}` },
	{ id: 'yarn', command: `yarn add ${PACKAGE}` },
	{ id: 'bun', command: `bun add ${PACKAGE}` },
] as const

type Manager = (typeof MANAGERS)[number]['id']

const STORAGE_KEY = 'gmrm:package-manager'
const CHANGE_EVENT = 'gmrm:package-manager-change'

const isManager = (value: string | null): value is Manager => MANAGERS.some((manager) => manager.id === value)

/** The visitor's last choice, remembered in localStorage. Always npm on the server, so hydration matches. */
const readManager = (): Manager => {
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY)
		return isManager(stored) ? stored : 'npm'
	} catch {
		return 'npm'
	}
}

const subscribe = (onChange: () => void) => {
	window.addEventListener('storage', onChange)
	window.addEventListener(CHANGE_EVENT, onChange)
	return () => {
		window.removeEventListener('storage', onChange)
		window.removeEventListener(CHANGE_EVENT, onChange)
	}
}

const saveManager = (manager: Manager) => {
	try {
		window.localStorage.setItem(STORAGE_KEY, manager)
	} catch {
		// Private mode or blocked storage: the choice just is not remembered.
	}
	window.dispatchEvent(new Event(CHANGE_EVENT))
}

export const InstallCommand = () => {
	const manager = useSyncExternalStore(subscribe, readManager, () => 'npm' as const)
	const [copied, setCopied] = useState(false)
	const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
	useEffect(() => () => clearTimeout(resetTimer.current), [])
	const command = MANAGERS.find((item) => item.id === manager)?.command ?? MANAGERS[0].command

	const copy = () => {
		navigator.clipboard
			.writeText(command)
			.then(() => {
				setCopied(true)
				clearTimeout(resetTimer.current)
				resetTimer.current = setTimeout(() => setCopied(false), 1500)
			})
			.catch(() => setCopied(false))
	}

	return (
		<div className="inline-flex max-w-full flex-col rounded-xl border bg-fd-card/70 font-mono backdrop-blur">
			<div className="flex gap-1 border-b px-2 pt-2" role="group" aria-label="Package manager">
				{MANAGERS.map((item) => (
					<button
						key={item.id}
						type="button"
						aria-pressed={item.id === manager}
						onClick={() => saveManager(item.id)}
						className={cn(
							'-mb-px border-b-2 px-2.5 pb-1.5 text-xs transition-colors',
							item.id === manager
								? 'border-brand-cyan text-fd-foreground'
								: 'border-transparent text-fd-muted-foreground hover:text-fd-foreground',
						)}
					>
						{item.id}
					</button>
				))}
			</div>
			<button
				type="button"
				onClick={copy}
				className="group flex items-center gap-3 px-5 py-3 text-left text-[0.95rem]"
				aria-label={`Copy "${command}"`}
			>
				<span className="text-brand-cyan-text">$</span>
				<span className="truncate">{command}</span>
				{copied ? (
					<Check aria-hidden className="ml-auto size-4 shrink-0 text-brand-green" />
				) : (
					<Copy
						aria-hidden
						className="ml-auto size-4 shrink-0 text-fd-muted-foreground group-hover:text-fd-foreground"
					/>
				)}
			</button>
		</div>
	)
}
