// #region css-tokens
/**
 * CSS Tokens for checkbox
 * Prefix: `--checkbox-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--checkbox-archive-background` | `var(--bg-sienna-500)` |
 * | `--checkbox-archive-border-hover` | `var(--bg-sienna-400)` |
 * | `--checkbox-archive-foreground` | `var(--text-ink-500)` |
 * | `--checkbox-background` | `transparent` |
 * | `--checkbox-border` | `var(--l3-foreground)` |
 * | `--checkbox-border-hover` | `var(--checkbox-internal-hover-border-color)` |
 * | `--checkbox-border-radius` | `var(--radius-1)` |
 * | `--checkbox-border-width` | `1.5px` |
 * | `--checkbox-checked-background` | `var(--checkbox-internal-checked-background)` |
 * | `--checkbox-checked-border` | `var(--checkbox-internal-checked-background)` |
 * | `--checkbox-checked-foreground` | `var(--checkbox-internal-checked-foreground)` |
 * | `--checkbox-container-align-items` | `flex-start` |
 * | `--checkbox-container-display` | `inline-flex` |
 * | `--checkbox-container-min-width` | `0` |
 * | `--checkbox-cursor` | `pointer` |
 * | `--checkbox-danger-background` | `var(--danger-background)` |
 * | `--checkbox-danger-border-hover` | `var(--danger-background-hover)` |
 * | `--checkbox-danger-foreground` | `var(--danger-foreground)` |
 * | `--checkbox-disabled-cursor` | `not-allowed` |
 * | `--checkbox-disabled-opacity` | `0.6` |
 * | `--checkbox-focus-visible-outline` | `1px solid var(--ring)` |
 * | `--checkbox-focus-visible-outline-offset` | `1px` |
 * | `--checkbox-gap` | `var(--spacing-5)` |
 * | `--checkbox-highlight-danger-background` | `var(--bg-sakura-500)` |
 * | `--checkbox-highlight-danger-border-hover` | `var(--bg-sakura-400)` |
 * | `--checkbox-highlight-danger-foreground` | `var(--text-ink-500)` |
 * | `--checkbox-icon-size` | `12px` |
 * | `--checkbox-info-background` | `var(--bg-aqua-500)` |
 * | `--checkbox-info-border-hover` | `var(--bg-aqua-400)` |
 * | `--checkbox-info-foreground` | `var(--text-ink-500)` |
 * | `--checkbox-label-color` | `var(--l1-foreground)` |
 * | `--checkbox-label-font-size` | `var(--periscope-font-size-base)` |
 * | `--checkbox-label-font-weight` | `var(--font-weight-normal)` |
 * | `--checkbox-label-line-height` | `18px` |
 * | `--checkbox-label-overflow` | `hidden` |
 * | `--checkbox-label-tooltip-max-width` | `20rem` |
 * | `--checkbox-label-transition` | `opacity 150ms ease` |
 * | `--checkbox-label-white-space` | `nowrap` |
 * | `--checkbox-margin-block-start` | `calc((var(--checkbox-internal-label-line-height...` |
 * | `--checkbox-primary-background` | `var(--primary-background)` |
 * | `--checkbox-primary-border-hover` | `var(--primary-background-hover)` |
 * | `--checkbox-primary-foreground` | `var(--primary-foreground)` |
 * | `--checkbox-readonly-cursor` | `not-allowed` |
 * | `--checkbox-readonly-opacity` | `0.8` |
 * | `--checkbox-secondary-background` | `var(--l2-foreground)` |
 * | `--checkbox-secondary-border-hover` | `var(--l1-foreground-hover)` |
 * | `--checkbox-secondary-foreground` | `var(--l1-background)` |
 * | `--checkbox-size` | `16px` |
 * | `--checkbox-success-background` | `var(--success-background)` |
 * | `--checkbox-success-border-hover` | `var(--success-background-hover)` |
 * | `--checkbox-success-foreground` | `var(--success-foreground)` |
 * | `--checkbox-text-overflow-visible` | `visible` |
 * | `--checkbox-text-text-overflow` | `ellipsis` |
 * | `--checkbox-transition` | `background-color 150ms ease, border-color 150ms...` |
 * | `--checkbox-warning-background` | `var(--warning-background)` |
 * | `--checkbox-warning-border-hover` | `var(--warning-background-hover)` |
 * | `--checkbox-warning-foreground` | `var(--warning-foreground)` |
 * | `--checkbox-wrap-overflow-wrap` | `anywhere` |
 * | `--checkbox-wrap-white-space` | `normal` |
 */
// #endregion css-tokens

export { Checkbox } from './checkbox.js';
export { CHECKBOX_EMPTY_LABEL, CheckboxColor, CheckboxTextOverflow } from './constants.js';
export type {
	CheckboxColorType,
	CheckboxDisableType,
	CheckboxProps,
	CheckboxReadOnlyType,
	CheckboxTextOverflowType,
	ValidateCheckboxProps,
} from './types.js';
