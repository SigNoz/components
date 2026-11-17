import {
	type ChangeEvent,
	type KeyboardEvent,
	type PointerEvent,
	type ReactElement,
	type RefObject,
	useRef,
	useState,
} from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../color-picker.module.scss';
import { COLOR_PICKER_LABELS, COLOR_PICKER_PERCENT_MAX } from '../constants.js';
import {
	type ColorPickerAreaAxis,
	type ColorPickerHsva,
	capturePointer,
	formatPercentValueText,
	getAreaKeyChange,
	readPointerFraction,
} from '../utils.js';

/**
 * @access private
 */
export type ColorPickerAreaProps = {
	hsva: ColorPickerHsva;
	hex: string | undefined;
	isReadOnly: boolean;
	saturationRef: RefObject<HTMLInputElement>;
	onChange: (hsva: ColorPickerHsva) => void;
	onDragStart: () => boolean;
	onDragMove: (change: Partial<ColorPickerHsva>) => void;
	onDragEnd: () => void;
	testId: string | undefined;
};

/**
 * The saturation and brightness area: a thumb over a gradient of the current hue, and two visually
 * hidden range inputs, one per axis, that share one tab stop. A key moves the focus to the input of
 * the axis it changes, so a screen reader names that axis.
 *
 * @access private
 */
export function ColorPickerArea({
	hsva,
	hex,
	isReadOnly,
	saturationRef,
	onChange,
	onDragStart,
	onDragMove,
	onDragEnd,
	testId,
}: ColorPickerAreaProps): ReactElement {
	const brightnessRef = useRef<HTMLInputElement>(null);
	const pointerId = useRef<number | null>(null);
	const [activeAxis, setActiveAxis] = useState<ColorPickerAreaAxis>('s');
	const saturation = Math.round(hsva.s);
	const brightness = Math.round(hsva.v);

	// Only the two axes under the pointer: the hue comes from the color the panel holds when the
	// move lands, which a field draft committed by this same press may have just changed.
	function readPointer(event: PointerEvent<HTMLDivElement>): Pick<ColorPickerHsva, 's' | 'v'> {
		const { x, y } = readPointerFraction(event, event.currentTarget);

		return { s: x * COLOR_PICKER_PERCENT_MAX, v: (1 - y) * COLOR_PICKER_PERCENT_MAX };
	}

	function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
		if (isReadOnly || event.button !== 0) {
			return;
		}

		// Keeps the press from moving the focus or starting a text selection. The focus goes to the
		// input below instead, without a focus ring, since a pointer moved it.
		event.preventDefault();
		// Before the drag starts: the blur it causes can commit a field draft the drag starts from.
		saturationRef.current?.focus({ preventScroll: true });

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

		const change = getAreaKeyChange(event.key, event.shiftKey, hsva);

		if (change === undefined) {
			return;
		}

		event.preventDefault();
		(change.axis === 's' ? saturationRef : brightnessRef).current?.focus();

		if (!isReadOnly) {
			onChange(change.hsva);
		}
	}

	// A screen reader can set the value of a range input without a key press.
	function handleInputChange(
		axis: ColorPickerAreaAxis,
		event: ChangeEvent<HTMLInputElement>,
	): void {
		if (!isReadOnly) {
			onChange({ ...hsva, [axis]: event.currentTarget.valueAsNumber });
		}
	}

	return (
		<div
			data-slot="color-picker-area"
			data-testid={partTestId(testId, 'area')}
			className={styles['color-picker__area']}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerRelease}
			onPointerCancel={handlePointerRelease}
			onLostPointerCapture={handlePointerRelease}
		>
			<div
				aria-hidden="true"
				data-slot="color-picker-area-thumb"
				data-testid={partTestId(testId, 'area-thumb')}
				className={styles['color-picker__area-thumb']}
			/>
			<input
				ref={saturationRef}
				type="range"
				className={styles['color-picker__visually-hidden']}
				min={0}
				max={COLOR_PICKER_PERCENT_MAX}
				step={1}
				value={saturation}
				tabIndex={activeAxis === 's' ? 0 : -1}
				aria-label={COLOR_PICKER_LABELS.saturation}
				aria-roledescription={COLOR_PICKER_LABELS.roleDescription}
				aria-valuetext={formatPercentValueText(saturation, hex)}
				aria-readonly={isReadOnly || undefined}
				onFocus={() => setActiveAxis('s')}
				onKeyDown={handleKeyDown}
				onChange={(event) => handleInputChange('s', event)}
			/>
			<input
				ref={brightnessRef}
				type="range"
				className={styles['color-picker__visually-hidden']}
				min={0}
				max={COLOR_PICKER_PERCENT_MAX}
				step={1}
				value={brightness}
				tabIndex={activeAxis === 'v' ? 0 : -1}
				aria-label={COLOR_PICKER_LABELS.brightness}
				aria-roledescription={COLOR_PICKER_LABELS.roleDescription}
				aria-orientation="vertical"
				aria-valuetext={formatPercentValueText(brightness, hex)}
				aria-readonly={isReadOnly || undefined}
				onFocus={() => setActiveAxis('v')}
				onKeyDown={handleKeyDown}
				onChange={(event) => handleInputChange('v', event)}
			/>
		</div>
	);
}
