import { Radio } from '@base-ui/react/radio';
import { type ReactElement, useId, useMemo } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
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
import { hasRenderableContent } from '../../lib/utils.js';
import { RADIO_GROUP_EMPTY_LABEL, RadioGroupTextOverflow } from '../constants.js';
import styles from '../radio-group.module.scss';
import type { RadioGroupItemType, RadioGroupTextOverflowType } from '../types.js';

/**
 * @access private
 */
export type RadioGroupItemProps = {
	/**
	 * The one entry of the group's `items` this row renders.
	 */
	item: RadioGroupItemType;
	/**
	 * The group's `textOverflow`, which decides whether this label is measured.
	 */
	textOverflow: RadioGroupTextOverflowType;
	/**
	 * Set while the group itself is explaining why it cannot be used. The group's reason owns the
	 * popup for the whole group, so the row does not put a competing one in it.
	 */
	tooltipsSuppressed: boolean;
	/**
	 * The group's own `testId`, used to name this row when the item does not name itself.
	 */
	groupTestId: string | undefined;
};

/**
 * One row: the control, its indicator, and the label that names it.
 *
 * A component rather than a loop body because each row measures its own label and owns its own
 * tooltip, and hooks cannot run in a loop.
 *
 * @access private
 */
export function RadioGroupItem({
	item,
	textOverflow,
	tooltipsSuppressed,
	groupTestId,
}: RadioGroupItemProps): ReactElement {
	const { label, value, testId, disabled, disabledTooltip } = item;
	const labelId = useId();
	const tooltipContentId = useId();
	const tooltipHandle = useTooltipHandle();

	const isLabelEmpty = !hasRenderableContent(label);
	const resolvedLabel = isLabelEmpty ? RADIO_GROUP_EMPTY_LABEL : label;

	const resolvedTestId =
		testId ?? (groupTestId === undefined ? undefined : `${groupTestId}-item-${value}`);

	const hasOverflowTooltip = textOverflow === RadioGroupTextOverflow.Ellipsis;
	const [isLabelOverflowing, labelRef] = useIsLabelTruncated(hasOverflowTooltip);
	const hasDisabledTooltip = Boolean(disabled) && hasTooltipContent(disabledTooltip);

	const tooltipContent = useMemo(() => {
		if (tooltipsSuppressed) {
			return null;
		}

		const entries: TooltipContentStackEntry[] = [];

		if (hasDisabledTooltip) {
			entries.push({ id: 'disabled-tooltip', content: disabledTooltip });
		}

		if (isLabelOverflowing) {
			entries.push({ id: 'label', content: resolvedLabel });
		}

		return entries.length === 0 ? null : <TooltipStack items={entries} />;
	}, [tooltipsSuppressed, hasDisabledTooltip, disabledTooltip, isLabelOverflowing, resolvedLabel]);

	const hasTooltip = hasOverflowTooltip || disabledTooltip != null;

	const itemEl = (
		<label
			data-slot="radio-group-item"
			data-disabled={disabled === true || undefined}
			className={styles['radio-group__item-wrapper']}
		>
			<Radio.Root
				value={value}
				disabled={disabled}
				aria-labelledby={labelId}
				data-slot="radio-group-control"
				className={styles['radio-group__item']}
				{...(resolvedTestId === undefined ? {} : { 'data-testid': resolvedTestId })}
			>
				<Radio.Indicator
					data-slot="radio-group-indicator"
					className={styles['radio-group__indicator']}
				/>
			</Radio.Root>
			<span
				id={labelId}
				ref={labelRef}
				data-slot="radio-group-label"
				data-truncated={isLabelOverflowing || undefined}
				data-empty-label={isLabelEmpty || undefined}
				className={styles['radio-group__label']}
			>
				{resolvedLabel}
			</span>
		</label>
	);

	if (!hasTooltip) {
		return itemEl;
	}

	return (
		<TooltipProviderIfMissing>
			<TooltipTrigger
				handle={tooltipHandle}
				contentId={tooltipContent === null ? undefined : tooltipContentId}
			>
				{itemEl}
			</TooltipTrigger>
			{tooltipContent !== null && (
				<TooltipRoot handle={tooltipHandle}>
					<TooltipContent id={tooltipContentId} className={styles['radio-group__label-tooltip']}>
						{tooltipContent}
					</TooltipContent>
				</TooltipRoot>
			)}
		</TooltipProviderIfMissing>
	);
}
