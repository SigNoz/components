import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

const MODIFIER_KEYS = new Set(['Alt', 'Control', 'Meta', 'Shift']);

const trackedDocuments = new WeakSet<Document>();

// Until the first event the page was reached without a pointer (`autoFocus` on load, a link from
// another page), which counts as keyboard, the way browsers start `:focus-visible`.
let lastPointer = false;

function onPointerDown(): void {
	lastPointer = true;
}

// A shortcut held with a modifier (`Cmd+L`, `Ctrl+Tab` to another browser tab) is not a keyboard
// move inside the page, and must not turn the ring on when focus comes back.
function onKeyDown(event: KeyboardEvent): void {
	if (event.metaKey || event.ctrlKey || event.altKey || MODIFIER_KEYS.has(event.key)) {
		return;
	}

	lastPointer = false;
}

/**
 * Whether the focus that lands now came from a pointer. Read it in a focus handler: the
 * `pointerdown` that moves focus fires before the `focus` event.
 *
 * Exists because a text field matches `:focus-visible` on a mouse click in every browser, so the
 * selector alone cannot keep the ring to keyboard focus.
 *
 * @access private
 */
export function isPointerModality(): boolean {
	return lastPointer;
}

/**
 * Starts tracking the last input modality on the document. Listeners are installed once per
 * document, in the capture phase so a handler that stops propagation cannot hide an event, and
 * stay for the life of the page.
 *
 * @access private
 */
export function useFocusModalityTracking(): void {
	useIsomorphicLayoutEffect(() => {
		if (trackedDocuments.has(document)) {
			return;
		}

		trackedDocuments.add(document);
		document.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
		document.addEventListener('keydown', onKeyDown, { capture: true, passive: true });
	}, []);
}
