// #region css-tokens
/**
 * CSS Tokens for pill
 * Prefix: `--pill-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--pill-align-items` | `center` |
 * | `--pill-archive-background` | `-` |
 * | `--pill-archive-background-color` | `color-mix(in oklab, var(--pill-archive-backgrou...` |
 * | `--pill-archive-border` | `-` |
 * | `--pill-archive-border-color` | `color-mix(in oklab, var(--pill-archive-border) ...` |
 * | `--pill-archive-color` | `var(--pill-archive-label)` |
 * | `--pill-archive-hover-background-color` | `color-mix(in oklab, var(--pill-archive-backgrou...` |
 * | `--pill-archive-hover-border-color` | `color-mix(in oklab, var(--pill-archive-border) ...` |
 * | `--pill-archive-hover-color` | `var(--pill-archive-label-hover)` |
 * | `--pill-archive-label` | `-` |
 * | `--pill-archive-label-hover` | `-` |
 * | `--pill-background-color` | `var(--pill-internal-background)` |
 * | `--pill-border-color` | `var(--pill-internal-border-color)` |
 * | `--pill-border-radius` | `var(--radius-round)` |
 * | `--pill-border-width` | `1px` |
 * | `--pill-close-color` | `var(--pill-rect-solid-dismiss-icon)` |
 * | `--pill-close-disabled-cursor` | `not-allowed` |
 * | `--pill-close-focus-visible-outline` | `var(--pill-focus-ring) solid 1px` |
 * | `--pill-close-focus-visible-outline-offset` | `-2px` |
 * | `--pill-close-hover-color` | `var(--pill-rect-solid-dismiss-icon-hover)` |
 * | `--pill-close-icon-size` | `12px` |
 * | `--pill-closeable-background-color` | `var(--pill-rect-solid-background)` |
 * | `--pill-closeable-border-radius` | `var(--radius-1-5)` |
 * | `--pill-closeable-color` | `var(--pill-rect-solid-label)` |
 * | `--pill-closeable-gap` | `var(--spacing-2)` |
 * | `--pill-closeable-hover-background-color` | `var(--pill-rect-solid-background-hover)` |
 * | `--pill-closeable-hover-color` | `var(--pill-rect-solid-label-hover)` |
 * | `--pill-color` | `var(--pill-internal-foreground)` |
 * | `--pill-cursor` | `pointer` |
 * | `--pill-danger-background` | `-` |
 * | `--pill-danger-background-color` | `color-mix(in oklab, var(--pill-danger-backgroun...` |
 * | `--pill-danger-border` | `-` |
 * | `--pill-danger-border-color` | `color-mix(in oklab, var(--pill-danger-border) 4...` |
 * | `--pill-danger-color` | `var(--pill-danger-label)` |
 * | `--pill-danger-hover-background-color` | `color-mix(in oklab, var(--pill-danger-backgroun...` |
 * | `--pill-danger-hover-border-color` | `color-mix(in oklab, var(--pill-danger-border) 6...` |
 * | `--pill-danger-hover-color` | `var(--pill-danger-label-hover)` |
 * | `--pill-danger-label` | `-` |
 * | `--pill-danger-label-hover` | `-` |
 * | `--pill-disabled-cursor` | `not-allowed` |
 * | `--pill-disabled-opacity` | `0.6` |
 * | `--pill-display` | `inline-flex` |
 * | `--pill-focus-ring` | `-` |
 * | `--pill-focus-visible-outline` | `var(--pill-focus-ring) solid 1px` |
 * | `--pill-focus-visible-outline-offset` | `1px` |
 * | `--pill-font-size` | `var(--periscope-font-size-small)` |
 * | `--pill-font-variant-numeric` | `slashed-zero` |
 * | `--pill-font-weight` | `var(--font-weight-medium)` |
 * | `--pill-height` | `var(--spacing-10)` |
 * | `--pill-highlight-danger-background` | `-` |
 * | `--pill-highlight-danger-background-color` | `color-mix(in oklab, var(--pill-highlight-danger...` |
 * | `--pill-highlight-danger-border` | `-` |
 * | `--pill-highlight-danger-border-color` | `color-mix(in oklab, var(--pill-highlight-danger...` |
 * | `--pill-highlight-danger-color` | `var(--pill-highlight-danger-label)` |
 * | `--pill-highlight-danger-hover-background-color` | `color-mix(in oklab, var(--pill-highlight-danger...` |
 * | `--pill-highlight-danger-hover-border-color` | `color-mix(in oklab, var(--pill-highlight-danger...` |
 * | `--pill-highlight-danger-hover-color` | `var(--pill-highlight-danger-label-hover)` |
 * | `--pill-highlight-danger-label` | `-` |
 * | `--pill-highlight-danger-label-hover` | `-` |
 * | `--pill-hover-background-color` | `var(--pill-internal-hover-background)` |
 * | `--pill-hover-border-color` | `var(--pill-internal-hover-border-color)` |
 * | `--pill-hover-color` | `var(--pill-internal-hover-foreground)` |
 * | `--pill-info-background` | `-` |
 * | `--pill-info-background-color` | `color-mix(in oklab, var(--pill-info-background)...` |
 * | `--pill-info-border` | `-` |
 * | `--pill-info-border-color` | `color-mix(in oklab, var(--pill-info-border) 40%...` |
 * | `--pill-info-color` | `var(--pill-info-label)` |
 * | `--pill-info-hover-background-color` | `color-mix(in oklab, var(--pill-info-background)...` |
 * | `--pill-info-hover-border-color` | `color-mix(in oklab, var(--pill-info-border) 60%...` |
 * | `--pill-info-hover-color` | `var(--pill-info-label-hover)` |
 * | `--pill-info-label` | `-` |
 * | `--pill-info-label-hover` | `-` |
 * | `--pill-invalid-border` | `-` |
 * | `--pill-invalid-border-color` | `var(--pill-invalid-border)` |
 * | `--pill-invalid-color` | `var(--pill-invalid-label)` |
 * | `--pill-invalid-label` | `-` |
 * | `--pill-justify-content` | `center` |
 * | `--pill-line-height` | `100%` |
 * | `--pill-max-width` | `var(--pill-internal-max-width, min(100%, 7.5rem))` |
 * | `--pill-outlined-background` | `-` |
 * | `--pill-outlined-background-hover` | `-` |
 * | `--pill-outlined-border` | `-` |
 * | `--pill-outlined-label` | `-` |
 * | `--pill-outlined-label-hover` | `-` |
 * | `--pill-padding` | `var(--spacing-2) var(--spacing-4)` |
 * | `--pill-primary-background` | `-` |
 * | `--pill-primary-background-color` | `color-mix(in oklab, var(--pill-primary-backgrou...` |
 * | `--pill-primary-border` | `-` |
 * | `--pill-primary-border-color` | `color-mix(in oklab, var(--pill-primary-border) ...` |
 * | `--pill-primary-color` | `var(--pill-primary-label)` |
 * | `--pill-primary-hover-background-color` | `color-mix(in oklab, var(--pill-primary-backgrou...` |
 * | `--pill-primary-hover-border-color` | `color-mix(in oklab, var(--pill-primary-border) ...` |
 * | `--pill-primary-hover-color` | `var(--pill-primary-label-hover)` |
 * | `--pill-primary-label` | `-` |
 * | `--pill-primary-label-hover` | `-` |
 * | `--pill-rect-solid-background` | `-` |
 * | `--pill-rect-solid-background-hover` | `-` |
 * | `--pill-rect-solid-dismiss-icon` | `-` |
 * | `--pill-rect-solid-dismiss-icon-hover` | `-` |
 * | `--pill-rect-solid-label` | `-` |
 * | `--pill-rect-solid-label-hover` | `-` |
 * | `--pill-secondary-background-color` | `var(--pill-outlined-background)` |
 * | `--pill-secondary-border-color` | `var(--pill-outlined-border)` |
 * | `--pill-secondary-color` | `var(--pill-outlined-label)` |
 * | `--pill-secondary-hover-background-color` | `var(--pill-outlined-background-hover)` |
 * | `--pill-secondary-hover-border-color` | `var(--pill-outlined-border)` |
 * | `--pill-secondary-hover-color` | `var(--pill-outlined-label-hover)` |
 * | `--pill-success-background` | `-` |
 * | `--pill-success-background-color` | `color-mix(in oklab, var(--pill-success-backgrou...` |
 * | `--pill-success-border` | `-` |
 * | `--pill-success-border-color` | `color-mix(in oklab, var(--pill-success-border) ...` |
 * | `--pill-success-color` | `var(--pill-success-label)` |
 * | `--pill-success-hover-background-color` | `color-mix(in oklab, var(--pill-success-backgrou...` |
 * | `--pill-success-hover-border-color` | `color-mix(in oklab, var(--pill-success-border) ...` |
 * | `--pill-success-hover-color` | `var(--pill-success-label-hover)` |
 * | `--pill-success-label` | `-` |
 * | `--pill-success-label-hover` | `-` |
 * | `--pill-transition-duration` | `150ms` |
 * | `--pill-transition-property` | `background-color, border-color, color` |
 * | `--pill-transition-timing-function` | `cubic-bezier(0.4, 0, 0.2, 1)` |
 * | `--pill-warning-background` | `-` |
 * | `--pill-warning-background-color` | `color-mix(in oklab, var(--pill-warning-backgrou...` |
 * | `--pill-warning-border` | `-` |
 * | `--pill-warning-border-color` | `color-mix(in oklab, var(--pill-warning-border) ...` |
 * | `--pill-warning-color` | `var(--pill-warning-label)` |
 * | `--pill-warning-hover-background-color` | `color-mix(in oklab, var(--pill-warning-backgrou...` |
 * | `--pill-warning-hover-border-color` | `color-mix(in oklab, var(--pill-warning-border) ...` |
 * | `--pill-warning-hover-color` | `var(--pill-warning-label-hover)` |
 * | `--pill-warning-label` | `-` |
 * | `--pill-warning-label-hover` | `-` |
 * | `--pill-white-space` | `nowrap` |
 * | `--pill-width` | `var(--pill-internal-width, fit-content)` |
 */
// #endregion css-tokens

export { Pill } from './pill.js';
export { PillColor, PillTextOverflow, PillTextTransform, PillVariant } from './constants.js';
export type {
	PillActivateEvent,
	PillCloseableProps,
	PillCloseEvent,
} from './subcomponents/pill-closeable.js';
export type {
	PillColorType,
	PillProps,
	PillTextOverflowType,
	PillTextTransformType,
	PillVariantType,
} from './types.js';
