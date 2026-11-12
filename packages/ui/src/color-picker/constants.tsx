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
 * 10% of the saturation and brightness range, the same large step as `Slider`.
 *
 * @access private
 */
export const COLOR_PICKER_AREA_LARGE_STEP = 10;

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
	hex: 'Hex color',
	clear: 'Clear color',
	roleDescription: '2D slider',
	noColor: 'no color',
} as const;

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
