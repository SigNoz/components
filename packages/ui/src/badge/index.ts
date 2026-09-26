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
 * | `--badge-archive-background` | `-` |
 * | `--badge-archive-background-color` | `var(--badge-archive-background)` |
 * | `--badge-archive-color` | `var(--badge-archive-foreground)` |
 * | `--badge-archive-foreground` | `-` |
 * | `--badge-archive-outlined-background` | `-` |
 * | `--badge-archive-outlined-background-color` | `color-mix(in oklab, var(--badge-archive-outline...` |
 * | `--badge-archive-outlined-border` | `-` |
 * | `--badge-archive-outlined-border-color` | `color-mix(in oklab, var(--badge-archive-outline...` |
 * | `--badge-archive-outlined-color` | `var(--badge-archive-outlined-label)` |
 * | `--badge-archive-outlined-label` | `-` |
 * | `--badge-border-color` | `var(--badge-internal-border-color, transparent)` |
 * | `--badge-border-radius` | `var(--radius-round)` |
 * | `--badge-border-width` | `1px` |
 * | `--badge-cursor` | `default` |
 * | `--badge-danger-background` | `-` |
 * | `--badge-danger-background-color` | `var(--badge-danger-background)` |
 * | `--badge-danger-color` | `var(--badge-danger-foreground)` |
 * | `--badge-danger-foreground` | `-` |
 * | `--badge-danger-outlined-background` | `-` |
 * | `--badge-danger-outlined-background-color` | `color-mix(in oklab, var(--badge-danger-outlined...` |
 * | `--badge-danger-outlined-border` | `-` |
 * | `--badge-danger-outlined-border-color` | `color-mix(in oklab, var(--badge-danger-outlined...` |
 * | `--badge-danger-outlined-color` | `var(--badge-danger-outlined-label)` |
 * | `--badge-danger-outlined-label` | `-` |
 * | `--badge-display` | `inline-flex` |
 * | `--badge-font-size` | `var(--periscope-font-size-small)` |
 * | `--badge-font-variant-numeric` | `slashed-zero` |
 * | `--badge-font-weight` | `var(--font-weight-medium)` |
 * | `--badge-gap` | `var(--spacing-2)` |
 * | `--badge-height` | `var(--spacing-10)` |
 * | `--badge-highlight-danger-background` | `-` |
 * | `--badge-highlight-danger-background-color` | `var(--badge-highlight-danger-background)` |
 * | `--badge-highlight-danger-color` | `var(--badge-highlight-danger-foreground)` |
 * | `--badge-highlight-danger-foreground` | `-` |
 * | `--badge-highlight-danger-outlined-background` | `-` |
 * | `--badge-highlight-danger-outlined-background-color` | `color-mix(in oklab, var(--badge-highlight-dange...` |
 * | `--badge-highlight-danger-outlined-border` | `-` |
 * | `--badge-highlight-danger-outlined-border-color` | `color-mix(in oklab, var(--badge-highlight-dange...` |
 * | `--badge-highlight-danger-outlined-color` | `var(--badge-highlight-danger-outlined-label)` |
 * | `--badge-highlight-danger-outlined-label` | `-` |
 * | `--badge-info-background` | `-` |
 * | `--badge-info-background-color` | `var(--badge-info-background)` |
 * | `--badge-info-color` | `var(--badge-info-foreground)` |
 * | `--badge-info-foreground` | `-` |
 * | `--badge-info-outlined-background` | `-` |
 * | `--badge-info-outlined-background-color` | `color-mix(in oklab, var(--badge-info-outlined-b...` |
 * | `--badge-info-outlined-border` | `-` |
 * | `--badge-info-outlined-border-color` | `color-mix(in oklab, var(--badge-info-outlined-b...` |
 * | `--badge-info-outlined-color` | `var(--badge-info-outlined-label)` |
 * | `--badge-info-outlined-label` | `-` |
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
 * | `--badge-outlined-background-color` | `var(--badge-internal-outlined-background)` |
 * | `--badge-outlined-border-color` | `var(--badge-internal-outlined-border)` |
 * | `--badge-outlined-color` | `var(--badge-internal-outlined-foreground)` |
 * | `--badge-padding` | `var(--spacing-2) var(--spacing-4)` |
 * | `--badge-primary-background` | `-` |
 * | `--badge-primary-background-color` | `var(--badge-primary-background)` |
 * | `--badge-primary-color` | `var(--badge-primary-foreground)` |
 * | `--badge-primary-foreground` | `-` |
 * | `--badge-primary-outlined-background` | `-` |
 * | `--badge-primary-outlined-background-color` | `color-mix(in oklab, var(--badge-primary-outline...` |
 * | `--badge-primary-outlined-border` | `-` |
 * | `--badge-primary-outlined-border-color` | `color-mix(in oklab, var(--badge-primary-outline...` |
 * | `--badge-primary-outlined-color` | `var(--badge-primary-outlined-label)` |
 * | `--badge-primary-outlined-label` | `-` |
 * | `--badge-secondary-background` | `-` |
 * | `--badge-secondary-background-color` | `var(--badge-secondary-background)` |
 * | `--badge-secondary-border` | `-` |
 * | `--badge-secondary-border-color` | `var(--badge-secondary-border)` |
 * | `--badge-secondary-color` | `var(--badge-secondary-foreground)` |
 * | `--badge-secondary-foreground` | `-` |
 * | `--badge-secondary-outlined-background` | `-` |
 * | `--badge-secondary-outlined-background-color` | `var(--badge-secondary-outlined-background)` |
 * | `--badge-secondary-outlined-border` | `-` |
 * | `--badge-secondary-outlined-border-color` | `var(--badge-secondary-outlined-border)` |
 * | `--badge-secondary-outlined-color` | `var(--badge-secondary-outlined-label)` |
 * | `--badge-secondary-outlined-label` | `-` |
 * | `--badge-success-background` | `-` |
 * | `--badge-success-background-color` | `var(--badge-success-background)` |
 * | `--badge-success-color` | `var(--badge-success-foreground)` |
 * | `--badge-success-foreground` | `-` |
 * | `--badge-success-outlined-background` | `-` |
 * | `--badge-success-outlined-background-color` | `color-mix(in oklab, var(--badge-success-outline...` |
 * | `--badge-success-outlined-border` | `-` |
 * | `--badge-success-outlined-border-color` | `color-mix(in oklab, var(--badge-success-outline...` |
 * | `--badge-success-outlined-color` | `var(--badge-success-outlined-label)` |
 * | `--badge-success-outlined-label` | `-` |
 * | `--badge-transition-duration` | `150ms` |
 * | `--badge-transition-property` | `box-shadow` |
 * | `--badge-transition-timing-function` | `cubic-bezier(0.4, 0, 0.2, 1)` |
 * | `--badge-warning-background` | `-` |
 * | `--badge-warning-background-color` | `var(--badge-warning-background)` |
 * | `--badge-warning-color` | `var(--badge-warning-foreground)` |
 * | `--badge-warning-foreground` | `-` |
 * | `--badge-warning-outlined-background` | `-` |
 * | `--badge-warning-outlined-background-color` | `color-mix(in oklab, var(--badge-warning-outline...` |
 * | `--badge-warning-outlined-border` | `-` |
 * | `--badge-warning-outlined-border-color` | `color-mix(in oklab, var(--badge-warning-outline...` |
 * | `--badge-warning-outlined-color` | `var(--badge-warning-outlined-label)` |
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
