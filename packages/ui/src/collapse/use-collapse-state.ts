import { useFirstRenderControl } from '../lib/use-first-render-control.js';

/**
 * The open state of a `Collapse` (a `boolean`) or a `Collapse.Group` (a list of values),
 * controlled or kept by the component itself, decided on the first render with the rules of
 * `useFirstRenderControl`. The component always hands Base UI a value, so Base UI never sees the
 * switch, and the warnings name the prop of the component.
 *
 * @access private
 */
export function useCollapseState<T>({
	component,
	prop,
	value,
	defaultValue,
	empty,
}: {
	component: string;
	/**
	 * The name of the controlled prop, for the warnings.
	 */
	prop: string;
	value: T | undefined;
	defaultValue: T | undefined;
	/**
	 * The state with nothing open: what a controlled component shows once `value` turns
	 * `undefined`.
	 */
	empty: T;
}): [T, (next: T) => void] {
	return useFirstRenderControl({
		value,
		defaultValue,
		empty,
		turnedUndefinedWarning: `${component}: \`${prop}\` turned \`undefined\`, but it was set on the first render, so it stays controlled and shows nothing open. Write ${JSON.stringify(empty)} to close it.`,
		appearedWarning: `${component}: \`${prop}\` was \`undefined\` on the first render, so it keeps its own state and ignores \`${prop}\`. Pass \`${prop}\` from the first render to control it.`,
	});
}
