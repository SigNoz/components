// #region css-tokens
/**
 * CSS Tokens for breadcrumb
 * Prefix: `--breadcrumb-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--breadcrumb-background-hover` | `-` |
 * | `--breadcrumb-color` | `var(--breadcrumb-label)` |
 * | `--breadcrumb-content-align-items` | `center` |
 * | `--breadcrumb-content-appearance` | `none` |
 * | `--breadcrumb-content-border` | `0` |
 * | `--breadcrumb-content-box-sizing` | `border-box` |
 * | `--breadcrumb-content-cursor` | `default` |
 * | `--breadcrumb-content-display` | `inline-flex` |
 * | `--breadcrumb-content-font` | `inherit` |
 * | `--breadcrumb-content-font-feature-settings` | `inherit` |
 * | `--breadcrumb-content-font-variant-numeric` | `inherit` |
 * | `--breadcrumb-content-letter-spacing` | `inherit` |
 * | `--breadcrumb-content-margin` | `0` |
 * | `--breadcrumb-content-max-inline-size` | `100%` |
 * | `--breadcrumb-content-min-width` | `0` |
 * | `--breadcrumb-content-text-decoration` | `none` |
 * | `--breadcrumb-content-text-transform` | `inherit` |
 * | `--breadcrumb-content-white-space` | `nowrap` |
 * | `--breadcrumb-display` | `flex` |
 * | `--breadcrumb-flex-direction` | `column` |
 * | `--breadcrumb-floor-display` | `block` |
 * | `--breadcrumb-focus-ring` | `-` |
 * | `--breadcrumb-focus-visible-outline` | `var(--breadcrumb-focus-ring) solid 1px` |
 * | `--breadcrumb-focus-visible-outline-offset` | `1px` |
 * | `--breadcrumb-font-family` | `var(--label-base-400-font-family)` |
 * | `--breadcrumb-font-feature-settings` | `'ss01' 1` |
 * | `--breadcrumb-font-size` | `var(--label-base-400-font-size)` |
 * | `--breadcrumb-font-variant-numeric` | `normal` |
 * | `--breadcrumb-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--breadcrumb-gap` | `var(--spacing-4)` |
 * | `--breadcrumb-icon-align-items` | `center` |
 * | `--breadcrumb-icon-display` | `inline-flex` |
 * | `--breadcrumb-icon-flex` | `0 0 auto` |
 * | `--breadcrumb-icon-size` | `14px` |
 * | `--breadcrumb-interactive-cursor` | `pointer` |
 * | `--breadcrumb-item-background` | `transparent` |
 * | `--breadcrumb-item-border-radius` | `var(--radius-0)` |
 * | `--breadcrumb-item-collapsed-inset-block-start` | `0` |
 * | `--breadcrumb-item-collapsed-inset-inline-start` | `0` |
 * | `--breadcrumb-item-collapsed-pointer-events` | `none` |
 * | `--breadcrumb-item-collapsed-position` | `absolute` |
 * | `--breadcrumb-item-collapsed-visibility` | `hidden` |
 * | `--breadcrumb-item-color` | `var(--breadcrumb-label)` |
 * | `--breadcrumb-item-display` | `flex` |
 * | `--breadcrumb-item-flex` | `0 0 auto` |
 * | `--breadcrumb-item-floor` | `calc(4ch + 2 * var(--spacing-1))` |
 * | `--breadcrumb-item-gap` | `var(--spacing-2)` |
 * | `--breadcrumb-item-height` | `21px` |
 * | `--breadcrumb-item-hover-background` | `var(--breadcrumb-background-hover)` |
 * | `--breadcrumb-item-hover-border-radius` | `var(--radius-1)` |
 * | `--breadcrumb-item-hover-color` | `var(--breadcrumb-label-hover)` |
 * | `--breadcrumb-item-max-inline-size` | `100%` |
 * | `--breadcrumb-item-max-width` | `24ch` |
 * | `--breadcrumb-item-min-width` | `0` |
 * | `--breadcrumb-item-padding` | `var(--spacing-2) var(--spacing-1)` |
 * | `--breadcrumb-item-shrinking-flex-shrink` | `1` |
 * | `--breadcrumb-item-shrinking-max-inline-size` | `50%` |
 * | `--breadcrumb-label` | `-` |
 * | `--breadcrumb-label-display` | `block` |
 * | `--breadcrumb-label-hover` | `-` |
 * | `--breadcrumb-label-min-width` | `0` |
 * | `--breadcrumb-label-overflow` | `clip visible` |
 * | `--breadcrumb-label-text-overflow` | `ellipsis` |
 * | `--breadcrumb-label-white-space` | `nowrap` |
 * | `--breadcrumb-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--breadcrumb-line-height` | `var(--label-base-400-line-height)` |
 * | `--breadcrumb-list-align-items` | `center` |
 * | `--breadcrumb-list-display` | `flex` |
 * | `--breadcrumb-list-flex-wrap` | `nowrap` |
 * | `--breadcrumb-list-list-style` | `none` |
 * | `--breadcrumb-list-margin` | `0` |
 * | `--breadcrumb-list-min-width` | `0` |
 * | `--breadcrumb-list-padding` | `0` |
 * | `--breadcrumb-list-position` | `relative` |
 * | `--breadcrumb-list-wrap-flex-wrap` | `wrap` |
 * | `--breadcrumb-max-width` | `100%` |
 * | `--breadcrumb-measure-display` | `flex` |
 * | `--breadcrumb-measure-height` | `0` |
 * | `--breadcrumb-measure-max-inline-size` | `100%` |
 * | `--breadcrumb-measure-overflow` | `hidden` |
 * | `--breadcrumb-measure-part-inset-block-start` | `0` |
 * | `--breadcrumb-measure-part-inset-inline-start` | `0` |
 * | `--breadcrumb-measure-part-position` | `absolute` |
 * | `--breadcrumb-measure-pointer-events` | `none` |
 * | `--breadcrumb-measure-position` | `relative` |
 * | `--breadcrumb-measure-visibility` | `hidden` |
 * | `--breadcrumb-menu-max-width` | `20rem` |
 * | `--breadcrumb-min-width` | `0` |
 * | `--breadcrumb-separator-align-items` | `center` |
 * | `--breadcrumb-separator-color` | `var(--breadcrumb-label)` |
 * | `--breadcrumb-separator-display` | `inline-flex` |
 * | `--breadcrumb-separator-flex` | `0 0 auto` |
 * | `--breadcrumb-separator-user-select` | `none` |
 * | `--breadcrumb-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--breadcrumb-tooltip-max-width` | `20rem` |
 * | `--breadcrumb-transition-duration` | `150ms` |
 * | `--breadcrumb-transition-property` | `background-color, color, border-radius` |
 * | `--breadcrumb-transition-timing-function` | `ease` |
 */
// #endregion css-tokens

export { Breadcrumb } from './breadcrumb.js';
export { BreadcrumbTextOverflow } from './constants.js';
export type {
	BreadcrumbDropdownItem,
	BreadcrumbItemType,
	BreadcrumbLinkProps,
	BreadcrumbProps,
	BreadcrumbTextOverflowType,
	ValidateBreadcrumbProps,
} from './types.js';
