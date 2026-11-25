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
	 * Asks the drawers open over this one to close, the one on top first, and stops at the first one
	 * that stays open. Returns whether every one closed.
	 */
	closeNested: (reason: DrawerCloseReasonType) => boolean;
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
 * whose app keeps it open. A drawer the app removes from the tree while it is open sends it as it
 * goes, with nothing to slide out.
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

	// Each drawer over this one closes in a `flushSync` that renders the app again, so the
	// `onClose` of this render may read state that is gone by then.
	const requestCloseRef = useRef(requestClose);
	const closeNested = (reason: DrawerCloseReasonType): boolean =>
		closeTopFirst([...nestedRef.current], reason);
	const closeWithNested = (reason: DrawerCloseReasonType): void => {
		if (closeNested(reason)) {
			requestCloseRef.current(reason);
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
	// Each drawer below sweeps the drawers over it again as it closes, so one whose app keeps it open
	// would get `parent-close` once per drawer below. It gets it once, until it or a drawer below it
	// opens again.
	const parentClosedRef = useRef(false);
	const reopenUnder = (): void => {
		parentClosedRef.current = false;
		for (const entry of nestedRef.current) {
			entry.parentOpened();
		}
	};
	const closeWithParent = (): void => {
		if (parentClosedRef.current) {
			return;
		}
		parentClosedRef.current = true;
		closeNestedWithParent();
		requestClose('parent-close');
	};

	const wasOpenRef = useRef(isOpen);
	useIsomorphicLayoutEffect(() => {
		const wasOpen = wasOpenRef.current;
		wasOpenRef.current = isOpen;
		if (isOpen && !wasOpen) {
			reopenUnder();
		}
		if (!wasOpen || isOpen) {
			return;
		}

		// A close the user asked for has closed every drawer over this one already.
		closeNestedWithParent();
	}, [isOpen]);

	// The app removed this drawer while it was open, which the effect above never sees. React cleans
	// up a deleted tree from the top, so the drawers over this one still read as open here. Strict
	// Mode's simulated unmount cleans up from the bottom, so a drawer that mounted with this one reads
	// as closed and is left alone.
	useIsomorphicLayoutEffect(
		() => () => {
			if (wasOpenRef.current) {
				closeNestedWithParent();
			}
		},
		[],
	);

	// The drawer below calls these when it closes, which may be renders after this one registered.
	const closeRef = useRef(closeWithNested);
	const closeWithParentRef = useRef(closeWithParent);
	const reopenUnderRef = useRef(reopenUnder);
	useIsomorphicLayoutEffect(() => {
		requestCloseRef.current = requestClose;
		closeRef.current = closeWithNested;
		closeWithParentRef.current = closeWithParent;
		reopenUnderRef.current = reopenUnder;
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
			parentOpened: () => {
				reopenUnderRef.current();
			},
			isOpen: readIsOpen,
		});
	}, [isOpen, nestInParent, readIsOpen]);

	return { nest, closeNested, closeWithNested };
}
