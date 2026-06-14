// #region css-tokens
/**
 * CSS Tokens for combobox
 * Prefix: `--combobox-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--combobox-create-item-color` | `var(--muted-foreground)` |
 * | `--combobox-create-item-font-style` | `italic` |
 * | `--combobox-hint-item-color` | `var(--muted-foreground)` |
 * | `--combobox-hint-item-font-style` | `italic` |
 * | `--combobox-item-check-icon-size` | `1rem` |
 * | `--combobox-item-check-selected-opacity` | `1` |
 * | `--combobox-item-check-size` | `1rem` |
 * | `--combobox-item-check-unselected-opacity` | `0` |
 * | `--combobox-loading-align-items` | `center` |
 * | `--combobox-loading-color` | `var(--muted-foreground)` |
 * | `--combobox-loading-display` | `flex` |
 * | `--combobox-loading-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--combobox-loading-gap` | `0.5rem` |
 * | `--combobox-loading-justify-content` | `center` |
 * | `--combobox-loading-padding` | `0.75rem 0.5rem` |
 * | `--combobox-loading-spinner-size` | `1rem` |
 * | `--combobox-multi-input-background` | `transparent` |
 * | `--combobox-multi-input-border` | `none` |
 * | `--combobox-multi-input-color` | `inherit` |
 * | `--combobox-multi-input-flex` | `1` |
 * | `--combobox-multi-input-min-width` | `4rem` |
 * | `--combobox-multi-input-outline` | `none` |
 * | `--combobox-multi-input-padding` | `0.125rem 0` |
 * | `--combobox-multi-trigger-align-items` | `center` |
 * | `--combobox-multi-trigger-cursor` | `text` |
 * | `--combobox-multi-trigger-display` | `flex` |
 * | `--combobox-multi-trigger-flex-wrap` | `wrap` |
 * | `--combobox-multi-trigger-gap` | `0.25rem` |
 * | `--combobox-multi-trigger-padding` | `0.25rem 0.5rem` |
 * | `--combobox-pill-align-items` | `center` |
 * | `--combobox-pill-background` | `var(--accent)` |
 * | `--combobox-pill-border-radius` | `var(--radius-1, 2px)` |
 * | `--combobox-pill-color` | `var(--accent-foreground)` |
 * | `--combobox-pill-display` | `inline-flex` |
 * | `--combobox-pill-font-size` | `0.75rem` |
 * | `--combobox-pill-height` | `1.25rem` |
 * | `--combobox-pill-inner-gap` | `0.125rem` |
 * | `--combobox-pill-line-height` | `1` |
 * | `--combobox-pill-overflow-align-items` | `center` |
 * | `--combobox-pill-overflow-background` | `var(--muted)` |
 * | `--combobox-pill-overflow-color` | `var(--muted-foreground)` |
 * | `--combobox-pill-overflow-display` | `inline-flex` |
 * | `--combobox-pill-overflow-flex-shrink` | `0` |
 * | `--combobox-pill-overflow-font-weight` | `500` |
 * | `--combobox-pill-overflow-justify-content` | `center` |
 * | `--combobox-pill-overflow-line-height` | `1` |
 * | `--combobox-pill-overflow-padding` | `0 0.5rem` |
 * | `--combobox-pill-padding` | `0 0.375rem` |
 * | `--combobox-pill-remove-align-items` | `center` |
 * | `--combobox-pill-remove-background` | `transparent` |
 * | `--combobox-pill-remove-border` | `none` |
 * | `--combobox-pill-remove-border-radius` | `2px` |
 * | `--combobox-pill-remove-color` | `inherit` |
 * | `--combobox-pill-remove-cursor` | `pointer` |
 * | `--combobox-pill-remove-display` | `flex` |
 * | `--combobox-pill-remove-hover-background` | `rgb(0 0 0 / 0.1)` |
 * | `--combobox-pill-remove-hover-opacity` | `1` |
 * | `--combobox-pill-remove-icon-size` | `0.625rem` |
 * | `--combobox-pill-remove-justify-content` | `center` |
 * | `--combobox-pill-remove-opacity` | `0.7` |
 * | `--combobox-pill-remove-padding` | `0` |
 * | `--combobox-pill-remove-size` | `0.875rem` |
 * | `--combobox-pill-remove-transition` | `opacity 150ms` |
 * | `--combobox-pill-text-max-width` | `8rem` |
 * | `--combobox-pill-text-overflow` | `hidden` |
 * | `--combobox-pill-text-overflow-style` | `ellipsis` |
 * | `--combobox-pill-text-white-space` | `nowrap` |
 * | `--combobox-trigger-background-color` | `transparent` |
 * | `--combobox-trigger-border-color` | `var(--input, var(--border))` |
 * | `--combobox-trigger-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--combobox-trigger-border-style` | `solid` |
 * | `--combobox-trigger-border-width` | `1px` |
 * | `--combobox-trigger-box-shadow` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
 * | `--combobox-trigger-disabled-opacity` | `0.5` |
 * | `--combobox-trigger-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--combobox-trigger-height` | `2rem` |
 * | `--combobox-trigger-icon-opacity` | `0.5` |
 * | `--combobox-trigger-icon-size` | `1rem` |
 * | `--combobox-trigger-line-height` | `1.25rem` |
 * | `--combobox-trigger-outline-color` | `var(--ring)` |
 * | `--combobox-trigger-outline-offset` | `2px` |
 * | `--combobox-trigger-outline-width` | `1px` |
 * | `--combobox-trigger-padding` | `var(--spacing-4, 0.5rem) var(--spacing-6, 0.75rem)` |
 * | `--combobox-trigger-placeholder-color` | `var(--muted-foreground)` |
 * | `--combobox-trigger-value-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--combobox-trigger-value-gap` | `var(--command-item-gap, var(--spacing-4, 0.5rem))` |
 * | `--combobox-trigger-value-icon-size` | `1rem` |
 * | `--combobox-trigger-value-line-height` | `var(--command-item-line-height, 1.25rem)` |
 * | `--combobox-trigger-width` | `100%` |
 */
// #endregion css-tokens

export type * from './combobox.js';
export {
	Combobox,
	ComboboxCommand,
	ComboboxContent,
	ComboboxCreateItem,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxHint,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxLoading,
	ComboboxMultiTrigger,
	ComboboxPill,
	ComboboxSeparator,
	ComboboxTrigger,
} from './combobox.js';
export {
	ComboboxSimple,
	type ComboboxSimpleGroup,
	type ComboboxSimpleItem,
	type ComboboxSimpleProps,
} from './presets/combobox-simple.js';
