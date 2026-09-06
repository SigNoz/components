// #region css-tokens
/**
 * CSS Tokens for tooltip
 * Prefix: `--tooltip-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--tooltip-backdrop-filter` | `blur(30px)` |
 * | `--tooltip-background` | `var(--surface-3)` |
 * | `--tooltip-border-color` | `var(--l3-border)` |
 * | `--tooltip-border-radius` | `var(--radius-1)` |
 * | `--tooltip-border-style` | `solid` |
 * | `--tooltip-border-width` | `1px` |
 * | `--tooltip-box-shadow` | `var(--shadow-tooltip)` |
 * | `--tooltip-divider-background` | `var(--l2-border)` |
 * | `--tooltip-divider-block-size` | `1px` |
 * | `--tooltip-divider-margin-inline` | `calc(-1 * var(--spacing-4))` |
 * | `--tooltip-font-size` | `var(--periscope-font-size-base)` |
 * | `--tooltip-font-weight` | `var(--periscope-font-weight-regular)` |
 * | `--tooltip-foreground` | `var(--l1-foreground)` |
 * | `--tooltip-line-height` | `var(--periscope-line-height-base)` |
 * | `--tooltip-max-height` | `8.5rem` |
 * | `--tooltip-max-lines` | `6` |
 * | `--tooltip-max-width` | `26.25rem` |
 * | `--tooltip-overflow` | `hidden` |
 * | `--tooltip-padding` | `var(--spacing-2) var(--spacing-4)` |
 * | `--tooltip-stack-display` | `flex` |
 * | `--tooltip-stack-flex-direction` | `column` |
 * | `--tooltip-stack-gap` | `var(--spacing-2)` |
 * | `--tooltip-text-align` | `start` |
 * | `--tooltip-text-wrap` | `balance` |
 * | `--tooltip-width` | `fit-content` |
 * | `--tooltip-z-index` | `50` |
 */
// #endregion css-tokens

export { Tooltip } from './presets/tooltip.js';
export { type TooltipProps } from './types.js';
export { TooltipProvider, type TooltipProviderProps } from './subcomponents/tooltip-provider.js';
export { type TooltipContainer } from './tooltip-config-context.js';
