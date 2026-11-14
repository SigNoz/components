// #region css-tokens
/**
 * CSS Tokens for skeleton
 * Prefix: `--skeleton-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--skeleton-active-animation-duration` | `1.4s` |
 * | `--skeleton-active-animation-iteration-count` | `infinite` |
 * | `--skeleton-active-animation-name` | `var(--skeleton-internal-animation-name)` |
 * | `--skeleton-active-animation-timing-function` | `ease` |
 * | `--skeleton-active-background-color` | `transparent` |
 * | `--skeleton-active-background-image` | `linear-gradient( 90deg, var(--skeleton-internal...` |
 * | `--skeleton-active-band-color` | `var(--skeleton-highlight)` |
 * | `--skeleton-active-overflow` | `hidden` |
 * | `--skeleton-active-position` | `relative` |
 * | `--skeleton-active-shimmer-inset-block` | `0` |
 * | `--skeleton-active-shimmer-position` | `absolute` |
 * | `--skeleton-avatar-circle-border-radius` | `50%` |
 * | `--skeleton-avatar-display` | `inline-block` |
 * | `--skeleton-avatar-flex-shrink` | `0` |
 * | `--skeleton-avatar-md-size` | `32px` |
 * | `--skeleton-avatar-sm-size` | `24px` |
 * | `--skeleton-avatar-square-border-radius` | `var(--radius-3)` |
 * | `--skeleton-avatar-vertical-align` | `middle` |
 * | `--skeleton-background` | `-` |
 * | `--skeleton-background-color` | `var(--skeleton-background)` |
 * | `--skeleton-border-radius` | `var(--radius-1)` |
 * | `--skeleton-button-display` | `inline-block` |
 * | `--skeleton-button-flex-shrink` | `1` |
 * | `--skeleton-button-max-width` | `var(--skeleton-internal-max-width, 100%)` |
 * | `--skeleton-button-md-height` | `32px` |
 * | `--skeleton-button-md-width` | `64px` |
 * | `--skeleton-button-min-width` | `min( var(--skeleton-internal-min-width-floor, v...` |
 * | `--skeleton-button-sm-height` | `24px` |
 * | `--skeleton-button-sm-width` | `48px` |
 * | `--skeleton-button-vertical-align` | `middle` |
 * | `--skeleton-button-width` | `var(--skeleton-internal-width, var(--skeleton-i...` |
 * | `--skeleton-display` | `flex` |
 * | `--skeleton-flex-direction` | `column` |
 * | `--skeleton-gap` | `var(--spacing-6)` |
 * | `--skeleton-highlight` | `-` |
 * | `--skeleton-input-display` | `block` |
 * | `--skeleton-input-intrinsic-width` | `200px` |
 * | `--skeleton-input-lg-height` | `40px` |
 * | `--skeleton-input-max-width` | `var(--skeleton-internal-max-width, 100%)` |
 * | `--skeleton-input-md-height` | `32px` |
 * | `--skeleton-input-sm-height` | `24px` |
 * | `--skeleton-input-width` | `var(--skeleton-internal-width, 100%)` |
 * | `--skeleton-max-width` | `var(--skeleton-internal-max-width, 100%)` |
 * | `--skeleton-paragraph-display` | `flex` |
 * | `--skeleton-paragraph-flex-direction` | `column` |
 * | `--skeleton-paragraph-gap` | `var(--spacing-4)` |
 * | `--skeleton-row-height` | `12px` |
 * | `--skeleton-row-max-width` | `100%` |
 * | `--skeleton-row-width` | `var(--skeleton-internal-row-width, 100%)` |
 * | `--skeleton-title-height` | `16px` |
 * | `--skeleton-title-max-width` | `100%` |
 * | `--skeleton-title-width` | `var(--skeleton-internal-title-width, 38%)` |
 * | `--skeleton-width` | `var(--skeleton-internal-width, 100%)` |
 */
// #endregion css-tokens

export { Skeleton } from './skeleton.js';
export { SkeletonAvatarShape, SkeletonInputSize, SkeletonSize } from './constants.js';
export type {
	SkeletonAvatarProps,
	SkeletonAvatarShapeType,
	SkeletonButtonProps,
	SkeletonInputProps,
	SkeletonInputSizeType,
	SkeletonParagraphConfig,
	SkeletonProps,
	SkeletonSizeType,
	SkeletonTitleConfig,
} from './types.js';
