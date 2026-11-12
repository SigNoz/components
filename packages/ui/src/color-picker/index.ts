// #region css-tokens
/**
 * CSS Tokens for color-picker
 * Prefix: `--color-picker-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--color-picker-area-background-image` | `linear-gradient(to top, var(--base-black), tran...` |
 * | `--color-picker-area-block-size` | `10rem` |
 * | `--color-picker-area-border-radius` | `var(--radius-2)` |
 * | `--color-picker-area-cursor` | `pointer` |
 * | `--color-picker-area-position` | `relative` |
 * | `--color-picker-area-touch-action` | `none` |
 * | `--color-picker-area-user-select` | `none` |
 * | `--color-picker-backdrop-filter` | `blur(40px)` |
 * | `--color-picker-background` | `-` |
 * | `--color-picker-background-color` | `var(--color-picker-background)` |
 * | `--color-picker-border` | `-` |
 * | `--color-picker-border-color` | `var(--color-picker-border)` |
 * | `--color-picker-border-radius` | `var(--radius-2)` |
 * | `--color-picker-border-style` | `solid` |
 * | `--color-picker-border-width` | `1px` |
 * | `--color-picker-box-shadow` | `var(--color-picker-shadow)` |
 * | `--color-picker-box-sizing` | `border-box` |
 * | `--color-picker-clear-align-items` | `center` |
 * | `--color-picker-clear-background-color` | `transparent` |
 * | `--color-picker-clear-background-hover` | `-` |
 * | `--color-picker-clear-border` | `none` |
 * | `--color-picker-clear-border-radius` | `var(--radius-1)` |
 * | `--color-picker-clear-box-sizing` | `border-box` |
 * | `--color-picker-clear-color` | `var(--color-picker-clear-icon)` |
 * | `--color-picker-clear-cursor` | `pointer` |
 * | `--color-picker-clear-display` | `inline-flex` |
 * | `--color-picker-clear-flex` | `none` |
 * | `--color-picker-clear-focus-ring` | `-` |
 * | `--color-picker-clear-focus-visible-outline-color` | `var(--color-picker-clear-focus-ring)` |
 * | `--color-picker-clear-focus-visible-outline-offset` | `0` |
 * | `--color-picker-clear-focus-visible-outline-style` | `solid` |
 * | `--color-picker-clear-focus-visible-outline-width` | `1px` |
 * | `--color-picker-clear-hover-background-color` | `var(--color-picker-clear-background-hover)` |
 * | `--color-picker-clear-hover-color` | `var(--color-picker-clear-icon-hover)` |
 * | `--color-picker-clear-icon` | `-` |
 * | `--color-picker-clear-icon-hover` | `-` |
 * | `--color-picker-clear-icon-size` | `var(--spacing-7)` |
 * | `--color-picker-clear-justify-content` | `center` |
 * | `--color-picker-clear-margin` | `0` |
 * | `--color-picker-clear-padding` | `0` |
 * | `--color-picker-clear-size` | `var(--spacing-12)` |
 * | `--color-picker-color` | `var(--color-picker-foreground)` |
 * | `--color-picker-display` | `flex` |
 * | `--color-picker-dragging-cursor` | `grabbing` |
 * | `--color-picker-flex-direction` | `column` |
 * | `--color-picker-focus-visible-outline` | `none` |
 * | `--color-picker-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--color-picker-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--color-picker-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--color-picker-footer-color` | `var(--color-picker-footer-foreground)` |
 * | `--color-picker-footer-font-family` | `var(--paragraph-small-400-font-family)` |
 * | `--color-picker-footer-font-size` | `var(--paragraph-small-400-font-size)` |
 * | `--color-picker-footer-font-weight` | `var(--paragraph-small-400-font-weight)` |
 * | `--color-picker-footer-foreground` | `-` |
 * | `--color-picker-footer-letter-spacing` | `var(--paragraph-small-400-letter-spacing)` |
 * | `--color-picker-footer-line-height` | `var(--paragraph-small-400-line-height)` |
 * | `--color-picker-footer-min-inline-size` | `0` |
 * | `--color-picker-footer-overflow-wrap` | `anywhere` |
 * | `--color-picker-footer-text-transform` | `var(--paragraph-small-400-text-transform)` |
 * | `--color-picker-foreground` | `-` |
 * | `--color-picker-gap` | `var(--spacing-6)` |
 * | `--color-picker-hex-field-align-items` | `center` |
 * | `--color-picker-hex-field-background` | `-` |
 * | `--color-picker-hex-field-background-color` | `var(--color-picker-hex-field-background)` |
 * | `--color-picker-hex-field-background-invalid` | `-` |
 * | `--color-picker-hex-field-block-size` | `var(--spacing-16)` |
 * | `--color-picker-hex-field-border` | `-` |
 * | `--color-picker-hex-field-border-color` | `var(--color-picker-hex-field-border)` |
 * | `--color-picker-hex-field-border-invalid` | `-` |
 * | `--color-picker-hex-field-border-radius` | `var(--radius-1)` |
 * | `--color-picker-hex-field-border-style` | `solid` |
 * | `--color-picker-hex-field-border-width` | `1px` |
 * | `--color-picker-hex-field-box-sizing` | `border-box` |
 * | `--color-picker-hex-field-color` | `var(--color-picker-hex-field-prefix)` |
 * | `--color-picker-hex-field-display` | `flex` |
 * | `--color-picker-hex-field-focus-ring` | `-` |
 * | `--color-picker-hex-field-focus-visible-outline-color` | `var(--color-picker-hex-field-focus-ring)` |
 * | `--color-picker-hex-field-focus-visible-outline-offset` | `1px` |
 * | `--color-picker-hex-field-focus-visible-outline-style` | `solid` |
 * | `--color-picker-hex-field-focus-visible-outline-width` | `1px` |
 * | `--color-picker-hex-field-font-family` | `var(--label-base-400-font-family)` |
 * | `--color-picker-hex-field-font-size` | `var(--label-base-400-font-size)` |
 * | `--color-picker-hex-field-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--color-picker-hex-field-gap` | `var(--spacing-2)` |
 * | `--color-picker-hex-field-invalid-background-color` | `var(--color-picker-hex-field-background-invalid)` |
 * | `--color-picker-hex-field-invalid-border-color` | `var(--color-picker-hex-field-border-invalid)` |
 * | `--color-picker-hex-field-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--color-picker-hex-field-line-height` | `var(--label-base-400-line-height)` |
 * | `--color-picker-hex-field-min-inline-size` | `0` |
 * | `--color-picker-hex-field-padding-block` | `0` |
 * | `--color-picker-hex-field-padding-inline` | `0 var(--spacing-2)` |
 * | `--color-picker-hex-field-prefix` | `-` |
 * | `--color-picker-hex-field-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--color-picker-hex-field-value` | `-` |
 * | `--color-picker-hex-input-background-color` | `transparent` |
 * | `--color-picker-hex-input-border` | `none` |
 * | `--color-picker-hex-input-color` | `var(--color-picker-hex-field-value)` |
 * | `--color-picker-hex-input-flex` | `1` |
 * | `--color-picker-hex-input-font-family` | `var(--label-base-400-font-family)` |
 * | `--color-picker-hex-input-font-size` | `var(--label-base-400-font-size)` |
 * | `--color-picker-hex-input-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--color-picker-hex-input-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--color-picker-hex-input-line-height` | `var(--label-base-400-line-height)` |
 * | `--color-picker-hex-input-margin` | `0` |
 * | `--color-picker-hex-input-min-inline-size` | `0` |
 * | `--color-picker-hex-input-outline` | `none` |
 * | `--color-picker-hex-input-padding` | `0` |
 * | `--color-picker-hex-input-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--color-picker-hex-label-align-items` | `center` |
 * | `--color-picker-hex-label-align-self` | `stretch` |
 * | `--color-picker-hex-label-cursor` | `text` |
 * | `--color-picker-hex-label-display` | `flex` |
 * | `--color-picker-hex-label-flex` | `1` |
 * | `--color-picker-hex-label-gap` | `var(--spacing-2)` |
 * | `--color-picker-hex-label-min-inline-size` | `0` |
 * | `--color-picker-hex-label-padding-inline` | `var(--spacing-4) var(--spacing-2)` |
 * | `--color-picker-hue-background-image` | `linear-gradient( to right, hsl(0 100% 50%), hsl...` |
 * | `--color-picker-hue-block-size` | `var(--spacing-6)` |
 * | `--color-picker-hue-border-radius` | `var(--radius-round)` |
 * | `--color-picker-hue-cursor` | `pointer` |
 * | `--color-picker-hue-flex` | `1` |
 * | `--color-picker-hue-position` | `relative` |
 * | `--color-picker-hue-row-align-items` | `center` |
 * | `--color-picker-hue-row-display` | `flex` |
 * | `--color-picker-hue-row-gap` | `var(--spacing-6)` |
 * | `--color-picker-hue-thumb-inset-block-start` | `50%` |
 * | `--color-picker-hue-touch-action` | `none` |
 * | `--color-picker-hue-user-select` | `none` |
 * | `--color-picker-inline-size` | `15rem` |
 * | `--color-picker-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--color-picker-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--color-picker-padding` | `var(--spacing-6)` |
 * | `--color-picker-positioner-focus-visible-outline` | `none` |
 * | `--color-picker-positioner-inline-size` | `max-content` |
 * | `--color-picker-positioner-pointer-events` | `auto` |
 * | `--color-picker-preview-border` | `-` |
 * | `--color-picker-preview-border-color` | `var(--color-picker-preview-border)` |
 * | `--color-picker-preview-border-radius` | `var(--radius-2)` |
 * | `--color-picker-preview-border-style` | `solid` |
 * | `--color-picker-preview-border-width` | `1px` |
 * | `--color-picker-preview-box-sizing` | `border-box` |
 * | `--color-picker-preview-empty-background` | `-` |
 * | `--color-picker-preview-empty-background-color` | `var(--color-picker-preview-empty-background)` |
 * | `--color-picker-preview-empty-background-image` | `linear-gradient( to top right, transparent calc...` |
 * | `--color-picker-preview-empty-line` | `-` |
 * | `--color-picker-preview-empty-line-color` | `var(--color-picker-preview-empty-line)` |
 * | `--color-picker-preview-flex` | `none` |
 * | `--color-picker-preview-size` | `var(--spacing-12)` |
 * | `--color-picker-readonly-cursor` | `not-allowed` |
 * | `--color-picker-readonly-hex-label-cursor` | `default` |
 * | `--color-picker-shadow` | `-` |
 * | `--color-picker-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--color-picker-thumb-border` | `-` |
 * | `--color-picker-thumb-box-sizing` | `border-box` |
 * | `--color-picker-thumb-cursor` | `grab` |
 * | `--color-picker-thumb-focus-ring` | `-` |
 * | `--color-picker-thumb-focus-visible-outline-color` | `var(--color-picker-thumb-focus-ring)` |
 * | `--color-picker-thumb-focus-visible-outline-offset` | `1px` |
 * | `--color-picker-thumb-focus-visible-outline-style` | `solid` |
 * | `--color-picker-thumb-focus-visible-outline-width` | `2px` |
 * | `--color-picker-thumb-inset` | `var(--spacing-2)` |
 * | `--color-picker-thumb-position` | `absolute` |
 * | `--color-picker-thumb-rim` | `-` |
 * | `--color-picker-thumb-rim-color` | `var(--color-picker-thumb-rim)` |
 * | `--color-picker-thumb-ring-border-color` | `var(--color-picker-thumb-border)` |
 * | `--color-picker-thumb-ring-border-radius` | `var(--radius-round)` |
 * | `--color-picker-thumb-ring-border-style` | `solid` |
 * | `--color-picker-thumb-ring-border-width` | `2px` |
 * | `--color-picker-thumb-ring-box-shadow` | `0 0 0 1px var(--color-picker-internal-thumb-rim...` |
 * | `--color-picker-thumb-ring-box-sizing` | `border-box` |
 * | `--color-picker-thumb-ring-position` | `absolute` |
 * | `--color-picker-thumb-size` | `var(--spacing-12)` |
 * | `--color-picker-thumb-translate` | `-50% -50%` |
 * | `--color-picker-visually-hidden-block-size` | `1px` |
 * | `--color-picker-visually-hidden-border-width` | `0` |
 * | `--color-picker-visually-hidden-clip-path` | `inset(50%)` |
 * | `--color-picker-visually-hidden-inline-size` | `1px` |
 * | `--color-picker-visually-hidden-margin` | `-1px` |
 * | `--color-picker-visually-hidden-overflow` | `hidden` |
 * | `--color-picker-visually-hidden-padding` | `0` |
 * | `--color-picker-visually-hidden-position` | `absolute` |
 * | `--color-picker-visually-hidden-white-space` | `nowrap` |
 * | `--color-picker-z-index` | `50` |
 */
// #endregion css-tokens

export { ColorPicker } from './color-picker.js';
export type {
	ColorPickerAlignType,
	ColorPickerProps,
	ColorPickerSideType,
	ValidateColorPickerProps,
} from './types.js';
