import type { ChangeEvent, ReactElement } from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../calendar.module.scss';
import { CalendarChevron } from './calendar-chevron.js';

/**
 * @access private
 */
export type CalendarDropdownOption = {
	value: number;
	label: string;
	disabled: boolean;
};

/**
 * A native `<select>` laid invisible over the label that is painted, so it keeps its own picker
 * and its own keyboard behaviour.
 *
 * @access private
 */
export function CalendarDropdown({
	label,
	options,
	value,
	disabled,
	testId,
	onChange,
}: {
	label: string;
	options: CalendarDropdownOption[] | undefined;
	value: number;
	disabled: boolean;
	testId: string | undefined;
	onChange: (value: number) => void;
}): ReactElement {
	const selectedOption = options?.find((option) => option.value === value);

	return (
		<span data-disabled={disabled} className={styles['calendar__dropdown-root']}>
			<select
				className={styles['calendar__dropdown']}
				aria-label={label}
				value={value}
				disabled={disabled}
				onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(Number(event.target.value))}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				{options?.map((option) => (
					<option key={option.value} value={option.value} disabled={option.disabled}>
						{option.label}
					</option>
				))}
			</select>
			<span
				className={cn(
					styles['calendar__caption-label'],
					styles['calendar__caption-label--dropdown'],
				)}
				aria-hidden="true"
			>
				{selectedOption?.label}
				<CalendarChevron orientation="down" size={18} />
			</span>
		</span>
	);
}
