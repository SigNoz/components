// #region css-tokens
/**
 * CSS Tokens for combobox
 * Prefix: `--combobox-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--combobox-background` | `-` |
 * | `--combobox-border` | `-` |
 * | `--combobox-box-sizing` | `border-box` |
 * | `--combobox-chip-align-items` | `center` |
 * | `--combobox-chip-background` | `-` |
 * | `--combobox-chip-background-color` | `var(--combobox-chip-background)` |
 * | `--combobox-chip-block-size` | `1.25rem` |
 * | `--combobox-chip-border-radius` | `var(--radius-1)` |
 * | `--combobox-chip-box-sizing` | `border-box` |
 * | `--combobox-chip-color` | `var(--combobox-chip-label)` |
 * | `--combobox-chip-display` | `inline-flex` |
 * | `--combobox-chip-font-size` | `var(--periscope-font-size-small)` |
 * | `--combobox-chip-gap` | `var(--spacing-1)` |
 * | `--combobox-chip-label` | `-` |
 * | `--combobox-chip-label-max-inline-size` | `8rem` |
 * | `--combobox-chip-label-overflow` | `hidden` |
 * | `--combobox-chip-label-text-overflow` | `ellipsis` |
 * | `--combobox-chip-line-height` | `var(--line-height-18)` |
 * | `--combobox-chip-min-inline-size` | `0` |
 * | `--combobox-chip-padding-inline` | `var(--spacing-3)` |
 * | `--combobox-chip-remove-align-items` | `center` |
 * | `--combobox-chip-remove-background-color` | `transparent` |
 * | `--combobox-chip-remove-border` | `none` |
 * | `--combobox-chip-remove-color` | `var(--combobox-chip-remove-icon)` |
 * | `--combobox-chip-remove-cursor` | `pointer` |
 * | `--combobox-chip-remove-display` | `inline-flex` |
 * | `--combobox-chip-remove-flex-shrink` | `0` |
 * | `--combobox-chip-remove-hover-color` | `var(--combobox-chip-remove-icon-hover)` |
 * | `--combobox-chip-remove-icon` | `-` |
 * | `--combobox-chip-remove-icon-hover` | `-` |
 * | `--combobox-chip-remove-icon-size` | `10px` |
 * | `--combobox-chip-remove-justify-content` | `center` |
 * | `--combobox-chip-remove-margin` | `0` |
 * | `--combobox-chip-remove-padding` | `0` |
 * | `--combobox-chip-white-space` | `nowrap` |
 * | `--combobox-chips-align-items` | `center` |
 * | `--combobox-chips-display` | `flex` |
 * | `--combobox-chips-flex-grow` | `1` |
 * | `--combobox-chips-flex-wrap` | `wrap` |
 * | `--combobox-chips-gap` | `var(--spacing-2)` |
 * | `--combobox-chips-min-inline-size` | `0` |
 * | `--combobox-clear-align-items` | `center` |
 * | `--combobox-clear-background-color` | `transparent` |
 * | `--combobox-clear-border` | `none` |
 * | `--combobox-clear-chips-block-size` | `var(--combobox-internal-chip-block-size)` |
 * | `--combobox-clear-chips-inset-block` | `calc(var(--combobox-trigger-border-width, 1px) ...` |
 * | `--combobox-clear-cursor` | `pointer` |
 * | `--combobox-clear-display` | `inline-flex` |
 * | `--combobox-clear-hover-color` | `var(--combobox-trigger-icon-hover)` |
 * | `--combobox-clear-hover-visibility` | `visible` |
 * | `--combobox-clear-inset-block` | `0` |
 * | `--combobox-clear-inset-inline-end` | `calc(var(--spacing-4) + 1px)` |
 * | `--combobox-clear-justify-content` | `center` |
 * | `--combobox-clear-margin` | `0` |
 * | `--combobox-clear-padding` | `0` |
 * | `--combobox-clear-position` | `absolute` |
 * | `--combobox-clear-visibility` | `hidden` |
 * | `--combobox-display` | `flex` |
 * | `--combobox-empty-color` | `var(--combobox-empty-label)` |
 * | `--combobox-empty-label` | `-` |
 * | `--combobox-footer-border-color` | `var(--combobox-search-border)` |
 * | `--combobox-footer-border-style` | `solid` |
 * | `--combobox-footer-border-width` | `1px` |
 * | `--combobox-footer-display` | `flex` |
 * | `--combobox-footer-flex-direction` | `column` |
 * | `--combobox-footer-flex-shrink` | `0` |
 * | `--combobox-footer-margin-block-start` | `0` |
 * | `--combobox-footer-padding-block-start` | `0` |
 * | `--combobox-group-display` | `flex` |
 * | `--combobox-group-flex-direction` | `column` |
 * | `--combobox-group-label` | `-` |
 * | `--combobox-group-label-box-sizing` | `border-box` |
 * | `--combobox-group-label-color` | `var(--combobox-group-label)` |
 * | `--combobox-group-label-font-size` | `var(--periscope-font-size-small)` |
 * | `--combobox-group-label-font-weight` | `var(--font-weight-bold)` |
 * | `--combobox-group-label-letter-spacing` | `0.04em` |
 * | `--combobox-group-label-line-height` | `var(--line-height-18)` |
 * | `--combobox-group-label-padding-block` | `var(--spacing-3)` |
 * | `--combobox-group-label-padding-inline` | `var(--spacing-6)` |
 * | `--combobox-group-label-text-transform` | `uppercase` |
 * | `--combobox-hint-font-style` | `italic` |
 * | `--combobox-icon-align-items` | `center` |
 * | `--combobox-icon-chips-block-size` | `var(--combobox-internal-chip-block-size)` |
 * | `--combobox-icon-clearable-visibility` | `hidden` |
 * | `--combobox-icon-color` | `var(--combobox-trigger-icon)` |
 * | `--combobox-icon-display` | `inline-flex` |
 * | `--combobox-icon-flex-shrink` | `0` |
 * | `--combobox-icon-justify-content` | `center` |
 * | `--combobox-icon-readonly-visibility` | `hidden` |
 * | `--combobox-icon-size` | `14px` |
 * | `--combobox-item-affix-align-items` | `center` |
 * | `--combobox-item-affix-display` | `inline-grid` |
 * | `--combobox-item-affix-flex-shrink` | `0` |
 * | `--combobox-item-affix-justify-content` | `center` |
 * | `--combobox-item-align-items` | `center` |
 * | `--combobox-item-background` | `-` |
 * | `--combobox-item-background-color` | `var(--combobox-item-background)` |
 * | `--combobox-item-background-hover` | `-` |
 * | `--combobox-item-border` | `none` |
 * | `--combobox-item-border-radius` | `0` |
 * | `--combobox-item-box-sizing` | `border-box` |
 * | `--combobox-item-color` | `var(--combobox-item-label)` |
 * | `--combobox-item-control-align-items` | `center` |
 * | `--combobox-item-control-background-color` | `transparent` |
 * | `--combobox-item-control-border` | `-` |
 * | `--combobox-item-control-border-color` | `var(--combobox-item-control-border)` |
 * | `--combobox-item-control-border-hover` | `-` |
 * | `--combobox-item-control-border-radius` | `var(--radius-1)` |
 * | `--combobox-item-control-border-style` | `solid` |
 * | `--combobox-item-control-border-width` | `2px` |
 * | `--combobox-item-control-box-sizing` | `border-box` |
 * | `--combobox-item-control-check-selected-visibility` | `visible` |
 * | `--combobox-item-control-check-size` | `12px` |
 * | `--combobox-item-control-check-visibility` | `hidden` |
 * | `--combobox-item-control-checked-background` | `-` |
 * | `--combobox-item-control-checked-foreground` | `-` |
 * | `--combobox-item-control-display` | `inline-flex` |
 * | `--combobox-item-control-flex-shrink` | `0` |
 * | `--combobox-item-control-highlighted-border-color` | `var(--combobox-item-control-border-hover)` |
 * | `--combobox-item-control-justify-content` | `center` |
 * | `--combobox-item-control-selected-background-color` | `var(--combobox-item-control-checked-background)` |
 * | `--combobox-item-control-selected-color` | `var(--combobox-item-control-checked-foreground)` |
 * | `--combobox-item-control-size` | `16px` |
 * | `--combobox-item-control-transition-duration` | `150ms` |
 * | `--combobox-item-control-transition-property` | `background-color, border-color` |
 * | `--combobox-item-control-transition-timing-function` | `ease` |
 * | `--combobox-item-cursor` | `pointer` |
 * | `--combobox-item-disabled-color` | `var(--combobox-item-label-disabled)` |
 * | `--combobox-item-disabled-cursor` | `not-allowed` |
 * | `--combobox-item-display` | `flex` |
 * | `--combobox-item-focus-outline` | `none` |
 * | `--combobox-item-font-family` | `inherit` |
 * | `--combobox-item-font-size` | `var(--periscope-font-size-base)` |
 * | `--combobox-item-font-weight` | `var(--font-weight-normal)` |
 * | `--combobox-item-gap` | `var(--spacing-2)` |
 * | `--combobox-item-highlighted-background-color` | `var(--combobox-item-background-hover)` |
 * | `--combobox-item-highlighted-color` | `var(--combobox-item-label-hover)` |
 * | `--combobox-item-highlighted-icon-color` | `var(--combobox-item-icon-hover)` |
 * | `--combobox-item-icon` | `-` |
 * | `--combobox-item-icon-color` | `var(--combobox-item-icon)` |
 * | `--combobox-item-icon-hover` | `-` |
 * | `--combobox-item-icon-size` | `14px` |
 * | `--combobox-item-indicator` | `-` |
 * | `--combobox-item-indicator-align-items` | `center` |
 * | `--combobox-item-indicator-color` | `var(--combobox-item-indicator)` |
 * | `--combobox-item-indicator-display` | `inline-grid` |
 * | `--combobox-item-indicator-flex-shrink` | `0` |
 * | `--combobox-item-indicator-justify-content` | `center` |
 * | `--combobox-item-indicator-selected-visibility` | `visible` |
 * | `--combobox-item-indicator-visibility` | `hidden` |
 * | `--combobox-item-inline-size` | `100%` |
 * | `--combobox-item-label` | `-` |
 * | `--combobox-item-label-disabled` | `-` |
 * | `--combobox-item-label-flex-grow` | `1` |
 * | `--combobox-item-label-hover` | `-` |
 * | `--combobox-item-label-min-inline-size` | `0` |
 * | `--combobox-item-label-overflow` | `hidden` |
 * | `--combobox-item-label-text-overflow` | `ellipsis` |
 * | `--combobox-item-label-white-space` | `nowrap` |
 * | `--combobox-item-line-height` | `var(--line-height-18)` |
 * | `--combobox-item-margin` | `0` |
 * | `--combobox-item-padding` | `var(--spacing-4) var(--spacing-6)` |
 * | `--combobox-item-slot-gap` | `var(--spacing-4)` |
 * | `--combobox-item-text-align` | `start` |
 * | `--combobox-item-user-select` | `none` |
 * | `--combobox-item-white-space` | `nowrap` |
 * | `--combobox-list-display` | `flex` |
 * | `--combobox-list-flex-direction` | `column` |
 * | `--combobox-list-focus-visible-outline` | `none` |
 * | `--combobox-loading-align-items` | `center` |
 * | `--combobox-loading-color` | `var(--combobox-loading-label)` |
 * | `--combobox-loading-display` | `flex` |
 * | `--combobox-loading-justify-content` | `center` |
 * | `--combobox-loading-label` | `-` |
 * | `--combobox-max-block-size` | `var(--combobox-internal-max-block-size, 20rem)` |
 * | `--combobox-max-width` | `var(--combobox-internal-max-width, 100%)` |
 * | `--combobox-placeholder-color` | `var(--combobox-trigger-placeholder)` |
 * | `--combobox-popup-backdrop-filter` | `blur(40px)` |
 * | `--combobox-popup-background-color` | `var(--combobox-background)` |
 * | `--combobox-popup-border-color` | `var(--combobox-border)` |
 * | `--combobox-popup-border-radius` | `var(--radius-2)` |
 * | `--combobox-popup-border-style` | `solid` |
 * | `--combobox-popup-border-width` | `1px` |
 * | `--combobox-popup-box-shadow` | `var(--combobox-shadow)` |
 * | `--combobox-popup-box-sizing` | `border-box` |
 * | `--combobox-popup-display` | `flex` |
 * | `--combobox-popup-flex-direction` | `column` |
 * | `--combobox-popup-focus-visible-outline` | `none` |
 * | `--combobox-popup-max-block-size` | `var(--available-height, none)` |
 * | `--combobox-popup-max-inline-size` | `var(--combobox-internal-max-inline-size, 15.75rem)` |
 * | `--combobox-popup-min-inline-size` | `12rem` |
 * | `--combobox-popup-overflow` | `hidden` |
 * | `--combobox-popup-padding-block` | `0` |
 * | `--combobox-popup-padding-inline` | `0` |
 * | `--combobox-position` | `relative` |
 * | `--combobox-positioner-focus-visible-outline` | `none` |
 * | `--combobox-positioner-inline-size` | `max-content` |
 * | `--combobox-positioner-pointer-events` | `auto` |
 * | `--combobox-scroll-fade-size` | `var(--spacing-10)` |
 * | `--combobox-search-affix-align-items` | `center` |
 * | `--combobox-search-affix-display` | `inline-grid` |
 * | `--combobox-search-affix-flex-shrink` | `0` |
 * | `--combobox-search-affix-justify-content` | `center` |
 * | `--combobox-search-align-items` | `center` |
 * | `--combobox-search-border` | `-` |
 * | `--combobox-search-border-color` | `var(--combobox-search-border)` |
 * | `--combobox-search-border-style` | `solid` |
 * | `--combobox-search-border-width` | `1px` |
 * | `--combobox-search-display` | `flex` |
 * | `--combobox-search-flex-shrink` | `0` |
 * | `--combobox-search-gap` | `var(--spacing-4)` |
 * | `--combobox-search-icon` | `-` |
 * | `--combobox-search-icon-color` | `var(--combobox-search-icon)` |
 * | `--combobox-search-input-background-color` | `transparent` |
 * | `--combobox-search-input-border` | `none` |
 * | `--combobox-search-input-flex-grow` | `1` |
 * | `--combobox-search-input-focus-visible-outline` | `none` |
 * | `--combobox-search-input-font-family` | `inherit` |
 * | `--combobox-search-input-line-height` | `var(--line-height-20)` |
 * | `--combobox-search-input-margin` | `0` |
 * | `--combobox-search-input-min-inline-size` | `0` |
 * | `--combobox-search-input-padding` | `0` |
 * | `--combobox-search-padding` | `var(--spacing-5) var(--spacing-6)` |
 * | `--combobox-search-placeholder` | `-` |
 * | `--combobox-search-placeholder-color` | `var(--combobox-search-placeholder)` |
 * | `--combobox-separator` | `-` |
 * | `--combobox-separator-background-color` | `var(--combobox-separator)` |
 * | `--combobox-separator-margin-block` | `0` |
 * | `--combobox-separator-margin-inline` | `0` |
 * | `--combobox-separator-thickness` | `1px` |
 * | `--combobox-shadow` | `-` |
 * | `--combobox-trigger-align-items` | `center` |
 * | `--combobox-trigger-background` | `-` |
 * | `--combobox-trigger-background-color` | `var(--combobox-trigger-background)` |
 * | `--combobox-trigger-border` | `-` |
 * | `--combobox-trigger-border-color` | `var(--combobox-trigger-border)` |
 * | `--combobox-trigger-border-hover` | `-` |
 * | `--combobox-trigger-border-radius` | `var(--radius-1)` |
 * | `--combobox-trigger-border-style` | `solid` |
 * | `--combobox-trigger-border-width` | `1px` |
 * | `--combobox-trigger-box-sizing` | `border-box` |
 * | `--combobox-trigger-chips-align-items` | `flex-start` |
 * | `--combobox-trigger-chips-inset` | `5px` |
 * | `--combobox-trigger-color` | `var(--combobox-trigger-label)` |
 * | `--combobox-trigger-cursor` | `pointer` |
 * | `--combobox-trigger-disabled-color` | `var(--combobox-trigger-label-disabled)` |
 * | `--combobox-trigger-disabled-cursor` | `not-allowed` |
 * | `--combobox-trigger-display` | `flex` |
 * | `--combobox-trigger-flex-grow` | `1` |
 * | `--combobox-trigger-focus-outline-offset` | `1px` |
 * | `--combobox-trigger-focus-outline-style` | `solid` |
 * | `--combobox-trigger-focus-outline-width` | `1px` |
 * | `--combobox-trigger-focus-ring` | `-` |
 * | `--combobox-trigger-focus-ring-color` | `var(--combobox-trigger-focus-ring)` |
 * | `--combobox-trigger-font-family` | `inherit` |
 * | `--combobox-trigger-font-size` | `var(--periscope-font-size-base)` |
 * | `--combobox-trigger-font-weight` | `var(--font-weight-normal)` |
 * | `--combobox-trigger-gap` | `var(--spacing-4)` |
 * | `--combobox-trigger-hover-border-color` | `var(--combobox-trigger-border-hover)` |
 * | `--combobox-trigger-icon` | `-` |
 * | `--combobox-trigger-icon-hover` | `-` |
 * | `--combobox-trigger-invalid-border-color` | `var(--destructive)` |
 * | `--combobox-trigger-label` | `-` |
 * | `--combobox-trigger-label-disabled` | `-` |
 * | `--combobox-trigger-line-height` | `var(--line-height-18)` |
 * | `--combobox-trigger-margin` | `0` |
 * | `--combobox-trigger-min-block-size` | `2rem` |
 * | `--combobox-trigger-min-inline-size` | `0` |
 * | `--combobox-trigger-padding-block` | `var(--spacing-2)` |
 * | `--combobox-trigger-padding-inline-end` | `var(--spacing-4)` |
 * | `--combobox-trigger-padding-inline-start` | `var(--spacing-6)` |
 * | `--combobox-trigger-placeholder` | `-` |
 * | `--combobox-trigger-readonly-cursor` | `not-allowed` |
 * | `--combobox-trigger-readonly-opacity` | `0.8` |
 * | `--combobox-trigger-text-align` | `start` |
 * | `--combobox-trigger-transition-duration` | `150ms` |
 * | `--combobox-trigger-transition-property` | `border-color` |
 * | `--combobox-trigger-transition-timing-function` | `ease` |
 * | `--combobox-value-flex-grow` | `1` |
 * | `--combobox-value-min-inline-size` | `0` |
 * | `--combobox-value-overflow` | `hidden` |
 * | `--combobox-value-prefix-align-items` | `center` |
 * | `--combobox-value-prefix-display` | `inline-grid` |
 * | `--combobox-value-prefix-flex-shrink` | `0` |
 * | `--combobox-value-prefix-justify-content` | `center` |
 * | `--combobox-value-prefix-size` | `14px` |
 * | `--combobox-value-text-overflow` | `ellipsis` |
 * | `--combobox-value-white-space` | `nowrap` |
 * | `--combobox-viewport-display` | `flex` |
 * | `--combobox-viewport-flex-direction` | `column` |
 * | `--combobox-viewport-min-block-size` | `0` |
 * | `--combobox-viewport-overflow-x` | `hidden` |
 * | `--combobox-viewport-overflow-y` | `auto` |
 * | `--combobox-viewport-overscroll-behavior` | `contain` |
 * | `--combobox-viewport-scroll-padding-block` | `var(--combobox-scroll-fade-size, var(--spacing-...` |
 * | `--combobox-viewport-scrollbar-width` | `thin` |
 * | `--combobox-virtual-list-inline-size` | `100%` |
 * | `--combobox-virtual-list-position` | `relative` |
 * | `--combobox-virtual-row-box-sizing` | `border-box` |
 * | `--combobox-virtual-row-inset-block-start` | `0` |
 * | `--combobox-virtual-row-inset-inline` | `0` |
 * | `--combobox-virtual-row-position` | `absolute` |
 * | `--combobox-width` | `var(--combobox-internal-width, 100%)` |
 * | `--combobox-z-index` | `50` |
 */
// #endregion css-tokens

export { Combobox } from './combobox.js';
export {
	COMBOBOX_CUSTOM_GROUP_LABEL,
	COMBOBOX_EMPTY_CONTENT,
	COMBOBOX_EMPTY_LABEL,
	ComboboxItemKind,
} from './constants.js';
export type {
	ComboboxFooterActionType,
	ComboboxGroupChildType,
	ComboboxGroupItemType,
	ComboboxHintItemType,
	ComboboxItemDisabledType,
	ComboboxItemKindType,
	ComboboxItemType,
	ComboboxOptionItemType,
	ComboboxProps,
	ComboboxSearchInputProps,
	ComboboxSeparatorItemType,
	ValidateComboboxProps,
} from './types.js';
