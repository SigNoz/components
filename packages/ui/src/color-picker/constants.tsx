/**
 * Distance between the trigger and the popup, in pixels. Base UI takes it as a number on the
 * positioner, so a token could only reach it by reading computed style on every open.
 *
 * @access private
 */
export const COLOR_PICKER_SIDE_OFFSET = 4;

/**
 * The color the panel opens at while the picker holds no color, or a value it cannot read.
 *
 * @access private
 */
export const COLOR_PICKER_EMPTY_COLOR = '#000000';

/**
 * The highest hue the strip reaches. 360 is red again, the same color as 0.
 *
 * @access private
 */
export const COLOR_PICKER_HUE_MAX = 359;

/**
 * The highest saturation and brightness, in percent.
 *
 * @access private
 */
export const COLOR_PICKER_PERCENT_MAX = 100;

/**
 * The highest value of a red, green or blue channel.
 *
 * @access private
 */
export const COLOR_PICKER_CHANNEL_MAX = 255;

/**
 * 10% of the saturation, brightness and alpha range, the same large step as `Slider`.
 *
 * @access private
 */
export const COLOR_PICKER_PERCENT_LARGE_STEP = 10;

/**
 * 10% of the hue range, rounded, the same large step as `Slider`.
 *
 * @access private
 */
export const COLOR_PICKER_HUE_LARGE_STEP = 36;

/**
 * The fixed strings of the panel. English, the same as `Slider`'s `Minimum` and `Maximum`.
 *
 * @access private
 */
export const COLOR_PICKER_LABELS = {
	saturation: 'Saturation',
	brightness: 'Brightness',
	hue: 'Hue',
	alpha: 'Alpha',
	alphaField: 'Alpha percentage',
	hex: 'Hex color',
	red: 'Red',
	green: 'Green',
	blue: 'Blue',
	format: 'Color format',
	clear: 'Clear color',
	roleDescription: '2D slider',
	noColor: 'no color',
} as const;

/**
 * The two strips under the area: the hue, in degrees, and the alpha, in percent.
 *
 * @access private
 */
export const COLOR_PICKER_STRIPS = {
	hue: {
		channel: 'h',
		max: COLOR_PICKER_HUE_MAX,
		largeStep: COLOR_PICKER_HUE_LARGE_STEP,
		label: COLOR_PICKER_LABELS.hue,
	},
	alpha: {
		channel: 'a',
		max: COLOR_PICKER_PERCENT_MAX,
		largeStep: COLOR_PICKER_PERCENT_LARGE_STEP,
		label: COLOR_PICKER_LABELS.alpha,
	},
} as const;

/**
 * The ways the panel writes the color in its fields: six hex digits, or one field per red, green
 * and blue channel. The alpha has a field of its own in both.
 *
 * @access private
 */
export const COLOR_PICKER_FORMATS = [
	{ value: 'hex', label: 'Hex' },
	{ value: 'rgb', label: 'RGB' },
] as const;

/**
 * The aria attributes the picker writes on the trigger itself, so a caller value never reaches
 * it.
 *
 * @access private
 */
export const COLOR_PICKER_OWN_ARIA_ATTRIBUTES = [
	'aria-haspopup',
	'aria-expanded',
	'aria-controls',
	'aria-disabled',
	'aria-readonly',
] as const;
