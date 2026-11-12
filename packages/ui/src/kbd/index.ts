// #region css-tokens
/**
 * CSS Tokens for kbd
 * Prefix: `--kbd-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--kbd-align-items` | `flex-start` |
 * | `--kbd-background` | `var(--secondary-background)` |
 * | `--kbd-block-display` | `flex` |
 * | `--kbd-border-color` | `var(--secondary-border)` |
 * | `--kbd-border-radius` | `var(--radius-1-5)` |
 * | `--kbd-border-style` | `solid` |
 * | `--kbd-border-width` | `1px` |
 * | `--kbd-cursor` | `default` |
 * | `--kbd-disabled-opacity` | `0.5` |
 * | `--kbd-display` | `var(--kbd-internal-display, inline-flex)` |
 * | `--kbd-edge-width` | `2px` |
 * | `--kbd-face-align-items` | `center` |
 * | `--kbd-face-box-sizing` | `border-box` |
 * | `--kbd-face-display` | `flex` |
 * | `--kbd-flex-shrink` | `0` |
 * | `--kbd-font-family` | `var(--code-small-500-font-family)` |
 * | `--kbd-font-feature-settings` | `'ss01' 1` |
 * | `--kbd-font-size` | `var(--code-small-500-font-size)` |
 * | `--kbd-font-variant-numeric` | `normal` |
 * | `--kbd-font-weight` | `var(--code-small-500-font-weight)` |
 * | `--kbd-foreground` | `var(--secondary-foreground)` |
 * | `--kbd-justify-content` | `center` |
 * | `--kbd-letter-spacing` | `var(--code-small-500-letter-spacing)` |
 * | `--kbd-line-height` | `var(--code-small-500-line-height)` |
 * | `--kbd-margin` | `var(--kbd-internal-margin, 0)` |
 * | `--kbd-position` | `relative` |
 * | `--kbd-press-offset` | `1px` |
 * | `--kbd-pressed-background` | `var(--secondary-background-hover)` |
 * | `--kbd-pressed-edge-width` | `1px` |
 * | `--kbd-shortcut-align-items` | `flex-start` |
 * | `--kbd-shortcut-block-display` | `flex` |
 * | `--kbd-shortcut-display` | `var(--kbd-shortcut-internal-display, inline-flex)` |
 * | `--kbd-shortcut-flex-shrink` | `0` |
 * | `--kbd-shortcut-gap` | `var(--spacing-1)` |
 * | `--kbd-shortcut-margin` | `var(--kbd-shortcut-internal-margin, 0)` |
 * | `--kbd-shortcut-position` | `relative` |
 * | `--kbd-shortcut-sequence-gap` | `var(--spacing-2)` |
 * | `--kbd-size` | `var(--spacing-10)` |
 * | `--kbd-small-screen-display` | `none` |
 * | `--kbd-text-transform` | `var(--code-small-500-text-transform)` |
 * | `--kbd-transition-duration` | `75ms` |
 * | `--kbd-transition-property` | `transform, border-block-end-width, background-c...` |
 * | `--kbd-transition-timing-function` | `ease` |
 * | `--kbd-user-select` | `none` |
 * | `--kbd-vertical-align` | `middle` |
 * | `--kbd-white-space` | `nowrap` |
 * | `--kbd-word-block-size` | `1px` |
 * | `--kbd-word-clip-path` | `inset(50%)` |
 * | `--kbd-word-inline-size` | `1px` |
 * | `--kbd-word-margin` | `-1px` |
 * | `--kbd-word-overflow` | `hidden` |
 * | `--kbd-word-padding` | `0` |
 * | `--kbd-word-position` | `absolute` |
 * | `--kbd-word-white-space` | `nowrap` |
 */
// #endregion css-tokens

export { Kbd } from './kbd.js';
export { KbdDisplay, KbdMode, KbdNamedKey } from './constants.js';
export type {
	KbdDisplayType,
	KbdKey,
	KbdMarginType,
	KbdModeType,
	KbdNamedKeyType,
	KbdProps,
	KbdShortcutProps,
} from './types.js';
