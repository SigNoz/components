// #region css-tokens
/**
 * CSS Tokens for radio-group
 * Prefix: `--radio-group-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--radio-group-archive-background` | `-` |
 * | `--radio-group-archive-border-hover` | `-` |
 * | `--radio-group-archive-checked-background-color` | `var(--radio-group-archive-background)` |
 * | `--radio-group-archive-dot` | `-` |
 * | `--radio-group-archive-dot-color` | `var(--radio-group-archive-dot)` |
 * | `--radio-group-archive-hover-border-color` | `var(--radio-group-archive-border-hover)` |
 * | `--radio-group-background` | `transparent` |
 * | `--radio-group-border` | `-` |
 * | `--radio-group-border-color` | `var(--radio-group-border)` |
 * | `--radio-group-border-radius` | `var(--radius-round)` |
 * | `--radio-group-border-width` | `2px` |
 * | `--radio-group-checked-background` | `var(--radio-group-internal-checked-background)` |
 * | `--radio-group-checked-border-color` | `var(--radio-group-internal-checked-background)` |
 * | `--radio-group-cursor` | `pointer` |
 * | `--radio-group-danger-background` | `-` |
 * | `--radio-group-danger-border-hover` | `-` |
 * | `--radio-group-danger-checked-background-color` | `var(--radio-group-danger-background)` |
 * | `--radio-group-danger-dot` | `-` |
 * | `--radio-group-danger-dot-color` | `var(--radio-group-danger-dot)` |
 * | `--radio-group-danger-hover-border-color` | `var(--radio-group-danger-border-hover)` |
 * | `--radio-group-disabled-checked-opacity` | `0.6` |
 * | `--radio-group-disabled-cursor` | `not-allowed` |
 * | `--radio-group-disabled-opacity` | `0.4` |
 * | `--radio-group-display` | `grid` |
 * | `--radio-group-dot-border-radius` | `var(--radius-round)` |
 * | `--radio-group-dot-color` | `var(--radio-group-internal-dot-color)` |
 * | `--radio-group-dot-size` | `8px` |
 * | `--radio-group-focus-ring` | `-` |
 * | `--radio-group-focus-visible-outline` | `1px solid var(--radio-group-focus-ring)` |
 * | `--radio-group-focus-visible-outline-offset` | `1px` |
 * | `--radio-group-gap` | `var(--spacing-4)` |
 * | `--radio-group-highlight-danger-background` | `-` |
 * | `--radio-group-highlight-danger-border-hover` | `-` |
 * | `--radio-group-highlight-danger-checked-background-color` | `var(--radio-group-highlight-danger-background)` |
 * | `--radio-group-highlight-danger-dot` | `-` |
 * | `--radio-group-highlight-danger-dot-color` | `var(--radio-group-highlight-danger-dot)` |
 * | `--radio-group-highlight-danger-hover-border-color` | `var(--radio-group-highlight-danger-border-hover)` |
 * | `--radio-group-hover-border-color` | `var(--radio-group-internal-hover-border-color)` |
 * | `--radio-group-info-background` | `-` |
 * | `--radio-group-info-border-hover` | `-` |
 * | `--radio-group-info-checked-background-color` | `var(--radio-group-info-background)` |
 * | `--radio-group-info-dot` | `-` |
 * | `--radio-group-info-dot-color` | `var(--radio-group-info-dot)` |
 * | `--radio-group-info-hover-border-color` | `var(--radio-group-info-border-hover)` |
 * | `--radio-group-item-align-items` | `flex-start` |
 * | `--radio-group-item-control-display` | `flex` |
 * | `--radio-group-item-display` | `flex` |
 * | `--radio-group-item-justify-content` | `flex-start` |
 * | `--radio-group-item-margin-block-start` | `calc((var(--radio-group-internal-label-line-hei...` |
 * | `--radio-group-item-min-width` | `0` |
 * | `--radio-group-label` | `-` |
 * | `--radio-group-label-color` | `var(--radio-group-label)` |
 * | `--radio-group-label-font-size` | `var(--periscope-font-size-base)` |
 * | `--radio-group-label-font-weight` | `var(--font-weight-normal)` |
 * | `--radio-group-label-gap` | `var(--spacing-4)` |
 * | `--radio-group-label-hover` | `-` |
 * | `--radio-group-label-hover-color` | `var(--radio-group-label-hover)` |
 * | `--radio-group-label-letter-spacing` | `-0.005em` |
 * | `--radio-group-label-line-height` | `18px` |
 * | `--radio-group-label-min-width` | `0` |
 * | `--radio-group-label-overflow` | `visible` |
 * | `--radio-group-label-text-overflow` | `ellipsis` |
 * | `--radio-group-label-tooltip-max-width` | `20rem` |
 * | `--radio-group-label-transition` | `color 150ms ease` |
 * | `--radio-group-label-white-space` | `nowrap` |
 * | `--radio-group-primary-background` | `-` |
 * | `--radio-group-primary-border-hover` | `-` |
 * | `--radio-group-primary-checked-background-color` | `var(--radio-group-primary-background)` |
 * | `--radio-group-primary-dot` | `-` |
 * | `--radio-group-primary-dot-color` | `var(--radio-group-primary-dot)` |
 * | `--radio-group-primary-hover-border-color` | `var(--radio-group-primary-border-hover)` |
 * | `--radio-group-readonly-cursor` | `not-allowed` |
 * | `--radio-group-readonly-opacity` | `0.8` |
 * | `--radio-group-secondary-background` | `-` |
 * | `--radio-group-secondary-border-hover` | `-` |
 * | `--radio-group-secondary-checked-background-color` | `var(--radio-group-secondary-background)` |
 * | `--radio-group-secondary-dot` | `-` |
 * | `--radio-group-secondary-dot-color` | `var(--radio-group-secondary-dot)` |
 * | `--radio-group-secondary-hover-border-color` | `var(--radio-group-secondary-border-hover)` |
 * | `--radio-group-size` | `16px` |
 * | `--radio-group-success-background` | `-` |
 * | `--radio-group-success-border-hover` | `-` |
 * | `--radio-group-success-checked-background-color` | `var(--radio-group-success-background)` |
 * | `--radio-group-success-dot` | `-` |
 * | `--radio-group-success-dot-color` | `var(--radio-group-success-dot)` |
 * | `--radio-group-success-hover-border-color` | `var(--radio-group-success-border-hover)` |
 * | `--radio-group-transition` | `background-color 150ms ease, 			border-color 15...` |
 * | `--radio-group-warning-background` | `-` |
 * | `--radio-group-warning-border-hover` | `-` |
 * | `--radio-group-warning-checked-background-color` | `var(--radio-group-warning-background)` |
 * | `--radio-group-warning-dot` | `-` |
 * | `--radio-group-warning-dot-color` | `var(--radio-group-warning-dot)` |
 * | `--radio-group-warning-hover-border-color` | `var(--radio-group-warning-border-hover)` |
 * | `--radio-group-wrap-overflow-wrap` | `anywhere` |
 * | `--radio-group-wrap-white-space` | `normal` |
 */
// #endregion css-tokens

export { RadioGroup } from './radio-group.js';
export { RadioGroupColor, RadioGroupTextOverflow } from './constants.js';
export type {
	RadioGroupColorType,
	RadioGroupDisableType,
	RadioGroupItemType,
	RadioGroupProps,
	RadioGroupReadOnlyType,
	RadioGroupTextOverflowType,
	ValidateRadioGroupProps,
} from './types.js';
