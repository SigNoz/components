// #region css-tokens
/**
 * CSS Tokens for announcement-banner
 * Prefix: `--announcement-banner-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--announcement-banner-body-gap` | `var(--spacing-4)` |
 * | `--announcement-banner-dismiss-padding` | `0` |
 * | `--announcement-banner-error-background` | `-` |
 * | `--announcement-banner-error-border` | `-` |
 * | `--announcement-banner-error-description` | `-` |
 * | `--announcement-banner-error-title` | `-` |
 * | `--announcement-banner-font-size` | `var(--label-base-500-font-size)` |
 * | `--announcement-banner-font-weight` | `var(--label-base-500-font-weight)` |
 * | `--announcement-banner-gap` | `var(--spacing-4)` |
 * | `--announcement-banner-height` | `calc(2rem) + var(--spacing-4)` |
 * | `--announcement-banner-letter-spacing` | `-0.065px` |
 * | `--announcement-banner-line-height` | `var(--label-base-500-line-height)` |
 * | `--announcement-banner-padding` | `var(--padding-2) var(--padding-4)` |
 * | `--announcement-banner-primary-background` | `-` |
 * | `--announcement-banner-primary-border` | `-` |
 * | `--announcement-banner-primary-description` | `-` |
 * | `--announcement-banner-primary-title` | `-` |
 * | `--announcement-banner-success-background` | `-` |
 * | `--announcement-banner-success-border` | `-` |
 * | `--announcement-banner-success-description` | `-` |
 * | `--announcement-banner-success-title` | `-` |
 * | `--announcement-banner-warning-background` | `-` |
 * | `--announcement-banner-warning-border` | `-` |
 * | `--announcement-banner-warning-description` | `-` |
 * | `--announcement-banner-warning-title` | `-` |
 */
// #endregion css-tokens

export {
	AnnouncementBanner,
	type AnnouncementBannerAction,
	type AnnouncementBannerProps,
	type AnnouncementBannerType,
} from './announcement-banner.js';
export {
	PersistedAnnouncementBanner,
	type PersistedAnnouncementBannerProps,
} from './presets/persisted-announcement-banner.js';
