import {
	cloneElement,
	createElement,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
	version,
} from 'react';
import type { DropdownItemType, DropdownLeafItemType } from '../dropdown/types.js';
import { FIT_TOLERANCE_PX } from '../lib/fit-tolerance.js';
import { getLinkProps } from '../lib/link-props.js';
import { hasRenderableContent, partTestId } from '../lib/utils.js';
import { withoutChildren } from '../lib/without-children.js';
import {
	BREADCRUMB_COLLAPSE_HYSTERESIS_PX,
	BREADCRUMB_ITEMS_KEY_SEPARATOR,
	BREADCRUMB_MIN_COLLAPSIBLE_ITEMS,
	BREADCRUMB_MIN_VISIBLE_ITEMS,
	BreadcrumbItemKind,
	BreadcrumbPosition,
	BreadcrumbShrink,
} from './constants.js';
import type {
	BreadcrumbDropdownItem,
	BreadcrumbItemKindType,
	BreadcrumbItemType,
	BreadcrumbLinkProps,
	BreadcrumbPositionType,
	BreadcrumbResolvedItem,
	BreadcrumbShrinkType,
	BreadcrumbTrailMeasure,
} from './types.js';

/**
 * Whether a title renders anything. A string of only whitespace does not, so a title such as `' '`
 * leaves the crumb out like an empty one.
 *
 * @access private
 */
export function hasTitle(title: ReactNode): boolean {
	if (typeof title === 'string') {
		return title.trim() !== '';
	}

	return hasRenderableContent(title);
}

/**
 * The `inert` prop that takes a collapsed crumb out of the tab order and the accessibility tree.
 * React 18 writes an attribute it does not know as the string it gets and drops `true` with a
 * warning, so the empty string sets it. React 19 knows `inert` as a boolean: `true` sets it, and the
 * empty string reads as `false`, with a warning, so the attribute never lands.
 *
 * @access private
 */
export const INERT_PROPS: { inert: boolean | string } =
	Number.parseInt(version, 10) >= 19 ? { inert: true } : { inert: '' };

/**
 * The crumbs that made it into the trail, each with its kind and its test id.
 *
 * @access private
 */
export function resolveItems(
	items: BreadcrumbItemType[],
	testId: string | undefined,
): BreadcrumbResolvedItem[] {
	const resolved: BreadcrumbResolvedItem[] = [];

	for (const [index, item] of items.entries()) {
		if (hasTitle(item.title)) {
			resolved.push({
				item,
				index,
				kind: getKind(item),
				testId: partTestId(testId, `item-${index}`),
			});
		}
	}

	return resolved;
}

/**
 * Joins the string titles into the key that restarts collapse measurement. A node title counts as
 * one character: its size is still observed, only a change of node does not restart measurement.
 *
 * @access private
 */
export function getItemsKey(resolved: BreadcrumbResolvedItem[]): string {
	return resolved
		.map(({ item, index }) => `${index}:${typeof item.title === 'string' ? item.title : '\u0001'}`)
		.join(BREADCRUMB_ITEMS_KEY_SEPARATOR);
}

/**
 * Whether a crumb opens a menu of its own. An empty `menu` does not count.
 *
 * @access private
 */
export function hasMenu(item: BreadcrumbItemType): boolean {
	return item.menu !== undefined && item.menu.length > 0;
}

/**
 * Whether a crumb or a menu entry navigates, through an `href` or a `render` element.
 *
 * @access private
 */
export function isLink(link: BreadcrumbLinkProps): boolean {
	return link.href !== undefined || link.render !== undefined;
}

/**
 * @access private
 */
export function getKind(item: BreadcrumbItemType): BreadcrumbItemKindType {
	if (hasMenu(item)) {
		return BreadcrumbItemKind.Menu;
	}

	if (isLink(item)) {
		return BreadcrumbItemKind.Link;
	}

	return item.onClick === undefined ? BreadcrumbItemKind.Text : BreadcrumbItemKind.Button;
}

/**
 * @access private
 */
export function getPosition(position: number, count: number): BreadcrumbPositionType {
	if (position === count - 1) {
		return BreadcrumbPosition.End;
	}

	return position === 0 ? BreadcrumbPosition.Start : BreadcrumbPosition.Middle;
}

/**
 * The order the middle crumbs collapse in: the centre first, then outward, the side of the first
 * crumb before the side of the last on a tie, so the crumbs next to the current page stay the
 * longest. The first and the last crumb are never in it.
 *
 * Every prefix of the order is a contiguous run, so one `...` crumb always stands in for the whole
 * collapsed set.
 *
 * @access private
 */
export function getCollapseOrder(count: number): number[] {
	if (count < BREADCRUMB_MIN_COLLAPSIBLE_ITEMS) {
		return [];
	}

	const centre = (count - 1) / 2;
	const middle = Array.from({ length: count - 2 }, (_, offset) => offset + 1);

	return middle.sort((a, b) => Math.abs(a - centre) - Math.abs(b - centre) || a - b);
}

/**
 * Moves the focus of a crumb that has just collapsed to the `...` crumb that holds it now.
 *
 * A collapsed crumb turns inert and hidden, and the browser drops its focus a moment later, to the
 * `<body>`, which sends a keyboard user back to the top of the page. Called as the crumb collapses,
 * the browser has not dropped it yet. Focus anywhere else is left alone.
 *
 * @access private
 */
export function moveFocusToEllipsis(root: HTMLElement | null): void {
	const active = root?.ownerDocument.activeElement;

	if (
		!root ||
		!active ||
		!root.contains(active) ||
		active.closest('[data-slot="breadcrumb-item"][data-collapsed]') === null
	) {
		return;
	}

	root.querySelector<HTMLElement>('[data-slot="breadcrumb-ellipsis-trigger"]')?.focus();
}

/**
 * How many crumbs `maxVisible` collapses on its own, whatever the width.
 *
 * @access private
 */
export function getMinCollapsed(count: number, maxVisible: number | undefined): number {
	if (
		maxVisible === undefined ||
		!Number.isFinite(maxVisible) ||
		count < BREADCRUMB_MIN_COLLAPSIBLE_ITEMS
	) {
		return 0;
	}

	const visible = Math.max(BREADCRUMB_MIN_VISIBLE_ITEMS, Math.floor(maxVisible));

	return Math.min(Math.max(0, count - visible), count - BREADCRUMB_MIN_VISIBLE_ITEMS);
}

/**
 * The width of the trail once the first `collapsedCount` crumbs of the collapse order collapse into
 * one `...` crumb.
 *
 * @access private
 */
export function getTrailWidth(measure: BreadcrumbTrailMeasure, collapsedCount: number): number {
	const { widths, separatorWidth, ellipsisWidth, gap } = measure;
	const collapsed = new Set(getCollapseOrder(widths.length).slice(0, collapsedCount));
	let total = 0;
	let segments = 0;

	for (const [position, width] of widths.entries()) {
		if (!collapsed.has(position)) {
			total += width;
			segments++;
		}
	}

	if (collapsed.size > 0) {
		total += ellipsisWidth;
		segments++;
	}

	return segments === 0 ? 0 : total + (segments - 1) * (separatorWidth + 2 * gap);
}

/**
 * How many crumbs collapse: the fewest that let the trail fit, never fewer than `minCollapsed` and
 * never the first or the last crumb. Expanding back below `current` needs the extra room of the
 * hysteresis. When even the shortest trail does not fit, every middle crumb collapses and the
 * crumbs left shorten in CSS.
 *
 * @access private
 */
export function countCollapsed(
	measure: BreadcrumbTrailMeasure,
	current: number,
	minCollapsed: number,
): number {
	const count = measure.widths.length;

	if (count < BREADCRUMB_MIN_COLLAPSIBLE_ITEMS) {
		return 0;
	}

	const maxCollapsed = count - BREADCRUMB_MIN_VISIBLE_ITEMS;

	for (
		let collapsed = Math.min(minCollapsed, maxCollapsed);
		collapsed < maxCollapsed;
		collapsed++
	) {
		const buffer = collapsed < current ? BREADCRUMB_COLLAPSE_HYSTERESIS_PX : 0;

		if (getTrailWidth(measure, collapsed) <= measure.available + FIT_TOLERANCE_PX - buffer) {
			return collapsed;
		}
	}

	return maxCollapsed;
}

/**
 * Which crumbs shorten once at most the first and the last crumb show, in the order the design spec
 * fixes: the last crumb down to the floor, then the first one down to it. Once both sit at the
 * floor, the trail overflows. `undefined` while more crumbs show, since collapsing comes first, and
 * while the trail fits at the widths the crumbs have, since nothing shortens then.
 *
 * The first crumb does not shrink at all before its turn. A share of the shrink, however small,
 * would cut its label by a fraction of a pixel, enough for the ellipsis and too little for the
 * tooltip.
 *
 * @access private
 */
export function getShrink(
	measure: BreadcrumbTrailMeasure,
	collapsedCount: number,
	floor: number,
): BreadcrumbShrinkType | undefined {
	const { widths } = measure;
	const last = widths.length - 1;

	if (widths.length - collapsedCount > BREADCRUMB_MIN_VISIBLE_ITEMS) {
		return undefined;
	}

	const fits = (floored: (position: number) => boolean): boolean =>
		getTrailWidth(
			{
				...measure,
				widths: widths.map((width, position) =>
					floored(position) ? Math.min(width, floor) : width,
				),
			},
			collapsedCount,
		) <=
		measure.available + FIT_TOLERANCE_PX;

	if (fits(() => false)) {
		return undefined;
	}

	if (fits((position) => position === last)) {
		return BreadcrumbShrink.End;
	}

	return fits((position) => position === 0 || position === last)
		? BreadcrumbShrink.Start
		: BreadcrumbShrink.Floor;
}

/**
 * The element a menu row renders as for a crumb or a menu entry that navigates: its `render`
 * element without children, since the row draws the label, or an `<a>`. Takes the `href` and
 * `target` the element leaves unset, and an `onClick` that runs after the one of the element.
 * `undefined` makes the row an action.
 *
 * With `dropRef` the row leaves the `ref` of the element to the other copy that is mounted.
 *
 * @access private
 */
export function getRowRender(
	link: BreadcrumbLinkProps,
	{ dropRef = false }: { dropRef?: boolean } = {},
): ReactElement | undefined {
	if (!isLink(link)) {
		return undefined;
	}

	const element = (
		link.render === undefined ? createElement('a') : withoutChildren(link.render)
	) as ReactElement<{ onClick?: (event: MouseEvent) => void }>;
	const ownOnClick = element.props.onClick;
	const { onClick } = link;

	return cloneElement(element, {
		...getLinkProps(element, link).props,
		...(dropRef ? { ref: null } : {}),
		...(onClick === undefined
			? {}
			: {
					onClick:
						ownOnClick === undefined
							? onClick
							: (event: MouseEvent) => {
									ownOnClick(event);
									onClick(event);
								},
				}),
	});
}

/**
 * The row of the `...` crumb's menu for one collapsed crumb, with the same test id the crumb has
 * while it is visible.
 *
 * A crumb with a `menu` is a submenu of its entries, the way it is a menu while visible, so its
 * `href` and `onClick` are as unreachable as they are there. Any other crumb is label only, both
 * icon slots off.
 *
 * @access private
 */
export function toCollapsedRow({
	item,
	index,
	testId,
	kind,
}: BreadcrumbResolvedItem): DropdownItemType {
	const base = {
		value: String(index),
		label: item.title,
		...(testId === undefined ? {} : { testId }),
	};

	if (kind === BreadcrumbItemKind.Menu) {
		return {
			type: 'submenu',
			items: toMenuRows(item.menu ?? [], partTestId(testId, 'menu')),
			...base,
		};
	}

	// The collapsed crumb stays mounted, so its link keeps the caller's `ref`. A row that shared it
	// would set it to `null` as the menu closes, under a link that is still there.
	const render = getRowRender(item, { dropRef: true });

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
 * The rows of the menu a crumb opens through its own `menu`.
 *
 * Without a `menuTestId` the rows name no test id and the `Dropdown` names them after its own. A
 * submenu has no test id of its own to do that from, so the collapsed crumb passes the one its
 * visible menu has, which keeps a row named the same wherever it shows.
 *
 * @access private
 */
export function toMenuRows(
	menu: BreadcrumbDropdownItem[],
	menuTestId?: string,
): DropdownLeafItemType[] {
	return menu.map((entry, index) => {
		const value = String(index);
		const testId = partTestId(menuTestId, `item-${index}`);
		const base = {
			value,
			label: entry.title,
			...(testId === undefined ? {} : { testId }),
		};

		const render = getRowRender(entry);

		if (render !== undefined) {
			return { type: 'link', render, ...base };
		}

		return {
			type: 'item',
			...(entry.onClick === undefined ? {} : { onClick: entry.onClick }),
			...base,
		};
	});
}
