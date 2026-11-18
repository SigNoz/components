// #region css-tokens
/**
 * CSS Tokens for tooltip
 * Prefix: `--tooltip-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--tooltip-backdrop-filter` | `blur(30px)` |
 * | `--tooltip-background` | `-` |
 * | `--tooltip-background-color` | `var(--tooltip-background)` |
 * | `--tooltip-border` | `-` |
 * | `--tooltip-border-color` | `var(--tooltip-border)` |
 * | `--tooltip-border-radius` | `var(--radius-1)` |
 * | `--tooltip-border-style` | `solid` |
 * | `--tooltip-border-width` | `1px` |
 * | `--tooltip-box-orient` | `vertical` |
 * | `--tooltip-box-shadow` | `var(--tooltip-shadow)` |
 * | `--tooltip-box-sizing` | `border-box` |
 * | `--tooltip-display` | `-webkit-box` |
 * | `--tooltip-divider` | `-` |
 * | `--tooltip-divider-background-color` | `var(--tooltip-divider)` |
 * | `--tooltip-divider-block-size` | `1px` |
 * | `--tooltip-divider-margin-inline` | `calc(-1 * var(--spacing-4))` |
 * | `--tooltip-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--tooltip-font-feature-settings` | `'ss01' 1` |
 * | `--tooltip-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--tooltip-font-variant-numeric` | `normal` |
 * | `--tooltip-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--tooltip-foreground` | `var(--tooltip-label)` |
 * | `--tooltip-label` | `-` |
 * | `--tooltip-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--tooltip-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--tooltip-max-height` | `8.5rem` |
 * | `--tooltip-max-lines` | `6` |
 * | `--tooltip-max-width` | `26.25rem` |
 * | `--tooltip-overflow` | `hidden` |
 * | `--tooltip-padding` | `var(--spacing-1) var(--spacing-4)` |
 * | `--tooltip-positioner-pointer-events` | `auto` |
 * | `--tooltip-positioner-width` | `max-content` |
 * | `--tooltip-shadow` | `-` |
 * | `--tooltip-stack-display` | `flex` |
 * | `--tooltip-stack-flex-direction` | `column` |
 * | `--tooltip-stack-gap` | `var(--spacing-2)` |
 * | `--tooltip-text-align` | `start` |
 * | `--tooltip-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--tooltip-text-wrap` | `balance` |
 * | `--tooltip-trigger-color` | `inherit` |
 * | `--tooltip-trigger-font` | `inherit` |
 * | `--tooltip-trigger-letter-spacing` | `inherit` |
 * | `--tooltip-trigger-text-transform` | `inherit` |
 * | `--tooltip-trigger-word-spacing` | `inherit` |
 * | `--tooltip-width` | `fit-content` |
 * | `--tooltip-z-index` | `50` |
 */
// #endregion css-tokens

export { Tooltip } from './presets/tooltip.js';
export { type TooltipProps } from './types.js';
export { TooltipProvider, type TooltipProviderProps } from './subcomponents/tooltip-provider.js';
export { type TooltipContainer } from './tooltip-config-context.js';
