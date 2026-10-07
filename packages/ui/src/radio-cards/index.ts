// #region css-tokens
/**
 * CSS Tokens for radio-cards
 * Prefix: `--radio-cards-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--radio-cards-background` | `-` |
 * | `--radio-cards-background-color` | `var(--radio-cards-background)` |
 * | `--radio-cards-background-hover` | `-` |
 * | `--radio-cards-border` | `-` |
 * | `--radio-cards-border-color` | `var(--radio-cards-border)` |
 * | `--radio-cards-check-delay` | `var(--radio-cards-internal-check-duration)` |
 * | `--radio-cards-check-duration` | `120ms` |
 * | `--radio-cards-check-easing` | `cubic-bezier(0.65, 0, 0.35, 1)` |
 * | `--radio-cards-check-flex-shrink` | `0` |
 * | `--radio-cards-check-opacity` | `1` |
 * | `--radio-cards-check-transform` | `translateY(0)` |
 * | `--radio-cards-check-transition-property` | `opacity, transform` |
 * | `--radio-cards-check-travel` | `6px` |
 * | `--radio-cards-check-unchecked-opacity` | `0` |
 * | `--radio-cards-check-unchecked-transform` | `translateY(var(--radio-cards-internal-check-tra...` |
 * | `--radio-cards-check-unchecked-transition-delay` | `0s` |
 * | `--radio-cards-checked-background` | `-` |
 * | `--radio-cards-checked-background-color` | `var(--radio-cards-checked-background)` |
 * | `--radio-cards-checked-border` | `-` |
 * | `--radio-cards-checked-border-color` | `var(--radio-cards-checked-border)` |
 * | `--radio-cards-checked-icon` | `-` |
 * | `--radio-cards-checked-icon-color` | `var(--radio-cards-checked-icon)` |
 * | `--radio-cards-checked-label` | `-` |
 * | `--radio-cards-checked-label-color` | `var(--radio-cards-checked-label)` |
 * | `--radio-cards-column-min-size` | `10rem` |
 * | `--radio-cards-columns-grid-template-columns` | `repeat(auto-fill, minmax(min(100%, max(var(--ra...` |
 * | `--radio-cards-display` | `grid` |
 * | `--radio-cards-ellipsis-label-text-overflow` | `ellipsis` |
 * | `--radio-cards-focus-ring` | `-` |
 * | `--radio-cards-gap` | `var(--spacing-6)` |
 * | `--radio-cards-grid-template-columns` | `repeat(auto-fill, minmax(min(100%, var(--radio-...` |
 * | `--radio-cards-hover-background-color` | `var(--radio-cards-background-hover)` |
 * | `--radio-cards-hover-icon-color` | `var(--radio-cards-icon-hover)` |
 * | `--radio-cards-hover-label-color` | `var(--radio-cards-label-hover)` |
 * | `--radio-cards-icon` | `-` |
 * | `--radio-cards-icon-align-items` | `center` |
 * | `--radio-cards-icon-color` | `var(--radio-cards-icon)` |
 * | `--radio-cards-icon-display` | `inline-flex` |
 * | `--radio-cards-icon-flex-shrink` | `0` |
 * | `--radio-cards-icon-hover` | `-` |
 * | `--radio-cards-icon-justify-content` | `center` |
 * | `--radio-cards-icon-size` | `12px` |
 * | `--radio-cards-indicator-inline-size` | `var(--radio-cards-internal-icon-size)` |
 * | `--radio-cards-indicator-overflow` | `visible` |
 * | `--radio-cards-indicator-transition-delay` | `0s` |
 * | `--radio-cards-indicator-transition-property` | `inline-size, margin-inline-start` |
 * | `--radio-cards-indicator-unchecked-inline-size` | `0` |
 * | `--radio-cards-indicator-unchecked-overflow` | `hidden` |
 * | `--radio-cards-inline-size` | `100%` |
 * | `--radio-cards-item-align-items` | `flex-start` |
 * | `--radio-cards-item-border-radius` | `var(--radius-1)` |
 * | `--radio-cards-item-border-style` | `solid` |
 * | `--radio-cards-item-border-width` | `1px` |
 * | `--radio-cards-item-box-sizing` | `border-box` |
 * | `--radio-cards-item-cursor` | `pointer` |
 * | `--radio-cards-item-disabled-cursor` | `not-allowed` |
 * | `--radio-cards-item-disabled-opacity` | `0.6` |
 * | `--radio-cards-item-display` | `flex` |
 * | `--radio-cards-item-focus-visible-outline-color` | `var(--radio-cards-focus-ring)` |
 * | `--radio-cards-item-focus-visible-outline-offset` | `1px` |
 * | `--radio-cards-item-focus-visible-outline-style` | `solid` |
 * | `--radio-cards-item-focus-visible-outline-width` | `1px` |
 * | `--radio-cards-item-gap` | `var(--spacing-4)` |
 * | `--radio-cards-item-min-inline-size` | `0` |
 * | `--radio-cards-item-padding-block` | `calc(var(--spacing-3) - var(--radio-cards-inter...` |
 * | `--radio-cards-item-padding-inline` | `calc(var(--spacing-6) - var(--radio-cards-inter...` |
 * | `--radio-cards-item-readonly-cursor` | `not-allowed` |
 * | `--radio-cards-item-readonly-opacity` | `0.8` |
 * | `--radio-cards-item-transition-duration` | `150ms` |
 * | `--radio-cards-item-transition-property` | `background-color, border-color, color` |
 * | `--radio-cards-item-transition-timing-function` | `ease` |
 * | `--radio-cards-item-user-select` | `none` |
 * | `--radio-cards-label` | `-` |
 * | `--radio-cards-label-color` | `var(--radio-cards-label)` |
 * | `--radio-cards-label-flex-grow` | `1` |
 * | `--radio-cards-label-font-size` | `var(--periscope-font-size-base)` |
 * | `--radio-cards-label-font-variant-numeric` | `slashed-zero` |
 * | `--radio-cards-label-font-weight` | `var(--font-weight-medium)` |
 * | `--radio-cards-label-hover` | `-` |
 * | `--radio-cards-label-letter-spacing` | `-0.005em` |
 * | `--radio-cards-label-line-height` | `var(--periscope-line-height-base)` |
 * | `--radio-cards-label-min-inline-size` | `0` |
 * | `--radio-cards-label-overflow` | `hidden` |
 * | `--radio-cards-label-transition-duration` | `150ms` |
 * | `--radio-cards-label-transition-property` | `color` |
 * | `--radio-cards-label-transition-timing-function` | `ease` |
 * | `--radio-cards-label-white-space` | `nowrap` |
 * | `--radio-cards-tooltip-max-inline-size` | `20rem` |
 * | `--radio-cards-wrap-label-overflow-wrap` | `anywhere` |
 * | `--radio-cards-wrap-label-white-space` | `normal` |
 */
// #endregion css-tokens

export { RadioCards } from './radio-cards.js';
export { RadioCardsTextOverflow } from './constants.js';
export type {
	RadioCardsClearType,
	RadioCardsDisableType,
	RadioCardsItemType,
	RadioCardsMultipleProps,
	RadioCardsProps,
	RadioCardsReadOnlyType,
	RadioCardsTextOverflowType,
	ValidateRadioCardsProps,
} from './types.js';
