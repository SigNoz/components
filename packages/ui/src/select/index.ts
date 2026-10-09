// #region css-tokens
/**
 * CSS Tokens for select
 * Prefix: `--select-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--select-background` | `-` |
 * | `--select-border` | `-` |
 * | `--select-box-sizing` | `border-box` |
 * | `--select-chip-align-items` | `center` |
 * | `--select-chip-background` | `-` |
 * | `--select-chip-background-color` | `var(--select-chip-background)` |
 * | `--select-chip-block-size` | `1.25rem` |
 * | `--select-chip-border-radius` | `var(--radius-1)` |
 * | `--select-chip-box-sizing` | `border-box` |
 * | `--select-chip-color` | `var(--select-chip-label)` |
 * | `--select-chip-display` | `inline-flex` |
 * | `--select-chip-font-size` | `var(--periscope-font-size-small)` |
 * | `--select-chip-gap` | `var(--spacing-1)` |
 * | `--select-chip-label` | `-` |
 * | `--select-chip-label-max-inline-size` | `8rem` |
 * | `--select-chip-label-overflow` | `hidden` |
 * | `--select-chip-label-text-overflow` | `ellipsis` |
 * | `--select-chip-line-height` | `var(--line-height-18)` |
 * | `--select-chip-min-inline-size` | `0` |
 * | `--select-chip-padding-inline` | `var(--spacing-3)` |
 * | `--select-chip-remove-align-items` | `center` |
 * | `--select-chip-remove-background-color` | `transparent` |
 * | `--select-chip-remove-border` | `none` |
 * | `--select-chip-remove-color` | `var(--select-chip-remove-icon)` |
 * | `--select-chip-remove-cursor` | `pointer` |
 * | `--select-chip-remove-display` | `inline-flex` |
 * | `--select-chip-remove-flex-shrink` | `0` |
 * | `--select-chip-remove-hover-color` | `var(--select-chip-remove-icon-hover)` |
 * | `--select-chip-remove-icon` | `-` |
 * | `--select-chip-remove-icon-hover` | `-` |
 * | `--select-chip-remove-icon-size` | `10px` |
 * | `--select-chip-remove-justify-content` | `center` |
 * | `--select-chip-remove-margin` | `0` |
 * | `--select-chip-remove-padding` | `0` |
 * | `--select-chip-white-space` | `nowrap` |
 * | `--select-chips-align-items` | `center` |
 * | `--select-chips-display` | `flex` |
 * | `--select-chips-flex-grow` | `1` |
 * | `--select-chips-flex-wrap` | `wrap` |
 * | `--select-chips-gap` | `var(--spacing-2)` |
 * | `--select-chips-min-inline-size` | `0` |
 * | `--select-display` | `flex` |
 * | `--select-empty-color` | `var(--select-empty-label)` |
 * | `--select-empty-label` | `-` |
 * | `--select-group-display` | `flex` |
 * | `--select-group-flex-direction` | `column` |
 * | `--select-group-label` | `-` |
 * | `--select-group-label-box-sizing` | `border-box` |
 * | `--select-group-label-color` | `var(--select-group-label)` |
 * | `--select-group-label-font-size` | `var(--periscope-font-size-small)` |
 * | `--select-group-label-font-weight` | `var(--font-weight-bold)` |
 * | `--select-group-label-letter-spacing` | `0.04em` |
 * | `--select-group-label-line-height` | `var(--line-height-18)` |
 * | `--select-group-label-padding-block` | `var(--spacing-3)` |
 * | `--select-group-label-padding-inline` | `var(--spacing-6)` |
 * | `--select-group-label-text-transform` | `uppercase` |
 * | `--select-icon-align-items` | `center` |
 * | `--select-icon-chips-block-size` | `var(--select-internal-chip-block-size)` |
 * | `--select-icon-color` | `var(--select-trigger-icon)` |
 * | `--select-icon-display` | `inline-flex` |
 * | `--select-icon-flex-shrink` | `0` |
 * | `--select-icon-justify-content` | `center` |
 * | `--select-icon-readonly-visibility` | `hidden` |
 * | `--select-icon-size` | `14px` |
 * | `--select-item-affix-align-items` | `center` |
 * | `--select-item-affix-display` | `inline-grid` |
 * | `--select-item-affix-flex-shrink` | `0` |
 * | `--select-item-affix-justify-content` | `center` |
 * | `--select-item-align-items` | `center` |
 * | `--select-item-background` | `-` |
 * | `--select-item-background-color` | `var(--select-item-background)` |
 * | `--select-item-background-hover` | `-` |
 * | `--select-item-border` | `none` |
 * | `--select-item-border-radius` | `0` |
 * | `--select-item-box-sizing` | `border-box` |
 * | `--select-item-color` | `var(--select-item-label)` |
 * | `--select-item-control-align-items` | `center` |
 * | `--select-item-control-background-color` | `transparent` |
 * | `--select-item-control-border` | `-` |
 * | `--select-item-control-border-color` | `var(--select-item-control-border)` |
 * | `--select-item-control-border-hover` | `-` |
 * | `--select-item-control-border-radius` | `var(--radius-1)` |
 * | `--select-item-control-border-style` | `solid` |
 * | `--select-item-control-border-width` | `2px` |
 * | `--select-item-control-box-sizing` | `border-box` |
 * | `--select-item-control-check-selected-visibility` | `visible` |
 * | `--select-item-control-check-size` | `12px` |
 * | `--select-item-control-check-visibility` | `hidden` |
 * | `--select-item-control-checked-background` | `-` |
 * | `--select-item-control-checked-foreground` | `-` |
 * | `--select-item-control-display` | `inline-flex` |
 * | `--select-item-control-flex-shrink` | `0` |
 * | `--select-item-control-highlighted-border-color` | `var(--select-item-control-border-hover)` |
 * | `--select-item-control-justify-content` | `center` |
 * | `--select-item-control-selected-background-color` | `var(--select-item-control-checked-background)` |
 * | `--select-item-control-selected-color` | `var(--select-item-control-checked-foreground)` |
 * | `--select-item-control-size` | `16px` |
 * | `--select-item-control-transition-duration` | `150ms` |
 * | `--select-item-control-transition-property` | `background-color, border-color` |
 * | `--select-item-control-transition-timing-function` | `ease` |
 * | `--select-item-cursor` | `pointer` |
 * | `--select-item-disabled-color` | `var(--select-item-label-disabled)` |
 * | `--select-item-disabled-cursor` | `not-allowed` |
 * | `--select-item-display` | `flex` |
 * | `--select-item-focus-outline` | `none` |
 * | `--select-item-font-family` | `inherit` |
 * | `--select-item-font-size` | `var(--periscope-font-size-base)` |
 * | `--select-item-font-weight` | `var(--font-weight-normal)` |
 * | `--select-item-gap` | `var(--spacing-2)` |
 * | `--select-item-highlighted-background-color` | `var(--select-item-background-hover)` |
 * | `--select-item-highlighted-color` | `var(--select-item-label-hover)` |
 * | `--select-item-highlighted-icon-color` | `var(--select-item-icon-hover)` |
 * | `--select-item-icon` | `-` |
 * | `--select-item-icon-color` | `var(--select-item-icon)` |
 * | `--select-item-icon-hover` | `-` |
 * | `--select-item-icon-size` | `14px` |
 * | `--select-item-indicator` | `-` |
 * | `--select-item-indicator-align-items` | `center` |
 * | `--select-item-indicator-color` | `var(--select-item-indicator)` |
 * | `--select-item-indicator-display` | `inline-grid` |
 * | `--select-item-indicator-flex-shrink` | `0` |
 * | `--select-item-indicator-justify-content` | `center` |
 * | `--select-item-indicator-selected-visibility` | `visible` |
 * | `--select-item-indicator-visibility` | `hidden` |
 * | `--select-item-inline-size` | `100%` |
 * | `--select-item-label` | `-` |
 * | `--select-item-label-disabled` | `-` |
 * | `--select-item-label-flex-grow` | `1` |
 * | `--select-item-label-hover` | `-` |
 * | `--select-item-label-min-inline-size` | `0` |
 * | `--select-item-label-overflow` | `hidden` |
 * | `--select-item-label-text-overflow` | `ellipsis` |
 * | `--select-item-label-white-space` | `nowrap` |
 * | `--select-item-line-height` | `var(--line-height-18)` |
 * | `--select-item-margin` | `0` |
 * | `--select-item-padding` | `var(--spacing-4) var(--spacing-6)` |
 * | `--select-item-slot-gap` | `var(--spacing-4)` |
 * | `--select-item-text-align` | `start` |
 * | `--select-item-user-select` | `none` |
 * | `--select-item-white-space` | `nowrap` |
 * | `--select-list-display` | `flex` |
 * | `--select-list-flex-direction` | `column` |
 * | `--select-list-focus-visible-outline` | `none` |
 * | `--select-list-min-block-size` | `0` |
 * | `--select-list-overflow-x` | `hidden` |
 * | `--select-list-overflow-y` | `auto` |
 * | `--select-list-overscroll-behavior` | `contain` |
 * | `--select-list-scroll-padding-block` | `var(--select-scroll-fade-size, var(--spacing-10))` |
 * | `--select-list-scrollbar-width` | `thin` |
 * | `--select-loading-align-items` | `center` |
 * | `--select-loading-color` | `var(--select-loading-label)` |
 * | `--select-loading-display` | `flex` |
 * | `--select-loading-justify-content` | `center` |
 * | `--select-loading-label` | `-` |
 * | `--select-max-block-size` | `var(--select-internal-max-block-size, 20rem)` |
 * | `--select-max-width` | `var(--select-internal-max-width, 100%)` |
 * | `--select-placeholder-color` | `var(--select-trigger-placeholder)` |
 * | `--select-popup-backdrop-filter` | `blur(40px)` |
 * | `--select-popup-background-color` | `var(--select-background)` |
 * | `--select-popup-border-color` | `var(--select-border)` |
 * | `--select-popup-border-radius` | `var(--radius-2)` |
 * | `--select-popup-border-style` | `solid` |
 * | `--select-popup-border-width` | `1px` |
 * | `--select-popup-box-shadow` | `var(--select-shadow)` |
 * | `--select-popup-box-sizing` | `border-box` |
 * | `--select-popup-display` | `flex` |
 * | `--select-popup-flex-direction` | `column` |
 * | `--select-popup-focus-visible-outline` | `none` |
 * | `--select-popup-max-block-size` | `var(--available-height, none)` |
 * | `--select-popup-max-inline-size` | `var(--select-internal-max-inline-size, 15.75rem)` |
 * | `--select-popup-min-inline-size` | `12rem` |
 * | `--select-popup-overflow` | `hidden` |
 * | `--select-popup-padding-block` | `0` |
 * | `--select-popup-padding-inline` | `0` |
 * | `--select-position` | `relative` |
 * | `--select-positioner-focus-visible-outline` | `none` |
 * | `--select-positioner-inline-size` | `max-content` |
 * | `--select-positioner-pointer-events` | `auto` |
 * | `--select-scroll-fade-size` | `var(--spacing-10)` |
 * | `--select-separator` | `-` |
 * | `--select-separator-background-color` | `var(--select-separator)` |
 * | `--select-separator-flex-shrink` | `0` |
 * | `--select-separator-margin-block` | `0` |
 * | `--select-separator-margin-inline` | `0` |
 * | `--select-separator-thickness` | `1px` |
 * | `--select-shadow` | `-` |
 * | `--select-trigger-align-items` | `center` |
 * | `--select-trigger-background` | `-` |
 * | `--select-trigger-background-color` | `var(--select-trigger-background)` |
 * | `--select-trigger-border` | `-` |
 * | `--select-trigger-border-color` | `var(--select-trigger-border)` |
 * | `--select-trigger-border-hover` | `-` |
 * | `--select-trigger-border-radius` | `var(--radius-1)` |
 * | `--select-trigger-border-style` | `solid` |
 * | `--select-trigger-border-width` | `1px` |
 * | `--select-trigger-box-sizing` | `border-box` |
 * | `--select-trigger-chips-align-items` | `flex-start` |
 * | `--select-trigger-chips-inset` | `5px` |
 * | `--select-trigger-color` | `var(--select-trigger-label)` |
 * | `--select-trigger-cursor` | `pointer` |
 * | `--select-trigger-disabled-color` | `var(--select-trigger-label-disabled)` |
 * | `--select-trigger-disabled-cursor` | `not-allowed` |
 * | `--select-trigger-display` | `flex` |
 * | `--select-trigger-flex-grow` | `1` |
 * | `--select-trigger-focus-outline-offset` | `1px` |
 * | `--select-trigger-focus-outline-style` | `solid` |
 * | `--select-trigger-focus-outline-width` | `1px` |
 * | `--select-trigger-focus-ring` | `-` |
 * | `--select-trigger-focus-ring-color` | `var(--select-trigger-focus-ring)` |
 * | `--select-trigger-font-family` | `inherit` |
 * | `--select-trigger-font-size` | `var(--periscope-font-size-base)` |
 * | `--select-trigger-font-weight` | `var(--font-weight-normal)` |
 * | `--select-trigger-gap` | `var(--spacing-4)` |
 * | `--select-trigger-hover-border-color` | `var(--select-trigger-border-hover)` |
 * | `--select-trigger-icon` | `-` |
 * | `--select-trigger-invalid-border-color` | `var(--destructive)` |
 * | `--select-trigger-label` | `-` |
 * | `--select-trigger-label-disabled` | `-` |
 * | `--select-trigger-line-height` | `var(--line-height-18)` |
 * | `--select-trigger-margin` | `0` |
 * | `--select-trigger-min-block-size` | `2rem` |
 * | `--select-trigger-min-inline-size` | `0` |
 * | `--select-trigger-padding-block` | `var(--spacing-2)` |
 * | `--select-trigger-padding-inline-end` | `var(--spacing-4)` |
 * | `--select-trigger-padding-inline-start` | `var(--spacing-6)` |
 * | `--select-trigger-placeholder` | `-` |
 * | `--select-trigger-readonly-cursor` | `not-allowed` |
 * | `--select-trigger-readonly-opacity` | `0.8` |
 * | `--select-trigger-text-align` | `start` |
 * | `--select-trigger-transition-duration` | `150ms` |
 * | `--select-trigger-transition-property` | `border-color` |
 * | `--select-trigger-transition-timing-function` | `ease` |
 * | `--select-value-flex-grow` | `1` |
 * | `--select-value-min-inline-size` | `0` |
 * | `--select-value-overflow` | `hidden` |
 * | `--select-value-prefix-align-items` | `center` |
 * | `--select-value-prefix-display` | `inline-grid` |
 * | `--select-value-prefix-flex-shrink` | `0` |
 * | `--select-value-prefix-justify-content` | `center` |
 * | `--select-value-prefix-size` | `14px` |
 * | `--select-value-text-overflow` | `ellipsis` |
 * | `--select-value-white-space` | `nowrap` |
 * | `--select-width` | `var(--select-internal-width, 100%)` |
 * | `--select-z-index` | `50` |
 */
// #endregion css-tokens

export { Select } from './select.js';
export { SELECT_EMPTY_CONTENT, SELECT_EMPTY_LABEL, SelectItemKind } from './constants.js';
export type {
	SelectGroupChildType,
	SelectGroupItemType,
	SelectItemDisabledType,
	SelectItemKindType,
	SelectItemType,
	SelectOptionItemType,
	SelectProps,
	SelectSeparatorItemType,
	ValidateSelectProps,
} from './types.js';
