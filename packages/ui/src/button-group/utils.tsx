import type { ReactNode } from 'react';
import type { DropdownItemType } from '../dropdown/types.js';
import { FIT_TOLERANCE_PX } from '../lib/fit-tolerance.js';
import { hasRenderableContent, type RejectedProps } from '../lib/utils.js';
import { withoutChildren } from '../lib/without-children.js';
import { TooltipStack } from '../tooltip/subcomponents/tooltip-stack.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../tooltip/tooltip-content-stack-context.js';
import {
	BUTTON_GROUP_EMPTY_LABEL,
	ButtonGroupColor,
	ButtonGroupJoin,
	ButtonGroupPosition,
	ButtonGroupVariant,
} from './constants.js';
import type {
	ButtonGroupItemType,
	ButtonGroupJoinType,
	ButtonGroupPositionType,
	ButtonGroupResolvedItem,
	ButtonGroupState,
	ButtonGroupVariantColorType,
	ButtonGroupVariantType,
} from './types.js';

function getReasons(
	item: ButtonGroupItemType,
	group: ButtonGroupState,
	loading: boolean,
): TooltipContentStackEntry[] {
	const reasons: TooltipContentStackEntry[] = [];

	// Loading outranks disabled, as on `Button`: the disabled reasons are not shown at all.
	if (loading) {
		if (group.loading && hasTooltipContent(group.loadingTooltip)) {
			reasons.push({ id: 'group-loading-tooltip', content: group.loadingTooltip });
		}

		if (item.loading && hasTooltipContent(item.loadingTooltip)) {
			reasons.push({ id: 'loading-tooltip', content: item.loadingTooltip });
		}

		return reasons;
	}

	if (group.disabled && hasTooltipContent(group.disabledTooltip)) {
		reasons.push({ id: 'group-disabled-tooltip', content: group.disabledTooltip });
	}

	if (item.disabled && hasTooltipContent(item.disabledTooltip)) {
		reasons.push({ id: 'disabled-tooltip', content: item.disabledTooltip });
	}

	return reasons;
}

/**
 * @access private
 */
export function resolveItem(
	item: ButtonGroupItemType,
	group: ButtonGroupState,
): ButtonGroupResolvedItem {
	const {
		value: _value,
		label: _label,
		icon: _icon,
		prefix: _prefix,
		suffix: _suffix,
		onClick: _onClick,
		render: _render,
		menu: _menu,
		disabled: _disabled,
		disabledTooltip: _disabledTooltip,
		loading: _loading,
		loadingTooltip: _loadingTooltip,
		testId: _testId,
		variant,
		color,
		noLoadingEffect,
		// The group owns these. Dropped at runtime too, so one that gets past the item type (a cast,
		// a JavaScript caller) does not resize or restyle a single member.
		size: _size,
		children: _children,
		className: _className,
		style: _style,
		...buttonProps
	}: ButtonGroupItemType & RejectedProps<'size' | 'children' | 'className' | 'style'> = item;
	// Destructuring the union loses the pairing of `variant` and `color`, the item still had it.
	const look =
		variant === undefined
			? group.look
			: ({
					variant,
					color,
					...(noLoadingEffect === undefined ? {} : { noLoadingEffect }),
				} as ButtonGroupVariantColorType);
	const isIcon = item.icon !== undefined;
	const emptyLabel = !isIcon && !hasRenderableContent(item.label);
	const label = isIcon ? undefined : emptyLabel ? BUTTON_GROUP_EMPTY_LABEL : item.label;
	const loading = group.loading || Boolean(item.loading);

	return {
		item,
		look,
		buttonProps,
		label,
		emptyLabel,
		menuLabel: isIcon ? item['aria-label'] : label,
		testId:
			item.testId ??
			(group.testId === undefined ? undefined : `${group.testId}-item-${item.value}`),
		render: item.render === undefined ? undefined : withoutChildren(item.render),
		menu: item.menu,
		loading,
		disabled: loading || group.disabled || Boolean(item.disabled),
		reasons: getReasons(item, group, loading),
	};
}

/**
 * @access private
 */
export function getPosition(index: number, count: number): ButtonGroupPositionType {
	if (count === 1) {
		return ButtonGroupPosition.Only;
	}

	if (index === 0) {
		return ButtonGroupPosition.Start;
	}

	return index === count - 1 ? ButtonGroupPosition.End : ButtonGroupPosition.Middle;
}

const SHARED_BORDER_VARIANTS: ReadonlySet<ButtonGroupVariantType> = new Set([
	ButtonGroupVariant.Outlined,
	ButtonGroupVariant.Dashed,
]);

/**
 * How two neighbours meet, see {@link ButtonGroupJoin}. Symmetric: the order of the two does not
 * matter.
 *
 * @access private
 */
export function getJoin(
	start: ButtonGroupVariantType,
	end: ButtonGroupVariantType,
): ButtonGroupJoinType {
	if (start === ButtonGroupVariant.Link || end === ButtonGroupVariant.Link) {
		return ButtonGroupJoin.WideGap;
	}

	if (start === ButtonGroupVariant.Ghost || end === ButtonGroupVariant.Ghost) {
		return ButtonGroupJoin.Gap;
	}

	return SHARED_BORDER_VARIANTS.has(start) && SHARED_BORDER_VARIANTS.has(end)
		? ButtonGroupJoin.Shared
		: ButtonGroupJoin.Seam;
}

/**
 * Whether the corners two neighbours meet at are squared off, so the two read as one control.
 *
 * @access private
 */
export function isFlushJoin(join: ButtonGroupJoinType | undefined): boolean {
	return join === ButtonGroupJoin.Shared || join === ButtonGroupJoin.Seam;
}

/**
 * The joins of one member, see {@link getMemberJoins}.
 *
 * @access private
 */
export type ButtonGroupMemberJoins = {
	start: ButtonGroupJoinType | undefined;
	end: ButtonGroupJoinType | undefined;
	/**
	 * How the ellipsis would meet the member if it were the last one visible.
	 */
	overflow: ButtonGroupJoinType;
	/**
	 * How the suffix would meet the member if it were the last segment, `undefined` without one.
	 */
	suffix: ButtonGroupJoinType | undefined;
};

/**
 * Whether the group renders a `prefix` and a `suffix`.
 *
 * @access private
 */
export type ButtonGroupSlots = {
	prefix: boolean;
	suffix: boolean;
};

/**
 * How every member meets its neighbours, how the ellipsis meets the last visible one, and how the
 * `prefix` and `suffix` meet the segments next to them.
 *
 * A member's start join is taken against the member before it in `items`, collapsed or not, so a
 * collapsed member keeps the margin it would have in the row and the group can measure it. The
 * last visible member ends against the ellipsis while there is one, and against the suffix
 * otherwise. A prefix or a suffix meets the members as a member in the group's own variant would.
 *
 * @access private
 */
export function getMemberJoins(
	resolved: ButtonGroupResolvedItem[],
	visibleCount: number,
	groupVariant: ButtonGroupVariantType,
	slots: ButtonGroupSlots = { prefix: false, suffix: false },
): {
	members: Array<ButtonGroupMemberJoins & { resolved: ButtonGroupResolvedItem }>;
	/**
	 * How the ellipsis meets the segment before it and the suffix after it.
	 */
	overflow: ButtonGroupJoinType | undefined;
	overflowEnd: ButtonGroupJoinType | undefined;
	/**
	 * How the prefix meets the first segment, and how the suffix meets the last one.
	 */
	prefix: ButtonGroupJoinType | undefined;
	suffix: ButtonGroupJoinType | undefined;
} {
	const variants = resolved.map((entry) => entry.look.variant);
	const hasOverflow = visibleCount < variants.length;
	const before = slots.prefix ? groupVariant : undefined;
	const after = slots.suffix ? groupVariant : undefined;
	const members = resolved.map((entry, index) => {
		const current = entry.look.variant;
		const previous = index === 0 ? before : variants[index - 1];
		const next =
			index === visibleCount - 1 ? (hasOverflow ? groupVariant : after) : variants[index + 1];

		return {
			resolved: entry,
			start: previous === undefined ? undefined : getJoin(previous, current),
			end: next === undefined ? undefined : getJoin(current, next),
			overflow: getJoin(current, groupVariant),
			suffix: after === undefined ? undefined : getJoin(current, after),
		};
	});
	// The ellipsis is drawn in the group's variant, and the slots meet it as they would a member.
	const firstSegment = visibleCount > 0 ? variants[0] : hasOverflow ? groupVariant : after;
	const lastSegment = hasOverflow ? groupVariant : (variants[visibleCount - 1] ?? before);
	const beforeOverflow = variants[visibleCount - 1] ?? before;

	return {
		members,
		overflow:
			hasOverflow && beforeOverflow !== undefined
				? getJoin(beforeOverflow, groupVariant)
				: undefined,
		overflowEnd: hasOverflow && after !== undefined ? getJoin(groupVariant, after) : undefined,
		prefix:
			before === undefined || firstSegment === undefined
				? undefined
				: getJoin(before, firstSegment),
		suffix:
			after === undefined || lastSegment === undefined ? undefined : getJoin(lastSegment, after),
	};
}

const DANGER_COLORS: ReadonlySet<string> = new Set([
	ButtonGroupColor.Danger,
	ButtonGroupColor.HighlightDanger,
]);

function toReasonNode(reasons: TooltipContentStackEntry[]): ReactNode {
	return reasons.length === 0 ? undefined : <TooltipStack items={reasons} />;
}

/**
 * The overflow menu row for a collapsed member. Label only, both icon slots off, so the menu reads
 * as a continuation of the group.
 *
 * @access private
 */
export function toMenuRow(resolved: ButtonGroupResolvedItem): DropdownItemType {
	const { item, look, menuLabel, testId, render, menu, loading, disabled, reasons } = resolved;
	const state = loading
		? { loading: true, loadingTooltip: toReasonNode(reasons) }
		: disabled
			? { disabled: true, disabledTooltip: toReasonNode(reasons) }
			: {};
	const base = {
		value: item.value,
		label: menuLabel,
		...(testId === undefined ? {} : { testId }),
		...state,
	};

	if (render !== undefined) {
		return { type: 'link', render, ...base };
	}

	if (menu !== undefined) {
		return { type: 'submenu', items: menu.items, ...base };
	}

	// Only an action row has a danger treatment, a link row is painted as a link.
	return {
		type: 'item',
		...(item.onClick === undefined ? {} : { onClick: item.onClick }),
		...(DANGER_COLORS.has(look.color) ? { danger: true } : {}),
		...base,
	};
}

/**
 * How many members fit ahead of the overflow segment.
 *
 * `ends[i]` is the width of the first `i + 1` members, the margins between them folded in.
 * `overflowMargins[i]` is the margin the ellipsis takes when it follows member `i`.
 *
 * @access private
 */
export function countVisibleMembers(
	ends: number[],
	overflowWidth: number,
	overflowMargins: number[],
	available: number,
	suffixMargins: number[] = [],
	overflowSuffixMargin = 0,
): number {
	const total = (ends.at(-1) ?? 0) + (suffixMargins.at(-1) ?? 0);

	if (total <= available + FIT_TOLERANCE_PX) {
		return ends.length;
	}

	for (let count = ends.length - 1; count > 0; count--) {
		const end =
			(ends[count - 1] ?? 0) +
			(overflowMargins[count - 1] ?? 0) +
			overflowWidth +
			overflowSuffixMargin;

		if (end <= available + FIT_TOLERANCE_PX) {
			return count;
		}
	}

	return 0;
}
