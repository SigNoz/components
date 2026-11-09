import type { MouseEvent } from 'react';

/**
 * Whether a click is the plain one that follows a link in place. A modifier key or another button
 * opens the link elsewhere, which leaves the page, and so what is open on it, as it is.
 *
 * @access private
 */
export function isPlainClick(
	event: Pick<MouseEvent, 'button' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey'>,
): boolean {
	return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
