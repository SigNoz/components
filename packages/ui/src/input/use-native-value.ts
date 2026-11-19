import { useState } from 'react';
import { useControlledValue } from '../lib/use-controlled-value.js';

type NativeValue = string | number | readonly string[];

/**
 * The `value` or `defaultValue` prop for a native text control, under the rule of
 * `useControlledValue`.
 *
 * @access private
 */
export function useNativeValue({
	component,
	value,
	defaultValue,
}: {
	component: string;
	value: NativeValue | null | undefined;
	defaultValue: NativeValue | undefined;
}): { value: NativeValue } | { defaultValue: NativeValue | undefined } {
	const [shown, , isControlled] = useControlledValue<NativeValue>({
		component,
		value,
		defaultValue,
		empty: '',
	});
	// React writes a changed `defaultValue` into a field the user has not typed in yet, so it is
	// held at the first render's value to match the controls that keep their own state.
	const [firstDefaultValue] = useState(defaultValue);

	return isControlled ? { value: shown } : { defaultValue: firstDefaultValue };
}
