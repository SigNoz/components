import type { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { AriaAttributes, ComponentProps, CSSProperties, ReactElement, ReactNode } from 'react';
import type { ComboboxItemKind } from './constants.js';

type OriginalPortalProps = BaseCombobox.Portal.Props;

export type ComboboxItemKindType = (typeof ComboboxItemKind)[keyof typeof ComboboxItemKind];

/**
 * `disabled` and `disabledTooltip` travel together on a row.
 */
export type ComboboxItemDisabledType =
	| {
			/**
			 * When true, the row cannot be picked.
			 *
			 * @note Requires `disabledTooltip`.
			 *
			 * @note The row is marked `aria-disabled` rather than removed from the keyboard, so the
			 * reason stays reachable. Arrow keys still land on it.
			 */
			disabled: boolean;
			/**
			 * Why this row cannot be picked. Only renders while `disabled` is true.
			 *
			 * @note Only allowed alongside `disabled`. Pass `undefined` when there is no reason to
			 * give.
			 */
			disabledTooltip: ReactNode;
	  }
	// Last: TypeScript explains a failed assignment against the last member, so a row missing some
	// other prop is told about that prop instead of `disabledTooltip`.
	| {
			disabled?: never;
			disabledTooltip?: never;
	  };

/**
 * What every row the user can pick carries.
 */
type ComboboxRowBaseType = {
	/**
	 * What the user reads on the row. Also its accessible name.
	 *
	 * @note A node that renders nothing (`null`, `false` or an empty string) falls back to the text
	 * `<No label>`, and the row carries `data-empty-label`.
	 */
	label: ReactNode;
	/**
	 * This row's identity. For an `item`, it is also the value `onChange` reports.
	 *
	 * @note Unique across `items`, groups included. Two rows sharing one are indistinguishable to
	 * the component.
	 */
	value: string;
	/**
	 * Extra text the built-in search matches against, on top of the label and the `value`.
	 *
	 * @note This is what makes a node label findable: the search reads a label only when it
	 * renders to text.
	 */
	searchMetadata?: string;
	/**
	 * Element rendered at the start of the row. An icon, sized to `--combobox-item-icon-size`.
	 *
	 * @note A selected `item` shows it in a single trigger too, before the value. Put an icon here
	 * rather than in a node label: inside the label it sits on the text baseline, above centre.
	 */
	prefix?: ReactElement;
	/**
	 * Forwarded to the row as `data-testid`.
	 *
	 * @note Optional because the combobox names its rows: with a `testId` on `Combobox`, a row with
	 * none of its own is addressable as `` `${comboboxTestId}-item-${value}` ``. Write this only to
	 * give one row a name of its own, which then wins.
	 */
	testId?: string;
};

/**
 * One value the user can pick. The row a combobox is mostly made of.
 */
export type ComboboxOptionItemType = ComboboxRowBaseType &
	ComboboxItemDisabledType & {
		// Required on the plain row too. On a union where one member declares `type?: never`,
		// TypeScript cannot narrow an excess property check and blames the first member.
		type: typeof ComboboxItemKind.Item;
		/**
		 * The text the trigger and the chips show for this row, in place of the label.
		 *
		 * @note For a node label, or a long label whose short form fits the field.
		 * The search also matches it.
		 */
		displayValue?: string;
		/**
		 * Element rendered at the end of the row, before the selection indicator. An icon, sized to
		 * `--combobox-item-icon-size`.
		 */
		suffix?: ReactElement;
	};

/**
 * A row that writes `insertValue` into the search row instead of selecting, so the user keeps
 * typing from there (`status:` then `active`).
 *
 * @note Shown only while the query does not start with the `insertValue` of any hint, compared
 * case and accent insensitive and ignoring leading spaces.
 */
export type ComboboxHintItemType = ComboboxRowBaseType & {
	type: typeof ComboboxItemKind.Hint;
	/**
	 * The text the search row takes when the hint is picked. The search also matches it.
	 */
	insertValue: string;
};

/**
 * A rule between two runs of rows.
 */
export type ComboboxSeparatorItemType = {
	type: typeof ComboboxItemKind.Separator;
	/**
	 * This separator's identity, which keys the list.
	 *
	 * @note A separator that would land first, last, or next to another one is dropped.
	 */
	value: string;
};

/**
 * What a group may hold. A group is a heading, not a nesting level, so a group in a group is not
 * allowed.
 */
export type ComboboxGroupChildType =
	| ComboboxOptionItemType
	| ComboboxHintItemType
	| ComboboxSeparatorItemType;

/**
 * A section heading and the rows under it.
 */
export type ComboboxGroupItemType = {
	type: typeof ComboboxItemKind.Group;
	/**
	 * The section heading. Not a row: the arrow keys skip it.
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
	 */
	items: ComboboxGroupChildType[];
	/**
	 * Forwarded to the group as `data-testid`. Defaults to `` `${comboboxTestId}-group-${value}` ``.
	 */
	testId?: string;
};

/**
 * One entry of `items`. Four kinds, told apart by `type`.
 */
export type ComboboxItemType = ComboboxGroupChildType | ComboboxGroupItemType;

/**
 * The search row at the top of the popup.
 */
export type ComboboxSearchInputProps = {
	/**
	 * Placeholder text for the search field, and its accessible name.
	 *
	 * @note Required. The field has no visible label, so this is what tells the user what it
	 * searches.
	 */
	placeholder: string;
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
	 * @note Independent of the component's own `loading`, which replaces the rows.
	 *
	 * @default false
	 */
	loading?: boolean;
	/**
	 * When false, the component stops filtering `items` and only reports the query through
	 * `onChange`.
	 *
	 * @note Turn it off for rows that come from a server and are already filtered by the time they
	 * arrive.
	 *
	 * @default true
	 */
	filter?: boolean;
	/**
	 * Called with the current query on every keystroke, and with `''` when the popup closes over a
	 * query.
	 */
	onChange?: (value: string) => void;
};

/**
 * The row pinned under the list, for an action that is not a value.
 */
export type ComboboxFooterActionType = {
	/**
	 * What the user reads on the row. Also its accessible name.
	 */
	label: ReactNode;
	/**
	 * Element rendered at the start of the row. An icon, sized to `--combobox-item-icon-size`.
	 */
	prefix?: ReactElement;
	/**
	 * Called when the row is pressed. The popup closes right after.
	 */
	onClick: () => void;
	/**
	 * Forwarded to the row as `data-testid`. Defaults to `` `${comboboxTestId}-footer-action` ``.
	 */
	testId?: string;
};

type ComboboxSingleProps = {
	/**
	 * When true, the combobox picks several values and shows them as chips in the trigger.
	 *
	 * @default false
	 */
	multiple?: false;
	/**
	 * The selected `value` of an `item` row, or a value created through `allowCreate`.
	 *
	 * @note Writing the prop makes the component controlled, even with `undefined`. Leave it out
	 * entirely for an uncontrolled combobox.
	 */
	value?: string;
	/**
	 * The value selected on the first render, for a combobox that keeps its own state.
	 */
	defaultValue?: string;
	/**
	 * Called with the new value. `undefined` when the value is cleared.
	 */
	onChange?: (value: string | undefined) => void;
	/**
	 * Decides what the trigger shows for the selected row, in place of the row's `prefix`,
	 * `displayValue` and label.
	 *
	 * @note Also runs while nothing is selected, with `undefined`, so it can replace the
	 * placeholder. A value that is not in `items` also passes `undefined`.
	 */
	displayValue?: (item: ComboboxOptionItemType | undefined) => ReactNode;
	maxDisplayedPills?: never;
};

type ComboboxMultipleProps = {
	multiple: true;
	/**
	 * The selected values, in the order they were picked.
	 *
	 * @note Writing the prop makes the component controlled, even with `undefined`.
	 */
	value?: string[];
	/**
	 * The values selected on the first render, for a combobox that keeps its own state.
	 */
	defaultValue?: string[];
	/**
	 * Called with the new values. `[]` when every value is removed.
	 */
	onChange?: (value: string[]) => void;
	displayValue?: never;
	/**
	 * How many chips the trigger shows. The rest collapse into a `+N` chip whose tooltip lists
	 * them. Every chip shows while it is not set.
	 */
	maxDisplayedPills?: number;
};

interface ADisabledComboboxMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface ADisabledReasonNeedsADisabledCombobox {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

interface AReadOnlyComboboxMustSayWhy {
	'`readOnly` needs `readOnlyTooltip`, a read-only control has to tell the user why it cannot be changed': never;
}

interface AReadOnlyReasonNeedsAReadOnlyCombobox {
	'`readOnlyTooltip` only renders while `readOnly` is set, add `readOnly` or drop the tooltip': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which lands on the trigger and names every row': never;
}

/**
 * Extra constraints layered on top of {@link ComboboxProps} at the call site.
 *
 * Resolves to `unknown` while the props are valid, and to a rule object when they are not. The
 * pairing rules look at which props the call site writes, not at their values:
 * `disabledTooltip={undefined}` is the explicit opt-out.
 */
export type ValidateComboboxProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledComboboxMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledCombobox
		: unknown) &
	(T extends { readOnly: boolean | undefined }
		? T extends { readOnlyTooltip: ReactNode }
			? unknown
			: AReadOnlyComboboxMustSayWhy
		: unknown) &
	(T extends { readOnlyTooltip: ReactNode }
		? T extends { readOnly: boolean | undefined }
			? unknown
			: AReadOnlyReasonNeedsAReadOnlyCombobox
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

type ComboboxBaseProps = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes & {
		/**
		 * The rows, in the order they are rendered. The combobox owns its markup, so there are no
		 * children to compose.
		 *
		 * @note An empty list renders the `noContent` row, and logs a warning unless `noContent` is
		 * set, `allowCreate` is on, `loading` is true or `searchInputProps.filter` is `false`.
		 */
		items: ComboboxItemType[];
		/**
		 * The text the trigger shows while nothing is selected. Also the trigger's accessible name
		 * when no `aria-label` or `aria-labelledby` is given.
		 */
		placeholder: string;
		/**
		 * When true, a clear button replaces the chevron while the pointer is over a combobox that
		 * has a value. `Delete` and `Backspace` on the trigger clear it too.
		 *
		 * @note Never shown while `disabled`, `readOnly` or `loading` is true.
		 *
		 * @default false
		 */
		allowClear?: boolean;
		/**
		 * When set, a `Create "<query>"` row leads the list while the trimmed query matches no
		 * row's `value`, hints included, and no selected value. The match ignores case. Picking it
		 * selects the query.
		 *
		 * A function renders the row's label from the query.
		 *
		 * @default false
		 */
		allowCreate?: boolean | ((query: string) => ReactNode);
		/**
		 * The search row at the top of the popup. Required, because the row is always there and
		 * its `placeholder` is its only name.
		 */
		searchInputProps: ComboboxSearchInputProps;
		/**
		 * When true, replaces the rows with `loadingContent` or a spinner row, and the trigger's
		 * chevron with a spinner.
		 *
		 * @note The popup still opens and the search row still takes a query.
		 *
		 * @default false
		 */
		loading?: boolean;
		/**
		 * What to show in place of the rows while `loading` is true. Defaults to a spinner row.
		 */
		loadingContent?: ReactNode;
		/**
		 * What the non-interactive row shows when there is nothing to list: an empty `items`, or a
		 * query that matches nothing.
		 *
		 * @note Setting it declares an empty `items` a state, so no warning is logged.
		 *
		 * @default 'No results found :/'
		 */
		noContent?: ReactNode;
		/**
		 * A row pinned under the list for an action that is not a value, such as creating a record
		 * somewhere else.
		 */
		footerAction?: ComboboxFooterActionType;
		/**
		 * When true, the popup does not open, and the trigger carries `aria-disabled` and
		 * `data-disabled`.
		 *
		 * @note Requires `disabledTooltip`.
		 *
		 * @note `aria-disabled` rather than the native `disabled`, so the trigger stays hoverable and
		 * focusable and the reason stays reachable.
		 *
		 * @note Outranks `readOnly`.
		 *
		 * @default false
		 */
		disabled?: boolean;
		/**
		 * Why the combobox cannot be used. Shown in a tooltip on the trigger, and only while
		 * `disabled` is true.
		 *
		 * @note Only allowed alongside `disabled`. Pass `undefined` explicitly when there is no
		 * reason to give.
		 */
		disabledTooltip?: ReactNode;
		/**
		 * When true, the popup does not open and the selection cannot change. The trigger carries
		 * `aria-readonly` and `data-readonly`, keeps its colours, fades a little and hides its chevron.
		 *
		 * @note Requires `readOnlyTooltip`.
		 *
		 * @default false
		 */
		readOnly?: boolean;
		/**
		 * Why the combobox cannot be changed. Shown in a tooltip on the trigger, and only while
		 * `readOnly` is true and `disabled` is not.
		 *
		 * @note Only allowed alongside `readOnly`. Pass `undefined` explicitly when there is no
		 * reason to give.
		 */
		readOnlyTooltip?: ReactNode;
		/**
		 * When true, only the rows in view are mounted. For lists of thousands of rows.
		 *
		 * @note Group headings become plain rows of the list, without `role="group"`.
		 *
		 * @default false
		 */
		virtualized?: boolean;
		/**
		 * How wide the popup may get, written as `--combobox-internal-max-inline-size`. A number is
		 * written as `px`.
		 *
		 * @note The popup is never narrower than the trigger, so a trigger wider than this wins.
		 *
		 * @default '15.75rem'
		 */
		contentMaxWidth?: number | string;
		/**
		 * How tall the rows may get before they scroll, written as
		 * `--combobox-internal-max-block-size`. A number is written as `px`.
		 *
		 * @note The search row and the footer action stay pinned whatever this is.
		 *
		 * @default '20rem'
		 */
		contentMaxHeight?: number | string;
		/**
		 * The element the popup is portalled into.
		 *
		 * @note Inside a `Dialog` or `Drawer` the default is an element in its panel, where the focus
		 * trap of the modal lets the keyboard reach the rows. Anywhere else the popup goes to the body
		 * and stacks just above the layer its trigger sits in, such as an antd `Modal` or `Drawer`.
		 *
		 * @default document.body
		 */
		container?: OriginalPortalProps['container'];
		/**
		 * The width of the combobox. Written as the `--combobox-internal-width` custom property, so
		 * it composes with the tokens. Numbers are written as `px`.
		 *
		 * @default '100%'
		 */
		width?: CSSProperties['width'];
		/**
		 * The max-width of the combobox. Written as the `--combobox-internal-max-width` custom
		 * property. Numbers are written as `px`.
		 *
		 * @default '100%'
		 */
		maxWidth?: CSSProperties['maxWidth'];
		/**
		 * Forwarded to the trigger as `data-testid`, and the stem every part is named from.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the trigger, alongside `aria-*`.
		 */
		[key: `data-${string}`]: unknown;
	};

export type ComboboxProps = ComboboxBaseProps & (ComboboxSingleProps | ComboboxMultipleProps);
