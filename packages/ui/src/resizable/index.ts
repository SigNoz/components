// #region css-tokens
/**
 * CSS Tokens for resizable
 * Prefix: `--resizable-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--resizable-grip-align-items` | `center` |
 * | `--resizable-grip-background-color` | `var(--l2-background)` |
 * | `--resizable-grip-block-size` | `var(--spacing-8)` |
 * | `--resizable-grip-border-radius` | `var(--radius-1)` |
 * | `--resizable-grip-border-style` | `solid` |
 * | `--resizable-grip-border-width` | `1px` |
 * | `--resizable-grip-box-sizing` | `border-box` |
 * | `--resizable-grip-color` | `var(--l2-foreground)` |
 * | `--resizable-grip-display` | `flex` |
 * | `--resizable-grip-flex-shrink` | `0` |
 * | `--resizable-grip-focus-visible-outline-color` | `var(--ring)` |
 * | `--resizable-grip-focus-visible-outline-offset` | `1px` |
 * | `--resizable-grip-focus-visible-outline-style` | `solid` |
 * | `--resizable-grip-focus-visible-outline-width` | `1px` |
 * | `--resizable-grip-icon-flex-shrink` | `0` |
 * | `--resizable-grip-icon-size` | `var(--spacing-5)` |
 * | `--resizable-grip-inline-size` | `var(--spacing-6)` |
 * | `--resizable-grip-justify-content` | `center` |
 * | `--resizable-grip-pointer-events` | `none` |
 * | `--resizable-grip-position` | `relative` |
 * | `--resizable-grip-transition-property` | `border-color` |
 * | `--resizable-grip-vertical-rotate` | `90deg` |
 * | `--resizable-grip-z-index` | `1` |
 * | `--resizable-handle-active-color` | `var(--primary)` |
 * | `--resizable-handle-align-items` | `center` |
 * | `--resizable-handle-color` | `var(--l2-border)` |
 * | `--resizable-handle-display` | `flex` |
 * | `--resizable-handle-justify-content` | `center` |
 * | `--resizable-handle-outline` | `none` |
 * | `--resizable-handle-position` | `relative` |
 * | `--resizable-handle-thickness` | `1px` |
 * | `--resizable-handle-transition-duration` | `150ms` |
 * | `--resizable-handle-transition-property` | `background-color` |
 * | `--resizable-handle-transition-timing-function` | `ease` |
 * | `--resizable-panel-block-size` | `100%` |
 * | `--resizable-panel-box-sizing` | `border-box` |
 * | `--resizable-panel-inline-size` | `100%` |
 * | `--resizable-panel-overflow` | `auto` |
 */
// #endregion css-tokens

export { ResizableOrientation } from './constants.js';
export { Resizable } from './resizable.js';
export type * from './types.js';
