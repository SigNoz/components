// #region css-tokens
/**
 * CSS Tokens for dropdown
 * Prefix: `--dropdown-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--dropdown-affix-collapsed-grid-template-columns` | `0fr` |
 * | `--dropdown-affix-collapsed-overflow` | `hidden` |
 * | `--dropdown-affix-grid-template-columns` | `1fr` |
 * | `--dropdown-affix-justify-items` | `center` |
 * | `--dropdown-affix-layer-align-items` | `center` |
 * | `--dropdown-affix-layer-display` | `inline-flex` |
 * | `--dropdown-affix-layer-justify-content` | `center` |
 * | `--dropdown-affix-overflow` | `visible` |
 * | `--dropdown-backdrop-filter` | `blur(40px)` |
 * | `--dropdown-background` | `-` |
 * | `--dropdown-background-color` | `var(--dropdown-background)` |
 * | `--dropdown-border` | `-` |
 * | `--dropdown-border-color` | `var(--dropdown-border)` |
 * | `--dropdown-border-radius` | `var(--radius-2)` |
 * | `--dropdown-border-style` | `solid` |
 * | `--dropdown-border-width` | `1px` |
 * | `--dropdown-box-shadow` | `var(--dropdown-shadow)` |
 * | `--dropdown-box-sizing` | `border-box` |
 * | `--dropdown-display` | `flex` |
 * | `--dropdown-empty-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--dropdown-empty-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--dropdown-empty-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--dropdown-empty-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--dropdown-empty-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--dropdown-empty-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--dropdown-flex-direction` | `column` |
 * | `--dropdown-focus-outline-offset` | `-1px` |
 * | `--dropdown-focus-outline-style` | `solid` |
 * | `--dropdown-focus-outline-width` | `1px` |
 * | `--dropdown-focus-visible-outline` | `none` |
 * | `--dropdown-group-display` | `flex` |
 * | `--dropdown-group-flex-direction` | `column` |
 * | `--dropdown-group-label` | `-` |
 * | `--dropdown-group-label-align-items` | `center` |
 * | `--dropdown-group-label-box-sizing` | `border-box` |
 * | `--dropdown-group-label-color` | `var(--dropdown-group-label)` |
 * | `--dropdown-group-label-display` | `flex` |
 * | `--dropdown-group-label-font-family` | `var(--uppercase-small-600-font-family)` |
 * | `--dropdown-group-label-font-size` | `var(--uppercase-small-600-font-size)` |
 * | `--dropdown-group-label-font-weight` | `var(--uppercase-small-600-font-weight)` |
 * | `--dropdown-group-label-letter-spacing` | `var(--uppercase-small-600-letter-spacing)` |
 * | `--dropdown-group-label-line-height` | `var(--uppercase-small-600-line-height)` |
 * | `--dropdown-group-label-min-block-size` | `calc(var(--spacing-12) + var(--spacing-3))` |
 * | `--dropdown-group-label-padding-block` | `var(--spacing-3)` |
 * | `--dropdown-group-label-padding-inline` | `var(--spacing-6)` |
 * | `--dropdown-group-label-text-transform` | `var(--uppercase-small-600-text-transform)` |
 * | `--dropdown-item-affix-align-items` | `center` |
 * | `--dropdown-item-affix-display` | `inline-grid` |
 * | `--dropdown-item-affix-flex-shrink` | `0` |
 * | `--dropdown-item-affix-justify-content` | `center` |
 * | `--dropdown-item-align-items` | `center` |
 * | `--dropdown-item-background` | `-` |
 * | `--dropdown-item-background-color` | `var(--dropdown-item-background)` |
 * | `--dropdown-item-background-hover` | `-` |
 * | `--dropdown-item-border-radius` | `0` |
 * | `--dropdown-item-box-sizing` | `border-box` |
 * | `--dropdown-item-checkbox-border-radius` | `2px` |
 * | `--dropdown-item-checkbox-check-size` | `12px` |
 * | `--dropdown-item-color` | `var(--dropdown-item-label)` |
 * | `--dropdown-item-control-align-items` | `center` |
 * | `--dropdown-item-control-background` | `transparent` |
 * | `--dropdown-item-control-border` | `-` |
 * | `--dropdown-item-control-border-color` | `var(--dropdown-item-control-border)` |
 * | `--dropdown-item-control-border-hover` | `-` |
 * | `--dropdown-item-control-border-style` | `solid` |
 * | `--dropdown-item-control-border-width` | `2px` |
 * | `--dropdown-item-control-box-sizing` | `border-box` |
 * | `--dropdown-item-control-checked-background` | `-` |
 * | `--dropdown-item-control-checked-background-color` | `var(--dropdown-item-control-checked-background)` |
 * | `--dropdown-item-control-checked-color` | `var(--dropdown-item-control-checked-foreground)` |
 * | `--dropdown-item-control-checked-foreground` | `-` |
 * | `--dropdown-item-control-disabled-checked-opacity` | `0.6` |
 * | `--dropdown-item-control-disabled-opacity` | `0.4` |
 * | `--dropdown-item-control-display` | `inline-flex` |
 * | `--dropdown-item-control-hover-border-color` | `var(--dropdown-item-control-border-hover)` |
 * | `--dropdown-item-control-justify-content` | `center` |
 * | `--dropdown-item-control-size` | `16px` |
 * | `--dropdown-item-control-transition` | `background-color 150ms ease, border-color 150ms...` |
 * | `--dropdown-item-cursor` | `pointer` |
 * | `--dropdown-item-danger-background-hover` | `-` |
 * | `--dropdown-item-danger-color` | `var(--dropdown-item-danger-label)` |
 * | `--dropdown-item-danger-hover-background-color` | `var(--dropdown-item-danger-background-hover)` |
 * | `--dropdown-item-danger-hover-color` | `var(--dropdown-item-danger-label-hover)` |
 * | `--dropdown-item-danger-label` | `-` |
 * | `--dropdown-item-danger-label-hover` | `-` |
 * | `--dropdown-item-disabled-color` | `var(--dropdown-item-label-disabled)` |
 * | `--dropdown-item-disabled-cursor` | `not-allowed` |
 * | `--dropdown-item-display` | `flex` |
 * | `--dropdown-item-focus-ring` | `-` |
 * | `--dropdown-item-focus-ring-color` | `var(--dropdown-item-focus-ring)` |
 * | `--dropdown-item-font-family` | `var(--label-base-400-font-family)` |
 * | `--dropdown-item-font-size` | `var(--label-base-400-font-size)` |
 * | `--dropdown-item-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--dropdown-item-gap` | `var(--spacing-2)` |
 * | `--dropdown-item-hover-background-color` | `var(--dropdown-item-background-hover)` |
 * | `--dropdown-item-hover-color` | `var(--dropdown-item-label-hover)` |
 * | `--dropdown-item-hover-outline` | `none` |
 * | `--dropdown-item-icon` | `-` |
 * | `--dropdown-item-icon-color` | `var(--dropdown-item-icon)` |
 * | `--dropdown-item-icon-hover` | `-` |
 * | `--dropdown-item-icon-hover-color` | `var(--dropdown-item-icon-hover)` |
 * | `--dropdown-item-icon-size` | `14px` |
 * | `--dropdown-item-label` | `-` |
 * | `--dropdown-item-label-disabled` | `-` |
 * | `--dropdown-item-label-flex-grow` | `1` |
 * | `--dropdown-item-label-hover` | `-` |
 * | `--dropdown-item-label-min-inline-size` | `0` |
 * | `--dropdown-item-label-overflow` | `clip visible` |
 * | `--dropdown-item-label-text-overflow` | `ellipsis` |
 * | `--dropdown-item-label-white-space` | `nowrap` |
 * | `--dropdown-item-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--dropdown-item-line-height` | `var(--label-base-400-line-height)` |
 * | `--dropdown-item-loading-opacity` | `0.8` |
 * | `--dropdown-item-min-block-size` | `calc(var(--spacing-16) + var(--spacing-1))` |
 * | `--dropdown-item-padding` | `var(--spacing-4) var(--spacing-6)` |
 * | `--dropdown-item-radio-border-radius` | `var(--radius-round)` |
 * | `--dropdown-item-radio-dot-border-radius` | `var(--radius-round)` |
 * | `--dropdown-item-radio-dot-size` | `8px` |
 * | `--dropdown-item-slot-gap` | `var(--spacing-4)` |
 * | `--dropdown-item-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--dropdown-item-user-select` | `none` |
 * | `--dropdown-item-white-space` | `nowrap` |
 * | `--dropdown-loading-align-items` | `center` |
 * | `--dropdown-loading-delay` | `var(--dropdown-internal-loading-duration)` |
 * | `--dropdown-loading-display` | `flex` |
 * | `--dropdown-loading-duration` | `120ms` |
 * | `--dropdown-loading-easing` | `cubic-bezier(0.65, 0, 0.35, 1)` |
 * | `--dropdown-loading-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--dropdown-loading-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--dropdown-loading-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--dropdown-loading-justify-content` | `center` |
 * | `--dropdown-loading-label` | `-` |
 * | `--dropdown-loading-label-color` | `var(--dropdown-loading-label)` |
 * | `--dropdown-loading-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--dropdown-loading-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--dropdown-loading-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--dropdown-loading-travel` | `6px` |
 * | `--dropdown-max-block-size` | `var(--dropdown-internal-max-block-size, 20rem)` |
 * | `--dropdown-max-inline-size` | `var(--dropdown-internal-max-inline-size, 15.75rem)` |
 * | `--dropdown-max-popup-block-size` | `var(--available-height, none)` |
 * | `--dropdown-min-inline-size` | `12rem` |
 * | `--dropdown-overflow` | `hidden` |
 * | `--dropdown-padding-block` | `0` |
 * | `--dropdown-padding-inline` | `0` |
 * | `--dropdown-positioner-focus-visible-outline` | `none` |
 * | `--dropdown-positioner-inline-size` | `max-content` |
 * | `--dropdown-positioner-pointer-events` | `auto` |
 * | `--dropdown-scroll-fade-size` | `var(--spacing-10)` |
 * | `--dropdown-search-affix-align-items` | `center` |
 * | `--dropdown-search-affix-display` | `inline-grid` |
 * | `--dropdown-search-affix-flex-shrink` | `0` |
 * | `--dropdown-search-affix-justify-content` | `center` |
 * | `--dropdown-search-align-items` | `center` |
 * | `--dropdown-search-border` | `-` |
 * | `--dropdown-search-border-color` | `var(--dropdown-search-border)` |
 * | `--dropdown-search-border-style` | `solid` |
 * | `--dropdown-search-border-width` | `1px` |
 * | `--dropdown-search-display` | `flex` |
 * | `--dropdown-search-flex-shrink` | `0` |
 * | `--dropdown-search-gap` | `var(--spacing-4)` |
 * | `--dropdown-search-icon` | `-` |
 * | `--dropdown-search-icon-color` | `var(--dropdown-search-icon)` |
 * | `--dropdown-search-input-background-color` | `transparent` |
 * | `--dropdown-search-input-border` | `none` |
 * | `--dropdown-search-input-flex-grow` | `1` |
 * | `--dropdown-search-input-focus-visible-outline` | `none` |
 * | `--dropdown-search-input-font-family` | `var(--label-base-400-font-family)` |
 * | `--dropdown-search-input-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--dropdown-search-input-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--dropdown-search-input-line-height` | `var(--label-base-400-line-height)` |
 * | `--dropdown-search-input-min-block-size` | `var(--spacing-10)` |
 * | `--dropdown-search-input-min-inline-size` | `0` |
 * | `--dropdown-search-input-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--dropdown-search-padding` | `var(--spacing-5) var(--spacing-6)` |
 * | `--dropdown-search-placeholder` | `-` |
 * | `--dropdown-search-placeholder-color` | `var(--dropdown-search-placeholder)` |
 * | `--dropdown-separator` | `-` |
 * | `--dropdown-separator-background-color` | `var(--dropdown-separator)` |
 * | `--dropdown-separator-margin-block` | `0` |
 * | `--dropdown-separator-margin-inline` | `0` |
 * | `--dropdown-separator-thickness` | `1px` |
 * | `--dropdown-shadow` | `-` |
 * | `--dropdown-transition` | `none` |
 * | `--dropdown-viewport-display` | `flex` |
 * | `--dropdown-viewport-flex-direction` | `column` |
 * | `--dropdown-viewport-min-block-size` | `0` |
 * | `--dropdown-viewport-overflow-x` | `hidden` |
 * | `--dropdown-viewport-overflow-y` | `auto` |
 * | `--dropdown-viewport-overscroll-behavior` | `contain` |
 * | `--dropdown-viewport-scroll-padding-block` | `var(--dropdown-scroll-fade-size, var(--spacing-...` |
 * | `--dropdown-viewport-scrollbar-width` | `thin` |
 * | `--dropdown-z-index` | `50` |
 */
// #endregion css-tokens

export {
	DROPDOWN_EMPTY_CONTENT,
	DROPDOWN_EMPTY_LABEL,
	DROPDOWN_SIDE_OFFSET,
	DropdownItemKind,
} from './constants.js';
export { Dropdown } from './dropdown.js';
export type {
	DropdownActionItemType,
	DropdownCheckboxItemType,
	DropdownGroupChildType,
	DropdownGroupItemType,
	DropdownItemDisabledType,
	DropdownItemKindType,
	DropdownItemLoadingType,
	DropdownItemRenderType,
	DropdownItemType,
	DropdownLeafItemType,
	DropdownLinkItemType,
	DropdownProps,
	DropdownRadioGroupItemType,
	DropdownRadioItemType,
	DropdownSearchInputProps,
	DropdownSeparatorItemType,
	DropdownSubmenuChildType,
	DropdownSubmenuItemType,
	ValidateDropdownProps,
} from './types.js';
