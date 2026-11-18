import { useState } from 'react';
import { useControlledValue } from '../lib/use-controlled-value.js';

type NativeValue = string | number | readonly string[];

/**
 * The `value` or the `defaultValue` a native text control renders, under the one rule every value
 * control follows (see `useControlledValue`). The native element has no state to hand over, so an
 * uncontrolled control renders the `defaultValue` of its first render and no `value`, and a
 * controlled one renders `value`, the empty string for `null` and `undefined`.
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
