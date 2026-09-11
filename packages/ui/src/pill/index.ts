// #region css-tokens
/**
 * CSS Tokens for pill
 * Prefix: `--pill-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--pill-align-items` | `center` |
 * | `--pill-archive-background` | `-` |
 * | `--pill-archive-border` | `-` |
 * | `--pill-archive-label` | `-` |
 * | `--pill-archive-label-hover` | `-` |
 * | `--pill-border-color` | `var(--pill-internal-border-color)` |
 * | `--pill-border-radius` | `var(--radius-round)` |
 * | `--pill-border-width` | `1px` |
 * | `--pill-close-disabled-cursor` | `not-allowed` |
 * | `--pill-close-focus-visible-outline` | `var(--ring) solid 1px` |
 * | `--pill-close-focus-visible-outline-offset` | `-2px` |
 * | `--pill-close-icon-size` | `12px` |
 * | `--pill-closeable-border-radius` | `var(--radius-1-5)` |
 * | `--pill-closeable-gap` | `var(--spacing-2)` |
 * | `--pill-cursor` | `pointer` |
 * | `--pill-danger-background` | `-` |
 * | `--pill-danger-border` | `-` |
 * | `--pill-danger-label` | `-` |
 * | `--pill-danger-label-hover` | `-` |
 * | `--pill-disabled-cursor` | `not-allowed` |
 * | `--pill-disabled-opacity` | `0.6` |
 * | `--pill-display` | `inline-flex` |
 * | `--pill-focus-visible-outline` | `var(--ring) solid 1px` |
 * | `--pill-focus-visible-outline-offset` | `1px` |
 * | `--pill-font-size` | `var(--periscope-font-size-small)` |
 * | `--pill-font-variant-numeric` | `slashed-zero` |
 * | `--pill-font-weight` | `var(--font-weight-medium)` |
 * | `--pill-height` | `var(--spacing-10)` |
 * | `--pill-highlight-danger-background` | `-` |
 * | `--pill-highlight-danger-border` | `-` |
 * | `--pill-highlight-danger-label` | `-` |
 * | `--pill-highlight-danger-label-hover` | `-` |
 * | `--pill-hover-background` | `var(--pill-internal-hover-background)` |
 * | `--pill-hover-border-color` | `var(--pill-internal-hover-border-color)` |
 * | `--pill-hover-foreground` | `var(--pill-internal-hover-foreground)` |
 * | `--pill-info-background` | `-` |
 * | `--pill-info-border` | `-` |
 * | `--pill-info-label` | `-` |
 * | `--pill-info-label-hover` | `-` |
 * | `--pill-invalid-border-color` | `var(--destructive)` |
 * | `--pill-invalid-label` | `var(--destructive)` |
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
 * | `--pill-primary-border` | `-` |
 * | `--pill-primary-label` | `-` |
 * | `--pill-primary-label-hover` | `-` |
 * | `--pill-rect-solid-background` | `-` |
 * | `--pill-rect-solid-background-hover` | `-` |
 * | `--pill-rect-solid-dismiss-icon` | `var(--l2-foreground)` |
 * | `--pill-rect-solid-dismiss-icon-hover` | `var(--l1-foreground)` |
 * | `--pill-rect-solid-label` | `-` |
 * | `--pill-rect-solid-label-hover` | `-` |
 * | `--pill-success-background` | `-` |
 * | `--pill-success-border` | `-` |
 * | `--pill-success-label` | `-` |
 * | `--pill-success-label-hover` | `-` |
 * | `--pill-transition-duration` | `150ms` |
 * | `--pill-transition-property` | `background-color, border-color, color` |
 * | `--pill-transition-timing-function` | `cubic-bezier(0.4, 0, 0.2, 1)` |
 * | `--pill-warning-background` | `-` |
 * | `--pill-warning-border` | `-` |
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
