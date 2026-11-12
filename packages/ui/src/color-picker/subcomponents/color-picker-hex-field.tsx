import type { ReactElement, ReactNode } from 'react';
import styles from '../color-picker.module.scss';
import { COLOR_PICKER_LABELS } from '../constants.js';
import { parseHexInput, toHexDigits } from '../utils.js';
import {
	type ColorPickerFieldInputProps,
	ColorPickerTextInput,
} from './color-picker-text-input.js';

/**
 * Longest text the field takes with an alpha: eight digits and a leading `#`, the shape of a
 * pasted value.
 */
const HEX_FIELD_MAX_LENGTH = 9;

/**
 * Longest text the field takes without one.
 */
const OPAQUE_HEX_FIELD_MAX_LENGTH = 7;

/**
 * @access private
 */
export type ColorPickerHexFieldProps = ColorPickerFieldInputProps & {
	/** The color the panel shows, `undefined` for no color. */
	hex: string | undefined;
	isOpaque: boolean;
	/** Sits at the end of the field, outside the `<label>`: a button cannot live inside one. */
	suffix: ReactNode;
};

/**
 * The hex field: a fixed `#` and the six digits of the color. A pasted `#rrggbbaa` sets the alpha
 * too.
 *
 * @access private
 */
export function ColorPickerHexField({
	hex,
	isOpaque,
	suffix,
	...inputProps
}: ColorPickerHexFieldProps): ReactElement {
	return (
		<div className={styles['color-picker__field']}>
			<label className={styles['color-picker__field-label']}>
				<span aria-hidden="true">#</span>
				<ColorPickerTextInput
					{...inputProps}
					field="hex"
					value={toHexDigits(hex)}
					isValid={(text) => parseHexInput(text, isOpaque) !== undefined}
					label={COLOR_PICKER_LABELS.hex}
					maxLength={isOpaque ? OPAQUE_HEX_FIELD_MAX_LENGTH : HEX_FIELD_MAX_LENGTH}
					inputMode="text"
					slot="hex"
				/>
			</label>
			{suffix}
		</div>
	);
}
