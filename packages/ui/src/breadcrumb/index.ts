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
 * | `--breadcrumb-ellipsis-box-sizing` | `border-box` |
 * | `--breadcrumb-ellipsis-display` | `flex` |
 * | `--breadcrumb-ellipsis-flex-direction` | `column` |
 * | `--breadcrumb-ellipsis-heading-align-items` | `center` |
 * | `--breadcrumb-ellipsis-heading-box-sizing` | `border-box` |
 * | `--breadcrumb-ellipsis-heading-color` | `var(--l3-foreground)` |
 * | `--breadcrumb-ellipsis-heading-display` | `flex` |
 * | `--breadcrumb-ellipsis-heading-font-family` | `var(--uppercase-small-600-font-family)` |
 * | `--breadcrumb-ellipsis-heading-font-size` | `var(--uppercase-small-600-font-size)` |
 * | `--breadcrumb-ellipsis-heading-font-weight` | `var(--uppercase-small-600-font-weight)` |
 * | `--breadcrumb-ellipsis-heading-letter-spacing` | `var(--uppercase-small-600-letter-spacing)` |
 * | `--breadcrumb-ellipsis-heading-line-height` | `var(--uppercase-small-600-line-height)` |
 * | `--breadcrumb-ellipsis-heading-min-block-size` | `calc(var(--spacing-12) + var(--spacing-3))` |
 * | `--breadcrumb-ellipsis-heading-padding-block` | `var(--spacing-3)` |
 * | `--breadcrumb-ellipsis-heading-padding-inline` | `var(--spacing-6)` |
 * | `--breadcrumb-ellipsis-heading-text-transform` | `var(--uppercase-small-600-text-transform)` |
 * | `--breadcrumb-ellipsis-list-display` | `flex` |
 * | `--breadcrumb-ellipsis-list-flex-direction` | `column` |
 * | `--breadcrumb-ellipsis-list-gap` | `var(--spacing-2)` |
 * | `--breadcrumb-ellipsis-list-item-display` | `flex` |
 * | `--breadcrumb-ellipsis-list-item-min-inline-size` | `0` |
 * | `--breadcrumb-ellipsis-list-list-style` | `none` |
 * | `--breadcrumb-ellipsis-list-margin` | `0` |
 * | `--breadcrumb-ellipsis-list-padding` | `0` |
 * | `--breadcrumb-ellipsis-max-block-size` | `20rem` |
 * | `--breadcrumb-ellipsis-min-block-size` | `0` |
 * | `--breadcrumb-ellipsis-min-inline-size` | `10rem` |
 * | `--breadcrumb-ellipsis-overflow-x` | `hidden` |
 * | `--breadcrumb-ellipsis-overflow-y` | `auto` |
 * | `--breadcrumb-ellipsis-overscroll-behavior` | `contain` |
 * | `--breadcrumb-ellipsis-row-affix-align-items` | `center` |
 * | `--breadcrumb-ellipsis-row-affix-display` | `inline-grid` |
 * | `--breadcrumb-ellipsis-row-affix-flex` | `0 0 auto` |
 * | `--breadcrumb-ellipsis-row-affix-justify-content` | `center` |
 * | `--breadcrumb-ellipsis-row-align-items` | `center` |
 * | `--breadcrumb-ellipsis-row-appearance` | `none` |
 * | `--breadcrumb-ellipsis-row-background-color` | `transparent` |
 * | `--breadcrumb-ellipsis-row-border` | `0` |
 * | `--breadcrumb-ellipsis-row-border-radius` | `0` |
 * | `--breadcrumb-ellipsis-row-box-sizing` | `border-box` |
 * | `--breadcrumb-ellipsis-row-color` | `var(--l2-foreground)` |
 * | `--breadcrumb-ellipsis-row-cursor` | `default` |
 * | `--breadcrumb-ellipsis-row-display` | `flex` |
 * | `--breadcrumb-ellipsis-row-flex` | `1 1 auto` |
 * | `--breadcrumb-ellipsis-row-focus-outline-color` | `var(--breadcrumb-focus-ring)` |
 * | `--breadcrumb-ellipsis-row-focus-outline-offset` | `-1px` |
 * | `--breadcrumb-ellipsis-row-focus-outline-style` | `solid` |
 * | `--breadcrumb-ellipsis-row-focus-outline-width` | `1px` |
 * | `--breadcrumb-ellipsis-row-font-family` | `var(--label-base-400-font-family)` |
 * | `--breadcrumb-ellipsis-row-font-feature-settings` | `inherit` |
 * | `--breadcrumb-ellipsis-row-font-size` | `var(--label-base-400-font-size)` |
 * | `--breadcrumb-ellipsis-row-font-variant-numeric` | `inherit` |
 * | `--breadcrumb-ellipsis-row-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--breadcrumb-ellipsis-row-gap` | `var(--spacing-4)` |
 * | `--breadcrumb-ellipsis-row-hover-background-color` | `var(--l3-background-60)` |
 * | `--breadcrumb-ellipsis-row-hover-color` | `var(--l1-foreground-hover)` |
 * | `--breadcrumb-ellipsis-row-hover-outline` | `none` |
 * | `--breadcrumb-ellipsis-row-icon-size` | `14px` |
 * | `--breadcrumb-ellipsis-row-interactive-cursor` | `pointer` |
 * | `--breadcrumb-ellipsis-row-label-flex` | `1 1 auto` |
 * | `--breadcrumb-ellipsis-row-label-min-inline-size` | `0` |
 * | `--breadcrumb-ellipsis-row-label-overflow` | `clip visible` |
 * | `--breadcrumb-ellipsis-row-label-text-overflow` | `ellipsis` |
 * | `--breadcrumb-ellipsis-row-label-white-space` | `nowrap` |
 * | `--breadcrumb-ellipsis-row-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--breadcrumb-ellipsis-row-line-height` | `var(--label-base-400-line-height)` |
 * | `--breadcrumb-ellipsis-row-margin` | `0` |
 * | `--breadcrumb-ellipsis-row-min-block-size` | `calc(var(--spacing-16) + var(--spacing-1))` |
 * | `--breadcrumb-ellipsis-row-min-inline-size` | `0` |
 * | `--breadcrumb-ellipsis-row-padding` | `var(--spacing-4) var(--spacing-6)` |
 * | `--breadcrumb-ellipsis-row-text-align` | `start` |
 * | `--breadcrumb-ellipsis-row-text-decoration` | `none` |
 * | `--breadcrumb-ellipsis-row-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--breadcrumb-ellipsis-row-white-space` | `nowrap` |
 * | `--breadcrumb-ellipsis-scrollbar-width` | `thin` |
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
 * | `--breadcrumb-item-collapsed-icon-opacity` | `0` |
 * | `--breadcrumb-item-collapsed-icon-visibility` | `visible` |
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
 * | `--breadcrumb-outlined-ellipsis-padding` | `3px var(--spacing-4)` |
 * | `--breadcrumb-outlined-gap` | `var(--spacing-2)` |
 * | `--breadcrumb-outlined-item-background-color` | `var(--l3-background-30)` |
 * | `--breadcrumb-outlined-item-border-color` | `var(--l2-border)` |
 * | `--breadcrumb-outlined-item-border-radius` | `var(--radius-2)` |
 * | `--breadcrumb-outlined-item-border-style` | `solid` |
 * | `--breadcrumb-outlined-item-border-width` | `1px` |
 * | `--breadcrumb-outlined-item-color` | `var(--l2-foreground)` |
 * | `--breadcrumb-outlined-item-current-height` | `22px` |
 * | `--breadcrumb-outlined-item-floor` | `calc( 4ch + var(--spacing-3) + var(--spacing-4)...` |
 * | `--breadcrumb-outlined-item-gap` | `var(--spacing-3)` |
 * | `--breadcrumb-outlined-item-height` | `var(--spacing-12)` |
 * | `--breadcrumb-outlined-item-hover-background-color` | `var(--l3-background-60)` |
 * | `--breadcrumb-outlined-item-hover-border-color` | `var(--l3-border)` |
 * | `--breadcrumb-outlined-item-hover-color` | `var(--l2-foreground)` |
 * | `--breadcrumb-outlined-item-padding` | `3px var(--spacing-4) 3px var(--spacing-3)` |
 * | `--breadcrumb-preview-backdrop-filter` | `blur(40px)` |
 * | `--breadcrumb-preview-background-color` | `var(--surface-3)` |
 * | `--breadcrumb-preview-block-size` | `var(--popup-height, auto)` |
 * | `--breadcrumb-preview-border-color` | `var(--l2-border)` |
 * | `--breadcrumb-preview-border-radius` | `var(--radius-3)` |
 * | `--breadcrumb-preview-border-style` | `solid` |
 * | `--breadcrumb-preview-border-width` | `1px` |
 * | `--breadcrumb-preview-box-shadow` | `var(--shadow-dropdown)` |
 * | `--breadcrumb-preview-box-sizing` | `border-box` |
 * | `--breadcrumb-preview-color` | `var(--l1-foreground)` |
 * | `--breadcrumb-preview-content-swap-opacity` | `0` |
 * | `--breadcrumb-preview-content-transition-property` | `translate, opacity` |
 * | `--breadcrumb-preview-display` | `flex` |
 * | `--breadcrumb-preview-flex-direction` | `column` |
 * | `--breadcrumb-preview-focus-visible-outline` | `none` |
 * | `--breadcrumb-preview-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--breadcrumb-preview-font-feature-settings` | `'ss01' 1` |
 * | `--breadcrumb-preview-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--breadcrumb-preview-font-variant-numeric` | `normal` |
 * | `--breadcrumb-preview-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--breadcrumb-preview-inline-size` | `var(--popup-width, fit-content)` |
 * | `--breadcrumb-preview-instant-transition-duration` | `0s` |
 * | `--breadcrumb-preview-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--breadcrumb-preview-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--breadcrumb-preview-max-inline-size` | `20rem` |
 * | `--breadcrumb-preview-overflow` | `hidden` |
 * | `--breadcrumb-preview-padding` | `0` |
 * | `--breadcrumb-preview-positioner-block-size` | `var(--positioner-height, auto)` |
 * | `--breadcrumb-preview-positioner-inline-size` | `var(--positioner-width, max-content)` |
 * | `--breadcrumb-preview-positioner-pointer-events` | `auto` |
 * | `--breadcrumb-preview-positioner-transition-property` | `top, left` |
 * | `--breadcrumb-preview-shift` | `16px` |
 * | `--breadcrumb-preview-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--breadcrumb-preview-transition-duration` | `200ms` |
 * | `--breadcrumb-preview-transition-property` | `inline-size, block-size` |
 * | `--breadcrumb-preview-transition-timing-function` | `cubic-bezier(0.22, 1, 0.36, 1)` |
 * | `--breadcrumb-preview-viewport-flex` | `1 1 auto` |
 * | `--breadcrumb-preview-viewport-overflow` | `clip` |
 * | `--breadcrumb-preview-viewport-position` | `relative` |
 * | `--breadcrumb-preview-z-index` | `50` |
 * | `--breadcrumb-separator-align-items` | `center` |
 * | `--breadcrumb-separator-color` | `var(--breadcrumb-label)` |
 * | `--breadcrumb-separator-display` | `inline-flex` |
 * | `--breadcrumb-separator-flex` | `0 0 auto` |
 * | `--breadcrumb-separator-user-select` | `none` |
 * | `--breadcrumb-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--breadcrumb-tooltip-max-width` | `20rem` |
 * | `--breadcrumb-transition-duration` | `150ms` |
 * | `--breadcrumb-transition-property` | `background-color, border-color, color, border-r...` |
 * | `--breadcrumb-transition-timing-function` | `ease` |
 */
// #endregion css-tokens

export { Breadcrumb } from './breadcrumb.js';
export { BreadcrumbCollapseFrom, BreadcrumbTextOverflow, BreadcrumbVariant } from './constants.js';
export type {
	BreadcrumbCollapsedCrumb,
	BreadcrumbCollapseFromType,
	BreadcrumbDropdownItem,
	BreadcrumbEllipsisOptions,
	BreadcrumbItemType,
	BreadcrumbLinkProps,
	BreadcrumbProps,
	BreadcrumbTextOverflowType,
	BreadcrumbVariantType,
	ValidateBreadcrumbProps,
} from './types.js';
