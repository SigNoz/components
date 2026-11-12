// #region css-tokens
/**
 * CSS Tokens for steps
 * Prefix: `--steps-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--steps-align-items` | `flex-start` |
 * | `--steps-box-sizing` | `border-box` |
 * | `--steps-connector` | `-` |
 * | `--steps-connector-block-size` | `1px` |
 * | `--steps-connector-color` | `var(--steps-connector)` |
 * | `--steps-connector-done` | `-` |
 * | `--steps-connector-done-color` | `var(--steps-connector-done)` |
 * | `--steps-connector-grid-column` | `3` |
 * | `--steps-connector-grid-row` | `1` |
 * | `--steps-connector-min-inline-size` | `var(--spacing-8)` |
 * | `--steps-description-color` | `var(--steps-description-foreground)` |
 * | `--steps-description-font-family` | `var(--label-small-400-font-family)` |
 * | `--steps-description-font-size` | `var(--label-small-400-font-size)` |
 * | `--steps-description-font-weight` | `var(--label-small-400-font-weight)` |
 * | `--steps-description-foreground` | `-` |
 * | `--steps-description-grid-row` | `2` |
 * | `--steps-description-letter-spacing` | `var(--label-small-400-letter-spacing)` |
 * | `--steps-description-line-height` | `var(--label-small-400-line-height)` |
 * | `--steps-description-margin-block-start` | `var(--spacing-2)` |
 * | `--steps-description-placeholder-visibility` | `hidden` |
 * | `--steps-description-text-transform` | `var(--label-small-400-text-transform)` |
 * | `--steps-display` | `flex` |
 * | `--steps-done-mark-flex` | `0 0 auto` |
 * | `--steps-done-mark-size` | `var(--spacing-6)` |
 * | `--steps-flex-wrap` | `nowrap` |
 * | `--steps-font-feature-settings` | `'ss01' 1` |
 * | `--steps-font-variant-numeric` | `normal` |
 * | `--steps-gap` | `var(--steps-internal-column-gap)` |
 * | `--steps-hidden-block-size` | `1px` |
 * | `--steps-hidden-border` | `0` |
 * | `--steps-hidden-clip-path` | `inset(50%)` |
 * | `--steps-hidden-inline-size` | `1px` |
 * | `--steps-hidden-margin` | `-1px` |
 * | `--steps-hidden-overflow` | `hidden` |
 * | `--steps-hidden-padding` | `0` |
 * | `--steps-hidden-position` | `absolute` |
 * | `--steps-hidden-white-space` | `nowrap` |
 * | `--steps-inline-size` | `100%` |
 * | `--steps-item-align-items` | `center` |
 * | `--steps-item-box-sizing` | `border-box` |
 * | `--steps-item-column-gap` | `var(--spacing-4)` |
 * | `--steps-item-display` | `grid` |
 * | `--steps-item-flex` | `1 1 0` |
 * | `--steps-item-grid-template-columns` | `auto minmax(0, max-content) minmax(var(--steps-...` |
 * | `--steps-item-grid-template-rows` | `var(--steps-internal-marker-size) auto` |
 * | `--steps-item-last-flex` | `1 1 0` |
 * | `--steps-item-last-grid-template-columns` | `auto minmax(var(--steps-text-min-inline-size, v...` |
 * | `--steps-item-last-max-inline-size` | `max-content` |
 * | `--steps-item-last-min-inline-size` | `auto` |
 * | `--steps-item-margin` | `0` |
 * | `--steps-item-min-inline-size` | `calc( var(--steps-internal-marker-size) + 2 * v...` |
 * | `--steps-item-padding` | `0` |
 * | `--steps-item-position` | `relative` |
 * | `--steps-label-current-color` | `var(--steps-label-current-foreground)` |
 * | `--steps-label-current-foreground` | `-` |
 * | `--steps-label-done-color` | `var(--steps-label-done-foreground)` |
 * | `--steps-label-done-foreground` | `-` |
 * | `--steps-label-font-family` | `var(--label-base-500-font-family)` |
 * | `--steps-label-font-size` | `var(--label-base-500-font-size)` |
 * | `--steps-label-font-weight` | `var(--label-base-500-font-weight)` |
 * | `--steps-label-grid-row` | `1` |
 * | `--steps-label-letter-spacing` | `var(--label-base-500-letter-spacing)` |
 * | `--steps-label-line-height` | `var(--label-base-500-line-height)` |
 * | `--steps-label-text-transform` | `var(--label-base-500-text-transform)` |
 * | `--steps-label-waiting-color` | `var(--steps-label-waiting-foreground)` |
 * | `--steps-label-waiting-foreground` | `-` |
 * | `--steps-list-body-display` | `flex` |
 * | `--steps-list-body-flex-direction` | `column` |
 * | `--steps-list-body-gap` | `var(--spacing-4)` |
 * | `--steps-list-body-last-padding-block-end` | `0` |
 * | `--steps-list-body-min-inline-size` | `0` |
 * | `--steps-list-body-padding-block-end` | `var(--spacing-12)` |
 * | `--steps-list-box-sizing` | `border-box` |
 * | `--steps-list-connector` | `-` |
 * | `--steps-list-connector-color` | `var(--steps-list-connector)` |
 * | `--steps-list-connector-flex` | `1 1 auto` |
 * | `--steps-list-connector-inline-size` | `1px` |
 * | `--steps-list-connector-last-margin-block-end` | `0` |
 * | `--steps-list-connector-margin-block` | `var(--spacing-2)` |
 * | `--steps-list-connector-min-block-size` | `var(--spacing-4)` |
 * | `--steps-list-content-color` | `var(--steps-list-content-foreground)` |
 * | `--steps-list-content-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--steps-list-content-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--steps-list-content-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--steps-list-content-foreground` | `-` |
 * | `--steps-list-content-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--steps-list-content-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--steps-list-content-min-inline-size` | `0` |
 * | `--steps-list-content-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--steps-list-display` | `flex` |
 * | `--steps-list-flex-direction` | `column` |
 * | `--steps-list-font-feature-settings` | `'ss01' 1` |
 * | `--steps-list-font-variant-numeric` | `normal` |
 * | `--steps-list-footer-align-items` | `center` |
 * | `--steps-list-footer-box-sizing` | `border-box` |
 * | `--steps-list-footer-column-gap` | `var(--spacing-6)` |
 * | `--steps-list-footer-connector-margin-block-end` | `var(--spacing-2)` |
 * | `--steps-list-footer-content-min-inline-size` | `0` |
 * | `--steps-list-footer-display` | `grid` |
 * | `--steps-list-footer-grid-template-columns` | `var(--steps-internal-list-marker-size) minmax(0...` |
 * | `--steps-list-footer-margin` | `0` |
 * | `--steps-list-footer-marker-background` | `-` |
 * | `--steps-list-footer-marker-background-color` | `var(--steps-list-footer-marker-background)` |
 * | `--steps-list-footer-marker-border-radius` | `var(--radius-round)` |
 * | `--steps-list-footer-marker-box-sizing` | `border-box` |
 * | `--steps-list-footer-marker-size` | `var(--spacing-4)` |
 * | `--steps-list-footer-padding` | `0` |
 * | `--steps-list-footer-rail-align-self` | `stretch` |
 * | `--steps-list-footer-rail-display` | `grid` |
 * | `--steps-list-footer-rail-grid-template-rows` | `1fr auto 1fr` |
 * | `--steps-list-footer-rail-justify-items` | `center` |
 * | `--steps-list-inline-size` | `100%` |
 * | `--steps-list-item-box-sizing` | `border-box` |
 * | `--steps-list-item-column-gap` | `var(--spacing-6)` |
 * | `--steps-list-item-display` | `grid` |
 * | `--steps-list-item-grid-template-columns` | `var(--steps-internal-list-marker-size) minmax(0...` |
 * | `--steps-list-item-margin` | `0` |
 * | `--steps-list-item-padding` | `0` |
 * | `--steps-list-items-box-sizing` | `border-box` |
 * | `--steps-list-items-display` | `flex` |
 * | `--steps-list-items-flex-direction` | `column` |
 * | `--steps-list-items-list-style` | `none` |
 * | `--steps-list-items-margin` | `0` |
 * | `--steps-list-items-padding` | `0` |
 * | `--steps-list-label-align-items` | `center` |
 * | `--steps-list-label-color` | `var(--steps-list-label-foreground)` |
 * | `--steps-list-label-display` | `flex` |
 * | `--steps-list-label-font-family` | `var(--paragraph-base-500-font-family)` |
 * | `--steps-list-label-font-size` | `var(--paragraph-base-500-font-size)` |
 * | `--steps-list-label-font-weight` | `var(--paragraph-base-500-font-weight)` |
 * | `--steps-list-label-foreground` | `-` |
 * | `--steps-list-label-letter-spacing` | `var(--paragraph-base-500-letter-spacing)` |
 * | `--steps-list-label-line-height` | `var(--paragraph-base-500-line-height)` |
 * | `--steps-list-label-overflow-wrap` | `anywhere` |
 * | `--steps-list-label-text-transform` | `var(--paragraph-base-500-text-transform)` |
 * | `--steps-list-margin` | `0` |
 * | `--steps-list-marker-align-items` | `center` |
 * | `--steps-list-marker-background` | `-` |
 * | `--steps-list-marker-background-color` | `var(--steps-list-marker-background)` |
 * | `--steps-list-marker-border` | `-` |
 * | `--steps-list-marker-border-color` | `var(--steps-list-marker-border)` |
 * | `--steps-list-marker-border-radius` | `var(--radius-round)` |
 * | `--steps-list-marker-border-style` | `solid` |
 * | `--steps-list-marker-border-width` | `1px` |
 * | `--steps-list-marker-box-sizing` | `border-box` |
 * | `--steps-list-marker-color` | `var(--steps-list-marker-foreground)` |
 * | `--steps-list-marker-display` | `inline-flex` |
 * | `--steps-list-marker-flex` | `0 0 auto` |
 * | `--steps-list-marker-font-family` | `var(--label-small-500-font-family)` |
 * | `--steps-list-marker-font-size` | `var(--label-small-500-font-size)` |
 * | `--steps-list-marker-font-weight` | `var(--label-small-500-font-weight)` |
 * | `--steps-list-marker-foreground` | `-` |
 * | `--steps-list-marker-justify-content` | `center` |
 * | `--steps-list-marker-letter-spacing` | `var(--label-small-500-letter-spacing)` |
 * | `--steps-list-marker-line-height` | `var(--label-small-500-line-height)` |
 * | `--steps-list-marker-size` | `var(--spacing-12)` |
 * | `--steps-list-marker-text-transform` | `var(--label-small-500-text-transform)` |
 * | `--steps-list-marker-user-select` | `none` |
 * | `--steps-list-padding` | `0` |
 * | `--steps-list-rail-align-items` | `center` |
 * | `--steps-list-rail-display` | `flex` |
 * | `--steps-list-rail-flex-direction` | `column` |
 * | `--steps-margin` | `0` |
 * | `--steps-marker-align-items` | `center` |
 * | `--steps-marker-border-radius` | `var(--radius-round)` |
 * | `--steps-marker-border-style` | `solid` |
 * | `--steps-marker-border-width` | `1px` |
 * | `--steps-marker-box-sizing` | `border-box` |
 * | `--steps-marker-current-background` | `-` |
 * | `--steps-marker-current-background-color` | `var(--steps-marker-current-background)` |
 * | `--steps-marker-current-border` | `-` |
 * | `--steps-marker-current-border-color` | `var(--steps-marker-current-border)` |
 * | `--steps-marker-current-color` | `var(--steps-marker-current-foreground)` |
 * | `--steps-marker-current-foreground` | `-` |
 * | `--steps-marker-display` | `inline-flex` |
 * | `--steps-marker-done-background` | `-` |
 * | `--steps-marker-done-background-color` | `var(--steps-marker-done-background)` |
 * | `--steps-marker-done-border` | `-` |
 * | `--steps-marker-done-border-color` | `var(--steps-marker-done-border)` |
 * | `--steps-marker-done-color` | `var(--steps-marker-done-foreground)` |
 * | `--steps-marker-done-foreground` | `-` |
 * | `--steps-marker-font-family` | `var(--label-small-500-font-family)` |
 * | `--steps-marker-font-size` | `var(--label-small-500-font-size)` |
 * | `--steps-marker-font-weight` | `var(--label-small-500-font-weight)` |
 * | `--steps-marker-grid-column` | `1` |
 * | `--steps-marker-grid-row` | `1` |
 * | `--steps-marker-justify-content` | `center` |
 * | `--steps-marker-letter-spacing` | `var(--label-small-500-letter-spacing)` |
 * | `--steps-marker-line-height` | `var(--label-small-500-line-height)` |
 * | `--steps-marker-size` | `var(--spacing-12)` |
 * | `--steps-marker-text-transform` | `var(--label-small-500-text-transform)` |
 * | `--steps-marker-user-select` | `none` |
 * | `--steps-marker-waiting-background` | `-` |
 * | `--steps-marker-waiting-background-color` | `var(--steps-marker-waiting-background)` |
 * | `--steps-marker-waiting-border` | `-` |
 * | `--steps-marker-waiting-border-color` | `var(--steps-marker-waiting-border)` |
 * | `--steps-marker-waiting-color` | `var(--steps-marker-waiting-foreground)` |
 * | `--steps-marker-waiting-foreground` | `-` |
 * | `--steps-padding` | `0` |
 * | `--steps-row-list-style` | `none` |
 * | `--steps-text-focus-ring` | `-` |
 * | `--steps-text-focus-visible-border-radius` | `var(--radius-1)` |
 * | `--steps-text-focus-visible-outline` | `1px solid var(--steps-text-focus-ring)` |
 * | `--steps-text-focus-visible-outline-offset` | `1px` |
 * | `--steps-text-grid-column` | `2` |
 * | `--steps-text-min-inline-size` | `var(--spacing-24)` |
 * | `--steps-text-overflow` | `clip visible` |
 * | `--steps-text-text-overflow` | `ellipsis` |
 * | `--steps-text-white-space` | `nowrap` |
 */
// #endregion css-tokens

export type * from './types.js';
export { StepsStatus } from './constants.js';
export { Steps } from './steps.js';
