// #region css-tokens
/**
 * CSS Tokens for color-picker
 * Prefix: `--color-picker-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--color-picker-alpha-background-image` | `linear-gradient(to right, transparent, var(--co...` |
 * | `--color-picker-alpha-background-size` | `100% 100%, var(--color-picker-internal-checker-...` |
 * | `--color-picker-alpha-block-size` | `var(--spacing-6)` |
 * | `--color-picker-alpha-border-radius` | `var(--radius-round)` |
 * | `--color-picker-alpha-cursor` | `pointer` |
 * | `--color-picker-alpha-field-flex` | `none` |
 * | `--color-picker-alpha-field-inline-size` | `4rem` |
 * | `--color-picker-alpha-position` | `relative` |
 * | `--color-picker-alpha-thumb-inset-block-start` | `50%` |
 * | `--color-picker-alpha-touch-action` | `none` |
 * | `--color-picker-alpha-user-select` | `none` |
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
 * | `--color-picker-channel-label-padding-inline` | `var(--spacing-3) 0` |
 * | `--color-picker-checkerboard-color` | `color-mix(in srgb, var(--color-picker-foregroun...` |
 * | `--color-picker-checkerboard-size` | `var(--spacing-4)` |
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
 * | `--color-picker-field-align-items` | `center` |
 * | `--color-picker-field-background` | `-` |
 * | `--color-picker-field-background-color` | `var(--color-picker-field-background)` |
 * | `--color-picker-field-background-invalid` | `-` |
 * | `--color-picker-field-block-size` | `var(--spacing-16)` |
 * | `--color-picker-field-border` | `-` |
 * | `--color-picker-field-border-color` | `var(--color-picker-field-border)` |
 * | `--color-picker-field-border-invalid` | `-` |
 * | `--color-picker-field-border-radius` | `var(--radius-1)` |
 * | `--color-picker-field-border-style` | `solid` |
 * | `--color-picker-field-border-width` | `1px` |
 * | `--color-picker-field-box-sizing` | `border-box` |
 * | `--color-picker-field-color` | `var(--color-picker-field-prefix)` |
 * | `--color-picker-field-display` | `flex` |
 * | `--color-picker-field-flex` | `1` |
 * | `--color-picker-field-focus-ring` | `-` |
 * | `--color-picker-field-focus-visible-outline-color` | `var(--color-picker-field-focus-ring)` |
 * | `--color-picker-field-focus-visible-outline-offset` | `1px` |
 * | `--color-picker-field-focus-visible-outline-style` | `solid` |
 * | `--color-picker-field-focus-visible-outline-width` | `1px` |
 * | `--color-picker-field-font-family` | `var(--label-base-400-font-family)` |
 * | `--color-picker-field-font-size` | `var(--label-base-400-font-size)` |
 * | `--color-picker-field-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--color-picker-field-gap` | `var(--spacing-2)` |
 * | `--color-picker-field-input-background-color` | `transparent` |
 * | `--color-picker-field-input-border` | `none` |
 * | `--color-picker-field-input-color` | `var(--color-picker-field-value)` |
 * | `--color-picker-field-input-flex` | `1` |
 * | `--color-picker-field-input-font-family` | `var(--label-base-400-font-family)` |
 * | `--color-picker-field-input-font-size` | `var(--label-base-400-font-size)` |
 * | `--color-picker-field-input-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--color-picker-field-input-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--color-picker-field-input-line-height` | `var(--label-base-400-line-height)` |
 * | `--color-picker-field-input-margin` | `0` |
 * | `--color-picker-field-input-min-inline-size` | `0` |
 * | `--color-picker-field-input-outline` | `none` |
 * | `--color-picker-field-input-padding` | `0` |
 * | `--color-picker-field-input-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--color-picker-field-invalid-background-color` | `var(--color-picker-field-background-invalid)` |
 * | `--color-picker-field-invalid-border-color` | `var(--color-picker-field-border-invalid)` |
 * | `--color-picker-field-label-align-items` | `center` |
 * | `--color-picker-field-label-align-self` | `stretch` |
 * | `--color-picker-field-label-cursor` | `text` |
 * | `--color-picker-field-label-display` | `flex` |
 * | `--color-picker-field-label-flex` | `1` |
 * | `--color-picker-field-label-gap` | `var(--spacing-2)` |
 * | `--color-picker-field-label-min-inline-size` | `0` |
 * | `--color-picker-field-label-padding-inline` | `var(--spacing-4) var(--spacing-2)` |
 * | `--color-picker-field-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--color-picker-field-line-height` | `var(--label-base-400-line-height)` |
 * | `--color-picker-field-min-inline-size` | `0` |
 * | `--color-picker-field-padding-block` | `0` |
 * | `--color-picker-field-padding-inline` | `0 var(--spacing-2)` |
 * | `--color-picker-field-prefix` | `-` |
 * | `--color-picker-field-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--color-picker-field-value` | `-` |
 * | `--color-picker-fields-display` | `flex` |
 * | `--color-picker-fields-gap` | `var(--spacing-3)` |
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
 * | `--color-picker-hue-background-image` | `linear-gradient( to right, hsl(0 100% 50%), hsl...` |
 * | `--color-picker-hue-block-size` | `var(--spacing-6)` |
 * | `--color-picker-hue-border-radius` | `var(--radius-round)` |
 * | `--color-picker-hue-cursor` | `pointer` |
 * | `--color-picker-hue-position` | `relative` |
 * | `--color-picker-hue-thumb-inset-block-start` | `50%` |
 * | `--color-picker-hue-touch-action` | `none` |
 * | `--color-picker-hue-user-select` | `none` |
 * | `--color-picker-inline-size` | `16rem` |
 * | `--color-picker-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--color-picker-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--color-picker-opaque-preview-size` | `var(--spacing-12)` |
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
 * | `--color-picker-preview-empty-background-size` | `auto` |
 * | `--color-picker-preview-empty-line` | `-` |
 * | `--color-picker-preview-empty-line-color` | `var(--color-picker-preview-empty-line)` |
 * | `--color-picker-preview-flex` | `none` |
 * | `--color-picker-preview-size` | `var(--spacing-16)` |
 * | `--color-picker-readonly-cursor` | `not-allowed` |
 * | `--color-picker-readonly-field-label-cursor` | `default` |
 * | `--color-picker-shadow` | `-` |
 * | `--color-picker-strips-display` | `flex` |
 * | `--color-picker-strips-flex` | `1` |
 * | `--color-picker-strips-flex-direction` | `column` |
 * | `--color-picker-strips-gap` | `var(--spacing-4)` |
 * | `--color-picker-strips-min-inline-size` | `0` |
 * | `--color-picker-strips-row-align-items` | `center` |
 * | `--color-picker-strips-row-display` | `flex` |
 * | `--color-picker-strips-row-gap` | `var(--spacing-6)` |
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
