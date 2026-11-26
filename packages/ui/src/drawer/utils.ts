import type { Drawer } from '@base-ui/react/drawer';
import type { ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { hasTitle } from '../breadcrumb/utils.js';
import type { AskedDrawers, CloseAnswer, DrawerTrailEntry } from './drawer-stack-context.js';
import type {
	DrawerCloseReasonType,
	DrawerCrumbType,
	DrawerTrailSelectReasonType,
	DrawerTrailStepType,
} from './types.js';

const CLOSE_REASONS: ReadonlySet<string> = new Set<DrawerCloseReasonType>([
	'escape-key',
	'outside-press',
	'close-press',
	'swipe',
]);

const NO_TITLE = '<No title>';

const PAGE_KEYS: ReadonlySet<string> = new Set([
	'ArrowUp',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'Home',
	'End',
]);

/**
 * Keeps the arrow keys, `Home` and `End` on their way to the page. Base UI stops them at the popup
 * of every dialog and drawer, so a composite the popup is declared in keeps its roving focus, and
 * a `keydown` listener on `document` never sees them. Its handler is skipped for these keys only,
 * so `Esc` still closes the panel.
 *
 * @access private
 */
export function letPageKeysThrough(
	event: Parameters<NonNullable<Drawer.Popup.Props['onKeyDown']>>[0],
): void {
	if (PAGE_KEYS.has(event.key)) {
		event.preventBaseUIHandler();
	}
}

/**
 * Lets the arrow keys, `Home` and `End` through a modal drawer when they come from a drawer nested
 * in it. Every drawer between that one and this one has let them through already, and a nested
 * `task` stops them before they get here. Keys from this drawer's own panel, or from a popup
 * portalled out of it such as a menu, stay stopped.
 *
 * @access private
 */
export function letNestedDrawerKeysThrough(
	event: Parameters<NonNullable<Drawer.Popup.Props['onKeyDown']>>[0],
): void {
	const panel =
		event.target instanceof Element ? event.target.closest('[data-slot="drawer-popup"]') : null;
	if (panel !== null && panel !== event.currentTarget) {
		letPageKeysThrough(event);
	}
}

/**
 * The reason `onClose` reports for a Base UI change reason, or `undefined` for one it does not
 * report. A drawer with no trigger, no `actionsRef` and no snap points closes for the four reasons
 * of `DrawerCloseReasonType`, and on Android for the back gesture, which Base UI reports as
 * `close-watcher`. That is the platform's `Esc`, so it is reported as `escape-key`: dropped, the
 * drawer would stay open and the next back press would leave the page.
 *
 * @access private
 */
export function toDrawerCloseReason(reason: string): DrawerCloseReasonType | undefined {
	if (reason === 'close-watcher') {
		return 'escape-key';
	}

	return CLOSE_REASONS.has(reason) ? (reason as DrawerCloseReasonType) : undefined;
}

/**
 * Whether an `onClose` returned a promise, which its drawer waits for before it goes on.
 *
 * @access private
 */
export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
	return (
		(typeof value === 'object' || typeof value === 'function') &&
		value !== null &&
		'then' in value &&
		typeof value.then === 'function'
	);
}

/**
 * Reports an error of an `onClose` as an uncaught error, when nothing is left to throw into: a
 * promise that rejected after its request went on, or a throw on `parent-close`, which runs in
 * React's commit. The app should still see it.
 *
 * @access private
 */
export function reportAsyncError(error: unknown): void {
	if (typeof reportError === 'function') {
		reportError(error);

		return;
	}
	setTimeout(() => {
		throw error;
	}, 0);
}

/**
 * Hands on `value` in the next task. A state update made after an `await` commits in a task React
 * schedules for it, not in a microtask, so the next drawer would still read as open when the
 * `onClose` before it removed it, such as by clearing the selection that renders both.
 *
 * @access private
 */
export function afterNextTask<T>(value: T): Promise<T> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(value);
		}, 0);
	});
}

/**
 * Runs `next` with the answer, once there is one. An answer that is not a promise gets `next` at
 * once, in the same call, so a request whose `onClose` is synchronous never waits for a microtask.
 *
 * @access private
 */
export function afterAnswer(
	answer: CloseAnswer,
	next: (agreed: boolean) => CloseAnswer,
): CloseAnswer {
	return typeof answer === 'boolean' ? next(answer) : answer.then(next);
}

const refusedPresses = new WeakSet<AskedDrawers>();

/**
 * Hands on the answer to the press `asked`, and remembers the press as refused when it is `false`.
 *
 * @access private
 */
export function answerPress(asked: AskedDrawers, answer: CloseAnswer): CloseAnswer {
	if (answer === false) {
		refusedPresses.add(asked);
	} else if (answer !== true) {
		// Kept out of the chain, so the caller's own handlers on `answer` run no later.
		void answer.then((agreed) => {
			if (!agreed) {
				refusedPresses.add(asked);
			}
		});
	}

	return answer;
}

/**
 * Whether a drawer refused the press `asked`, or the press stopped at a drawer whose close waits.
 * A drawer that agreed to a refused press may stay open, so it gets `parent-close` again.
 *
 * @access private
 */
export function wasRefused(asked: AskedDrawers): boolean {
	return refusedPresses.has(asked);
}

/**
 * The first of `titles` that renders something, or `<No title>`, so a missing name shows in
 * review. Blank is judged the way `Breadcrumb` judges it, so a crumb named here is never dropped
 * from the trail.
 *
 * @access private
 */
export function displayTitle(...titles: readonly ReactNode[]): ReactNode {
	return titles.find((title) => hasTitle(title)) ?? NO_TITLE;
}

/**
 * The breadcrumb trail a drawer ends: the trail of the drawer it is nested in, then its own
 * earlier `steps`, then its own crumb, named by its `title` when the crumb has none. Its steps and
 * its crumb share its `close` and `isOpen`.
 *
 * Showing one of its steps unmounts the content it was declared in, and the drawers declared there
 * with it, before they hear of it. So a step asks `closeNested` first, and is shown only when every
 * drawer nested in this one agreed to close and this one is still open.
 *
 * @access private
 */
export function buildTrail({
	parentTrail,
	steps,
	crumb,
	title,
	close,
	closeNested,
	isOpen,
	onTrailSelect,
}: {
	parentTrail: readonly DrawerTrailEntry[];
	steps: readonly DrawerTrailStepType[];
	crumb: DrawerCrumbType | undefined;
	title: string;
	close: DrawerTrailEntry['close'];
	/**
	 * Asks the drawers nested in this one to close, and answers whether every one agreed.
	 */
	closeNested: (reason: DrawerCloseReasonType, asked?: AskedDrawers) => CloseAnswer;
	isOpen: DrawerTrailEntry['isOpen'];
	onTrailSelect: ((index: number, reason: DrawerTrailSelectReasonType) => void) | undefined;
}): DrawerTrailEntry[] {
	return [
		...parentTrail,
		...steps.map((step, index): DrawerTrailEntry => ({
			...step,
			close,
			isOpen,
			select: (reason, asked) => {
				void afterAnswer(closeNested(reason, asked), (agreed) => {
					// A drawer nested in this one may close this one as it closes, and the app may
					// close it while one decides.
					if (agreed && isOpen()) {
						onTrailSelect?.(index, reason);
					}

					return agreed;
				});
			},
		})),
		{ ...crumb, title: displayTitle(crumb?.title, title), close, isOpen },
	];
}

type CloseEntry = Pick<DrawerTrailEntry, 'close' | 'isOpen'>;

/**
 * Asks each open drawer of `entries` to close, the one on top first, each once, and stops at the
 * first one that cancels, such as a form that opens an unsaved-changes `AlertDialog` instead.
 * Answers whether every one agreed, with no promise when every `onClose` answered at once. One
 * that returns a promise is waited for, then the next is asked. A drawer that stays open without
 * cancelling counts as closing, since its app may close it later, in a transition or a timer.
 *
 * `asked` is the press this is part of. It skips the drawers already in it, such as the drawer to
 * keep when stepping back, or a drawer of a trail that the trail asked before the drawer below it
 * asked its own nested drawers, which include it. A drawer already closed is skipped as well.
 *
 * Each request is flushed before the next, so the next `onClose` runs after the app rendered what
 * the last one did, and `isOpen` reads it.
 *
 * @access private
 */
export function closeTopFirst(
	entries: readonly CloseEntry[] | (() => Iterable<CloseEntry>),
	reason: DrawerCloseReasonType,
	asked: AskedDrawers = new Set(),
): CloseAnswer {
	// Trails have a fixed order. A nested stack can gain an inspector while another decides,
	// so read its current registrations before asking for each next decision.
	const trail = typeof entries === 'function' ? [] : [...entries];
	const nextOpen = (): CloseEntry | undefined => {
		const remaining = typeof entries === 'function' ? [...entries()] : trail;
		let entry = remaining.pop();
		while (entry && (asked.has(entry.isOpen) || !entry.isOpen())) {
			entry = remaining.pop();
		}

		return entry;
	};
	const askNext = (): CloseAnswer => {
		for (;;) {
			const entry = nextOpen();
			if (!entry) {
				return true;
			}
			asked.add(entry.isOpen);

			const answer = flushSync(() => entry.close(reason, asked));
			if (answer !== true) {
				return afterAnswer(answer, (agreed) => agreed && askNext());
			}
		}
	};

	return askNext();
}

/**
 * Steps back to the crumb at `index`: closes every drawer after it with `crumb-press`, the one on
 * top first, then shows the crumb's step when it is an earlier step of a drawer's own `trail`. The
 * drawer of that crumb stays open, and a drawer above it that cancels stops the step back. It waits
 * for an `onClose` that returns a promise. The step closes the drawers nested in its own drawer
 * first, the same way, as the trail does not list an inspector open over it.
 *
 * @access private
 */
export function stepBackInTrail(trail: readonly DrawerTrailEntry[], index: number): void {
	const target = trail[index];
	if (target === undefined) {
		return;
	}

	// The steps of the target share its `isOpen`, so the press never asks the drawer it steps into.
	const asked: AskedDrawers = new Set([target.isOpen]);
	void afterAnswer(closeTopFirst(trail.slice(index + 1), 'crumb-press', asked), (agreed) => {
		if (agreed && target.isOpen()) {
			target.select?.('crumb-press', asked);
		}

		return agreed;
	});
}

/**
 * Closes every drawer of a trail with `reason`, the one on top first, each once, until one
 * cancels. It waits for an `onClose` that returns a promise.
 *
 * @access private
 */
export function leaveTrail(
	trail: readonly DrawerTrailEntry[],
	reason: DrawerCloseReasonType,
): void {
	void closeTopFirst(trail, reason);
}
