// #region css-tokens
/**
 * CSS Tokens for button-group
 * Prefix: `--button-group-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--button-group-border-style` | `solid` |
 * | `--button-group-border-width` | `1px` |
 * | `--button-group-cursor` | `pointer` |
 * | `--button-group-disabled-content-position` | `relative` |
 * | `--button-group-disabled-content-z-index` | `2` |
 * | `--button-group-disabled-cursor` | `not-allowed` |
 * | `--button-group-disabled-opacity` | `0.6` |
 * | `--button-group-disabled-overflow` | `hidden` |
 * | `--button-group-disabled-stripe-after-mask-image` | `linear-gradient(to right, transparent 5%, black...` |
 * | `--button-group-disabled-stripe-after-right` | `0` |
 * | `--button-group-disabled-stripe-background-image` | `repeating-linear-gradient(-45deg, 							transp...` |
 * | `--button-group-disabled-stripe-before-left` | `0` |
 * | `--button-group-disabled-stripe-before-mask-image` | `linear-gradient(to left, transparent 5%, black ...` |
 * | `--button-group-disabled-stripe-bottom` | `0` |
 * | `--button-group-disabled-stripe-content` | `''` |
 * | `--button-group-disabled-stripe-pointer-events` | `none` |
 * | `--button-group-disabled-stripe-position` | `absolute` |
 * | `--button-group-disabled-stripe-top` | `0` |
 * | `--button-group-disabled-stripe-width` | `16px` |
 * | `--button-group-disabled-stripe-z-index` | `1` |
 * | `--button-group-display` | `inline-flex` |
 * | `--button-group-flex-direction` | `column` |
 * | `--button-group-focus-ring` | `-` |
 * | `--button-group-focus-visible-outline` | `var(--button-group-internal-focus-ring) solid 1px` |
 * | `--button-group-focus-visible-outline-offset` | `1px` |
 * | `--button-group-font-family` | `inherit` |
 * | `--button-group-font-size` | `var(--periscope-font-size-small)` |
 * | `--button-group-font-variant-numeric` | `slashed-zero` |
 * | `--button-group-font-weight` | `var(--font-weight-medium)` |
 * | `--button-group-gap` | `var(--spacing-3)` |
 * | `--button-group-height` | `24px` |
 * | `--button-group-icon-flex-shrink` | `0` |
 * | `--button-group-icon-only-padding` | `var(--spacing-3)` |
 * | `--button-group-icon-only-size` | `12px` |
 * | `--button-group-icon-size` | `12px` |
 * | `--button-group-item-align-items` | `center` |
 * | `--button-group-item-border-radius` | `0` |
 * | `--button-group-item-box-sizing` | `border-box` |
 * | `--button-group-item-collapsed-inline-size` | `max-content` |
 * | `--button-group-item-collapsed-inset-block-start` | `0` |
 * | `--button-group-item-collapsed-inset-inline-start` | `0` |
 * | `--button-group-item-collapsed-pointer-events` | `none` |
 * | `--button-group-item-collapsed-position` | `absolute` |
 * | `--button-group-item-collapsed-visibility` | `hidden` |
 * | `--button-group-item-display` | `inline-flex` |
 * | `--button-group-item-flex` | `0 0 auto` |
 * | `--button-group-item-flex-direction` | `row` |
 * | `--button-group-item-focus-z-index` | `2` |
 * | `--button-group-item-hover-z-index` | `1` |
 * | `--button-group-item-isolation` | `isolate` |
 * | `--button-group-item-justify-content` | `center` |
 * | `--button-group-item-margin` | `0` |
 * | `--button-group-item-max-width` | `none` |
 * | `--button-group-item-position` | `relative` |
 * | `--button-group-item-white-space` | `nowrap` |
 * | `--button-group-label-content` | `attr(data-label)` |
 * | `--button-group-label-display` | `block` |
 * | `--button-group-label-max-inline-size` | `120px` |
 * | `--button-group-label-min-width` | `0` |
 * | `--button-group-label-overflow` | `hidden` |
 * | `--button-group-label-text-overflow` | `ellipsis` |
 * | `--button-group-label-white-space` | `nowrap` |
 * | `--button-group-line-height` | `14px` |
 * | `--button-group-loader-idle-animation-play-state` | `paused` |
 * | `--button-group-loader-slot-busy-opacity` | `1` |
 * | `--button-group-loader-slot-busy-transform` | `translateY(0)` |
 * | `--button-group-loader-slot-opacity` | `0` |
 * | `--button-group-loader-slot-transform` | `translateY(var(--button-group-internal-loading-...` |
 * | `--button-group-loader-slot-transition-delay` | `0s` |
 * | `--button-group-loading-cursor` | `wait` |
 * | `--button-group-loading-delay` | `var(--button-group-internal-loading-duration)` |
 * | `--button-group-loading-duration` | `120ms` |
 * | `--button-group-loading-easing` | `cubic-bezier(0.65, 0, 0.35, 1)` |
 * | `--button-group-loading-travel` | `6px` |
 * | `--button-group-max-width` | `var(--button-group-internal-max-width, 100%)` |
 * | `--button-group-measure-display` | `flex` |
 * | `--button-group-measure-height` | `0` |
 * | `--button-group-measure-max-inline-size` | `100%` |
 * | `--button-group-measure-overflow` | `hidden` |
 * | `--button-group-measure-overflow-inset-block-start` | `0` |
 * | `--button-group-measure-overflow-inset-inline-start` | `0` |
 * | `--button-group-measure-overflow-position` | `absolute` |
 * | `--button-group-measure-pointer-events` | `none` |
 * | `--button-group-measure-position` | `relative` |
 * | `--button-group-measure-visibility` | `hidden` |
 * | `--button-group-min-width` | `0` |
 * | `--button-group-overlap` | `-1px` |
 * | `--button-group-padding` | `var(--spacing-2) var(--spacing-4)` |
 * | `--button-group-prefix-slot-busy-opacity` | `0` |
 * | `--button-group-prefix-slot-busy-transform` | `translateY(calc(-1 * var(--button-group-interna...` |
 * | `--button-group-prefix-slot-busy-transition-delay` | `0s` |
 * | `--button-group-prefix-slot-opacity` | `1` |
 * | `--button-group-prefix-slot-transform` | `translateY(0)` |
 * | `--button-group-prefix-wrapper-align-items` | `center` |
 * | `--button-group-prefix-wrapper-display` | `grid` |
 * | `--button-group-prefix-wrapper-empty-grid-template-columns` | `0fr` |
 * | `--button-group-prefix-wrapper-empty-margin-inline-end` | `calc(-1 * var(--button-group-internal-gap))` |
 * | `--button-group-prefix-wrapper-flex-shrink` | `0` |
 * | `--button-group-prefix-wrapper-grid-template-columns` | `1fr` |
 * | `--button-group-prefix-wrapper-justify-items` | `center` |
 * | `--button-group-prefix-wrapper-overflow` | `hidden` |
 * | `--button-group-prefix-wrapper-transition` | `grid-template-columns var(--button-group-intern...` |
 * | `--button-group-prefix-wrapper-transition-delay` | `0s` |
 * | `--button-group-radius` | `var(--radius-1)` |
 * | `--button-group-row-align-items` | `stretch` |
 * | `--button-group-row-display` | `flex` |
 * | `--button-group-row-position` | `relative` |
 * | `--button-group-secondary-outlined-background` | `-` |
 * | `--button-group-secondary-outlined-background-hover` | `-` |
 * | `--button-group-secondary-outlined-border` | `-` |
 * | `--button-group-secondary-outlined-disabled-stripe` | `-` |
 * | `--button-group-secondary-outlined-label` | `-` |
 * | `--button-group-secondary-outlined-label-hover` | `-` |
 * | `--button-group-slot-align-items` | `center` |
 * | `--button-group-slot-display` | `flex` |
 * | `--button-group-slot-grid-area` | `1 / 1` |
 * | `--button-group-slot-justify-content` | `center` |
 * | `--button-group-slot-min-width` | `0` |
 * | `--button-group-slot-transition` | `opacity var(--button-group-internal-loading-dur...` |
 * | `--button-group-suffix-slot-display` | `contents` |
 * | `--button-group-text-decoration` | `none` |
 * | `--button-group-text-spacing` | `-0.005em` |
 * | `--button-group-tooltip-max-width` | `20rem` |
 * | `--button-group-transition` | `background-color 150ms ease, 				color 150ms ea...` |
 * | `--button-group-vertical-align` | `middle` |
 * | `--button-group-width` | `var(--button-group-internal-width, auto)` |
 */
// #endregion css-tokens

export { ButtonGroup } from './button-group.js';
export {
	BUTTON_GROUP_EMPTY_LABEL,
	ButtonGroupColor,
	ButtonGroupSize,
	ButtonGroupTextOverflow,
	ButtonGroupVariant,
} from './constants.js';
export type {
	ButtonGroupActionItemType,
	ButtonGroupColorType,
	ButtonGroupIconItemType,
	ButtonGroupItemDisabledType,
	ButtonGroupItemLoadingType,
	ButtonGroupItemType,
	ButtonGroupLinkItemType,
	ButtonGroupProps,
	ButtonGroupSizeType,
	ButtonGroupTextItemType,
	ButtonGroupTextOverflowType,
	ButtonGroupVariantType,
	ValidateButtonGroupProps,
} from './types.js';
