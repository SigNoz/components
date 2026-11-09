import { useCallback, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';

/**
 * A function that reads whether the drawer is open as of the last commit, for code that runs after
 * a `flushSync`, such as a breadcrumb trail that closes its drawers one at a time and stops at one
 * that stays open.
 *
 * An unmounted drawer reads as closed, since a consumer may close a drawer by unmounting it.
 *
 * @access private
 */
export function useCommittedOpen(isOpen: boolean): () => boolean {
	const openRef = useRef(false);

	useIsomorphicLayoutEffect(() => {
		openRef.current = isOpen;

		return () => {
			openRef.current = false;
		};
	}, [isOpen]);

	return useCallback(() => openRef.current, []);
}
