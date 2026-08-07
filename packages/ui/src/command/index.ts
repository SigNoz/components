// #region css-tokens
/**
 * CSS Tokens for command
 * Prefix: `--command-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--command-background` | `var(--l2-background)` |
 * | `--command-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--command-dialog-content-overflow` | `hidden` |
 * | `--command-dialog-content-padding` | `0` |
 * | `--command-dialog-group-heading-color` | `var(--muted-foreground)` |
 * | `--command-dialog-group-heading-font-weight` | `500` |
 * | `--command-dialog-group-heading-padding-left` | `var(--spacing-4, 0.5rem)` |
 * | `--command-dialog-group-heading-padding-right` | `var(--spacing-4, 0.5rem)` |
 * | `--command-dialog-group-padding-left` | `var(--spacing-4, 0.5rem)` |
 * | `--command-dialog-group-padding-right` | `var(--spacing-4, 0.5rem)` |
 * | `--command-dialog-group-sibling-padding-top` | `0` |
 * | `--command-dialog-input-height` | `3rem` |
 * | `--command-dialog-input-wrapper-svg-height` | `var(--spacing-12, 1.25rem)` |
 * | `--command-dialog-input-wrapper-svg-width` | `var(--spacing-12, 1.25rem)` |
 * | `--command-dialog-item-icon-size` | `1.25rem` |
 * | `--command-dialog-item-padding` | `var(--spacing-6 0.75rem) var(--spacing-4, 0.5rem)` |
 * | `--command-display` | `flex` |
 * | `--command-empty-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--command-empty-line-height` | `1.25rem` |
 * | `--command-empty-padding` | `var(--spacing-8, 1rem)` |
 * | `--command-empty-text-align` | `center` |
 * | `--command-flex-direction` | `column` |
 * | `--command-foreground` | `var(--foreground)` |
 * | `--command-group-color` | `var(--text)` |
 * | `--command-group-heading-color` | `var(--muted-foreground)` |
 * | `--command-group-heading-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--command-group-heading-font-weight` | `var(--font-weight-medium)` |
 * | `--command-group-heading-line-height` | `1rem` |
 * | `--command-group-heading-padding` | `var(--spacing-3, 0.375rem) var(--spacing-4, 0.5...` |
 * | `--command-group-overflow` | `hidden` |
 * | `--command-group-padding` | `var(--spacing-2, 0.25rem)` |
 * | `--command-height` | `100%` |
 * | `--command-input-background` | `transparent` |
 * | `--command-input-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--command-input-border-width` | `0px` |
 * | `--command-input-disabled-cursor` | `not-allowed` |
 * | `--command-input-disabled-opacity` | `0.5` |
 * | `--command-input-display` | `flex` |
 * | `--command-input-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--command-input-height` | `2.5rem` |
 * | `--command-input-icon-flex-shrink` | `0` |
 * | `--command-input-icon-margin` | `0px var(--spacing-4, 0.5rem) 0px 0px` |
 * | `--command-input-icon-opacity` | `0.5` |
 * | `--command-input-icon-padding` | `0px` |
 * | `--command-input-icon-size` | `1rem` |
 * | `--command-input-line-height` | `1.25rem` |
 * | `--command-input-outline` | `none` |
 * | `--command-input-padding` | `0` |
 * | `--command-input-placeholder-color` | `var(--muted-foreground)` |
 * | `--command-input-width` | `100%` |
 * | `--command-input-wrapper-align-items` | `center` |
 * | `--command-input-wrapper-border-color` | `var(--border)` |
 * | `--command-input-wrapper-border-style` | `solid` |
 * | `--command-input-wrapper-border-width` | `0px 0px 1px 0px` |
 * | `--command-input-wrapper-display` | `flex` |
 * | `--command-input-wrapper-padding` | `0 var(--spacing-4, 0.5rem)` |
 * | `--command-item-align-items` | `center` |
 * | `--command-item-border-radius` | `calc(var(--radius) - 4px)` |
 * | `--command-item-cursor` | `default` |
 * | `--command-item-disabled-opacity` | `0.5` |
 * | `--command-item-disabled-pointer-events` | `none` |
 * | `--command-item-display` | `flex` |
 * | `--command-item-focus-outline-color` | `var(--ring)` |
 * | `--command-item-focus-outline-width` | `2px` |
 * | `--command-item-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--command-item-gap` | `var(--spacing-4, 0.5rem)` |
 * | `--command-item-hover-background-color` | `var(--l2-background-hover)` |
 * | `--command-item-line-height` | `1.25rem` |
 * | `--command-item-outline` | `none` |
 * | `--command-item-padding` | `var(--spacing-3, 0.375rem) var(--spacing-4, 0.5...` |
 * | `--command-item-position` | `relative` |
 * | `--command-item-prefix-align-items` | `center` |
 * | `--command-item-prefix-display` | `flex` |
 * | `--command-item-prefix-flex-shrink` | `0` |
 * | `--command-item-selected-background-color` | `var(--l2-background-hover)` |
 * | `--command-item-selected-color` | `var(--accent-foreground)` |
 * | `--command-item-suffix-align-items` | `center` |
 * | `--command-item-suffix-display` | `flex` |
 * | `--command-item-suffix-flex-shrink` | `0` |
 * | `--command-item-suffix-margin-left` | `auto` |
 * | `--command-item-svg-flex-shrink` | `0` |
 * | `--command-item-svg-pointer-events` | `none` |
 * | `--command-item-svg-size` | `1rem` |
 * | `--command-item-user-select` | `none` |
 * | `--command-list-max-height` | `18.75rem` |
 * | `--command-list-overflow-x` | `hidden` |
 * | `--command-list-overflow-y` | `auto` |
 * | `--command-loading-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--command-loading-line-height` | `1.25rem` |
 * | `--command-loading-padding` | `var(--spacing-8, 1rem)` |
 * | `--command-loading-text-align` | `center` |
 * | `--command-overflow` | `hidden` |
 * | `--command-separator-background-color` | `var(--border)` |
 * | `--command-separator-height` | `1px` |
 * | `--command-separator-margin` | `0 -0.25rem` |
 * | `--command-separator-width` | `100%` |
 * | `--command-shortcut-color` | `var(--muted-foreground)` |
 * | `--command-shortcut-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--command-shortcut-letter-spacing` | `0.05em` |
 * | `--command-shortcut-line-height` | `1rem` |
 * | `--command-shortcut-margin-left` | `auto` |
 * | `--command-width` | `100%` |
 */
// #endregion css-tokens

export { defaultFilter as commandDefaultFilter } from 'cmdk';
export {
	Command,
	CommandDialog,
	type CommandDialogProps,
	CommandEmpty,
	type CommandEmptyProps,
	CommandGroup,
	type CommandGroupProps,
	CommandInput,
	type CommandInputProps,
	CommandItem,
	type CommandItemProps,
	CommandList,
	type CommandListProps,
	CommandLoading,
	type CommandLoadingProps,
	type CommandProps,
	CommandSeparator,
	type CommandSeparatorProps,
	CommandShortcut,
	type CommandShortcutProps,
} from './command.js';
