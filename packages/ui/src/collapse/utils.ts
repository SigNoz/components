/**
 * Splits the rest props of `Collapse` into the `data-*` for the root and the `aria-*` for the
 * header button.
 *
 * @access private
 */
export function splitDataAndAria(rest: Record<string, unknown>): {
	dataProps: Record<string, unknown>;
	ariaProps: Record<string, unknown>;
} {
	const dataProps: Record<string, unknown> = {};
	const ariaProps: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(rest)) {
		if (key.startsWith('aria-')) {
			ariaProps[key] = value;
		} else {
			dataProps[key] = value;
		}
	}

	return { dataProps, ariaProps };
}

/**
 * The open values of a group in the order of its items, then any value that matches no item, in
 * the order it came.
 *
 * @access private
 */
export function orderGroupValue(itemValues: readonly string[], open: readonly string[]): string[] {
	const openSet = new Set(open);
	const itemSet = new Set(itemValues);
	const known = itemValues.filter((value) => openSet.has(value));
	const unknown = [...new Set(open)].filter((value) => !itemSet.has(value));

	return [...known, ...unknown];
}
