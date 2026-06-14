// #region css-tokens
/**
 * CSS Tokens for tooltip
 * Prefix: `--tooltip-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--tooltip-arrow-border-radius` | `2px` |
 * | `--tooltip-arrow-height` | `10px` |
 * | `--tooltip-arrow-width` | `10px` |
 * | `--tooltip-background` | `var(--l2-background)` |
 * | `--tooltip-border-color` | `var(--l2-border)` |
 * | `--tooltip-border-radius` | `calc(var(--radius-sm) - 4px)` |
 * | `--tooltip-border-style` | `solid` |
 * | `--tooltip-border-width` | `1px` |
 * | `--tooltip-box-shadow` | `0 6px 12px 0 rgba(0, 0, 0, 0.2)` |
 * | `--tooltip-font-size` | `var(--periscope-font-size-small)` |
 * | `--tooltip-foreground` | `var(--l1-foreground)` |
 * | `--tooltip-letter-spacing` | `-0.06px` |
 * | `--tooltip-line-height` | `18px` |
 * | `--tooltip-padding` | `var(--spacing-2) var(--spacing-4)` |
 * | `--tooltip-text-wrap` | `balance` |
 * | `--tooltip-transform-origin` | `var(--radix-tooltip-content-transform-origin)` |
 * | `--tooltip-width` | `fit-content` |
 * | `--tooltip-z-index` | `50` |
 */
// #endregion css-tokens

export { TooltipSimple, type TooltipSimpleProps } from './presets/tooltip-simple.js';
export { TooltipContent, type TooltipContentProps } from './subcomponents/tooltip-content.js';
export { TooltipProvider, type TooltipProviderProps } from './subcomponents/tooltip-provider.js';
export { TooltipRoot, type TooltipRootProps } from './subcomponents/tooltip-root.js';
export { TooltipTrigger, type TooltipTriggerProps } from './subcomponents/tooltip-trigger.js';
