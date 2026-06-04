// #region css-tokens
/**
 * CSS Tokens for input
 * Prefix: `--input-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--input-background` | `transparent` |
 * | `--input-border-color` | `var(--border)` |
 * | `--input-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--input-border-style` | `solid` |
 * | `--input-border-width` | `1px` |
 * | `--input-box-shadow` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` |
 * | `--input-disabled-background` | `transparent` |
 * | `--input-disabled-cursor` | `not-allowed` |
 * | `--input-disabled-opacity` | `0.5` |
 * | `--input-file-button-color` | `inherit` |
 * | `--input-file-button-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--input-file-button-font-weight` | `500` |
 * | `--input-focus-background` | `transparent` |
 * | `--input-focus-border-color` | `var(--border)` |
 * | `--input-focus-outline-color` | `var(--ring)` |
 * | `--input-focus-outline-offset` | `2px` |
 * | `--input-focus-outline-style` | `solid` |
 * | `--input-focus-outline-width` | `2px` |
 * | `--input-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--input-font-weight` | `inherit` |
 * | `--input-foreground` | `inherit` |
 * | `--input-height` | `2rem` |
 * | `--input-hover-background` | `transparent` |
 * | `--input-hover-border-color` | `var(--border)` |
 * | `--input-inner-background` | `transparent` |
 * | `--input-inner-disabled-cursor` | `var(--input-disabled-cursor, not-allowed)` |
 * | `--input-inner-disabled-opacity` | `1` |
 * | `--input-inner-font-size` | `var(--input-font-size, var(--periscope-font-siz...` |
 * | `--input-inner-font-weight` | `var(--input-font-weight, inherit)` |
 * | `--input-inner-foreground` | `var(--input-foreground, inherit)` |
 * | `--input-inner-line-height` | `var(--input-line-height, 1)` |
 * | `--input-inner-padding` | `0` |
 * | `--input-inner-placeholder-color` | `var(--input-placeholder-color, var(--muted-fore...` |
 * | `--input-line-height` | `1` |
 * | `--input-padding` | `var(--spacing-2, 0.25rem) var(--spacing-6, 0.75...` |
 * | `--input-placeholder-color` | `var(--muted-foreground)` |
 * | `--input-prefix-background` | `transparent` |
 * | `--input-prefix-border-right-color` | `var(--border)` |
 * | `--input-prefix-border-right-style` | `solid` |
 * | `--input-prefix-border-right-width` | `0` |
 * | `--input-prefix-color` | `inherit` |
 * | `--input-prefix-font-size` | `var(--input-font-size, var(--periscope-font-siz...` |
 * | `--input-prefix-height` | `100%` |
 * | `--input-prefix-justify-content` | `center` |
 * | `--input-prefix-min-width` | `auto` |
 * | `--input-prefix-padding` | `0 var(--spacing-4, 0.5rem) 0 var(--spacing-6, 0...` |
 * | `--input-suffix-background` | `transparent` |
 * | `--input-suffix-border-left-color` | `var(--border)` |
 * | `--input-suffix-border-left-style` | `solid` |
 * | `--input-suffix-border-left-width` | `0` |
 * | `--input-suffix-color` | `inherit` |
 * | `--input-suffix-font-size` | `var(--input-font-size, var(--periscope-font-siz...` |
 * | `--input-suffix-height` | `100%` |
 * | `--input-suffix-justify-content` | `center` |
 * | `--input-suffix-min-width` | `auto` |
 * | `--input-suffix-padding` | `0px` |
 * | `--input-transition-duration` | `150ms` |
 * | `--input-transition-property` | `color, background-color, border-color, box-shadow` |
 * | `--input-transition-timing` | `cubic-bezier(0.4, 0, 0.2, 1)` |
 * | `--input-wrapper-background` | `var(--input-background, transparent)` |
 * | `--input-wrapper-border-color` | `var(--input-border-color, var(--border))` |
 * | `--input-wrapper-border-radius` | `var(--input-border-radius, calc(var(--radius) -...` |
 * | `--input-wrapper-border-style` | `var(--input-border-style, solid)` |
 * | `--input-wrapper-border-width` | `var(--input-border-width, 1px)` |
 * | `--input-wrapper-box-shadow` | `var(--input-box-shadow, 0 1px 2px 0 rgba(0, 0, ...` |
 * | `--input-wrapper-disabled-background` | `var(--input-disabled-background, transparent)` |
 * | `--input-wrapper-disabled-cursor` | `var(--input-disabled-cursor, not-allowed)` |
 * | `--input-wrapper-disabled-opacity` | `var(--input-disabled-opacity, 0.5)` |
 * | `--input-wrapper-focus-background` | `var(--input-focus-background, transparent)` |
 * | `--input-wrapper-focus-border-color` | `var(--input-focus-border-color, var(--border))` |
 * | `--input-wrapper-focus-outline-color` | `var(--input-focus-outline-color, var(--ring))` |
 * | `--input-wrapper-focus-outline-offset` | `var(--input-focus-outline-offset, 2px)` |
 * | `--input-wrapper-focus-outline-style` | `var(--input-focus-outline-style, solid)` |
 * | `--input-wrapper-focus-outline-width` | `var(--input-focus-outline-width, 2px)` |
 * | `--input-wrapper-foreground` | `var(--input-foreground, inherit)` |
 * | `--input-wrapper-gap` | `var(--spacing-2, 0.75rem)` |
 * | `--input-wrapper-height` | `var(--input-height, 2rem)` |
 * | `--input-wrapper-hover-background` | `var(--input-hover-background, transparent)` |
 * | `--input-wrapper-hover-border-color` | `var(--input-hover-border-color, var(--border))` |
 * | `--input-wrapper-padding-left` | `var(--spacing-6, 0.75rem)` |
 * | `--input-wrapper-padding-right` | `var(--spacing-6, 0.75rem)` |
 * | `--input-wrapper-transition-duration` | `150ms` |
 * | `--input-wrapper-transition-property` | `color, background-color, border-color, box-shadow` |
 * | `--input-wrapper-transition-timing` | `cubic-bezier(0.4, 0, 0.2, 1)` |
 * | `--input-wrapper-with-prefix-padding-left` | `0` |
 * | `--input-wrapper-with-suffix-padding-right` | `0` |
 */
// #endregion css-tokens

export type * from './input.js';
export { Input } from './input.js';
