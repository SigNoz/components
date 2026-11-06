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
