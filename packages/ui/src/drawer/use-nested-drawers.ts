import { useEffect, useRef } from 'react';
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
 * When the app closes the drawer instead, with `open={false}` or `handle.close()`, the drawers
 * still open over it get `parent-close` in the same commit, the one on top first, so they slide out
 * with it rather than vanish when it unmounts. That reaches every drawer over it, even past one
 * whose app keeps it open.
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
	const nest = (entry: NestedDrawerEntry): (() => void) => {
		nestedRef.current.add(entry);
		return () => {
			nestedRef.current.delete(entry);
		};
	};

	const closeWithNested = (reason: DrawerCloseReasonType): void => {
		if (closeTopFirst([...nestedRef.current], reason)) {
			requestClose(reason);
		}
	};

	// The drawers over this one go first, and each passes it on before its own `onClose`: one whose
	// app keeps it open after `parent-close` still unmounts with this one, and so do the drawers over
	// it.
	const closeNestedWithParent = (): void => {
		for (const entry of [...nestedRef.current].reverse()) {
			if (entry.isOpen()) {
				entry.closeWithParent();
			}
		}
	};
	const closeWithParent = (): void => {
		closeNestedWithParent();
		requestClose('parent-close');
	};

	const wasOpenRef = useRef(isOpen);
	useIsomorphicLayoutEffect(() => {
		const closedNow = wasOpenRef.current && !isOpen;
		wasOpenRef.current = isOpen;
		if (!closedNow) {
			return;
		}

		// A close the user asked for has closed every drawer over this one already.
		closeNestedWithParent();
	}, [isOpen]);

	// The drawer below calls these when it closes, which may be renders after this one registered.
	const closeRef = useRef(closeWithNested);
	const closeWithParentRef = useRef(closeWithParent);
	useIsomorphicLayoutEffect(() => {
		closeRef.current = closeWithNested;
		closeWithParentRef.current = closeWithParent;
	});
	useEffect(() => {
		if (!isOpen || !nestInParent) {
			return undefined;
		}

		return nestInParent({
			close: (reason) => {
				closeRef.current(reason);
			},
			closeWithParent: () => {
				closeWithParentRef.current();
			},
			isOpen: readIsOpen,
		});
	}, [isOpen, nestInParent, readIsOpen]);

	return { nest, closeWithNested };
}
