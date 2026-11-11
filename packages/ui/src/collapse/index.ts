// #region css-tokens
/**
 * CSS Tokens for collapse
 * Prefix: `--collapse-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--collapse-background` | `-` |
 * | `--collapse-border` | `-` |
 * | `--collapse-box-sizing` | `border-box` |
 * | `--collapse-chevron-hover-color` | `var(--collapse-icon-hover)` |
 * | `--collapse-chevron-open-transform` | `rotate(90deg)` |
 * | `--collapse-chevron-transition-property` | `transform, color` |
 * | `--collapse-color` | `var(--collapse-content)` |
 * | `--collapse-content` | `-` |
 * | `--collapse-content-overflow-wrap` | `anywhere` |
 * | `--collapse-description` | `-` |
 * | `--collapse-description-color` | `var(--collapse-description)` |
 * | `--collapse-description-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--collapse-description-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--collapse-description-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--collapse-description-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--collapse-description-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--collapse-description-overflow-wrap` | `anywhere` |
 * | `--collapse-description-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--collapse-display` | `block` |
 * | `--collapse-focus-ring` | `-` |
 * | `--collapse-focus-visible-outline` | `var(--collapse-focus-ring) solid 1px` |
 * | `--collapse-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--collapse-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--collapse-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--collapse-ghost-background` | `transparent` |
 * | `--collapse-ghost-focus-visible-outline-offset` | `0` |
 * | `--collapse-ghost-toggle-border-radius` | `var(--radius-2)` |
 * | `--collapse-group-item-display` | `block` |
 * | `--collapse-group-item-min-width` | `0` |
 * | `--collapse-header-align-items` | `stretch` |
 * | `--collapse-header-display` | `flex` |
 * | `--collapse-header-gap` | `var(--spacing-3)` |
 * | `--collapse-header-min-height` | `var(--spacing-16)` |
 * | `--collapse-header-min-width` | `0` |
 * | `--collapse-header-padding-block` | `calc( (var(--collapse-internal-header-min-heigh...` |
 * | `--collapse-header-padding-inline` | `var(--spacing-4)` |
 * | `--collapse-header-suffix-align-items` | `center` |
 * | `--collapse-header-suffix-display` | `flex` |
 * | `--collapse-header-suffix-flex-shrink` | `0` |
 * | `--collapse-header-suffix-gap` | `var(--spacing-2)` |
 * | `--collapse-header-suffix-padding-block` | `var(--spacing-2)` |
 * | `--collapse-heading-display` | `flex` |
 * | `--collapse-heading-flex` | `1 1 auto` |
 * | `--collapse-heading-font` | `inherit` |
 * | `--collapse-heading-margin` | `0` |
 * | `--collapse-heading-min-width` | `0` |
 * | `--collapse-heading-text-display` | `flex` |
 * | `--collapse-heading-text-flex` | `1 1 auto` |
 * | `--collapse-heading-text-flex-direction` | `column` |
 * | `--collapse-heading-text-gap` | `var(--spacing-1)` |
 * | `--collapse-heading-text-min-width` | `0` |
 * | `--collapse-icon` | `-` |
 * | `--collapse-icon-align-items` | `center` |
 * | `--collapse-icon-color` | `var(--collapse-icon)` |
 * | `--collapse-icon-display` | `flex` |
 * | `--collapse-icon-flex-shrink` | `0` |
 * | `--collapse-icon-hover` | `-` |
 * | `--collapse-icon-justify-content` | `center` |
 * | `--collapse-icon-size` | `var(--spacing-7)` |
 * | `--collapse-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--collapse-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--collapse-margin` | `0` |
 * | `--collapse-min-width` | `0` |
 * | `--collapse-no-content-padding-padding` | `0` |
 * | `--collapse-outlined-background` | `var(--collapse-background)` |
 * | `--collapse-outlined-border-color` | `var(--collapse-border)` |
 * | `--collapse-outlined-border-radius` | `var(--radius-2)` |
 * | `--collapse-outlined-border-style` | `solid` |
 * | `--collapse-outlined-border-width` | `1px` |
 * | `--collapse-outlined-divider-color` | `var(--collapse-border)` |
 * | `--collapse-outlined-divider-style` | `solid` |
 * | `--collapse-outlined-divider-width` | `1px` |
 * | `--collapse-outlined-focus-visible-outline-offset` | `-1px` |
 * | `--collapse-outlined-overflow` | `clip` |
 * | `--collapse-outlined-toggle-border-radius` | `0` |
 * | `--collapse-panel-min-width` | `0` |
 * | `--collapse-panel-overflow-x` | `auto` |
 * | `--collapse-panel-padding` | `var(--spacing-4)` |
 * | `--collapse-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--collapse-title` | `-` |
 * | `--collapse-title-color` | `var(--collapse-title)` |
 * | `--collapse-title-font-family` | `var(--label-base-500-font-family)` |
 * | `--collapse-title-font-feature-settings` | `'ss01'` |
 * | `--collapse-title-font-size` | `var(--label-base-500-font-size)` |
 * | `--collapse-title-font-variant-numeric` | `normal` |
 * | `--collapse-title-font-weight` | `var(--label-base-500-font-weight)` |
 * | `--collapse-title-letter-spacing` | `var(--label-base-500-letter-spacing)` |
 * | `--collapse-title-line-height` | `var(--label-base-500-line-height)` |
 * | `--collapse-title-min-width` | `0` |
 * | `--collapse-title-overflow` | `clip visible` |
 * | `--collapse-title-overflow-wrap` | `anywhere` |
 * | `--collapse-title-text-overflow` | `ellipsis` |
 * | `--collapse-title-text-transform` | `var(--label-base-500-text-transform)` |
 * | `--collapse-title-white-space` | `nowrap` |
 * | `--collapse-title-wrap-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--collapse-toggle-align-items` | `var(--collapse-internal-toggle-align-items)` |
 * | `--collapse-toggle-background` | `transparent` |
 * | `--collapse-toggle-border` | `none` |
 * | `--collapse-toggle-box-sizing` | `border-box` |
 * | `--collapse-toggle-color` | `var(--collapse-title)` |
 * | `--collapse-toggle-cursor` | `pointer` |
 * | `--collapse-toggle-display` | `flex` |
 * | `--collapse-toggle-flex` | `1 1 auto` |
 * | `--collapse-toggle-font` | `inherit` |
 * | `--collapse-toggle-margin` | `0` |
 * | `--collapse-toggle-min-width` | `0` |
 * | `--collapse-toggle-text-align` | `start` |
 * | `--collapse-transition-duration` | `150ms` |
 * | `--collapse-transition-timing-function` | `cubic-bezier(0.4, 0, 0.2, 1)` |
 * | `--collapse-width` | `100%` |
 */
// #endregion css-tokens

export type * from './types.js';
export { Collapse } from './collapse.js';
export {
	COLLAPSE_EMPTY_CONTENT,
	COLLAPSE_EMPTY_TITLE,
	CollapseSize,
	CollapseTextOverflow,
	CollapseVariant,
} from './constants.js';
