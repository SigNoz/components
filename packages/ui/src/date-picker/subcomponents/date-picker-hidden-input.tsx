import { type ReactElement, useRef } from 'react';
import { useFormReset } from '../../lib/use-form-reset.js';
import styles from '../date-picker.module.scss';

/**
 * @access private
 */
export type DatePickerHiddenInputProps = {
	trigger: HTMLElement | null;
	name: string | undefined;
	form: string | undefined;
	value: string;
	timezone: string | undefined;
	showTimezone: boolean;
	required: boolean;
	disabled: boolean;
	onReset: () => void;
};

/**
 * The inputs the date picker submits with its form, and the one the browser checks `required`
 * against.
 *
 * Not `type="hidden"`: a hidden input takes no part in the form's validation. It sits under the
 * trigger, out of reach of the pointer and the keyboard, so the browser's message points at the
 * trigger, and the focus the browser gives it on a failed submit goes on to the trigger.
 *
 * @access private
 */
export function DatePickerHiddenInput({
	trigger,
	name,
	form,
	value,
	timezone,
	showTimezone,
	required,
	disabled,
	onReset,
}: DatePickerHiddenInputProps): ReactElement {
	const inputRef = useRef<HTMLInputElement>(null);

	useFormReset(inputRef, form, onReset);

	return (
		<>
			<input
				ref={inputRef}
				type="text"
				aria-hidden
				tabIndex={-1}
				name={name}
				form={form}
				value={value}
				required={required}
				disabled={disabled}
				data-slot="date-picker-input"
				className={styles['date-picker__input']}
				onChange={() => undefined}
				onFocus={() => trigger?.focus()}
			/>
			{showTimezone && name !== undefined && (
				<input
					type="hidden"
					name={`${name}-timezone`}
					form={form}
					value={timezone ?? ''}
					disabled={disabled}
				/>
			)}
		</>
	);
}
