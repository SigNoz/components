// #region css-tokens
/**
 * CSS Tokens for pagination
 * Prefix: `--pagination-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--pagination-button-height` | `2.25rem` |
 * | `--pagination-content-gap` | `var(--spacing-5)` |
 * | `--pagination-ellipsis-height` | `2.25rem` |
 * | `--pagination-ellipsis-width` | `2.25rem` |
 * | `--pagination-link-min-width` | `2.25rem` |
 * | `--pagination-page-size-label-font-family` | `var(--label-base-400-font-family)` |
 * | `--pagination-page-size-label-font-size` | `var(--label-base-400-font-size)` |
 * | `--pagination-page-size-label-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--pagination-page-size-label-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--pagination-page-size-label-line-height` | `var(--label-base-400-line-height)` |
 * | `--pagination-page-size-label-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--pagination-total-font-family` | `var(--label-base-400-font-family)` |
 * | `--pagination-total-font-size` | `var(--label-base-400-font-size)` |
 * | `--pagination-total-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--pagination-total-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--pagination-total-line-height` | `var(--label-base-400-line-height)` |
 * | `--pagination-total-text-transform` | `var(--label-base-400-text-transform)` |
 */
// #endregion css-tokens

export {
	Pagination,
	type PaginationAlign,
	PaginationContainer,
	type PaginationContainerProps,
	PaginationContent,
	type PaginationContentProps,
	PaginationEllipsis,
	type PaginationEllipsisProps,
	PaginationItem,
	type PaginationItemProps,
	PaginationLink,
	type PaginationLinkProps,
	type PaginationNavProps,
	PaginationNext,
	PaginationPrevious,
	type PaginationProps,
	PaginationSelector,
	type PaginationSelectorProps,
} from './pagination.js';
export { PaginationUrl, type PaginationUrlProps } from './presets/pagination-url.js';
