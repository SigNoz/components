import type { Drawer } from '@base-ui/react/drawer';
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
 * drawer nested in this one closed and this one is still open.
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
	 * Asks the drawers nested in this one to close, and returns whether every one did.
	 */
	closeNested: (reason: DrawerCloseReasonType) => boolean;
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
				// A drawer nested in this one may close this one as it closes.
				if (closeNested(reason) && isOpen()) {
					onTrailSelect?.(index, reason);
				}
			},
		})),
		{ ...crumb, title: displayTitle(crumb?.title, title), close, isOpen },
	];
}

/**
 * Asks each open drawer of `entries` but the one of `keep` to close, the one on top first, each
 * once, and stops at the first one that stays open, such as a form that opens an unsaved-changes
 * `AlertDialog` instead. Returns whether every one closed. A drawer already closed is skipped: the
 * drawers nested in a drawer of a trail include the later ones of the trail, which closed first.
 *
 * Each request is flushed before the next, so `isOpen` reads what its `onClose` did.
 *
 * @access private
 */
export function closeTopFirst(
	entries: readonly Pick<DrawerTrailEntry, 'close' | 'isOpen'>[],
	reason: DrawerCloseReasonType,
	keep?: DrawerTrailEntry['close'],
): boolean {
	const asked = new Set<DrawerTrailEntry['close']>(keep ? [keep] : []);

	for (const entry of [...entries].reverse()) {
		if (asked.has(entry.close) || !entry.isOpen()) {
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
 * drawer of that crumb stays open, and a drawer above it that stays open stops the step back. The
 * step closes the drawers nested in its own drawer first, the same way, as the trail does not list
 * an inspector open over it.
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
