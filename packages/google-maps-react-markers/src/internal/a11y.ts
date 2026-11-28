import { MARKER_ATTRIBUTE } from './marker-handle'

/** Same wording and keys as Google's advanced markers, so both renderers behave alike. */
export const DRAG_HELP =
	'To activate drag with keyboard, press Alt + Enter. Once in keyboard drag state, use the arrow keys to move the marker. To complete the drag, press the Enter key. To cancel, press Escape.'

const HELP_ID = 'gmrm-drag-help'
const LIVE_ID = 'gmrm-live'
const STYLE_ID = 'gmrm-styles'

const visuallyHidden =
	'position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0'

/**
 * Focus ring for overlay markers: a white ring inside a blue one, visible on light and dark maps
 * (WCAG 2.4.13 Focus Appearance). `:where()` keeps specificity at zero, so any class overrides it.
 */
const css = `:where([${MARKER_ATTRIBUTE}][tabindex]):focus-visible{outline:3px solid #0b57d0;outline-offset:2px;box-shadow:0 0 0 2px #fff;border-radius:4px}`

const ensureElement = (id: string, create: () => HTMLElement) => {
	const existing = document.getElementById(id)
	if (existing) return existing
	const element = create()
	element.id = id
	document.body.append(element)
	return element
}

/** Adds the focus ring style once per document. */
export const ensureMarkerStyles = () => {
	if (document.getElementById(STYLE_ID)) return
	const style = document.createElement('style')
	style.id = STYLE_ID
	style.textContent = css
	document.head.append(style)
}

/** The id of a hidden element with the keyboard drag instructions, for aria-describedby. */
export const dragHelpId = () => {
	ensureElement(HELP_ID, () => {
		const element = document.createElement('div')
		element.hidden = true
		element.textContent = DRAG_HELP
		return element
	})
	return HELP_ID
}

let announceTimer: ReturnType<typeof setTimeout> | undefined

/** Speaks a short message through a shared polite live region. */
export const announce = (message: string) => {
	const region = ensureElement(LIVE_ID, () => {
		const element = document.createElement('div')
		element.setAttribute('role', 'status')
		element.setAttribute('aria-live', 'polite')
		element.setAttribute('aria-atomic', 'true')
		element.style.cssText = visuallyHidden
		return element
	})
	// Clearing first makes screen readers repeat a message identical to the previous one.
	region.textContent = ''
	clearTimeout(announceTimer)
	announceTimer = setTimeout(() => {
		region.textContent = message
	}, 50)
}
