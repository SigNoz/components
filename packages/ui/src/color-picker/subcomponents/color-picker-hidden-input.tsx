import { type ReactElement, useRef } from 'react';
import { useFormReset } from '../../lib/use-form-reset.js';
import styles from '../color-picker.module.scss';

/**
 * @access private
 */
export type ColorPickerHiddenInputProps = {
	value: string;
	name: string | undefined;
	form: string | undefined;
	required: boolean;
	disabled: boolean;
	trigger: HTMLElement | null;
	onReset: () => void;
};

/**
 * The input the picker submits with its form.
 *
 * A text input rather than `type="hidden"`, and without `readOnly`: the browser skips both when it
 * checks `required`, so neither could block the submit.
 *
 * @access private
 */
export function ColorPickerHiddenInput({
	value,
	name,
	form,
	required,
	disabled,
	trigger,
	onReset,
}: ColorPickerHiddenInputProps): ReactElement {
	const inputRef = useRef<HTMLInputElement>(null);

	useFormReset(inputRef, form, onReset);

	return (
		<input
			ref={inputRef}
			type="text"
			aria-hidden="true"
			tabIndex={-1}
			className={styles['color-picker__visually-hidden']}
			value={value}
			name={name}
			form={form}
			required={required}
			disabled={disabled}
			// The browser focuses a required field it blocked the submit on. The user acts on the
			// trigger, so the focus goes there.
			onFocus={() => trigger?.focus()}
			onChange={() => {}}
		/>
	);
}
