// #region css-tokens
/**
 * CSS Tokens for dropdown
 * Prefix: `--dropdown-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--dropdown-backdrop-filter` | `blur(40px)` |
 * | `--dropdown-background` | `-` |
 * | `--dropdown-border` | `-` |
 * | `--dropdown-border-radius` | `var(--radius-2)` |
 * | `--dropdown-border-width` | `1px` |
 * | `--dropdown-display` | `flex` |
 * | `--dropdown-flex-direction` | `column` |
 * | `--dropdown-focus-outline-offset` | `-1px` |
 * | `--dropdown-focus-outline-width` | `1px` |
 * | `--dropdown-focus-visible-outline` | `none` |
 * | `--dropdown-group-display` | `flex` |
 * | `--dropdown-group-flex-direction` | `column` |
 * | `--dropdown-group-label` | `-` |
 * | `--dropdown-group-label-font-size` | `var(--periscope-font-size-small)` |
 * | `--dropdown-group-label-font-weight` | `var(--font-weight-bold)` |
 * | `--dropdown-group-label-letter-spacing` | `0.04em` |
 * | `--dropdown-group-label-line-height` | `var(--line-height-18)` |
 * | `--dropdown-group-label-padding-block` | `var(--spacing-3)` |
 * | `--dropdown-group-label-padding-inline` | `var(--spacing-6)` |
 * | `--dropdown-group-label-text-transform` | `uppercase` |
 * | `--dropdown-item-affix-align-items` | `center` |
 * | `--dropdown-item-affix-display` | `inline-flex` |
 * | `--dropdown-item-affix-flex-shrink` | `0` |
 * | `--dropdown-item-affix-justify-content` | `center` |
 * | `--dropdown-item-align-items` | `center` |
 * | `--dropdown-item-background` | `-` |
 * | `--dropdown-item-background-hover` | `-` |
 * | `--dropdown-item-border-radius` | `var(--radius-1)` |
 * | `--dropdown-item-checkbox-border-radius` | `2px` |
 * | `--dropdown-item-checkbox-check-size` | `12px` |
 * | `--dropdown-item-control-align-items` | `center` |
 * | `--dropdown-item-control-background` | `transparent` |
 * | `--dropdown-item-control-border` | `var(--l3-foreground)` |
 * | `--dropdown-item-control-border-hover` | `var(--primary-background-hover)` |
 * | `--dropdown-item-control-border-width` | `2px` |
 * | `--dropdown-item-control-checked-background` | `var(--primary-background)` |
 * | `--dropdown-item-control-checked-foreground` | `var(--primary-foreground)` |
 * | `--dropdown-item-control-disabled-checked-opacity` | `0.6` |
 * | `--dropdown-item-control-disabled-opacity` | `0.4` |
 * | `--dropdown-item-control-display` | `inline-flex` |
 * | `--dropdown-item-control-justify-content` | `center` |
 * | `--dropdown-item-control-size` | `16px` |
 * | `--dropdown-item-control-transition` | `background-color 150ms ease,     border-color 1...` |
 * | `--dropdown-item-cursor` | `pointer` |
 * | `--dropdown-item-danger-background-hover` | `-` |
 * | `--dropdown-item-danger-label` | `-` |
 * | `--dropdown-item-danger-label-hover` | `-` |
 * | `--dropdown-item-disabled-cursor` | `not-allowed` |
 * | `--dropdown-item-display` | `flex` |
 * | `--dropdown-item-focus-ring` | `-` |
 * | `--dropdown-item-font-size` | `var(--periscope-font-size-base)` |
 * | `--dropdown-item-font-weight` | `var(--font-weight-normal)` |
 * | `--dropdown-item-gap` | `var(--spacing-2)` |
 * | `--dropdown-item-hover-outline` | `none` |
 * | `--dropdown-item-icon` | `-` |
 * | `--dropdown-item-icon-hover` | `-` |
 * | `--dropdown-item-icon-size` | `14px` |
 * | `--dropdown-item-label` | `-` |
 * | `--dropdown-item-label-disabled` | `-` |
 * | `--dropdown-item-label-flex-grow` | `1` |
 * | `--dropdown-item-label-hover` | `-` |
 * | `--dropdown-item-label-min-inline-size` | `0` |
 * | `--dropdown-item-label-overflow` | `hidden` |
 * | `--dropdown-item-label-text-overflow` | `ellipsis` |
 * | `--dropdown-item-label-white-space` | `nowrap` |
 * | `--dropdown-item-line-height` | `var(--line-height-20)` |
 * | `--dropdown-item-loading-opacity` | `0.8` |
 * | `--dropdown-item-padding` | `var(--spacing-5) var(--spacing-6)` |
 * | `--dropdown-item-radio-border-radius` | `var(--radius-round)` |
 * | `--dropdown-item-radio-dot-border-radius` | `var(--radius-round)` |
 * | `--dropdown-item-radio-dot-size` | `8px` |
 * | `--dropdown-item-slot-gap` | `var(--spacing-4)` |
 * | `--dropdown-item-user-select` | `none` |
 * | `--dropdown-item-white-space` | `nowrap` |
 * | `--dropdown-loading-align-items` | `center` |
 * | `--dropdown-loading-display` | `flex` |
 * | `--dropdown-loading-justify-content` | `center` |
 * | `--dropdown-loading-label` | `-` |
 * | `--dropdown-max-block-size` | `var(--dropdown-internal-max-block-size, 20rem)` |
 * | `--dropdown-max-inline-size` | `var(--dropdown-internal-max-inline-size, 15.75rem)` |
 * | `--dropdown-max-popup-block-size` | `var(--available-height, none)` |
 * | `--dropdown-min-inline-size` | `12rem` |
 * | `--dropdown-overflow` | `hidden` |
 * | `--dropdown-padding-block` | `var(--spacing-2)` |
 * | `--dropdown-padding-inline` | `0` |
 * | `--dropdown-positioner-focus-visible-outline` | `none` |
 * | `--dropdown-scroll-fade-size` | `var(--spacing-10)` |
 * | `--dropdown-search-affix-align-items` | `center` |
 * | `--dropdown-search-affix-display` | `inline-flex` |
 * | `--dropdown-search-affix-flex-shrink` | `0` |
 * | `--dropdown-search-affix-justify-content` | `center` |
 * | `--dropdown-search-align-items` | `center` |
 * | `--dropdown-search-border` | `-` |
 * | `--dropdown-search-border-width` | `1px` |
 * | `--dropdown-search-display` | `flex` |
 * | `--dropdown-search-flex-shrink` | `0` |
 * | `--dropdown-search-gap` | `var(--spacing-4)` |
 * | `--dropdown-search-icon` | `-` |
 * | `--dropdown-search-input-background-color` | `transparent` |
 * | `--dropdown-search-input-border` | `none` |
 * | `--dropdown-search-input-flex-grow` | `1` |
 * | `--dropdown-search-input-focus-visible-outline` | `none` |
 * | `--dropdown-search-input-min-inline-size` | `0` |
 * | `--dropdown-search-padding` | `var(--spacing-5) var(--spacing-6)` |
 * | `--dropdown-search-placeholder` | `-` |
 * | `--dropdown-separator` | `-` |
 * | `--dropdown-separator-margin-block` | `var(--spacing-2)` |
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
