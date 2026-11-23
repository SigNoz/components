import type {
	AriaAttributes,
	ComponentProps,
	CSSProperties,
	MouseEvent,
	ReactElement,
	ReactNode,
} from 'react';
import type { ButtonBaseProps } from '../button/types.js';
import type { DropdownProps, DropdownSubmenuChildType } from '../dropdown/types.js';
import type { TooltipContentStackEntry } from '../tooltip/tooltip-content-stack-context.js';
import type {
	ButtonGroupColor,
	ButtonGroupJoin,
	ButtonGroupPosition,
	ButtonGroupSize,
	ButtonGroupTextOverflow,
	ButtonGroupVariant,
} from './constants.js';

export type ButtonGroupVariantType = (typeof ButtonGroupVariant)[keyof typeof ButtonGroupVariant];
export type ButtonGroupColorType = (typeof ButtonGroupColor)[keyof typeof ButtonGroupColor];
export type ButtonGroupSizeType = (typeof ButtonGroupSize)[keyof typeof ButtonGroupSize];
export type ButtonGroupTextOverflowType =
	(typeof ButtonGroupTextOverflow)[keyof typeof ButtonGroupTextOverflow];
/**
 * @access private
 */
export type ButtonGroupPositionType =
	(typeof ButtonGroupPosition)[keyof typeof ButtonGroupPosition];
/**
 * @access private
 */
export type ButtonGroupJoinType = (typeof ButtonGroupJoin)[keyof typeof ButtonGroupJoin];

/**
 * The variant and colour pairs a member can be drawn in, the same pairs `Button` takes: `solid`
 * and `link` take any colour, `outlined`, `dashed` and `ghost` only `secondary`.
 */
export type ButtonGroupVariantColorType =
	| {
			variant: 'solid' | 'link';
			color: ButtonGroupColorType;
			/**
			 * Only the ghost variant plays a glow while loading, so only `ghost` takes this prop.
			 */
			noLoadingEffect?: never;
	  }
	| {
			variant: 'outlined' | 'dashed';
			color: 'secondary';
			/**
			 * Only the ghost variant plays a glow while loading, so only `ghost` takes this prop.
			 */
			noLoadingEffect?: never;
	  }
	| {
			variant: 'ghost';
			color: 'secondary';
			/**
			 * When `true`, turns off the glow that plays behind the label while loading. The spinner,
			 * `aria-busy` and the loading reason stay.
			 *
			 * @default false
			 */
			noLoadingEffect?: boolean;
	  };

/**
 * A member drawn in its own variant and colour instead of the group's. Both are given together,
 * so the pair is always one `Button` can draw.
 */
export type ButtonGroupItemVariantType =
	| ButtonGroupVariantColorType
	| {
			variant?: never;
			color?: never;
			noLoadingEffect?: never;
	  };

/**
 * The `Button` props a member forwards as they are: the native attributes and handlers `Button`
 * takes, every `aria-*` and `data-*`, `textOverflow`, `width` and `maxWidth`.
 *
 * @note Only `onClick`, the label and the disabled and loading state reach the member's overflow
 * menu row.
 */
export type ButtonGroupItemButtonProps = Omit<
	ButtonBaseProps,
	| 'size'
	| 'children'
	| 'onClick'
	| 'disabled'
	| 'disabledTooltip'
	| 'loading'
	| 'loadingTooltip'
	| 'testId'
>;

/**
 * Everything a member carries whatever it renders.
 */
type ButtonGroupItemBaseType = ButtonGroupItemButtonProps & {
	/**
	 * This member's identity. Keys the list and names the member's `data-testid`.
	 *
	 * @note Unique within the group. Two members sharing one are indistinguishable to the
	 * component.
	 */
	value: string;
	/**
	 * Forwarded to the member as `data-testid`. The overflow menu row gets the same one, so a
	 * member keeps its name whether it is visible or collapsed.
	 *
	 * @note Optional because the group names its members: with a `testId` on the group, a member
	 * with none of its own is addressable as `` `${groupTestId}-item-${value}` ``.
	 */
	testId?: string;
	/**
	 * Written as `testId`, which also names the member's overflow menu row.
	 */
	'data-testid'?: never;
};

/**
 * A member with a text label, optionally flanked by a `prefix` and a `suffix`.
 */
export type ButtonGroupTextItemType = {
	/**
	 * What the user reads on the member. Also its accessible name and the text of its overflow
	 * menu row.
	 *
	 * @note A node that renders nothing (`null`, `false` or an empty string) falls back to the text
	 * `<No label>`, and the label carries `data-empty-label`.
	 */
	label: ReactNode;
	/**
	 * Element rendered before the label, sized to the member's icon size.
	 *
	 * @note Replaced by a spinner while the member is loading.
	 */
	prefix?: ReactElement;
	/**
	 * Element rendered after the label, sized to the member's icon size.
	 */
	suffix?: ReactElement;
	icon?: never;
};

/**
 * A member whose only content is an icon.
 */
export type ButtonGroupIconItemType = {
	/**
	 * The icon, sized to a square that matches the member's size.
	 */
	icon: ReactElement;
	/**
	 * The accessible name, required because there is no text to announce. Also the text of the
	 * member's overflow menu row.
	 */
	'aria-label': string;
	label?: never;
	prefix?: never;
	suffix?: never;
};

/**
 * A member that runs a handler when pressed.
 */
export type ButtonGroupActionItemType = {
	/**
	 * Called when the member, or its overflow menu row, is picked.
	 *
	 * @note Required unless the member renders a link: a button that does nothing when pressed is
	 * a dead control.
	 *
	 * @note Not called while the member or the group is `disabled` or `loading`.
	 */
	onClick: (event: MouseEvent) => void;
	render?: never;
	menu?: never;
};

/**
 * A member that navigates.
 */
export type ButtonGroupLinkItemType = {
	/**
	 * Renders the member as this element instead of a `<button>`, a router `Link` in practice, so
	 * middle click and "open in new tab" work. `<Link to="/logs" />` is the whole prop: the label,
	 * the icons and the styling still come from the item.
	 *
	 * @note Takes `prefix` and `suffix` like any text member.
	 *
	 * @note The element's own children are dropped: the text goes in `label` (or `aria-label`), so
	 * the prefix, the spinner and truncation keep working. `<a href="/docs">Docs</a>` renders as
	 * `<a href="/docs" />` holding the member's slots.
	 *
	 * @note The overflow menu row renders the same element.
	 *
	 * @note No `onClick` here: put the handler on the element you render.
	 */
	render: ReactElement;
	onClick?: never;
	menu?: never;
};

/**
 * The menu a member opens: its rows and where the popup sits, the same props `Dropdown` takes.
 */
export type ButtonGroupItemMenuType = Pick<
	DropdownProps,
	'side' | 'align' | 'contentMaxWidth' | 'contentMaxHeight'
> & {
	/**
	 * The rows of the menu, in the order they are rendered.
	 *
	 * @note No `submenu` rows: a collapsed member becomes a submenu row of the overflow menu, and a
	 * submenu cannot hold another one.
	 */
	items: DropdownSubmenuChildType[];
};

/**
 * A member that opens a menu, the trigger of a split button for instance.
 */
export type ButtonGroupMenuItemType = {
	/**
	 * Opens this menu when the member is pressed. The member is the menu's trigger, so it stays
	 * focusable and keeps its tooltips.
	 *
	 * @note The menu does not open while the member or the group is `disabled` or `loading`.
	 *
	 * @note A collapsed member becomes a submenu row of the overflow menu, holding the same rows.
	 *
	 * @note No `onClick` here: the rows carry the actions.
	 */
	menu: ButtonGroupItemMenuType;
	onClick?: never;
	render?: never;
};

/**
 * `disabled` and `disabledTooltip` travel together on a member. Items are plain data rather than
 * call sites, so a union expresses the pairing directly.
 */
export type ButtonGroupItemDisabledType =
	| {
			/**
			 * When true, blocks this member alone.
			 *
			 * @note Requires `disabledTooltip`.
			 *
			 * @note Suppressed while the member or the group is loading.
			 */
			disabled: boolean;
			/**
			 * Why this member cannot be used. Only renders while `disabled` is true, below the
			 * group's own reason.
			 */
			disabledTooltip: ReactNode;
	  }
	| {
			disabled?: never;
			disabledTooltip?: never;
	  };

/**
 * `loading` and `loadingTooltip` travel together on a member.
 */
export type ButtonGroupItemLoadingType =
	| {
			/**
			 * When true, cross-fades a spinner over this member's prefix and blocks it.
			 *
			 * @note Requires `loadingTooltip`.
			 */
			loading: boolean;
			/**
			 * What this member is waiting for. Only renders while `loading` is true, below the
			 * group's own reason.
			 *
			 * @note Pass `undefined` when there is no reason to give.
			 */
			loadingTooltip: ReactNode;
	  }
	| {
			loading?: never;
			loadingTooltip?: never;
	  };

/**
 * One member of the group.
 */
export type ButtonGroupItemType = ButtonGroupItemBaseType &
	(ButtonGroupTextItemType | ButtonGroupIconItemType) &
	// Action last: TypeScript reports a failed union against its last member, so a member with
	// none of the three prints `onClick` is missing rather than `render` or `menu`.
	(ButtonGroupLinkItemType | ButtonGroupMenuItemType | ButtonGroupActionItemType) &
	ButtonGroupItemDisabledType &
	ButtonGroupItemLoadingType &
	ButtonGroupItemVariantType;

/**
 * The rules below are the ones a union cannot express without multiplying the props. Each is an
 * object whose single required key is the sentence the compiler should print.
 */
interface ADisabledButtonGroupMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which also names every member': never;
}

interface ADisabledReasonNeedsADisabledButtonGroup {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

/**
 * Extra constraints layered on top of {@link ButtonGroupProps} at the call site, the same rules
 * `Button` applies to its own `disabled` and `disabledTooltip`.
 *
 * Resolves to `unknown` while the props are valid, and to a rule object when they are not.
 */
export type ValidateButtonGroupProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledButtonGroupMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledButtonGroup
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

export type ButtonGroupProps = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes &
	ButtonGroupVariantColorType & {
		/**
		 * Height + padding token, shared by every member. Sizes never mix inside one group.
		 */
		size: ButtonGroupSizeType;
		/**
		 * The members, in the order they are rendered. The group owns its markup, so there are no
		 * children to compose.
		 *
		 * @note A member takes the group's `variant` and `color` unless it sets its own pair.
		 *
		 * @note Members that do not fit collapse from the end into an overflow menu behind an
		 * ellipsis member.
		 */
		items: ButtonGroupItemType[];
		/**
		 * The group renders its members from `items`, so it takes no children.
		 */
		children?: never;
		/**
		 * Content rendered inside the group before the first member, a select or a status for
		 * instance. It is laid out as it is and never collapses: the members make room for it.
		 *
		 * @note It meets the first member as a member in the group's `variant` would, so the corners
		 * between them square off in an `outlined`, `dashed` or `solid` group. Its own corners and
		 * border are yours to style. In an `outlined` or `dashed` group the member drops the start
		 * border, so the content draws the line they share.
		 *
		 * @note `disabled` and `loading` do not reach it.
		 */
		prefix?: ReactNode;
		/**
		 * Content rendered inside the group after the last member and the ellipsis, an inline editor
		 * for instance. It is laid out as it is and never collapses: the members make room for it.
		 *
		 * @note It meets the last segment as a member in the group's `variant` would, so the corners
		 * between them square off in an `outlined`, `dashed` or `solid` group. Its own corners and
		 * border are yours to style. In an `outlined` or `dashed` group the member keeps its end
		 * border, so drop the start border of the content.
		 *
		 * @note `disabled` and `loading` do not reach it.
		 */
		suffix?: ReactNode;
		/**
		 * When true, blocks every member. `onClick` stops firing, hover and focus events do not.
		 *
		 * @note Requires `disabledTooltip`.
		 *
		 * @note Members carry `aria-disabled` instead of the native `disabled` attribute, so they stay
		 * tabbable and the reason stays reachable.
		 *
		 * @default false
		 */
		disabled?: boolean;
		/**
		 * Why the group cannot be used. Shown on every member while `disabled` is true, above the
		 * member's own reason.
		 *
		 * @note Only allowed alongside `disabled`.
		 *
		 * @note Not shown while `loading` is true, even with `disabled` set.
		 */
		disabledTooltip?: ReactNode;
		/**
		 * When true, every member shows a spinner in its prefix slot and stops responding to
		 * presses. Members stay focusable.
		 *
		 * @note Suppresses `disabledTooltip` for as long as it is set.
		 *
		 * @default false
		 */
		loading?: boolean;
		/**
		 * What the group is busy with, shown on every member while `loading` is true. Optional, a
		 * spinner alone is already a valid busy state.
		 */
		loadingTooltip?: ReactNode;
		/**
		 * The width of the group, written as `--button-group-internal-width`. A number is written as
		 * `px`. Without it the group sizes to its members.
		 */
		width?: CSSProperties['width'];
		/**
		 * The max-width of the group, written as `--button-group-internal-max-width`. A number is
		 * written as `px`.
		 *
		 * @note Members that do not fit inside it collapse into the overflow menu.
		 *
		 * @default '100%'
		 */
		maxWidth?: CSSProperties['maxWidth'];
		/**
		 * What a member's label does when it does not fit its cap
		 * (`--button-group-label-max-inline-size`, 120px). A member's own `textOverflow` wins.
		 *
		 * `ellipsis` truncates the label and shows the full text in a tooltip, only while it is
		 * truncated. `hidden` clips it with no marker and no tooltip.
		 *
		 * @default 'ellipsis'
		 */
		textOverflow?: ButtonGroupTextOverflowType;
		/**
		 * Forwarded to the group as `data-testid`, and the stem every member is named from:
		 * `` `${testId}-item-${value}` `` for a member, `` `${testId}-overflow` `` for the ellipsis.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is forwarded to the group element.
		 */
		[key: `data-${string}`]: unknown;
	};

/**
 * The group props every member reads.
 *
 * @access private
 */
export type ButtonGroupState = Pick<
	ButtonGroupProps,
	'testId' | 'disabledTooltip' | 'loadingTooltip' | 'size'
> & {
	/**
	 * The group's variant and colour, the ones a member without its own pair takes.
	 */
	look: ButtonGroupVariantColorType;
	textOverflow: ButtonGroupTextOverflowType;
	disabled: boolean;
	loading: boolean;
};

/**
 * An item with the group state folded in, ready to render as a member or as a menu row.
 *
 * @access private
 */
export type ButtonGroupResolvedItem = {
	item: ButtonGroupItemType;
	/**
	 * The item's own variant and colour, or the group's.
	 */
	look: ButtonGroupVariantColorType;
	/**
	 * Every prop of the item the group does not read itself, forwarded to the member's `Button`.
	 */
	buttonProps: ButtonGroupItemButtonProps;
	/**
	 * `<No label>` when the item's label renders nothing. `undefined` for an icon member.
	 */
	label: ReactNode;
	emptyLabel: boolean;
	menuLabel: ReactNode;
	testId: string | undefined;
	/**
	 * The item's `render` element with its own children dropped.
	 */
	render: ReactElement | undefined;
	menu: ButtonGroupItemMenuType | undefined;
	loading: boolean;
	disabled: boolean;
	/**
	 * Why the item is blocked, most general first: the group's reason, then its own.
	 */
	reasons: TooltipContentStackEntry[];
};
