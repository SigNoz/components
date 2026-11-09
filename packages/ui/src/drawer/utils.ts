import type { ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { hasTitle } from '../breadcrumb/utils.js';
import type { DrawerTrailEntry } from './drawer-stack-context.js';
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
 * @access private
 */
export function buildTrail({
	parentTrail,
	steps,
	crumb,
	title,
	close,
	isOpen,
	onTrailSelect,
}: {
	parentTrail: readonly DrawerTrailEntry[];
	steps: readonly DrawerTrailStepType[];
	crumb: DrawerCrumbType | undefined;
	title: string;
	close: DrawerTrailEntry['close'];
	isOpen: DrawerTrailEntry['isOpen'];
	onTrailSelect: ((index: number, reason: DrawerTrailSelectReasonType) => void) | undefined;
}): DrawerTrailEntry[] {
	return [
		...parentTrail,
		...steps.map((step, index): DrawerTrailEntry => ({
			...step,
			close,
			isOpen,
			select: (reason) => {
				onTrailSelect?.(index, reason);
			},
		})),
		{ ...crumb, title: displayTitle(crumb?.title, title), close, isOpen },
	];
}

/**
 * Asks each drawer of `entries` but the one of `keep` to close, the one on top first, each once,
 * and stops at the first one that stays open, such as a form that opens an unsaved-changes
 * `AlertDialog` instead. Returns whether every one closed.
 *
 * Each request is flushed before the next, so `isOpen` reads what its `onClose` did.
 */
function closeTopFirst(
	entries: readonly DrawerTrailEntry[],
	reason: DrawerCloseReasonType,
	keep?: DrawerTrailEntry['close'],
): boolean {
	const asked = new Set<DrawerTrailEntry['close']>(keep ? [keep] : []);

	for (const entry of [...entries].reverse()) {
		if (asked.has(entry.close)) {
			continue;
		}
		asked.add(entry.close);

		flushSync(() => {
			entry.close(reason);
		});
		if (entry.isOpen()) {
			return false;
		}
	}

	return true;
}

/**
 * Steps back to the crumb at `index`: closes every drawer after it with `crumb-press`, the one on
 * top first, then shows the crumb's step when it is an earlier step of a drawer's own `trail`. The
 * drawer of that crumb stays open, and a drawer above it that stays open stops the step back.
 *
 * @access private
 */
export function stepBackInTrail(trail: readonly DrawerTrailEntry[], index: number): void {
	const target = trail[index];
	if (target === undefined) {
		return;
	}

	if (closeTopFirst(trail.slice(index + 1), 'crumb-press', target.close)) {
		target.select?.('crumb-press');
	}
}

/**
 * Closes every drawer of a trail with `reason`, the one on top first, each once, until one stays
 * open.
 *
 * @access private
 */
export function leaveTrail(
	trail: readonly DrawerTrailEntry[],
	reason: DrawerCloseReasonType,
): void {
	closeTopFirst(trail, reason);
}
