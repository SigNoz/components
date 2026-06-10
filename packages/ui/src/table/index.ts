// #region css-tokens
/**
 * CSS Tokens for table
 * Prefix: `--table-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--table-animate-fast-spin` | `table-fast-spin 0.7s linear infinite` |
 * | `--table-border-color` | `var(--border)` |
 * | `--table-caption-margin-top` | `var(--spacing-4, 1rem)` |
 * | `--table-cell-padding` | `var(--spacing-4, 0.5rem)` |
 * | `--table-cell-padding-x` | `var(--spacing-6, 0.75rem)` |
 * | `--table-cell-padding-y` | `var(--spacing-6, 0.75rem)` |
 * | `--table-head-height` | `2.5rem` |
 * | `--table-header-bg` | `var(--l1-background)` |
 * | `--table-header-fg` | `var(--foreground)` |
 * | `--table-header-shadow` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rg...` |
 * | `--table-radius` | `calc(var(--radius) - 2px)` |
 */
// #endregion css-tokens

export type {
	Cell,
	ColumnDef,
	ColumnFiltersState,
	ColumnOrderState,
	ColumnPinningState,
	ExpandedState,
	HeaderGroup,
	Row,
	RowSelectionState,
	SortingState,
	VisibilityState,
} from '@tanstack/react-table';
export type * from './data-table.js';
export { DataTable, SelectionMode } from './data-table.js';
export type * from './table.js';
export {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from './table.js';
