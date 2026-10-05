import type { Select as BaseSelect } from '@base-ui/react/select';
import type { AriaAttributes, ComponentProps, CSSProperties, ReactElement, ReactNode } from 'react';
import type { SelectItemKind } from './constants.js';

type OriginalPortalProps = BaseSelect.Portal.Props;

export type SelectItemKindType = (typeof SelectItemKind)[keyof typeof SelectItemKind];

/**
 * `disabled` and `disabledTooltip` travel together on a row.
 */
export type SelectItemDisabledType =
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
 * One value the user can pick. The row a select is mostly made of.
 */
export type SelectOptionItemType = SelectItemDisabledType & {
	// Required on the plain row too. On a union where one member declares `type?: never`,
	// TypeScript cannot narrow an excess property check and blames the first member.
	type: typeof SelectItemKind.Item;
	/**
	 * What the user reads on the row. Also its accessible name.
	 *
	 * @note A node that renders nothing (`null`, `false` or an empty string) falls back to the text
	 * `<No label>`, and the row carries `data-empty-label`.
	 */
	label: ReactNode;
	/**
	 * This row's identity, and the value `onChange` reports.
	 *
	 * @note Unique across `items`, groups included. Two rows sharing one are indistinguishable to
	 * the component.
	 */
	value: string;
	/**
	 * The text the trigger and the chips show for this row, in place of the label.
	 *
	 * @note For a node label, or a long label whose short form fits the field. Typing on the
	 * keyboard also matches it.
	 */
	displayValue?: string;
	/**
	 * Element rendered at the start of the row. An icon, sized to `--select-item-icon-size`.
	 *
	 * @note A single trigger shows it too, before the value. Put an icon here rather than in a node
	 * label: inside the label it sits on the text baseline, above centre.
	 */
	prefix?: ReactElement;
	/**
	 * Element rendered at the end of the row, before the selection indicator. An icon, sized to
	 * `--select-item-icon-size`.
	 */
	suffix?: ReactElement;
	/**
	 * Forwarded to the row as `data-testid`.
	 *
	 * @note Optional because the select names its rows: with a `testId` on `Select`, a row with none
	 * of its own is addressable as `` `${selectTestId}-item-${value}` ``. Write this only to give one
	 * row a name of its own, which then wins.
	 */
	testId?: string;
};

/**
 * A rule between two runs of rows.
 */
export type SelectSeparatorItemType = {
	type: typeof SelectItemKind.Separator;
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
export type SelectGroupChildType = SelectOptionItemType | SelectSeparatorItemType;

/**
 * A section heading and the rows under it.
 */
export type SelectGroupItemType = {
	type: typeof SelectItemKind.Group;
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
	 */
	items: SelectGroupChildType[];
	/**
	 * Forwarded to the group as `data-testid`. Defaults to `` `${selectTestId}-group-${value}` ``.
	 */
	testId?: string;
};

/**
 * One entry of `items`. Three kinds, told apart by `type`.
 */
export type SelectItemType = SelectGroupChildType | SelectGroupItemType;

type SelectSingleProps = {
	/**
	 * When true, the select picks several values and shows them as chips in the trigger.
	 *
	 * @default false
	 */
	multiple?: false;
	/**
	 * The selected `value` of an `item` row.
	 *
	 * @note Writing the prop makes the component controlled, even with `undefined`. Leave it out
	 * entirely for an uncontrolled select.
	 */
	value?: string;
	/**
	 * The value selected on the first render, for a select that keeps its own state.
	 */
	defaultValue?: string;
	/**
	 * Called with the value of the row the user picked.
	 */
	onChange?: (value: string) => void;
	/**
	 * Decides what the trigger shows for the selected row, in place of the row's `prefix`,
	 * `displayValue` and label.
	 *
	 * @note Also runs while nothing is selected, with `undefined`, so it can replace the
	 * placeholder. A value that is not in `items` also passes `undefined`.
	 */
	displayValue?: (item: SelectOptionItemType | undefined) => ReactNode;
	maxDisplayedPills?: never;
};

type SelectMultipleProps = {
	multiple: true;
	/**
	 * The selected values, in the order they were picked.
	 *
	 * @note Writing the prop makes the component controlled, even with `undefined`.
	 */
	value?: string[];
	/**
	 * The values selected on the first render, for a select that keeps its own state.
	 */
	defaultValue?: string[];
	/**
	 * Called with the new values. `[]` when every value is removed.
	 */
	onChange?: (value: string[]) => void;
	/**
	 * Decides what the trigger shows in place of the chips, such as `3 services`.
	 *
	 * @note Gets the selected rows in the order they were picked, `[]` while nothing is selected,
	 * so it can replace the placeholder. A value that is not in `items` is left out.
	 */
	displayValue?: (items: SelectOptionItemType[]) => ReactNode;
	/**
	 * How many chips the trigger shows. The rest collapse into a `+N` chip whose tooltip lists
	 * them. Every chip shows while it is not set.
	 */
	maxDisplayedPills?: number;
};

interface ADisabledSelectMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface ADisabledReasonNeedsADisabledSelect {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

interface AReadOnlySelectMustSayWhy {
	'`readOnly` needs `readOnlyTooltip`, a read-only control has to tell the user why it cannot be changed': never;
}

interface AReadOnlyReasonNeedsAReadOnlySelect {
	'`readOnlyTooltip` only renders while `readOnly` is set, add `readOnly` or drop the tooltip': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which lands on the trigger and names every row': never;
}

/**
 * Extra constraints layered on top of {@link SelectProps} at the call site.
 *
 * Resolves to `unknown` while the props are valid, and to a rule object when they are not. The
 * pairing rules look at which props the call site writes, not at their values:
 * `disabledTooltip={undefined}` is the explicit opt-out.
 */
export type ValidateSelectProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledSelectMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledSelect
		: unknown) &
	(T extends { readOnly: boolean | undefined }
		? T extends { readOnlyTooltip: ReactNode }
			? unknown
			: AReadOnlySelectMustSayWhy
		: unknown) &
	(T extends { readOnlyTooltip: ReactNode }
		? T extends { readOnly: boolean | undefined }
			? unknown
			: AReadOnlyReasonNeedsAReadOnlySelect
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

type SelectBaseProps = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes & {
		/**
		 * The rows, in the order they are rendered. The select owns its markup, so there are no
		 * children to compose.
		 *
		 * @note An empty list renders the `noContent` row, and logs a warning unless `noContent` is
		 * set or `loading` is true.
		 */
		items: SelectItemType[];
		/**
		 * The text the trigger shows while nothing is selected. Also the trigger's accessible name
		 * when no `aria-label` or `aria-labelledby` is given.
		 */
		placeholder: string;
		/**
		 * When true, replaces the rows with `loadingContent` or a spinner row, and the trigger's
		 * chevron with a spinner.
		 *
		 * @note The popup still opens.
		 *
		 * @default false
		 */
		loading?: boolean;
		/**
		 * What to show in place of the rows while `loading` is true. Defaults to a spinner row.
		 */
		loadingContent?: ReactNode;
		/**
		 * What the non-interactive row shows when `items` is empty.
		 *
		 * @note Setting it declares an empty `items` a state, so no warning is logged.
		 *
		 * @default 'No results found :/'
		 */
		noContent?: ReactNode;
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
		 * Why the select cannot be used. Shown in a tooltip on the trigger, and only while
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
		 * Why the select cannot be changed. Shown in a tooltip on the trigger, and only while
		 * `readOnly` is true and `disabled` is not.
		 *
		 * @note Only allowed alongside `readOnly`. Pass `undefined` explicitly when there is no
		 * reason to give.
		 */
		readOnlyTooltip?: ReactNode;
		/**
		 * How wide the popup may get, written as `--select-internal-max-inline-size`. A number is
		 * written as `px`.
		 *
		 * @note The popup is never narrower than the trigger, so a trigger wider than this wins.
		 *
		 * @default '15.75rem'
		 */
		contentMaxWidth?: number | string;
		/**
		 * How tall the rows may get before they scroll, written as
		 * `--select-internal-max-block-size`. A number is written as `px`.
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
		 * The width of the select. Written as the `--select-internal-width` custom property, so it
		 * composes with the tokens. Numbers are written as `px`.
		 *
		 * @default '100%'
		 */
		width?: CSSProperties['width'];
		/**
		 * The max-width of the select. Written as the `--select-internal-max-width` custom property.
		 * Numbers are written as `px`.
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

export type SelectProps = SelectBaseProps & (SelectSingleProps | SelectMultipleProps);
