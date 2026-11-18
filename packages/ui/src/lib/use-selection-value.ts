import { useMemo } from 'react';
import { useControlledValue } from './use-controlled-value.js';

function toValues(value: string | readonly string[]): string[] {
	return (typeof value === 'string' ? [value] : [...value]).filter((entry) => entry !== '');
}

const NO_VALUES: string[] = [];

/**
 * @access private
 */
export type UseSelectionValueOptions = {
	/**
	 * The component name the warning of a `value` that arrives late starts with.
	 */
	component: string;
	multiple: boolean;
	/**
	 * Decides what a single selection reports once it is emptied: `null`, or `undefined` without it.
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
 * Whether the selection is controlled follows `useControlledValue`: `value` decides on the first
 * render, `null` and a later `undefined` both mean an empty selection.
 *
 * @access private
 */
export function useSelectionValue({
	component,
	multiple,
	nullable,
	value,
	defaultValue,
	onChange,
}: UseSelectionValueOptions): {
	selectedValues: string[];
	commit: (next: string[]) => void;
} {
	const written = useMemo(
		() => (value === undefined || value === null ? value : toValues(value)),
		[value],
	);
	const [selectedValues, setSelectedValues] = useControlledValue<string[]>({
		component,
		value: written,
		defaultValue: defaultValue === undefined ? undefined : toValues(defaultValue),
		empty: NO_VALUES,
	});

	function commit(next: string[]): void {
		setSelectedValues(next);

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
