import { type RefObject, useEffect, useState } from 'react';
import { useFormReset } from './use-form-reset.js';

/**
 * The value a control shows, and the setter its own input calls, under the one rule every value
 * control in the library follows:
 *
 * - `value` that is `undefined` on the first render leaves the control uncontrolled. It starts at
 *   `defaultValue`, or at `empty` without one, and keeps its own state.
 * - A `value` that arrives later is followed: the control switches to `value` and logs a warning,
 *   since the starting value belongs on the first render (`defaultValues` in react-hook-form).
 * - Once controlled, it stays controlled. A `value` that turns `undefined` or `null` shows `empty`,
 *   so a Combobox cleared to `undefined` stays cleared.
 *
 * `null` counts as a written value: a control that accepts it treats it as controlled and empty.
 *
 * With `formResetRef`, a reset of the form around that element brings an uncontrolled control back
 * to the first `defaultValue`, the way a form reset restores a native input, and calls no
 * `onChange`. A controlled control keeps `value`: the form's `onReset` owns it.
 *
 * @access private
 */
export function useControlledValue<T>({
	component,
	prop = 'value',
	value,
	defaultValue,
	empty,
	formResetRef,
}: {
	/**
	 * The component name the warning starts with.
	 */
	component: string;
	/**
	 * The name of the controlled prop, for the warning.
	 *
	 * @default 'value'
	 */
	prop?: string;
	value: T | null | undefined;
	defaultValue: T | undefined;
	/**
	 * What the control shows with nothing selected.
	 */
	empty: T;
	/**
	 * An element inside the control's form, whose reset restores the starting value.
	 */
	formResetRef?: RefObject<Element | null>;
}): [value: T, setValue: (next: T) => void, isControlled: boolean] {
	const [startedUncontrolled] = useState(value === undefined);
	const [wasControlled, setWasControlled] = useState(!startedUncontrolled);
	const [startValue] = useState<T>(defaultValue ?? empty);
	const [ownValue, setOwnValue] = useState<T>(startValue);
	const isControlled = wasControlled || value !== undefined;

	// Stored during render, as React's "previous render" pattern, so the switch never shows a frame
	// of the old state. It only ever goes from uncontrolled to controlled.
	if (isControlled && !wasControlled) {
		setWasControlled(true);
	}

	useEffect(() => {
		if (startedUncontrolled && isControlled) {
			console.warn(
				`${component}: \`${prop}\` was \`undefined\` on the first render and is set now, so it stops keeping its own state and follows \`${prop}\`. Pass the starting value on the first render, the empty one included.`,
			);
		}
	}, [component, prop, startedUncontrolled, isControlled]);

	useFormReset(formResetRef, () => {
		if (!isControlled) {
			setOwnValue(startValue);
		}
	});

	function setValue(next: T): void {
		if (!isControlled) {
			setOwnValue(next);
		}
	}

	return [isControlled ? (value ?? empty) : ownValue, setValue, isControlled];
}
