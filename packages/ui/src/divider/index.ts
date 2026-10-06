// #region css-tokens
/**
 * CSS Tokens for divider
 * Prefix: `--divider-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--divider-border` | `-` |
 * | `--divider-border-color` | `var(--divider-border)` |
 * | `--divider-border-style` | `solid` |
 * | `--divider-border-width` | `1px` |
 * | `--divider-dashed-border-style` | `dashed` |
 * | `--divider-flex-shrink` | `0` |
 * | `--divider-horizontal-align-items` | `center` |
 * | `--divider-horizontal-display` | `flex` |
 * | `--divider-horizontal-gap` | `var(--spacing-6)` |
 * | `--divider-horizontal-margin-block` | `var(--divider-internal-spacing, 0)` |
 * | `--divider-horizontal-max-width` | `var(--divider-internal-max-width, 100%)` |
 * | `--divider-horizontal-width` | `var(--divider-internal-width, 100%)` |
 * | `--divider-label-flex-shrink` | `0` |
 * | `--divider-label-white-space` | `nowrap` |
 * | `--divider-line-flex` | `1 1 0` |
 * | `--divider-vertical-align-items` | `center` |
 * | `--divider-vertical-display` | `inline-flex` |
 * | `--divider-vertical-height` | `var(--divider-internal-height, 0.9em)` |
 * | `--divider-vertical-margin-inline` | `var(--divider-internal-spacing, var(--spacing-4))` |
 * | `--divider-vertical-max-height` | `var(--divider-internal-max-height, 100%)` |
 * | `--divider-vertical-vertical-align` | `calc(0.5ex + 0.06em)` |
 */
// #endregion css-tokens

export { DividerOrientation } from './constants.js';
export type * from './types.js';
export { Divider } from './divider.js';
