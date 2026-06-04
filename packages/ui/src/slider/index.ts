// #region css-tokens
/**
 * CSS Tokens for slider
 * Prefix: `--slider-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--slider-dot-active-border-color` | `var(--primary)` |
 * | `--slider-dot-background` | `var(--base-white)` |
 * | `--slider-dot-border` | `2px solid color-mix(in srgb, var(--primary) 30%...` |
 * | `--slider-dot-border-radius` | `50%` |
 * | `--slider-dot-height` | `8px` |
 * | `--slider-dot-position` | `absolute` |
 * | `--slider-dot-transform` | `translate(-50%, -50%)` |
 * | `--slider-dot-width` | `8px` |
 * | `--slider-dots-left` | `calc(var(--slider-thumb-width, 18px) / 2)` |
 * | `--slider-dots-pointer-events` | `none` |
 * | `--slider-dots-position` | `absolute` |
 * | `--slider-dots-top` | `50%` |
 * | `--slider-dots-width` | `calc(100% - var(--slider-thumb-width, 18px))` |
 * | `--slider-mark-color` | `var(--l3-foreground)` |
 * | `--slider-mark-cursor` | `pointer` |
 * | `--slider-mark-focus-border-radius` | `2px` |
 * | `--slider-mark-focus-outline` | `2px solid var(--primary)` |
 * | `--slider-mark-focus-outline-offset` | `2px` |
 * | `--slider-mark-pointer-events` | `auto` |
 * | `--slider-mark-position` | `absolute` |
 * | `--slider-mark-transform` | `translateX(-50%)` |
 * | `--slider-mark-white-space` | `nowrap` |
 * | `--slider-marks-font-size` | `11px` |
 * | `--slider-marks-left` | `calc(var(--slider-thumb-width, 18px) / 2)` |
 * | `--slider-marks-pointer-events` | `none` |
 * | `--slider-marks-position` | `absolute` |
 * | `--slider-marks-top` | `calc(50% + 12px)` |
 * | `--slider-marks-width` | `calc(100% - var(--slider-thumb-width, 18px))` |
 * | `--slider-range-background` | `var(--primary)` |
 * | `--slider-range-height` | `100%` |
 * | `--slider-range-position` | `absolute` |
 * | `--slider-range-vertical-width` | `100%` |
 * | `--slider-root-align-items` | `center` |
 * | `--slider-root-display` | `flex` |
 * | `--slider-root-position` | `relative` |
 * | `--slider-root-touch-action` | `none` |
 * | `--slider-root-user-select` | `none` |
 * | `--slider-root-vertical-flex-direction` | `column` |
 * | `--slider-root-vertical-height` | `100px` |
 * | `--slider-root-vertical-width` | `20px` |
 * | `--slider-root-width` | `100%` |
 * | `--slider-root-with-marks-margin-bottom` | `28px` |
 * | `--slider-thumb-active-cursor` | `grabbing` |
 * | `--slider-thumb-background` | `var(--base-white)` |
 * | `--slider-thumb-border` | `2px solid var(--primary)` |
 * | `--slider-thumb-border-radius` | `50%` |
 * | `--slider-thumb-box-shadow` | `0 1px 3px 0 rgba(0, 0, 0, 0.1)` |
 * | `--slider-thumb-cursor` | `grab` |
 * | `--slider-thumb-disabled-cursor` | `not-allowed` |
 * | `--slider-thumb-disabled-opacity` | `0.5` |
 * | `--slider-thumb-display` | `block` |
 * | `--slider-thumb-focus-box-shadow` | `0 0 0 2px var(--base-white), 0 0 0 4px var(--pr...` |
 * | `--slider-thumb-focus-outline` | `none` |
 * | `--slider-thumb-height` | `18px` |
 * | `--slider-thumb-hover-background` | `var(--base-white)` |
 * | `--slider-thumb-transition` | `background-color 150ms ease-in-out` |
 * | `--slider-thumb-width` | `18px` |
 * | `--slider-track-background` | `color-mix(in srgb, var(--primary) 10%, transpar...` |
 * | `--slider-track-border-radius` | `9999px` |
 * | `--slider-track-disabled-opacity` | `0.5` |
 * | `--slider-track-flex-grow` | `1` |
 * | `--slider-track-height` | `6px` |
 * | `--slider-track-margin-x` | `calc(var(--slider-thumb-width, 18px) / 2)` |
 * | `--slider-track-overflow` | `hidden` |
 * | `--slider-track-position` | `relative` |
 * | `--slider-track-vertical-height` | `100%` |
 * | `--slider-track-vertical-margin-y` | `calc(var(--slider-thumb-height, 18px) / 2)` |
 * | `--slider-track-vertical-width` | `6px` |
 * | `--slider-track-width` | `100%` |
 */
// #endregion css-tokens

export * from './slider.js';
