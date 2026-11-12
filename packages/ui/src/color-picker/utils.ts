import {
	COLOR_PICKER_AREA_LARGE_STEP,
	COLOR_PICKER_HUE_LARGE_STEP,
	COLOR_PICKER_HUE_MAX,
	COLOR_PICKER_LABELS,
	COLOR_PICKER_PERCENT_MAX,
} from './constants.js';

const VALUE_PATTERN = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

const HEX_INPUT_PATTERN = /^#?([\da-f]{3}|[\da-f]{6})$/i;

/**
 * A color as the panel holds it: hue in degrees from 0 up to 360, saturation and brightness in
 * percent from 0 to 100. Fractions are kept, so a hex read into the panel writes the same hex
 * back.
 *
 * @access private
 */
export type ColorPickerHsv = {
	h: number;
	s: number;
	v: number;
};

/**
 * What the picker reads off `value`: the color as `#rrggbb`, or `undefined` for no color.
 *
 * @access private
 */
export type ColorPickerParsedValue = {
	hex: string | undefined;
	isInvalid: boolean;
};

/**
 * @access private
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function expandShortHex(digits: string): string {
	return digits.length === 3 || digits.length === 4
		? digits.slice(0, 3).replaceAll(/./g, '$&$&')
		: digits.slice(0, 6);
}

/**
 * Reads `value`: `#rgb`, `#rgba`, `#rrggbb` and `#rrggbbaa` in any case, with the alpha dropped.
 * `undefined` and `''` are no color. Anything else is invalid, and holds no color either.
 *
 * @access private
 */
export function parseColorValue(value: unknown): ColorPickerParsedValue {
	if (value === undefined || value === '') {
		return { hex: undefined, isInvalid: false };
	}

	const match = typeof value === 'string' ? VALUE_PATTERN.exec(value) : null;

	if (match === null) {
		return { hex: undefined, isInvalid: true };
	}

	return { hex: `#${expandShortHex(match[1].toLowerCase())}`, isInvalid: false };
}

/**
 * Reads the text of the hex field: three or six digits, with or without a leading `#`, in any
 * case. `undefined` when the text is not a color.
 *
 * @access private
 */
export function parseHexInput(text: string): string | undefined {
	const match = HEX_INPUT_PATTERN.exec(text.trim());

	return match === null ? undefined : `#${expandShortHex(match[1].toLowerCase())}`;
}

/**
 * The six digits the hex field shows for a color, or an empty field for no color.
 *
 * @access private
 */
export function toHexDigits(hex: string | undefined): string {
	return hex === undefined ? '' : hex.slice(1);
}

function toHexByte(channel: number): string {
	return Math.round(clamp(channel, 0, 255))
		.toString(16)
		.padStart(2, '0');
}

/**
 * The `#rrggbb` of a panel color, in lower case.
 *
 * @access private
 */
export function hsvToHex({ h, s, v }: ColorPickerHsv): string {
	const saturation = s / COLOR_PICKER_PERCENT_MAX;
	const brightness = v / COLOR_PICKER_PERCENT_MAX;
	const channel = (offset: number): number => {
		const k = (offset + h / 60) % 6;

		return (brightness - brightness * saturation * Math.max(0, Math.min(k, 4 - k, 1))) * 255;
	};

	return `#${toHexByte(channel(5))}${toHexByte(channel(3))}${toHexByte(channel(1))}`;
}

/**
 * The panel color of a `#rrggbb`. A color with no saturation or no brightness has no hue, so it
 * takes `fallbackHue`, the hue the panel already holds.
 *
 * @access private
 */
export function hexToHsv(hex: string, fallbackHue: number): ColorPickerHsv {
	const red = Number.parseInt(hex.slice(1, 3), 16) / 255;
	const green = Number.parseInt(hex.slice(3, 5), 16) / 255;
	const blue = Number.parseInt(hex.slice(5, 7), 16) / 255;
	const max = Math.max(red, green, blue);
	const delta = max - Math.min(red, green, blue);
	const s = max === 0 ? 0 : (delta / max) * COLOR_PICKER_PERCENT_MAX;
	const v = max * COLOR_PICKER_PERCENT_MAX;

	if (delta === 0) {
		return { h: fallbackHue, s, v };
	}

	let sector: number;

	if (max === red) {
		sector = ((green - blue) / delta + 6) % 6;
	} else if (max === green) {
		sector = (blue - red) / delta + 2;
	} else {
		sector = (red - green) / delta + 4;
	}

	// Not clamped to the strip's last step: a hue between 359 and 360 is a real color, `#ff0001`
	// among them, and clamping it would change the color on a key that moves nothing.
	return { h: sector * 60, s, v };
}

/**
 * The `aria-valuetext` of a saturation or brightness input: `60%, #3a2a63`.
 *
 * @access private
 */
export function formatPercentValueText(percent: number, hex: string | undefined): string {
	return `${percent}%, ${hex ?? COLOR_PICKER_LABELS.noColor}`;
}

/**
 * The `aria-valuetext` of the hue input: `255 degrees, #3a2a63`.
 *
 * @access private
 */
export function formatHueValueText(degrees: number, hex: string | undefined): string {
	return `${degrees} degrees, ${hex ?? COLOR_PICKER_LABELS.noColor}`;
}

/**
 * Where a pointer sits over an element, as a fraction of its width and height from the top
 * left, clamped to the element.
 *
 * @access private
 */
export function readPointerFraction(
	event: { clientX: number; clientY: number },
	element: Element,
): { x: number; y: number } {
	const rect = element.getBoundingClientRect();

	return {
		x: rect.width > 0 ? clamp((event.clientX - rect.left) / rect.width, 0, 1) : 0,
		y: rect.height > 0 ? clamp((event.clientY - rect.top) / rect.height, 0, 1) : 0,
	};
}

/**
 * Keeps the pointer events of a drag on `element` after the pointer leaves it. A pointer the
 * browser no longer tracks, such as one a test dispatched by hand, throws, and the drag then runs
 * on the events that still reach the element.
 *
 * @access private
 */
export function capturePointer(element: Element, pointerId: number): void {
	try {
		element.setPointerCapture(pointerId);
	} catch {}
}

/**
 * The axis of the area a key moves: saturation for the horizontal keys, brightness for the
 * vertical ones.
 *
 * @access private
 */
export type ColorPickerAreaAxis = 's' | 'v';

/**
 * The panel color after a key press on the area, and the axis it moved, or `undefined` for a key
 * the area does not take.
 *
 * @access private
 */
export function getAreaKeyChange(
	key: string,
	shiftKey: boolean,
	hsv: ColorPickerHsv,
): { axis: ColorPickerAreaAxis; hsv: ColorPickerHsv } | undefined {
	const step = shiftKey ? COLOR_PICKER_AREA_LARGE_STEP : 1;
	const move = (axis: ColorPickerAreaAxis, next: number) => ({
		axis,
		hsv: { ...hsv, [axis]: clamp(next, 0, COLOR_PICKER_PERCENT_MAX) },
	});
	const s = Math.round(hsv.s);
	const v = Math.round(hsv.v);

	switch (key) {
		case 'ArrowRight':
			return move('s', s + step);
		case 'ArrowLeft':
			return move('s', s - step);
		case 'ArrowUp':
			return move('v', v + step);
		case 'ArrowDown':
			return move('v', v - step);
		case 'PageUp':
			return move('v', v + COLOR_PICKER_AREA_LARGE_STEP);
		case 'PageDown':
			return move('v', v - COLOR_PICKER_AREA_LARGE_STEP);
		case 'Home':
			return move('s', 0);
		case 'End':
			return move('s', COLOR_PICKER_PERCENT_MAX);
		default:
			return undefined;
	}
}

/**
 * The hue after a key press on the hue strip, or `undefined` for a key the strip does not take.
 *
 * @access private
 */
export function getHueKeyChange(key: string, shiftKey: boolean, hue: number): number | undefined {
	const step = shiftKey ? COLOR_PICKER_HUE_LARGE_STEP : 1;
	const h = Math.min(Math.round(hue), COLOR_PICKER_HUE_MAX);
	// A key that leaves the step where it is keeps the hue as it is, fraction included.
	const move = (next: number) => {
		const moved = clamp(next, 0, COLOR_PICKER_HUE_MAX);

		return moved === h ? hue : moved;
	};

	switch (key) {
		case 'ArrowRight':
		case 'ArrowUp':
			return move(h + step);
		case 'ArrowLeft':
		case 'ArrowDown':
			return move(h - step);
		case 'PageUp':
			return move(h + COLOR_PICKER_HUE_LARGE_STEP);
		case 'PageDown':
			return move(h - COLOR_PICKER_HUE_LARGE_STEP);
		case 'Home':
			return 0;
		case 'End':
			return COLOR_PICKER_HUE_MAX;
		default:
			return undefined;
	}
}
