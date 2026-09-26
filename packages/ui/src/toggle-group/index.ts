// #region css-tokens
/**
 * CSS Tokens for toggle-group
 * Prefix: `--toggle-group-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--toggle-group-affix-align-items` | `center` |
 * | `--toggle-group-affix-display` | `inline-flex` |
 * | `--toggle-group-affix-flex-shrink` | `0` |
 * | `--toggle-group-affix-justify-content` | `center` |
 * | `--toggle-group-align-items` | `stretch` |
 * | `--toggle-group-background-color` | `var(--toggle-group-internal-background)` |
 * | `--toggle-group-border` | `-` |
 * | `--toggle-group-border-color` | `var(--toggle-group-border)` |
 * | `--toggle-group-border-radius` | `var(--radius-1)` |
 * | `--toggle-group-border-width` | `1px` |
 * | `--toggle-group-button-align-items` | `center` |
 * | `--toggle-group-button-background-color` | `transparent` |
 * | `--toggle-group-button-block-size` | `var(--spacing-16)` |
 * | `--toggle-group-button-border` | `none` |
 * | `--toggle-group-button-border-radius` | `0` |
 * | `--toggle-group-button-color` | `var(--toggle-group-internal-label)` |
 * | `--toggle-group-button-cursor` | `pointer` |
 * | `--toggle-group-button-disabled-color` | `var(--toggle-group-internal-label-disabled)` |
 * | `--toggle-group-button-disabled-cursor` | `not-allowed` |
 * | `--toggle-group-button-disabled-opacity` | `0.6` |
 * | `--toggle-group-button-display` | `inline-flex` |
 * | `--toggle-group-button-divider-color` | `var(--toggle-group-border)` |
 * | `--toggle-group-button-divider-width` | `1px` |
 * | `--toggle-group-button-flex-basis` | `auto` |
 * | `--toggle-group-button-flex-grow` | `1` |
 * | `--toggle-group-button-flex-shrink` | `0` |
 * | `--toggle-group-button-focus-visible-outline` | `var(--toggle-group-focus-ring) solid 1px` |
 * | `--toggle-group-button-focus-visible-outline-offset` | `-2px` |
 * | `--toggle-group-button-font-size` | `var(--periscope-font-size-small)` |
 * | `--toggle-group-button-font-weight` | `var(--font-weight-normal)` |
 * | `--toggle-group-button-gap` | `var(--spacing-3)` |
 * | `--toggle-group-button-hover-background-color` | `var(--toggle-group-internal-background-hover)` |
 * | `--toggle-group-button-hover-color` | `var(--toggle-group-internal-label-hover)` |
 * | `--toggle-group-button-icon-size` | `12px` |
 * | `--toggle-group-button-justify-content` | `center` |
 * | `--toggle-group-button-line-height` | `1` |
 * | `--toggle-group-button-padding-block` | `var(--spacing-5)` |
 * | `--toggle-group-button-padding-inline` | `var(--toggle-group-internal-button-padding-inline)` |
 * | `--toggle-group-button-pressed-background-color` | `var(--toggle-group-internal-background-pressed)` |
 * | `--toggle-group-button-pressed-color` | `var(--toggle-group-internal-label-pressed)` |
 * | `--toggle-group-button-white-space` | `nowrap` |
 * | `--toggle-group-disabled-cursor` | `not-allowed` |
 * | `--toggle-group-disabled-opacity` | `0.6` |
 * | `--toggle-group-display` | `inline-flex` |
 * | `--toggle-group-focus-ring` | `-` |
 * | `--toggle-group-inline-size` | `var(--toggle-group-internal-inline-size, fit-co...` |
 * | `--toggle-group-label-max-inline-size` | `120px` |
 * | `--toggle-group-label-min-inline-size` | `0` |
 * | `--toggle-group-label-overflow` | `hidden` |
 * | `--toggle-group-label-text-overflow` | `ellipsis` |
 * | `--toggle-group-label-white-space` | `nowrap` |
 * | `--toggle-group-list-align-items` | `stretch` |
 * | `--toggle-group-list-display` | `inline-flex` |
 * | `--toggle-group-list-flex-direction` | `row` |
 * | `--toggle-group-list-flex-grow` | `1` |
 * | `--toggle-group-max-inline-size` | `var(--toggle-group-internal-max-inline-size, 100%)` |
 * | `--toggle-group-md-button-padding-inline` | `var(--spacing-12)` |
 * | `--toggle-group-overflow` | `hidden` |
 * | `--toggle-group-readonly-cursor` | `not-allowed` |
 * | `--toggle-group-readonly-opacity` | `0.8` |
 * | `--toggle-group-scroll-button-align-items` | `center` |
 * | `--toggle-group-scroll-button-align-self` | `stretch` |
 * | `--toggle-group-scroll-button-background` | `-` |
 * | `--toggle-group-scroll-button-background-color` | `var(--toggle-group-scroll-button-background)` |
 * | `--toggle-group-scroll-button-background-hover` | `-` |
 * | `--toggle-group-scroll-button-border` | `none` |
 * | `--toggle-group-scroll-button-color` | `var(--toggle-group-scroll-button-label)` |
 * | `--toggle-group-scroll-button-cursor` | `pointer` |
 * | `--toggle-group-scroll-button-disabled-color` | `var(--toggle-group-internal-label-disabled)` |
 * | `--toggle-group-scroll-button-disabled-cursor` | `not-allowed` |
 * | `--toggle-group-scroll-button-disabled-shadow` | `none` |
 * | `--toggle-group-scroll-button-display` | `inline-flex` |
 * | `--toggle-group-scroll-button-divider-color` | `var(--toggle-group-border)` |
 * | `--toggle-group-scroll-button-divider-width` | `1px` |
 * | `--toggle-group-scroll-button-flex-basis` | `auto` |
 * | `--toggle-group-scroll-button-flex-grow` | `0` |
 * | `--toggle-group-scroll-button-flex-shrink` | `0` |
 * | `--toggle-group-scroll-button-focus-visible-outline` | `var(--toggle-group-focus-ring) solid 1px` |
 * | `--toggle-group-scroll-button-focus-visible-outline-offset` | `-2px` |
 * | `--toggle-group-scroll-button-hover-background-color` | `var(--toggle-group-scroll-button-background-hover)` |
 * | `--toggle-group-scroll-button-hover-color` | `var(--toggle-group-scroll-button-label-hover)` |
 * | `--toggle-group-scroll-button-icon-size` | `14px` |
 * | `--toggle-group-scroll-button-justify-content` | `center` |
 * | `--toggle-group-scroll-button-label` | `-` |
 * | `--toggle-group-scroll-button-label-hover` | `-` |
 * | `--toggle-group-scroll-button-min-inline-size` | `var(--spacing-12)` |
 * | `--toggle-group-scroll-button-padding-block` | `0` |
 * | `--toggle-group-scroll-button-padding-inline` | `var(--spacing-2)` |
 * | `--toggle-group-scroll-button-position` | `relative` |
 * | `--toggle-group-scroll-button-rtl-icon-transform` | `scaleX(-1)` |
 * | `--toggle-group-scroll-button-shadow` | `0 0 8px 2px var(--toggle-group-scroll-button-sh...` |
 * | `--toggle-group-scroll-button-shadow-color` | `-` |
 * | `--toggle-group-scroll-button-z-index` | `1` |
 * | `--toggle-group-secondary-outlined-background` | `-` |
 * | `--toggle-group-secondary-outlined-background-active` | `-` |
 * | `--toggle-group-secondary-outlined-background-color` | `var(--toggle-group-secondary-outlined-background)` |
 * | `--toggle-group-secondary-outlined-background-hover` | `-` |
 * | `--toggle-group-secondary-outlined-color` | `var(--toggle-group-secondary-outlined-label)` |
 * | `--toggle-group-secondary-outlined-disabled-color` | `var(--toggle-group-secondary-outlined-label-dis...` |
 * | `--toggle-group-secondary-outlined-hover-background-color` | `var(--toggle-group-secondary-outlined-backgroun...` |
 * | `--toggle-group-secondary-outlined-hover-color` | `var(--toggle-group-secondary-outlined-label-hover)` |
 * | `--toggle-group-secondary-outlined-label` | `-` |
 * | `--toggle-group-secondary-outlined-label-active` | `-` |
 * | `--toggle-group-secondary-outlined-label-disabled` | `-` |
 * | `--toggle-group-secondary-outlined-label-hover` | `-` |
 * | `--toggle-group-secondary-outlined-pressed-background-color` | `var(--toggle-group-secondary-outlined-backgroun...` |
 * | `--toggle-group-secondary-outlined-pressed-color` | `var(--toggle-group-secondary-outlined-label-act...` |
 * | `--toggle-group-sm-button-padding-inline` | `var(--spacing-6)` |
 * | `--toggle-group-transition-duration` | `150ms` |
 * | `--toggle-group-viewport-display` | `flex` |
 * | `--toggle-group-viewport-flex-basis` | `auto` |
 * | `--toggle-group-viewport-flex-grow` | `1` |
 * | `--toggle-group-viewport-flex-shrink` | `1` |
 * | `--toggle-group-viewport-min-inline-size` | `0` |
 * | `--toggle-group-viewport-overflow-x` | `auto` |
 * | `--toggle-group-viewport-overflow-y` | `hidden` |
 * | `--toggle-group-viewport-overscroll-behavior` | `contain` |
 * | `--toggle-group-viewport-scroll-behavior` | `smooth` |
 * | `--toggle-group-viewport-scrollbar-display` | `none` |
 * | `--toggle-group-viewport-scrollbar-width` | `none` |
 */
// #endregion css-tokens

export { ToggleGroup } from './toggle-group.js';
export {
	ToggleGroupColor,
	ToggleGroupScrollDirection,
	ToggleGroupSize,
	ToggleGroupType,
	ToggleGroupVariant,
	TOGGLE_GROUP_EMPTY_LABEL,
} from './constants.js';
export type {
	ToggleGroupColorType,
	ToggleGroupDisableType,
	ToggleGroupItemProps,
	ToggleGroupProps,
	ToggleGroupReadOnlyType,
	ToggleGroupScrollDirectionType,
	ToggleGroupSizeType,
	ToggleGroupTypeType,
	ToggleGroupVariantType,
	ValidateToggleGroupProps,
} from './types.js';
