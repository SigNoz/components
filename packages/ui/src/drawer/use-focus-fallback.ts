import { useEffect } from 'react';

/**
 * Moves the focus to `panel` when the focused element inside it unmounts, such as the copy button
 * or a field of the body when `loading` turns on.
 *
 * The browser drops that focus to `body`. A modal drawer's focus trap takes it back, but an
 * inspector has none, so a keyboard user would land at the top of the page. Chrome fires
 * `focusout` with no `relatedTarget` just before it removes the element. A press on the page fires
 * the same event, so the check waits until the change has committed and acts only when the element
 * is gone and nothing else took the focus.
 *
 * @access private
 */
export function useFocusFallback(panel: HTMLElement | null): void {
	useEffect(() => {
		if (!panel) {
			return;
		}

		const handleFocusOut = (event: FocusEvent): void => {
			// The target of a `focusout` on an element is always a node.
			const lostFocus = event.target as Node | null;
			if (event.relatedTarget !== null || lostFocus === null) {
				return;
			}

			queueMicrotask(() => {
				const { activeElement, body } = panel.ownerDocument;
				const focusIsLost = activeElement === null || activeElement === body;

				if (focusIsLost && !lostFocus.isConnected && panel.isConnected) {
					panel.focus();
				}
			});
		};

		panel.addEventListener('focusout', handleFocusOut);

		return () => {
			panel.removeEventListener('focusout', handleFocusOut);
		};
	}, [panel]);
}
