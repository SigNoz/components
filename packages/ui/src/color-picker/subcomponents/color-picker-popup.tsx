import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { type CSSProperties, type ReactElement, useRef } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../color-picker.module.scss';
import {
	COLOR_PICKER_EMPTY_COLOR,
	COLOR_PICKER_HUE_MAX,
	COLOR_PICKER_PERCENT_MAX,
} from '../constants.js';
import type { ColorPickerProps } from '../types.js';
import type { ColorPickerState } from '../use-color-picker-state.js';
import { hsvToHex, toHexDigits } from '../utils.js';
import { ColorPickerArea } from './color-picker-area.js';
import { ColorPickerClearButton } from './color-picker-clear-button.js';
import { ColorPickerFooter } from './color-picker-footer.js';
import { ColorPickerHexField } from './color-picker-hex-field.js';
import { ColorPickerHue } from './color-picker-hue.js';
import { ColorPickerPreview } from './color-picker-preview.js';

/**
 * @access private
 */
export type ColorPickerPopupProps = {
	popupId: string;
	triggerId: string;
	state: ColorPickerState;
	isReadOnly: boolean;
	canClear: boolean;
	onClear: () => void;
	footer: ColorPickerProps['footer'];
	testId: string | undefined;
};

/**
 * The panel: the area, the hue strip next to the preview, the hex field with the clear button at
 * its end, and the footer. Base UI makes it a `role="dialog"`, named here by the trigger.
 *
 * @access private
 */
export function ColorPickerPopup({
	popupId,
	triggerId,
	state,
	isReadOnly,
	canClear,
	onClear,
	footer,
	testId,
}: ColorPickerPopupProps): ReactElement {
	const saturationRef = useRef<HTMLInputElement>(null);
	const { panelHsv, panelHex } = state;
	const shownColor = panelHex ?? COLOR_PICKER_EMPTY_COLOR;

	const style = {
		'--color-picker-internal-color': shownColor,
		'--color-picker-internal-hue-color': hsvToHex({
			h: panelHsv.h,
			s: COLOR_PICKER_PERCENT_MAX,
			v: COLOR_PICKER_PERCENT_MAX,
		}),
		'--color-picker-internal-saturation': `${panelHsv.s}%`,
		'--color-picker-internal-brightness-offset': `${COLOR_PICKER_PERCENT_MAX - panelHsv.v}%`,
		'--color-picker-internal-hue-position': `${(Math.min(panelHsv.h, COLOR_PICKER_HUE_MAX) / COLOR_PICKER_HUE_MAX) * 100}%`,
	} as CSSProperties;

	return (
		<PopoverPrimitive.Popup
			id={popupId}
			initialFocus={saturationRef}
			aria-labelledby={triggerId}
			data-slot="color-picker-popup"
			data-testid={partTestId(testId, 'popup')}
			data-readonly={isReadOnly || undefined}
			data-dragging={state.isDragging || undefined}
			className={styles['color-picker']}
			style={style}
		>
			<ColorPickerArea
				hsv={panelHsv}
				hex={panelHex}
				isReadOnly={isReadOnly}
				saturationRef={saturationRef}
				onChange={state.setColor}
				onDragStart={state.startDrag}
				onDragMove={state.moveDrag}
				onDragEnd={state.endDrag}
				testId={testId}
			/>
			<div className={styles['color-picker__hue-row']}>
				<ColorPickerHue
					hsv={panelHsv}
					hex={panelHex}
					isReadOnly={isReadOnly}
					onChange={state.setColor}
					onDragStart={state.startDrag}
					onDragMove={state.moveDrag}
					onDragEnd={state.endDrag}
					testId={testId}
				/>
				<ColorPickerPreview isEmpty={panelHex === undefined} testId={testId} />
			</div>
			<ColorPickerHexField
				text={state.hexText}
				digits={toHexDigits(panelHex)}
				isReadOnly={isReadOnly}
				onEdit={state.editHex}
				onCommit={state.commitHexText}
				onDrop={state.dropHexText}
				suffix={canClear && <ColorPickerClearButton onClear={onClear} testId={testId} />}
				testId={testId}
			/>
			{footer !== undefined && (
				<ColorPickerFooter testId={testId}>{footer(shownColor)}</ColorPickerFooter>
			)}
		</PopoverPrimitive.Popup>
	);
}
