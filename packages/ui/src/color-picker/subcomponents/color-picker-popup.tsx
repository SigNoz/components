import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { type CSSProperties, type ReactElement, useRef } from 'react';
import { partTestId } from '../../lib/utils.js';
import { ToggleGroup } from '../../toggle-group/toggle-group.js';
import styles from '../color-picker.module.scss';
import {
	COLOR_PICKER_EMPTY_COLOR,
	COLOR_PICKER_FORMATS,
	COLOR_PICKER_HUE_MAX,
	COLOR_PICKER_LABELS,
	COLOR_PICKER_PERCENT_MAX,
} from '../constants.js';
import type { ColorPickerFormat, ColorPickerProps } from '../types.js';
import type { ColorPickerState } from '../use-color-picker-state.js';
import { hsvaToHex, toOpaqueHex } from '../utils.js';
import { ColorPickerAlphaField } from './color-picker-alpha-field.js';
import { ColorPickerArea } from './color-picker-area.js';
import { ColorPickerClearButton } from './color-picker-clear-button.js';
import { ColorPickerFooter } from './color-picker-footer.js';
import { ColorPickerHexField } from './color-picker-hex-field.js';
import { ColorPickerPreview } from './color-picker-preview.js';
import { ColorPickerRgbField } from './color-picker-rgb-field.js';
import { ColorPickerStrip } from './color-picker-strip.js';

/**
 * @access private
 */
export type ColorPickerPopupProps = {
	popupId: string;
	triggerId: string;
	state: ColorPickerState;
	isReadOnly: boolean;
	isOpaque: boolean;
	format: ColorPickerFormat;
	onFormatChange: (format: ColorPickerFormat) => void;
	canClear: boolean;
	onClear: () => void;
	footer: ColorPickerProps['footer'];
	testId: string | undefined;
};

/**
 * The panel: the area, the hue and alpha strips next to the preview, the format switch, the color
 * field with the clear button at its end next to the alpha field, and the footer. Base UI makes it
 * a `role="dialog"`, named here by the trigger.
 *
 * @access private
 */
export function ColorPickerPopup({
	popupId,
	triggerId,
	state,
	isReadOnly,
	isOpaque,
	format,
	onFormatChange,
	canClear,
	onClear,
	footer,
	testId,
}: ColorPickerPopupProps): ReactElement {
	const saturationRef = useRef<HTMLInputElement>(null);
	const { panelHsva, panelHex } = state;
	const shownColor = panelHex ?? COLOR_PICKER_EMPTY_COLOR;

	const style = {
		'--color-picker-internal-color': shownColor,
		'--color-picker-internal-opaque-color': toOpaqueHex(shownColor),
		'--color-picker-internal-hue-color': hsvaToHex({
			h: panelHsva.h,
			s: COLOR_PICKER_PERCENT_MAX,
			v: COLOR_PICKER_PERCENT_MAX,
			a: COLOR_PICKER_PERCENT_MAX,
		}),
		'--color-picker-internal-saturation': `${panelHsva.s}%`,
		'--color-picker-internal-brightness-offset': `${COLOR_PICKER_PERCENT_MAX - panelHsva.v}%`,
		'--color-picker-internal-hue-position': `${(Math.min(panelHsva.h, COLOR_PICKER_HUE_MAX) / COLOR_PICKER_HUE_MAX) * 100}%`,
		'--color-picker-internal-alpha-position': `${panelHsva.a}%`,
	} as CSSProperties;

	const stripProps = {
		hsva: panelHsva,
		hex: panelHex,
		isReadOnly,
		onChange: state.setColor,
		onDragStart: state.startDrag,
		onDragMove: state.moveDrag,
		onDragEnd: state.endDrag,
		testId,
	};

	const fieldProps = {
		draft: state.draft,
		isReadOnly,
		onEdit: state.editText,
		onCommit: state.commitDraft,
		onDrop: state.dropDraft,
		testId,
	};

	const clearButton = canClear && <ColorPickerClearButton onClear={onClear} testId={testId} />;

	return (
		<PopoverPrimitive.Popup
			id={popupId}
			initialFocus={saturationRef}
			aria-labelledby={triggerId}
			data-slot="color-picker-popup"
			data-testid={partTestId(testId, 'popup')}
			data-readonly={isReadOnly || undefined}
			data-dragging={state.isDragging || undefined}
			data-opaque={isOpaque || undefined}
			className={styles['color-picker']}
			style={style}
		>
			<ColorPickerArea
				hsva={panelHsva}
				hex={panelHex}
				isReadOnly={isReadOnly}
				saturationRef={saturationRef}
				onChange={state.setColor}
				onDragStart={state.startDrag}
				onDragMove={state.moveDrag}
				onDragEnd={state.endDrag}
				testId={testId}
			/>
			<div className={styles['color-picker__strips-row']}>
				<div className={styles['color-picker__strips']}>
					<ColorPickerStrip {...stripProps} kind="hue" />
					{!isOpaque && <ColorPickerStrip {...stripProps} kind="alpha" />}
				</div>
				<ColorPickerPreview isEmpty={panelHex === undefined} testId={testId} />
			</div>
			{/* The group names the switch: `ToggleGroup` writes `aria-label` on a root with no role. */}
			<div role="group" aria-label={COLOR_PICKER_LABELS.format} data-slot="color-picker-format">
				<ToggleGroup
					type="single"
					variant="outlined"
					color="secondary"
					size="sm"
					items={[...COLOR_PICKER_FORMATS]}
					value={format}
					onChange={(next) => {
						// The bar keeps a button pressed, so the value is always one of the formats.
						onFormatChange(next as ColorPickerFormat);
					}}
					testId={partTestId(testId, 'format')}
				/>
			</div>
			<div className={styles['color-picker__fields']}>
				{format === 'rgb' ? (
					<ColorPickerRgbField {...fieldProps} hex={panelHex} suffix={clearButton} />
				) : (
					<ColorPickerHexField
						{...fieldProps}
						hex={panelHex}
						isOpaque={isOpaque}
						suffix={clearButton}
					/>
				)}
				{!isOpaque && (
					<ColorPickerAlphaField
						{...fieldProps}
						alpha={panelHex === undefined ? undefined : panelHsva.a}
					/>
				)}
			</div>
			{footer !== undefined && (
				<ColorPickerFooter testId={testId}>{footer(shownColor)}</ColorPickerFooter>
			)}
		</PopoverPrimitive.Popup>
	);
}
