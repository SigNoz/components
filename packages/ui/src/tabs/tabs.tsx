import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import {
	forwardRef,
	type MouseEventHandler,
	type ReactElement,
	type RefAttributes,
	useMemo,
	useRef,
} from 'react';
import { cn } from '../lib/utils.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import { useTabsOverflow } from './hooks/use-tabs-overflow.js';
import { TabsScrollButton } from './subcomponents/tabs-scroll-button.js';
import { TabsTrigger } from './subcomponents/tabs-trigger.js';
import styles from './tabs.module.scss';
import { TabsOrientation, TabsScrollDirection, TabsVariant } from './constants.js';
import type { TabsProps, ValidateTabsProps } from './types.js';

function updateHoverSliderPosition(
	slider: HTMLDivElement | null,
	list: HTMLElement | null,
	trigger: HTMLElement | null,
	isVertical: boolean,
): void {
	if (!slider) {
		return;
	}

	if (!list || !trigger) {
		slider.style.opacity = '0';
		return;
	}

	const listRect = list.getBoundingClientRect();
	const triggerRect = trigger.getBoundingClientRect();

	// Both rects are read from the same scrolled box, so the delta holds however far the strip has
	// travelled. The size of the other axis is cleared rather than left behind: an orientation flip
	// would otherwise keep the width the previous axis wrote.
	if (isVertical) {
		slider.style.transform = `translateY(${triggerRect.top - listRect.top}px)`;
		slider.style.height = `${triggerRect.height}px`;
		slider.style.width = '';
	} else {
		slider.style.transform = `translateX(${triggerRect.left - listRect.left}px)`;
		slider.style.width = `${triggerRect.width}px`;
		slider.style.height = '';
	}

	slider.style.opacity = '1';
}

const TabsImpl = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
	{
		children,
		className,
		items,
		variant,
		orientation,
		alignment,
		value,
		defaultValue,
		onChange,
		tabBarStartContent,
		tabBarEndContent,
		noTabContentPadding = false,
		testId,
		...props
	},
	ref,
) {
	const listRef = useRef<HTMLDivElement>(null);
	const hoverSliderRef = useRef<HTMLDivElement>(null);

	const onValueChange = useMemo(
		() =>
			onChange === undefined
				? undefined
				: (next: unknown): void => {
						if (typeof next !== 'string') {
							return;
						}

						onChange(next);
					},
		[onChange],
	);

	const isPrimary = variant === TabsVariant.Primary;
	const isVertical = orientation === TabsOrientation.Vertical;

	const {
		viewportRef,
		isOverflowing,
		canScrollToStart,
		canScrollToEnd,
		scrollTowardsStart,
		scrollTowardsEnd,
	} = useTabsOverflow({ orientation, activeKey: value ?? defaultValue ?? items[0]?.key });

	const handleMouseOver: MouseEventHandler<HTMLDivElement> = (event) => {
		const trigger = (event.target as HTMLElement).closest<HTMLElement>('[data-slot="tabs-item"]');
		updateHoverSliderPosition(hoverSliderRef.current, listRef.current, trigger, isVertical);
	};

	const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
		updateHoverSliderPosition(hoverSliderRef.current, null, null, isVertical);
	};

	return (
		<TabsPrimitive.Root
			ref={ref}
			data-slot="tabs"
			className={cn(styles.tabs, className)}
			value={value}
			defaultValue={defaultValue ?? items[0]?.key}
			onValueChange={onValueChange}
			orientation={orientation}
			{...props}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<TooltipProviderIfMissing>
				<div
					data-slot="tabs-list-wrapper"
					className={styles['tabs__list-wrapper']}
					data-variant={variant}
					data-alignment={alignment}
					data-no-content-padding={noTabContentPadding || undefined}
					data-has-start-content={tabBarStartContent ? '' : undefined}
					data-has-end-content={tabBarEndContent ? '' : undefined}
				>
					<div data-slot="tab-spacer-start" className={styles['tabs__border-spacer']} />

					{tabBarStartContent != null && (
						<div data-slot="tab-extra-content-start" className={styles['tabs__extra-content']}>
							{tabBarStartContent}
						</div>
					)}

					{isOverflowing && (
						<TabsScrollButton
							direction={TabsScrollDirection.Start}
							orientation={orientation}
							variant={variant}
							disabled={!canScrollToStart}
							onScroll={scrollTowardsStart}
							groupTestId={testId}
						/>
					)}

					<div
						ref={viewportRef}
						data-slot="tabs-list-viewport"
						className={styles['tabs__list-inner']}
					>
						<TabsPrimitive.List
							ref={listRef}
							className={styles.tabs__list}
							data-variant={variant}
							onMouseOver={isPrimary ? handleMouseOver : undefined}
							onMouseLeave={isPrimary ? handleMouseLeave : undefined}
						>
							{items.map((item) => (
								<TabsTrigger key={item.key} item={item} variant={variant} groupTestId={testId} />
							))}

							{isPrimary && (
								<TabsPrimitive.Indicator
									data-slot="tabs-active-slider"
									className={styles['tabs__active-slider']}
									renderBeforeHydration
								/>
							)}

							{/*
							 * Inside the list rather than beside it, so its containing block is the same box
							 * the hovered tab is measured against. That delta is then scroll invariant and
							 * the mark travels with the strip, exactly as Base UI's own indicator does.
							 * `role="presentation"` because a tablist takes no other role among its children.
							 */}
							{isPrimary && (
								<div
									ref={hoverSliderRef}
									role="presentation"
									data-slot="tabs-hover-slider"
									data-orientation={orientation}
									className={styles['tabs__hover-slider']}
									style={{ opacity: 0 }}
								/>
							)}
						</TabsPrimitive.List>
					</div>

					{isOverflowing && (
						<TabsScrollButton
							direction={TabsScrollDirection.End}
							orientation={orientation}
							variant={variant}
							disabled={!canScrollToEnd}
							onScroll={scrollTowardsEnd}
							groupTestId={testId}
						/>
					)}

					{tabBarEndContent != null && (
						<div data-slot="tab-extra-content-end" className={styles['tabs__extra-content']}>
							{tabBarEndContent}
						</div>
					)}

					<div
						data-slot="tab-spacer-end"
						className={cn(styles['tabs__border-spacer'], styles['tabs__border-spacer--grow'])}
					/>
				</div>

				{items.map((item) => {
					// An item that navigates has no content of its own, so every tab shows the bar's own
					// panel instead. One panel per item rather than a single one keyed on the active value:
					// Base UI mounts only the open panel, so the router still renders once, and each tab
					// keeps an `aria-controls` that points at something.
					const panelContent = item.children === undefined ? children : item.children;

					return panelContent === undefined ? null : (
						<TabsPrimitive.Panel
							key={item.key}
							value={item.key}
							data-slot="tabs-panel"
							data-no-content-padding={noTabContentPadding || undefined}
							className={styles.tabs__content}
						>
							{panelContent}
						</TabsPrimitive.Panel>
					);
				})}
			</TooltipProviderIfMissing>
		</TabsPrimitive.Root>
	);
});

/**
 * Renders a tab bar and its panels from `items` (Base UI `Tabs`).
 *
 * The bar owns its markup: there is no `TabsTrigger`/`TabsContent` to import, and the only thing
 * composed as children is the router-owned panel described under Navigation tabs. Every `aria-*`
 * and any `data-*` are forwarded to the root.
 *
 * Visual values are `--tabs-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Items
 *
 * Each item is `{ key, label, children }`, plus optional `prefixIcon`/`suffixIcon`. `key` is what
 * `value`/`onChange` carry and what associates a tab with its panel. An item that navigates carries
 * `render` in place of `children`, see Navigation tabs.
 *
 * An item can disable itself with `disabled` + `disabledTooltip`, which blocks that tab alone.
 * Base UI keeps a disabled tab focusable and hoverable (`aria-disabled`, not the native attribute),
 * so its tooltip stays reachable, the same guarantee `Button` relies on for `disabledTooltip`.
 *
 * A label that renders nothing (`null`, `false` or an empty string) falls back to the text
 * `<No label>`, and that label carries `data-empty-label`. The tab is never dropped: a view that
 * disappears from the bar removes it from the group without saying so.
 *
 * ### Navigation tabs
 *
 * A tab whose item carries `render` renders as whatever the call site hands over, a router `Link`
 * in practice, while keeping `role="tab"`, the arrow-key behaviour and every `data-*` the bar
 * stamps. That makes the tab a real anchor: middle click, "open in new tab" and the URL in the
 * status bar all work, which no amount of `onChange` gives you.
 *
 * Those items have no `children` of their own. The panel is the bar's `children` instead, an
 * `Outlet`, and it is rendered for whichever tab is active. Leave it out when the `Outlet` already
 * lives elsewhere in the tree, and the bar renders tabs alone.
 *
 * Such a bar is controlled: `value` comes from the router, so the browser's back and forward move
 * it too. `defaultValue` is refused, and so is mixing the bar's `children` with items that bring
 * their own.
 *
 * A `disabled` item ignores `render` and falls back to the plain `<button>`. An anchor is still
 * followed by a middle click and still offers "open in new tab", so rendering one would be a lock
 * anybody can walk around.
 *
 * ### Selection
 *
 * Arrow keys move focus between tabs without activating them. A focused tab is only activated by
 * `Enter`/`Space`, or by click. This is Base UI's default (`activateOnFocus={false}`), left as is.
 *
 * ### Orientation
 *
 * `orientation="vertical"` turns the bar into a rail beside its panel: the tabs stack, the arrow
 * keys become up and down, and the primary indicator runs down the rail's inner edge instead of
 * under the tabs. Every side-named prop follows the bar rather than the screen, which is why
 * `alignment` and the two bar content props are named start and end: start is the left edge of a
 * horizontal bar and the top edge of a vertical one.
 *
 * A vertical rail only overflows if something bounds its height, so give it or an ancestor one.
 *
 * ### Truncation and overflow
 *
 * Every label is measured and re-measured on resize. While it does not fit, the label carries
 * `data-truncated` and shows the full text in a tooltip. There is no `textOverflow` prop, unlike
 * `Button`/`RadioGroup`: truncation is always on.
 *
 * More tabs than the bar can hold is a different problem, and has a different answer: the strip
 * scrolls, and two arrows appear at its ends. A tab is only truncated when it alone is wider than
 * the visible strip. There is no prop for this either.
 *
 * Every tab stays a real `role="tab"` while the strip scrolls, so the arrow keys reach all of them
 * and the browser keeps the focused one in view. Selecting a tab that is out of view scrolls it
 * back. The arrows are named buttons rather than decoration, for the pointer and switch users who
 * never send an arrow key to the tablist.
 *
 * Bar content is what the strip gives way to: `tabBarStartContent`/`tabBarEndContent` keep their
 * size, so a bar too narrow for its tabs scrolls the tabs rather than pushing a button off the end.
 *
 * A disabled tab's `disabledTooltip` stacks above the truncated label, reason first.
 *
 * ### Tab bar layout
 *
 * `alignment` positions the tab list within its container. `tabBarStartContent`/
 * `tabBarEndContent` render extra content in the same row (or column), pinned to the bar's outer
 * edges rather than to the list. To keep a block beside the list instead, set
 * `--tabs-bar-content-start-order`/`--tabs-bar-content-end-order` to `2`.
 *
 * The room between the list and a content block belongs to a spacer, and `alignment` only picks
 * which spacer takes it. Hand it to the content block instead with
 * `--tabs-extra-content-flex-grow: 1` (or the per-side
 * `--tabs-extra-content-start-flex-grow`/`--tabs-extra-content-end-flex-grow`), usually alongside
 * `--tabs-border-spacer-grow-flex-grow: 0`. A block that should also give room back needs
 * `--tabs-extra-content-flex-shrink: 1` and `--tabs-extra-content-min-inline-size: 0`, since a flex
 * item will not shrink below its content otherwise.
 *
 * ### Content padding
 *
 * `noTabContentPadding` removes the padding around the active panel, for a panel that wants to
 * manage its own spacing (for example, a panel that is itself a table or a full-bleed chart). On
 * `variant="primary"` it also drops the bar's own inline padding, so the first and last tab line up
 * with the panel's edge.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` and also names every tab: an item with no `testId` of its own is
 * addressable as `` `${testId}-item-${key}` ``. The two scroll arrows are
 * `` `${testId}-scroll-start` `` and `` `${testId}-scroll-end` ``.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"tabs"` |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `tabs-list-wrapper` | always, the row holding the list and any extra content, `data-no-content-padding` while `noTabContentPadding` is set |
 * | `tabs-list-viewport` | always, the box the tab strip scrolls inside |
 * | `tabs-scroll-button` | one per end while the strip overflows, `data-direction` is `start` or `end` |
 * | `tabs-item` | one per item, the tab button, carries the item's `testId` |
 * | `tabs-label` | the measured label, `data-empty-label` while it is the fallback |
 * | `tabs-active-slider` | `variant="primary"` only, tracks the active tab (Base UI `Tabs.Indicator`) |
 * | `tabs-hover-slider` | `variant="primary"` only, tracks the hovered tab |
 * | `tabs-panel` | one per item that has a panel, `data-no-content-padding` while `noTabContentPadding` is set |
 *
 * @example
 * ```tsx
 * <Tabs
 *   variant="primary"
 *   orientation="horizontal"
 *   alignment="start"
 *   defaultValue="overview"
 *   items={[
 *     { key: 'overview', label: 'Overview', children: <div>Overview content</div> },
 *     { key: 'settings', label: 'Settings', children: <div>Settings content</div> },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // A vertical rail: the tabs stack and the panel sits beside them
 * <Tabs
 *   variant="secondary"
 *   orientation="vertical"
 *   alignment="start"
 *   defaultValue="overview"
 *   items={[
 *     { key: 'overview', label: 'Overview', children: <div>Overview content</div> },
 *     { key: 'settings', label: 'Settings', children: <div>Settings content</div> },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Tabs that navigate: each one is a real link, the panel is the router's
 * const { pathname } = useLocation();
 * <Tabs
 *   variant="primary"
 *   orientation="horizontal"
 *   alignment="start"
 *   value={pathname.split('/').at(-1)}
 *   items={[
 *     { key: 'overview', label: 'Overview', render: <Link to="overview" /> },
 *     { key: 'logs', label: 'Logs', render: <Link to="logs" /> },
 *   ]}
 * >
 *   <Outlet />
 * </Tabs>
 * ```
 *
 * @example
 * ```tsx
 * // Disabled tab with its reason, controlled state
 * const [active, setActive] = useState('overview');
 * <Tabs
 *   variant="secondary"
 *   orientation="horizontal"
 *   alignment="start"
 *   value={active}
 *   onChange={setActive}
 *   items={[
 *     { key: 'overview', label: 'Overview', children: 'Overview content' },
 *     {
 *       key: 'billing',
 *       label: 'Billing',
 *       children: 'Billing content',
 *       disabled: true,
 *       disabledTooltip: 'Ask an admin for access',
 *     },
 *   ]}
 * />
 * ```
 */
export const Tabs = TabsImpl as <T extends TabsProps>(
	props: T &
		ValidateTabsProps<T> &
		// `T` is inferred from the call site, so `T extends TabsProps` alone never runs excess property
		// checks. Every key outside the props (a typo, an attribute the bar does not forward on
		// purpose) is pinned to `never` instead.
		Record<Exclude<keyof T, keyof TabsProps | keyof RefAttributes<HTMLDivElement>>, never> &
		RefAttributes<HTMLDivElement>,
) => ReactElement;
