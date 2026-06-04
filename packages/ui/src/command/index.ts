// #region css-tokens
/**
 * CSS Tokens for command
 * Prefix: `--command-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--command-background` | `var(--l2-background)` |
 * | `--command-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--command-empty-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--command-empty-line-height` | `1.25rem` |
 * | `--command-empty-padding` | `var(--spacing-8, 1rem)` |
 * | `--command-foreground` | `var(--foreground)` |
 * | `--command-group-heading-color` | `var(--text-muted)` |
 * | `--command-group-heading-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--command-group-heading-font-weight` | `var(--font-weight-medium)` |
 * | `--command-group-heading-line-height` | `1rem` |
 * | `--command-group-heading-padding` | `var(--spacing-3, 0.375rem) var(--spacing-4, 0.5...` |
 * | `--command-group-padding` | `var(--spacing-2, 0.25rem)` |
 * | `--command-input-background` | `transparent` |
 * | `--command-input-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--command-input-border-width` | `0px` |
 * | `--command-input-disabled-opacity` | `0.5` |
 * | `--command-input-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--command-input-height` | `3rem` |
 * | `--command-input-icon-margin` | `0px var(--spacing-4, 0.5rem) 0px 0px` |
 * | `--command-input-icon-opacity` | `0.5` |
 * | `--command-input-icon-padding` | `0px` |
 * | `--command-input-icon-size` | `1rem` |
 * | `--command-input-line-height` | `1.25rem` |
 * | `--command-input-padding` | `0` |
 * | `--command-input-width` | `100%` |
 * | `--command-input-wrapper-border-color` | `var(--border)` |
 * | `--command-input-wrapper-border-style` | `solid` |
 * | `--command-input-wrapper-border-width` | `0px 0px 1px 0px` |
 * | `--command-input-wrapper-padding` | `0 var(--spacing-4, 0.5rem)` |
 * | `--command-item-border-radius` | `calc(var(--radius) - 4px)` |
 * | `--command-item-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--command-item-gap` | `var(--spacing-4, 0.5rem)` |
 * | `--command-item-icon-size` | `1.25rem` |
 * | `--command-item-line-height` | `1.25rem` |
 * | `--command-item-padding` | `var(--spacing-3, 0.375rem) var(--spacing-4, 0.5...` |
 * | `--command-item-selected-background-color` | `var(--l2-background-hover)` |
 * | `--command-item-selected-color` | `var(--accent-foreground)` |
 * | `--command-list-max-height` | `18.75rem` |
 * | `--command-loading-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--command-loading-line-height` | `1.25rem` |
 * | `--command-loading-padding` | `var(--spacing-8, 1rem)` |
 * | `--command-separator-background-color` | `var(--border)` |
 * | `--command-separator-height` | `1px` |
 * | `--command-separator-margin` | `0 -0.25rem` |
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
