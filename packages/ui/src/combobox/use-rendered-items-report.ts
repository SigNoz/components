import { useEffect, useRef } from 'react';

/**
 * Hands `onRenderedItemsChange` the values of the `item` rows the list holds, after each commit
 * that holds a different set than the last one reported, while the popup is open.
 *
 * Base UI keeps the rows mounted after the popup closes, for the typeahead of the closed trigger,
 * so the mount alone does not say anyone can see them. Closing forgets the last report, so the
 * next open reports again.
 *
 * @access private
 */
export function useRenderedItemsReport(
	values: readonly string[],
	open: boolean,
	onRenderedItemsChange: ((values: string[]) => void) | undefined,
): void {
	const reported = useRef<readonly string[] | null>(null);

	// No dependency list: the virtual rows hand a new array on every scroll frame, and a caller's
	// inline callback is new on every render, so the comparison below is what tells a new set from
	// the same one.
	useEffect(() => {
		if (!open) {
			reported.current = null;
			return;
		}

		if (onRenderedItemsChange === undefined) {
			return;
		}

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
	});
}
