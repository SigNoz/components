import { MarginPropNames } from '../lib/spacing.js';

export const CardTextOverflow = {
	Wrap: 'wrap',
	Ellipsis: 'ellipsis',
} as const;

export const CardSpacing = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64,
] as const;

/**
 * What the title shows when `title` is empty and the header still renders for another prop.
 *
 * An empty title is a bug rather than a state, but the header stays: the title is also the name of
 * the `headerSuffix` control, and hiding the header would drop the actions silently.
 */
export const CARD_EMPTY_TITLE = '<No title>';

/**
 * The names of the margin and padding props.
 *
 * @access private
 */
export const CardSpacingPropNames = [
	...MarginPropNames,
	'padding',
	'paddingX',
	'paddingY',
	'paddingTop',
	'paddingRight',
	'paddingBottom',
	'paddingLeft',
] as const;
