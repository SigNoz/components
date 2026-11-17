import { useEffect, useState } from 'react';

/**
 * @access private
 */
export type UseFirstRenderControlOptions<T> = {
	value: T | undefined;
	defaultValue: T | undefined;
	/**
	 * The state with nothing picked or open: what a controlled component shows once `value` turns
	 * `undefined`.
	 */
	empty: T;
	/**
	 * Logged when `value` turns `undefined` on a component that was controlled on the first render.
	 */
	turnedUndefinedWarning: string;
	/**
	 * Logged when `value` appears on a component that was uncontrolled on the first render.
	 */
	appearedWarning: string;
};

/**
 * A value that is controlled or kept by the component itself. Decided once, on the first render:
 * `undefined` there makes it uncontrolled for the rest of its life, and a later switch either way
 * logs a warning and is ignored.
 *
 * A component that always hands its primitive a value, since it keeps its own even uncontrolled,
 * hides the switch from the primitive, so this is the only place that can warn about it.
 *
 * @access private
 */
export function useFirstRenderControl<T>({
	value,
	defaultValue,
	empty,
	turnedUndefinedWarning,
	appearedWarning,
}: UseFirstRenderControlOptions<T>): [T, (next: T) => void] {
	const [isControlled] = useState(value !== undefined);
	const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue ?? empty);
	const isControlledNow = value !== undefined;

	useEffect(() => {
		if (isControlled && !isControlledNow) {
			console.warn(turnedUndefinedWarning);
		}

		if (!isControlled && isControlledNow) {
			console.warn(appearedWarning);
		}
	}, [isControlled, isControlledNow, turnedUndefinedWarning, appearedWarning]);

	function setValue(next: T): void {
		if (!isControlled) {
			setUncontrolledValue(next);
		}
	}

	return [isControlled ? (value ?? empty) : uncontrolledValue, setValue];
}
