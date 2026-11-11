import { type ReactElement, useRef } from 'react';
import { partTestId } from '../../lib/utils.js';
import { DATE_PICKER_TIME_MAX, DatePickerText, DatePickerTimeUnit } from '../constants.js';
import styles from '../date-picker.module.scss';
import type { DatePickerTimeType, DatePickerTimeUnitType } from '../types.js';
import { DatePickerTimeField } from './date-picker-time-field.js';

const TIME_UNITS: readonly DatePickerTimeUnitType[] = [
	DatePickerTimeUnit.Hours,
	DatePickerTimeUnit.Minutes,
	DatePickerTimeUnit.Seconds,
];

const TIME_LABELS: Record<DatePickerTimeUnitType, string> = {
	hours: DatePickerText.Hours,
	minutes: DatePickerText.Minutes,
	seconds: DatePickerText.Seconds,
};

/**
 * @access private
 */
export type DatePickerTimeProps = {
	time: DatePickerTimeType;
	testId: string | undefined;
	onChange: (time: DatePickerTimeType) => void;
	onApply: () => void;
};

/**
 * The time row: hours, minutes and seconds, in 24-hour form.
 *
 * @access private
 */
export function DatePickerTime({
	time,
	testId,
	onChange,
	onApply,
}: DatePickerTimeProps): ReactElement {
	const fieldRefs = useRef<Array<HTMLInputElement | null>>([]);

	return (
		<div
			// eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- <div role="group"> names the three fields, a fieldset would carry form semantics of its own.
			role="group"
			aria-label={DatePickerText.Time}
			data-slot="date-picker-time"
			className={styles['date-picker__time']}
		>
			{TIME_UNITS.map((unit, index) => (
				<span key={unit} className={styles['date-picker__time-part']}>
					{index > 0 && (
						<span aria-hidden className={styles['date-picker__time-separator']}>
							:
						</span>
					)}
					<DatePickerTimeField
						ref={(element) => {
							fieldRefs.current[index] = element;
						}}
						label={TIME_LABELS[unit]}
						value={time[unit]}
						max={DATE_PICKER_TIME_MAX[unit]}
						testId={partTestId(testId, `time-${unit}`)}
						onChange={(value) => onChange({ ...time, [unit]: value })}
						onComplete={() => fieldRefs.current[index + 1]?.focus()}
						onApply={onApply}
					/>
				</span>
			))}
		</div>
	);
}
