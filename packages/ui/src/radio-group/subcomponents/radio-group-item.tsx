import { Radio } from '@base-ui/react/radio';
import type { ReactElement } from 'react';
import { useGroupItem } from '../../lib/use-group-item.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
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
	const { value, disabled } = item;
	const {
		labelId,
		resolvedLabel,
		isLabelEmpty,
		isLabelTruncated,
		labelRef,
		testId,
		hasTooltip,
		tooltipProps,
	} = useGroupItem({
		item,
		groupTestId,
		emptyLabel: RADIO_GROUP_EMPTY_LABEL,
		measureLabel: textOverflow === RadioGroupTextOverflow.Ellipsis,
		suppressed: tooltipsSuppressed,
	});

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
				{...(testId === undefined ? {} : { 'data-testid': testId })}
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
				data-truncated={isLabelTruncated || undefined}
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
		<TooltipAnchor
			{...tooltipProps}
			contentProps={{ className: styles['radio-group__label-tooltip'] }}
		>
			{itemEl}
		</TooltipAnchor>
	);
}
