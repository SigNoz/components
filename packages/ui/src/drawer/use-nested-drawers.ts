import { useCallback, useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import type { NestedDrawerEntry } from './drawer-stack-context.js';
import type { DrawerCloseReasonType } from './types.js';
import { closeTopFirst } from './utils.js';

type UseNestedDrawersOptions = {
	/**
	 * Registers this drawer with the drawer it is declared in, `undefined` for one that is not
	 * nested.
	 */
	nestInParent: ((entry: NestedDrawerEntry) => () => void) | undefined;
	isOpen: boolean;
	readIsOpen: () => boolean;
	/**
	 * Asks this drawer alone to close, through `onClose` or the handle.
	 */
	requestClose: (reason: DrawerCloseReasonType) => void;
};

type NestedDrawers = {
	/**
	 * Hands to the drawers declared in this one, which call it while they are open.
	 */
	nest: (entry: NestedDrawerEntry) => () => void;
	/**
	 * Asks the drawers open over this one to close, the one on top first, then this one, and stops
	 * at the first one that stays open.
	 */
	closeWithNested: (reason: DrawerCloseReasonType) => void;
};

/**
 * Closes the drawers open over a drawer before it. A drawer nested in another unmounts with it and
 * never reports its own close, so the app would open it again with the drawer below. Each one is
 * asked first, with the same reason, and one that stays open, such as a form behind an
 * unsaved-changes `AlertDialog`, keeps the drawer below open too.
 *
 * @access private
 */
export function useNestedDrawers({
	nestInParent,
	isOpen,
	readIsOpen,
	requestClose,
}: UseNestedDrawersOptions): NestedDrawers {
	// The drawers open over this one, in the order they opened.
	const nestedRef = useRef(new Set<NestedDrawerEntry>());
	const nest = useCallback((entry: NestedDrawerEntry) => {
		nestedRef.current.add(entry);
		return () => {
			nestedRef.current.delete(entry);
		};
	}, []);

	const closeWithNested = (reason: DrawerCloseReasonType): void => {
		if (closeTopFirst([...nestedRef.current], reason)) {
			requestClose(reason);
		}
	};

	// The drawer below calls it when it closes, which may be renders after this one registered.
	const closeRef = useRef(closeWithNested);
	useIsomorphicLayoutEffect(() => {
		closeRef.current = closeWithNested;
	});
	useEffect(() => {
		if (!isOpen || !nestInParent) {
			return undefined;
		}

		return nestInParent({
			close: (reason) => {
				closeRef.current(reason);
			},
			isOpen: readIsOpen,
		});
	}, [isOpen, nestInParent, readIsOpen]);

	return { nest, closeWithNested };
}
