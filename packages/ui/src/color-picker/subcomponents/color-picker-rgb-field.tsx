import type { ReactElement, ReactNode } from 'react';
import styles from '../color-picker.module.scss';
import { COLOR_PICKER_CHANNEL_MAX, COLOR_PICKER_LABELS } from '../constants.js';
import { hexToRgb, parseIntegerInput } from '../utils.js';
import {
	type ColorPickerFieldInputProps,
	ColorPickerTextInput,
} from './color-picker-text-input.js';

/**
 * The three channels, in the order the field shows them.
 */
const CHANNELS = [
	{ field: 'r', letter: 'R', label: COLOR_PICKER_LABELS.red, slot: 'red' },
	{ field: 'g', letter: 'G', label: COLOR_PICKER_LABELS.green, slot: 'green' },
	{ field: 'b', letter: 'B', label: COLOR_PICKER_LABELS.blue, slot: 'blue' },
] as const;

/**
 * Three digits, the most a channel takes.
 */
const CHANNEL_MAX_LENGTH = 3;

function isChannel(text: string): boolean {
	return parseIntegerInput(text, COLOR_PICKER_CHANNEL_MAX) !== undefined;
}

/**
 * @access private
 */
export type ColorPickerRgbFieldProps = ColorPickerFieldInputProps & {
	/** The color the panel shows, `undefined` for no color. */
	hex: string | undefined;
	/** Sits at the end of the field, outside the `<label>`s: a button cannot live inside one. */
	suffix: ReactNode;
};

/**
 * The red, green and blue of the color, from 0 to 255, in one frame. Each channel commits on its
 * own and keeps the other two and the alpha.
 *
 * @access private
 */
export function ColorPickerRgbField({
	hex,
	suffix,
	...inputProps
}: ColorPickerRgbFieldProps): ReactElement {
	const rgb = hex === undefined ? undefined : hexToRgb(hex);

	return (
		<div className={styles['color-picker__field']}>
			{CHANNELS.map((channel) => (
				<label key={channel.field} className={styles['color-picker__field-label']}>
					<span aria-hidden="true">{channel.letter}</span>
					<ColorPickerTextInput
						{...inputProps}
						field={channel.field}
						value={rgb === undefined ? '' : String(rgb[channel.field])}
						isValid={isChannel}
						label={channel.label}
						maxLength={CHANNEL_MAX_LENGTH}
						inputMode="numeric"
						slot={channel.slot}
					/>
				</label>
			))}
			{suffix}
		</div>
	);
}
