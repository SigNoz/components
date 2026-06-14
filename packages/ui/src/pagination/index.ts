// #region css-tokens
/**
 * CSS Tokens for pagination
 * Prefix: `--pagination-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--pagination-button-height` | `2.25rem` |
 * | `--pagination-content-gap` | `var(--spacing-5, 0.625rem)` |
 * | `--pagination-ellipsis-height` | `2.25rem` |
 * | `--pagination-ellipsis-width` | `2.25rem` |
 * | `--pagination-link-min-width` | `2.25rem` |
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
