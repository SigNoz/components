import { createElement, type ReactElement, type ReactNode } from 'react';
import type { DropdownItemType } from '../dropdown/types.js';
import { hasRenderableContent } from '../lib/utils.js';
import { TooltipStack } from '../tooltip/subcomponents/tooltip-stack.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../tooltip/tooltip-content-stack-context.js';
import { BUTTON_GROUP_EMPTY_LABEL, ButtonGroupPosition } from './constants.js';
import type {
	ButtonGroupItemType,
	ButtonGroupPositionType,
	ButtonGroupResolvedItem,
	ButtonGroupState,
} from './types.js';

// Rects are fractional and can round either way, so a row that fits exactly may still report a
// sliver of overflow.
const FIT_TOLERANCE_PX = 0.5;

/**
 * Drops the element's own children.
 *
 * Base UI merges the element's props over the member's, children included, so `<a>Docs</a>` would
 * replace the prefix, label and suffix slots and take the spinner and the truncation with them.
 */
function withoutChildren(element: ReactElement): ReactElement {
	const { children: _children, ...props } = element.props as Record<string, unknown>;
	const { ref } = element as ReactElement & { ref?: unknown };

	return createElement(element.type, {
		...props,
		key: element.key,
		...(ref == null ? {} : { ref }),
	});
}

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
	const isIcon = item.icon !== undefined;
	const emptyLabel = !isIcon && !hasRenderableContent(item.label);
	const label = isIcon ? undefined : emptyLabel ? BUTTON_GROUP_EMPTY_LABEL : item.label;
	const loading = group.loading || Boolean(item.loading);

	return {
		item,
		label,
		emptyLabel,
		menuLabel: isIcon ? item.ariaLabel : label,
		testId:
			item.testId ??
			(group.testId === undefined ? undefined : `${group.testId}-item-${item.value}`),
		render: item.render === undefined ? undefined : withoutChildren(item.render),
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
	const { item, menuLabel, testId, render, loading, disabled, reasons } = resolved;
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

	return {
		type: 'item',
		...(item.onClick === undefined ? {} : { onClick: item.onClick }),
		...base,
	};
}

/**
 * How many members fit ahead of the overflow segment.
 *
 * `ends[i]` is the width of the first `i + 1` members, shared borders folded in. `overlap` is the
 * negative margin the ellipsis pulls back over its neighbour with.
 *
 * @access private
 */
export function countVisibleMembers(
	ends: number[],
	overflowWidth: number,
	overlap: number,
	available: number,
): number {
	const total = ends.at(-1) ?? 0;

	if (total <= available + FIT_TOLERANCE_PX) {
		return ends.length;
	}

	for (let count = ends.length - 1; count > 0; count--) {
		if ((ends[count - 1] ?? 0) + overflowWidth + overlap <= available + FIT_TOLERANCE_PX) {
			return count;
		}
	}

	return 0;
}
