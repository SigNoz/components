import type { Ref } from 'react';

/**
 * Point several refs at the same node.
 *
 * The calendar's root needs this because react-day-picker keeps a ref of its own there while
 * `animate` is set, and the consumer's `ref` has to reach the same element.
 *
 * @access private
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): (node: T | null) => void {
	return (node) => {
		for (const ref of refs) {
			if (typeof ref === 'function') {
				ref(node);
			} else if (ref != null) {
				(ref as { current: T | null }).current = node;
			}
		}
	};
}

/**
 * The day as `DD-MM-YYYY`, for the `testId` a day button falls back to.
 *
 * Read off the local calendar rather than off UTC: `toISOString` would shift the day for anyone
 * east or west of UTC, and `toLocaleDateString` gives a different string per locale, so neither is
 * safe on an attribute a test selects by. Both fields are zero-padded, so a test that picks
 * `01-07-2025` out of the grid finds the day the user sees there whatever time zone the run is in.
 *
 * @access private
 */
export function formatDayTestId(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${day}-${month}-${date.getFullYear()}`;
}
