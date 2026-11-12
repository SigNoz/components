import { useEffect, useState } from 'react';

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
 * @access private
 */
export function useControlledValue<T>({
	component,
	value,
	defaultValue,
	empty,
}: {
	/**
	 * The component name the warning starts with.
	 */
	component: string;
	value: T | null | undefined;
	defaultValue: T | undefined;
	/**
	 * What the control shows with nothing selected.
	 */
	empty: T;
}): [value: T, setValue: (next: T) => void, isControlled: boolean] {
	const [startedUncontrolled] = useState(value === undefined);
	const [wasControlled, setWasControlled] = useState(!startedUncontrolled);
	const [ownValue, setOwnValue] = useState<T>(defaultValue ?? empty);
	const isControlled = wasControlled || value !== undefined;

	// Stored during render, as React's "previous render" pattern, so the switch never shows a frame
	// of the old state. It only ever goes from uncontrolled to controlled.
	if (isControlled && !wasControlled) {
		setWasControlled(true);
	}

	useEffect(() => {
		if (startedUncontrolled && isControlled) {
			console.warn(
				`${component}: \`value\` was \`undefined\` on the first render and is set now, so it stops keeping its own state and follows \`value\`. Pass the starting value on the first render, the empty one included.`,
			);
		}
	}, [component, startedUncontrolled, isControlled]);

	function setValue(next: T): void {
		if (!isControlled) {
			setOwnValue(next);
		}
	}

	return [isControlled ? (value ?? empty) : ownValue, setValue, isControlled];
}
