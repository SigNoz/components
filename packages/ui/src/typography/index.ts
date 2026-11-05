// #region css-tokens
/**
 * CSS Tokens for typography
 * Prefix: `--typography-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--typography-align-items` | `var(--typography-internal-align-items)` |
 * | `--typography-archive` | `-` |
 * | `--typography-archive-color` | `var(--typography-archive)` |
 * | `--typography-box-sizing` | `border-box` |
 * | `--typography-clamp-box-orient` | `vertical` |
 * | `--typography-clamp-display` | `var(--typography-internal-clamp-display, -webki...` |
 * | `--typography-color` | `var(--typography-internal-color, inherit)` |
 * | `--typography-danger` | `-` |
 * | `--typography-danger-color` | `var(--typography-danger)` |
 * | `--typography-display` | `var(--typography-internal-display)` |
 * | `--typography-font-family` | `var(--typography-internal-font-family)` |
 * | `--typography-font-feature-settings` | `'ss01' 1` |
 * | `--typography-font-size` | `var(--typography-internal-font-size)` |
 * | `--typography-font-variant-numeric` | `var(--typography-internal-font-variant-numeric,...` |
 * | `--typography-font-weight` | `var(--typography-internal-font-weight)` |
 * | `--typography-gap` | `var(--typography-internal-gap, 0)` |
 * | `--typography-highlight-danger` | `-` |
 * | `--typography-highlight-danger-color` | `var(--typography-highlight-danger)` |
 * | `--typography-info` | `-` |
 * | `--typography-info-color` | `var(--typography-info)` |
 * | `--typography-item-flex-shrink` | `0` |
 * | `--typography-justify-content` | `var(--typography-internal-justify-content, normal)` |
 * | `--typography-letter-spacing` | `var(--typography-internal-letter-spacing)` |
 * | `--typography-line-height` | `var(--typography-internal-line-height)` |
 * | `--typography-link` | `-` |
 * | `--typography-link-border-radius` | `var(--radius-1)` |
 * | `--typography-link-color` | `var(--typography-link)` |
 * | `--typography-link-cursor` | `pointer` |
 * | `--typography-link-focus-visible-outline` | `var(--ring) solid 1px` |
 * | `--typography-link-focus-visible-outline-offset` | `1px` |
 * | `--typography-link-hover-text-decoration-line` | `underline` |
 * | `--typography-link-text-decoration-line` | `none` |
 * | `--typography-main` | `-` |
 * | `--typography-main-color` | `var(--typography-main)` |
 * | `--typography-margin` | `var(--typography-internal-margin, 0)` |
 * | `--typography-max-width` | `var(--typography-internal-max-width, 100%)` |
 * | `--typography-min-width` | `var(--typography-internal-min-width, var(--typo...` |
 * | `--typography-nested-text-align` | `start` |
 * | `--typography-overflow` | `var(--typography-internal-overflow)` |
 * | `--typography-overflow-wrap` | `var(--typography-internal-overflow-wrap)` |
 * | `--typography-padding` | `var(--typography-internal-padding, 0)` |
 * | `--typography-primary` | `-` |
 * | `--typography-primary-color` | `var(--typography-primary)` |
 * | `--typography-secondary` | `-` |
 * | `--typography-secondary-color` | `var(--typography-secondary)` |
 * | `--typography-success` | `-` |
 * | `--typography-success-color` | `var(--typography-success)` |
 * | `--typography-tertiary` | `-` |
 * | `--typography-tertiary-color` | `var(--typography-tertiary)` |
 * | `--typography-text-align` | `var(--typography-internal-text-align)` |
 * | `--typography-text-min-width` | `0` |
 * | `--typography-text-overflow` | `var(--typography-internal-text-overflow)` |
 * | `--typography-text-transform` | `var(--typography-internal-text-transform)` |
 * | `--typography-tooltip-max-width` | `20rem` |
 * | `--typography-tooltip-overflow-wrap` | `anywhere` |
 * | `--typography-warning` | `-` |
 * | `--typography-warning-color` | `var(--typography-warning)` |
 * | `--typography-white-space` | `var(--typography-internal-white-space)` |
 * | `--typography-width` | `var(--typography-internal-width, auto)` |
 */
// #endregion css-tokens

export {
	TypographyAlign,
	TypographyColor,
	TypographyDisplay,
	TypographyElement,
	TypographySize,
	TypographySpacing,
	TypographyTextOverflow,
	TypographyVariant,
	TypographyVerticalAlign,
	TypographyWeight,
} from './constants.js';
export type * from './types.js';
export { Typography } from './typography.js';
