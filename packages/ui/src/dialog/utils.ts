import type { DialogCloseReasonType } from './types.js';

const CLOSE_REASONS: ReadonlySet<string> = new Set<DialogCloseReasonType>([
	'escape-key',
	'outside-press',
	'close-press',
]);

/**
 * Narrows a Base UI change reason to the ones `onClose` reports. A modal dialog with no trigger
 * and no `actionsRef` only closes for these three.
 *
 * @access private
 */
export function isDialogCloseReason(reason: string): reason is DialogCloseReasonType {
	return CLOSE_REASONS.has(reason);
}

/**
 * Handler for the auto focus events of a Radix `FocusScope` that only cancels them, so Base UI
 * stays the one that places the focus on open and on close.
 *
 * @access private
 */
export function preventDefault(event: Event): void {
	event.preventDefault();
}
