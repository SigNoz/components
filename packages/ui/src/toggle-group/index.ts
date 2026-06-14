// #region css-tokens
/**
 * CSS Tokens for toggle-group
 * Prefix: `--toggle-group-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--toggle-group-active-bg` | `var(--toggle-group-none-active-bg, var(--l1-bac...` |
 * | `--toggle-group-align-items` | `center` |
 * | `--toggle-group-bg` | `var(--toggle-group-none-bg, transparent)` |
 * | `--toggle-group-bg-hover` | `var(--toggle-group-none-bg-hover, var(--l1-back...` |
 * | `--toggle-group-border` | `var(--toggle-group-none-border, var(--l2-border))` |
 * | `--toggle-group-border-style` | `solid` |
 * | `--toggle-group-border-width` | `1px` |
 * | `--toggle-group-destructive-active-bg` | `var(--danger-background)` |
 * | `--toggle-group-destructive-bg` | `var(--l1-background)` |
 * | `--toggle-group-destructive-bg-hover` | `var(--danger-background-hover)` |
 * | `--toggle-group-destructive-border` | `var(--l2-border)` |
 * | `--toggle-group-destructive-text` | `var(--l1-foreground)` |
 * | `--toggle-group-display` | `flex` |
 * | `--toggle-group-flex-direction` | `row` |
 * | `--toggle-group-item-align-items` | `center` |
 * | `--toggle-group-item-bg` | `transparent` |
 * | `--toggle-group-item-border-color` | `transparent` |
 * | `--toggle-group-item-border-radius` | `0px` |
 * | `--toggle-group-item-border-style` | `solid` |
 * | `--toggle-group-item-border-width` | `0` |
 * | `--toggle-group-item-disabled-opacity` | `0.5` |
 * | `--toggle-group-item-display` | `inline-flex` |
 * | `--toggle-group-item-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--toggle-group-item-font-weight` | `var(--font-weight-normal)` |
 * | `--toggle-group-item-gap` | `var(--spacing-4, 0.5rem)` |
 * | `--toggle-group-item-icon-size` | `0.75rem` |
 * | `--toggle-group-item-justify-content` | `center` |
 * | `--toggle-group-item-line-height` | `1.25rem` |
 * | `--toggle-group-item-padding-left` | `var(--spacing-6, 0.75rem)` |
 * | `--toggle-group-item-padding-right` | `var(--spacing-6, 0.75rem)` |
 * | `--toggle-group-item-size` | `2.25rem` |
 * | `--toggle-group-item-text` | `var(--toggle-group-text)` |
 * | `--toggle-group-item-transition-duration` | `150ms` |
 * | `--toggle-group-justify-content` | `unset` |
 * | `--toggle-group-none-active-bg` | `var(--l1-background-hover)` |
 * | `--toggle-group-none-bg` | `transparent` |
 * | `--toggle-group-none-bg-hover` | `var(--l1-background-hover)` |
 * | `--toggle-group-none-border` | `var(--l2-border)` |
 * | `--toggle-group-none-text` | `var(--l1-foreground)` |
 * | `--toggle-group-overflow` | `hidden` |
 * | `--toggle-group-primary-active-bg` | `var(--primary-background)` |
 * | `--toggle-group-primary-bg` | `var(--l1-background)` |
 * | `--toggle-group-primary-bg-hover` | `var(--primary-background-hover)` |
 * | `--toggle-group-primary-border` | `var(--l2-border)` |
 * | `--toggle-group-primary-text` | `var(--l1-foreground)` |
 * | `--toggle-group-primary-text-active` | `var(--l1-foreground-hover)` |
 * | `--toggle-group-radius` | `var(--radius-md)` |
 * | `--toggle-group-secondary-active-bg` | `var(--l1-background-hover)` |
 * | `--toggle-group-secondary-bg` | `var(--l1-background)` |
 * | `--toggle-group-secondary-bg-hover` | `var(--l1-background-hover)` |
 * | `--toggle-group-secondary-border` | `var(--l2-border)` |
 * | `--toggle-group-secondary-text` | `var(--l1-foreground)` |
 * | `--toggle-group-text` | `var(--toggle-group-none-text, var(--l1-foregrou...` |
 * | `--toggle-group-text-active` | `var(--toggle-group-primary-text-active, var(--l...` |
 * | `--toggle-group-warning-active-bg` | `var(--warning-background)` |
 * | `--toggle-group-warning-bg` | `var(--l1-background)` |
 * | `--toggle-group-warning-bg-hover` | `var(--warning-background-hover)` |
 * | `--toggle-group-warning-border` | `var(--l2-border)` |
 * | `--toggle-group-warning-text` | `var(--l1-foreground)` |
 * | `--toggle-group-width` | `fit-content` |
 */
// #endregion css-tokens

export {
	ToggleGroupSimple,
	type ToggleGroupSimpleItem,
	type ToggleGroupSimpleProps,
} from './presets/toggle-group-simple.js';
export {
	type ToggleColor,
	ToggleColorValue,
	ToggleGroup,
	ToggleGroupItem,
	type ToggleGroupItemProps,
	type ToggleGroupProps,
} from './toggle-group.js';
