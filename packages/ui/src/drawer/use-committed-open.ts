import { useCallback, useMemo, useRef } from 'react';
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
	// Trail entries retain their reader across async closes. Each opening needs its own identity.
	const opening = useMemo(() => (isOpen ? Symbol() : null), [isOpen]);
	const committedRef = useRef<symbol | null>(null);

	useIsomorphicLayoutEffect(() => {
		committedRef.current = opening;

		return () => {
			committedRef.current = null;
		};
	}, [opening]);

	return useCallback(() => opening !== null && committedRef.current === opening, [opening]);
}
