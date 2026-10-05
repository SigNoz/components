import { isValidElement, type ReactNode } from 'react';

/**
 * The text a node puts on screen, as far as it can be read without rendering it.
 *
 * Strings and numbers are the text itself, and an array or a fragment is the text of its parts. An
 * element is opaque: its children may come from a component the caller cannot run. That is what
 * `searchMetadata` is for on the components that search their rows.
 *
 * @access private
 */
export function toSearchText(node: ReactNode): string {
	if (typeof node === 'string') {
		return node;
	}

	if (typeof node === 'number') {
		return String(node);
	}

	if (Array.isArray(node)) {
		return node.map(toSearchText).join('');
	}

	if (isValidElement<{ children?: ReactNode }>(node)) {
		return toSearchText(node.props.children);
	}

	return '';
}

/**
 * Drops the separators that have nothing to separate: one that would land first, one that would
 * land last, and the second of any two in a row.
 *
 * @access private
 */
export function cleanupSeparators<T>(items: readonly T[], isSeparator: (item: T) => boolean): T[] {
	const cleaned: T[] = [];

	for (const item of items) {
		if (!isSeparator(item)) {
			cleaned.push(item);
			continue;
		}

		const last = cleaned[cleaned.length - 1];

		if (last === undefined || isSeparator(last)) {
			continue;
		}

		cleaned.push(item);
	}

	while (cleaned.length > 0 && isSeparator(cleaned[cleaned.length - 1] as T)) {
		cleaned.pop();
	}

	return cleaned;
}
