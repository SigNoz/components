import type { KeyboardEvent, ReactElement, ReactNode } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../color-picker.module.scss';
import { COLOR_PICKER_LABELS } from '../constants.js';
import { parseHexInput } from '../utils.js';

/**
 * Longest text the field takes: six digits and a leading `#`, the shape of a pasted value.
 */
const HEX_FIELD_MAX_LENGTH = 7;

/**
 * @access private
 */
export type ColorPickerHexFieldProps = {
	/** The text being edited, `null` while the field follows the panel. */
	text: string | null;
	/** The six digits of the color the panel shows, empty for no color. */
	digits: string;
	isReadOnly: boolean;
	onEdit: (text: string) => void;
	onCommit: (keepEditing: boolean) => void;
	onDrop: () => void;
	/** Sits at the end of the field, outside the `<label>`: a button cannot live inside one. */
	suffix: ReactNode;
	testId: string | undefined;
};

/**
 * The hex field: a fixed `#` and the six digits of the color. It commits on `Enter` and on blur,
 * never while typing.
 *
 * @access private
 */
export function ColorPickerHexField({
	text,
	digits,
	isReadOnly,
	onEdit,
	onCommit,
	onDrop,
	suffix,
	testId,
}: ColorPickerHexFieldProps): ReactElement {
	// An empty field is not invalid: there is nothing typed to be wrong yet.
	const isInvalid = text !== null && text !== '' && parseHexInput(text) === undefined;

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
		<div className={styles['color-picker__hex-field']}>
			<label className={styles['color-picker__hex-label']}>
				<span aria-hidden="true">#</span>
				<input
					type="text"
					className={styles['color-picker__hex-input']}
					value={text ?? digits}
					readOnly={isReadOnly}
					maxLength={HEX_FIELD_MAX_LENGTH}
					spellCheck={false}
					autoComplete="off"
					autoCapitalize="off"
					aria-label={COLOR_PICKER_LABELS.hex}
					aria-invalid={isInvalid || undefined}
					data-invalid={isInvalid || undefined}
					data-slot="color-picker-hex"
					data-testid={partTestId(testId, 'hex')}
					onChange={(event) => onEdit(event.currentTarget.value)}
					onBlur={() => onCommit(false)}
					onKeyDown={handleKeyDown}
				/>
			</label>
			{suffix}
		</div>
	);
}
