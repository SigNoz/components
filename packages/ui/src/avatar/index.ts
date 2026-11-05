// #region css-tokens
/**
 * CSS Tokens for avatar
 * Prefix: `--avatar-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--avatar-align-items` | `center` |
 * | `--avatar-archive-background` | `-` |
 * | `--avatar-archive-background-color` | `var(--avatar-archive-background)` |
 * | `--avatar-archive-color` | `var(--avatar-archive-foreground)` |
 * | `--avatar-archive-foreground` | `-` |
 * | `--avatar-circle-border-radius` | `var(--radius-round)` |
 * | `--avatar-danger-background` | `-` |
 * | `--avatar-danger-background-color` | `var(--avatar-danger-background)` |
 * | `--avatar-danger-color` | `var(--avatar-danger-foreground)` |
 * | `--avatar-danger-foreground` | `-` |
 * | `--avatar-display` | `inline-flex` |
 * | `--avatar-fallback-align-items` | `center` |
 * | `--avatar-fallback-display` | `flex` |
 * | `--avatar-fallback-height` | `100%` |
 * | `--avatar-fallback-justify-content` | `center` |
 * | `--avatar-fallback-width` | `100%` |
 * | `--avatar-flex-shrink` | `0` |
 * | `--avatar-font-family` | `var(--avatar-internal-font-family)` |
 * | `--avatar-font-style` | `normal` |
 * | `--avatar-font-weight` | `var(--avatar-internal-font-weight)` |
 * | `--avatar-highlight-danger-background` | `-` |
 * | `--avatar-highlight-danger-background-color` | `var(--avatar-highlight-danger-background)` |
 * | `--avatar-highlight-danger-color` | `var(--avatar-highlight-danger-foreground)` |
 * | `--avatar-highlight-danger-foreground` | `-` |
 * | `--avatar-image-height` | `100%` |
 * | `--avatar-image-inset` | `0` |
 * | `--avatar-image-loading-opacity` | `0` |
 * | `--avatar-image-object-fit` | `cover` |
 * | `--avatar-image-object-position` | `center` |
 * | `--avatar-image-opacity` | `1` |
 * | `--avatar-image-position` | `absolute` |
 * | `--avatar-image-width` | `100%` |
 * | `--avatar-info-background` | `-` |
 * | `--avatar-info-background-color` | `var(--avatar-info-background)` |
 * | `--avatar-info-color` | `var(--avatar-info-foreground)` |
 * | `--avatar-info-foreground` | `-` |
 * | `--avatar-initials-text-box` | `trim-both cap alphabetic` |
 * | `--avatar-justify-content` | `center` |
 * | `--avatar-letter-spacing` | `var(--avatar-internal-letter-spacing)` |
 * | `--avatar-line-height` | `var(--avatar-internal-line-height)` |
 * | `--avatar-md-font-size` | `var(--label-base-500-font-size)` |
 * | `--avatar-md-size` | `32px` |
 * | `--avatar-overflow` | `hidden` |
 * | `--avatar-position` | `relative` |
 * | `--avatar-primary-background` | `-` |
 * | `--avatar-primary-background-color` | `var(--avatar-primary-background)` |
 * | `--avatar-primary-color` | `var(--avatar-primary-foreground)` |
 * | `--avatar-primary-foreground` | `-` |
 * | `--avatar-secondary-background` | `-` |
 * | `--avatar-secondary-background-color` | `var(--avatar-secondary-background)` |
 * | `--avatar-secondary-color` | `var(--avatar-secondary-foreground)` |
 * | `--avatar-secondary-foreground` | `-` |
 * | `--avatar-sm-font-size` | `var(--label-small-500-font-size)` |
 * | `--avatar-sm-size` | `24px` |
 * | `--avatar-square-border-radius` | `var(--radius-3)` |
 * | `--avatar-success-background` | `-` |
 * | `--avatar-success-background-color` | `var(--avatar-success-background)` |
 * | `--avatar-success-color` | `var(--avatar-success-foreground)` |
 * | `--avatar-success-foreground` | `-` |
 * | `--avatar-text-transform` | `var(--avatar-internal-text-transform)` |
 * | `--avatar-user-select` | `none` |
 * | `--avatar-vertical-align` | `middle` |
 * | `--avatar-warning-background` | `-` |
 * | `--avatar-warning-background-color` | `var(--avatar-warning-background)` |
 * | `--avatar-warning-color` | `var(--avatar-warning-foreground)` |
 * | `--avatar-warning-foreground` | `-` |
 */
// #endregion css-tokens

export { Avatar } from './avatar.js';
export { AvatarColor, AvatarImageStatus, AvatarShape, AvatarSize } from './constants.js';
export type {
	AvatarColorType,
	AvatarImageStatusType,
	AvatarProps,
	AvatarShapeType,
	AvatarSizeType,
} from './types.js';
