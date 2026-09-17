// #region css-tokens
/**
 * CSS Tokens for tabs
 * Prefix: `--tabs-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--tabs-active-accent-color` | `var(--tabs-primary-indicator)` |
 * | `--tabs-active-slider-border-radius` | `2px` |
 * | `--tabs-active-slider-offset` | `var(--spacing-4)` |
 * | `--tabs-active-slider-position` | `absolute` |
 * | `--tabs-active-slider-thickness` | `2px` |
 * | `--tabs-active-slider-transition` | `left 0.2s cubic-bezier(0.4, 0, 0.2, 1),     wid...` |
 * | `--tabs-active-slider-will-change` | `left, width, top, height` |
 * | `--tabs-active-text-color` | `var(--l1-foreground-hover)` |
 * | `--tabs-bar-content-end-order` | `4` |
 * | `--tabs-bar-content-gap` | `var(--spacing-8)` |
 * | `--tabs-bar-content-start-order` | `0` |
 * | `--tabs-border` | `-` |
 * | `--tabs-border-color` | `var(--tabs-border)` |
 * | `--tabs-border-spacer-flex-basis` | `0%` |
 * | `--tabs-border-spacer-flex-grow` | `var(--tabs-internal-spacer-start-flex-grow, 0)` |
 * | `--tabs-border-spacer-flex-shrink` | `1` |
 * | `--tabs-border-spacer-grow-flex-grow` | `var(--tabs-internal-spacer-grow-flex-grow, 1)` |
 * | `--tabs-border-spacer-grow-flex-shrink` | `0` |
 * | `--tabs-border-spacer-min-block-size` | `var(--tabs-internal-spacer-min-block, 0)` |
 * | `--tabs-border-spacer-min-inline-size` | `var(--tabs-internal-spacer-min-inline, 0)` |
 * | `--tabs-border-width` | `1px` |
 * | `--tabs-content-focus-visible-box-shadow` | `0 0 0 2px var(--ring),       0 0 0 4px var(--ri...` |
 * | `--tabs-content-focus-visible-outline` | `none` |
 * | `--tabs-content-margin` | `var(--spacing-4) 0px 0px 0px` |
 * | `--tabs-content-padding` | `var(--spacing-4)` |
 * | `--tabs-content-vertical-flex` | `1 1 auto` |
 * | `--tabs-content-vertical-margin` | `0px` |
 * | `--tabs-content-vertical-margin-inline-start` | `var(--spacing-4)` |
 * | `--tabs-content-vertical-min-inline-size` | `0` |
 * | `--tabs-display` | `flex` |
 * | `--tabs-extra-content-align-items` | `center` |
 * | `--tabs-extra-content-display` | `flex` |
 * | `--tabs-extra-content-end-flex-grow` | `var(--tabs-extra-content-flex-grow, 0)` |
 * | `--tabs-extra-content-end-flex-shrink` | `var(--tabs-extra-content-flex-shrink, 0)` |
 * | `--tabs-extra-content-end-min-inline-size` | `var(--tabs-extra-content-min-inline-size, auto)` |
 * | `--tabs-extra-content-flex-basis` | `auto` |
 * | `--tabs-extra-content-flex-grow` | `0` |
 * | `--tabs-extra-content-flex-shrink` | `0` |
 * | `--tabs-extra-content-min-inline-size` | `auto` |
 * | `--tabs-extra-content-start-flex-grow` | `var(--tabs-extra-content-flex-grow, 0)` |
 * | `--tabs-extra-content-start-flex-shrink` | `var(--tabs-extra-content-flex-shrink, 0)` |
 * | `--tabs-extra-content-start-min-inline-size` | `var(--tabs-extra-content-min-inline-size, auto)` |
 * | `--tabs-flex-direction` | `var(--tabs-internal-flex-direction)` |
 * | `--tabs-gap` | `var(--spacing-4)` |
 * | `--tabs-hover-slider-bg` | `color-mix(in srgb, var(--l1-foreground) 10%, tr...` |
 * | `--tabs-hover-slider-border-radius` | `2px` |
 * | `--tabs-hover-slider-left` | `0` |
 * | `--tabs-hover-slider-pointer-events` | `none` |
 * | `--tabs-hover-slider-position` | `absolute` |
 * | `--tabs-hover-slider-top` | `0` |
 * | `--tabs-hover-slider-transition` | `transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),   ...` |
 * | `--tabs-hover-slider-will-change` | `transform, width, height, opacity` |
 * | `--tabs-hover-slider-z-index` | `0` |
 * | `--tabs-hover-text-color` | `var(--l1-foreground-hover)` |
 * | `--tabs-icon-align-items` | `center` |
 * | `--tabs-icon-display` | `inline-flex` |
 * | `--tabs-icon-flex-shrink` | `0` |
 * | `--tabs-list-inner-align-items` | `var(--tabs-internal-list-inner-align-items)` |
 * | `--tabs-list-inner-display` | `inline-flex` |
 * | `--tabs-list-inner-position` | `relative` |
 * | `--tabs-list-min-block-size` | `var(--tabs-internal-list-min-block)` |
 * | `--tabs-list-min-inline-size` | `var(--tabs-internal-list-min-inline)` |
 * | `--tabs-list-primary-align-items` | `var(--tabs-internal-list-align-items)` |
 * | `--tabs-list-primary-display` | `inline-flex` |
 * | `--tabs-list-primary-gap` | `var(--tabs-internal-list-primary-gap)` |
 * | `--tabs-list-secondary-align-items` | `var(--tabs-internal-list-align-items)` |
 * | `--tabs-list-secondary-display` | `flex` |
 * | `--tabs-list-viewport-bleed` | `2px` |
 * | `--tabs-list-viewport-flex-basis` | `auto` |
 * | `--tabs-list-viewport-flex-grow` | `0` |
 * | `--tabs-list-viewport-flex-shrink` | `1` |
 * | `--tabs-list-viewport-min-block-size` | `var(--tabs-internal-viewport-min-block)` |
 * | `--tabs-list-viewport-min-inline-size` | `var(--tabs-internal-viewport-min-inline)` |
 * | `--tabs-list-viewport-overscroll-behavior` | `contain` |
 * | `--tabs-list-viewport-scroll-behavior` | `smooth` |
 * | `--tabs-list-viewport-scrollbar-width` | `none` |
 * | `--tabs-list-wrapper-primary-align-items` | `var(--tabs-internal-wrapper-align-items)` |
 * | `--tabs-list-wrapper-primary-display` | `flex` |
 * | `--tabs-list-wrapper-primary-inline-size` | `var(--tabs-internal-wrapper-inline-size)` |
 * | `--tabs-list-wrapper-primary-no-content-padding-block` | `0` |
 * | `--tabs-list-wrapper-primary-no-content-padding-inline` | `0` |
 * | `--tabs-list-wrapper-primary-padding-block` | `var(--tabs-internal-wrapper-padding-block)` |
 * | `--tabs-list-wrapper-primary-padding-inline` | `var(--tabs-internal-wrapper-padding-inline)` |
 * | `--tabs-list-wrapper-primary-text-align` | `start` |
 * | `--tabs-list-wrapper-secondary-display` | `flex` |
 * | `--tabs-list-wrapper-secondary-inline-size` | `var(--tabs-internal-wrapper-inline-size)` |
 * | `--tabs-primary-background-hover` | `-` |
 * | `--tabs-primary-indicator` | `-` |
 * | `--tabs-primary-label` | `-` |
 * | `--tabs-primary-label-hover` | `-` |
 * | `--tabs-scroll-button-align-items` | `center` |
 * | `--tabs-scroll-button-align-self` | `stretch` |
 * | `--tabs-scroll-button-background-color` | `transparent` |
 * | `--tabs-scroll-button-border` | `none` |
 * | `--tabs-scroll-button-color` | `var(--tabs-text-color, var(--l1-foreground))` |
 * | `--tabs-scroll-button-cursor` | `pointer` |
 * | `--tabs-scroll-button-disabled-cursor` | `default` |
 * | `--tabs-scroll-button-disabled-opacity` | `0.4` |
 * | `--tabs-scroll-button-display` | `inline-flex` |
 * | `--tabs-scroll-button-flex-basis` | `auto` |
 * | `--tabs-scroll-button-flex-grow` | `0` |
 * | `--tabs-scroll-button-flex-shrink` | `0` |
 * | `--tabs-scroll-button-focus-visible-outline` | `var(--ring) solid 1px` |
 * | `--tabs-scroll-button-focus-visible-outline-offset` | `1px` |
 * | `--tabs-scroll-button-hover-background-color` | `var(--tabs-primary-background-hover)` |
 * | `--tabs-scroll-button-hover-color` | `var(--l1-foreground-hover)` |
 * | `--tabs-scroll-button-icon-size` | `16px` |
 * | `--tabs-scroll-button-justify-content` | `center` |
 * | `--tabs-scroll-button-min-block-size` | `var(--spacing-12)` |
 * | `--tabs-scroll-button-min-inline-size` | `var(--spacing-12)` |
 * | `--tabs-scroll-button-padding-block` | `var(--spacing-3)` |
 * | `--tabs-scroll-button-padding-inline` | `var(--spacing-3)` |
 * | `--tabs-scroll-button-rtl-icon-transform` | `scaleX(-1)` |
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
 * | `--tabs-trigger-primary-border-radius` | `var(--radius-1)` |
 * | `--tabs-trigger-primary-color` | `var(--tabs-primary-label)` |
 * | `--tabs-trigger-primary-disabled-cursor` | `not-allowed` |
 * | `--tabs-trigger-primary-disabled-opacity` | `0.6` |
 * | `--tabs-trigger-primary-display` | `inline-flex` |
 * | `--tabs-trigger-primary-flex` | `0 0 auto` |
 * | `--tabs-trigger-primary-focus-visible-outline` | `var(--ring) solid 1px` |
 * | `--tabs-trigger-primary-focus-visible-outline-offset` | `1px` |
 * | `--tabs-trigger-primary-font-size` | `var(--periscope-font-size-base)` |
 * | `--tabs-trigger-primary-font-weight` | `var(--font-weight-normal)` |
 * | `--tabs-trigger-primary-gap` | `var(--spacing-4)` |
 * | `--tabs-trigger-primary-hover-background` | `var(--tabs-primary-background-hover)` |
 * | `--tabs-trigger-primary-hover-color` | `var(--tabs-primary-label-hover)` |
 * | `--tabs-trigger-primary-icon-height` | `14px` |
 * | `--tabs-trigger-primary-icon-width` | `14px` |
 * | `--tabs-trigger-primary-line-height` | `20px` |
 * | `--tabs-trigger-primary-max-inline-size` | `100%` |
 * | `--tabs-trigger-primary-padding` | `var(--spacing-3)` |
 * | `--tabs-trigger-primary-position` | `relative` |
 * | `--tabs-trigger-primary-white-space` | `nowrap` |
 * | `--tabs-trigger-primary-z-index` | `10` |
 * | `--tabs-trigger-secondary-active-bg` | `transparent` |
 * | `--tabs-trigger-secondary-active-border-block-end-color` | `transparent` |
 * | `--tabs-trigger-secondary-active-border-inline-end-color` | `transparent` |
 * | `--tabs-trigger-secondary-active-color` | `var(--tabs-secondary-label-active)` |
 * | `--tabs-trigger-secondary-align-items` | `center` |
 * | `--tabs-trigger-secondary-bg` | `var(--tabs-secondary-background)` |
 * | `--tabs-trigger-secondary-border-block-end-width` | `0px` |
 * | `--tabs-trigger-secondary-border-color` | `var(--tabs-border)` |
 * | `--tabs-trigger-secondary-border-inline-end-width` | `0px` |
 * | `--tabs-trigger-secondary-border-radius` | `var(--radius-1)` |
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
 * | `--tabs-trigger-secondary-disabled-stripe-background-image` | `repeating-linear-gradient(             -45deg, ...` |
 * | `--tabs-trigger-secondary-disabled-stripe-before-mask-image` | `linear-gradient(to left, transparent 5%, black ...` |
 * | `--tabs-trigger-secondary-disabled-stripe-color` | `var(--tabs-secondary-stripe-disabled)` |
 * | `--tabs-trigger-secondary-disabled-stripe-content` | `""` |
 * | `--tabs-trigger-secondary-disabled-stripe-inset-block` | `0` |
 * | `--tabs-trigger-secondary-disabled-stripe-pointer-events` | `none` |
 * | `--tabs-trigger-secondary-disabled-stripe-position` | `absolute` |
 * | `--tabs-trigger-secondary-disabled-stripe-size` | `var(--spacing-12)` |
 * | `--tabs-trigger-secondary-disabled-stripe-z-index` | `1` |
 * | `--tabs-trigger-secondary-disabled-z-index` | `0` |
 * | `--tabs-trigger-secondary-display` | `inline-flex` |
 * | `--tabs-trigger-secondary-dot-background-color` | `var(--tabs-primary-indicator)` |
 * | `--tabs-trigger-secondary-dot-border-radius` | `var(--radius-round)` |
 * | `--tabs-trigger-secondary-dot-duration` | `180ms` |
 * | `--tabs-trigger-secondary-dot-easing` | `cubic-bezier(0.34, 1.2, 0.64, 1)` |
 * | `--tabs-trigger-secondary-dot-enter-scale` | `0.2` |
 * | `--tabs-trigger-secondary-dot-inset-block` | `0` |
 * | `--tabs-trigger-secondary-dot-inset-inline-end` | `var(--spacing-6)` |
 * | `--tabs-trigger-secondary-dot-margin-block` | `auto` |
 * | `--tabs-trigger-secondary-dot-position` | `absolute` |
 * | `--tabs-trigger-secondary-dot-size` | `var(--spacing-2)` |
 * | `--tabs-trigger-secondary-dot-travel` | `var(--spacing-2)` |
 * | `--tabs-trigger-secondary-flex` | `0 0 auto` |
 * | `--tabs-trigger-secondary-font-size` | `var(--periscope-font-size-base)` |
 * | `--tabs-trigger-secondary-gap` | `var(--spacing-4)` |
 * | `--tabs-trigger-secondary-hover-bg` | `var(--tabs-secondary-background-hover)` |
 * | `--tabs-trigger-secondary-hover-color` | `var(--tabs-secondary-label-hover)` |
 * | `--tabs-trigger-secondary-icon-flex-shrink` | `0` |
 * | `--tabs-trigger-secondary-icon-height` | `16px` |
 * | `--tabs-trigger-secondary-icon-width` | `16px` |
 * | `--tabs-trigger-secondary-justify-content` | `center` |
 * | `--tabs-trigger-secondary-last-border-inline-end-width` | `var(--tabs-trigger-secondary-border-width, 1px)` |
 * | `--tabs-trigger-secondary-max-inline-size` | `100%` |
 * | `--tabs-trigger-secondary-padding` | `var(--spacing-4) var(--spacing-16)` |
 * | `--tabs-trigger-secondary-position` | `relative` |
 * | `--tabs-trigger-secondary-transition` | `color 150ms ease` |
 * | `--tabs-trigger-secondary-white-space` | `nowrap` |
 * | `--tabs-trigger-text-decoration` | `none` |
 * | `--tabs-vertical-max-block-size` | `100%` |
 */
// #endregion css-tokens

export { Tabs } from './tabs.js';
export {
	TabsAlignment,
	TabsOrientation,
	TabsScrollDirection,
	TabsVariant,
	TABS_EMPTY_LABEL,
} from './constants.js';
export type {
	TabsAlignmentType,
	TabsItemProps,
	TabsItemRenderType,
	TabsOrientationType,
	TabsProps,
	TabsScrollDirectionType,
	TabsVariantType,
} from './types.js';
