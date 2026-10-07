import type { CSSProperties, RefObject } from 'react';
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

/**
 * Runs `onClose` for the close button of a callout. With `finalFocus`, focus that was in the
 * callout moves to that element once `onClose` has closed the callout. Without it, focus is not
 * moved.
 *
 * @access private
 */
export function closeAndMoveFocus(
	button: HTMLElement,
	onClose: () => void,
	finalFocus: RefObject<HTMLElement | null> | undefined,
): void {
	const { ownerDocument } = button;
	const root = button.closest<HTMLElement>('[data-slot="callout"]');

	// Focus that was never in the callout is not taken. A mouse click in Safari does not focus the
	// button, and moving focus there would scroll the page to `finalFocus`.
	if (finalFocus == null || !root?.contains(ownerDocument.activeElement)) {
		onClose();

		return;
	}

	// Commits the `closed` that `onClose` sets, so the check below sees whether the callout is gone.
	flushSync(onClose);

	// Focus `onClose` moved elsewhere, and a callout `onClose` kept open, are left alone.
	if (!root.isConnected && ownerDocument.activeElement === ownerDocument.body) {
		finalFocus.current?.focus();
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
