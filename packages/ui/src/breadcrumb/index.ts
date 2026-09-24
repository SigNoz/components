// #region css-tokens
/**
 * CSS Tokens for breadcrumb
 * Prefix: `--breadcrumb-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--breadcrumb-background-hover` | `-` |
 * | `--breadcrumb-dropdown-align-items` | `center` |
 * | `--breadcrumb-dropdown-appearance` | `none` |
 * | `--breadcrumb-dropdown-background-color` | `transparent` |
 * | `--breadcrumb-dropdown-border` | `none` |
 * | `--breadcrumb-dropdown-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--breadcrumb-dropdown-color` | `var(--breadcrumb-label)` |
 * | `--breadcrumb-dropdown-cursor` | `pointer` |
 * | `--breadcrumb-dropdown-display` | `inline-flex` |
 * | `--breadcrumb-dropdown-font` | `inherit` |
 * | `--breadcrumb-dropdown-gap` | `var(--spacing-2, 4px)` |
 * | `--breadcrumb-dropdown-hover-background-color` | `var(--breadcrumb-background-hover)` |
 * | `--breadcrumb-dropdown-hover-color` | `var(--breadcrumb-label-hover)` |
 * | `--breadcrumb-dropdown-icon-flex-shrink` | `0` |
 * | `--breadcrumb-dropdown-icon-open-transform` | `rotate(180deg)` |
 * | `--breadcrumb-dropdown-icon-transition` | `transform 0.15s ease-in-out` |
 * | `--breadcrumb-dropdown-padding` | `var(--spacing-2, 4px) var(--spacing-1, 2px)` |
 * | `--breadcrumb-dropdown-transition` | `color 0.15s ease-in-out, background-color 0.15s...` |
 * | `--breadcrumb-ellipsis-align-items` | `center` |
 * | `--breadcrumb-ellipsis-color` | `var(--breadcrumb-label)` |
 * | `--breadcrumb-ellipsis-cursor` | `default` |
 * | `--breadcrumb-ellipsis-display` | `inline-flex` |
 * | `--breadcrumb-ellipsis-height` | `1.5rem` |
 * | `--breadcrumb-ellipsis-justify-content` | `center` |
 * | `--breadcrumb-ellipsis-width` | `1.5rem` |
 * | `--breadcrumb-focus-ring` | `-` |
 * | `--breadcrumb-icon-align-items` | `center` |
 * | `--breadcrumb-icon-display` | `inline-flex` |
 * | `--breadcrumb-icon-flex-shrink` | `0` |
 * | `--breadcrumb-icon-svg-height` | `1rem` |
 * | `--breadcrumb-icon-svg-width` | `1rem` |
 * | `--breadcrumb-item-align-items` | `center` |
 * | `--breadcrumb-item-display` | `inline-flex` |
 * | `--breadcrumb-item-gap` | `var(--spacing-3, 6px)` |
 * | `--breadcrumb-label` | `-` |
 * | `--breadcrumb-label-hover` | `-` |
 * | `--breadcrumb-link-align-items` | `center` |
 * | `--breadcrumb-link-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--breadcrumb-link-color` | `var(--breadcrumb-label)` |
 * | `--breadcrumb-link-cursor` | `pointer` |
 * | `--breadcrumb-link-display` | `inline-flex` |
 * | `--breadcrumb-link-focus-visible-border-radius` | `2px` |
 * | `--breadcrumb-link-focus-visible-outline` | `2px solid var(--breadcrumb-focus-ring)` |
 * | `--breadcrumb-link-focus-visible-outline-offset` | `2px` |
 * | `--breadcrumb-link-gap` | `var(--spacing-2, 4px)` |
 * | `--breadcrumb-link-hover-background-color` | `var(--breadcrumb-background-hover)` |
 * | `--breadcrumb-link-hover-color` | `var(--breadcrumb-label-hover)` |
 * | `--breadcrumb-link-padding` | `var(--spacing-2, 4px) var(--spacing-1, 2px)` |
 * | `--breadcrumb-link-text-decoration` | `none` |
 * | `--breadcrumb-link-transition` | `color 0.15s ease-in-out, background-color 0.15s...` |
 * | `--breadcrumb-list-align-items` | `center` |
 * | `--breadcrumb-list-display` | `flex` |
 * | `--breadcrumb-list-flex-wrap` | `wrap` |
 * | `--breadcrumb-list-gap` | `var(--spacing-4, 8px)` |
 * | `--breadcrumb-list-list-style` | `none` |
 * | `--breadcrumb-list-margin` | `0` |
 * | `--breadcrumb-list-padding` | `0` |
 * | `--breadcrumb-page-align-items` | `center` |
 * | `--breadcrumb-page-color` | `var(--breadcrumb-label)` |
 * | `--breadcrumb-page-cursor` | `default` |
 * | `--breadcrumb-page-display` | `inline-flex` |
 * | `--breadcrumb-page-font-weight` | `400` |
 * | `--breadcrumb-page-gap` | `var(--spacing-2, 4px)` |
 * | `--breadcrumb-root-align-items` | `center` |
 * | `--breadcrumb-root-color` | `var(--breadcrumb-label)` |
 * | `--breadcrumb-root-display` | `flex` |
 * | `--breadcrumb-root-flex-wrap` | `wrap` |
 * | `--breadcrumb-root-font-size` | `var(--periscope-font-size-base, 13px)` |
 * | `--breadcrumb-root-line-height` | `var(--line-height-20, 20px)` |
 * | `--breadcrumb-separator-align-items` | `center` |
 * | `--breadcrumb-separator-color` | `var(--breadcrumb-label)` |
 * | `--breadcrumb-separator-display` | `inline-flex` |
 * | `--breadcrumb-separator-justify-content` | `center` |
 * | `--breadcrumb-separator-svg-flex-shrink` | `0` |
 * | `--breadcrumb-sr-only-border-width` | `0` |
 * | `--breadcrumb-sr-only-clip` | `rect(0, 0, 0, 0)` |
 * | `--breadcrumb-sr-only-height` | `1px` |
 * | `--breadcrumb-sr-only-margin` | `-1px` |
 * | `--breadcrumb-sr-only-overflow` | `hidden` |
 * | `--breadcrumb-sr-only-padding` | `0` |
 * | `--breadcrumb-sr-only-position` | `absolute` |
 * | `--breadcrumb-sr-only-white-space` | `nowrap` |
 * | `--breadcrumb-sr-only-width` | `1px` |
 */
// #endregion css-tokens

export {
	Breadcrumb,
	BreadcrumbDropdown,
	type BreadcrumbDropdownItem,
	type BreadcrumbDropdownProps,
	BreadcrumbEllipsis,
	type BreadcrumbEllipsisProps,
	BreadcrumbItem,
	type BreadcrumbItemProps,
	type BreadcrumbItemType,
	BreadcrumbLink,
	type BreadcrumbLinkProps,
	BreadcrumbList,
	type BreadcrumbListProps,
	BreadcrumbPage,
	type BreadcrumbPageProps,
	type BreadcrumbProps,
	BreadcrumbSeparator,
	type BreadcrumbSeparatorProps,
	BreadcrumbSimple,
	type BreadcrumbSimpleProps,
} from './subcomponents/index.js';
