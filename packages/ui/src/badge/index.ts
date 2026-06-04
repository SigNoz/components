// #region css-tokens
/**
 * CSS Tokens for badge
 * Prefix: `--badge-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--badge-align-items` | `center` |
 * | `--badge-background` | `var(--accent-aqua)` |
 * | `--badge-border-color` | `var(--l2-border)` |
 * | `--badge-border-radius` | `var(--radius-round, 9999px)` |
 * | `--badge-border-width` | `1px` |
 * | `--badge-box-shadow` | `0 0 0 3px color-mix(in srgb, var(--ring) 50%, t...` |
 * | `--badge-capitalize-font-weight` | `var(--font-weight-normal)` |
 * | `--badge-child-display` | `block` |
 * | `--badge-close-border-radius` | `var(--radius-round, 9999px)` |
 * | `--badge-close-focus-outline` | `1px solid currentColor` |
 * | `--badge-close-focus-outline-offset` | `1px` |
 * | `--badge-close-hover-background` | `color-mix(in srgb, currentColor 16%, transparent)` |
 * | `--badge-close-icon-size` | `0.75rem` |
 * | `--badge-close-margin-inline-end` | `-0.125rem` |
 * | `--badge-close-size` | `0.875rem` |
 * | `--badge-cursor` | `default` |
 * | `--badge-display` | `inline-flex` |
 * | `--badge-focus-border-color` | `var(--ring)` |
 * | `--badge-focus-outline` | `none` |
 * | `--badge-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--badge-font-variant-numeric` | `slashed-zero` |
 * | `--badge-font-weight` | `var(--font-weight-medium)` |
 * | `--badge-foreground` | `var(--accent-aqua-foreground)` |
 * | `--badge-gap` | `var(--spacing-2, 0.25rem)` |
 * | `--badge-hover-background` | `var(--accent-aqua-hover)` |
 * | `--badge-invalid-border-color` | `var(--destructive)` |
 * | `--badge-invalid-box-shadow` | `0 0 0 3px color-mix(in srgb, var(--destructive)...` |
 * | `--badge-justify-content` | `center` |
 * | `--badge-line-height` | `100%` |
 * | `--badge-outline-background-color` | `color-mix(in oklab, var(--badge-background) 10%...` |
 * | `--badge-outline-border-color` | `var(--l2-border)` |
 * | `--badge-outline-color` | `var(--l2-foreground)` |
 * | `--badge-outline-hover-background-color` | `var(--l2-background-hover)` |
 * | `--badge-overflow` | `hidden` |
 * | `--badge-padding` | `var(--spacing-2, 0.25rem) var(--spacing-4, 0.5rem)` |
 * | `--badge-transition-duration` | `150ms` |
 * | `--badge-transition-property` | `color, box-shadow` |
 * | `--badge-transition-timing-function` | `cubic-bezier(0.4, 0, 0.2, 1)` |
 * | `--badge-white-space` | `nowrap` |
 * | `--badge-width` | `fit-content` |
 */
// #endregion css-tokens

export type * from './badge.js';
export { Badge } from './badge.js';
