import { type KeyboardEvent, type PointerEvent, type ReactElement, useRef } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../color-picker.module.scss';
import { COLOR_PICKER_HUE_MAX, COLOR_PICKER_LABELS } from '../constants.js';
import {
	type ColorPickerHsv,
	capturePointer,
	formatHueValueText,
	getHueKeyChange,
	readPointerFraction,
} from '../utils.js';

/**
 * @access private
 */
export type ColorPickerHueProps = {
	hsv: ColorPickerHsv;
	hex: string | undefined;
	isReadOnly: boolean;
	onChange: (hsv: ColorPickerHsv) => void;
	onDragStart: () => boolean;
	onDragMove: (change: Partial<ColorPickerHsv>) => void;
	onDragEnd: () => void;
	testId: string | undefined;
};

/**
 * The hue strip: a thumb over the hues from 0 to 359 degrees, and a visually hidden range input
 * that holds the tab stop, the keys and the value.
 *
 * @access private
 */
export function ColorPickerHue({
	hsv,
	hex,
	isReadOnly,
	onChange,
	onDragStart,
	onDragMove,
	onDragEnd,
	testId,
}: ColorPickerHueProps): ReactElement {
	const inputRef = useRef<HTMLInputElement>(null);
	const pointerId = useRef<number | null>(null);
	// A hue read from a hex can sit between 359 and 360, past the last step of the strip.
	const hue = Math.min(Math.round(hsv.h), COLOR_PICKER_HUE_MAX);

	// Only the hue: the saturation and the brightness come from the color the panel holds when the
	// move lands, which a hex draft committed by this same press may have just changed.
	function readPointer(event: PointerEvent<HTMLDivElement>): Pick<ColorPickerHsv, 'h'> {
		return { h: readPointerFraction(event, event.currentTarget).x * COLOR_PICKER_HUE_MAX };
	}

	function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
		if (isReadOnly || event.button !== 0) {
			return;
		}

		// Keeps the press from moving the focus or starting a text selection. The focus goes to the
		// input below instead, without a focus ring, since a pointer moved it.
		event.preventDefault();
		// Before the drag starts: the blur it causes can commit a hex draft the drag starts from.
		inputRef.current?.focus({ preventScroll: true });

		if (!onDragStart()) {
			return;
		}

		capturePointer(event.currentTarget, event.pointerId);
		pointerId.current = event.pointerId;
		onDragMove(readPointer(event));
	}

	function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
		if (pointerId.current === event.pointerId) {
			onDragMove(readPointer(event));
		}
	}

	function handlePointerRelease(event: PointerEvent<HTMLDivElement>): void {
		if (pointerId.current === event.pointerId) {
			pointerId.current = null;
			onDragEnd();
		}
	}

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
		if (event.altKey || event.ctrlKey || event.metaKey) {
			return;
		}

		const h = getHueKeyChange(event.key, event.shiftKey, hsv.h);

		if (h === undefined) {
			return;
		}

		event.preventDefault();

		if (!isReadOnly) {
			onChange({ ...hsv, h });
		}
	}

	return (
		<div
			data-slot="color-picker-hue"
			data-testid={partTestId(testId, 'hue')}
			className={styles['color-picker__hue']}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerRelease}
			onPointerCancel={handlePointerRelease}
			onLostPointerCapture={handlePointerRelease}
		>
			<div
				aria-hidden="true"
				data-slot="color-picker-hue-thumb"
				data-testid={partTestId(testId, 'hue-thumb')}
				className={styles['color-picker__hue-thumb']}
			/>
			<input
				ref={inputRef}
				type="range"
				className={styles['color-picker__visually-hidden']}
				min={0}
				max={COLOR_PICKER_HUE_MAX}
				step={1}
				value={hue}
				aria-label={COLOR_PICKER_LABELS.hue}
				aria-valuetext={formatHueValueText(hue, hex)}
				aria-readonly={isReadOnly || undefined}
				onKeyDown={handleKeyDown}
				onChange={(event) => {
					// A screen reader can set the value of a range input without a key press.
					if (!isReadOnly) {
						onChange({ ...hsv, h: event.currentTarget.valueAsNumber });
					}
				}}
			/>
		</div>
	);
}
