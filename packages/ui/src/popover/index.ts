// #region css-tokens
/**
 * CSS Tokens for popover
 * Prefix: `--popover-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--popover-arrow-border-radius` | `2px` |
 * | `--popover-arrow-height` | `10px` |
 * | `--popover-arrow-width` | `10px` |
 * | `--popover-background` | `var(--l2-background)` |
 * | `--popover-border-color` | `var(--l2-border)` |
 * | `--popover-border-radius` | `var(--radius-2, 4px)` |
 * | `--popover-border-style` | `solid` |
 * | `--popover-border-width` | `1px` |
 * | `--popover-box-shadow` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2...` |
 * | `--popover-foreground` | `var(--l1-foreground)` |
 * | `--popover-padding` | `var(--spacing-8)` |
 * | `--popover-transform-origin` | `var(--radix-popover-content-transform-origin)` |
 * | `--popover-width` | `fit-content` |
 */
// #endregion css-tokens

export {
	Popover,
	PopoverAnchor,
	type PopoverAnchorProps,
	PopoverArrow,
	type PopoverArrowProps,
	PopoverClose,
	type PopoverCloseProps,
	PopoverContent,
	type PopoverContentProps,
	PopoverPortal,
	type PopoverPortalProps,
	type PopoverProps,
	PopoverTrigger,
	type PopoverTriggerProps,
} from './popover.js';
export { PopoverSimple, type PopoverSimpleProps } from './presets/popover-simple.js';
