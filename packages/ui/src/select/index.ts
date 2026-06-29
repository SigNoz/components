// #region css-tokens
/**
 * CSS Tokens for select
 * Prefix: `--select-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--select-arrow-fill` | `var(--popover)` |
 * | `--select-content-background` | `var(--popover)` |
 * | `--select-content-border-color` | `var(--border)` |
 * | `--select-content-border-radius` | `var(--radius-1, 2px)` |
 * | `--select-content-border-style` | `solid` |
 * | `--select-content-border-width` | `1px` |
 * | `--select-content-box-shadow` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 		0 2px 4px -2...` |
 * | `--select-content-color` | `var(--popover-foreground)` |
 * | `--select-content-max-height` | `20rem` |
 * | `--select-content-min-width` | `8rem` |
 * | `--select-content-open-animation` | `select-in 150ms ease-out` |
 * | `--select-content-overflow` | `hidden` |
 * | `--select-content-popper-min-width` | `var(--radix-select-trigger-width)` |
 * | `--select-content-popper-width` | `var(--radix-select-trigger-width)` |
 * | `--select-content-position` | `relative` |
 * | `--select-content-slide-down-animation` | `select-in, select-slide-down` |
 * | `--select-content-slide-up-animation` | `select-in, select-slide-up` |
 * | `--select-group-padding` | `0` |
 * | `--select-item-align-items` | `center` |
 * | `--select-item-border-radius` | `var(--radius-1, 2px)` |
 * | `--select-item-container-align-items` | `center` |
 * | `--select-item-container-display` | `inline-flex` |
 * | `--select-item-container-gap` | `var(--spacing-2, 0.25rem)` |
 * | `--select-item-container-inner-align-items` | `center` |
 * | `--select-item-container-inner-display` | `inline-flex` |
 * | `--select-item-container-inner-gap` | `var(--spacing-2, 0.25rem)` |
 * | `--select-item-cursor` | `pointer` |
 * | `--select-item-disabled-opacity` | `0.5` |
 * | `--select-item-disabled-pointer-events` | `none` |
 * | `--select-item-display` | `flex` |
 * | `--select-item-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--select-item-gap` | `0.5rem` |
 * | `--select-item-highlight-background` | `var(--accent)` |
 * | `--select-item-highlight-color` | `var(--accent-foreground)` |
 * | `--select-item-icon-flex-shrink` | `0` |
 * | `--select-item-icon-size` | `1rem` |
 * | `--select-item-indicator-align-items` | `center` |
 * | `--select-item-indicator-display` | `flex` |
 * | `--select-item-indicator-icon-size` | `0.875rem` |
 * | `--select-item-indicator-justify-content` | `center` |
 * | `--select-item-indicator-left` | `0.5rem` |
 * | `--select-item-indicator-position` | `absolute` |
 * | `--select-item-indicator-size` | `1rem` |
 * | `--select-item-line-height` | `1.25rem` |
 * | `--select-item-outline` | `none` |
 * | `--select-item-padding` | `0.375rem 0.5rem` |
 * | `--select-item-padding-left` | `1.75rem` |
 * | `--select-item-position` | `relative` |
 * | `--select-item-transition` | `background-color 150ms, color 150ms` |
 * | `--select-item-user-select` | `none` |
 * | `--select-item-width` | `100%` |
 * | `--select-label-color` | `var(--muted-foreground)` |
 * | `--select-label-font-size` | `0.75rem` |
 * | `--select-label-font-weight` | `500` |
 * | `--select-label-padding` | `0.375rem 0.5rem` |
 * | `--select-label-padding-left` | `1.75rem` |
 * | `--select-loading-align-items` | `center` |
 * | `--select-loading-color` | `var(--muted-foreground)` |
 * | `--select-loading-display` | `flex` |
 * | `--select-loading-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--select-loading-gap` | `0.5rem` |
 * | `--select-loading-justify-content` | `center` |
 * | `--select-loading-padding` | `0.75rem 0.5rem` |
 * | `--select-loading-spinner-size` | `1rem` |
 * | `--select-pill-align-items` | `center` |
 * | `--select-pill-background` | `var(--accent)` |
 * | `--select-pill-border-radius` | `var(--radius-1, 2px)` |
 * | `--select-pill-color` | `var(--accent-foreground)` |
 * | `--select-pill-display` | `inline-flex` |
 * | `--select-pill-font-size` | `0.75rem` |
 * | `--select-pill-gap` | `0.25rem` |
 * | `--select-pill-height` | `1.25rem` |
 * | `--select-pill-inner-gap` | `0.125rem` |
 * | `--select-pill-line-height` | `1` |
 * | `--select-pill-overflow-align-items` | `center` |
 * | `--select-pill-overflow-background` | `var(--muted)` |
 * | `--select-pill-overflow-color` | `var(--muted-foreground)` |
 * | `--select-pill-overflow-display` | `inline-flex` |
 * | `--select-pill-overflow-flex-shrink` | `0` |
 * | `--select-pill-overflow-font-weight` | `500` |
 * | `--select-pill-overflow-justify-content` | `center` |
 * | `--select-pill-overflow-line-height` | `1` |
 * | `--select-pill-overflow-padding` | `0 0.5rem` |
 * | `--select-pill-padding` | `0 0.375rem` |
 * | `--select-pill-remove-align-items` | `center` |
 * | `--select-pill-remove-background` | `transparent` |
 * | `--select-pill-remove-border` | `none` |
 * | `--select-pill-remove-border-radius` | `2px` |
 * | `--select-pill-remove-color` | `inherit` |
 * | `--select-pill-remove-cursor` | `pointer` |
 * | `--select-pill-remove-display` | `flex` |
 * | `--select-pill-remove-hover-background` | `rgb(0 0 0 / 0.1)` |
 * | `--select-pill-remove-hover-opacity` | `1` |
 * | `--select-pill-remove-icon-size` | `0.625rem` |
 * | `--select-pill-remove-justify-content` | `center` |
 * | `--select-pill-remove-opacity` | `0.7` |
 * | `--select-pill-remove-padding` | `0` |
 * | `--select-pill-remove-size` | `0.875rem` |
 * | `--select-pill-remove-transition` | `opacity 150ms` |
 * | `--select-pill-text-max-width` | `8rem` |
 * | `--select-pill-text-overflow` | `hidden` |
 * | `--select-pill-text-overflow-style` | `ellipsis` |
 * | `--select-pill-text-white-space` | `nowrap` |
 * | `--select-pills-display` | `flex` |
 * | `--select-pills-flex-wrap` | `wrap` |
 * | `--select-pills-overflow` | `hidden` |
 * | `--select-scroll-button-align-items` | `center` |
 * | `--select-scroll-button-background` | `var(--popover)` |
 * | `--select-scroll-button-color` | `var(--muted-foreground)` |
 * | `--select-scroll-button-cursor` | `default` |
 * | `--select-scroll-button-display` | `flex` |
 * | `--select-scroll-button-height` | `1.5rem` |
 * | `--select-scroll-button-icon-size` | `1rem` |
 * | `--select-scroll-button-justify-content` | `center` |
 * | `--select-separator-color` | `var(--border)` |
 * | `--select-separator-height` | `1px` |
 * | `--select-separator-margin` | `0.25rem 0` |
 * | `--select-trigger-align-items` | `center` |
 * | `--select-trigger-background-color` | `transparent` |
 * | `--select-trigger-border-color` | `var(--input, var(--border))` |
 * | `--select-trigger-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--select-trigger-border-style` | `solid` |
 * | `--select-trigger-border-width` | `1px` |
 * | `--select-trigger-box-shadow` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
 * | `--select-trigger-cursor` | `pointer` |
 * | `--select-trigger-disabled-cursor` | `not-allowed` |
 * | `--select-trigger-disabled-opacity` | `0.5` |
 * | `--select-trigger-display` | `flex` |
 * | `--select-trigger-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--select-trigger-gap` | `var(--spacing-2, 0.25rem)` |
 * | `--select-trigger-height` | `2.25rem` |
 * | `--select-trigger-icon-flex-shrink` | `0` |
 * | `--select-trigger-icon-opacity` | `0.5` |
 * | `--select-trigger-icon-size` | `1rem` |
 * | `--select-trigger-justify-content` | `space-between` |
 * | `--select-trigger-line-height` | `1.25rem` |
 * | `--select-trigger-outline-color` | `var(--ring)` |
 * | `--select-trigger-outline-offset` | `2px` |
 * | `--select-trigger-outline-width` | `2px` |
 * | `--select-trigger-padding` | `var(--spacing-4, 0.5rem) var(--spacing-6, 0.75rem)` |
 * | `--select-trigger-placeholder-color` | `var(--muted-foreground)` |
 * | `--select-trigger-value-align-items` | `center` |
 * | `--select-trigger-value-display` | `flex` |
 * | `--select-trigger-value-flex` | `1` |
 * | `--select-trigger-value-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--select-trigger-value-gap` | `var(--spacing-4, 0.5rem)` |
 * | `--select-trigger-value-icon-flex-shrink` | `0` |
 * | `--select-trigger-value-icon-size` | `1rem` |
 * | `--select-trigger-value-inner-align-items` | `center` |
 * | `--select-trigger-value-inner-display` | `inline-flex` |
 * | `--select-trigger-value-inner-gap` | `var(--spacing-2, 0.25rem)` |
 * | `--select-trigger-value-line-height` | `1.25rem` |
 * | `--select-trigger-value-min-width` | `0` |
 * | `--select-trigger-value-overflow` | `hidden` |
 * | `--select-trigger-white-space` | `nowrap` |
 * | `--select-trigger-width` | `100%` |
 * | `--select-viewport-padding` | `0.25rem` |
 * | `--select-viewport-width` | `100%` |
 */
// #endregion css-tokens

export { Select, type SelectProps } from './components/select.js';
export {
	SelectArrow,
	type SelectArrowProps,
	SelectContent,
	type SelectContentProps,
	SelectPortal,
	type SelectPortalProps,
	SelectScrollDownButton,
	type SelectScrollDownButtonProps,
	SelectScrollUpButton,
	type SelectScrollUpButtonProps,
	SelectViewport,
	type SelectViewportProps,
} from './components/select-content.js';
export {
	SelectContext,
	type SelectContextValue,
	useSelectContext,
} from './components/select-context.js';
export {
	SelectGroup,
	type SelectGroupProps,
	SelectLabel,
	type SelectLabelProps,
} from './components/select-group.js';
export {
	SelectItem,
	SelectItemIndicator,
	type SelectItemIndicatorProps,
	type SelectItemProps,
	SelectItemText,
	type SelectItemTextProps,
} from './components/select-item.js';
export {
	SelectLoading,
	type SelectLoadingProps,
} from './components/select-loading.js';
export {
	SelectSeparator,
	type SelectSeparatorProps,
} from './components/select-separator.js';
export {
	SelectIcon,
	type SelectIconProps,
	SelectTrigger,
	type SelectTriggerProps,
	SelectValue,
	type SelectValueProps,
} from './components/select-trigger.js';
export {
	SelectSimple,
	type SelectSimpleGroup,
	type SelectSimpleItem,
	type SelectSimpleProps,
} from './presets/select-simple.js';
