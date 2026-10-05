/**
 * The color of the fill, the thumb border and the mark dots. The same hues as `Badge`.
 */
export const SliderColor = {
	Primary: 'primary',
	Secondary: 'secondary',
	Success: 'success',
	Danger: 'danger',
	Warning: 'warning',
	Info: 'info',
	Archive: 'archive',
	HighlightDanger: 'highlight-danger',
} as const;

/**
 * How a mark label behaves when it does not fit the room it has.
 */
export const SliderTextOverflow = {
	Ellipsis: 'ellipsis',
	Wrap: 'wrap',
} as const;

/**
 * The thumb indexes `Slider` renders.
 *
 * @access private
 */
export const SLIDER_SINGLE_THUMBS = [0];

/**
 * The thumb indexes `Slider.Range` renders, the lower bound first.
 *
 * @access private
 */
export const SLIDER_RANGE_THUMBS = [0, 1];

/**
 * The accessible names of the `Slider.Range` thumbs, in thumb order.
 *
 * @access private
 */
export const SLIDER_RANGE_THUMB_LABELS = ['Minimum', 'Maximum'];

/**
 * The aria attributes the slider writes itself, so a caller value never reaches the input.
 *
 * @access private
 */
export const SLIDER_OWN_ARIA_ATTRIBUTES = [
	'aria-valuenow',
	'aria-valuemin',
	'aria-valuemax',
	'aria-valuetext',
	'aria-orientation',
	'aria-readonly',
	'aria-disabled',
] as const;
