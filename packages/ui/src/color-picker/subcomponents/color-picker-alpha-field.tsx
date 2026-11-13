import type { ReactElement } from 'react';
import styles from '../color-picker.module.scss';
import { COLOR_PICKER_LABELS, COLOR_PICKER_PERCENT_MAX } from '../constants.js';
import { parseIntegerInput } from '../utils.js';
import {
	type ColorPickerFieldInputProps,
	ColorPickerTextInput,
} from './color-picker-text-input.js';

/**
 * Three digits, the most `100` takes.
 */
const ALPHA_MAX_LENGTH = 3;

function isAlpha(text: string): boolean {
	return parseIntegerInput(text, COLOR_PICKER_PERCENT_MAX) !== undefined;
}

/**
 * @access private
 */
export type ColorPickerAlphaFieldProps = ColorPickerFieldInputProps & {
	/** The alpha the panel shows, in percent, `undefined` for no color. */
	alpha: number | undefined;
};

/**
 * The alpha of the color as a whole percent, from 0 to 100.
 *
 * @access private
 */
export function ColorPickerAlphaField({
	alpha,
	...inputProps
}: ColorPickerAlphaFieldProps): ReactElement {
	return (
		<div className={styles['color-picker__field']} data-field="alpha">
			<label className={styles['color-picker__field-label']}>
				<ColorPickerTextInput
					{...inputProps}
					field="a"
					value={alpha === undefined ? '' : String(Math.round(alpha))}
					isValid={isAlpha}
					label={COLOR_PICKER_LABELS.alphaField}
					maxLength={ALPHA_MAX_LENGTH}
					inputMode="numeric"
					slot="alpha-input"
				/>
				<span aria-hidden="true">%</span>
			</label>
		</div>
	);
}
