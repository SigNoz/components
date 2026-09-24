import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { type ReactElement, type ReactNode, useEffect, useMemo } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { hasRenderableContent } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { TooltipStack } from '../../tooltip/subcomponents/tooltip-stack.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../../tooltip/tooltip-content-stack-context.js';
import { TOGGLE_GROUP_EMPTY_LABEL } from '../constants.js';
import styles from '../toggle-group.module.scss';
import type { ToggleGroupItemProps } from '../types.js';

/**
 * @access private
 */
export type ToggleGroupButtonProps = {
	/**
	 * The one entry of the bar's `items` this button renders.
	 */
	item: ToggleGroupItemProps;
	/**
	 * The bar's own `testId`, used to name this button when the item does not name itself.
	 */
	groupTestId: string | undefined;
	/**
	 * True while the whole bar is off, which blocks this button whatever the item says.
	 */
	groupDisabled: boolean;
	/**
	 * Why the whole bar is off. Stacks above the item's own reason.
	 */
	groupDisabledTooltip: ReactNode;
	/**
	 * True while the bar's value is locked. Blocks the press without disabling the bar.
	 */
	groupReadOnly: boolean;
	/**
	 * Why the value is locked. The only reason shown while it is set.
	 */
	groupReadOnlyTooltip: ReactNode;
};

/**
 * One segment of the bar: its label, and the tooltip carrying whatever the label cannot show.
 *
 * A component rather than a loop body because each button measures its own label and owns its own
 * tooltip, and hooks cannot run in a loop.
 *
 * @access private
 */
export function ToggleGroupButton({
	item,
	groupTestId,
	groupDisabled,
	groupDisabledTooltip,
	groupReadOnly,
	groupReadOnlyTooltip,
}: ToggleGroupButtonProps): ReactElement {
	const { value, label, prefix, suffix, testId, disabled, disabledTooltip } = item;
	// The bar's own `disabled` never reaches Base UI, so it is applied here alongside the item's.
	// A read-only bar blocks the press the same way without being disabled, which is why the two are
	// tracked apart: only the disabled path repaints the label.
	const isDisabled = groupDisabled || Boolean(disabled);
	const isLocked = isDisabled || groupReadOnly;

	const isLabelEmpty = !hasRenderableContent(label);
	const resolvedLabel = isLabelEmpty ? TOGGLE_GROUP_EMPTY_LABEL : label;

	const resolvedTestId =
		testId ?? (groupTestId === undefined ? undefined : `${groupTestId}-button-${value}`);

	// The fallback keeps the option on screen, and this says the label is missing rather than
	// letting `<No label>` ship as if it were a design.
	useEffect(() => {
		if (isLabelEmpty) {
			console.error(
				`ToggleGroup: the item "${value}" renders no label, showing "${TOGGLE_GROUP_EMPTY_LABEL}" instead.`,
			);
		}
	}, [isLabelEmpty, value]);

	// The bar has no configurable text-overflow mode, unlike Button: truncation is always on.
	const [isLabelOverflowing, labelRef] = useIsLabelTruncated(true);
	// A locked bar owns the reason for the whole bar, so an item's own is suppressed for as long as
	// it is set: a read-only bar has one reason, not one per button.
	const hasDisabledTooltip =
		!groupReadOnly && Boolean(disabled) && hasTooltipContent(disabledTooltip);

	const hasGroupDisabledTooltip = groupDisabled && hasTooltipContent(groupDisabledTooltip);
	const hasReadOnlyTooltip = groupReadOnly && hasTooltipContent(groupReadOnlyTooltip);

	// Most general first: why the value is locked or the bar is off, then why this option is, then
	// what the label says in full. Every one that applies is shown, because each answers a different
	// question. The bar's two reasons are exclusive: the root suppresses `disabled` while read-only.
	const tooltipContent = useMemo(() => {
		const entries: TooltipContentStackEntry[] = [];

		if (hasReadOnlyTooltip) {
			entries.push({ id: 'group-readonly-tooltip', content: groupReadOnlyTooltip });
		}

		if (hasGroupDisabledTooltip) {
			entries.push({ id: 'group-disabled-tooltip', content: groupDisabledTooltip });
		}

		if (hasDisabledTooltip) {
			entries.push({ id: 'disabled-tooltip', content: disabledTooltip });
		}

		if (isLabelOverflowing) {
			entries.push({ id: 'label', content: resolvedLabel });
		}

		return entries.length === 0 ? null : <TooltipStack items={entries} />;
	}, [
		hasReadOnlyTooltip,
		groupReadOnlyTooltip,
		hasGroupDisabledTooltip,
		groupDisabledTooltip,
		hasDisabledTooltip,
		disabledTooltip,
		isLabelOverflowing,
		resolvedLabel,
	]);

	// Base UI's own `disabled` renders the native attribute, which takes every pointer event with
	// it and leaves the tooltip unreachable. `aria-disabled` plus a cancelled press keeps the
	// button hoverable, focusable and inert, the same trade `Button` makes through
	// `focusableWhenDisabled`. `data-disabled` stays the item's alone, so the stylesheet can tell
	// one blocked option from a bar that is off as a whole.
	//
	// A read-only button carries `aria-disabled` too: `aria-readonly` is not allowed on
	// `role="button"`, so it would be dropped by assistive technology and the press would land
	// unannounced. `data-readonly` is what the stylesheet reads to paint the lock apart.
	const buttonEl = (
		<TogglePrimitive
			value={value}
			data-slot="toggle-group-button"
			data-disabled={disabled || undefined}
			data-readonly={groupReadOnly || undefined}
			aria-disabled={isLocked || undefined}
			className={styles['toggle-group__button']}
			onPressedChange={(_pressed, eventDetails) => {
				if (isLocked) {
					eventDetails.cancel();
				}
			}}
			{...(resolvedTestId === undefined ? {} : { 'data-testid': resolvedTestId })}
		>
			{prefix !== undefined && (
				<span data-slot="toggle-group-prefix" className={styles['toggle-group__affix']}>
					{prefix}
				</span>
			)}
			<span
				ref={labelRef}
				data-slot="toggle-group-label"
				data-truncated={isLabelOverflowing || undefined}
				data-empty-label={isLabelEmpty || undefined}
				className={styles['toggle-group__label']}
			>
				{resolvedLabel}
			</span>
			{suffix !== undefined && (
				<span data-slot="toggle-group-suffix" className={styles['toggle-group__affix']}>
					{suffix}
				</span>
			)}
		</TogglePrimitive>
	);

	return <TooltipAnchor content={tooltipContent}>{buttonEl}</TooltipAnchor>;
}
