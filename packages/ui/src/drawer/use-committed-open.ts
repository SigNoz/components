import { useCallback, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';

/**
 * A function that reads whether the drawer is open as of the last commit, for code that runs after
 * a `flushSync`, such as a breadcrumb trail that closes its drawers one at a time and stops at one
 * that stays open.
 *
 * A reader belongs to one opening. If the app closes and reopens the same drawer while a crumb
 * press waits, its old trail still reads as closed. An unmounted drawer also reads as closed.
 *
 * @access private
 */
export function useCommittedOpen(isOpen: boolean): () => boolean {
	// Trail entries retain their reader across async closes, so each opening needs its own identity.
	// It lives in state, which only an opening or a close replaces: a memo may be dropped, and Fast
	// Refresh runs it again, which would make an open drawer read as closed to its old readers.
	const [opening, setOpening] = useState(() => ({ isOpen, token: isOpen ? Symbol() : null }));
	let { token } = opening;
	if (opening.isOpen !== isOpen) {
		token = isOpen ? Symbol() : null;
		setOpening({ isOpen, token });
	}
	const committedRef = useRef<symbol | null>(null);

	useIsomorphicLayoutEffect(() => {
		committedRef.current = token;

		return () => {
			committedRef.current = null;
		};
	}, [token]);

	return useCallback(() => token !== null && committedRef.current === token, [token]);
}
