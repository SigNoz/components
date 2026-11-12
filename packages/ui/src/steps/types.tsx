import type { AriaAttributes, ComponentProps, ReactNode } from 'react';
import type { StepsStatus } from './constants.js';

export type StepsStatusType = (typeof StepsStatus)[keyof typeof StepsStatus];

/**
 * One step of {@link Steps}.
 */
export type StepsItem = {
	/**
	 * Names the step. One line: text that does not fit is cut with `…`, and a tooltip shows it in
	 * full.
	 *
	 * @note An empty label, or one with only spaces, shows `<No label>`. The step is never hidden,
	 * so the numbers of the steps after it do not move.
	 */
	label: string;
	/**
	 * One line under the label, such as the choice the user made in that step. Cut and given a
	 * tooltip the same way as the label.
	 *
	 * @note A description that is empty or only spaces is not shown.
	 *
	 * @note When one step has a description, every step keeps the line of the description, so the
	 * row does not grow when a description arrives.
	 */
	description?: string;
};

/**
 * One step of {@link Steps.List}.
 */
export type StepsListItem = {
	/**
	 * A title next to the marker. Leave it out when the content shows its own title. It wraps, and
	 * is never cut.
	 */
	label?: string;
	/**
	 * The content of the step. Any element, such as a form with its own controls.
	 *
	 * @note A step whose content renders nothing still shows its marker, so the numbers stay in
	 * order.
	 *
	 * @note When a step can be removed or moved, give this element a `key`, such as the id of the
	 * step. The step is matched by that key and keeps its state, such as a value typed in its form.
	 * Without a key, the steps are matched by their position, and the state of a removed step shows
	 * in the step that takes its place.
	 */
	children: ReactNode;
};

type StepsRootProps = Pick<ComponentProps<'ol'>, 'id'> &
	AriaAttributes & {
		/**
		 * Forwarded to the root as `data-testid`. The steps take it as a prefix:
		 * `${testId}-item-${number}`, and each part adds its name to that.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the root.
		 */
		[key: `data-${string}`]: unknown;
	};

export type StepsProps = StepsRootProps & {
	/**
	 * The steps, in the order of the flow. The first one is step 1.
	 *
	 * @note An empty array renders nothing.
	 */
	items: readonly StepsItem[];
	/**
	 * The number of the current step, starting at 1, the same number the marker shows. The steps
	 * before it are done and the steps after it are waiting.
	 *
	 * @note A number above the count of steps marks every step done, and no step is current.
	 *
	 * @note A number below 1, or one that is not an integer, renders as `1` and warns in the
	 * console. With an empty `items` nothing renders, and nothing warns.
	 */
	current: number;
};

export type StepsListProps = StepsRootProps & {
	/**
	 * The steps, in order. The first one is step 1.
	 *
	 * @note An empty array renders nothing, unless there is a `footer`. With an empty array there is
	 * no `ol`, so `id` and every `aria-*` have no element to land on.
	 */
	items: readonly StepsListItem[];
	/**
	 * A row after the last step, such as the button that adds a step. It sits in the content column,
	 * with a dot in place of a number, and the line of the last step runs down to it.
	 *
	 * @note It is not a step: it takes no number. It renders after the `ol`, not inside it, so a
	 * screen reader does not count it in the list.
	 *
	 * @note With an empty `items`, the footer renders alone, so the first step can still be added.
	 */
	footer?: ReactNode;
};
