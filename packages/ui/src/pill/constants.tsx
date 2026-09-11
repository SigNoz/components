import { BadgeColor, BadgeTextOverflow } from '../badge/constants.js';

/**
 * `Pill` has a single visual treatment, the outlined tint. The prop stays for API parity with
 * `Badge` (and so call sites keep saying which appearance they want) but `solid` is gone.
 */
export const PillVariant = {
	Outlined: 'outlined',
} as const;

/**
 * The same palette as `Badge`, under the `Pill` name so call sites type a pill without reaching
 * into `Badge`.
 */
export const PillColor = BadgeColor;

/**
 * The same overflow handling as `Badge`, under the `Pill` name.
 */
export const PillTextOverflow = BadgeTextOverflow;

/**
 * A pill carries content the user picked or typed, so it keeps the case it was written in.
 * `uppercase` is deliberately missing: the design spec forbids an uppercase pill.
 */
export const PillTextTransform = {
	None: 'none',
	Capitalize: 'capitalize',
	Lowercase: 'lowercase',
} as const;
