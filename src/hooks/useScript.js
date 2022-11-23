/* eslint-disable no-unused-expressions */
import { useState, useEffect } from 'react'

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
 * })
 */

export const useScript = (
	script = {
		src: '',
		attributes: {},
		callbacks: { onLoadCallback: null, onErrorCallback: null },
		elementIdToAppend: null,
	}
) => {
	// Keep track of script status ("idle", "loading", "ready", "error")
	const [status, setStatus] = useState(script.src ? 'loading' : 'idle')

	useEffect(
		() => {
			// Allow falsy src value if waiting on other data needed for
			// constructing the script URL passed to this hook.
			if (!script.src) {
				setStatus('idle')
				return
			}
			// Fetch existing script element by src
			// It may have been added by another instance of this hook
			let scriptToAdd = document.querySelector(`script[src="${script.src}"]`)
			if (!scriptToAdd) {
				// Create script
				scriptToAdd = document.createElement('script')
				scriptToAdd.src = script.src
				scriptToAdd.async = true
				scriptToAdd.setAttribute('data-status', 'loading')
				// Add other script attributes, if they exist
				script.attributes && Object.entries(script.attributes).length > 0
					? Object.entries(script.attributes).map(([key, value]) => scriptToAdd.setAttribute(key, value))
					: null
				// Add script to document body
				if (script.elementIdToAppend && document.getElementById(script.elementIdToAppend)) {
					document.getElementById(script.elementIdToAppend).appendChild(scriptToAdd)
				} else {
					document.body.appendChild(scriptToAdd)
				}
				// Store status in attribute on script
				// This can be read by other instances of this hook
				const setAttributeFromEvent = (event) => {
					scriptToAdd.setAttribute('data-status', event.type === 'load' ? 'ready' : 'error')
				}
				scriptToAdd.addEventListener('load', setAttributeFromEvent)
				scriptToAdd.addEventListener('error', setAttributeFromEvent)
			} else {
				// Grab existing script status from attribute and set to state.
				const currentScriptStatus = scriptToAdd.getAttribute('data-status')
				switch (currentScriptStatus) {
					case 'load':
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
			const setStateFromEvent = (event) => {
				event.type === 'load'
					? script.callbacks?.onLoadCallback
						? script.callbacks.onLoadCallback()
						: null
					: script.callbacks?.onErrorCallback
					? script.callbacks.onErrorCallback()
					: null
				setStatus(event.type === 'load' ? 'ready' : 'error')
			}
			// Add event listeners
			scriptToAdd.addEventListener('load', setStateFromEvent)
			scriptToAdd.addEventListener('error', setStateFromEvent)
			// Remove event listeners on cleanup
			return () => {
				if (scriptToAdd) {
					scriptToAdd.removeEventListener('load', setStateFromEvent)
					scriptToAdd.removeEventListener('error', setStateFromEvent)
				}
			}
		},
		// Re-run useEffect if script changes
		[script]
	)
	return status
}
