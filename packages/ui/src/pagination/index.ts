// #region css-tokens
/**
 * CSS Tokens for pagination
 * Prefix: `--pagination-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--pagination-align-center-justify-content` | `center` |
 * | `--pagination-align-end-justify-content` | `flex-end` |
 * | `--pagination-align-items` | `center` |
 * | `--pagination-align-start-justify-content` | `flex-start` |
 * | `--pagination-arrow-block-size` | `24px` |
 * | `--pagination-arrow-inline-size` | `16px` |
 * | `--pagination-arrow-padding` | `0` |
 * | `--pagination-box-sizing` | `border-box` |
 * | `--pagination-color` | `var(--pagination-label)` |
 * | `--pagination-compact-align-items` | `center` |
 * | `--pagination-compact-button-height` | `auto` |
 * | `--pagination-compact-button-padding` | `var(--spacing-3) var(--spacing-5)` |
 * | `--pagination-compact-display` | `flex` |
 * | `--pagination-compact-flex` | `0 0 auto` |
 * | `--pagination-compact-gap` | `var(--spacing-4)` |
 * | `--pagination-compact-hidden-visibility` | `hidden` |
 * | `--pagination-compact-icon-size` | `12px` |
 * | `--pagination-control-align-items` | `center` |
 * | `--pagination-control-background-color` | `transparent` |
 * | `--pagination-control-border-radius` | `var(--radius-1)` |
 * | `--pagination-control-border-style` | `none` |
 * | `--pagination-control-border-width` | `0` |
 * | `--pagination-control-box-sizing` | `border-box` |
 * | `--pagination-control-color` | `var(--pagination-label)` |
 * | `--pagination-control-cursor` | `pointer` |
 * | `--pagination-control-disabled-cursor` | `not-allowed` |
 * | `--pagination-control-disabled-opacity` | `0.4` |
 * | `--pagination-control-display` | `inline-flex` |
 * | `--pagination-control-flex` | `0 0 auto` |
 * | `--pagination-control-focus-visible-outline` | `1px solid var(--pagination-focus-ring)` |
 * | `--pagination-control-focus-visible-outline-offset` | `1px` |
 * | `--pagination-control-font` | `inherit` |
 * | `--pagination-control-font-feature-settings` | `inherit` |
 * | `--pagination-control-font-variant-numeric` | `inherit` |
 * | `--pagination-control-hover-color` | `var(--pagination-label-hover)` |
 * | `--pagination-control-justify-content` | `center` |
 * | `--pagination-control-letter-spacing` | `inherit` |
 * | `--pagination-control-margin` | `0` |
 * | `--pagination-control-text-transform` | `inherit` |
 * | `--pagination-control-transition-duration` | `150ms` |
 * | `--pagination-control-transition-property` | `color` |
 * | `--pagination-control-transition-timing-function` | `ease` |
 * | `--pagination-controls-align-items` | `center` |
 * | `--pagination-controls-display` | `flex` |
 * | `--pagination-controls-flex` | `0 0 auto` |
 * | `--pagination-controls-gap` | `var(--spacing-8)` |
 * | `--pagination-display` | `flex` |
 * | `--pagination-divider` | `-` |
 * | `--pagination-divider-background-color` | `var(--pagination-divider)` |
 * | `--pagination-divider-block-size` | `16px` |
 * | `--pagination-divider-flex` | `0 0 auto` |
 * | `--pagination-divider-inline-size` | `1px` |
 * | `--pagination-focus-ring` | `-` |
 * | `--pagination-font-family` | `var(--label-base-400-font-family)` |
 * | `--pagination-font-feature-settings` | `'ss01'` |
 * | `--pagination-font-size` | `var(--label-base-400-font-size)` |
 * | `--pagination-font-variant-numeric` | `slashed-zero lining-nums tabular-nums` |
 * | `--pagination-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--pagination-gap` | `var(--spacing-8)` |
 * | `--pagination-inline-size` | `100%` |
 * | `--pagination-justify-content` | `var(--pagination-internal-justify-content)` |
 * | `--pagination-label` | `-` |
 * | `--pagination-label-hover` | `-` |
 * | `--pagination-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--pagination-line-height` | `var(--label-base-400-line-height)` |
 * | `--pagination-min-inline-size` | `0` |
 * | `--pagination-padding-block` | `var(--spacing-4)` |
 * | `--pagination-padding-inline-end` | `var(--pagination-internal-padding-inline-end)` |
 * | `--pagination-padding-inline-start` | `var(--spacing-8)` |
 * | `--pagination-page-block-size` | `24px` |
 * | `--pagination-page-current-background` | `-` |
 * | `--pagination-page-current-background-color` | `var(--pagination-page-current-background)` |
 * | `--pagination-page-current-color` | `var(--pagination-page-current-label)` |
 * | `--pagination-page-current-cursor` | `default` |
 * | `--pagination-page-current-label` | `-` |
 * | `--pagination-page-digit-inline-size` | `1ch` |
 * | `--pagination-page-inline-size` | `var(--pagination-internal-slot-inline-size)` |
 * | `--pagination-page-min-inline-size` | `24px` |
 * | `--pagination-page-padding-block` | `1px` |
 * | `--pagination-page-padding-inline` | `var(--spacing-2)` |
 * | `--pagination-page-size-align-items` | `center` |
 * | `--pagination-page-size-display` | `flex` |
 * | `--pagination-page-size-flex` | `0 0 auto` |
 * | `--pagination-page-size-gap` | `var(--spacing-4)` |
 * | `--pagination-page-size-label-color` | `var(--pagination-label)` |
 * | `--pagination-page-size-label-white-space` | `nowrap` |
 * | `--pagination-pages-align-items` | `center` |
 * | `--pagination-pages-display` | `flex` |
 * | `--pagination-pages-flex` | `0 0 auto` |
 * | `--pagination-pages-gap` | `var(--spacing-5)` |
 * | `--pagination-separator` | `-` |
 * | `--pagination-separator-align-items` | `center` |
 * | `--pagination-separator-block-size` | `24px` |
 * | `--pagination-separator-box-sizing` | `border-box` |
 * | `--pagination-separator-display` | `flex` |
 * | `--pagination-separator-flex` | `0 0 auto` |
 * | `--pagination-separator-inline-size` | `var(--pagination-internal-slot-inline-size)` |
 * | `--pagination-separator-justify-content` | `center` |
 * | `--pagination-separator-line-background-color` | `var(--pagination-separator)` |
 * | `--pagination-separator-line-block-size` | `1px` |
 * | `--pagination-separator-line-border-radius` | `var(--radius-round)` |
 * | `--pagination-separator-line-display` | `block` |
 * | `--pagination-separator-line-inline-size` | `100%` |
 * | `--pagination-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--pagination-total-color` | `var(--pagination-label)` |
 * | `--pagination-total-display` | `grid` |
 * | `--pagination-total-flex` | `0 1 auto` |
 * | `--pagination-total-grid-area` | `1 / 1` |
 * | `--pagination-total-grid-template-columns` | `minmax(0, 1fr)` |
 * | `--pagination-total-margin-inline-end` | `auto` |
 * | `--pagination-total-min-inline-size` | `0` |
 * | `--pagination-total-sizer-pointer-events` | `none` |
 * | `--pagination-total-sizer-visibility` | `hidden` |
 * | `--pagination-total-text-min-inline-size` | `0` |
 * | `--pagination-total-text-overflow` | `hidden` |
 * | `--pagination-total-text-text-overflow` | `ellipsis` |
 * | `--pagination-total-text-white-space` | `nowrap` |
 */
// #endregion css-tokens

export type * from './types.js';
export { Pagination } from './pagination.js';
