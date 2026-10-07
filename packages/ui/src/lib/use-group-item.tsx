import { type ReactNode, type RefCallback, useId, useMemo } from 'react';
import { TooltipStack } from '../tooltip/subcomponents/tooltip-stack.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../tooltip/tooltip-content-stack-context.js';
import { useIsLabelTruncated } from './useIsLabelTruncated.js';
import { hasRenderableContent } from './utils.js';

/**
 * One entry of the `items` of a group, as far as the row that renders it is concerned.
 *
 * @access private
 */
export type GroupItem = {
	label: ReactNode;
	value: string;
	testId?: string;
	disabled?: boolean;
	disabledTooltip?: ReactNode;
};

/**
 * @access private
 */
export type UseGroupItemOptions = {
	item: GroupItem;
	/**
	 * The group's own `testId`, which names an item that does not name itself.
	 */
	groupTestId: string | undefined;
	/**
	 * What a label that renders nothing falls back to.
	 */
	emptyLabel: string;
	/**
	 * Measures the label, and shows it in full in the tooltip while it is truncated.
	 */
	measureLabel: boolean;
	/**
	 * Set while the group shows its own reason, which takes the place of the item's tooltip.
	 */
	suppressed: boolean;
};

/**
 * @access private
 */
export type GroupItemState = {
	/**
	 * The id of the label, for the control's `aria-labelledby`.
	 */
	labelId: string;
	/**
	 * The label, or `emptyLabel` when it renders nothing.
	 */
	resolvedLabel: ReactNode;
	isLabelEmpty: boolean;
	isLabelTruncated: boolean;
	labelRef: RefCallback<HTMLSpanElement>;
	/**
	 * The item's own `testId`, or `` `${groupTestId}-item-${value}` ``.
	 */
	testId: string | undefined;
	/**
	 * Whether the row mounts its tooltip at all. Decided from the props, not from whether there is
	 * content right now, so the row never remounts and never drops focus when a reason appears or a
	 * label starts to fit.
	 */
	hasTooltip: boolean;
	/**
	 * Spread on the row's `TooltipAnchor`.
	 */
	tooltipProps: {
		content: ReactNode;
		'aria-describedby': string | undefined;
	};
};

/**
 * What a row of a group built from `items` derives from its item: the label or its fallback, the
 * test id, and the tooltip that holds the item's disabled reason and its truncated label.
 *
 * @access private
 */
export function useGroupItem({
	item,
	groupTestId,
	emptyLabel,
	measureLabel,
	suppressed,
}: UseGroupItemOptions): GroupItemState {
	const { label, value, testId, disabled, disabledTooltip } = item;
	const labelId = useId();
	const reasonId = useId();

	const isLabelEmpty = !hasRenderableContent(label);
	const resolvedLabel: ReactNode = isLabelEmpty ? emptyLabel : label;
	const [isLabelTruncated, labelRef] = useIsLabelTruncated(measureLabel);
	const hasReason = !suppressed && disabled === true && hasTooltipContent(disabledTooltip);
	const hasLabel = !suppressed && isLabelTruncated;

	const content = useMemo(() => {
		const entries: TooltipContentStackEntry[] = [];

		if (hasReason) {
			entries.push({
				id: 'disabled-tooltip',
				content: <span id={reasonId}>{disabledTooltip}</span>,
			});
		}

		if (hasLabel) {
			entries.push({ id: 'label', content: resolvedLabel });
		}

		return entries.length === 0 ? null : <TooltipStack items={entries} />;
	}, [hasReason, reasonId, disabledTooltip, hasLabel, resolvedLabel]);

	return {
		labelId,
		resolvedLabel,
		isLabelEmpty,
		isLabelTruncated,
		labelRef,
		testId: testId ?? (groupTestId === undefined ? undefined : `${groupTestId}-item-${value}`),
		hasTooltip: measureLabel || disabledTooltip != null,
		tooltipProps: {
			content,
			// The label already names the row, so the popup describes it with the reason alone.
			'aria-describedby': hasReason ? reasonId : undefined,
		},
	};
}
