import type { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import type { AriaAttributes, ComponentProps, ReactNode } from 'react';
import type {
	TabsAlignment,
	TabsOrientation,
	TabsScrollDirection,
	TabsVariant,
} from './constants.js';

type OriginalTabProps = ComponentProps<typeof TabsPrimitive.Tab>;

export type TabsVariantType = (typeof TabsVariant)[keyof typeof TabsVariant];
export type TabsAlignmentType = (typeof TabsAlignment)[keyof typeof TabsAlignment];
export type TabsOrientationType = (typeof TabsOrientation)[keyof typeof TabsOrientation];
export type TabsScrollDirectionType =
	(typeof TabsScrollDirection)[keyof typeof TabsScrollDirection];

/**
 * What a navigating tab renders as, taken from Base UI's own `render` prop.
 *
 * Either the element to render in the tab's place, which keeps its own props and receives the
 * tab's on top, or a function handed those props and the tab's state (`active`, `disabled`,
 * `orientation`, `tabActivationDirection`).
 */
export type TabsItemRenderType = NonNullable<OriginalTabProps['render']>;

/**
 * Everything a tab carries regardless of what it renders as, or whether it can be selected.
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
 * What the tab shows, and what element it renders as.
 *
 * A tab either owns a panel or navigates, never both. An item with `children` renders a `<button>`
 * and the bar renders that item's panel. An item with `render` renders whatever the call site hands
 * over, a router `Link` in practice, and the panel is the bar's own `children` (an `Outlet`), which
 * belongs to the router rather than to any one item.
 */
type TabsItemContentType =
	| {
			/**
			 * The panel shown while this tab is active.
			 */
			children: ReactNode;
			render?: never;
	  }
	| {
			children?: never;
			/**
			 * Renders this tab as something else, keeping `role="tab"`, the keyboard behaviour and
			 * every `data-*` the bar stamps.
			 *
			 * @note For a real anchor, so a tab can be middle-clicked, opened in a new tab and read
			 * off the status bar. `<Link to="/logs" />` is the whole prop.
			 *
			 * @note Ignored while `disabled` is true: an anchor stays reachable through middle click
			 * and the context menu, so a disabled tab renders the plain `<button>` instead.
			 */
			render: TabsItemRenderType;
	  };

/**
 * One tab in the bar.
 *
 * `disabled` and `disabledTooltip` travel together. Items are plain data rather than call sites, so
 * a union expresses the pairing directly, unlike a component's own props (see `RadioGroup`'s
 * `ValidateRadioGroupProps` for the call-site version of the same rule).
 */
export type TabsItemProps = TabsItemBaseType &
	TabsItemContentType &
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

/**
 * The rules below are the ones the item union cannot express on its own, because they pair a prop
 * on the bar with the shape of `items`. Each is an object whose single required key is the sentence
 * the compiler should print, the same device `RadioGroup` uses.
 */
interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which also names every tab': never;
}

interface ANavigatingTabBarTakesItsValueFromTheRouter {
	'every item has `render`, so the active tab is wherever the router is: pass `value`': never;
}

interface ANavigatingTabBarHasNoDefaultValue {
	'`defaultValue` cannot hold a bar whose tabs navigate, pass `value` from the router instead': never;
}

interface ThePanelComesFromTheItemThatOwnsIt {
	'`children` is the panel for tabs that navigate, an item with its own `children` already has one': never;
}

/**
 * True while every item in `items` has `Shape`, false while any of them does not, and false when
 * the shape of `items` is unknown.
 *
 * `items` written inline is a literal, so `I` is the union of those exact objects and the answer is
 * real. `items` passed as a `TabsItemProps[]` variable makes `I` the whole union, which satisfies
 * no shape, so every rule below stands down rather than firing on a call site it cannot read.
 */
type TabsItemsAllHave<T, Shape> = T extends { items: readonly (infer I)[] }
	? [I] extends [Shape]
		? true
		: false
	: false;

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
export type ValidateTabsProps<T> = (T extends { 'data-testid': unknown }
	? TheTestIdPropIsCalledTestId
	: unknown) &
	(TabsItemsAllHave<T, { render: unknown }> extends true
		? (T extends { value: unknown } ? unknown : ANavigatingTabBarTakesItsValueFromTheRouter) &
				(T extends { defaultValue: unknown } ? ANavigatingTabBarHasNoDefaultValue : unknown)
		: unknown) &
	(TabsItemsAllHave<T, { children: unknown }> extends true
		? T extends { children: unknown }
			? ThePanelComesFromTheItemThatOwnsIt
			: unknown
		: unknown);

export type TabsProps = Pick<ComponentProps<'div'>, 'id' | 'className' | 'style'> &
	AriaAttributes & {
		/**
		 * The tabs, in the order they are rendered. The component owns the bar's markup, so the tabs
		 * themselves are never composed as children.
		 */
		items: TabsItemProps[];
		/**
		 * The one panel shown for whichever tab is active, for a bar whose tabs navigate rather than
		 * hold their own content. A router `Outlet` in practice.
		 *
		 * @note Only for items that carry `render`. An item with `children` brings its own panel, and
		 * writing both is a type error.
		 *
		 * @note Optional even then: a bar whose panel is rendered elsewhere in the tree (a layout
		 * route holding the `Outlet` above or beside the bar) leaves this out and renders tabs alone.
		 */
		children?: ReactNode;
		/**
		 * The visual style of the tab bar.
		 */
		variant: TabsVariantType;
		/**
		 * The layout flow of the tab bar and its panels.
		 *
		 * @note `vertical` turns the bar into a rail beside the panel, and every side-named prop
		 * below follows it: `start` becomes the top edge and `end` the bottom one.
		 */
		orientation: TabsOrientationType;
		/**
		 * How the tab bar positions itself along its own axis within its container.
		 *
		 * @note `start` is the left edge of a horizontal bar and the top edge of a vertical one.
		 */
		alignment: TabsAlignmentType;
		/**
		 * The controlled active item's `key`.
		 *
		 * @note Use with `onChange`. For an uncontrolled bar use `defaultValue` instead.
		 *
		 * @note Required when every item carries `render`: the router owns which tab is active, and
		 * a bar keeping its own state would drift from the URL on back and forward.
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
		 * Content rendered before the tab list, in the same row or column as the bar.
		 *
		 * @note `start` is the left edge while `orientation` is `horizontal` and the top edge while
		 * it is `vertical`.
		 *
		 * @note Keeps its size while the list scrolls. A bar too narrow for its tabs shrinks the
		 * list, never this block.
		 */
		tabBarStartContent?: ReactNode;
		/**
		 * Content rendered after the tab list, in the same row or column as the bar.
		 *
		 * @note `end` is the right edge while `orientation` is `horizontal` and the bottom edge
		 * while it is `vertical`.
		 *
		 * @note Keeps its size while the list scrolls. A bar too narrow for its tabs shrinks the
		 * list, never this block.
		 */
		tabBarEndContent?: ReactNode;
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
