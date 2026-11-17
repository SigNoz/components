/**
 * The items of a list without the ones whose `value` an earlier item already has, so of two items
 * with the same `value` only the first renders, with its key, test ID and state its own.
 *
 * @access private
 */
export function uniqueByValue<T extends { value: string }>(items: readonly T[]): T[] {
	const seen = new Set<string>();

	return items.filter((item) => {
		if (seen.has(item.value)) {
			return false;
		}

		seen.add(item.value);

		return true;
	});
}
