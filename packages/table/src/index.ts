// Basic Table components
export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
} from './table';

// Advanced DataTable component
export { DataTable, SelectionMode } from './data-table';
export type { SelectionModeType } from './data-table';

// Export DataTable props type for external use
export type { DataTableProps } from './data-table';

// Re-export commonly used TanStack Table types
export type {
	ColumnDef,
	Row,
	HeaderGroup,
	Cell,
	SortingState,
	ColumnFiltersState,
	ColumnOrderState,
	ColumnPinningState,
	RowSelectionState,
	ExpandedState,
	VisibilityState,
} from '@tanstack/react-table';
