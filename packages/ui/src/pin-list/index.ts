// #region css-tokens
/**
 * CSS Tokens for pin-list
 * Prefix: `--pin-list-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--pin-list-container-gap` | `var(--spacing-10, 20px)` |
 * | `--pin-list-empty-state-color` | `var(--foreground)` |
 * | `--pin-list-empty-state-font-family` | `var(--paragraph-small-400-font-family)` |
 * | `--pin-list-empty-state-font-size` | `var(--paragraph-small-400-font-size)` |
 * | `--pin-list-empty-state-font-weight` | `var(--paragraph-small-400-font-weight)` |
 * | `--pin-list-empty-state-letter-spacing` | `var(--paragraph-small-400-letter-spacing)` |
 * | `--pin-list-empty-state-line-height` | `var(--paragraph-small-400-line-height)` |
 * | `--pin-list-empty-state-opacity` | `0.6` |
 * | `--pin-list-empty-state-padding-left` | `var(--spacing-6, 12px)` |
 * | `--pin-list-empty-state-text-align` | `left` |
 * | `--pin-list-empty-state-text-transform` | `var(--paragraph-small-400-text-transform)` |
 * | `--pin-list-empty-state-text-width` | `150px` |
 * | `--pin-list-item-active-background` | `var(--secondary)` |
 * | `--pin-list-item-active-hover-background` | `color-mix(in srgb, var(--secondary) 80%, transp...` |
 * | `--pin-list-item-background` | `transparent` |
 * | `--pin-list-item-border-radius` | `3px` |
 * | `--pin-list-item-color` | `var(--foreground)` |
 * | `--pin-list-item-content-gap` | `8px` |
 * | `--pin-list-item-gap` | `var(--spacing-10, 20px)` |
 * | `--pin-list-item-height` | `32px` |
 * | `--pin-list-item-hover-background` | `var(--secondary)` |
 * | `--pin-list-item-icon-color` | `var(--foreground)` |
 * | `--pin-list-item-icon-size` | `16px` |
 * | `--pin-list-item-label-active-color` | `var(--secondary-foreground)` |
 * | `--pin-list-item-label-color` | `var(--foreground)` |
 * | `--pin-list-item-label-font-family` | `var(--label-base-400-font-family)` |
 * | `--pin-list-item-label-font-size` | `var(--label-base-400-font-size)` |
 * | `--pin-list-item-label-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--pin-list-item-label-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--pin-list-item-label-line-height` | `var(--label-base-400-line-height)` |
 * | `--pin-list-item-label-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--pin-list-item-padding` | `var(--spacing-2, 4px) var(--spacing-6, 12px)` |
 * | `--pin-list-item-pin-button-color` | `var(--foreground)` |
 * | `--pin-list-item-pin-button-opacity` | `0` |
 * | `--pin-list-item-pin-button-size` | `16px` |
 * | `--pin-list-item-pin-button-transition-duration` | `150ms` |
 * | `--pin-list-item-pin-button-transition-property` | `opacity` |
 * | `--pin-list-item-pin-button-transition-timing` | `ease` |
 * | `--pin-list-item-pin-button-visible-opacity` | `1` |
 * | `--pin-list-item-text-align` | `left` |
 * | `--pin-list-item-transition-duration` | `150ms` |
 * | `--pin-list-item-transition-property` | `background-color, color` |
 * | `--pin-list-item-transition-timing` | `ease` |
 * | `--pin-list-label-color` | `var(--card-foreground)` |
 * | `--pin-list-label-font-family` | `var(--uppercase-small-600-font-family)` |
 * | `--pin-list-label-font-size` | `var(--uppercase-small-600-font-size)` |
 * | `--pin-list-label-font-weight` | `var(--uppercase-small-600-font-weight)` |
 * | `--pin-list-label-gap` | `8px` |
 * | `--pin-list-label-icon-color` | `var(--card-foreground)` |
 * | `--pin-list-label-icon-size` | `16px` |
 * | `--pin-list-label-letter-spacing` | `var(--uppercase-small-600-letter-spacing)` |
 * | `--pin-list-label-line-height` | `var(--uppercase-small-600-line-height)` |
 * | `--pin-list-label-margin-bottom` | `var(--spacing-2, 8px)` |
 * | `--pin-list-label-min-block-size` | `calc(var(--spacing-8) + var(--spacing-1))` |
 * | `--pin-list-label-padding-x` | `var(--spacing-6, 12px)` |
 * | `--pin-list-label-text-align` | `left` |
 * | `--pin-list-label-text-transform` | `var(--uppercase-small-600-text-transform)` |
 * | `--pin-list-more-label-chevron-color` | `var(--card-foreground)` |
 * | `--pin-list-more-label-chevron-size` | `16px` |
 * | `--pin-list-more-label-color` | `var(--card-foreground)` |
 * | `--pin-list-more-label-content-gap` | `8px` |
 * | `--pin-list-more-label-font-family` | `var(--uppercase-small-600-font-family)` |
 * | `--pin-list-more-label-font-size` | `var(--uppercase-small-600-font-size)` |
 * | `--pin-list-more-label-font-weight` | `var(--uppercase-small-600-font-weight)` |
 * | `--pin-list-more-label-gap` | `8px` |
 * | `--pin-list-more-label-hover-opacity` | `0.8` |
 * | `--pin-list-more-label-letter-spacing` | `var(--uppercase-small-600-letter-spacing)` |
 * | `--pin-list-more-label-line-height` | `var(--uppercase-small-600-line-height)` |
 * | `--pin-list-more-label-margin-bottom` | `var(--spacing-2, 8px)` |
 * | `--pin-list-more-label-min-block-size` | `calc(var(--spacing-8) + var(--spacing-1))` |
 * | `--pin-list-more-label-padding-x` | `var(--spacing-6, 12px)` |
 * | `--pin-list-more-label-text-align` | `left` |
 * | `--pin-list-more-label-text-transform` | `var(--uppercase-small-600-text-transform)` |
 * | `--pin-list-more-label-transition-duration` | `150ms` |
 * | `--pin-list-more-label-transition-property` | `opacity` |
 * | `--pin-list-more-label-transition-timing` | `ease` |
 * | `--pin-list-section-items-gap` | `var(--spacing-3, 6px)` |
 */
// #endregion css-tokens

export type { HTMLMotionProps, Transition } from 'motion/react';
export { PinList, type PinListItem, type PinListProps } from './pin-list.js';
