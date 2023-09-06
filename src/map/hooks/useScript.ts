/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import { ScriptProps, UseScriptOptions, UseScriptStatus } from '../../utils/types'

// Cached script statuses
const cachedScriptStatuses: Record<string, UseScriptStatus | undefined> = {}

function getScriptNode(src: string) {
	const node: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`)
	const status = node?.getAttribute('data-status') as UseScriptStatus | undefined

	return {
		node,
		status,
	}
}

/**
 * @description Hook to load external script.
 * @param {Object} script - Script to load.
 * @param {string} script.src - Script source.
 * @param {Object} [script.attributes] - Attributes to add to the script tag.
 * @param {Object} [script.callbacks] - Callbacks executed on completion.
 * @param {Function} [script.callbacks.onLoadCallback] - Callback executed on completion in case of success.
 * @param {Function} [script.callbacks.onErrorCallback] - Callbacks executed on completion in case of error.
 * @param {string} [script.elementIdToAppend] - HTML element id to append the script to. Default is HTML HEAD.
 * @returns {"idle" | "loading" | "ready" | "error"} status
 *
 * @example
 * const status = useScript({
 * 		src: "https://script-to-load.js",
 * 		attributes: { id: "scriptId", class: "script-class" },
 * 		callbacks: {
 * 			onLoadCallback: onLoadFunc,
 * 			onErrorCallback: onErrorFunc,
 * 		},
 * 		elementIdToAppend: "script-container"
 * }, undefined, { removeOnUnmount: true, shouldPreventLoad: false })
 */

function useScript(
	// eslint-disable-next-line default-param-last
	script: ScriptProps = {
		src: '',
		attributes: {},
		callbacks: { onLoadCallback: () => {}, onErrorCallback: () => {} },
		elementIdToAppend: '',
	},
	forcedStatus?: UseScriptStatus,
	options: UseScriptOptions = { removeOnUnmount: false, shouldPreventLoad: false },
) {
	const [status, setStatus] = useState<UseScriptStatus>(() => {
		if (!script.src || options?.shouldPreventLoad) {
			return 'idle'
		}

		if (typeof window === 'undefined') {
			// SSR Handling - always return 'loading'
			return 'loading'
		}

		return cachedScriptStatuses[script.src] ?? 'loading'
	})

	useEffect(
		() => {
			if (forcedStatus) {
				setStatus(forcedStatus)
				return
			}

			if (!script?.src || options?.shouldPreventLoad) {
				return
			}

			const cachedScriptStatus = cachedScriptStatuses[script.src]
			if (cachedScriptStatus === 'ready' || cachedScriptStatus === 'error') {
				// If the script is already cached, set its status immediately
				setStatus(cachedScriptStatus)
				return
			}

			// Fetch existing script element by src
			// It may have been added by another instance of this hook
			const scriptToAdd = getScriptNode(script.src)
			let scriptNode = scriptToAdd.node

			if (!scriptNode) {
				// Create script element and add it to document body
				scriptNode = document.createElement('script')
				scriptNode.src = script.src
				scriptNode.async = true
				scriptNode.setAttribute('data-status', 'loading')
				// Add other script attributes, if they exist
				script.attributes && Object.entries(script.attributes).length > 0
					? Object.entries(script.attributes).map(([key, value]) => scriptNode?.setAttribute(key, value))
					: null
				if (script.elementIdToAppend && document.getElementById(script.elementIdToAppend)) {
					document.getElementById(script.elementIdToAppend)?.appendChild(scriptNode)
				} else {
					document.body.appendChild(scriptNode)
				}

				// Store status in attribute on script
				// This can be read by other instances of this hook
				const setAttributeFromEvent = (event: Event) => {
					const scriptStatus: UseScriptStatus = event.type === 'load' ? 'ready' : 'error'

					scriptNode?.setAttribute('data-status', scriptStatus)
				}

				scriptNode.addEventListener('load', setAttributeFromEvent)
				scriptNode.addEventListener('error', setAttributeFromEvent)
			} else {
				// Grab existing script status from attribute and set to state.
				const currentScriptStatus = scriptToAdd.status ?? cachedScriptStatus ?? 'loading'

				switch (currentScriptStatus) {
					case 'loading':
					case 'ready':
						script.callbacks?.onLoadCallback ? script.callbacks.onLoadCallback() : null
						break
					case 'error':
						script.callbacks?.onErrorCallback ? script.callbacks.onErrorCallback() : null
						break
					default:
						// loading: do nothing
						break
				}

				setStatus(currentScriptStatus)
			}

			// Script event handler to update status in state
			// Note: Even if the script already exists we still need to add
			// event handlers to update the state for this hook instance.
			const setStateFromEvent = (event: Event) => {
				const newStatus = event.type === 'load' ? 'ready' : 'error'
				event.type === 'load'
					? script.callbacks?.onLoadCallback
						? script.callbacks.onLoadCallback()
						: null
					: script.callbacks?.onErrorCallback
					? script.callbacks.onErrorCallback()
					: null

				setStatus(newStatus)
				cachedScriptStatuses[script.src] = newStatus
			}
			// Add event listeners
			scriptNode.addEventListener('load', setStateFromEvent)
			scriptNode.addEventListener('error', setStateFromEvent)
			// Remove event listeners on cleanup
			// eslint-disable-next-line consistent-return
			return () => {
				if (scriptNode) {
					scriptNode.removeEventListener('load', setStateFromEvent)
					scriptNode.removeEventListener('error', setStateFromEvent)
				}

				if (scriptNode && options?.removeOnUnmount) {
					scriptNode.remove()
				}
			}
		},

		// Re-run useEffect if script changes
		[script, forcedStatus, status],
	)

	return status
}

export default useScript
