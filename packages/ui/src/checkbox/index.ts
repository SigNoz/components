// #region css-tokens
/**
 * CSS Tokens for checkbox
 * Prefix: `--checkbox-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--checkbox-archive-background` | `-` |
 * | `--checkbox-archive-border-hover` | `-` |
 * | `--checkbox-archive-foreground` | `-` |
 * | `--checkbox-background` | `transparent` |
 * | `--checkbox-border` | `-` |
 * | `--checkbox-border-color` | `var(--checkbox-border)` |
 * | `--checkbox-border-hover` | `var(--checkbox-internal-hover-border-color)` |
 * | `--checkbox-border-radius` | `var(--radius-1)` |
 * | `--checkbox-border-width` | `1.5px` |
 * | `--checkbox-box-align-items` | `center` |
 * | `--checkbox-box-display` | `flex` |
 * | `--checkbox-box-justify-content` | `center` |
 * | `--checkbox-checked-background` | `var(--checkbox-internal-checked-background)` |
 * | `--checkbox-checked-border` | `var(--checkbox-internal-checked-background)` |
 * | `--checkbox-checked-foreground` | `var(--checkbox-internal-checked-foreground)` |
 * | `--checkbox-container-align-items` | `flex-start` |
 * | `--checkbox-container-display` | `inline-flex` |
 * | `--checkbox-container-min-width` | `0` |
 * | `--checkbox-cursor` | `pointer` |
 * | `--checkbox-danger-background` | `-` |
 * | `--checkbox-danger-border-hover` | `-` |
 * | `--checkbox-danger-foreground` | `-` |
 * | `--checkbox-disabled-cursor` | `not-allowed` |
 * | `--checkbox-disabled-opacity` | `0.6` |
 * | `--checkbox-display` | `inline-flex` |
 * | `--checkbox-flex-shrink` | `0` |
 * | `--checkbox-focus-ring` | `-` |
 * | `--checkbox-focus-visible-outline` | `1px solid var(--checkbox-focus-ring)` |
 * | `--checkbox-focus-visible-outline-offset` | `1px` |
 * | `--checkbox-gap` | `var(--spacing-5)` |
 * | `--checkbox-highlight-danger-background` | `-` |
 * | `--checkbox-highlight-danger-border-hover` | `-` |
 * | `--checkbox-highlight-danger-foreground` | `-` |
 * | `--checkbox-icon-size` | `12px` |
 * | `--checkbox-info-background` | `-` |
 * | `--checkbox-info-border-hover` | `-` |
 * | `--checkbox-info-foreground` | `-` |
 * | `--checkbox-label` | `-` |
 * | `--checkbox-label-color` | `var(--checkbox-label)` |
 * | `--checkbox-label-font-size` | `var(--periscope-font-size-base)` |
 * | `--checkbox-label-font-weight` | `var(--font-weight-normal)` |
 * | `--checkbox-label-line-height` | `18px` |
 * | `--checkbox-label-overflow` | `hidden` |
 * | `--checkbox-label-tooltip-max-width` | `20rem` |
 * | `--checkbox-label-transition` | `opacity 150ms ease` |
 * | `--checkbox-label-white-space` | `nowrap` |
 * | `--checkbox-margin-block-start` | `calc((var(--checkbox-internal-label-line-height...` |
 * | `--checkbox-primary-background` | `-` |
 * | `--checkbox-primary-border-hover` | `-` |
 * | `--checkbox-primary-foreground` | `-` |
 * | `--checkbox-readonly-cursor` | `not-allowed` |
 * | `--checkbox-readonly-opacity` | `0.8` |
 * | `--checkbox-secondary-background` | `-` |
 * | `--checkbox-secondary-border-hover` | `-` |
 * | `--checkbox-secondary-foreground` | `-` |
 * | `--checkbox-size` | `16px` |
 * | `--checkbox-success-background` | `-` |
 * | `--checkbox-success-border-hover` | `-` |
 * | `--checkbox-success-foreground` | `-` |
 * | `--checkbox-text-overflow-visible` | `visible` |
 * | `--checkbox-text-text-overflow` | `ellipsis` |
 * | `--checkbox-transition` | `background-color 150ms ease, border-color 150ms...` |
 * | `--checkbox-warning-background` | `-` |
 * | `--checkbox-warning-border-hover` | `-` |
 * | `--checkbox-warning-foreground` | `-` |
 * | `--checkbox-wrap-overflow-wrap` | `anywhere` |
 * | `--checkbox-wrap-white-space` | `normal` |
 */
// #endregion css-tokens

export { Checkbox } from './checkbox.js';
export { CheckboxColor, CheckboxTextOverflow } from './constants.js';
export type {
	CheckboxColorType,
	CheckboxDisableType,
	CheckboxProps,
	CheckboxReadOnlyType,
	CheckboxTextOverflowType,
	CheckboxValueType,
	ValidateCheckboxProps,
} from './types.js';
