import type { Menu } from '@base-ui/react/menu';
import type { AriaAttributes, ComponentProps, MouseEvent, ReactElement, ReactNode } from 'react';
import type { DropdownItemKind } from './constants.js';

type OriginalPositionerProps = Menu.Positioner.Props;
type OriginalPortalProps = Menu.Portal.Props;
type OriginalItemProps = Menu.Item.Props;

export type DropdownItemKindType = (typeof DropdownItemKind)[keyof typeof DropdownItemKind];

/**
 * What a navigating row renders as, taken from Base UI's own `render` prop.
 *
 * Either the element to render in the row's place, which keeps its own props and receives the
 * row's on top, or a function handed those props and the row's state.
 */
export type DropdownItemRenderType = NonNullable<OriginalItemProps['render']>;

/**
 * `disabled` and `disabledTooltip` travel together on a row.
 *
 * Rows are plain data rather than call sites, so a union expresses the pairing here, unlike the
 * component's own props (see {@link ValidateDropdownProps}).
 *
 * @note The empty branch goes last, here and in every union a row is built from. The compiler
 * explains a failed assignment against the last member, so a row missing some other prop is told
 * about that prop instead of about `disabledTooltip`.
 */
export type DropdownItemDisabledType =
	| {
			/**
			 * When true, blocks this row alone.
			 *
			 * @note Requires `disabledTooltip`.
			 *
			 * @note The row is marked `aria-disabled` rather than removed from the keyboard, so the
			 * reason stays reachable. Arrow keys still land on it.
			 *
			 * @note Suppressed entirely while `loading` is true, along with `disabledTooltip`.
			 */
			disabled: boolean;
			/**
			 * Why this row cannot be used. Only renders while `disabled` is true.
			 *
			 * @note Only allowed alongside `disabled`. Pass `undefined` when there is no reason to
			 * give.
			 */
			disabledTooltip: ReactNode;
	  }
	| {
			disabled?: never;
			disabledTooltip?: never;
	  };

/**
 * `loading` and `loadingTooltip` travel together on a row, the same way {@link
 * DropdownItemDisabledType} does.
 */
export type DropdownItemLoadingType =
	| {
			/**
			 * When true, the row is waiting on something of its own: a spinner takes the leading
			 * slot, or the trailing one when the row has no prefix, and the row goes inert.
			 *
			 * @note Requires `loadingTooltip`.
			 *
			 * @note Outranks `disabled`, the way it does on `Button`. While this is true the row is
			 * not disabled at all, whatever `disabled` says, and `disabledTooltip` does not render.
			 *
			 * @note The row keeps its highlight stop, which is what makes `loadingTooltip`
			 * reachable by keyboard.
			 */
			loading: boolean;
			/**
			 * What the row is waiting for, shown in a tooltip while `loading` is true.
			 *
			 * @note Only allowed alongside `loading`. Pass `undefined` when there is no reason to
			 * give.
			 */
			loadingTooltip: ReactNode;
	  }
	| {
			loading?: never;
			loadingTooltip?: never;
	  };

/**
 * What every selectable row carries, whatever kind it is.
 */
type DropdownRowBaseType = {
	/**
	 * What the user reads on the row. Also its accessible name.
	 *
	 * @note A node that renders nothing (`null`, `false` or an empty string) falls back to the text
	 * `<No label>`, and the row carries `data-empty-label`. The row still renders: an action that
	 * disappears takes a choice out of the menu without saying so.
	 */
	label: ReactNode;
	/**
	 * This row's identity. Keys the list and names the row's `data-testid`.
	 *
	 * @note Unique among its siblings. Two siblings sharing one are indistinguishable to the
	 * component. Rows at different levels may share one.
	 */
	value: string;
	/**
	 * Extra text the built-in search matches against, on top of the label.
	 *
	 * @note This is what makes an icon-only or a node label findable at all: the search reads a
	 * label only when it renders to text.
	 */
	searchMetadata?: string;
	/**
	 * Forwarded to the row as `data-testid`.
	 *
	 * @note Optional because the menu names its rows: with a `testId` on `Dropdown`, a row with
	 * none of its own is addressable as `` `${dropdownTestId}-item-${value}` ``. Write this only to
	 * give one row a name of its own, which then wins.
	 */
	testId?: string;
};

/**
 * The leading slot, for the kinds that do not spend it on a selection control.
 */
type DropdownRowPrefixType = {
	/**
	 * Element rendered at the start of the row. An icon, sized to `--dropdown-item-icon-size`.
	 *
	 * @note Replaced by a spinner while the row is loading. A row without one shows the spinner in
	 * the trailing slot instead, in place of the suffix.
	 */
	prefix?: ReactElement;
};

/**
 * The trailing slot, for the kinds that do not spend it on a disclosure.
 */
type DropdownRowSuffixType = {
	/**
	 * Element rendered at the end of the row. An icon, sized to `--dropdown-item-icon-size`.
	 */
	suffix?: ReactElement;
};

/**
 * One action. The row a menu is mostly made of.
 */
export type DropdownActionItemType = DropdownRowBaseType &
	DropdownRowPrefixType &
	DropdownItemDisabledType &
	DropdownItemLoadingType &
	(
		| {
				suffix?: never;
				/**
				 * A keyboard shortcut, rendered in the trailing slot through `Kbd`.
				 *
				 * @note Documentation only. The component does not bind the key.
				 *
				 * @note Takes the trailing slot, so it cannot be combined with `suffix`.
				 */
				shortcut: ReactNode;
		  }
		| (DropdownRowSuffixType & { shortcut?: never })
	) & {
		type: typeof DropdownItemKind.Item;
		/**
		 * Called when the row is picked. The menu closes right after.
		 *
		 * @note Not called while the row is `disabled` or `loading`. To show work in flight, set
		 * `loading` on the row from your own state.
		 */
		onClick?: (event: MouseEvent) => void;
		/**
		 * When true, paints the row in the danger foreground.
		 *
		 * @note Design asks for these last in the menu and separated from the rest. That is
		 * documentation: the component renders `items` in the order it is given.
		 *
		 * @default false
		 */
		danger?: boolean;
	};

/**
 * One row that navigates. The action row's counterpart: it has no `onClick`, it has a `render`.
 *
 * The row is whatever the call site hands over, a router `Link` in practice, so it is a real
 * anchor: middle click, "open in new tab" and the URL in the status bar all work. That is the
 * whole reason the kind exists, and the reason it takes no `href` of its own: a link component
 * takes a `to`, a `href`, a `params` object or nothing at all, and the component cannot know
 * which.
 */
export type DropdownLinkItemType = DropdownRowBaseType &
	DropdownRowPrefixType &
	DropdownRowSuffixType &
	DropdownItemDisabledType &
	DropdownItemLoadingType & {
		type: typeof DropdownItemKind.Link;
		/**
		 * Renders this row as something else, keeping `role="menuitem"`, the keyboard walk, the
		 * tooltips and the row's `data-testid`. `<Link to="/logs" />` is the whole prop.
		 *
		 * @note Ignored while the row is inert, through `disabled` or `loading`. An anchor stays reachable through middle click and the context menu, so
		 * the only way to block one is not to render it: the row falls back to the plain,
		 * non-navigating one.
		 *
		 * @note The menu closes when the row is picked. Navigation is the action, so there is no
		 * return value to read and no `onClick` here: put the handler on the element you render.
		 */
		render: DropdownItemRenderType;
	};

/**
 * One row that toggles a setting.
 *
 * The row draws its own checkbox in the trailing slot, which is why there is no `suffix`: a row
 * carries at most one selection control, and there is no slot to put a second one in.
 */
export type DropdownCheckboxItemType = Omit<DropdownRowBaseType, 'value'> &
	DropdownRowPrefixType &
	DropdownItemDisabledType &
	DropdownItemLoadingType & {
		type: typeof DropdownItemKind.Checkbox;
		/**
		 * This row's identity. Keys the list and names the row's `data-testid`, as
		 * `` `${dropdownTestId}-item-${name}` ``.
		 *
		 * @note Named `name` rather than `value`, the identity the other rows carry, because
		 * `value` is the selection here, the way it is on `Checkbox` and `Switch`.
		 *
		 * @note Unique among its siblings. Two siblings sharing one are indistinguishable to the
		 * component. Rows at different levels may share one.
		 */
		name: string;
		/**
		 * Whether the row is ticked.
		 *
		 * @note Use with `onChange`. For an uncontrolled row use `defaultValue` instead.
		 */
		value?: boolean;
		/**
		 * Whether the row is ticked on the first render, for a row that keeps its own state.
		 *
		 * @note Use with `onChange`. For a controlled row use `value` instead.
		 *
		 * @note The state lives on the menu, so it survives the menu closing and the search hiding
		 * the row. It resets when the `Dropdown` itself unmounts.
		 */
		defaultValue?: boolean;
		/**
		 * Called with the new state when the row is ticked or unticked.
		 *
		 * @note Never called while the row is disabled or loading.
		 */
		onChange?: (value: boolean) => void;
	};

/**
 * One option inside a `radio-group` row.
 *
 * The row draws its own radio in the trailing slot, which is why there is no `suffix`.
 */
export type DropdownRadioItemType = DropdownRowBaseType &
	DropdownRowPrefixType &
	DropdownItemDisabledType &
	DropdownItemLoadingType;

/**
 * A set of options, of which one is picked.
 *
 * The group owns its radios, so there is no slot for a second selection control.
 */
export type DropdownRadioGroupItemType = DropdownItemDisabledType & {
	type: typeof DropdownItemKind.RadioGroup;
	/**
	 * This group's identity. Keys the list and names the group's `data-testid`.
	 *
	 * @note Named `name` rather than `value`, the identity the other rows carry, because `value`
	 * is the selection here, the way it is on `RadioGroup`. A `checkbox` row does the same.
	 */
	name: string;
	/**
	 * The controlled selection, which is one of the options' `value`s.
	 *
	 * @note Use with `onChange`. For an uncontrolled group use `defaultValue` instead.
	 */
	value?: string;
	/**
	 * The option selected on the first render, for a group that keeps its own state.
	 *
	 * @note Use with `onChange`. For a controlled group use `value` instead.
	 *
	 * @note The state lives on the menu, the same way a checkbox row's `defaultValue` does.
	 */
	defaultValue?: string;
	/**
	 * Called with the newly selected option's `value`.
	 *
	 * @note Never called for a disabled or loading option, or while the group is disabled.
	 */
	onChange?: (value: string) => void;
	/**
	 * The options, in the order they are rendered.
	 */
	items: DropdownRadioItemType[];
};

/**
 * A rule between two runs of rows.
 */
export type DropdownSeparatorItemType = {
	type: typeof DropdownItemKind.Separator;
	/**
	 * This separator's identity, which keys the list.
	 *
	 * @note A separator that would land first, last, or next to another one is dropped, so it never
	 * needs a `testId` of its own.
	 */
	value: string;
};

/**
 * The kinds that hold no other rows.
 */
export type DropdownLeafItemType =
	| DropdownActionItemType
	| DropdownLinkItemType
	| DropdownCheckboxItemType
	| DropdownRadioGroupItemType
	| DropdownSeparatorItemType;

/**
 * What a group may hold: every leaf kind, plus a submenu.
 *
 * A group is a heading rather than a nesting level, so a submenu inside one is still depth 1. Only
 * `group` itself is excluded, because a heading under a heading has no meaning.
 */
export type DropdownGroupChildType = DropdownLeafItemType | DropdownSubmenuItemType;

/**
 * What a submenu may hold: every leaf kind, plus a group of leaves.
 *
 * `submenu` is excluded, which is how the design's one-level rule is enforced by the type rather
 * than by a runtime check. A group inside a submenu may hold leaves alone, for the same reason.
 */
export type DropdownSubmenuChildType =
	| DropdownLeafItemType
	| DropdownGroupItemType<DropdownLeafItemType>;

/**
 * A section heading and the rows under it.
 *
 * @typeParam TChild - what this group may hold, which depends on where it sits.
 */
export type DropdownGroupItemType<TChild = DropdownGroupChildType> = {
	type: typeof DropdownItemKind.Group;
	/**
	 * The section header. Non-interactive, and skipped by the arrow keys.
	 */
	label: ReactNode;
	/**
	 * This group's identity. Keys the list and names the group's `data-testid`.
	 */
	value: string;
	/**
	 * The rows under the heading, in the order they are rendered.
	 *
	 * @note A group whose rows are all filtered out disappears, heading included.
	 *
	 * @note They may be all checkboxes or all radios, but the two should not mix. That is
	 * documentation rather than a type: expressing it costs another cross product.
	 */
	items: TChild[];
	/**
	 * Forwarded to the group as `data-testid`. Defaults to `` `${dropdownTestId}-group-${value}` ``.
	 */
	testId?: string;
};

/**
 * A row that opens a menu of its own.
 *
 * The trailing slot is the chevron and is not overridable, which is why there is no `suffix`.
 */
export type DropdownSubmenuItemType = DropdownRowBaseType &
	DropdownRowPrefixType &
	DropdownItemDisabledType &
	DropdownItemLoadingType & {
		type: typeof DropdownItemKind.Submenu;
		/**
		 * The rows of the submenu, in the order they are rendered.
		 *
		 * @note An empty list opens a popup holding the `No results found :/` row and logs a warning. A
		 * submenu with nothing in it is a consumer bug rather than a state.
		 *
		 * @note Another submenu cannot go in here. One level of nesting is the limit, and the type
		 * is what holds it.
		 */
		items: DropdownSubmenuChildType[];
	};

/**
 * One entry of `items`. Seven kinds, told apart by `type`.
 */
export type DropdownItemType =
	| DropdownLeafItemType
	| DropdownSubmenuItemType
	| DropdownGroupItemType<DropdownGroupChildType>;

/**
 * The pinned search row. Passing the object is what renders it.
 */
export type DropdownSearchInputProps = {
	/**
	 * Placeholder text for the search field.
	 */
	placeholder?: string;
	/**
	 * Element rendered at the start of the field. Defaults to the search glyph.
	 */
	prefix?: ReactElement;
	/**
	 * Element rendered at the end of the field. Empty by default.
	 */
	suffix?: ReactElement;
	/**
	 * When true, replaces `prefix` with a spinner and leaves the field usable. The server-side
	 * companion to `filter: false`: the query has gone out and the rows have not come back.
	 *
	 * @note Independent of the component's own `loading`, which replaces the whole list.
	 *
	 * @default false
	 */
	loading?: boolean;
	/**
	 * When false, the component stops filtering `items` and only reports the query through
	 * `onChange`.
	 *
	 * @note Turn it off for a menu whose rows come from a server and are already filtered by the
	 * time they arrive.
	 *
	 * @default true
	 */
	filter?: boolean;
	/**
	 * Called with the current query on every keystroke.
	 */
	onChange?: (value: string) => void;
};

/**
 * The rules below are objects whose single required key is the sentence the compiler should print,
 * the same device `ToggleGroup`, `RadioGroup` and `Button` use, so a violation reads as `Property
 * '<the sentence>' is missing ... but required in type '<the rule name>'` instead of pointing at an
 * unrelated prop.
 */
interface ADisabledDropdownMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface ADisabledReasonNeedsADisabledDropdown {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which lands on the trigger and names every row': never;
}

/**
 * Extra constraints layered on top of {@link DropdownProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to a
 * rule object when they are not.
 *
 * The pairing rules look at which props the call site writes, not at their values, the way
 * `ValidateButtonProps` does: `disabledTooltip={undefined}` is the explicit opt-out.
 */
export type ValidateDropdownProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledDropdownMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledDropdown
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

export type DropdownProps = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes & {
		/**
		 * The rows, in the order they are rendered. The menu owns its markup, so there are no
		 * children to compose.
		 *
		 * @note An empty list renders the `noContent` row, and logs a warning when `noContent` is
		 * not set.
		 */
		items: DropdownItemType[];
		/**
		 * The trigger. Rendered as the element you pass, with the menu's props merged into it, so
		 * it keeps its own `disabled` and its own tooltip.
		 *
		 * @note A trigger that does not render a `<button>` needs `nativeButton={false}`.
		 */
		children: ReactNode;
		/**
		 * When true, the menu does not open, and the trigger carries `aria-disabled` and
		 * `data-disabled`.
		 *
		 * @note Requires `disabledTooltip`.
		 *
		 * @note `aria-disabled` rather than the native `disabled`, so the trigger stays hoverable
		 * and focusable and the reason stays reachable. A `Button` trigger paints itself disabled
		 * from it.
		 *
		 * @note Closes the menu if it is open when this turns true.
		 *
		 * @default false
		 */
		disabled?: boolean;
		/**
		 * Why the menu cannot be opened. Shown in a tooltip on the trigger, and only while
		 * `disabled` is true.
		 *
		 * @note Only allowed alongside `disabled`. Pass `undefined` explicitly when there is no
		 * reason to give.
		 */
		disabledTooltip?: ReactNode;
		/**
		 * Whether the trigger renders a native `<button>`. Base UI only sees the element the child
		 * renders after it mounts, so the menu has to be told up front.
		 *
		 * With `true`, Base UI leaves the element to the browser, which already gives a `<button>`
		 * its role, focus, `disabled` and `Enter` and `Space` activation. With `false`, Base UI
		 * adds those itself: `role="button"`, `tabIndex`, `aria-disabled` and the key handlers.
		 *
		 * @note Leave it on for `Button` or a plain `<button>`, and set it to `false` for anything
		 * else, such as `Badge` or a `<span>`. It cannot be `false` for every trigger: the value
		 * has to match the element, and Base UI logs an error whenever it does not. `true` on a
		 * `Badge` also leaves it with no button role and an `Enter` key that does nothing, and
		 * `false` on a `Button` adds a `role` and an `aria-disabled` it does not need.
		 *
		 * @note Required. The value has to match the trigger, and a default of `true` is silently
		 * wrong for every `Badge` or `<span>` trigger.
		 */
		nativeButton: boolean;
		/**
		 * How the popup is aligned along the side it opens against.
		 *
		 * @note Required. A menu's placement is never incidental: a toolbar-edge trigger wants
		 * `end` and a form field wants `start`, and reading the answer off a default is how a menu
		 * ends up overhanging its trigger.
		 */
		align: OriginalPositionerProps['align'];
		/**
		 * Which side of the trigger the popup opens against. May change on its own to avoid the
		 * edges of the viewport.
		 *
		 * @note Required, for the same reason as `align`.
		 *
		 * @note The logical values (`inline-start`, `inline-end`) mirror under RTL. The physical
		 * ones do not.
		 */
		side: OriginalPositionerProps['side'];
		/**
		 * How wide the popup may get, written as `--dropdown-internal-max-inline-size`.
		 *
		 * @note So it composes with the tokens. A number is written as `px`.
		 *
		 * @default '15.75rem'
		 */
		contentMaxWidth?: number | string;
		/**
		 * How tall the scrolling part of the popup may get, written as
		 * `--dropdown-internal-max-block-size`.
		 *
		 * @note Caps the rows alone. The search row stays pinned above them whatever this is.
		 *
		 * @default '20rem'
		 */
		contentMaxHeight?: number | string;
		/**
		 * The element the popup is portalled into.
		 *
		 * @note Pass the dialog or drawer element to keep the menu inside it.
		 *
		 * @default document.body
		 */
		container?: OriginalPortalProps['container'];
		/**
		 * When true, replaces the rows with `loadingContent` or a spinner.
		 *
		 * @note The search row survives, so a query can still be typed while the rows are on their
		 * way.
		 *
		 * @default false
		 */
		loading?: boolean;
		/**
		 * What to show in place of the rows while `loading` is true. Defaults to a spinner row.
		 */
		loadingContent?: ReactNode;
		/**
		 * What the non-interactive row shows when there is nothing to list: an empty `items`, or
		 * a query that matches nothing.
		 *
		 * @note Setting it declares an empty `items` a state, so no warning is logged. It does not
		 * reach submenus: an empty submenu keeps `No results found :/` and its warning.
		 *
		 * @default 'No results found :/'
		 */
		noContent?: ReactNode;
		/**
		 * The pinned search row. Passing the object is what renders it, so `{}` is a search row
		 * with every default.
		 */
		searchInputProps?: DropdownSearchInputProps;
		/**
		 * Called when the menu opens and when it closes.
		 *
		 * @note The menu owns its open state. This reports it, it does not drive it: there is no
		 * `open` or `defaultOpen`.
		 *
		 * @note For the state a trigger cannot read off itself. The trigger already carries
		 * `data-popup-open` while the menu is open, so a purely visual rule reaches it in CSS
		 * without this.
		 */
		onOpenChange?: (open: boolean) => void;
		/**
		 * Forwarded to the trigger as `data-testid`, and the stem every row is named from.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the popup, alongside `aria-*`.
		 */
		[key: `data-${string}`]: unknown;
	};
