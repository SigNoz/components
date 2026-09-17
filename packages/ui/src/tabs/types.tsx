import type { AriaAttributes, ComponentProps, ReactNode } from 'react';
import type { TabsAlignment, TabsOrientation, TabsVariant } from './constants.js';

export type TabsVariantType = (typeof TabsVariant)[keyof typeof TabsVariant];
export type TabsAlignmentType = (typeof TabsAlignment)[keyof typeof TabsAlignment];
export type TabsOrientationType = (typeof TabsOrientation)[keyof typeof TabsOrientation];

/**
 * Everything a tab carries regardless of whether it can be selected.
 */
type TabsItemBaseType = {
	/**
	 * Identifies this tab. What `value`/`onChange` carry, and what associates the trigger with its
	 * panel.
	 *
	 * @note Unique within the bar. Two items sharing a key are indistinguishable to the component.
	 */
	key: string;
	/**
	 * What the user reads on the tab itself. Also the tab's accessible name.
	 *
	 * @note A node that renders nothing (`null`, `false` or an empty string) falls back to the text
	 * `<No label>`, and that tab carries `data-empty-label`. The tab still renders: a view that
	 * disappears from the bar removes it from the group without saying so.
	 */
	label: ReactNode;
	/**
	 * The panel shown while this tab is active.
	 */
	children: ReactNode;
	/**
	 * Element rendered before the label.
	 *
	 * @note Replaced by a lock icon while `disabled` is true.
	 */
	prefixIcon?: ReactNode;
	/**
	 * Element rendered after the label.
	 *
	 * @note Hidden while `disabled` is true.
	 */
	suffixIcon?: ReactNode;
};

/**
 * One tab in the bar.
 *
 * `disabled` and `disabledTooltip` travel together. Items are plain data rather than call sites, so
 * a union expresses the pairing directly, unlike a component's own props (see `RadioGroup`'s
 * `ValidateRadioGroupProps` for the call-site version of the same rule).
 */
export type TabsItemProps = TabsItemBaseType &
	(
		| {
				disabled?: never;
				disabledTooltip?: never;
		  }
		| {
				/**
				 * When true, this tab cannot be selected.
				 *
				 * @note Requires `disabledTooltip`.
				 */
				disabled: boolean;
				/**
				 * Why this tab cannot be selected. Only renders while `disabled` is true.
				 *
				 * @note Only allowed alongside `disabled`. Pass `undefined` explicitly when there is no
				 * reason to give.
				 */
				disabledTooltip: ReactNode;
		  }
	);

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which also names every tab': never;
}

/**
 * Extra constraints layered on top of {@link TabsProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to a
 * rule object when they are not. Mirrors `Button`'s and `RadioGroup`'s own `Validate...Props`.
 *
 * @note A wrapper that forwards the whole `TabsProps` type is not checked: `T` is then the type
 * itself, and `unknown` from the passing branch absorbs the rest. Such a wrapper is checked at its
 * own call sites instead.
 */
export type ValidateTabsProps<T> = T extends { 'data-testid': unknown }
	? TheTestIdPropIsCalledTestId
	: unknown;

export type TabsProps = Pick<ComponentProps<'div'>, 'id' | 'className' | 'style'> &
	AriaAttributes & {
		/**
		 * The tabs, in the order they are rendered. The component owns its whole markup, so there are
		 * no children to compose.
		 */
		items: TabsItemProps[];
		/**
		 * The visual style of the tab bar.
		 */
		variant: TabsVariantType;
		/**
		 * The layout flow of the tab bar and its panels.
		 */
		orientation: TabsOrientationType;
		/**
		 * How the tab bar positions itself within its container.
		 */
		alignment: TabsAlignmentType;
		/**
		 * The controlled active item's `key`.
		 *
		 * @note Use with `onChange`. For an uncontrolled bar use `defaultValue` instead.
		 */
		value?: string;
		/**
		 * The active item's `key` on the first render, for a bar that keeps its own state.
		 *
		 * @note Use with `onChange`. For a controlled bar use `value` instead. Falls back to the
		 * first item's `key` when omitted.
		 */
		defaultValue?: string;
		/**
		 * Called with the newly active item's `key`.
		 */
		onChange?: (key: string) => void;
		/**
		 * Content rendered to the left of the tab list, in the same row.
		 */
		tabBarLeftContent?: ReactNode;
		/**
		 * Content rendered to the right of the tab list, in the same row.
		 */
		tabBarRightContent?: ReactNode;
		/**
		 * When true, removes the padding around the active panel.
		 *
		 * @default false
		 */
		noTabContentPadding?: boolean;
		/**
		 * Forwarded to the rendered element as `data-testid`.
		 *
		 * @note Also names every tab: an item with no `testId` of its own is addressable as
		 * `` `${testId}-item-${key}` ``.
		 */
		testId?: string;
		/**
		 * Any `data-*` attribute is accepted and forwarded to the rendered element.
		 */
		[key: `data-${string}`]: unknown;
	};
