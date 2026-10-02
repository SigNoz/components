// #region css-tokens
/**
 * CSS Tokens for callout
 * Prefix: `--callout-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--callout-align-items` | `flex-start` |
 * | `--callout-archive-background` | `-` |
 * | `--callout-archive-background-color` | `var(--callout-archive-background)` |
 * | `--callout-archive-background-hover` | `-` |
 * | `--callout-archive-border` | `-` |
 * | `--callout-archive-border-color` | `var(--callout-archive-border)` |
 * | `--callout-archive-description` | `-` |
 * | `--callout-archive-description-color` | `var(--callout-archive-description)` |
 * | `--callout-archive-hover-background-color` | `var(--callout-archive-background-hover)` |
 * | `--callout-archive-icon` | `-` |
 * | `--callout-archive-icon-color` | `var(--callout-archive-icon)` |
 * | `--callout-archive-link-color` | `var(--archive-link)` |
 * | `--callout-archive-link-hover-color` | `var(--archive-link-hover)` |
 * | `--callout-archive-title` | `-` |
 * | `--callout-archive-title-color` | `var(--callout-archive-title)` |
 * | `--callout-border-radius` | `var(--radius-2)` |
 * | `--callout-border-style` | `solid` |
 * | `--callout-border-width` | `1px` |
 * | `--callout-box-sizing` | `border-box` |
 * | `--callout-button-align-items` | `center` |
 * | `--callout-button-background` | `transparent` |
 * | `--callout-button-border` | `none` |
 * | `--callout-button-border-radius` | `var(--radius-1)` |
 * | `--callout-button-box-sizing` | `content-box` |
 * | `--callout-button-cursor` | `pointer` |
 * | `--callout-button-display` | `flex` |
 * | `--callout-button-flex-shrink` | `0` |
 * | `--callout-button-hover-background` | `var(--callout-internal-background-hover, transp...` |
 * | `--callout-button-icon-block-size` | `100%` |
 * | `--callout-button-icon-inline-size` | `100%` |
 * | `--callout-button-justify-content` | `center` |
 * | `--callout-button-padding` | `var(--spacing-2)` |
 * | `--callout-button-transition-property` | `color, background-color` |
 * | `--callout-content-align-self` | `stretch` |
 * | `--callout-content-display` | `flex` |
 * | `--callout-content-flex` | `1 1 0%` |
 * | `--callout-content-flex-direction` | `column` |
 * | `--callout-content-gap` | `var(--spacing-3)` |
 * | `--callout-content-min-height` | `0` |
 * | `--callout-content-min-width` | `0` |
 * | `--callout-danger-background` | `-` |
 * | `--callout-danger-background-color` | `var(--callout-danger-background)` |
 * | `--callout-danger-background-hover` | `-` |
 * | `--callout-danger-border` | `-` |
 * | `--callout-danger-border-color` | `var(--callout-danger-border)` |
 * | `--callout-danger-description` | `-` |
 * | `--callout-danger-description-color` | `var(--callout-danger-description)` |
 * | `--callout-danger-hover-background-color` | `var(--callout-danger-background-hover)` |
 * | `--callout-danger-icon` | `-` |
 * | `--callout-danger-icon-color` | `var(--callout-danger-icon)` |
 * | `--callout-danger-link-color` | `var(--danger-link)` |
 * | `--callout-danger-link-hover-color` | `var(--danger-link-hover)` |
 * | `--callout-danger-title` | `-` |
 * | `--callout-danger-title-color` | `var(--callout-danger-title)` |
 * | `--callout-description-focus-padding` | `var(--spacing-1)` |
 * | `--callout-description-font-variant-numeric` | `slashed-zero` |
 * | `--callout-description-font-weight` | `var(--periscope-font-weight-regular)` |
 * | `--callout-description-line-height` | `var(--periscope-line-height-base)` |
 * | `--callout-description-min-height` | `0` |
 * | `--callout-description-overflow` | `auto` |
 * | `--callout-description-overflow-wrap` | `anywhere` |
 * | `--callout-display` | `flex` |
 * | `--callout-focus-visible-outline` | `var(--ring) solid 1px` |
 * | `--callout-focus-visible-outline-offset` | `1px` |
 * | `--callout-font-size` | `var(--periscope-font-size-base)` |
 * | `--callout-gap` | `var(--spacing-5)` |
 * | `--callout-height` | `var(--callout-internal-height, auto)` |
 * | `--callout-highlight-danger-background` | `-` |
 * | `--callout-highlight-danger-background-color` | `var(--callout-highlight-danger-background)` |
 * | `--callout-highlight-danger-background-hover` | `-` |
 * | `--callout-highlight-danger-border` | `-` |
 * | `--callout-highlight-danger-border-color` | `var(--callout-highlight-danger-border)` |
 * | `--callout-highlight-danger-description` | `-` |
 * | `--callout-highlight-danger-description-color` | `var(--callout-highlight-danger-description)` |
 * | `--callout-highlight-danger-hover-background-color` | `var(--callout-highlight-danger-background-hover)` |
 * | `--callout-highlight-danger-icon` | `-` |
 * | `--callout-highlight-danger-icon-color` | `var(--callout-highlight-danger-icon)` |
 * | `--callout-highlight-danger-link-color` | `var(--highlight-danger-link)` |
 * | `--callout-highlight-danger-link-hover-color` | `var(--highlight-danger-link-hover)` |
 * | `--callout-highlight-danger-title` | `-` |
 * | `--callout-highlight-danger-title-color` | `var(--callout-highlight-danger-title)` |
 * | `--callout-icon-align-self` | `flex-start` |
 * | `--callout-icon-disc-color` | `currentcolor` |
 * | `--callout-icon-display` | `flex` |
 * | `--callout-icon-flex-shrink` | `0` |
 * | `--callout-icon-glyph-color` | `var(--l1-background)` |
 * | `--callout-icon-has-title-margin-top` | `0` |
 * | `--callout-icon-size` | `var(--size-icon-callout-sm)` |
 * | `--callout-info-background` | `-` |
 * | `--callout-info-background-color` | `var(--callout-info-background)` |
 * | `--callout-info-background-hover` | `-` |
 * | `--callout-info-border` | `-` |
 * | `--callout-info-border-color` | `var(--callout-info-border)` |
 * | `--callout-info-description` | `-` |
 * | `--callout-info-description-color` | `var(--callout-info-description)` |
 * | `--callout-info-hover-background-color` | `var(--callout-info-background-hover)` |
 * | `--callout-info-icon` | `-` |
 * | `--callout-info-icon-color` | `var(--callout-info-icon)` |
 * | `--callout-info-link-color` | `var(--info-link)` |
 * | `--callout-info-link-hover-color` | `var(--info-link-hover)` |
 * | `--callout-info-title` | `-` |
 * | `--callout-info-title-color` | `var(--callout-info-title)` |
 * | `--callout-letter-spacing` | `var(--letter-spacing-0-5)` |
 * | `--callout-link-border-radius` | `var(--radius-1)` |
 * | `--callout-link-cursor` | `pointer` |
 * | `--callout-link-text-decoration` | `underline` |
 * | `--callout-link-transition-property` | `color` |
 * | `--callout-max-height` | `var(--callout-internal-max-height, 100%)` |
 * | `--callout-max-width` | `var(--callout-internal-max-width, 100%)` |
 * | `--callout-min-height` | `0` |
 * | `--callout-padding` | `var(--spacing-6) var(--spacing-5)` |
 * | `--callout-primary-background` | `-` |
 * | `--callout-primary-background-color` | `var(--callout-primary-background)` |
 * | `--callout-primary-background-hover` | `-` |
 * | `--callout-primary-border` | `-` |
 * | `--callout-primary-border-color` | `var(--callout-primary-border)` |
 * | `--callout-primary-description` | `-` |
 * | `--callout-primary-description-color` | `var(--callout-primary-description)` |
 * | `--callout-primary-hover-background-color` | `var(--callout-primary-background-hover)` |
 * | `--callout-primary-icon` | `-` |
 * | `--callout-primary-icon-color` | `var(--callout-primary-icon)` |
 * | `--callout-primary-link-color` | `var(--primary-link)` |
 * | `--callout-primary-link-hover-color` | `var(--primary-link-hover)` |
 * | `--callout-primary-title` | `-` |
 * | `--callout-primary-title-color` | `var(--callout-primary-title)` |
 * | `--callout-secondary-background` | `-` |
 * | `--callout-secondary-background-color` | `var(--callout-secondary-background)` |
 * | `--callout-secondary-background-hover` | `-` |
 * | `--callout-secondary-border` | `-` |
 * | `--callout-secondary-border-color` | `var(--callout-secondary-border)` |
 * | `--callout-secondary-description` | `-` |
 * | `--callout-secondary-description-color` | `var(--callout-secondary-description)` |
 * | `--callout-secondary-hover-background-color` | `var(--callout-secondary-background-hover)` |
 * | `--callout-secondary-icon` | `-` |
 * | `--callout-secondary-icon-color` | `var(--callout-secondary-icon)` |
 * | `--callout-secondary-link-color` | `var(--secondary-link)` |
 * | `--callout-secondary-link-hover-color` | `var(--secondary-link-hover)` |
 * | `--callout-secondary-title` | `-` |
 * | `--callout-secondary-title-color` | `var(--callout-secondary-title)` |
 * | `--callout-success-background` | `-` |
 * | `--callout-success-background-color` | `var(--callout-success-background)` |
 * | `--callout-success-background-hover` | `-` |
 * | `--callout-success-border` | `-` |
 * | `--callout-success-border-color` | `var(--callout-success-border)` |
 * | `--callout-success-description` | `-` |
 * | `--callout-success-description-color` | `var(--callout-success-description)` |
 * | `--callout-success-hover-background-color` | `var(--callout-success-background-hover)` |
 * | `--callout-success-icon` | `-` |
 * | `--callout-success-icon-color` | `var(--callout-success-icon)` |
 * | `--callout-success-link-color` | `var(--success-link)` |
 * | `--callout-success-link-hover-color` | `var(--success-link-hover)` |
 * | `--callout-success-title` | `-` |
 * | `--callout-success-title-color` | `var(--callout-success-title)` |
 * | `--callout-title-clip-padding` | `0.125em` |
 * | `--callout-title-flex` | `1 1 auto` |
 * | `--callout-title-font-feature-settings` | `'ss01'` |
 * | `--callout-title-font-variant-numeric` | `slashed-zero lining-nums tabular-nums` |
 * | `--callout-title-font-weight` | `var(--periscope-font-weight-medium)` |
 * | `--callout-title-line-height` | `var(--line-height-none)` |
 * | `--callout-title-min-width` | `0` |
 * | `--callout-title-overflow` | `hidden` |
 * | `--callout-title-text-overflow` | `ellipsis` |
 * | `--callout-title-white-space` | `nowrap` |
 * | `--callout-toggle-align-items` | `center` |
 * | `--callout-toggle-background` | `transparent` |
 * | `--callout-toggle-border` | `none` |
 * | `--callout-toggle-cursor` | `pointer` |
 * | `--callout-toggle-display` | `flex` |
 * | `--callout-toggle-flex-shrink` | `0` |
 * | `--callout-toggle-font` | `inherit` |
 * | `--callout-toggle-letter-spacing` | `inherit` |
 * | `--callout-toggle-min-width` | `0` |
 * | `--callout-toggle-text-align` | `start` |
 * | `--callout-transition-duration` | `150ms` |
 * | `--callout-transition-timing-function` | `cubic-bezier(0.4, 0, 0.2, 1)` |
 * | `--callout-warning-background` | `-` |
 * | `--callout-warning-background-color` | `var(--callout-warning-background)` |
 * | `--callout-warning-background-hover` | `-` |
 * | `--callout-warning-border` | `-` |
 * | `--callout-warning-border-color` | `var(--callout-warning-border)` |
 * | `--callout-warning-description` | `-` |
 * | `--callout-warning-description-color` | `var(--callout-warning-description)` |
 * | `--callout-warning-hover-background-color` | `var(--callout-warning-background-hover)` |
 * | `--callout-warning-icon` | `-` |
 * | `--callout-warning-icon-color` | `var(--callout-warning-icon)` |
 * | `--callout-warning-link-color` | `var(--warning-link)` |
 * | `--callout-warning-link-hover-color` | `var(--warning-link-hover)` |
 * | `--callout-warning-title` | `-` |
 * | `--callout-warning-title-color` | `var(--callout-warning-title)` |
 * | `--callout-width` | `var(--callout-internal-width, 100%)` |
 */
// #endregion css-tokens

export type * from './types.js';
export { Callout } from './callout.js';
export {
	CALLOUT_EMPTY_DESCRIPTION,
	CALLOUT_EMPTY_TITLE,
	CalloutColor,
	CalloutSize,
} from './constants.js';
export type { CalloutCloseableProps } from './subcomponents/callout-closeable.js';
export type { CalloutCloseablePersistedProps } from './subcomponents/callout-closeable-persisted.js';
export type { CalloutExpandableProps } from './subcomponents/callout-expandable.js';
export type { CalloutLinkProps } from './subcomponents/callout-link.js';
