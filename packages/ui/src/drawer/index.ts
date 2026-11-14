// #region css-tokens
/**
 * CSS Tokens for drawer
 * Prefix: `--drawer-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--drawer-backdrop` | `-` |
 * | `--drawer-backdrop-color` | `var(--drawer-backdrop)` |
 * | `--drawer-backdrop-exit-transition-duration` | `160ms` |
 * | `--drawer-backdrop-hidden-opacity` | `0` |
 * | `--drawer-backdrop-inset` | `0` |
 * | `--drawer-backdrop-opacity` | `1` |
 * | `--drawer-backdrop-position` | `fixed` |
 * | `--drawer-backdrop-swiping-transition-duration` | `0ms` |
 * | `--drawer-backdrop-transition-duration` | `200ms` |
 * | `--drawer-backdrop-transition-property` | `opacity` |
 * | `--drawer-backdrop-transition-timing-function` | `ease` |
 * | `--drawer-background` | `-` |
 * | `--drawer-background-color` | `var(--drawer-background)` |
 * | `--drawer-base-max-inline-size` | `32rem` |
 * | `--drawer-block-size` | `100%` |
 * | `--drawer-body-color` | `var(--l2-foreground)` |
 * | `--drawer-body-flex` | `1 1 auto` |
 * | `--drawer-body-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--drawer-body-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--drawer-body-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--drawer-body-last-child-border-end-end-radius` | `inherit` |
 * | `--drawer-body-last-child-border-end-start-radius` | `inherit` |
 * | `--drawer-body-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--drawer-body-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--drawer-body-min-block-size` | `0` |
 * | `--drawer-body-overflow-y` | `auto` |
 * | `--drawer-body-overscroll-behavior` | `contain` |
 * | `--drawer-body-padding` | `var(--spacing-8)` |
 * | `--drawer-body-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--drawer-border` | `-` |
 * | `--drawer-border-color` | `var(--drawer-border)` |
 * | `--drawer-border-radius` | `var(--radius-3)` |
 * | `--drawer-border-style` | `solid` |
 * | `--drawer-border-width` | `1px` |
 * | `--drawer-box-shadow` | `var(--drawer-shadow)` |
 * | `--drawer-box-sizing` | `border-box` |
 * | `--drawer-close-start-margin-inline-end` | `var(--spacing-4)` |
 * | `--drawer-content-border-radius` | `inherit` |
 * | `--drawer-content-covered-content-visibility` | `hidden` |
 * | `--drawer-content-display` | `flex` |
 * | `--drawer-content-flex` | `1 1 auto` |
 * | `--drawer-content-flex-direction` | `column` |
 * | `--drawer-content-min-block-size` | `0` |
 * | `--drawer-content-nested-swiping-content-visibility` | `visible` |
 * | `--drawer-description-color` | `var(--l3-foreground)` |
 * | `--drawer-description-font-family` | `var(--label-base-400-font-family)` |
 * | `--drawer-description-font-size` | `var(--label-base-400-font-size)` |
 * | `--drawer-description-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--drawer-description-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--drawer-description-line-height` | `var(--label-base-400-line-height)` |
 * | `--drawer-description-margin` | `0` |
 * | `--drawer-description-overflow-wrap` | `anywhere` |
 * | `--drawer-description-skeleton-block-size` | `var(--label-base-400-font-size)` |
 * | `--drawer-description-skeleton-display` | `flex` |
 * | `--drawer-description-skeleton-flex-direction` | `column` |
 * | `--drawer-description-skeleton-justify-content` | `center` |
 * | `--drawer-description-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--drawer-display` | `flex` |
 * | `--drawer-entity-max-inline-size` | `55rem` |
 * | `--drawer-exit-transition-duration` | `200ms` |
 * | `--drawer-exit-transition-timing-function` | `cubic-bezier(0.4, 0, 1, 1)` |
 * | `--drawer-extra-wide-max-inline-size` | `51.25rem` |
 * | `--drawer-flex-direction` | `column` |
 * | `--drawer-focus-visible-outline` | `none` |
 * | `--drawer-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--drawer-font-feature-settings` | `'ss01' 1` |
 * | `--drawer-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--drawer-font-variant-numeric` | `normal` |
 * | `--drawer-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--drawer-footer-align-items` | `center` |
 * | `--drawer-footer-border-color` | `var(--drawer-border)` |
 * | `--drawer-footer-border-style` | `solid` |
 * | `--drawer-footer-border-width` | `1px 0 0 0` |
 * | `--drawer-footer-box-sizing` | `border-box` |
 * | `--drawer-footer-display` | `flex` |
 * | `--drawer-footer-flex-direction` | `row` |
 * | `--drawer-footer-flex-shrink` | `0` |
 * | `--drawer-footer-gap` | `var(--spacing-4)` |
 * | `--drawer-footer-justify-content` | `flex-end` |
 * | `--drawer-footer-min-block-size` | `56px` |
 * | `--drawer-footer-narrow-align-items` | `stretch` |
 * | `--drawer-footer-narrow-flex-direction` | `column-reverse` |
 * | `--drawer-footer-padding-block` | `var(--spacing-4)` |
 * | `--drawer-footer-padding-inline` | `var(--spacing-8)` |
 * | `--drawer-footer-prefix-align-items` | `center` |
 * | `--drawer-footer-prefix-display` | `flex` |
 * | `--drawer-footer-prefix-margin-inline-end` | `auto` |
 * | `--drawer-footer-prefix-min-inline-size` | `0` |
 * | `--drawer-footer-prefix-narrow-align-items` | `stretch` |
 * | `--drawer-footer-prefix-narrow-flex-direction` | `column` |
 * | `--drawer-footer-prefix-narrow-margin-inline-end` | `0` |
 * | `--drawer-footer-suffix-display` | `flex` |
 * | `--drawer-footer-suffix-flex-direction` | `row` |
 * | `--drawer-footer-suffix-gap` | `var(--spacing-4)` |
 * | `--drawer-footer-suffix-justify-content` | `flex-end` |
 * | `--drawer-footer-suffix-narrow-flex-direction` | `column-reverse` |
 * | `--drawer-header-align-items` | `center` |
 * | `--drawer-header-border-color` | `var(--drawer-border)` |
 * | `--drawer-header-border-style` | `solid` |
 * | `--drawer-header-border-width` | `0 0 1px 0` |
 * | `--drawer-header-box-sizing` | `border-box` |
 * | `--drawer-header-display` | `flex` |
 * | `--drawer-header-divider-block-size` | `16px` |
 * | `--drawer-header-divider-color` | `var(--drawer-border)` |
 * | `--drawer-header-divider-flex-shrink` | `0` |
 * | `--drawer-header-divider-inline-size` | `1px` |
 * | `--drawer-header-divider-margin-inline` | `var(--spacing-6) var(--spacing-10)` |
 * | `--drawer-header-flex-shrink` | `0` |
 * | `--drawer-header-min-block-size` | `48px` |
 * | `--drawer-header-padding-block` | `var(--spacing-5)` |
 * | `--drawer-header-padding-inline` | `var(--spacing-8)` |
 * | `--drawer-header-prefix-align-items` | `center` |
 * | `--drawer-header-prefix-display` | `flex` |
 * | `--drawer-header-prefix-flex-shrink` | `0` |
 * | `--drawer-header-prefix-gap` | `var(--spacing-2)` |
 * | `--drawer-header-prefix-loading-opacity` | `0.6` |
 * | `--drawer-header-suffix-align-items` | `center` |
 * | `--drawer-header-suffix-close-start-margin-inline-end` | `0` |
 * | `--drawer-header-suffix-display` | `flex` |
 * | `--drawer-header-suffix-flex-shrink` | `0` |
 * | `--drawer-header-suffix-gap` | `var(--spacing-2)` |
 * | `--drawer-header-suffix-loading-opacity` | `0.6` |
 * | `--drawer-header-suffix-margin-inline-end` | `var(--spacing-2)` |
 * | `--drawer-header-with-description-min-block-size` | `56px` |
 * | `--drawer-header-with-description-padding-block` | `var(--spacing-6)` |
 * | `--drawer-heading-display` | `flex` |
 * | `--drawer-heading-flex` | `1 1 auto` |
 * | `--drawer-heading-flex-direction` | `column` |
 * | `--drawer-heading-gap` | `var(--spacing-2)` |
 * | `--drawer-heading-min-inline-size` | `0` |
 * | `--drawer-heading-padding-inline-end` | `var(--spacing-6)` |
 * | `--drawer-hidden-transform` | `translateX(calc(100% + var(--spacing-8)))` |
 * | `--drawer-inline-size` | `100%` |
 * | `--drawer-layer-position` | `relative` |
 * | `--drawer-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--drawer-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--drawer-max-inline-size` | `var(--drawer-internal-max-inline-size)` |
 * | `--drawer-narrow-max-inline-size` | `24rem` |
 * | `--drawer-nested-breadcrumb-transform` | `none` |
 * | `--drawer-nested-breadcrumb-transition-duration` | `0ms` |
 * | `--drawer-overlay-width-ratio` | `0.8` |
 * | `--drawer-pointer-events` | `auto` |
 * | `--drawer-position` | `relative` |
 * | `--drawer-shadow` | `-` |
 * | `--drawer-swiping-transition-duration` | `0ms` |
 * | `--drawer-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--drawer-title-color` | `var(--l1-foreground)` |
 * | `--drawer-title-flex` | `0 1 auto` |
 * | `--drawer-title-margin` | `0` |
 * | `--drawer-title-min-inline-size` | `0` |
 * | `--drawer-title-prefix-align-items` | `center` |
 * | `--drawer-title-prefix-color` | `var(--l2-foreground)` |
 * | `--drawer-title-prefix-display` | `inline-flex` |
 * | `--drawer-title-prefix-flex-shrink` | `0` |
 * | `--drawer-title-prefix-icon-size` | `14px` |
 * | `--drawer-title-row-align-items` | `center` |
 * | `--drawer-title-row-display` | `flex` |
 * | `--drawer-title-row-gap` | `var(--spacing-4)` |
 * | `--drawer-title-row-min-inline-size` | `0` |
 * | `--drawer-title-skeleton-block-size` | `var(--label-base-500-font-size)` |
 * | `--drawer-title-skeleton-display` | `flex` |
 * | `--drawer-title-skeleton-flex` | `1 1 auto` |
 * | `--drawer-title-skeleton-flex-direction` | `column` |
 * | `--drawer-title-skeleton-justify-content` | `center` |
 * | `--drawer-title-suffix-align-items` | `center` |
 * | `--drawer-title-suffix-display` | `inline-flex` |
 * | `--drawer-title-suffix-flex-shrink` | `0` |
 * | `--drawer-trail-align-items` | `center` |
 * | `--drawer-trail-border-color` | `var(--drawer-border)` |
 * | `--drawer-trail-border-style` | `solid` |
 * | `--drawer-trail-border-width` | `0 0 1px 0` |
 * | `--drawer-trail-box-sizing` | `border-box` |
 * | `--drawer-trail-breadcrumb-flex` | `1 1 auto` |
 * | `--drawer-trail-breadcrumb-min-inline-size` | `0` |
 * | `--drawer-trail-display` | `flex` |
 * | `--drawer-trail-flex-shrink` | `0` |
 * | `--drawer-trail-min-block-size` | `48px` |
 * | `--drawer-trail-padding-inline` | `var(--spacing-6)` |
 * | `--drawer-trail-step-color` | `var(--l3-foreground)` |
 * | `--drawer-trail-step-font-size` | `var(--label-small-400-font-size)` |
 * | `--drawer-trail-step-font-variant-numeric` | `tabular-nums` |
 * | `--drawer-transform` | `none` |
 * | `--drawer-transition-duration` | `240ms` |
 * | `--drawer-transition-property` | `transform` |
 * | `--drawer-transition-timing-function` | `cubic-bezier(0.2, 0, 0, 1)` |
 * | `--drawer-viewport-box-sizing` | `border-box` |
 * | `--drawer-viewport-display` | `flex` |
 * | `--drawer-viewport-inset` | `0` |
 * | `--drawer-viewport-inspector-pointer-events` | `none` |
 * | `--drawer-viewport-justify-content` | `flex-end` |
 * | `--drawer-viewport-padding` | `var(--spacing-8)` |
 * | `--drawer-viewport-position` | `fixed` |
 * | `--drawer-visually-hidden-block-size` | `1px` |
 * | `--drawer-visually-hidden-border-width` | `0` |
 * | `--drawer-visually-hidden-clip-path` | `inset(50%)` |
 * | `--drawer-visually-hidden-inline-size` | `1px` |
 * | `--drawer-visually-hidden-margin` | `-1px` |
 * | `--drawer-visually-hidden-overflow` | `hidden` |
 * | `--drawer-visually-hidden-padding` | `0` |
 * | `--drawer-visually-hidden-position` | `absolute` |
 * | `--drawer-visually-hidden-white-space` | `nowrap` |
 * | `--drawer-wide-max-inline-size` | `42rem` |
 * | `--drawer-z-index` | `50` |
 */
// #endregion css-tokens

export { Drawer } from './drawer.js';
export { useDrawerHandle } from './use-drawer-handle.js';
export type {
	DrawerClosePositionType,
	DrawerCloseReasonType,
	DrawerCrumbType,
	DrawerHandleType,
	DrawerProps,
	DrawerStackType,
	DrawerTrailSelectReasonType,
	DrawerTrailStepType,
	DrawerTypeType,
	DrawerWidthType,
	ValidateDrawerProps,
} from './types.js';
