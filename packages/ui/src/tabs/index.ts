// #region css-tokens
/**
 * CSS Tokens for tabs
 * Prefix: `--tabs-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--tabs-active-accent-color` | `var(--tabs-primary-indicator)` |
 * | `--tabs-active-slider-border-radius` | `2px` |
 * | `--tabs-active-slider-bottom` | `calc(var(--spacing-4, 8px) * -1)` |
 * | `--tabs-active-slider-height` | `2px` |
 * | `--tabs-active-slider-position` | `absolute` |
 * | `--tabs-active-slider-transition` | `left 0.2s cubic-bezier(0.4, 0, 0.2, 1),     wid...` |
 * | `--tabs-active-slider-will-change` | `left, width` |
 * | `--tabs-active-text-color` | `var(--l1-foreground-hover)` |
 * | `--tabs-bar-content-gap` | `var(--spacing-8, 16px)` |
 * | `--tabs-bar-content-left-order` | `0` |
 * | `--tabs-bar-content-right-order` | `4` |
 * | `--tabs-border` | `-` |
 * | `--tabs-border-color` | `var(--tabs-border)` |
 * | `--tabs-border-spacer-flex-basis` | `0%` |
 * | `--tabs-border-spacer-flex-grow` | `var(--tabs-internal-spacer-left-flex-grow, 0)` |
 * | `--tabs-border-spacer-flex-shrink` | `1` |
 * | `--tabs-border-spacer-grow-flex-grow` | `var(--tabs-internal-spacer-grow-flex-grow, 1)` |
 * | `--tabs-border-spacer-grow-flex-shrink` | `0` |
 * | `--tabs-border-spacer-min-width` | `var(--tabs-internal-spacer-min-width, 0)` |
 * | `--tabs-border-width` | `1px` |
 * | `--tabs-content-focus-visible-box-shadow` | `0 0 0 2px var(--ring),       0 0 0 4px var(--ri...` |
 * | `--tabs-content-focus-visible-outline` | `none` |
 * | `--tabs-content-margin` | `var(--spacing-4, 8px) 0px 0px 0px` |
 * | `--tabs-content-padding` | `var(--spacing-4, 8px)` |
 * | `--tabs-display` | `flex` |
 * | `--tabs-extra-content-align-items` | `center` |
 * | `--tabs-extra-content-display` | `flex` |
 * | `--tabs-extra-content-flex-basis` | `auto` |
 * | `--tabs-extra-content-flex-grow` | `0` |
 * | `--tabs-extra-content-flex-shrink` | `0` |
 * | `--tabs-extra-content-left-flex-grow` | `var(--tabs-extra-content-flex-grow, 0)` |
 * | `--tabs-extra-content-left-flex-shrink` | `var(--tabs-extra-content-flex-shrink, 0)` |
 * | `--tabs-extra-content-left-min-width` | `var(--tabs-extra-content-min-width, auto)` |
 * | `--tabs-extra-content-min-width` | `auto` |
 * | `--tabs-extra-content-right-flex-grow` | `var(--tabs-extra-content-flex-grow, 0)` |
 * | `--tabs-extra-content-right-flex-shrink` | `var(--tabs-extra-content-flex-shrink, 0)` |
 * | `--tabs-extra-content-right-min-width` | `var(--tabs-extra-content-min-width, auto)` |
 * | `--tabs-flex-direction` | `column` |
 * | `--tabs-gap` | `var(--spacing-4, 8px)` |
 * | `--tabs-hover-slider-bg` | `color-mix(in srgb, var(--l1-foreground) 10%, tr...` |
 * | `--tabs-hover-slider-border-radius` | `2px` |
 * | `--tabs-hover-slider-left` | `0` |
 * | `--tabs-hover-slider-position` | `absolute` |
 * | `--tabs-hover-slider-transition` | `transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),   ...` |
 * | `--tabs-hover-slider-will-change` | `transform, width, opacity` |
 * | `--tabs-hover-slider-z-index` | `0` |
 * | `--tabs-hover-text-color` | `var(--l1-foreground-hover)` |
 * | `--tabs-icon-align-items` | `center` |
 * | `--tabs-icon-display` | `inline-flex` |
 * | `--tabs-icon-flex-shrink` | `0` |
 * | `--tabs-list-inner-align-items` | `flex-start` |
 * | `--tabs-list-inner-display` | `inline-flex` |
 * | `--tabs-list-inner-position` | `relative` |
 * | `--tabs-list-primary-align-items` | `center` |
 * | `--tabs-list-primary-display` | `inline-flex` |
 * | `--tabs-list-primary-gap` | `var(--spacing-12, 24px)` |
 * | `--tabs-list-secondary-display` | `flex` |
 * | `--tabs-list-wrapper-primary-align-items` | `center` |
 * | `--tabs-list-wrapper-primary-display` | `flex` |
 * | `--tabs-list-wrapper-primary-no-content-padding-inline` | `0` |
 * | `--tabs-list-wrapper-primary-padding-inline` | `var(--spacing-6, 12px)` |
 * | `--tabs-list-wrapper-primary-text-align` | `left` |
 * | `--tabs-list-wrapper-primary-width` | `100%` |
 * | `--tabs-list-wrapper-secondary-display` | `flex` |
 * | `--tabs-list-wrapper-secondary-width` | `100%` |
 * | `--tabs-primary-background-hover` | `-` |
 * | `--tabs-primary-indicator` | `-` |
 * | `--tabs-primary-label` | `-` |
 * | `--tabs-primary-label-hover` | `-` |
 * | `--tabs-primary-radius` | `-` |
 * | `--tabs-secondary-background` | `-` |
 * | `--tabs-secondary-background-hover` | `-` |
 * | `--tabs-secondary-label` | `-` |
 * | `--tabs-secondary-label-active` | `-` |
 * | `--tabs-secondary-label-disabled` | `-` |
 * | `--tabs-secondary-label-hover` | `-` |
 * | `--tabs-secondary-stripe-disabled` | `-` |
 * | `--tabs-text-color` | `var(--l1-foreground)` |
 * | `--tabs-trigger-background-color` | `transparent` |
 * | `--tabs-trigger-border` | `none` |
 * | `--tabs-trigger-cursor` | `pointer` |
 * | `--tabs-trigger-primary-active-color` | `var(--tabs-primary-label-hover)` |
 * | `--tabs-trigger-primary-align-items` | `center` |
 * | `--tabs-trigger-primary-border-radius` | `var(--tabs-primary-radius)` |
 * | `--tabs-trigger-primary-color` | `var(--tabs-primary-label)` |
 * | `--tabs-trigger-primary-disabled-cursor` | `not-allowed` |
 * | `--tabs-trigger-primary-disabled-opacity` | `0.6` |
 * | `--tabs-trigger-primary-display` | `inline-flex` |
 * | `--tabs-trigger-primary-focus-visible-outline` | `var(--ring) solid 1px` |
 * | `--tabs-trigger-primary-focus-visible-outline-offset` | `1px` |
 * | `--tabs-trigger-primary-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--tabs-trigger-primary-font-weight` | `var(--font-weight-normal, 400)` |
 * | `--tabs-trigger-primary-gap` | `var(--spacing-4, 8px)` |
 * | `--tabs-trigger-primary-hover-background` | `var(--tabs-primary-background-hover)` |
 * | `--tabs-trigger-primary-hover-color` | `var(--tabs-primary-label-hover)` |
 * | `--tabs-trigger-primary-icon-height` | `14px` |
 * | `--tabs-trigger-primary-icon-width` | `14px` |
 * | `--tabs-trigger-primary-line-height` | `20px` |
 * | `--tabs-trigger-primary-padding` | `var(--spacing-3, 6px)` |
 * | `--tabs-trigger-primary-position` | `relative` |
 * | `--tabs-trigger-primary-white-space` | `nowrap` |
 * | `--tabs-trigger-primary-z-index` | `10` |
 * | `--tabs-trigger-secondary-active-bg` | `transparent` |
 * | `--tabs-trigger-secondary-active-border-bottom-color` | `transparent` |
 * | `--tabs-trigger-secondary-active-color` | `var(--tabs-secondary-label-active)` |
 * | `--tabs-trigger-secondary-align-items` | `center` |
 * | `--tabs-trigger-secondary-bg` | `var(--tabs-secondary-background)` |
 * | `--tabs-trigger-secondary-border-color` | `var(--tabs-border)` |
 * | `--tabs-trigger-secondary-border-radius` | `var(--radius-1, 2px)` |
 * | `--tabs-trigger-secondary-border-right-width` | `0px` |
 * | `--tabs-trigger-secondary-border-style` | `solid` |
 * | `--tabs-trigger-secondary-border-width` | `1px` |
 * | `--tabs-trigger-secondary-color` | `var(--tabs-secondary-label)` |
 * | `--tabs-trigger-secondary-cursor` | `pointer` |
 * | `--tabs-trigger-secondary-disabled-child-position` | `relative` |
 * | `--tabs-trigger-secondary-disabled-child-z-index` | `2` |
 * | `--tabs-trigger-secondary-disabled-color` | `var(--tabs-secondary-label-disabled)` |
 * | `--tabs-trigger-secondary-disabled-cursor` | `not-allowed` |
 * | `--tabs-trigger-secondary-disabled-position` | `relative` |
 * | `--tabs-trigger-secondary-disabled-stripe-after-mask-image` | `linear-gradient(to right, transparent 5%, black...` |
 * | `--tabs-trigger-secondary-disabled-stripe-after-right` | `0` |
 * | `--tabs-trigger-secondary-disabled-stripe-background-image` | `repeating-linear-gradient(             -45deg, ...` |
 * | `--tabs-trigger-secondary-disabled-stripe-before-left` | `0` |
 * | `--tabs-trigger-secondary-disabled-stripe-before-mask-image` | `linear-gradient(to left, transparent 5%, black ...` |
 * | `--tabs-trigger-secondary-disabled-stripe-bottom` | `0` |
 * | `--tabs-trigger-secondary-disabled-stripe-color` | `var(--tabs-secondary-stripe-disabled)` |
 * | `--tabs-trigger-secondary-disabled-stripe-content` | `""` |
 * | `--tabs-trigger-secondary-disabled-stripe-pointer-events` | `none` |
 * | `--tabs-trigger-secondary-disabled-stripe-position` | `absolute` |
 * | `--tabs-trigger-secondary-disabled-stripe-top` | `0` |
 * | `--tabs-trigger-secondary-disabled-stripe-width` | `var(--spacing-12)` |
 * | `--tabs-trigger-secondary-disabled-stripe-z-index` | `1` |
 * | `--tabs-trigger-secondary-disabled-z-index` | `0` |
 * | `--tabs-trigger-secondary-display` | `inline-flex` |
 * | `--tabs-trigger-secondary-dot-background-color` | `var(--tabs-primary-indicator)` |
 * | `--tabs-trigger-secondary-dot-border-radius` | `var(--radius-round, 999999px)` |
 * | `--tabs-trigger-secondary-dot-duration` | `180ms` |
 * | `--tabs-trigger-secondary-dot-easing` | `cubic-bezier(0.34, 1.2, 0.64, 1)` |
 * | `--tabs-trigger-secondary-dot-enter-scale` | `0.2` |
 * | `--tabs-trigger-secondary-dot-flex-shrink` | `0` |
 * | `--tabs-trigger-secondary-dot-gap` | `var(--spacing-2, 4px)` |
 * | `--tabs-trigger-secondary-dot-size` | `var(--spacing-2, 4px)` |
 * | `--tabs-trigger-secondary-dot-travel` | `var(--spacing-2, 4px)` |
 * | `--tabs-trigger-secondary-flex` | `0` |
 * | `--tabs-trigger-secondary-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--tabs-trigger-secondary-gap` | `var(--spacing-4, 8px)` |
 * | `--tabs-trigger-secondary-height` | `100%` |
 * | `--tabs-trigger-secondary-hover-bg` | `var(--tabs-secondary-background-hover)` |
 * | `--tabs-trigger-secondary-hover-color` | `var(--tabs-secondary-label-hover)` |
 * | `--tabs-trigger-secondary-icon-flex-shrink` | `0` |
 * | `--tabs-trigger-secondary-icon-height` | `16px` |
 * | `--tabs-trigger-secondary-icon-width` | `16px` |
 * | `--tabs-trigger-secondary-justify-content` | `center` |
 * | `--tabs-trigger-secondary-last-border-right-width` | `var(--tabs-trigger-secondary-border-width, 1px)` |
 * | `--tabs-trigger-secondary-padding` | `var(--spacing-4, 8px) var(--spacing-16, 32px)` |
 * | `--tabs-trigger-secondary-transition` | `color 150ms ease` |
 * | `--tabs-trigger-secondary-white-space` | `nowrap` |
 */
// #endregion css-tokens

export { Tabs } from './tabs.js';
export { TabsAlignment, TabsOrientation, TabsVariant, TABS_EMPTY_LABEL } from './constants.js';
export type {
	TabsAlignmentType,
	TabsItemProps,
	TabsOrientationType,
	TabsProps,
	TabsVariantType,
} from './types.js';
