import type { RefObject } from 'react';
import { flushSync } from 'react-dom';

/**
 * Runs `onClose` for the close button of a component the user can dismiss, `root` being the
 * element the component renders. With `finalFocus`, focus that was in `root` moves to that
 * element once `onClose` has removed `root`. Without it, focus is not moved.
 *
 * @access private
 */
export function closeAndMoveFocus(
	root: HTMLElement | null,
	onClose: () => void,
	finalFocus: RefObject<HTMLElement | null> | undefined,
): void {
	// Focus that was never in the component is not taken. A mouse click in Safari does not focus the
	// button, and moving focus there would scroll the page to `finalFocus`.
	if (root == null || finalFocus == null || !root.contains(root.ownerDocument.activeElement)) {
		onClose();

		return;
	}

	const { ownerDocument } = root;

	// Commits the `closed` that `onClose` sets, so the check below sees whether the component is
	// gone.
	flushSync(onClose);

	// Focus `onClose` moved elsewhere, and a component `onClose` kept open, are left alone.
	if (!root.isConnected && ownerDocument.activeElement === ownerDocument.body) {
		finalFocus.current?.focus();
	}
}
