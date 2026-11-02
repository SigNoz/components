import { type ReactNode, useId, useMemo } from 'react';
import { partTestId } from '../../lib/utils.js';
import { Select, type SelectOptionItemType } from '../../select/index.js';
import styles from '../pagination.module.scss';
import type { PaginationResolvedPageSizeOption } from '../utils.js';

/**
 * @access private
 */
export type PaginationPageSizeProps = {
	label: string;
	pageSize: number;
	options: PaginationResolvedPageSizeOption[];
	disabled: boolean;
	disabledTooltip: ReactNode;
	testId: string | undefined;
	onChange: (pageSize: number) => void;
};

/**
 * @access private
 */
export function PaginationPageSize({
	label,
	pageSize,
	options,
	disabled,
	disabledTooltip,
	testId,
	onChange,
}: PaginationPageSizeProps): ReactNode {
	const labelId = useId();
	const items = useMemo(
		() =>
			options.map((option): SelectOptionItemType => ({
				type: 'item',
				value: String(option.value),
				label: option.label ?? String(option.value),
				displayValue: String(option.value),
				...(option.testId === undefined ? {} : { testId: option.testId }),
			})),
		[options],
	);

	return (
		<div
			data-slot="pagination-page-size"
			className={styles['pagination__page-size']}
			{...(testId === undefined ? {} : { 'data-testid': partTestId(testId, 'page-size') })}
		>
			<span id={labelId} className={styles['pagination__page-size-label']}>
				{label}
			</span>
			<Select
				aria-labelledby={labelId}
				placeholder={String(pageSize)}
				width="fit-content"
				items={items}
				value={String(pageSize)}
				onChange={(value) => onChange(Number(value))}
				disabled={disabled}
				disabledTooltip={disabledTooltip}
				testId={partTestId(testId, 'page-size-select')}
			/>
		</div>
	);
}
