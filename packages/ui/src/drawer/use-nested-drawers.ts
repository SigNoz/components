import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import type { AskedDrawers, CloseAnswer, NestedDrawerEntry } from './drawer-stack-context.js';
import type { DrawerCloseReasonType } from './types.js';
import {
	afterAnswer,
	afterNextTask,
	answerPress,
	closeTopFirst,
	reportAsyncError,
	wasRefused,
} from './utils.js';

type UseNestedDrawersOptions = {
	/**
	 * Registers this drawer with the drawer it is declared in, `undefined` for one that is not
	 * nested.
	 */
	nestInParent: ((entry: NestedDrawerEntry) => () => void) | undefined;
	isOpen: boolean;
	readIsOpen: () => boolean;
	/**
	 * Asks this drawer alone to close, through `onClose` or the handle. Answers whether it agreed:
	 * `false` when `onClose` called `cancel()` or its promise rejected.
	 */
	requestClose: (reason: DrawerCloseReasonType) => CloseAnswer;
};

type NestedDrawers = {
	/**
	 * Hands to the drawers declared in this one, which call it while they are open.
	 */
	nest: (entry: NestedDrawerEntry) => () => void;
	/**
	 * Asks the drawers open over this one to close, the one on top first, and stops at the first one
	 * that cancels. Answers whether every one agreed.
	 */
	closeNested: (reason: DrawerCloseReasonType, asked?: AskedDrawers) => CloseAnswer;
	/**
	 * Asks the drawers open over this one to close, the one on top first, then this one, and stops
	 * at the first one that cancels. Answers whether every one agreed. While a close of this drawer
	 * waits on a promise, it asks nothing and answers `false`.
	 */
	closeWithNested: (reason: DrawerCloseReasonType, asked?: AskedDrawers) => CloseAnswer;
};

/**
 * Closes the drawers open over a drawer before it. A drawer nested in another unmounts with it and
 * never reports its own close, so the app would open it again with the drawer below. Each one is
 * asked first, with the same reason, and one that calls `cancel()`, such as a form behind an
 * unsaved-changes `AlertDialog`, keeps the drawer below open too. One whose `onClose` returns a
 * promise is waited for. Any other counts as closing, however and whenever its app closes it.
 *
 * When the app closes the drawer instead, with `open={false}` or `handle.close()`, the drawers
 * still open over it get `parent-close` in the same commit, the one on top first, so they slide out
 * with it rather than vanish when it unmounts. That reaches every drawer over it, even past one
 * whose app keeps it open, but a drawer that agreed to a close already is not asked again, unless a
 * drawer below it refused that close. A drawer the app removes from the tree while it is open sends
 * it as it goes, with nothing to slide out.
 *
 * @access private
 */
export function useNestedDrawers({
	nestInParent,
	isOpen,
	readIsOpen,
	requestClose,
}: UseNestedDrawersOptions): NestedDrawers {
	// An ancestor can reopen while this drawer stays mounted with its own open prop true.
	const openingRef = useRef(0);
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

	// The press this drawer agreed to, and its app closes it, maybe later: in a transition, a timer or
	// after an `await`, which React commits in a task of its own. A `parent-close` meanwhile, such as
	// from an `onClose` that went back and so removed the drawer below, would be a second `onClose`
	// for one close. Kept until it commits closed, opens again, or is asked again, and no longer
	// counts once a drawer below refused that press, as its app may keep it open then.
	const agreedRef = useRef<AskedDrawers | null>(null);
	// The request of this opening that is waiting for its answer. A drawer that closes and opens
	// again while its old `onClose` promise waits is a new opening, and that answer is not its own.
	const askRef = useRef<{ invoking: boolean } | null>(null);
	const askToClose = (reason: DrawerCloseReasonType, asked: AskedDrawers): CloseAnswer => {
		const ask = { invoking: true };
		askRef.current = ask;
		agreedRef.current = null;

		const settle = (agreed: boolean): boolean => {
			if (askRef.current !== ask) {
				return false;
			}
			agreedRef.current = agreed ? asked : null;

			return agreed;
		};
		let answer: CloseAnswer;
		try {
			answer = requestCloseRef.current(reason);
		} catch (error) {
			ask.invoking = false;
			throw error;
		}
		ask.invoking = false;
		if (typeof answer === 'boolean') {
			return settle(answer);
		}

		// The answer counts as soon as the promise settles, for a drawer below that the `onClose`
		// removed. The next drawer is asked a task later: a state update made after an `await`
		// commits in a task React schedules for it, so that drawer would still read as open.
		return answer
			.then(settle)
			.then(afterNextTask)
			.then((agreed) => agreed && askRef.current === ask);
	};

	// A close of this drawer that waits on a promise, its own or one of a drawer over it. The token
	// tells it from a close made after this drawer opened again, which clears it.
	const pendingRef = useRef<object | null>(null);

	// A trail step and a full close both wait on this drawer, even if the inspector that is
	// deciding has already removed itself from the nested stack.
	const runClose = (
		reason: DrawerCloseReasonType,
		asked: AskedDrawers,
		includeSelf: boolean,
	): CloseAnswer => {
		if (pendingRef.current !== null) {
			return answerPress(asked, false);
		}

		const token = {};
		const opening = openingRef.current;
		const nested = closeTopFirst(
			() => (openingRef.current === opening && readIsOpen() ? nestedRef.current : []),
			reason,
			asked,
		);
		const answer = afterAnswer(nested, (nestedAgreed) => {
			if (!nestedAgreed) {
				return false;
			}
			if (typeof nested !== 'boolean' && pendingRef.current !== token) {
				return false;
			}
			// The `onClose` of a drawer over this one may close this one too, such as by clearing the
			// selection that renders both, and so may the app while one decides. Asking again would
			// run its close twice. This sees a close committed in the `flushSync` that asked that
			// drawer, or after its returned promise settled and a task passed, but not one still
			// waiting in a transition or a timer.
			if (!includeSelf || !readIsOpen()) {
				return true;
			}

			// A promise resumes outside the flush that asked this drawer. Commit what its own
			// handler does before the next ancestor reads whether it is still open.
			return typeof nested === 'boolean'
				? askToClose(reason, asked)
				: flushSync(() => askToClose(reason, asked));
		});
		if (typeof answer === 'boolean') {
			return answerPress(asked, answer);
		}

		pendingRef.current = token;

		return answerPress(
			asked,
			answer.finally(() => {
				if (pendingRef.current === token) {
					pendingRef.current = null;
				}
			}),
		);
	};

	const closeNested: NestedDrawers['closeNested'] = (reason, asked = new Set()) =>
		runClose(reason, asked, false);
	const closeWithNested: NestedDrawers['closeWithNested'] = (reason, asked = new Set()) =>
		runClose(reason, asked, true);

	// The drawers over this one go first, and each passes it on before its own `onClose`: one whose
	// app keeps it open after `parent-close` still unmounts with this one, and so do the drawers over
	// it.
	const closeNestedWithParent = (): void => {
		for (const entry of [...nestedRef.current].reverse()) {
			if (entry.isOpen() || entry.removedOpen()) {
				entry.closeWithParent();
			}
		}
	};
	// Each drawer below sweeps the drawers over it again as it closes, so one whose app keeps it open
	// would get `parent-close` once per drawer below. It gets it once, until it or a drawer below it
	// opens again.
	const parentClosedRef = useRef(false);
	const reopenUnder = (): void => {
		openingRef.current += 1;
		parentClosedRef.current = false;
		agreedRef.current = null;
		askRef.current = null;
		pendingRef.current = null;
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
		// A synchronous navigation can remove the parent inside the original onClose.
		const agreed = agreedRef.current;
		if ((agreed === null || wasRefused(agreed)) && !askRef.current?.invoking) {
			// It cannot refuse, and nothing waits for it. This runs in React's commit, where a throw
			// unmounts the app up to the nearest error boundary and skips the drawers below this one.
			try {
				void requestClose('parent-close');
			} catch (error) {
				reportAsyncError(error);
			}
		}
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

		agreedRef.current = null;
		// A close the user asked for has closed every drawer over this one already.
		closeNestedWithParent();
	}, [isOpen]);

	// The app removed this drawer while it was open, which the effect above never sees. That runs in
	// the passive cleanup: a Suspense boundary that shows its fallback cleans up the layout effects
	// of the drawers it hides and keeps them, open, for when it shows them again. By then every
	// drawer over this one reads as closed, so they are told by `removedOpen`. React cleans up a
	// deleted tree from the top, while Strict Mode's simulated unmount cleans up from the bottom, so
	// a drawer that mounted with this one has left `nestedRef` and is left alone.
	const removedOpenRef = useRef(false);
	useIsomorphicLayoutEffect(() => {
		removedOpenRef.current = false;

		return () => {
			removedOpenRef.current = wasOpenRef.current;
		};
	}, []);
	useEffect(
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
			getNested: () => nestedRef.current,
			close: (reason, asked) => closeRef.current(reason, asked),
			closeWithParent: () => {
				closeWithParentRef.current();
			},
			parentOpened: () => {
				reopenUnderRef.current();
			},
			isOpen: readIsOpen,
			removedOpen: () => removedOpenRef.current,
		});
	}, [isOpen, nestInParent, readIsOpen]);

	return { nest, closeNested, closeWithNested };
}
