// #region css-tokens
/**
 * CSS Tokens for button
 * Prefix: `--button-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--button-affix-flex-shrink` | `0` |
 * | `--button-align-items` | `center` |
 * | `--button-archive-background` | `var(--bg-sienna-500)` |
 * | `--button-archive-hover-background` | `var(--bg-sienna-400)` |
 * | `--button-archive-link-foreground` | `var(--bg-sienna-400)` |
 * | `--button-archive-link-hover-foreground` | `var(--bg-sienna-500)` |
 * | `--button-archive-solid-foreground` | `var(--text-ink-500)` |
 * | `--button-base-border-color` | `transparent` |
 * | `--button-base-border-width` | `0px` |
 * | `--button-border-radius` | `var(--radius-1)` |
 * | `--button-cursor` | `pointer` |
 * | `--button-danger-background` | `var(--danger-background)` |
 * | `--button-danger-hover-background` | `var(--danger-background-hover)` |
 * | `--button-danger-link-foreground` | `var(--danger-link)` |
 * | `--button-danger-link-hover-foreground` | `var(--danger-link-hover)` |
 * | `--button-danger-solid-foreground` | `var(--danger-foreground)` |
 * | `--button-dash-border-width` | `1px` |
 * | `--button-dash-duration` | `200ms` |
 * | `--button-dash-gap` | `3px` |
 * | `--button-dash-hover-stroke` | `var(--secondary-background-hover)` |
 * | `--button-dash-length` | `3px` |
 * | `--button-dash-stroke` | `var(--secondary-border)` |
 * | `--button-dash-stroke-width` | `1px` |
 * | `--button-disabled-cursor` | `not-allowed` |
 * | `--button-disabled-opacity` | `0.6` |
 * | `--button-display` | `inline-flex` |
 * | `--button-flex-direction` | `row` |
 * | `--button-focus-visible-outline` | `var(--ring) solid 1px` |
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
 * | `--button-ghost-glow-opacity` | `22%` |
 * | `--button-ghost-glow-z-index` | `0` |
 * | `--button-height` | `24px` |
 * | `--button-highlight-danger-background` | `var(--bg-sakura-500)` |
 * | `--button-highlight-danger-hover-background` | `var(--bg-sakura-400)` |
 * | `--button-highlight-danger-link-foreground` | `var(--bg-sakura-400)` |
 * | `--button-highlight-danger-link-hover-foreground` | `var(--bg-sakura-500)` |
 * | `--button-highlight-danger-solid-foreground` | `var(--text-ink-500)` |
 * | `--button-hover-state-background-color` | `var(--button-internal-hover-background)` |
 * | `--button-icon-size` | `12px` |
 * | `--button-info-background` | `var(--bg-aqua-500)` |
 * | `--button-info-hover-background` | `var(--bg-aqua-400)` |
 * | `--button-info-link-foreground` | `var(--bg-aqua-400)` |
 * | `--button-info-link-hover-foreground` | `var(--bg-aqua-500)` |
 * | `--button-info-solid-foreground` | `var(--text-ink-500)` |
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
 * | `--button-primary-background` | `var(--primary-background)` |
 * | `--button-primary-hover-background` | `var(--primary-background-hover)` |
 * | `--button-primary-link-foreground` | `var(--primary-link)` |
 * | `--button-primary-link-hover-foreground` | `var(--primary-hover)` |
 * | `--button-primary-solid-foreground` | `var(--primary-foreground)` |
 * | `--button-secondary-background` | `var(--secondary-background)` |
 * | `--button-secondary-hover-background` | `var(--secondary-background-hover)` |
 * | `--button-secondary-link-foreground` | `var(--secondary-link)` |
 * | `--button-secondary-link-hover-foreground` | `var(--secondary-link-hover)` |
 * | `--button-secondary-solid-foreground` | `var(--secondary-foreground)` |
 * | `--button-size-line-height` | `14px` |
 * | `--button-slot-align-items` | `center` |
 * | `--button-slot-display` | `flex` |
 * | `--button-slot-justify-content` | `center` |
 * | `--button-slot-min-width` | `0` |
 * | `--button-slot-transition` | `opacity var(--button-internal-loading-duration)...` |
 * | `--button-success-background` | `var(--success-background)` |
 * | `--button-success-hover-background` | `var(--success-background-hover)` |
 * | `--button-success-link-foreground` | `var(--success-link)` |
 * | `--button-success-link-hover-foreground` | `var(--success-link-hover)` |
 * | `--button-success-solid-foreground` | `var(--success-foreground)` |
 * | `--button-text-spacing` | `-0.005em` |
 * | `--button-transition` | `background-color 150ms ease, 			color 150ms eas...` |
 * | `--button-variant-dashed-background-color` | `transparent` |
 * | `--button-variant-dashed-border` | `1px solid transparent` |
 * | `--button-variant-dashed-color` | `var(--secondary-foreground)` |
 * | `--button-variant-dashed-hover-background-color` | `transparent` |
 * | `--button-variant-dashed-hover-color` | `var(--secondary-foreground-hover)` |
 * | `--button-variant-dashed-position` | `relative` |
 * | `--button-variant-ghost-background-color` | `transparent` |
 * | `--button-variant-ghost-color` | `var(--secondary-foreground)` |
 * | `--button-variant-ghost-hover-background-color` | `var(--secondary-background-hover)` |
 * | `--button-variant-ghost-hover-color` | `var(--secondary-foreground-hover)` |
 * | `--button-variant-ghost-overflow` | `hidden` |
 * | `--button-variant-ghost-position` | `relative` |
 * | `--button-variant-link-background-color` | `transparent` |
 * | `--button-variant-link-color` | `var(--button-internal-link-foreground)` |
 * | `--button-variant-link-font-weight` | `var(--font-weight-medium)` |
 * | `--button-variant-link-hover-background-color` | `transparent` |
 * | `--button-variant-link-hover-color` | `var(--button-internal-link-hover-foreground)` |
 * | `--button-variant-outlined-background-color` | `var(--secondary-background)` |
 * | `--button-variant-outlined-border` | `1px solid var(--secondary-border)` |
 * | `--button-variant-outlined-color` | `var(--secondary-foreground)` |
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
 * | `--button-variant-outlined-disabled-stripe-color` | `var(--secondary-border)` |
 * | `--button-variant-outlined-disabled-stripe-content` | `""` |
 * | `--button-variant-outlined-disabled-stripe-pointer-events` | `none` |
 * | `--button-variant-outlined-disabled-stripe-position` | `absolute` |
 * | `--button-variant-outlined-disabled-stripe-top` | `0` |
 * | `--button-variant-outlined-disabled-stripe-width` | `16px` |
 * | `--button-variant-outlined-disabled-stripe-z-index` | `1` |
 * | `--button-variant-outlined-hover-background-color` | `var(--secondary-background-hover)` |
 * | `--button-variant-outlined-hover-color` | `var(--secondary-foreground-hover)` |
 * | `--button-warning-background` | `var(--warning-background)` |
 * | `--button-warning-hover-background` | `var(--warning-background-hover)` |
 * | `--button-warning-link-foreground` | `var(--warning-link)` |
 * | `--button-warning-link-hover-foreground` | `var(--warning-link-hover)` |
 * | `--button-warning-solid-foreground` | `var(--warning-foreground)` |
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
