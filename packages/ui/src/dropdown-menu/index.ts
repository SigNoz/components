// #region css-tokens
/**
 * CSS Tokens for dropdown-menu
 * Prefix: `--dropdown-menu-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--dropdown-menu-back-border-radius` | `var(--radius-1, 2px)` |
 * | `--dropdown-menu-back-disabled-opacity` | `0.5` |
 * | `--dropdown-menu-back-focus-background` | `var(--l2-background-hover)` |
 * | `--dropdown-menu-back-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--dropdown-menu-back-font-weight` | `var(--font-weight-medium, 500)` |
 * | `--dropdown-menu-back-foreground` | `var(--l1-foreground)` |
 * | `--dropdown-menu-back-gap` | `var(--spacing-4, 8px)` |
 * | `--dropdown-menu-back-hover-background` | `var(--l1-background-hover)` |
 * | `--dropdown-menu-back-icon-size` | `14px` |
 * | `--dropdown-menu-back-line-height` | `1` |
 * | `--dropdown-menu-back-padding` | `var(--spacing-5, 10px) var(--spacing-6, 12px)` |
 * | `--dropdown-menu-checkbox-indicator-right` | `var(--spacing-4, 8px)` |
 * | `--dropdown-menu-checkbox-indicator-size` | `14px` |
 * | `--dropdown-menu-checkbox-item-border-radius` | `var(--radius-1, 2px)` |
 * | `--dropdown-menu-checkbox-item-disabled-opacity` | `0.5` |
 * | `--dropdown-menu-checkbox-item-focus-background` | `var(--l2-background-hover)` |
 * | `--dropdown-menu-checkbox-item-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--dropdown-menu-checkbox-item-foreground` | `var(--l1-foreground)` |
 * | `--dropdown-menu-checkbox-item-hover-background` | `var(--l1-background-hover)` |
 * | `--dropdown-menu-checkbox-item-line-height` | `1` |
 * | `--dropdown-menu-checkbox-item-padding` | `var(--spacing-5, 10px) var(--dropdown-menu-chec...` |
 * | `--dropdown-menu-checkbox-item-padding-right` | `calc(var(--dropdown-menu-checkbox-indicator-rig...` |
 * | `--dropdown-menu-content-background` | `var(--l1-background)` |
 * | `--dropdown-menu-content-border-color` | `var(--l2-border)` |
 * | `--dropdown-menu-content-border-radius` | `var(--radius-2, 4px)` |
 * | `--dropdown-menu-content-border-style` | `solid` |
 * | `--dropdown-menu-content-border-width` | `1px` |
 * | `--dropdown-menu-content-box-shadow` | `4px 10px 16px 2px rgba(0, 0, 0, 0.2)` |
 * | `--dropdown-menu-content-foreground` | `var(--l1-foreground)` |
 * | `--dropdown-menu-content-min-width` | `8rem` |
 * | `--dropdown-menu-content-padding` | `var(--spacing-2, 4px)` |
 * | `--dropdown-menu-content-z-index` | `50` |
 * | `--dropdown-menu-item-border-radius` | `var(--radius-1, 2px)` |
 * | `--dropdown-menu-item-destructive-foreground` | `var(--danger-background)` |
 * | `--dropdown-menu-item-destructive-hover-foreground` | `var(--danger-background-hover)` |
 * | `--dropdown-menu-item-disabled-opacity` | `0.5` |
 * | `--dropdown-menu-item-focus-background` | `var(--l2-background-hover)` |
 * | `--dropdown-menu-item-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--dropdown-menu-item-foreground` | `var(--l1-foreground)` |
 * | `--dropdown-menu-item-gap` | `var(--spacing-4, 8px)` |
 * | `--dropdown-menu-item-hover-background` | `var(--l1-background-hover)` |
 * | `--dropdown-menu-item-icon-size` | `14px` |
 * | `--dropdown-menu-item-inset-padding-left` | `var(--spacing-8, 32px)` |
 * | `--dropdown-menu-item-line-height` | `1` |
 * | `--dropdown-menu-item-min-width` | `177px` |
 * | `--dropdown-menu-item-padding` | `var(--spacing-5, 10px) var(--spacing-6, 12px)` |
 * | `--dropdown-menu-label-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--dropdown-menu-label-font-weight` | `var(--font-weight-medium, 500)` |
 * | `--dropdown-menu-label-foreground` | `var(--l3-foreground)` |
 * | `--dropdown-menu-label-inset-padding-left` | `var(--spacing-8, 32px)` |
 * | `--dropdown-menu-label-letter-spacing` | `0.44px` |
 * | `--dropdown-menu-label-line-height` | `1` |
 * | `--dropdown-menu-label-padding` | `var(--spacing-4, 8px) var(--spacing-6, 12px)` |
 * | `--dropdown-menu-loading-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--dropdown-menu-loading-foreground` | `var(--l1-foreground)` |
 * | `--dropdown-menu-loading-gap` | `var(--spacing-4, 8px)` |
 * | `--dropdown-menu-loading-padding` | `var(--spacing-8, 16px)` |
 * | `--dropdown-menu-loading-spinner-size` | `16px` |
 * | `--dropdown-menu-multi-step-content-background` | `var(--l1-background)` |
 * | `--dropdown-menu-multi-step-content-border-color` | `var(--l2-border)` |
 * | `--dropdown-menu-multi-step-content-border-radius` | `var(--radius-md, 6px)` |
 * | `--dropdown-menu-multi-step-content-border-style` | `solid` |
 * | `--dropdown-menu-multi-step-content-border-width` | `1px` |
 * | `--dropdown-menu-multi-step-content-box-shadow` | `4px 10px 16px 2px rgba(0, 0, 0, 0.2)` |
 * | `--dropdown-menu-multi-step-content-foreground` | `var(--l1-foreground)` |
 * | `--dropdown-menu-multi-step-content-min-width` | `8rem` |
 * | `--dropdown-menu-multi-step-content-padding` | `var(--spacing-2, 4px)` |
 * | `--dropdown-menu-multi-step-trigger-border-radius` | `var(--radius-1, 2px)` |
 * | `--dropdown-menu-multi-step-trigger-chevron-size` | `14px` |
 * | `--dropdown-menu-multi-step-trigger-disabled-opacity` | `0.5` |
 * | `--dropdown-menu-multi-step-trigger-focus-background` | `var(--l2-background-hover)` |
 * | `--dropdown-menu-multi-step-trigger-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--dropdown-menu-multi-step-trigger-foreground` | `var(--l1-foreground)` |
 * | `--dropdown-menu-multi-step-trigger-gap` | `var(--spacing-4, 8px)` |
 * | `--dropdown-menu-multi-step-trigger-hover-background` | `var(--l1-background-hover)` |
 * | `--dropdown-menu-multi-step-trigger-icon-size` | `14px` |
 * | `--dropdown-menu-multi-step-trigger-line-height` | `1` |
 * | `--dropdown-menu-multi-step-trigger-padding` | `var(--spacing-5, 10px) var(--spacing-6, 12px)` |
 * | `--dropdown-menu-radio-indicator-right` | `var(--spacing-4, 8px)` |
 * | `--dropdown-menu-radio-indicator-size` | `14px` |
 * | `--dropdown-menu-radio-item-border-radius` | `var(--radius-1, 2px)` |
 * | `--dropdown-menu-radio-item-disabled-opacity` | `0.5` |
 * | `--dropdown-menu-radio-item-focus-background` | `var(--l2-background-hover)` |
 * | `--dropdown-menu-radio-item-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--dropdown-menu-radio-item-foreground` | `var(--l1-foreground)` |
 * | `--dropdown-menu-radio-item-hover-background` | `var(--l1-background-hover)` |
 * | `--dropdown-menu-radio-item-line-height` | `1` |
 * | `--dropdown-menu-radio-item-padding` | `var(--spacing-5, 10px) var(--dropdown-menu-radi...` |
 * | `--dropdown-menu-radio-item-padding-right` | `calc(var(--dropdown-menu-radio-indicator-right,...` |
 * | `--dropdown-menu-search-icon-color` | `var(--muted-foreground)` |
 * | `--dropdown-menu-search-icon-left` | `var(--spacing-6, 12px)` |
 * | `--dropdown-menu-search-icon-size` | `14px` |
 * | `--dropdown-menu-search-input-background` | `transparent` |
 * | `--dropdown-menu-search-input-border-color` | `var(--border)` |
 * | `--dropdown-menu-search-input-border-radius` | `var(--radius-2, 4px)` |
 * | `--dropdown-menu-search-input-border-width` | `1px` |
 * | `--dropdown-menu-search-input-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--dropdown-menu-search-input-foreground` | `var(--l1-foreground)` |
 * | `--dropdown-menu-search-input-padding` | `var(--spacing-4, 8px) var(--spacing-6, 12px) va...` |
 * | `--dropdown-menu-search-input-placeholder-color` | `var(--muted-foreground)` |
 * | `--dropdown-menu-separator-background` | `var(--l2-border)` |
 * | `--dropdown-menu-separator-height` | `1px` |
 * | `--dropdown-menu-separator-margin` | `var(--spacing-2, 4px) calc(-1 * var(--spacing-2...` |
 * | `--dropdown-menu-shortcut-font-family` | `var(--font-mono, monospace)` |
 * | `--dropdown-menu-shortcut-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--dropdown-menu-shortcut-letter-spacing` | `0.05em` |
 * | `--dropdown-menu-shortcut-opacity` | `0.6` |
 * | `--dropdown-menu-sub-content-background` | `var(--l1-background)` |
 * | `--dropdown-menu-sub-content-border-color` | `var(--l2-border)` |
 * | `--dropdown-menu-sub-content-border-radius` | `var(--radius-2, 4px)` |
 * | `--dropdown-menu-sub-content-border-style` | `solid` |
 * | `--dropdown-menu-sub-content-border-width` | `1px` |
 * | `--dropdown-menu-sub-content-box-shadow` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2...` |
 * | `--dropdown-menu-sub-content-foreground` | `var(--l1-foreground)` |
 * | `--dropdown-menu-sub-content-min-width` | `8rem` |
 * | `--dropdown-menu-sub-content-padding` | `var(--spacing-2, 4px)` |
 * | `--dropdown-menu-sub-content-z-index` | `50` |
 * | `--dropdown-menu-sub-trigger-border-radius` | `var(--radius-1, 2px)` |
 * | `--dropdown-menu-sub-trigger-chevron-size` | `14px` |
 * | `--dropdown-menu-sub-trigger-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--dropdown-menu-sub-trigger-foreground` | `var(--l1-foreground)` |
 * | `--dropdown-menu-sub-trigger-gap` | `var(--spacing-4, 8px)` |
 * | `--dropdown-menu-sub-trigger-hover-background` | `var(--l1-background-hover)` |
 * | `--dropdown-menu-sub-trigger-icon-size` | `14px` |
 * | `--dropdown-menu-sub-trigger-inset-padding-left` | `var(--spacing-8, 32px)` |
 * | `--dropdown-menu-sub-trigger-line-height` | `1` |
 * | `--dropdown-menu-sub-trigger-open-background` | `var(--l2-background-hover)` |
 * | `--dropdown-menu-sub-trigger-padding` | `var(--spacing-5, 10px) var(--spacing-6, 12px)` |
 */
// #endregion css-tokens

export {
	type BaseMenuItem,
	type CheckboxMenuItem,
	DropdownMenu,
	DropdownMenuBack,
	type DropdownMenuBackProps,
	DropdownMenuCheckboxItem,
	type DropdownMenuCheckboxItemProps,
	DropdownMenuContent,
	type DropdownMenuContentProps,
	DropdownMenuGroup,
	type DropdownMenuGroupProps,
	DropdownMenuItem,
	type DropdownMenuItemProps,
	DropdownMenuLabel,
	type DropdownMenuLabelProps,
	DropdownMenuLoading,
	type DropdownMenuLoadingProps,
	DropdownMenuMultiStep,
	DropdownMenuMultiStepContent,
	type DropdownMenuMultiStepContentProps,
	type DropdownMenuMultiStepProps,
	DropdownMenuMultiStepTrigger,
	type DropdownMenuMultiStepTriggerProps,
	DropdownMenuPortal,
	type DropdownMenuPortalProps,
	type DropdownMenuProps,
	DropdownMenuRadioGroup,
	type DropdownMenuRadioGroupProps,
	DropdownMenuRadioItem,
	type DropdownMenuRadioItemProps,
	DropdownMenuSearch,
	type DropdownMenuSearchProps,
	DropdownMenuSeparator,
	type DropdownMenuSeparatorProps,
	DropdownMenuShortcut,
	type DropdownMenuShortcutProps,
	DropdownMenuSimple,
	DropdownMenuSub,
	DropdownMenuSubContent,
	type DropdownMenuSubContentProps,
	type DropdownMenuSubProps,
	DropdownMenuSubTrigger,
	type DropdownMenuSubTriggerProps,
	DropdownMenuTrigger,
	type DropdownMenuTriggerProps,
	type DropdownProps,
	type MenuDivider,
	type MenuGroup,
	type MenuItem,
	type MenuProps,
	type RadioGroupMenuItem,
	type RadioMenuItem,
	type SubMenuItem,
} from './subcomponents/index.js';
