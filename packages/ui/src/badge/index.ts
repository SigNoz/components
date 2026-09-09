// #region css-tokens
/**
 * CSS Tokens for badge
 * Prefix: `--badge-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--badge-affix-flex-shrink` | `0` |
 * | `--badge-affix-size` | `12px` |
 * | `--badge-align-items` | `center` |
 * | `--badge-archive-background` | `var(--bg-sienna-500)` |
 * | `--badge-archive-foreground` | `var(--text-ink-500)` |
 * | `--badge-border-color` | `var(--badge-internal-border-color, transparent)` |
 * | `--badge-border-radius` | `var(--radius-round)` |
 * | `--badge-border-width` | `1px` |
 * | `--badge-cursor` | `default` |
 * | `--badge-danger-background` | `var(--danger-background)` |
 * | `--badge-danger-foreground` | `var(--danger-foreground)` |
 * | `--badge-danger-outlined-background` | `-` |
 * | `--badge-danger-outlined-border` | `-` |
 * | `--badge-danger-outlined-label` | `-` |
 * | `--badge-display` | `inline-flex` |
 * | `--badge-font-size` | `var(--periscope-font-size-small)` |
 * | `--badge-font-variant-numeric` | `slashed-zero` |
 * | `--badge-font-weight` | `var(--font-weight-medium)` |
 * | `--badge-gap` | `var(--spacing-2)` |
 * | `--badge-height` | `var(--spacing-10)` |
 * | `--badge-highlight-danger-background` | `var(--bg-sakura-500)` |
 * | `--badge-highlight-danger-foreground` | `var(--text-ink-500)` |
 * | `--badge-info-background` | `var(--bg-aqua-500)` |
 * | `--badge-info-foreground` | `var(--text-ink-500)` |
 * | `--badge-label-align-items` | `center` |
 * | `--badge-label-display` | `block` |
 * | `--badge-label-gap` | `var(--spacing-2)` |
 * | `--badge-label-justify-content` | `flex-start` |
 * | `--badge-label-min-width` | `0` |
 * | `--badge-label-overflow` | `hidden` |
 * | `--badge-label-text-overflow` | `ellipsis` |
 * | `--badge-label-tooltip-max-width` | `20rem` |
 * | `--badge-label-white-space` | `nowrap` |
 * | `--badge-line-height` | `100%` |
 * | `--badge-max-width` | `var(--badge-internal-max-width, min(100%, 7.5rem))` |
 * | `--badge-outlined-background-color` | `var(--badge-internal-outlined-background, color...` |
 * | `--badge-outlined-border-color` | `var(--badge-internal-outlined-border, color-mix...` |
 * | `--badge-outlined-color` | `var(--badge-internal-outlined-foreground, var(-...` |
 * | `--badge-padding` | `var(--spacing-2) var(--spacing-4)` |
 * | `--badge-primary-background` | `var(--primary-background)` |
 * | `--badge-primary-foreground` | `var(--primary-foreground)` |
 * | `--badge-primary-outlined-background` | `-` |
 * | `--badge-primary-outlined-border` | `-` |
 * | `--badge-primary-outlined-label` | `-` |
 * | `--badge-secondary-background` | `var(--surface-3)` |
 * | `--badge-secondary-border-color` | `var(--secondary-border)` |
 * | `--badge-secondary-foreground` | `var(--secondary-foreground)` |
 * | `--badge-secondary-outlined-background` | `-` |
 * | `--badge-secondary-outlined-border` | `-` |
 * | `--badge-secondary-outlined-label` | `-` |
 * | `--badge-success-background` | `var(--success-background)` |
 * | `--badge-success-foreground` | `var(--success-foreground)` |
 * | `--badge-success-outlined-background` | `-` |
 * | `--badge-success-outlined-border` | `-` |
 * | `--badge-success-outlined-label` | `-` |
 * | `--badge-transition-duration` | `150ms` |
 * | `--badge-transition-property` | `box-shadow` |
 * | `--badge-transition-timing-function` | `cubic-bezier(0.4, 0, 0.2, 1)` |
 * | `--badge-warning-background` | `var(--warning-background)` |
 * | `--badge-warning-foreground` | `var(--warning-foreground)` |
 * | `--badge-warning-outlined-background` | `-` |
 * | `--badge-warning-outlined-border` | `-` |
 * | `--badge-warning-outlined-label` | `-` |
 * | `--badge-white-space` | `nowrap` |
 * | `--badge-width` | `var(--badge-internal-width, fit-content)` |
 */
// #endregion css-tokens

export { Badge } from './badge.js';
export { BadgeColor, BadgeTextOverflow, BadgeTextTransform, BadgeVariant } from './constants.js';
export type {
	BadgeColorType,
	BadgeProps,
	BadgeTextOverflowType,
	BadgeTextTransformType,
	BadgeVariantType,
} from './types.js';
