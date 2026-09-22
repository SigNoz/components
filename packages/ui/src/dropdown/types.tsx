import type { Menu } from '@base-ui/react/menu';
import type { AriaAttributes, ComponentProps, MouseEvent, ReactElement, ReactNode } from 'react';
import type { DropdownItemKind } from './constants.js';

type OriginalPositionerProps = Menu.Positioner.Props;
type OriginalPortalProps = Menu.Portal.Props;

export type DropdownItemKindType = (typeof DropdownItemKind)[keyof typeof DropdownItemKind];

/**
 * `disabled` and `disabledTooltip` travel together on a row.
 *
 * Rows are plain data rather than call sites, so a union expresses the pairing here, unlike the
 * component's own props (see {@link ValidateDropdownProps}).
 */
export type DropdownItemDisabledType =
	| {
			disabled?: never;
			disabledTooltip?: never;
	  }
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
	  };

/**
 * `loading` and `loadingTooltip` travel together on a row, the same way {@link
 * DropdownItemDisabledType} does.
 */
export type DropdownItemLoadingType =
	| {
			loading?: never;
			loadingTooltip?: never;
	  }
	| {
			/**
			 * When true, the row is waiting on something of its own: a spinner takes the leading
			 * slot and the row goes inert.
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
	 * @note Unique among its siblings. Two rows sharing one are indistinguishable to the component.
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
	 * @note Replaced by a spinner while the row is loading or its async `onClick` is in flight.
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
		| (DropdownRowSuffixType & { shortcut?: never })
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
	) & {
		type: typeof DropdownItemKind.Item;
		/**
		 * Called when the row is picked.
		 *
		 * @note The return value decides whether the menu closes. `false` keeps it open, and
		 * `undefined` or `true` closes it at once.
		 *
		 * @note A promise puts the row in `data-pending`, holds the rest of the list inert, and
		 * closes the menu once it resolves, unless it resolves `false`.
		 *
		 * @note A rejection keeps the menu open, clears the pending state and raises a
		 * `toast.error`, which needs a `<Toaster />` mounted in the app to be seen.
		 */
		onClick?: (event: MouseEvent) => Promise<boolean | void> | boolean | void;
		/**
		 * When true, paints the row in the destructive foreground.
		 *
		 * @note Design asks for these last in the menu and separated from the rest. That is
		 * documentation: the component renders `items` in the order it is given.
		 *
		 * @default false
		 */
		destructive?: boolean;
	};

/**
 * One row that toggles a setting.
 *
 * The row owns its checkbox, which is what enforces the rule that a row carries at most one
 * selection control: there is no slot to put a second one in.
 */
export type DropdownCheckboxItemType = DropdownRowBaseType &
	DropdownRowSuffixType &
	DropdownItemDisabledType &
	DropdownItemLoadingType & {
		type: typeof DropdownItemKind.Checkbox;
		/**
		 * Whether the row is ticked.
		 *
		 * @note Use with `onChange`. For an uncontrolled row use `defaultChecked` instead.
		 */
		checked?: boolean;
		/**
		 * Whether the row is ticked on the first render, for a row that keeps its own state.
		 *
		 * @note Use with `onChange`. For a controlled row use `checked` instead.
		 */
		defaultChecked?: boolean;
		/**
		 * Called with the new state when the row is ticked or unticked.
		 *
		 * @note Never called while the row is disabled, loading, or while another row's async
		 * action is in flight.
		 */
		onChange?: (checked: boolean) => void;
	};

/**
 * One option inside a `radio-group` row.
 */
export type DropdownRadioItemType = DropdownRowBaseType &
	DropdownRowSuffixType &
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
	 */
	value: string;
	/**
	 * The controlled selection, which is one of the options' `value`s.
	 *
	 * @note Use with `onChange`. For an uncontrolled group use `defaultSelectedValue` instead.
	 */
	selectedValue?: string;
	/**
	 * The option selected on the first render, for a group that keeps its own state.
	 *
	 * @note Use with `onChange`. For a controlled group use `selectedValue` instead.
	 */
	defaultSelectedValue?: string;
	/**
	 * Called with the newly selected option's `value`.
	 *
	 * @note Never called while the group is disabled, or while a row's async action is in flight.
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
		 * @note An empty list opens a popup holding the `<No content>` row and logs a warning. A
		 * submenu with nothing in it is a consumer bug rather than a state.
		 *
		 * @note Another submenu cannot go in here. One level of nesting is the limit, and the type
		 * is what holds it.
		 */
		items: DropdownSubmenuChildType[];
	};

/**
 * One entry of `items`. Six kinds, told apart by `type`.
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
 * The rule below is the one a union cannot express without blowing up {@link DropdownProps} into a
 * cross product. It is an object whose single required key is the sentence the compiler should
 * print, so a violation reads as `Property '<the sentence>' is missing ... but required in type
 * '<the rule name>'` instead of pointing at an unrelated prop.
 */
interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which lands on the trigger and names every row': never;
}

/**
 * Extra constraints layered on top of {@link DropdownProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to a
 * rule object when they are not.
 *
 * Gating the whole menu is the trigger's job, so there is no `disabled` pair here to validate: the
 * consumer owns the trigger node, and `Button`, `Badge` and `Input` each carry their own
 * `disabled` + `disabledTooltip`.
 */
export type ValidateDropdownProps<T> = T extends { 'data-testid': unknown }
	? TheTestIdPropIsCalledTestId
	: unknown;

export type DropdownProps = Pick<ComponentProps<'div'>, 'id' | 'className' | 'style'> &
	AriaAttributes & {
		/**
		 * The rows, in the order they are rendered. The menu owns its markup, so there are no
		 * children to compose.
		 *
		 * @note An empty list renders the `<No content>` row and logs a warning. A menu with
		 * nothing in it is a consumer bug rather than a state, which is why there is no
		 * `emptyContent` prop.
		 */
		items: DropdownItemType[];
		/**
		 * The trigger. Rendered as the element you pass, with the menu's props merged into it, so
		 * it keeps its own type, its own `disabled` and its own tooltip.
		 */
		children: ReactNode;
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
		 * @note So it composes with the tokens instead of overwriting `style.maxWidth`. A number is
		 * written as `px`, and any `style` you pass is kept.
		 *
		 * @default '20rem'
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
		 * The pinned search row. Passing the object is what renders it, so `{}` is a search row
		 * with every default.
		 */
		searchInputProps?: DropdownSearchInputProps;
		/**
		 * Forwarded to the trigger as `data-testid`, and the stem every row is named from.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the trigger.
		 */
		[key: `data-${string}`]: unknown;
	};
