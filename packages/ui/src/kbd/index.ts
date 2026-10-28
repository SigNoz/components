// #region css-tokens
/**
 * CSS Tokens for kbd
 * Prefix: `--kbd-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--kbd-active-background` | `-` |
 * | `--kbd-align-items` | `center` |
 * | `--kbd-background` | `var(--kbd-active-background)` |
 * | `--kbd-border-color` | `var(--primary-background)` |
 * | `--kbd-border-radius` | `var(--kbd-internal-border-radius)` |
 * | `--kbd-border-width` | `1px` |
 * | `--kbd-box-sizing` | `border-box` |
 * | `--kbd-display` | `inline-flex` |
 * | `--kbd-font-family` | `var(--kbd-internal-font-family)` |
 * | `--kbd-font-size` | `var(--kbd-internal-font-size)` |
 * | `--kbd-font-weight` | `var(--kbd-internal-font-weight)` |
 * | `--kbd-foreground` | `var(--primary-background)` |
 * | `--kbd-justify-content` | `center` |
 * | `--kbd-letter-spacing` | `var(--kbd-internal-letter-spacing)` |
 * | `--kbd-line-height` | `var(--kbd-internal-line-height)` |
 * | `--kbd-min-block-size` | `var(--kbd-internal-min-block-size, auto)` |
 * | `--kbd-padding` | `var(--kbd-internal-padding)` |
 * | `--kbd-shadow` | `0 1px 0 0 var(--kbd-border-color, var(--l3-bord...` |
 * | `--kbd-text-transform` | `var(--kbd-internal-text-transform)` |
 * | `--kbd-white-space` | `nowrap` |
 */
// #endregion css-tokens

export type * from './kbd.js';
export { Kbd } from './kbd.js';
