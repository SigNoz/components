import { forwardRef, type KeyboardEvent, useState } from 'react';
import styles from '../date-picker.module.scss';
import { padTwo, stepTimeValue, typeTimeDigit } from '../utils.js';

/**
 * @access private
 */
export type DatePickerTimeFieldProps = {
	label: string;
	value: number;
	max: number;
	testId: string | undefined;
	onChange: (value: number) => void;
	onComplete: () => void;
	onApply: () => void;
};

/**
 * One two-digit part of the time row: a spin button the arrow keys step and the digits replace.
 *
 * @access private
 */
export const DatePickerTimeField = forwardRef<HTMLInputElement, DatePickerTimeFieldProps>(
	function DatePickerTimeField({ label, value, max, testId, onChange, onComplete, onApply }, ref) {
		// Whether the next digit is the second one of the field. Cleared when the focus leaves it.
		const [hasFirstDigit, setHasFirstDigit] = useState(false);

		function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
			if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
				event.preventDefault();
				setHasFirstDigit(false);
				onChange(stepTimeValue(value, event.key === 'ArrowUp' ? 1 : -1, max));
				return;
			}

			if (event.key === 'Enter') {
				event.preventDefault();
				onApply();
				return;
			}

			if (event.key === 'Backspace' || event.key === 'Delete') {
				event.preventDefault();
				setHasFirstDigit(false);
				onChange(0);
				return;
			}

			if (/^\d$/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
				event.preventDefault();

				const next = typeTimeDigit(value, Number(event.key), hasFirstDigit, max);

				onChange(next.value);
				setHasFirstDigit(!next.complete);

				if (next.complete) {
					onComplete();
				}
			}
		}

		return (
			<input
				ref={ref}
				type="text"
				inputMode="numeric"
				role="spinbutton"
				autoComplete="off"
				aria-label={label}
				aria-valuemin={0}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-valuetext={padTwo(value)}
				data-slot="date-picker-time-field"
				className={styles['date-picker__time-field']}
				value={padTwo(value)}
				onKeyDown={handleKeyDown}
				// Pasted text: its digits, as one number, capped at the maximum.
				onChange={(event) => {
					const digits = event.target.value.replace(/\D/g, '').slice(-2);

					if (digits !== '') {
						onChange(Math.min(Number(digits), max));
					}
				}}
				onFocus={(event) => event.target.select()}
				onBlur={() => setHasFirstDigit(false)}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			/>
		);
	},
);
