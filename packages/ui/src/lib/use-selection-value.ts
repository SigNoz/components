import { useMemo, useState } from 'react';

function toValues(value: string | readonly string[] | null | undefined): string[] {
	if (value === undefined || value === null) {
		return [];
	}

	return (typeof value === 'string' ? [value] : [...value]).filter((entry) => entry !== '');
}

/**
 * @access private
 */
export type UseSelectionValueOptions = {
	isControlled: boolean;
	multiple: boolean;
	/**
	 * Decides what a single selection reports once it is emptied: `null`, or `undefined` without it.
	 * `null` and `undefined` as `value` mean an empty selection either way.
	 */
	nullable: boolean;
	value: string | readonly string[] | null | undefined;
	defaultValue: string | readonly string[] | undefined;
	onChange:
		| ((value: string[]) => void)
		| ((value: string) => void)
		| ((value: string | null) => void)
		| ((value: string | undefined) => void)
		| undefined;
};

/**
 * The selection of a field that picks one value or several, as a list in both modes, controlled or
 * not, and `commit`, which reports a change in the shape of the mode: the list with `multiple`, its
 * first value otherwise, or the empty value of the mode when there is none.
 *
 * @access private
 */
export function useSelectionValue({
	isControlled,
	multiple,
	nullable,
	value,
	defaultValue,
	onChange,
}: UseSelectionValueOptions): {
	selectedValues: string[];
	commit: (next: string[]) => void;
} {
	const [uncontrolledValues, setUncontrolledValues] = useState<string[]>(() =>
		toValues(defaultValue),
	);
	const controlledValues = useMemo(() => toValues(value), [value]);
	const selectedValues = isControlled ? controlledValues : uncontrolledValues;

	function commit(next: string[]): void {
		if (!isControlled) {
			setUncontrolledValues(next);
		}

		if (multiple) {
			(onChange as ((value: string[]) => void) | undefined)?.(next);
		} else {
			(onChange as ((value: string | null | undefined) => void) | undefined)?.(
				next[0] ?? (nullable ? null : undefined),
			);
		}
	}

	return { selectedValues, commit };
}
