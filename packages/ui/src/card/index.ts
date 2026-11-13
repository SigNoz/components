// #region css-tokens
/**
 * CSS Tokens for card
 * Prefix: `--card-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--card-background` | `-` |
 * | `--card-background-color` | `var(--card-background)` |
 * | `--card-body-box-sizing` | `border-box` |
 * | `--card-body-display` | `flex` |
 * | `--card-body-divider-margin-left` | `calc(-1 * var(--card-internal-body-padding-left))` |
 * | `--card-body-divider-margin-right` | `calc(-1 * var(--card-internal-body-padding-right))` |
 * | `--card-body-divider-max-width` | `none` |
 * | `--card-body-divider-width` | `auto` |
 * | `--card-body-flex` | `var(--card-internal-body-flex, 1 1 auto)` |
 * | `--card-body-flex-direction` | `column` |
 * | `--card-body-flush-border-end-end-radius` | `var(--card-internal-inner-radius)` |
 * | `--card-body-flush-border-end-start-radius` | `var(--card-internal-inner-radius)` |
 * | `--card-body-flush-border-start-end-radius` | `var(--card-internal-inner-radius)` |
 * | `--card-body-flush-border-start-start-radius` | `var(--card-internal-inner-radius)` |
 * | `--card-body-flush-overflow` | `clip` |
 * | `--card-body-gap` | `var(--card-internal-gap, var(--spacing-8))` |
 * | `--card-body-min-height` | `0` |
 * | `--card-body-min-width` | `0` |
 * | `--card-body-padding-bottom` | `var(--card-internal-padding-bottom, var(--spaci...` |
 * | `--card-body-padding-left` | `var(--card-internal-padding-left, var(--spacing...` |
 * | `--card-body-padding-right` | `var(--card-internal-padding-right, var(--spacin...` |
 * | `--card-body-padding-top` | `var(--card-internal-padding-top, var(--spacing-8))` |
 * | `--card-body-skeleton-padding-bottom` | `var(--spacing-8)` |
 * | `--card-body-skeleton-padding-left` | `var(--spacing-8)` |
 * | `--card-body-skeleton-padding-right` | `var(--spacing-8)` |
 * | `--card-body-skeleton-padding-top` | `var(--spacing-8)` |
 * | `--card-border` | `-` |
 * | `--card-border-color` | `var(--card-border)` |
 * | `--card-border-radius` | `var(--radius-2)` |
 * | `--card-border-style` | `solid` |
 * | `--card-border-width` | `1px` |
 * | `--card-box-sizing` | `border-box` |
 * | `--card-color` | `var(--l1-foreground)` |
 * | `--card-description-color` | `var(--l2-foreground)` |
 * | `--card-description-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--card-description-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--card-description-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--card-description-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--card-description-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--card-description-min-width` | `0` |
 * | `--card-description-overflow-wrap` | `anywhere` |
 * | `--card-description-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--card-description-white-space` | `normal` |
 * | `--card-display` | `flex` |
 * | `--card-flex-direction` | `column` |
 * | `--card-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--card-font-feature-settings` | `'ss01' 1` |
 * | `--card-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--card-font-variant-numeric` | `normal` |
 * | `--card-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--card-footer-align-items` | `center` |
 * | `--card-footer-border-color` | `var(--card-border)` |
 * | `--card-footer-border-style` | `solid` |
 * | `--card-footer-border-width` | `1px` |
 * | `--card-footer-box-sizing` | `border-box` |
 * | `--card-footer-display` | `flex` |
 * | `--card-footer-flex` | `none` |
 * | `--card-footer-flex-wrap` | `wrap` |
 * | `--card-footer-gap` | `var(--spacing-4) var(--spacing-8)` |
 * | `--card-footer-padding-bottom` | `var(--spacing-6)` |
 * | `--card-footer-padding-left` | `var(--spacing-8)` |
 * | `--card-footer-padding-right` | `var(--spacing-8)` |
 * | `--card-footer-padding-top` | `var(--spacing-6)` |
 * | `--card-footer-prefix-display` | `block` |
 * | `--card-footer-prefix-flex` | `1 1 auto` |
 * | `--card-footer-prefix-min-width` | `0` |
 * | `--card-footer-prefix-overflow-wrap` | `anywhere` |
 * | `--card-footer-suffix-align-items` | `center` |
 * | `--card-footer-suffix-display` | `flex` |
 * | `--card-footer-suffix-flex` | `none` |
 * | `--card-footer-suffix-gap` | `var(--spacing-4)` |
 * | `--card-footer-suffix-margin-inline-start` | `auto` |
 * | `--card-header-align-items` | `flex-start` |
 * | `--card-header-border-color` | `var(--card-border)` |
 * | `--card-header-border-style` | `solid` |
 * | `--card-header-border-width` | `0` |
 * | `--card-header-box-sizing` | `border-box` |
 * | `--card-header-display` | `flex` |
 * | `--card-header-divider-border-width` | `1px` |
 * | `--card-header-divider-padding-bottom` | `var(--spacing-6)` |
 * | `--card-header-flex` | `none` |
 * | `--card-header-gap` | `var(--spacing-8)` |
 * | `--card-header-no-body-padding-bottom` | `var(--spacing-8)` |
 * | `--card-header-padding-bottom` | `0` |
 * | `--card-header-padding-left` | `var(--spacing-8)` |
 * | `--card-header-padding-right` | `var(--spacing-8)` |
 * | `--card-header-padding-top` | `var(--spacing-6)` |
 * | `--card-header-suffix-align-items` | `center` |
 * | `--card-header-suffix-display` | `flex` |
 * | `--card-header-suffix-flex` | `none` |
 * | `--card-header-suffix-gap` | `var(--spacing-4)` |
 * | `--card-header-suffix-height` | `var(--card-internal-title-line-height)` |
 * | `--card-header-text-display` | `flex` |
 * | `--card-header-text-flex` | `1 1 auto` |
 * | `--card-header-text-flex-direction` | `column` |
 * | `--card-header-text-gap` | `var(--spacing-2)` |
 * | `--card-header-text-min-width` | `0` |
 * | `--card-height` | `var(--card-internal-height, auto)` |
 * | `--card-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--card-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--card-margin-bottom` | `var(--card-internal-margin-bottom, 0)` |
 * | `--card-margin-left` | `var(--card-internal-margin-left, 0)` |
 * | `--card-margin-right` | `var(--card-internal-margin-right, 0)` |
 * | `--card-margin-top` | `var(--card-internal-margin-top, 0)` |
 * | `--card-max-width` | `var(--card-internal-max-width, 100%)` |
 * | `--card-min-height` | `var(--card-internal-min-height, 0)` |
 * | `--card-min-width` | `0` |
 * | `--card-overflow` | `visible` |
 * | `--card-skeleton-line-align-items` | `center` |
 * | `--card-skeleton-line-display` | `flex` |
 * | `--card-skeleton-line-height` | `var(--spacing-6)` |
 * | `--card-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--card-title-color` | `var(--l1-foreground)` |
 * | `--card-title-flex` | `0 1 auto` |
 * | `--card-title-font-family` | `var(--paragraph-base-500-font-family)` |
 * | `--card-title-font-size` | `var(--paragraph-base-500-font-size)` |
 * | `--card-title-font-weight` | `var(--paragraph-base-500-font-weight)` |
 * | `--card-title-letter-spacing` | `var(--paragraph-base-500-letter-spacing)` |
 * | `--card-title-line-align-items` | `flex-start` |
 * | `--card-title-line-display` | `flex` |
 * | `--card-title-line-gap` | `var(--spacing-4)` |
 * | `--card-title-line-height` | `var(--paragraph-base-500-line-height)` |
 * | `--card-title-line-min-width` | `0` |
 * | `--card-title-min-width` | `0` |
 * | `--card-title-overflow` | `clip visible` |
 * | `--card-title-overflow-wrap` | `normal` |
 * | `--card-title-prefix-align-items` | `center` |
 * | `--card-title-prefix-color` | `var(--l2-foreground)` |
 * | `--card-title-prefix-display` | `flex` |
 * | `--card-title-prefix-flex` | `none` |
 * | `--card-title-prefix-size` | `var(--spacing-8)` |
 * | `--card-title-suffix-align-items` | `center` |
 * | `--card-title-suffix-display` | `flex` |
 * | `--card-title-suffix-flex` | `none` |
 * | `--card-title-suffix-gap` | `var(--spacing-4)` |
 * | `--card-title-suffix-white-space` | `nowrap` |
 * | `--card-title-text-overflow` | `ellipsis` |
 * | `--card-title-text-transform` | `var(--paragraph-base-500-text-transform)` |
 * | `--card-title-white-space` | `nowrap` |
 * | `--card-title-wrap-overflow` | `visible` |
 * | `--card-title-wrap-overflow-wrap` | `anywhere` |
 * | `--card-title-wrap-text-overflow` | `clip` |
 * | `--card-title-wrap-white-space` | `normal` |
 * | `--card-tooltip-max-width` | `20rem` |
 * | `--card-tooltip-overflow-wrap` | `anywhere` |
 * | `--card-width` | `var(--card-internal-width, auto)` |
 */
// #endregion css-tokens

export { Card } from './card.js';
export { CARD_EMPTY_TITLE, CardSpacing, CardTextOverflow } from './constants.js';
export type * from './types.js';
