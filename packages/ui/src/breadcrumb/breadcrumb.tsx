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
import { hasRenderableContent, partTestId, type RejectedProps } from '../lib/utils.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import styles from './breadcrumb.module.scss';
import {
	BREADCRUMB_COLLAPSE_HYSTERESIS_PX,
	BREADCRUMB_DEFAULT_ARIA_LABEL,
	BREADCRUMB_DEFAULT_SEPARATOR,
	BREADCRUMB_ELLIPSIS_LABEL,
	BREADCRUMB_MIN_VISIBLE_ITEMS,
	BreadcrumbCollapseFrom,
	BreadcrumbShrink,
	BreadcrumbTextOverflow,
	BreadcrumbVariant,
} from './constants.js';
import { BreadcrumbEllipsis } from './subcomponents/breadcrumb-ellipsis.js';
import { BreadcrumbItem } from './subcomponents/breadcrumb-item.js';
import { BreadcrumbPopup } from './subcomponents/breadcrumb-popup.js';
import { BreadcrumbSeparator } from './subcomponents/breadcrumb-separator.js';
import type { BreadcrumbProps, ValidateBreadcrumbProps } from './types.js';
import { useBreadcrumbCollapse } from './use-breadcrumb-collapse.js';
import { useBreadcrumbPopup } from './use-breadcrumb-popup.js';
import {
	getCollapseOrder,
	getItemsKey,
	getMinCollapsed,
	getPosition,
	hasPreview,
	moveFocusToEllipsis,
	resolveItems,
} from './utils.js';

const BreadcrumbImpl = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
	{
		items,
		separator = BREADCRUMB_DEFAULT_SEPARATOR,
		truncate = true,
		maxVisible,
		collapseFrom = BreadcrumbCollapseFrom.Center,
		textOverflow = BreadcrumbTextOverflow.Ellipsis,
		variant = BreadcrumbVariant.Plain,
		ellipsis,
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

	const popup = useBreadcrumbPopup();
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
		collapseFrom,
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

	const collapseOrder = getCollapseOrder(resolved.length, collapseFrom);
	const collapsedPositions = new Set(collapseOrder.slice(0, collapsedCount));
	const collapsed = resolved.filter((_, position) => collapsedPositions.has(position));
	// The `...` crumb renders beside the crumb that collapses first, which is collapsed whenever any
	// is. Anchoring it to the first collapsed crumb by position would move it as more crumbs
	// collapse, remount it, drop its focus and close its popup. Collapsed crumbs are out of the flow,
	// so the anchor does not change where it shows.
	const ellipsisAnchor = collapsed.length === 0 ? undefined : collapseOrder[0];
	// Called once per render, and shared by the popup and the `...` crumb.
	const ellipsisContent =
		collapsed.length === 0
			? undefined
			: ellipsis?.render?.(collapsed.map(({ item, index }) => ({ item, index })));
	const hasEllipsisPopup =
		collapsed.length > 0 &&
		(ellipsis?.render === undefined || hasRenderableContent(ellipsisContent));
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
			data-variant={variant}
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
											count={collapsed.length}
											popup={popup}
											hasPopup={hasEllipsisPopup}
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
									popup={popup}
								/>
							</Fragment>
						);
					})}
				</ol>
			</TooltipProviderIfMissing>
			{(collapsed.length > 0 || resolved.some(hasPreview)) && (
				<BreadcrumbPopup
					popup={popup}
					resolved={resolved}
					collapsed={collapsed}
					ellipsis={ellipsis}
					ellipsisContent={ellipsisContent}
					hasEllipsisPopup={hasEllipsisPopup}
					layerSource={rootRef}
					testId={testId}
				/>
			)}
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
 * plain text.
 *
 * ### Popup
 *
 * The crumbs with a `preview` and the `...` crumb are the triggers of one popup, which shows the
 * card of a crumb or the list of the `...` crumb. The pointer going from one trigger to another, or
 * the focus from one crumb with a `preview` to another, moves the open popup to the new trigger and
 * swaps its content, with no delay and no close in between. The focus reaching the `...` crumb
 * closes a card and opens nothing. The popup goes into the panel of the `Dialog` or `Drawer` around
 * the trail, and into the body otherwise.
 *
 * A popup that a hover or the focus opened gives way to the next trigger. A list that a press opened
 * on the `...` crumb stays while the pointer or the focus visits a crumb with a `preview`, until a
 * press on the `...` crumb, `Escape`, a click on a crumb or a press outside closes it.
 *
 * Under a `ForceOpenProvider` the list is held open while crumbs are collapsed, and no card opens.
 *
 * ### Router links
 *
 * The breadcrumb imports no router. A crumb or a `menu` entry takes the same `href`, `target`,
 * `render` and `onClick` as `Callout.Link` and the `link` row of `Dropdown`, so
 * `render: <Link to="/services" />` renders the router link with the title as its label, in the
 * trail, in the popup of the `...` crumb and in any menu the crumb shows up in. The router element
 * should forward the props it does not know to the `<a>` it renders, `aria-current` on the last
 * crumb included.
 *
 * ### Overflow
 *
 * With `truncate` (the default) the trail stays on one line and re-measures on every resize. While
 * it does not fit, middle crumbs collapse one at a time, from the centre outward, into a single
 * `...` crumb. The first and the last crumb never collapse. Once only they are left, the last crumb
 * shortens first, then the first one, down to a floor. Below that the trail overflows its
 * container.
 *
 * With `collapseFrom="start"`, `maxVisible={4}` on six crumbs shows the first crumb, `...` and the
 * last three. The `...` crumb lists the collapsed crumbs in path order either way.
 *
 * The `...` crumb is a `<button>` named `Show N hidden items` (`Show 1 hidden item` for one) that
 * opens a `role="dialog"` below it. It opens once the pointer has rested on it for 300ms, and on a
 * press, `Enter` and `Space` included. The pointer can cross from it onto the popup, which stays open
 * until the pointer or the focus leaves. `Escape` closes it and returns the focus to the button. A
 * press opens it with the focus on its first row, and a hover does not move the focus. It never
 * renders when nothing is collapsed, and it has no tooltip.
 *
 * The popup is named by `ellipsis.heading` when that renders anything, and `Hidden items` otherwise.
 * It lists the collapsed crumbs in path order. A crumb with an `href` or a `render` is a link row, one
 * with only an `onClick` is a `<button>` row that runs it, and one with none of them is plain text. A
 * crumb with a `menu` is a `<button>` row that opens a `Dropdown` of those entries, the way it opens
 * one while visible, so its `href` and `onClick` stay out of reach there too. A press on a row runs
 * the handler of its crumb and closes the popup, and a press with a modifier key on a link leaves it
 * open. `Tab` moves through the rows, and so do the arrow keys, `Home` and `End`, which wrap at the
 * ends. A link or button crumb that collapses with focus on it hands the focus to the `...` button.
 *
 * ### Asserting on it
 *
 * | attribute | on | value |
 * |---|---|---|
 * | `data-slot` | root | `"breadcrumb"` |
 * | `data-truncate`, `data-text-overflow` | root | mirrors the prop |
 * | `data-variant` | root | mirrors the prop, `"plain"` unless `variant` says otherwise |
 * | `data-overflowing` | root | present while at least one crumb is collapsed |
 * | `data-shrinking` | root | while only the first and the last crumb show and the trail does not fit: `end` while the last one shortens, `start` once it sits at its floor and the first one shortens, `floor` once both do and the trail overflows |
 * | `data-slot` | list | `"breadcrumb-list"` |
 * | `data-slot` | crumb | `"breadcrumb-item"` |
 * | `data-position` | crumb | `start`, `middle` or `end` |
 * | `data-kind` | crumb | `link`, `button`, `menu` or `text` |
 * | `data-collapsed` | crumb | present while the crumb is in the list of the `...` crumb |
 * | `data-slot` | crumb content | `"breadcrumb-item-content"`, the link, `<button>` or `<span>` that takes hover and focus |
 * | `data-truncated` | crumb content | present while the label is cut, with `textOverflow="ellipsis"` |
 * | `data-slot` | crumb label, icon, chevron | `"breadcrumb-item-label"`, `"breadcrumb-item-icon"`, `"breadcrumb-item-chevron"` (menu crumbs only) |
 * | `data-slot` | separator | `"breadcrumb-separator"` |
 * | `data-slot` | `...` crumb | `"breadcrumb-ellipsis"` on the `<li>`, `"breadcrumb-ellipsis-trigger"` with `data-kind="ellipsis"` on the button, or on the `<span>` that stands in for it when `ellipsis.render` renders nothing |
 * | `data-slot` | `...` popup | `"breadcrumb-ellipsis-popup"` on the popup, a `role="dialog"` named by `ellipsis.heading` or `Hidden items`, `"breadcrumb-ellipsis-popup-positioner"` on the box it is placed in and `"breadcrumb-ellipsis-popup-viewport"` on the box that swaps its content, the list or the content of `ellipsis.render` inside it. They render only while the popup is open |
 * | `data-slot` | `...` list | `"breadcrumb-ellipsis-content"` on the box that holds the list (a `role="group"` named by the heading when there is one), `"breadcrumb-ellipsis-heading"`, `"breadcrumb-ellipsis-list"` on the `<ul>` |
 * | `data-slot` | `...` row | `"breadcrumb-ellipsis-row"` on the link, `<button>` or `<span>` of the row, with `data-kind` set to `link`, `button`, `menu` or `text`. `"breadcrumb-ellipsis-row-icon"`, `"breadcrumb-ellipsis-row-label"`, `"breadcrumb-ellipsis-row-suffix"` and `"breadcrumb-ellipsis-row-chevron"` (menu rows only) inside it |
 * | `data-slot` | preview card | `"breadcrumb-preview"` on the popup, which has no role, `"breadcrumb-preview-positioner"` on the box it is placed in, `"breadcrumb-preview-viewport"` on the box that swaps its content. They render only while the card is open |
 * | `data-popup-open` | crumb content, `...` crumb | present on the trigger the open popup belongs to |
 * | `data-slot` | measuring row | `"breadcrumb-measure"`, hidden, rendered while `truncate` is set |
 *
 * With a `testId`, a crumb is `` `${testId}-item-${index}` `` whether it is visible or a row in the
 * popup of the `...` crumb, `index` being its place in `items`: on a row it is the link, `<button>`
 * or `<span>` that holds the icon, the title and the suffix. The separator before a crumb is
 * `` `${testId}-item-separator-${index}` ``, the `...` crumb is `` `${testId}-ellipsis` `` and the
 * separator before it `` `${testId}-ellipsis-separator` ``. The popup it opens is
 * `` `${testId}-ellipsis-popup` ``, with the default list and with `ellipsis.render`, and the group
 * that holds the rows under the `ellipsis.heading` is `` `${testId}-ellipsis-group-collapsed` ``. The
 * card of a crumb is `` `${testId}-preview` ``. Both are the same element, so its id and its
 * `data-slot` change as the popup moves between a crumb and the `...` crumb. A crumb's own menu is
 * `` `${testId}-item-${index}-menu` `` and each of its rows
 * `` `${testId}-item-${index}-menu-item-${position}` ``, `position` being the place of the entry in
 * its `menu`. Once the crumb is collapsed its rows keep their names, in the menu its row opens, and
 * the `-menu` id goes, since the row of the crumb takes the id of the crumb.
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
 * // A card on hover, and a `...` popup with the step of each crumb
 * <Breadcrumb
 *   variant="outlined"
 *   collapseFrom="start"
 *   maxVisible={4}
 *   items={steps.map((step) => ({
 *     title: step.name,
 *     href: step.url,
 *     icon: step.icon,
 *     preview: <StepCard step={step} />,
 *   }))}
 *   ellipsis={{
 *     heading: 'Earlier steps',
 *     rowSuffix: (_item, index) => <span>{index + 1}</span>,
 *   }}
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
