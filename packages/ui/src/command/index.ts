// #region css-tokens
/**
 * CSS Tokens for command
 * Prefix: `--command-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--command-backdrop` | `-` |
 * | `--command-backdrop-color` | `var(--command-backdrop)` |
 * | `--command-backdrop-filter` | `blur(40px)` |
 * | `--command-backdrop-inset` | `0` |
 * | `--command-backdrop-position` | `fixed` |
 * | `--command-background` | `-` |
 * | `--command-background-color` | `var(--command-background)` |
 * | `--command-border` | `-` |
 * | `--command-border-color` | `var(--command-border)` |
 * | `--command-border-radius` | `var(--radius-2)` |
 * | `--command-border-style` | `solid` |
 * | `--command-border-width` | `1px` |
 * | `--command-box-shadow` | `var(--command-shadow)` |
 * | `--command-box-sizing` | `border-box` |
 * | `--command-display` | `flex` |
 * | `--command-empty-color` | `var(--command-empty-label)` |
 * | `--command-empty-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--command-empty-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--command-empty-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--command-empty-label` | `-` |
 * | `--command-empty-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--command-empty-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--command-empty-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--command-flex-direction` | `column` |
 * | `--command-focus-visible-outline` | `none` |
 * | `--command-group-display` | `flex` |
 * | `--command-group-flex-direction` | `column` |
 * | `--command-group-label` | `-` |
 * | `--command-group-label-align-items` | `center` |
 * | `--command-group-label-box-sizing` | `border-box` |
 * | `--command-group-label-color` | `var(--command-group-label)` |
 * | `--command-group-label-display` | `flex` |
 * | `--command-group-label-font-family` | `var(--uppercase-small-600-font-family)` |
 * | `--command-group-label-font-size` | `var(--uppercase-small-600-font-size)` |
 * | `--command-group-label-font-weight` | `var(--uppercase-small-600-font-weight)` |
 * | `--command-group-label-letter-spacing` | `var(--uppercase-small-600-letter-spacing)` |
 * | `--command-group-label-line-height` | `var(--uppercase-small-600-line-height)` |
 * | `--command-group-label-min-block-size` | `calc(var(--spacing-12) + var(--spacing-3))` |
 * | `--command-group-label-padding-block` | `var(--spacing-3)` |
 * | `--command-group-label-padding-inline` | `var(--spacing-6)` |
 * | `--command-group-label-text-transform` | `var(--uppercase-small-600-text-transform)` |
 * | `--command-group-label-user-select` | `none` |
 * | `--command-inline-size` | `100%` |
 * | `--command-inset-block-start` | `110px` |
 * | `--command-inset-inline` | `0` |
 * | `--command-item-affix-align-items` | `center` |
 * | `--command-item-affix-block-size` | `var(--command-item-line-height, var(--paragraph...` |
 * | `--command-item-affix-display` | `inline-grid` |
 * | `--command-item-affix-flex-shrink` | `0` |
 * | `--command-item-affix-justify-content` | `center` |
 * | `--command-item-align-items` | `flex-start` |
 * | `--command-item-background` | `-` |
 * | `--command-item-background-color` | `var(--command-item-background)` |
 * | `--command-item-background-hover` | `-` |
 * | `--command-item-border` | `none` |
 * | `--command-item-border-radius` | `0` |
 * | `--command-item-box-sizing` | `border-box` |
 * | `--command-item-color` | `var(--command-item-label)` |
 * | `--command-item-cursor` | `pointer` |
 * | `--command-item-disabled-color` | `var(--command-item-label-disabled)` |
 * | `--command-item-disabled-cursor` | `not-allowed` |
 * | `--command-item-display` | `flex` |
 * | `--command-item-focus-outline` | `none` |
 * | `--command-item-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--command-item-font-size` | `var(--label-base-400-font-size)` |
 * | `--command-item-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--command-item-gap` | `var(--spacing-2)` |
 * | `--command-item-highlighted-background-color` | `var(--command-item-background-hover)` |
 * | `--command-item-highlighted-color` | `var(--command-item-label-hover)` |
 * | `--command-item-highlighted-icon-color` | `var(--command-item-icon-hover)` |
 * | `--command-item-icon` | `-` |
 * | `--command-item-icon-color` | `var(--command-item-icon)` |
 * | `--command-item-icon-hover` | `-` |
 * | `--command-item-icon-size` | `14px` |
 * | `--command-item-inline-size` | `100%` |
 * | `--command-item-label` | `-` |
 * | `--command-item-label-disabled` | `-` |
 * | `--command-item-label-flex-grow` | `1` |
 * | `--command-item-label-hover` | `-` |
 * | `--command-item-label-min-inline-size` | `0` |
 * | `--command-item-label-overflow-wrap` | `anywhere` |
 * | `--command-item-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--command-item-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--command-item-loading-opacity` | `0.8` |
 * | `--command-item-margin` | `0` |
 * | `--command-item-padding` | `var(--spacing-4) var(--spacing-6)` |
 * | `--command-item-slot-gap` | `var(--spacing-4)` |
 * | `--command-item-text-align` | `start` |
 * | `--command-item-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--command-item-user-select` | `none` |
 * | `--command-layer-position` | `relative` |
 * | `--command-list-display` | `flex` |
 * | `--command-list-flex-direction` | `column` |
 * | `--command-list-focus-visible-outline` | `none` |
 * | `--command-margin-block` | `0` |
 * | `--command-margin-inline` | `auto` |
 * | `--command-max-block-size` | `calc(100dvh - var(--command-inset-block-start, ...` |
 * | `--command-max-inline-size` | `var(--command-internal-max-inline-size, 32rem)` |
 * | `--command-overflow` | `hidden` |
 * | `--command-padding-block` | `0` |
 * | `--command-padding-inline` | `0` |
 * | `--command-position` | `fixed` |
 * | `--command-scroll-fade-size` | `var(--spacing-10)` |
 * | `--command-search-affix-align-items` | `center` |
 * | `--command-search-affix-display` | `inline-grid` |
 * | `--command-search-affix-flex-shrink` | `0` |
 * | `--command-search-affix-justify-content` | `center` |
 * | `--command-search-align-items` | `center` |
 * | `--command-search-border` | `-` |
 * | `--command-search-border-color` | `var(--command-search-border)` |
 * | `--command-search-border-style` | `solid` |
 * | `--command-search-border-width` | `1px` |
 * | `--command-search-display` | `flex` |
 * | `--command-search-flex-shrink` | `0` |
 * | `--command-search-gap` | `var(--spacing-4)` |
 * | `--command-search-icon` | `-` |
 * | `--command-search-icon-color` | `var(--command-search-icon)` |
 * | `--command-search-input-background-color` | `transparent` |
 * | `--command-search-input-border` | `none` |
 * | `--command-search-input-flex-grow` | `1` |
 * | `--command-search-input-focus-visible-outline` | `none` |
 * | `--command-search-input-font-family` | `var(--label-base-400-font-family)` |
 * | `--command-search-input-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--command-search-input-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--command-search-input-line-height` | `var(--label-base-400-line-height)` |
 * | `--command-search-input-margin` | `0` |
 * | `--command-search-input-min-block-size` | `var(--spacing-10)` |
 * | `--command-search-input-min-inline-size` | `0` |
 * | `--command-search-input-padding` | `0` |
 * | `--command-search-input-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--command-search-padding` | `var(--spacing-5) var(--spacing-6)` |
 * | `--command-search-placeholder` | `-` |
 * | `--command-search-placeholder-color` | `var(--command-search-placeholder)` |
 * | `--command-shadow` | `-` |
 * | `--command-viewport-display` | `flex` |
 * | `--command-viewport-flex-direction` | `column` |
 * | `--command-viewport-max-block-size` | `var(--command-internal-max-block-size, 20rem)` |
 * | `--command-viewport-min-block-size` | `0` |
 * | `--command-viewport-overflow-x` | `hidden` |
 * | `--command-viewport-overflow-y` | `auto` |
 * | `--command-viewport-overscroll-behavior` | `contain` |
 * | `--command-viewport-scroll-padding-block` | `var(--command-scroll-fade-size, var(--spacing-10))` |
 * | `--command-viewport-scrollbar-width` | `thin` |
 * | `--command-visually-hidden-block-size` | `1px` |
 * | `--command-visually-hidden-border` | `0` |
 * | `--command-visually-hidden-clip-path` | `inset(50%)` |
 * | `--command-visually-hidden-inline-size` | `1px` |
 * | `--command-visually-hidden-margin` | `-1px` |
 * | `--command-visually-hidden-overflow` | `hidden` |
 * | `--command-visually-hidden-padding` | `0` |
 * | `--command-visually-hidden-position` | `absolute` |
 * | `--command-visually-hidden-white-space` | `nowrap` |
 * | `--command-z-index` | `50` |
 */
// #endregion css-tokens

export { Command } from './command.js';
export { COMMAND_EMPTY_CONTENT, COMMAND_EMPTY_LABEL, CommandItemKind } from './constants.js';
export type {
	CommandActionItemType,
	CommandGroupItemType,
	CommandItemDisabledType,
	CommandItemKindType,
	CommandItemLoadingType,
	CommandItemType,
	CommandProps,
	CommandSearchInputProps,
	ValidateCommandProps,
} from './types.js';
