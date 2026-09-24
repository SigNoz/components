// #region css-tokens
/**
 * CSS Tokens for button
 * Prefix: `--button-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--button-affix-flex-shrink` | `0` |
 * | `--button-align-items` | `center` |
 * | `--button-archive-background` | `-` |
 * | `--button-archive-background-color` | `var(--button-archive-background)` |
 * | `--button-archive-background-hover` | `-` |
 * | `--button-archive-hover-background-color` | `var(--button-archive-background-hover)` |
 * | `--button-archive-label` | `-` |
 * | `--button-archive-link` | `-` |
 * | `--button-archive-link-color` | `var(--button-archive-link)` |
 * | `--button-archive-link-hover` | `-` |
 * | `--button-archive-link-hover-color` | `var(--button-archive-link-hover)` |
 * | `--button-archive-solid-foreground` | `var(--button-archive-label)` |
 * | `--button-base-border-color` | `transparent` |
 * | `--button-base-border-width` | `0px` |
 * | `--button-border-radius` | `var(--radius-1)` |
 * | `--button-cursor` | `pointer` |
 * | `--button-danger-background` | `-` |
 * | `--button-danger-background-color` | `var(--button-danger-background)` |
 * | `--button-danger-background-hover` | `-` |
 * | `--button-danger-hover-background-color` | `var(--button-danger-background-hover)` |
 * | `--button-danger-label` | `-` |
 * | `--button-danger-link` | `-` |
 * | `--button-danger-link-color` | `var(--button-danger-link)` |
 * | `--button-danger-link-hover` | `-` |
 * | `--button-danger-link-hover-color` | `var(--button-danger-link-hover)` |
 * | `--button-danger-solid-foreground` | `var(--button-danger-label)` |
 * | `--button-dash-border-width` | `1px` |
 * | `--button-dash-duration` | `200ms` |
 * | `--button-dash-gap` | `3px` |
 * | `--button-dash-hover-stroke` | `var(--button-secondary-dashed-stroke-hover)` |
 * | `--button-dash-length` | `3px` |
 * | `--button-dash-stroke` | `var(--button-secondary-dashed-stroke)` |
 * | `--button-dash-stroke-width` | `1px` |
 * | `--button-disabled-cursor` | `not-allowed` |
 * | `--button-disabled-opacity` | `0.6` |
 * | `--button-display` | `inline-flex` |
 * | `--button-flex-direction` | `row` |
 * | `--button-flex-shrink` | `var(--button-internal-flex-shrink, 1)` |
 * | `--button-focus-ring` | `-` |
 * | `--button-focus-visible-outline` | `var(--button-focus-ring) solid 1px` |
 * | `--button-focus-visible-outline-offset` | `1px` |
 * | `--button-font-size` | `var(--periscope-font-size-small)` |
 * | `--button-font-variant-numeric` | `slashed-zero` |
 * | `--button-font-weight` | `var(--font-weight-medium)` |
 * | `--button-gap` | `var(--button-internal-gap)` |
 * | `--button-ghost-content-z-index` | `1` |
 * | `--button-ghost-glow-active-opacity` | `1` |
 * | `--button-ghost-glow-background` | `linear-gradient(90deg, 							color-mix(in srgb...` |
 * | `--button-ghost-glow-background-size` | `200% 100%` |
 * | `--button-ghost-glow-blur` | `6px` |
 * | `--button-ghost-glow-duration` | `2.5s` |
 * | `--button-ghost-glow-fade` | `600ms ease` |
 * | `--button-ghost-glow-inset` | `-4px` |
 * | `--button-ghost-glow-opacity` | `-` |
 * | `--button-ghost-glow-z-index` | `0` |
 * | `--button-height` | `24px` |
 * | `--button-highlight-danger-background` | `-` |
 * | `--button-highlight-danger-background-color` | `var(--button-highlight-danger-background)` |
 * | `--button-highlight-danger-background-hover` | `-` |
 * | `--button-highlight-danger-hover-background-color` | `var(--button-highlight-danger-background-hover)` |
 * | `--button-highlight-danger-label` | `-` |
 * | `--button-highlight-danger-link` | `-` |
 * | `--button-highlight-danger-link-color` | `var(--button-highlight-danger-link)` |
 * | `--button-highlight-danger-link-hover` | `-` |
 * | `--button-highlight-danger-link-hover-color` | `var(--button-highlight-danger-link-hover)` |
 * | `--button-highlight-danger-solid-foreground` | `var(--button-highlight-danger-label)` |
 * | `--button-hover-state-background-color` | `var(--button-internal-hover-background)` |
 * | `--button-icon-size` | `12px` |
 * | `--button-info-background` | `-` |
 * | `--button-info-background-color` | `var(--button-info-background)` |
 * | `--button-info-background-hover` | `-` |
 * | `--button-info-hover-background-color` | `var(--button-info-background-hover)` |
 * | `--button-info-label` | `-` |
 * | `--button-info-link` | `-` |
 * | `--button-info-link-color` | `var(--button-info-link)` |
 * | `--button-info-link-hover` | `-` |
 * | `--button-info-link-hover-color` | `var(--button-info-link-hover)` |
 * | `--button-info-solid-foreground` | `var(--button-info-label)` |
 * | `--button-isolation` | `isolate` |
 * | `--button-justify-content` | `center` |
 * | `--button-label-display` | `block` |
 * | `--button-label-min-width` | `0` |
 * | `--button-label-overflow` | `hidden` |
 * | `--button-label-text-overflow` | `ellipsis` |
 * | `--button-label-tooltip-max-width` | `20rem` |
 * | `--button-label-white-space` | `nowrap` |
 * | `--button-loader-slot-hidden-opacity` | `0` |
 * | `--button-loader-slot-hidden-transform` | `translateY(var(--button-internal-loading-travel))` |
 * | `--button-loader-slot-idle-animation-play-state` | `paused` |
 * | `--button-loader-slot-visible-opacity` | `1` |
 * | `--button-loader-slot-visible-transform` | `translateY(0)` |
 * | `--button-loading-cursor` | `wait` |
 * | `--button-loading-delay` | `var(--button-internal-loading-duration)` |
 * | `--button-loading-duration` | `120ms` |
 * | `--button-loading-easing` | `cubic-bezier(0.65, 0, 0.35, 1)` |
 * | `--button-loading-opacity` | `1` |
 * | `--button-loading-travel` | `6px` |
 * | `--button-max-width` | `var(--button-internal-max-width, 100%)` |
 * | `--button-min-width` | `var(--button-internal-min-width, auto)` |
 * | `--button-padding` | `var(--spacing-2) var(--spacing-4)` |
 * | `--button-prefix-slot-hidden-opacity` | `0` |
 * | `--button-prefix-slot-hidden-transform` | `translateY(calc(-1 * var(--button-internal-load...` |
 * | `--button-prefix-slot-visible-opacity` | `1` |
 * | `--button-prefix-slot-visible-transform` | `translateY(0)` |
 * | `--button-prefix-wrapper-align-items` | `center` |
 * | `--button-prefix-wrapper-block-size` | `var(--button-internal-icon-size)` |
 * | `--button-prefix-wrapper-collapsed-grid-template-columns` | `0fr` |
 * | `--button-prefix-wrapper-collapsed-margin-inline-end` | `calc(-1 * var(--button-internal-gap))` |
 * | `--button-prefix-wrapper-display` | `grid` |
 * | `--button-prefix-wrapper-flex-shrink` | `0` |
 * | `--button-prefix-wrapper-grid-template-columns` | `1fr` |
 * | `--button-prefix-wrapper-justify-items` | `center` |
 * | `--button-prefix-wrapper-overflow` | `hidden` |
 * | `--button-prefix-wrapper-transition` | `grid-template-columns var(--button-internal-loa...` |
 * | `--button-primary-background` | `-` |
 * | `--button-primary-background-color` | `var(--button-primary-background)` |
 * | `--button-primary-background-hover` | `-` |
 * | `--button-primary-hover-background-color` | `var(--button-primary-background-hover)` |
 * | `--button-primary-label` | `-` |
 * | `--button-primary-link` | `-` |
 * | `--button-primary-link-color` | `var(--button-primary-link)` |
 * | `--button-primary-link-hover` | `-` |
 * | `--button-primary-link-hover-color` | `var(--button-primary-link-hover)` |
 * | `--button-primary-solid-foreground` | `var(--button-primary-label)` |
 * | `--button-secondary-background` | `-` |
 * | `--button-secondary-background-color` | `var(--button-secondary-background)` |
 * | `--button-secondary-background-hover` | `-` |
 * | `--button-secondary-dashed-label` | `-` |
 * | `--button-secondary-dashed-label-hover` | `-` |
 * | `--button-secondary-dashed-stroke` | `-` |
 * | `--button-secondary-dashed-stroke-hover` | `-` |
 * | `--button-secondary-ghost-background-hover` | `-` |
 * | `--button-secondary-ghost-label` | `-` |
 * | `--button-secondary-ghost-label-hover` | `-` |
 * | `--button-secondary-hover-background-color` | `var(--button-secondary-background-hover)` |
 * | `--button-secondary-label` | `-` |
 * | `--button-secondary-link` | `-` |
 * | `--button-secondary-link-color` | `var(--button-secondary-link)` |
 * | `--button-secondary-link-hover` | `-` |
 * | `--button-secondary-link-hover-color` | `var(--button-secondary-link-hover)` |
 * | `--button-secondary-outlined-background` | `-` |
 * | `--button-secondary-outlined-background-hover` | `-` |
 * | `--button-secondary-outlined-border` | `-` |
 * | `--button-secondary-outlined-disabled-stripe` | `-` |
 * | `--button-secondary-outlined-label` | `-` |
 * | `--button-secondary-outlined-label-hover` | `-` |
 * | `--button-secondary-solid-foreground` | `var(--button-secondary-label)` |
 * | `--button-size-line-height` | `14px` |
 * | `--button-slot-align-items` | `center` |
 * | `--button-slot-display` | `flex` |
 * | `--button-slot-justify-content` | `center` |
 * | `--button-slot-min-width` | `0` |
 * | `--button-slot-transition` | `opacity var(--button-internal-loading-duration)...` |
 * | `--button-success-background` | `-` |
 * | `--button-success-background-color` | `var(--button-success-background)` |
 * | `--button-success-background-hover` | `-` |
 * | `--button-success-hover-background-color` | `var(--button-success-background-hover)` |
 * | `--button-success-label` | `-` |
 * | `--button-success-link` | `-` |
 * | `--button-success-link-color` | `var(--button-success-link)` |
 * | `--button-success-link-hover` | `-` |
 * | `--button-success-link-hover-color` | `var(--button-success-link-hover)` |
 * | `--button-success-solid-foreground` | `var(--button-success-label)` |
 * | `--button-text-spacing` | `-0.005em` |
 * | `--button-transition` | `background-color 150ms ease, 			color 150ms eas...` |
 * | `--button-variant-dashed-background-color` | `transparent` |
 * | `--button-variant-dashed-border` | `1px solid transparent` |
 * | `--button-variant-dashed-color` | `var(--button-secondary-dashed-label)` |
 * | `--button-variant-dashed-hover-background-color` | `transparent` |
 * | `--button-variant-dashed-hover-color` | `var(--button-secondary-dashed-label-hover)` |
 * | `--button-variant-dashed-position` | `relative` |
 * | `--button-variant-ghost-background-color` | `transparent` |
 * | `--button-variant-ghost-color` | `var(--button-secondary-ghost-label)` |
 * | `--button-variant-ghost-glow-opacity` | `var(--button-ghost-glow-opacity)` |
 * | `--button-variant-ghost-hover-background-color` | `var(--button-secondary-ghost-background-hover)` |
 * | `--button-variant-ghost-hover-color` | `var(--button-secondary-ghost-label-hover)` |
 * | `--button-variant-ghost-overflow` | `hidden` |
 * | `--button-variant-ghost-position` | `relative` |
 * | `--button-variant-link-background-color` | `transparent` |
 * | `--button-variant-link-color` | `var(--button-internal-link-foreground)` |
 * | `--button-variant-link-font-weight` | `var(--font-weight-medium)` |
 * | `--button-variant-link-hover-background-color` | `transparent` |
 * | `--button-variant-link-hover-color` | `var(--button-internal-link-hover-foreground)` |
 * | `--button-variant-outlined-background-color` | `var(--button-secondary-outlined-background)` |
 * | `--button-variant-outlined-border` | `1px solid var(--button-secondary-outlined-border)` |
 * | `--button-variant-outlined-color` | `var(--button-secondary-outlined-label)` |
 * | `--button-variant-outlined-disabled-content-position` | `relative` |
 * | `--button-variant-outlined-disabled-content-z-index` | `2` |
 * | `--button-variant-outlined-disabled-overflow` | `hidden` |
 * | `--button-variant-outlined-disabled-position` | `relative` |
 * | `--button-variant-outlined-disabled-stripe-after-mask-image` | `linear-gradient(to right, transparent 5%, black...` |
 * | `--button-variant-outlined-disabled-stripe-after-right` | `0` |
 * | `--button-variant-outlined-disabled-stripe-background-image` | `repeating-linear-gradient(-45deg, 								trans...` |
 * | `--button-variant-outlined-disabled-stripe-before-left` | `0` |
 * | `--button-variant-outlined-disabled-stripe-before-mask-image` | `linear-gradient(to left, transparent 5%, black ...` |
 * | `--button-variant-outlined-disabled-stripe-bottom` | `0` |
 * | `--button-variant-outlined-disabled-stripe-color` | `var(--button-secondary-outlined-disabled-stripe)` |
 * | `--button-variant-outlined-disabled-stripe-content` | `""` |
 * | `--button-variant-outlined-disabled-stripe-pointer-events` | `none` |
 * | `--button-variant-outlined-disabled-stripe-position` | `absolute` |
 * | `--button-variant-outlined-disabled-stripe-top` | `0` |
 * | `--button-variant-outlined-disabled-stripe-width` | `16px` |
 * | `--button-variant-outlined-disabled-stripe-z-index` | `1` |
 * | `--button-variant-outlined-hover-background-color` | `var(--button-secondary-outlined-background-hover)` |
 * | `--button-variant-outlined-hover-color` | `var(--button-secondary-outlined-label-hover)` |
 * | `--button-warning-background` | `-` |
 * | `--button-warning-background-color` | `var(--button-warning-background)` |
 * | `--button-warning-background-hover` | `-` |
 * | `--button-warning-hover-background-color` | `var(--button-warning-background-hover)` |
 * | `--button-warning-label` | `-` |
 * | `--button-warning-link` | `-` |
 * | `--button-warning-link-color` | `var(--button-warning-link)` |
 * | `--button-warning-link-hover` | `-` |
 * | `--button-warning-link-hover-color` | `var(--button-warning-link-hover)` |
 * | `--button-warning-solid-foreground` | `var(--button-warning-label)` |
 * | `--button-white-space` | `nowrap` |
 * | `--button-width` | `var(--button-internal-width, auto)` |
 */
// #endregion css-tokens

export { Button, buttonVariants } from './button.js';
export { ButtonTextOverflow, ButtonColor, ButtonSize, ButtonVariant } from './constants.js';
export type {
	ButtonBaseProps,
	ButtonProps,
	ColoredVariantProps,
	ColorType,
	DisableType,
	IconButtonProps,
	IconPrefixSuffixType,
	SecondaryOnlyVariantProps,
	TextButtonProps,
	TextOverflowType,
	SizeType,
	ValidateButtonProps,
	VariantColorType,
	VariantType,
} from './types.js';
