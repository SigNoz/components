import type { CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { toCssLength } from '../lib/css-length.js';
import type { CalloutProps } from './types.js';

/**
 * Writes `width`, `maxWidth`, `height` and `maxHeight` as the `--callout-internal-*` properties
 * the tokens read, leaving out the ones that are not set. Numbers are written as `px`.
 *
 * @access private
 */
export function calloutSizeStyle({
	width,
	maxWidth,
	height,
	maxHeight,
}: Pick<CalloutProps, 'width' | 'maxWidth' | 'height' | 'maxHeight'>): CSSProperties {
	return {
		...(width != null && { '--callout-internal-width': toCssLength(width) }),
		...(maxWidth != null && {
			'--callout-internal-max-width': toCssLength(maxWidth),
		}),
		...(height != null && {
			'--callout-internal-height': toCssLength(height),
		}),
		...(maxHeight != null && {
			'--callout-internal-max-height': toCssLength(maxHeight),
		}),
	} as CSSProperties;
}

// What a keyboard user reaches with Tab. `isTabbable` drops the disabled, hidden and
// `tabindex="-1"` ones. Enough to pick where focus goes after a dismissal.
const TABBABLE = 'a[href], button, input, select, textarea, summary, [tabindex], [contenteditable]';

function isTabbable(element: HTMLElement): boolean {
	return (
		element.tabIndex >= 0 && !element.matches(':disabled') && element.getClientRects().length > 0
	);
}

/**
 * The first tabbable element after `root`, or the last one before it at the end of the page.
 * Called while `root` is still mounted, so its own elements can be skipped.
 */
function findFocusTarget(root: HTMLElement): HTMLElement | undefined {
	const candidates = Array.from(root.ownerDocument.querySelectorAll<HTMLElement>(TABBABLE)).filter(
		(element) => !root.contains(element) && isTabbable(element),
	);
	const next = candidates.find(
		(element) => root.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING,
	);

	return next ?? candidates.at(-1);
}

/**
 * Runs `onClose` for the close button of a callout. When focus was inside the callout and
 * `onClose` unmounts it, focus moves to the next tabbable element after the callout, or to the
 * last one before it when nothing follows.
 *
 * @access private
 */
export function closeAndMoveFocus(button: HTMLElement, onClose: () => void): void {
	const { ownerDocument } = button;
	const root = button.closest<HTMLElement>('[data-slot="callout"]');
	const focusTarget =
		root?.contains(ownerDocument.activeElement) === true ? findFocusTarget(root) : undefined;

	// Commits the `closed` that `onClose` sets, so the check below sees whether the callout is gone.
	flushSync(onClose);

	// The button unmounted with the callout and focus fell to the page body, so the next Tab would
	// restart from the top. Focus `onClose` moved elsewhere, and a callout `onClose` kept open, are
	// left alone.
	if (
		focusTarget !== undefined &&
		!root?.isConnected &&
		ownerDocument.activeElement === ownerDocument.body
	) {
		focusTarget.focus();
	}
}

/**
 * `rel` with `noopener` and `noreferrer` added, for a link that opens in a new tab. The values it
 * already holds are kept.
 *
 * @access private
 */
export function withBlankTargetRel(rel: string | undefined): string {
	const values = new Set(rel?.split(/\s+/).filter(Boolean));

	values.add('noopener');
	values.add('noreferrer');

	return [...values].join(' ');
}
