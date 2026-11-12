import { type KeyboardEvent, type PointerEvent, type ReactElement, useRef } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../color-picker.module.scss';
import { COLOR_PICKER_STRIPS } from '../constants.js';
import {
	type ColorPickerHsva,
	capturePointer,
	formatHueValueText,
	formatPercentValueText,
	getStripKeyChange,
	readPointerFraction,
} from '../utils.js';

/**
 * @access private
 */
export type ColorPickerStripProps = {
	kind: keyof typeof COLOR_PICKER_STRIPS;
	hsva: ColorPickerHsva;
	hex: string | undefined;
	isReadOnly: boolean;
	onChange: (hsva: ColorPickerHsva) => void;
	onDragStart: () => boolean;
	onDragMove: (change: Partial<ColorPickerHsva>) => void;
	onDragEnd: () => void;
	testId: string | undefined;
};

/**
 * A strip under the area, the hue from 0 to 359 degrees or the alpha from 0 to 100 percent: a
 * thumb, and a visually hidden range input that holds the tab stop, the keys and the value.
 *
 * @access private
 */
export function ColorPickerStrip({
	kind,
	hsva,
	hex,
	isReadOnly,
	onChange,
	onDragStart,
	onDragMove,
	onDragEnd,
	testId,
}: ColorPickerStripProps): ReactElement {
	const strip = COLOR_PICKER_STRIPS[kind];
	const inputRef = useRef<HTMLInputElement>(null);
	const pointerId = useRef<number | null>(null);
	// A hue read from a hex can sit between 359 and 360, past the last step of the strip.
	const value = Math.min(Math.round(hsva[strip.channel]), strip.max);

	// Only the channel of the strip: the rest comes from the color the panel holds when the move
	// lands, which a field draft committed by this same press may have just changed.
	function readPointer(event: PointerEvent<HTMLDivElement>): Partial<ColorPickerHsva> {
		return { [strip.channel]: readPointerFraction(event, event.currentTarget).x * strip.max };
	}

	function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
		if (isReadOnly || event.button !== 0) {
			return;
		}

		// Keeps the press from moving the focus or starting a text selection. The focus goes to the
		// input below instead, without a focus ring, since a pointer moved it.
		event.preventDefault();
		// Before the drag starts: the blur it causes can commit a field draft the drag starts from.
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

		const next = getStripKeyChange(event.key, event.shiftKey, hsva[strip.channel], strip);

		if (next === undefined) {
			return;
		}

		event.preventDefault();

		if (!isReadOnly) {
			onChange({ ...hsva, [strip.channel]: next });
		}
	}

	return (
		<div
			data-slot={`color-picker-${kind}`}
			data-testid={partTestId(testId, kind)}
			className={styles[`color-picker__${kind}`]}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerRelease}
			onPointerCancel={handlePointerRelease}
			onLostPointerCapture={handlePointerRelease}
		>
			<div
				aria-hidden="true"
				data-slot={`color-picker-${kind}-thumb`}
				data-testid={partTestId(testId, `${kind}-thumb`)}
				className={styles[`color-picker__${kind}-thumb`]}
			/>
			<input
				ref={inputRef}
				type="range"
				className={styles['color-picker__visually-hidden']}
				min={0}
				max={strip.max}
				step={1}
				value={value}
				aria-label={strip.label}
				aria-valuetext={
					kind === 'hue' ? formatHueValueText(value, hex) : formatPercentValueText(value, hex)
				}
				aria-readonly={isReadOnly || undefined}
				onKeyDown={handleKeyDown}
				onChange={(event) => {
					// A screen reader can set the value of a range input without a key press.
					if (!isReadOnly) {
						onChange({ ...hsva, [strip.channel]: event.currentTarget.valueAsNumber });
					}
				}}
			/>
		</div>
	);
}
