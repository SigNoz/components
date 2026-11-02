import {
	type CSSProperties,
	forwardRef,
	Fragment,
	type ReactElement,
	type RefAttributes,
	useEffect,
	useMemo,
} from 'react';
import { mergeRefs } from '../lib/merge-refs.js';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import { partTestId, type RejectedProps } from '../lib/utils.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import styles from './breadcrumb.module.scss';
import {
	BREADCRUMB_COLLAPSE_HYSTERESIS_PX,
	BREADCRUMB_DEFAULT_ARIA_LABEL,
	BREADCRUMB_DEFAULT_SEPARATOR,
	BREADCRUMB_ELLIPSIS_LABEL,
	BREADCRUMB_MIN_VISIBLE_ITEMS,
	BreadcrumbShrink,
	BreadcrumbTextOverflow,
} from './constants.js';
import { BreadcrumbEllipsis } from './subcomponents/breadcrumb-ellipsis.js';
import { BreadcrumbItem } from './subcomponents/breadcrumb-item.js';
import { BreadcrumbSeparator } from './subcomponents/breadcrumb-separator.js';
import type { BreadcrumbProps, ValidateBreadcrumbProps } from './types.js';
import { useBreadcrumbCollapse } from './use-breadcrumb-collapse.js';
import {
	getCollapseOrder,
	getItemsKey,
	getMinCollapsed,
	getPosition,
	moveFocusToEllipsis,
	resolveItems,
} from './utils.js';

const BreadcrumbImpl = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
	{
		items,
		separator = BREADCRUMB_DEFAULT_SEPARATOR,
		truncate = true,
		maxVisible,
		textOverflow = BreadcrumbTextOverflow.Ellipsis,
		testId,
		'aria-label': ariaLabel = BREADCRUMB_DEFAULT_ARIA_LABEL,
		children: _children,
		className: _className,
		style: _style,
		...props
	}: BreadcrumbProps & RejectedProps<'className' | 'style' | 'children'>,
	ref,
) {
	// The types refuse the literal, not a `string` that holds it. The old `BreadcrumbSimple` drew an
	// icon for it, so a call site migrated without a type error would print the word.
	useEffect(() => {
		if (separator === 'chevron') {
			console.warn(
				'Breadcrumb: `separator` draws the text it is given, so `chevron` prints the word. Pass a character such as `›`.',
			);
		}
	}, [separator]);

	const resolved = resolveItems(items, testId);
	const {
		collapsedCount,
		fullWidth,
		shrink,
		rootRef,
		listRef,
		separatorRef,
		ellipsisRef,
		floorRef,
		registerCrumb,
	} = useBreadcrumbCollapse({
		enabled: truncate && resolved.length > 0,
		itemsKey: getItemsKey(resolved),
		minCollapsed: getMinCollapsed(resolved.length, maxVisible),
	});
	// `rootRef` is stable, so a new consumer ref reattaches the refs without restarting the observer.
	const mergedRef = useMemo(() => mergeRefs(ref, rootRef), [ref, rootRef]);
	// After the commit that collapses a crumb, so the browser has not yet dropped its focus.
	useIsomorphicLayoutEffect(() => {
		moveFocusToEllipsis(rootRef.current);
	}, [collapsedCount, rootRef]);
	if (resolved.length === 0) {
		return null;
	}

	const collapseOrder = getCollapseOrder(resolved.length);
	const collapsedPositions = new Set(collapseOrder.slice(0, collapsedCount));
	const collapsed = resolved.filter((_, position) => collapsedPositions.has(position));
	// The `...` crumb renders beside the crumb that collapses first, which is collapsed whenever any
	// is. Anchoring it to the first collapsed crumb by position would move it as more crumbs
	// collapse, remount it, drop its focus and close its menu. Collapsed crumbs are out of the flow,
	// so the anchor does not change where it shows.
	const ellipsisAnchor = collapsed.length === 0 ? undefined : collapseOrder[0];
	// Before the first measure nothing says whether the trail fits, so the last crumb is the one that
	// may shorten, which keeps a long crumb from overflowing the server render. After it, no `shrink`
	// means the trail fits and no crumb is capped. A lone crumb has no other to share the trail
	// with, so it takes the whole width instead of half and its label cuts at the edge.
	const shrinking =
		truncate &&
		resolved.length > 1 &&
		resolved.length - collapsed.length <= BREADCRUMB_MIN_VISIBLE_ITEMS
			? fullWidth === undefined
				? BreadcrumbShrink.End
				: shrink
			: undefined;

	const measureStyle = (
		fullWidth === undefined
			? undefined
			: {
					// The room to expand back into, hysteresis included, so a trail in a shrink-to-fit
					// container can grow back to the full set.
					'--breadcrumb-internal-full-width': `${fullWidth + BREADCRUMB_COLLAPSE_HYSTERESIS_PX}px`,
				}
	) as CSSProperties | undefined;

	return (
		<nav
			{...props}
			ref={mergedRef}
			aria-label={ariaLabel}
			// Written after the spread: the selectors and the shortening read these, so a stray `data-*`
			// prop of the same name cannot replace them.
			data-slot="breadcrumb"
			data-truncate={truncate}
			data-text-overflow={textOverflow}
			data-overflowing={collapsed.length > 0 || undefined}
			data-shrinking={shrinking}
			className={styles['breadcrumb']}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<TooltipProviderIfMissing>
				<ol ref={listRef} data-slot="breadcrumb-list" className={styles['breadcrumb__list']}>
					{resolved.map((entry, position) => {
						const isCollapsed = collapsedPositions.has(position);

						return (
							<Fragment key={entry.index}>
								{position === ellipsisAnchor && (
									<>
										<BreadcrumbSeparator
											separator={separator}
											testId={partTestId(testId, 'ellipsis-separator')}
										/>
										<BreadcrumbEllipsis
											collapsed={collapsed}
											testId={partTestId(testId, 'ellipsis')}
										/>
									</>
								)}
								{position > 0 && !isCollapsed && (
									<BreadcrumbSeparator
										separator={separator}
										testId={partTestId(testId, `item-separator-${entry.index}`)}
									/>
								)}
								<BreadcrumbItem
									resolved={entry}
									position={getPosition(position, resolved.length)}
									textOverflow={textOverflow}
									collapsed={isCollapsed}
									registerCrumb={registerCrumb}
								/>
							</Fragment>
						);
					})}
				</ol>
			</TooltipProviderIfMissing>
			{/* Keeps the trail's intrinsic width at the full set, and measures the separator, the
			    `...` crumb and the floor of a shortened crumb before they render. */}
			{truncate && (
				<div
					aria-hidden="true"
					data-slot="breadcrumb-measure"
					className={styles['breadcrumb__measure']}
					style={measureStyle}
				>
					<span
						ref={separatorRef}
						data-slot="breadcrumb-measure-separator"
						className={styles['breadcrumb__separator']}
					>
						{separator}
					</span>
					<span
						ref={ellipsisRef}
						data-slot="breadcrumb-measure-ellipsis"
						data-kind="ellipsis"
						className={styles['breadcrumb__content']}
					>
						{BREADCRUMB_ELLIPSIS_LABEL}
					</span>
					<span
						ref={floorRef}
						data-slot="breadcrumb-measure-floor"
						className={styles['breadcrumb__floor']}
					/>
				</div>
			)}
		</nav>
	);
});

/**
 * A hierarchical location: a `<nav>` with an ordered list of crumbs, root first and the current
 * page last, built from `items`. The last crumb carries `aria-current="page"`.
 *
 * `id`, `aria-*` and `data-*` are forwarded to the `<nav>`, except `data-testid`: pass `testId` for
 * that. The ref is the `<nav>`, and its accessible name is `Breadcrumb` unless `aria-label` says
 * otherwise.
 *
 * Visual values are `--breadcrumb-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts). Colours come from the `--breadcrumb-*` semantic tokens in
 * `@signozhq/design-tokens`.
 *
 * ### Crumbs
 *
 * A crumb with a `menu` is a `<button>` that opens a `Dropdown` of those entries, whatever else it
 * has. Without a `menu`, a crumb with an `href` or a `render` is a link, and one with only an
 * `onClick` is a `<button>`. Only those react to hover and focus. A crumb with none of them is
 * plain text. Every crumb, the last included, looks the same at rest.
 *
 * ### Router links
 *
 * The breadcrumb imports no router. A crumb or a `menu` entry takes the same `href`, `target`,
 * `render` and `onClick` as `Callout.Link` and the `link` row of `Dropdown`, so
 * `render: <Link to="/services" />` renders the router link with the title as its label, in the
 * trail and in any menu the crumb shows up in. The router element should forward the props it does
 * not know to the `<a>` it renders, `aria-current` on the last crumb included.
 *
 * ### Overflow
 *
 * With `truncate` (the default) the trail stays on one line and re-measures on every resize. While
 * it does not fit, middle crumbs collapse one at a time, from the centre outward, into a single
 * `...` crumb. The first and the last crumb never collapse. Once only they are left, the last crumb
 * shortens first, then the first one, down to a floor. Below that the trail overflows its
 * container.
 *
 * The `...` crumb is a `<button>` labelled `Show N hidden items` (`Show 1 hidden item` for one)
 * that opens a `Dropdown` of the collapsed crumbs in path order, with no icons. A crumb with an
 * `href` or a `render` is a link row, one with only an `onClick` runs it, and one with a `menu`
 * opens a submenu of those entries, the way it opens a menu while visible, so its `href` and
 * `onClick` stay out of reach there too. A link or button crumb that collapses with focus on it
 * hands the focus to this button. It has no tooltip, and never renders when nothing is collapsed.
 *
 * ### Asserting on it
 *
 * | attribute | on | value |
 * |---|---|---|
 * | `data-slot` | root | `"breadcrumb"` |
 * | `data-truncate`, `data-text-overflow` | root | mirrors the prop |
 * | `data-overflowing` | root | present while at least one crumb is collapsed |
 * | `data-shrinking` | root | while only the first and the last crumb show and the trail does not fit: `end` while the last one shortens, `start` once it sits at its floor and the first one shortens, `floor` once both do and the trail overflows |
 * | `data-slot` | list | `"breadcrumb-list"` |
 * | `data-slot` | crumb | `"breadcrumb-item"` |
 * | `data-position` | crumb | `start`, `middle` or `end` |
 * | `data-kind` | crumb | `link`, `button`, `menu` or `text` |
 * | `data-collapsed` | crumb | present while the crumb is in the menu of the `...` crumb |
 * | `data-slot` | crumb content | `"breadcrumb-item-content"`, the link, `<button>` or `<span>` that takes hover and focus |
 * | `data-truncated` | crumb content | present while the label is cut, with `textOverflow="ellipsis"` |
 * | `data-slot` | crumb label, icon, chevron | `"breadcrumb-item-label"`, `"breadcrumb-item-icon"`, `"breadcrumb-item-chevron"` (menu crumbs only) |
 * | `data-slot` | separator | `"breadcrumb-separator"` |
 * | `data-slot` | `...` crumb | `"breadcrumb-ellipsis"` on the `<li>`, `"breadcrumb-ellipsis-trigger"` on the button |
 * | `data-slot` | measuring row | `"breadcrumb-measure"`, hidden, rendered while `truncate` is set |
 *
 * With a `testId`, a crumb is `` `${testId}-item-${index}` `` whether it is visible or in the menu
 * of the `...` crumb, `index` being its place in `items`. The separator before it is
 * `` `${testId}-item-separator-${index}` ``, the `...` crumb is `` `${testId}-ellipsis` `` and the
 * separator before it `` `${testId}-ellipsis-separator` ``. A crumb's own menu is
 * `` `${testId}-item-${index}-menu` `` and each of its rows
 * `` `${testId}-item-${index}-menu-item-${position}` ``, `position` being the place of the entry in
 * its `menu`. Once the crumb is collapsed its rows keep their names, in a submenu of the `...`
 * crumb, and the `-menu` id goes, since the row of the crumb takes the id of the crumb.
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { title: 'Dashboards', href: '/dashboards' },
 *     { title: 'Payments', href: '/dashboards/payments' },
 *     { title: 'checkout-service-prod' },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Router links
 * <Breadcrumb
 *   items={[
 *     { title: 'Services', render: <Link to="/services" /> },
 *     { title: 'checkout', render: <Link to="/services/checkout" /> },
 *     { title: 'Overview' },
 *   ]}
 * />
 * ```
 */
export const Breadcrumb = BreadcrumbImpl as <T, Separator extends string = string>(
	props: BreadcrumbProps &
		// The props are checked against `BreadcrumbProps` itself, not against `T`, so the crumbs
		// written inline in `items` keep their excess property checks. `T` only carries the keys of
		// the call site, and every key outside the props is pinned to `never`.
		{
			[K in keyof T]: K extends
				| keyof BreadcrumbProps
				| keyof RefAttributes<HTMLElement>
				| 'itemRender'
				| 'params'
				| 'children'
				? unknown
				: never;
		} & { separator?: Separator } & ValidateBreadcrumbProps<T, Separator> &
		RefAttributes<HTMLElement>,
) => ReactElement | null;
