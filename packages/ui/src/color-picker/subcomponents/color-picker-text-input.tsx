import type { KeyboardEvent, ReactElement } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../color-picker.module.scss';
import type { ColorPickerDraft, ColorPickerTextField } from '../use-color-picker-state.js';

/**
 * @access private
 */
export type ColorPickerTextInputProps = {
	field: ColorPickerTextField;
	/** The text of the color the panel shows, used while the field holds no draft. */
	value: string;
	draft: ColorPickerDraft | null;
	/** Whether a text is a value of the field. An empty text is never invalid. */
	isValid: (text: string) => boolean;
	isReadOnly: boolean;
	label: string;
	maxLength: number;
	inputMode: 'text' | 'numeric';
	onEdit: (field: ColorPickerTextField, text: string) => void;
	onCommit: (keepEditing: boolean) => void;
	onDrop: () => void;
	slot: string;
	testId: string | undefined;
};

/**
 * One text input of the panel: the hex, a channel or the alpha. It commits on `Enter` and on blur,
 * never while typing, and only the text of the field being edited is a draft.
 *
 * @access private
 */
export function ColorPickerTextInput({
	field,
	value,
	draft,
	isValid,
	isReadOnly,
	label,
	maxLength,
	inputMode,
	onEdit,
	onCommit,
	onDrop,
	slot,
	testId,
}: ColorPickerTextInputProps): ReactElement {
	const text = draft?.field === field ? draft.text : null;
	// An empty field is not invalid: there is nothing typed to be wrong yet.
	const isInvalid = text !== null && text !== '' && !isValid(text);

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
		if (isReadOnly) {
			return;
		}

		if (event.key === 'Enter') {
			// So `Enter` does not also submit a form the popup sits in.
			event.preventDefault();
			onCommit(true);
		} else if (event.key === 'Escape') {
			// Before the popup closes on the same key, so the blur that follows has nothing to commit.
			onDrop();
		}
	}

	return (
		<input
			type="text"
			className={styles['color-picker__field-input']}
			value={text ?? value}
			readOnly={isReadOnly}
			maxLength={maxLength}
			inputMode={inputMode}
			spellCheck={false}
			autoComplete="off"
			autoCapitalize="off"
			aria-label={label}
			aria-invalid={isInvalid || undefined}
			data-invalid={isInvalid || undefined}
			data-slot={`color-picker-${slot}`}
			data-testid={partTestId(testId, slot)}
			onChange={(event) => onEdit(field, event.currentTarget.value)}
			onBlur={() => onCommit(false)}
			onKeyDown={handleKeyDown}
		/>
	);
}

/**
 * What every field passes through to its inputs.
 *
 * @access private
 */
export type ColorPickerFieldInputProps = Pick<
	ColorPickerTextInputProps,
	'draft' | 'isReadOnly' | 'onEdit' | 'onCommit' | 'onDrop' | 'testId'
>;
