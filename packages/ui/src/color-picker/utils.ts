import {
	COLOR_PICKER_CHANNEL_MAX,
	COLOR_PICKER_LABELS,
	COLOR_PICKER_PERCENT_LARGE_STEP,
	COLOR_PICKER_PERCENT_MAX,
} from './constants.js';

const VALUE_PATTERN = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

const HEX_INPUT_PATTERN = /^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

const INTEGER_INPUT_PATTERN = /^\d{1,3}$/;

/**
 * The alpha byte of an opaque color, which the value leaves out.
 */
const OPAQUE_ALPHA_BYTE = 'ff';

/**
 * A color as the panel holds it: hue in degrees from 0 up to 360, saturation, brightness and alpha
 * in percent from 0 to 100. Fractions are kept, so a hex read into the panel writes the same hex
 * back.
 *
 * @access private
 */
export type ColorPickerHsva = {
	h: number;
	s: number;
	v: number;
	a: number;
};

/**
 * The red, green and blue channels of a color, each from 0 to 255.
 *
 * @access private
 */
export type ColorPickerRgb = {
	r: number;
	g: number;
	b: number;
};

/**
 * What the picker reads off `value`: the color as `#rrggbb` or `#rrggbbaa`, or `undefined` for no
 * color.
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

/**
 * The `#rrggbb` or `#rrggbbaa` of three, four, six or eight digits. An opaque alpha is left out, so
 * one color has one hex, and `isOpaque` drops any alpha.
 */
function toColorHex(digits: string, isOpaque: boolean): string {
	const lower = digits.toLowerCase();
	const full = lower.length <= 4 ? lower.replaceAll(/./g, '$&$&') : lower;
	const alpha = full.slice(6);

	return isOpaque || alpha === '' || alpha === OPAQUE_ALPHA_BYTE
		? `#${full.slice(0, 6)}`
		: `#${full}`;
}

/**
 * Reads `value`: `#rgb`, `#rgba`, `#rrggbb` and `#rrggbbaa` in any case. `isOpaque` drops the
 * alpha. `undefined` and `''` are no color. Anything else is invalid, and holds no color either.
 *
 * @access private
 */
export function parseColorValue(value: unknown, isOpaque: boolean): ColorPickerParsedValue {
	if (value === undefined || value === '') {
		return { hex: undefined, isInvalid: false };
	}

	const match = typeof value === 'string' ? VALUE_PATTERN.exec(value) : null;

	if (match === null) {
		return { hex: undefined, isInvalid: true };
	}

	return { hex: toColorHex(match[1], isOpaque), isInvalid: false };
}

/**
 * Reads the text of the hex field: three, four, six or eight digits, with or without a leading
 * `#`, in any case, and whether the text wrote an alpha. `isOpaque` takes three and six only.
 * `undefined` when the text is not a color.
 *
 * @access private
 */
export function parseHexInput(
	text: string,
	isOpaque: boolean,
): { hex: string; hasAlpha: boolean } | undefined {
	const match = HEX_INPUT_PATTERN.exec(text.trim());

	if (match === null) {
		return undefined;
	}

	const hasAlpha = match[1].length === 4 || match[1].length === 8;

	return isOpaque && hasAlpha ? undefined : { hex: toColorHex(match[1], isOpaque), hasAlpha };
}

/**
 * Reads the text of a channel or alpha field: a whole number from 0 to `max`. `undefined` when the
 * text is anything else.
 *
 * @access private
 */
export function parseIntegerInput(text: string, max: number): number | undefined {
	const trimmed = text.trim();

	if (!INTEGER_INPUT_PATTERN.test(trimmed)) {
		return undefined;
	}

	const value = Number(trimmed);

	return value <= max ? value : undefined;
}

/**
 * The six digits of the red, green and blue of a color, without the alpha, or an empty field for
 * no color.
 *
 * @access private
 */
export function toHexDigits(hex: string | undefined): string {
	return hex === undefined ? '' : hex.slice(1, 7);
}

/**
 * The `#rrggbb` of a color, its alpha dropped.
 *
 * @access private
 */
export function toOpaqueHex(hex: string): string {
	return hex.slice(0, 7);
}

function toHexByte(channel: number): string {
	return Math.round(clamp(channel, 0, COLOR_PICKER_CHANNEL_MAX))
		.toString(16)
		.padStart(2, '0');
}

/**
 * The alpha of a hex as its two digits, `ff` for an opaque color.
 *
 * @access private
 */
export function toAlphaDigits(hex: string): string {
	return hex.length === 9 ? hex.slice(7, 9) : OPAQUE_ALPHA_BYTE;
}

/**
 * The two digits of an alpha in percent.
 *
 * @access private
 */
export function percentToAlphaDigits(percent: number): string {
	return toHexByte((percent / COLOR_PICKER_PERCENT_MAX) * COLOR_PICKER_CHANNEL_MAX);
}

/**
 * The red, green and blue of `hex` with the alpha `alphaDigits`, the opaque alpha left out.
 *
 * @access private
 */
export function withAlphaDigits(hex: string, alphaDigits: string): string {
	return toColorHex(`${toHexDigits(hex)}${alphaDigits}`, false);
}

/**
 * The hex of a panel color, `#rrggbb` while it is opaque and `#rrggbbaa` otherwise, in lower case.
 *
 * @access private
 */
export function hsvaToHex({ h, s, v, a }: ColorPickerHsva): string {
	const saturation = s / COLOR_PICKER_PERCENT_MAX;
	const brightness = v / COLOR_PICKER_PERCENT_MAX;
	const channel = (offset: number): number => {
		const k = (offset + h / 60) % 6;

		return (
			(brightness - brightness * saturation * Math.max(0, Math.min(k, 4 - k, 1))) *
			COLOR_PICKER_CHANNEL_MAX
		);
	};

	return withAlphaDigits(
		`#${toHexByte(channel(5))}${toHexByte(channel(3))}${toHexByte(channel(1))}`,
		percentToAlphaDigits(a),
	);
}

/**
 * The red, green and blue of a hex, from 0 to 255.
 *
 * @access private
 */
export function hexToRgb(hex: string): ColorPickerRgb {
	return {
		r: Number.parseInt(hex.slice(1, 3), 16),
		g: Number.parseInt(hex.slice(3, 5), 16),
		b: Number.parseInt(hex.slice(5, 7), 16),
	};
}

/**
 * The `#rrggbb` of three channels.
 *
 * @access private
 */
export function rgbToHex({ r, g, b }: ColorPickerRgb): string {
	return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

/**
 * The panel color of a `#rrggbb` or `#rrggbbaa`. A color with no saturation or no brightness has
 * no hue, so it takes `fallbackHue`, the hue the panel already holds.
 *
 * @access private
 */
export function hexToHsva(hex: string, fallbackHue: number): ColorPickerHsva {
	const { r, g, b } = hexToRgb(hex);
	const red = r / COLOR_PICKER_CHANNEL_MAX;
	const green = g / COLOR_PICKER_CHANNEL_MAX;
	const blue = b / COLOR_PICKER_CHANNEL_MAX;
	const a =
		(Number.parseInt(toAlphaDigits(hex), 16) / COLOR_PICKER_CHANNEL_MAX) * COLOR_PICKER_PERCENT_MAX;
	const max = Math.max(red, green, blue);
	const delta = max - Math.min(red, green, blue);
	const s = max === 0 ? 0 : (delta / max) * COLOR_PICKER_PERCENT_MAX;
	const v = max * COLOR_PICKER_PERCENT_MAX;

	if (delta === 0) {
		return { h: fallbackHue, s, v, a };
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
	return { h: sector * 60, s, v, a };
}

/**
 * The `aria-valuetext` of a saturation, brightness or alpha input: `60%, #3a2a63`.
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
	hsva: ColorPickerHsva,
): { axis: ColorPickerAreaAxis; hsva: ColorPickerHsva } | undefined {
	const step = shiftKey ? COLOR_PICKER_PERCENT_LARGE_STEP : 1;
	const move = (axis: ColorPickerAreaAxis, next: number) => ({
		axis,
		hsva: { ...hsva, [axis]: clamp(next, 0, COLOR_PICKER_PERCENT_MAX) },
	});
	const s = Math.round(hsva.s);
	const v = Math.round(hsva.v);

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
			return move('v', v + COLOR_PICKER_PERCENT_LARGE_STEP);
		case 'PageDown':
			return move('v', v - COLOR_PICKER_PERCENT_LARGE_STEP);
		case 'Home':
			return move('s', 0);
		case 'End':
			return move('s', COLOR_PICKER_PERCENT_MAX);
		default:
			return undefined;
	}
}

/**
 * The value of a strip, the hue or the alpha, after a key press, or `undefined` for a key the
 * strip does not take.
 *
 * @access private
 */
export function getStripKeyChange(
	key: string,
	shiftKey: boolean,
	value: number,
	{ max, largeStep }: { max: number; largeStep: number },
): number | undefined {
	const step = shiftKey ? largeStep : 1;
	const current = Math.min(Math.round(value), max);
	// A key that leaves the step where it is keeps the value as it is, fraction included.
	const move = (next: number) => {
		const moved = clamp(next, 0, max);

		return moved === current ? value : moved;
	};

	switch (key) {
		case 'ArrowRight':
		case 'ArrowUp':
			return move(current + step);
		case 'ArrowLeft':
		case 'ArrowDown':
			return move(current - step);
		case 'PageUp':
			return move(current + largeStep);
		case 'PageDown':
			return move(current - largeStep);
		case 'Home':
			return 0;
		case 'End':
			return max;
		default:
			return undefined;
	}
}
