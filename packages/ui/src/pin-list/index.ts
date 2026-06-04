// #region css-tokens
/**
 * CSS Tokens for pin-list
 * Prefix: `--pin-list-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--pin-list-container-gap` | `var(--spacing-10, 20px)` |
 * | `--pin-list-empty-state-color` | `var(--foreground)` |
 * | `--pin-list-empty-state-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--pin-list-empty-state-font-weight` | `var(--font-weight-normal, 400)` |
 * | `--pin-list-empty-state-letter-spacing` | `-0.06px` |
 * | `--pin-list-empty-state-line-height` | `18px` |
 * | `--pin-list-empty-state-opacity` | `0.6` |
 * | `--pin-list-empty-state-padding-left` | `var(--spacing-6, 12px)` |
 * | `--pin-list-empty-state-text-align` | `left` |
 * | `--pin-list-empty-state-text-width` | `150px` |
 * | `--pin-list-item-active-background` | `var(--secondary)` |
 * | `--pin-list-item-active-hover-background` | `color-mix(in srgb, var(--secondary) 80%, transp...` |
 * | `--pin-list-item-background` | `transparent` |
 * | `--pin-list-item-border-radius` | `3px` |
 * | `--pin-list-item-color` | `var(--foreground)` |
 * | `--pin-list-item-content-gap` | `8px` |
 * | `--pin-list-item-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--pin-list-item-font-weight` | `var(--font-weight-normal, 400)` |
 * | `--pin-list-item-gap` | `var(--spacing-10, 20px)` |
 * | `--pin-list-item-height` | `32px` |
 * | `--pin-list-item-hover-background` | `var(--secondary)` |
 * | `--pin-list-item-icon-color` | `var(--foreground)` |
 * | `--pin-list-item-icon-size` | `16px` |
 * | `--pin-list-item-label-active-color` | `var(--secondary-foreground)` |
 * | `--pin-list-item-label-color` | `var(--foreground)` |
 * | `--pin-list-item-label-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--pin-list-item-label-font-weight` | `var(--font-weight-normal, 400)` |
 * | `--pin-list-item-label-line-height` | `18px` |
 * | `--pin-list-item-line-height` | `18px` |
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
 * | `--pin-list-label-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--pin-list-label-font-weight` | `var(--font-weight-semibold, 600)` |
 * | `--pin-list-label-gap` | `8px` |
 * | `--pin-list-label-icon-color` | `var(--card-foreground)` |
 * | `--pin-list-label-icon-size` | `16px` |
 * | `--pin-list-label-letter-spacing` | `0.88px` |
 * | `--pin-list-label-line-height` | `18px` |
 * | `--pin-list-label-margin-bottom` | `var(--spacing-2, 8px)` |
 * | `--pin-list-label-padding-x` | `var(--spacing-6, 12px)` |
 * | `--pin-list-label-text-align` | `left` |
 * | `--pin-list-label-text-transform` | `uppercase` |
 * | `--pin-list-more-label-chevron-color` | `var(--card-foreground)` |
 * | `--pin-list-more-label-chevron-size` | `16px` |
 * | `--pin-list-more-label-color` | `var(--card-foreground)` |
 * | `--pin-list-more-label-content-gap` | `8px` |
 * | `--pin-list-more-label-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--pin-list-more-label-font-weight` | `var(--font-weight-semibold, 600)` |
 * | `--pin-list-more-label-gap` | `8px` |
 * | `--pin-list-more-label-hover-opacity` | `0.8` |
 * | `--pin-list-more-label-letter-spacing` | `0.88px` |
 * | `--pin-list-more-label-line-height` | `18px` |
 * | `--pin-list-more-label-margin-bottom` | `var(--spacing-2, 8px)` |
 * | `--pin-list-more-label-padding-x` | `var(--spacing-6, 12px)` |
 * | `--pin-list-more-label-text-align` | `left` |
 * | `--pin-list-more-label-text-transform` | `uppercase` |
 * | `--pin-list-more-label-transition-duration` | `150ms` |
 * | `--pin-list-more-label-transition-property` | `opacity` |
 * | `--pin-list-more-label-transition-timing` | `ease` |
 * | `--pin-list-section-items-gap` | `var(--spacing-3, 6px)` |
 */
// #endregion css-tokens

export { PinList, type PinListItem, type PinListProps } from './pin-list.js';
