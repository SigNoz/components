import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { type ReactElement, useId, useMemo } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { hasRenderableContent } from '../../lib/utils.js';
import { TooltipContent } from '../../tooltip/subcomponents/tooltip-content.js';
import { TooltipProviderIfMissing } from '../../tooltip/subcomponents/tooltip-provider.js';
import { TooltipRoot } from '../../tooltip/subcomponents/tooltip-root.js';
import { TooltipStack } from '../../tooltip/subcomponents/tooltip-stack.js';
import { TooltipTrigger } from '../../tooltip/subcomponents/tooltip-trigger.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../../tooltip/tooltip-content-stack-context.js';
import { useTooltipHandle } from '../../tooltip/tooltip-handle.js';
import { TABS_EMPTY_LABEL, TabsVariant } from '../constants.js';
import styles from '../tabs.module.scss';
import type { TabsItemProps, TabsVariantType } from '../types.js';

/**
 * @access private
 */
export type TabsTriggerProps = {
	/**
	 * The one entry of the bar's `items` this tab renders.
	 */
	item: TabsItemProps;
	/**
	 * The bar's `variant`.
	 */
	variant: TabsVariantType;
	/**
	 * The bar's own `testId`, used to name this tab when the item does not name itself.
	 */
	groupTestId: string | undefined;
};

/**
 * The padlock that stands in for a disabled tab's `prefixIcon`.
 *
 * Drawn here rather than taken from `@signozhq/icons` because the design asks for a closed-body
 * padlock the icon set does not carry. It paints in `currentColor`, so it follows the disabled
 * label colour each variant sets instead of pinning one grey.
 *
 * @access private
 */
function TabsLockIcon({ className }: { className?: string }): ReactElement {
	return (
		<svg
			data-slot="tabs-lock-icon"
			className={className}
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M8.72222 5H3.27778C2.84822 5 2.5 5.44772 2.5 6V9.5C2.5 10.0523 2.84822 10.5 3.27778 10.5H8.72222C9.15178 10.5 9.5 10.0523 9.5 9.5V6C9.5 5.44772 9.15178 5 8.72222 5Z"
				fill="currentColor"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4 5V3.44444C4 2.92875 4.21071 2.43417 4.58579 2.06951C4.96086 1.70486 5.46957 1.5 6 1.5C6.53043 1.5 7.03914 1.70486 7.41421 2.06951C7.78929 2.43417 8 2.92875 8 3.44444V5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

/**
 * One tab button: its label, icons, and disabled tooltip.
 *
 * A component rather than a loop body because each tab measures its own label and owns its own
 * tooltip, and hooks cannot run in a loop.
 *
 * @access private
 */
export function TabsTrigger({ item, variant, groupTestId }: TabsTriggerProps): ReactElement {
	const { key, label, disabled, disabledTooltip, prefixIcon, suffixIcon, render } = item;
	const tooltipContentId = useId();
	const tooltipHandle = useTooltipHandle();

	const isLabelEmpty = !hasRenderableContent(label);
	const resolvedLabel = isLabelEmpty ? TABS_EMPTY_LABEL : label;

	const resolvedTestId = groupTestId === undefined ? undefined : `${groupTestId}-item-${key}`;

	// Tabs have no configurable text-overflow mode, unlike Button/RadioGroup: truncation is always on.
	const [isLabelOverflowing, labelRef] = useIsLabelTruncated(true);
	const hasDisabledTooltip = Boolean(disabled) && hasTooltipContent(disabledTooltip);

	const tooltipContent = useMemo(() => {
		const entries: TooltipContentStackEntry[] = [];

		if (hasDisabledTooltip) {
			entries.push({ id: 'disabled-tooltip', content: disabledTooltip });
		}

		if (isLabelOverflowing) {
			entries.push({ id: 'label', content: resolvedLabel });
		}

		return entries.length === 0 ? null : <TooltipStack items={entries} />;
	}, [hasDisabledTooltip, disabledTooltip, isLabelOverflowing, resolvedLabel]);

	// A disabled tab drops `render`. An anchor is still followed by a middle click and still offers
	// "open in new tab" from the context menu, so the only way to actually block one is not to render
	// it. `nativeButton` tells Base UI the element it renders is not a `<button>`, which is what keeps
	// Space activating a link.
	const renderProps =
		render === undefined || disabled ? {} : { render, nativeButton: false as const };

	const triggerEl = (
		<TabsPrimitive.Tab
			value={key}
			disabled={disabled}
			{...renderProps}
			data-slot="tabs-item"
			data-variant={variant}
			className={styles.tabs__trigger}
			{...(resolvedTestId === undefined ? {} : { 'data-testid': resolvedTestId })}
		>
			{disabled ? (
				<TabsLockIcon className={styles.tabs__icon} />
			) : (
				prefixIcon && <span className={styles.tabs__icon}>{prefixIcon}</span>
			)}
			<span
				ref={labelRef}
				data-slot="tabs-label"
				data-truncated={isLabelOverflowing || undefined}
				data-empty-label={isLabelEmpty || undefined}
				className={styles['tabs__label']}
			>
				{resolvedLabel}
			</span>
			{variant === TabsVariant.Secondary && (
				<span aria-hidden="true" data-slot="tabs-dot" className={styles.tabs__dot} />
			)}
			{!disabled && suffixIcon && <span className={styles.tabs__icon}>{suffixIcon}</span>}
		</TabsPrimitive.Tab>
	);

	// Truncation is unconditional, so a tooltip is always possible once the label overflows, the same
	// reasoning Button applies to its default `textOverflow="ellipsis"` mode.
	return (
		<TooltipProviderIfMissing>
			<TooltipTrigger
				handle={tooltipHandle}
				contentId={tooltipContent === null ? undefined : tooltipContentId}
			>
				{triggerEl}
			</TooltipTrigger>
			{tooltipContent !== null && (
				<TooltipRoot handle={tooltipHandle}>
					<TooltipContent id={tooltipContentId} className={styles['tabs__label-tooltip']}>
						{tooltipContent}
					</TooltipContent>
				</TooltipRoot>
			)}
		</TooltipProviderIfMissing>
	);
}
