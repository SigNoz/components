// #region css-tokens
/**
 * CSS Tokens for button
 * Prefix: `--button-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--button-action-border` | `var(--action-border)` |
 * | `--button-action-hover-border` | `var(--action-border-hover)` |
 * | `--button-action-hover-text` | `var(--action-foreground-hover)` |
 * | `--button-action-ink-400-background` | `var(--action-background)` |
 * | `--button-action-ink-400-border` | `var(--action-border)` |
 * | `--button-action-ink-400-hover-background` | `var(--action-background-hover)` |
 * | `--button-action-ink-400-hover-border` | `var(--action-border-hover)` |
 * | `--button-action-ink-400-hover-text` | `var(--action-foreground-hover)` |
 * | `--button-action-ink-400-text` | `var(--action-foreground)` |
 * | `--button-action-ink-500-background` | `var(--action-background)` |
 * | `--button-action-ink-500-border` | `var(--action-border)` |
 * | `--button-action-ink-500-hover-background` | `var(--action-background-hover)` |
 * | `--button-action-ink-500-hover-border` | `var(--action-border-hover)` |
 * | `--button-action-ink-500-hover-text` | `var(--action-foreground-hover)` |
 * | `--button-action-ink-500-text` | `var(--action-foreground)` |
 * | `--button-action-text` | `var(--action-foreground)` |
 * | `--button-action-vanilla-100-background` | `var(--action-background)` |
 * | `--button-action-vanilla-100-border` | `var(--action-border)` |
 * | `--button-action-vanilla-100-hover-background` | `var(--action-background-hover)` |
 * | `--button-action-vanilla-100-hover-border` | `var(--action-border-hover)` |
 * | `--button-action-vanilla-100-hover-text` | `var(--action-foreground-hover)` |
 * | `--button-action-vanilla-100-text` | `var(--action-foreground)` |
 * | `--button-action-vanilla-200-background` | `var(--action-background)` |
 * | `--button-action-vanilla-200-border` | `var(--action-border)` |
 * | `--button-action-vanilla-200-hover-background` | `var(--action-background-hover)` |
 * | `--button-action-vanilla-200-hover-border` | `var(--action-border-hover)` |
 * | `--button-action-vanilla-200-hover-text` | `var(--action-foreground-hover)` |
 * | `--button-action-vanilla-200-text` | `var(--action-foreground)` |
 * | `--button-affix-flex-shrink` | `0` |
 * | `--button-align-items` | `center` |
 * | `--button-animate-fast-spin` | `spin 0.7s linear infinite` |
 * | `--button-base-border-color` | `transparent` |
 * | `--button-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--button-cursor` | `pointer` |
 * | `--button-destructive-background` | `var(--danger-background)` |
 * | `--button-destructive-border-color` | `var(--danger-background)` |
 * | `--button-destructive-ghost-hover-foreground` | `var(--danger-foreground-hover)` |
 * | `--button-destructive-hover-background` | `var(--danger-background-hover)` |
 * | `--button-destructive-link-hover-foreground` | `var(--danger-background-hover)` |
 * | `--button-destructive-outlined-foreground` | `var(--danger-background)` |
 * | `--button-destructive-solid-foreground` | `var(--danger-foreground)` |
 * | `--button-disabled-opacity` | `0.6` |
 * | `--button-disabled-pointer-events` | `none` |
 * | `--button-display` | `inline-flex` |
 * | `--button-focus-visible-outline` | `var(--ring) solid 2px` |
 * | `--button-focus-visible-outline-offset` | `2px` |
 * | `--button-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--button-font-variant-numeric` | `slashed-zero` |
 * | `--button-gap` | `var(--spacing-3, 0.375rem)` |
 * | `--button-group-align-items` | `stretch` |
 * | `--button-group-display` | `inline-flex` |
 * | `--button-group-overlap` | `-1px` |
 * | `--button-group-radius` | `calc(var(--radius) - 2px)` |
 * | `--button-height` | `1.5rem` |
 * | `--button-justify-content` | `center` |
 * | `--button-line-height` | `100%` |
 * | `--button-loader-flex-shrink` | `0` |
 * | `--button-loading-cursor` | `wait` |
 * | `--button-none-background` | `var(--ghost-background)` |
 * | `--button-none-border-color` | `var(--ghost-border)` |
 * | `--button-none-ghost-hover-foreground` | `var(--ghost-foreground-hover)` |
 * | `--button-none-hover-background` | `var(--ghost-background-hover)` |
 * | `--button-none-link-hover-foreground` | `var(--ghost-foreground-hover)` |
 * | `--button-none-outlined-foreground` | `var(--ghost-foreground)` |
 * | `--button-none-solid-foreground` | `var(--ghost-foreground)` |
 * | `--button-padding` | `var(--spacing-3, 0.375rem) var(--spacing-4, 0.5...` |
 * | `--button-primary-background` | `var(--primary-background)` |
 * | `--button-primary-border-color` | `var(--primary-background)` |
 * | `--button-primary-ghost-hover-foreground` | `var(--primary-foreground-hover)` |
 * | `--button-primary-hover-background` | `var(--primary-background-hover)` |
 * | `--button-primary-link-hover-foreground` | `var(--primary-background-hover)` |
 * | `--button-primary-outlined-foreground` | `var(--primary)` |
 * | `--button-primary-solid-foreground` | `var(--primary-foreground)` |
 * | `--button-secondary-background` | `var(--secondary-background)` |
 * | `--button-secondary-border-color` | `var(--secondary-border)` |
 * | `--button-secondary-ghost-hover-foreground` | `var(--secondary-foreground-hover)` |
 * | `--button-secondary-hover-background` | `var(--secondary-background-hover)` |
 * | `--button-secondary-link-hover-foreground` | `var(--secondary-foreground-hover)` |
 * | `--button-secondary-outlined-foreground` | `var(--secondary-foreground)` |
 * | `--button-secondary-solid-foreground` | `var(--secondary-foreground)` |
 * | `--button-size-sm-line-height` | `1.5rem` |
 * | `--button-spin-transform` | `rotate(360deg)` |
 * | `--button-transition` | `background-color 150ms ease, 			color 150ms eas...` |
 * | `--button-variant-action-background-color` | `var(--button-internal-action-background)` |
 * | `--button-variant-action-border` | `1px solid var(--button-internal-action-border)` |
 * | `--button-variant-action-color` | `var(--button-internal-action-text)` |
 * | `--button-variant-action-hover-background-color` | `var(--button-internal-action-hover-background)` |
 * | `--button-variant-action-hover-border-color` | `var(--button-internal-action-hover-border)` |
 * | `--button-variant-action-hover-color` | `var(--button-internal-action-hover-text)` |
 * | `--button-variant-dashed-background-color` | `transparent` |
 * | `--button-variant-dashed-border` | `1px dashed var(--button-internal-border-color)` |
 * | `--button-variant-dashed-color` | `var(--button-internal-outlined-foreground)` |
 * | `--button-variant-dashed-hover-background-color` | `var(--button-internal-border-color)` |
 * | `--button-variant-dashed-hover-color` | `var(--button-internal-solid-foreground)` |
 * | `--button-variant-ghost-background-color` | `transparent` |
 * | `--button-variant-ghost-color` | `var(--button-internal-outlined-foreground)` |
 * | `--button-variant-ghost-hover-background-color` | `var(--button-internal-hover-background)` |
 * | `--button-variant-ghost-hover-color` | `var(--button-internal-solid-foreground)` |
 * | `--button-variant-link-background-color` | `transparent` |
 * | `--button-variant-link-color` | `var(--button-internal-outlined-foreground)` |
 * | `--button-variant-link-font-weight` | `500` |
 * | `--button-variant-link-hover-background-color` | `transparent` |
 * | `--button-variant-link-hover-color` | `var(--button-internal-link-hover-foreground)` |
 * | `--button-variant-outlined-background-color` | `transparent` |
 * | `--button-variant-outlined-border` | `1px solid var(--button-internal-border-color)` |
 * | `--button-variant-outlined-color` | `var(--button-internal-outlined-foreground)` |
 * | `--button-variant-outlined-hover-background-color` | `var(--button-internal-border-color)` |
 * | `--button-variant-outlined-hover-color` | `var(--button-internal-solid-foreground)` |
 * | `--button-warning-background` | `var(--warning-background)` |
 * | `--button-warning-border-color` | `var(--warning-background)` |
 * | `--button-warning-ghost-hover-foreground` | `var(--warning-foreground-hover)` |
 * | `--button-warning-hover-background` | `var(--warning-background-hover)` |
 * | `--button-warning-link-hover-foreground` | `var(--warning-background-hover)` |
 * | `--button-warning-outlined-foreground` | `var(--warning-background)` |
 * | `--button-warning-solid-foreground` | `var(--warning-foreground)` |
 * | `--button-white-space` | `nowrap` |
 * | `--button-width` | `2rem` |
 */
// #endregion css-tokens

export type * from './button.js';
export {
	Button,
	ButtonBackground,
	ButtonColor,
	ButtonGroupContext,
	ButtonSize,
	ButtonVariant,
	buttonVariants,
} from './button.js';
export type * from './button-group.js';
export { ButtonGroup } from './button-group.js';
