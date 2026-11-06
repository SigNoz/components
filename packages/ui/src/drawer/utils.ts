import type { DrawerCloseReasonType } from './types.js';

const CLOSE_REASONS: ReadonlySet<string> = new Set<DrawerCloseReasonType>([
	'escape-key',
	'outside-press',
	'close-press',
	'swipe',
]);

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
