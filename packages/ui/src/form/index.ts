// #region css-tokens
/**
 * CSS Tokens for form
 * Prefix: `--form-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--form-display` | `flex` |
 * | `--form-flex-direction` | `column` |
 * | `--form-gap` | `var(--spacing-8)` |
 * | `--form-inline-align-items` | `flex-end` |
 * | `--form-inline-flex-direction` | `row` |
 * | `--form-inline-flex-wrap` | `wrap` |
 * | `--form-inline-message-inset-block-start` | `100%` |
 * | `--form-inline-message-inset-inline` | `0` |
 * | `--form-inline-message-margin-block-start` | `var(--spacing-4)` |
 * | `--form-inline-message-overflow` | `clip visible` |
 * | `--form-inline-message-padding-block-end` | `calc(var(--spacing-4) + var(--paragraph-small-4...` |
 * | `--form-inline-message-position` | `absolute` |
 * | `--form-inline-message-row-gap` | `calc( var(--form-gap, var(--spacing-8)) + var(-...` |
 * | `--form-inline-message-text-overflow` | `ellipsis` |
 * | `--form-inline-message-white-space` | `nowrap` |
 * | `--form-margin` | `0` |
 * | `--form-min-inline-size` | `0` |
 * | `--form-padding` | `0` |
 */
// #endregion css-tokens

export type * from './types.js';
export { Form } from './form.js';
export { FormLayout } from './constants.js';
