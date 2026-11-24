import { useEffect, useRef } from 'react';

/**
 * What the rows call after each commit with the values of the `item` rows they hold.
 *
 * @access private
 */
export type RenderedItemsReport = (values: readonly string[]) => void;

/**
 * Keeps the last set handed to `onRenderedItemsChange`, and returns the function the rows report
 * through: it calls `onRenderedItemsChange` only when the set differs from that one. `undefined`
 * while the popup is closed or nobody listens.
 *
 * The popup holds the last set, not the rows: the rows unmount while `loading`, and a remount that
 * forgot the set would report the same rows again once loading ends. A caller whose `loading`
 * follows the check that the report starts would then loop.
 *
 * Base UI keeps the rows mounted after the popup closes, for the typeahead of the closed trigger,
 * so the mount alone does not say anyone can see them. Closing reports `[]` once and forgets the
 * last report, so the next open reports again. Dropping the callback forgets it too, so a callback
 * passed again later gets the rows on screen without waiting for them to change.
 *
 * @access private
 */
export function useRenderedItemsReport(
	open: boolean,
	onRenderedItemsChange: ((values: string[]) => void) | undefined,
): RenderedItemsReport | undefined {
	const reported = useRef<readonly string[] | null>(null);
	const listening = open && onRenderedItemsChange !== undefined;

	// No dependency list: a caller's inline callback is new on every render, and once the last
	// report is forgotten the next run does nothing.
	useEffect(() => {
		if (listening) {
			return;
		}

		const previous = reported.current;
		reported.current = null;

		if (!open && previous !== null && previous.length > 0) {
			onRenderedItemsChange?.([]);
		}
	});

	if (!listening) {
		return undefined;
	}

	return (values) => {
		const previous = reported.current;

		if (
			previous !== null &&
			previous.length === values.length &&
			previous.every((value, index) => value === values[index])
		) {
			return;
		}

		reported.current = values;
		onRenderedItemsChange([...values]);
	};
}
