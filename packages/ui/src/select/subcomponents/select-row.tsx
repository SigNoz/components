import { Select as BaseSelect } from '@base-ui/react/select';
import { Check } from '@signozhq/icons';
import { type ReactNode, useMemo } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { TooltipStack } from '../../tooltip/subcomponents/tooltip-stack.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../../tooltip/tooltip-content-stack-context.js';
import { SELECT_EMPTY_LABEL } from '../constants.js';
import styles from '../select.module.scss';
import type { SelectOptionItemType } from '../types.js';
import { selectOptionText } from '../utils.js';

/**
 * @access private
 */
export type SelectRowProps = {
	item: SelectOptionItemType;
	selectTestId: string | undefined;
	multiple: boolean;
};

/**
 * One row the user can pick.
 *
 * @access private
 */
export function SelectRow({ item, selectTestId, multiple }: SelectRowProps): ReactNode {
	const isLabelEmpty = !hasRenderableContent(item.label);
	const label = isLabelEmpty ? SELECT_EMPTY_LABEL : item.label;
	const disabled = item.disabled === true;
	const testId = item.testId ?? partTestId(selectTestId, `item-${item.value}`);
	const [isLabelTruncated, labelRef] = useIsLabelTruncated(true);
	const hasDisabledTooltip = disabled && hasTooltipContent(item.disabledTooltip);

	const tooltipContent = useMemo(() => {
		const entries: TooltipContentStackEntry[] = [];

		if (hasDisabledTooltip) {
			entries.push({ id: 'disabled-tooltip', content: item.disabledTooltip });
		}

		if (isLabelTruncated) {
			entries.push({ id: 'label', content: label });
		}

		return entries.length === 0 ? null : <TooltipStack items={entries} />;
	}, [hasDisabledTooltip, item.disabledTooltip, isLabelTruncated, label]);

	return (
		<TooltipAnchor content={tooltipContent} contentProps={{ side: 'left' }}>
			<BaseSelect.Item
				value={item.value}
				label={selectOptionText(item) || item.value}
				disabled={disabled}
				data-slot="select-item"
				aria-disabled={disabled || undefined}
				className={styles['select__item']}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				{item.prefix !== undefined && (
					<span
						data-slot="select-item-prefix"
						data-testid={partTestId(testId, 'prefix')}
						className={styles['select__item-affix']}
					>
						{item.prefix}
					</span>
				)}
				<span
					ref={labelRef}
					data-slot="select-item-label"
					data-truncated={isLabelTruncated || undefined}
					data-empty-label={isLabelEmpty || undefined}
					className={styles['select__item-label']}
				>
					{label}
				</span>
				{item.suffix !== undefined && (
					<span
						data-slot="select-item-suffix"
						data-testid={partTestId(testId, 'suffix')}
						className={styles['select__item-affix']}
					>
						{item.suffix}
					</span>
				)}
				<span
					data-slot="select-item-indicator"
					aria-hidden
					className={multiple ? styles['select__item-control'] : styles['select__item-indicator']}
				>
					<Check
						className={
							multiple
								? styles['select__item-control-check']
								: styles['select__item-indicator-check']
						}
					/>
				</span>
			</BaseSelect.Item>
		</TooltipAnchor>
	);
}
