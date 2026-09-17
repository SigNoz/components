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
import { TabsTrigger } from './subcomponents/tabs-trigger.js';
import styles from './tabs.module.scss';
import { TabsVariant } from './constants.js';
import type { TabsProps, ValidateTabsProps } from './types.js';

function updateHoverSliderPosition(
	slider: HTMLDivElement | null,
	list: HTMLElement | null,
	trigger: HTMLElement | null,
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

	slider.style.transform = `translateX(${triggerRect.left - listRect.left}px)`;
	slider.style.width = `${triggerRect.width}px`;
	slider.style.opacity = '1';
}

const TabsImpl = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
	{
		className,
		items,
		variant,
		orientation,
		alignment,
		value,
		defaultValue,
		onChange,
		tabBarLeftContent,
		tabBarRightContent,
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

	const handleMouseOver: MouseEventHandler<HTMLDivElement> = (event) => {
		const trigger = (event.target as HTMLElement).closest<HTMLElement>('[data-slot="tabs-item"]');
		updateHoverSliderPosition(hoverSliderRef.current, listRef.current, trigger);
	};

	const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
		updateHoverSliderPosition(hoverSliderRef.current, null, null);
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
					data-has-extra-content={tabBarLeftContent || tabBarRightContent ? '' : undefined}
					data-has-left-content={tabBarLeftContent ? '' : undefined}
					data-has-right-content={tabBarRightContent ? '' : undefined}
				>
					<div data-slot="tab-spacer-left" className={styles['tabs__border-spacer']} />

					{tabBarLeftContent != null && (
						<div data-slot="tab-extra-content-left" className={styles['tabs__extra-content']}>
							{tabBarLeftContent}
						</div>
					)}

					<div className={styles['tabs__list-inner']}>
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
						</TabsPrimitive.List>

						{isPrimary && (
							<div
								ref={hoverSliderRef}
								data-slot="tabs-hover-slider"
								className={styles['tabs__hover-slider']}
								style={{ opacity: 0 }}
							/>
						)}
					</div>

					{tabBarRightContent != null && (
						<div data-slot="tab-extra-content-right" className={styles['tabs__extra-content']}>
							{tabBarRightContent}
						</div>
					)}

					<div
						data-slot="tab-spacer-grow"
						className={cn(styles['tabs__border-spacer'], styles['tabs__border-spacer--grow'])}
					/>
				</div>

				{items.map((item) => (
					<TabsPrimitive.Panel
						key={item.key}
						value={item.key}
						data-slot="tabs-panel"
						data-no-content-padding={noTabContentPadding || undefined}
						className={styles.tabs__content}
					>
						{item.children}
					</TabsPrimitive.Panel>
				))}
			</TooltipProviderIfMissing>
		</TabsPrimitive.Root>
	);
});

/**
 * Renders a tab bar and its panels from `items` (Base UI `Tabs`).
 *
 * The bar owns its markup: there are no children to compose, and no `TabsTrigger`/`TabsContent` to
 * import. Every `aria-*` and any `data-*` are forwarded to the root.
 *
 * Visual values are `--tabs-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Items
 *
 * Each item is `{ key, label, children }`, plus optional `prefixIcon`/`suffixIcon`. `key` is what
 * `value`/`onChange` carry and what associates a tab with its panel.
 *
 * An item can disable itself with `disabled` + `disabledTooltip`, which blocks that tab alone.
 * Base UI keeps a disabled tab focusable and hoverable (`aria-disabled`, not the native attribute),
 * so its tooltip stays reachable, the same guarantee `Button` relies on for `disabledTooltip`.
 *
 * A label that renders nothing (`null`, `false` or an empty string) falls back to the text
 * `<No label>`, and that label carries `data-empty-label`. The tab is never dropped: a view that
 * disappears from the bar removes it from the group without saying so.
 *
 * ### Selection
 *
 * Arrow keys move focus between tabs without activating them. A focused tab is only activated by
 * `Enter`/`Space`, or by click. This is Base UI's default (`activateOnFocus={false}`), left as is.
 *
 * ### Truncation
 *
 * Every label is measured and re-measured on resize. While it does not fit, the label carries
 * `data-truncated` and shows the full text in a tooltip. There is no `textOverflow` prop, unlike
 * `Button`/`RadioGroup`: truncation is always on.
 *
 * A disabled tab's `disabledTooltip` stacks above the truncated label, reason first.
 *
 * ### Tab bar layout
 *
 * `alignment` positions the tab list within its container. `tabBarLeftContent`/
 * `tabBarRightContent` render extra content in the same row, pinned to the bar's outer edges rather
 * than to the list. To keep a block beside the list instead, set
 * `--tabs-bar-content-left-order`/`--tabs-bar-content-right-order` to `2`.
 *
 * The room between the list and a content block belongs to a spacer, and `alignment` only picks
 * which spacer takes it. Hand it to the content block instead with
 * `--tabs-extra-content-flex-grow: 1` (or the per-side
 * `--tabs-extra-content-left-flex-grow`/`--tabs-extra-content-right-flex-grow`), usually alongside
 * `--tabs-border-spacer-grow-flex-grow: 0`. A block that should also give room back needs
 * `--tabs-extra-content-flex-shrink: 1` and `--tabs-extra-content-min-width: 0`, since a flex item
 * will not shrink below its content otherwise.
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
 * addressable as `` `${testId}-item-${key}` ``.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"tabs"` |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `tabs-list-wrapper` | always, the row holding the list and any extra content, `data-no-content-padding` while `noTabContentPadding` is set |
 * | `tabs-item` | one per item, the tab button, carries the item's `testId` |
 * | `tabs-label` | the measured label, `data-empty-label` while it is the fallback |
 * | `tabs-active-slider` | `variant="primary"` only, tracks the active tab (Base UI `Tabs.Indicator`) |
 * | `tabs-hover-slider` | `variant="primary"` only, tracks the hovered tab |
 * | `tabs-panel` | one per item, `data-no-content-padding` while `noTabContentPadding` is set |
 *
 * @example
 * ```tsx
 * <Tabs
 *   variant="primary"
 *   orientation="horizontal"
 *   alignment="left"
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
 * // Disabled tab with its reason, controlled state
 * const [active, setActive] = useState('overview');
 * <Tabs
 *   variant="secondary"
 *   orientation="horizontal"
 *   alignment="left"
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
