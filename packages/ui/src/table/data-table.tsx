import {
	ArrowUpDown,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	ChevronUp,
	Filter,
	GripVertical,
	LoaderCircle,
	Pin,
	PinOff,
	Search,
	X,
} from '@signozhq/icons';
import {
	type Cell,
	type Column,
	type ColumnDef,
	type ColumnFiltersState,
	type ColumnOrderState,
	type ColumnPinningState,
	type ExpandedState,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type HeaderGroup,
	type Table as ReactTable,
	type Row,
	type RowSelectionState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from '@tanstack/react-table';
import { useVirtualizer, type Virtualizer } from '@tanstack/react-virtual';
import throttle from 'lodash-es/throttle';
import * as React from 'react';
import { Button } from '../button/index.js';
import { Input } from '../input/index.js';
import { cn } from '../lib/utils.js';
import styles from './data-table.module.scss';
import {
	getTablePreferences,
	saveTablePreferences,
	type TablePreferences,
} from './lib/preferences.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table.js';

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	tableId: string;
	initialColumnOrder?: string[];
	// Callback when the column order changes. Returns the reordered columns array
	onColumnOrderChange?: (orderedColumns: ColumnDef<TData, TValue>[]) => void;
	enableColumnReordering?: boolean;
	enableColumnResizing?: boolean;
	enableSorting?: boolean;
	enableFiltering?: boolean;
	enableGlobalFilter?: boolean;
	enableColumnPinning?: boolean;
	defaultColumnWidth?: number;
	minColumnWidth?: number;
	maxColumnWidth?: number;
	enableRowSelection?: boolean;
	selectionMode?: SelectionModeType;
	onRowSelectionChange?: (selectedRows: TData[]) => void;
	enableRowExpansion?: boolean;
	renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
	initialExpanded?: ExpandedState;
	onExpandedChange?: (expanded: ExpandedState) => void;
	getRowCanExpand?: (row: Row<TData>) => boolean;
	expandOnRowClick?: boolean;
	renderRow?: (props: { row: Row<TData>; children: React.ReactNode }) => React.ReactNode;
	onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void;
	onRowDoubleClick?: (row: Row<TData>, event: React.MouseEvent) => void;
	onCellClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
	onCellDoubleClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
	stopPropagationOnRowClick?: boolean;
	stopPropagationOnCellClick?: boolean;
	enableScrollRestoration?: boolean;
	enableDynamicRowHeights?: boolean;
	rowHeight?: number;
	onScroll?: (scrollPosition: { top: number; left: number }) => void;
	enablePagination?: boolean;
	pageSize?: number;
	pageSizeOptions?: number[];
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (pageSize: number) => void;
	serverSidePagination?: boolean;
	totalCount?: number;
	isLoading?: boolean;
	onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
	enableInfiniteScroll?: boolean;
	hasMore?: boolean;
	onLoadMore?: () => void;
	loadingMore?: boolean;
	// Virtualization props
	enableVirtualization?: boolean;
	estimateRowSize?: number;
	overscan?: number;
	onVirtualizerChange?: (virtualizer: Virtualizer<HTMLDivElement, Element>) => void;
	virtualizerRef?: React.MutableRefObject<Virtualizer<HTMLDivElement, Element> | undefined>;
	// Scroll to index functionality
	scrollToIndexRef?: React.MutableRefObject<
		((rowIndex: number, options?: { align?: 'start' | 'center' | 'end' }) => void) | undefined
	>;
	// Header visibility prop
	showHeaders?: boolean;
	// Sticky headers prop
	enableStickyHeaders?: boolean;
	// Fixed height for table container
	fixedHeight?: string | number;
	testId?: string;
}

export enum SelectionMode {
	Single = 'single',
	Multiple = 'multiple',
}

export type SelectionModeType = SelectionMode.Single | SelectionMode.Multiple;

// Virtualized Table Body Component
function VirtualizedTableBody<TData>({
	table,
	virtualizer,
	enableRowSelection,
	enableRowExpansion,
	enableDynamicRowHeights,
	onRowClick,
	onRowDoubleClick,
	onCellClick,
	onCellDoubleClick,
	stopPropagationOnRowClick,
	stopPropagationOnCellClick,
	expandOnRowClick,
	renderSubComponent,
	sentinelRef,
}: {
	table: ReactTable<TData>;
	virtualizer: Virtualizer<HTMLDivElement, Element>;
	enableRowSelection?: boolean;
	enableRowExpansion?: boolean;
	enableDynamicRowHeights?: boolean;
	onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void;
	onRowDoubleClick?: (row: Row<TData>, event: React.MouseEvent) => void;
	onCellClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
	onCellDoubleClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
	stopPropagationOnRowClick?: boolean;
	stopPropagationOnCellClick?: boolean;
	expandOnRowClick?: boolean;
	renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
	sentinelRef?: React.RefObject<HTMLDivElement>;
}): JSX.Element {
	const { rows } = table.getRowModel();
	const leafColumns = table.getAllLeafColumns();

	const virtualItems = virtualizer.getVirtualItems();
	const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
	const paddingBottom =
		virtualItems.length > 0
			? virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
			: 0;

	const spacerColSpan =
		table.getAllLeafColumns().length + (enableRowSelection ? 1 : 0) + (enableRowExpansion ? 1 : 0);

	return (
		<TableBody>
			{paddingTop > 0 && (
				<TableRow>
					<TableCell colSpan={spacerColSpan} style={{ height: `${paddingTop}px` }} />
				</TableRow>
			)}
			{virtualItems.map((virtualRow) => {
				const row = rows[virtualRow.index];
				if (!row) return null;

				return (
					<React.Fragment key={virtualRow.key}>
						<TableRow
							data-index={virtualRow.index}
							ref={enableDynamicRowHeights ? virtualizer.measureElement : undefined}
							className={cn(
								row.getIsSelected() && styles['data-table__row_selected'],
								styles['data-table__row_clickable'],
								enableRowExpansion && row.getCanExpand() && styles['data-table__row_expandable']
							)}
							onClick={(e) => {
								if (stopPropagationOnRowClick) {
									e.stopPropagation();
								}
								if (enableRowSelection) {
									row.toggleSelected();
								}
								if (enableRowExpansion && expandOnRowClick && row.getCanExpand()) {
									row.toggleExpanded();
								}
								onRowClick?.(row, e);
							}}
							onDoubleClick={(e) => {
								if (stopPropagationOnRowClick) {
									e.stopPropagation();
								}
								onRowDoubleClick?.(row, e);
							}}
							aria-selected={row.getIsSelected()}
							tabIndex={0}
							onKeyDown={(e) => {
								if (enableRowSelection && (e.key === ' ' || e.key === 'Enter')) {
									e.preventDefault();
									row.toggleSelected();
								}
								if (
									enableRowExpansion &&
									(e.key === ' ' || e.key === 'Enter') &&
									row.getCanExpand()
								) {
									e.preventDefault();
									row.toggleExpanded();
								}
							}}
						>
							{enableRowSelection && (
								<TableCell className={styles['data-table__action-cell']}>
									<input
										type="checkbox"
										aria-label={`Select row ${row.id}`}
										checked={row.getIsSelected()}
										onChange={row.getToggleSelectedHandler()}
										onClick={(e) => e.stopPropagation()}
										className={styles['data-table__checkbox']}
										tabIndex={0}
									/>
								</TableCell>
							)}
							{enableRowExpansion && (
								<TableCell className={styles['data-table__action-cell']}>
									{row.getCanExpand() && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												row.toggleExpanded();
											}}
											className={cn(
												styles['data-table__expand-button'],
												row.getIsExpanded() && styles['data-table__expand-button_expanded']
											)}
										>
											<ChevronRight className={styles['data-table__expand-icon']} />
										</button>
									)}
								</TableCell>
							)}
							{row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
								const isPinned = cell.column.getIsPinned();
								// compute offsets for pinned cells
								let leftOffset = 0;
								let rightOffset = 0;
								if (isPinned === 'left') {
									for (const c of leafColumns) {
										if (c.getIsPinned() === 'left') {
											if (c.id === cell.column.id) break;
											leftOffset += c.getSize();
										}
									}
								} else if (isPinned === 'right') {
									for (let i = leafColumns.length - 1; i >= 0; i -= 1) {
										const c = leafColumns[i];
										if (c.getIsPinned() === 'right') {
											if (c.id === cell.column.id) break;
											rightOffset += c.getSize();
										}
									}
								}
								return (
									<TableCell
										key={cell.id}
										style={{
											width: cell.column.getSize(),
											...(isPinned === 'left' ? { left: leftOffset } : {}),
											...(isPinned === 'right' ? { right: rightOffset } : {}),
										}}
										className={cn(
											isPinned === 'left' && styles['data-table__cell_pinned-left'],
											isPinned === 'right' && styles['data-table__cell_pinned-right']
										)}
										onClick={(e) => {
											if (stopPropagationOnCellClick) {
												e.stopPropagation();
											}
											onCellClick?.(cell, e);
										}}
										onDoubleClick={(e) => {
											if (stopPropagationOnCellClick) {
												e.stopPropagation();
											}
											onCellDoubleClick?.(cell, e);
										}}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								);
							})}
						</TableRow>
						{enableRowExpansion && row.getIsExpanded() && renderSubComponent && (
							<TableRow>
								<TableCell
									colSpan={
										row.getVisibleCells().length +
										(enableRowSelection ? 1 : 0) +
										(enableRowExpansion ? 1 : 0)
									}
									className={styles['data-table__sub-row']}
								>
									{renderSubComponent({ row })}
								</TableCell>
							</TableRow>
						)}
					</React.Fragment>
				);
			})}
			{paddingBottom > 0 && (
				<TableRow>
					<TableCell colSpan={spacerColSpan} style={{ height: `${paddingBottom}px` }} />
				</TableRow>
			)}
			{sentinelRef && (
				<TableRow role="presentation">
					<TableCell colSpan={spacerColSpan}>
						<div ref={sentinelRef} style={{ height: 1 }} />
					</TableCell>
				</TableRow>
			)}
		</TableBody>
	);
}

const AnimatedRow = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement> & {
		isExpanded: boolean;
	}
>(({ isExpanded, children, ...props }, ref) => {
	return (
		<TableRow
			ref={ref}
			{...props}
			className={cn(
				props.className,
				styles['data-table__animated-row'],
				!isExpanded && styles['data-table__animated-row_collapsed']
			)}
		>
			{children}
		</TableRow>
	);
});
AnimatedRow.displayName = 'AnimatedRow';

export function DataTable<TData, TValue>({
	columns,
	data,
	tableId,
	initialColumnOrder,
	onColumnOrderChange,
	enableColumnResizing = true,
	enableSorting = true,
	enableFiltering = true,
	enableGlobalFilter = false,
	enableColumnReordering = true,
	enableColumnPinning = true,
	defaultColumnWidth = 150,
	minColumnWidth = 50,
	maxColumnWidth = 500,
	enableRowSelection = false,
	selectionMode = SelectionMode.Multiple,
	onRowSelectionChange,
	enableRowExpansion = false,
	renderSubComponent,
	initialExpanded = {},
	onExpandedChange,
	getRowCanExpand,
	expandOnRowClick = false,
	renderRow,
	onRowClick,
	onRowDoubleClick,
	onCellClick,
	onCellDoubleClick,
	stopPropagationOnRowClick = false,
	stopPropagationOnCellClick = false,
	enableScrollRestoration = true,
	enableDynamicRowHeights = false,
	rowHeight = 40,
	onScroll,
	enablePagination = false,
	pageSize = 10,
	pageSizeOptions = [10, 20, 30, 40, 50],
	onPageChange,
	onPageSizeChange,
	serverSidePagination = false,
	totalCount = 0,
	isLoading = false,
	onPaginationChange,
	enableInfiniteScroll = false,
	hasMore = false,
	onLoadMore,
	loadingMore = false,
	// Virtualization props
	enableVirtualization = false,
	estimateRowSize = 40,
	overscan = 5,
	onVirtualizerChange,
	virtualizerRef,
	// Scroll to index functionality
	scrollToIndexRef,
	// Header visibility prop
	showHeaders = true,
	// Sticky headers prop
	enableStickyHeaders = false,
	// Fixed height for table container
	fixedHeight,
	testId,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);
	const [columnSizing, setColumnSizing] = React.useState<Record<string, number>>({});
	const [draggedColumn, setDraggedColumn] = React.useState<string | null>(null);
	const [dropTarget, setDropTarget] = React.useState<string | null>(null);
	const [isResizing, setIsResizing] = React.useState(false);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = React.useState('');
	const [visibleFilters, setVisibleFilters] = React.useState<Set<string>>(new Set());
	const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({});
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
	const [expanded, setExpanded] = React.useState<ExpandedState>(initialExpanded);
	const [scrollPosition, setScrollPosition] = React.useState({
		top: 0,
		left: 0,
	});
	const tableRef = React.useRef<HTMLDivElement>(null);
	const sentinelRef = React.useRef<HTMLDivElement>(null);
	const isInitialMount = React.useRef(true);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: pageSize,
	});

	// Helper to resolve column id consistently
	const resolveColumnId = React.useCallback(
		(column: ColumnDef<TData, TValue>, index: number): string => {
			const explicitId = (column as { id?: string }).id;
			const accessorKey =
				'accessorKey' in column ? (column as { accessorKey?: string }).accessorKey : undefined;
			return explicitId ?? (accessorKey as string | undefined) ?? `column-${index}`;
		},
		[]
	);

	// Map of columnId -> ColumnDef for quick reordering lookups
	const columnsById = React.useMemo(() => {
		const map = new Map<string, ColumnDef<TData, TValue>>();
		columns.forEach((col, idx) => {
			const id = resolveColumnId(col, idx);
			map.set(id, col);
		});
		return map;
	}, [columns, resolveColumnId]);

	const getOrderedColumns = React.useCallback(
		(order: string[]): ColumnDef<TData, TValue>[] => {
			return order.map((id) => columnsById.get(id)).filter(Boolean) as ColumnDef<TData, TValue>[];
		},
		[columnsById]
	);

	// Initialise Column Order Array
	React.useEffect(() => {
		const defaultOrder = columns.map((column, index) => resolveColumnId(column, index));
		setColumnOrder(initialColumnOrder || defaultOrder);
	}, [columns, initialColumnOrder, resolveColumnId]);

	// Load preferences on mount
	React.useEffect(() => {
		const preferences = getTablePreferences(tableId);

		// Only set preferences if they exist and we're on initial mount
		if (isInitialMount.current) {
			if (preferences.columnOrder?.length) {
				// Only use saved column order if it contains all current columns
				const currentColumnIds = new Set(columns.map((col, idx) => resolveColumnId(col, idx)));
				const savedColumnIds = new Set(preferences.columnOrder);

				if (
					currentColumnIds.size === savedColumnIds.size &&
					[...currentColumnIds].every((id) => savedColumnIds.has(id))
				) {
					setColumnOrder(preferences.columnOrder);
				}
			}
			if (preferences.columnVisibility) {
				setColumnVisibility(preferences.columnVisibility);
			}
			if (preferences.columnSizing) {
				setColumnSizing(preferences.columnSizing);
			}
			if (preferences.sortState) {
				setSorting(preferences.sortState);
			}
			if (preferences.rowSelection) {
				setRowSelection(preferences.rowSelection);
			}
			if (preferences.expanded) {
				setExpanded(preferences.expanded);
			}
			if (preferences.scrollPosition) {
				setScrollPosition(preferences.scrollPosition);
			}
			// Load pagination preferences
			if (preferences.pagination) {
				setPagination(preferences.pagination);
			}
		}

		isInitialMount.current = false;
	}, [tableId, columns, resolveColumnId]);

	// Save preferences when they change
	React.useEffect(() => {
		// Don't save preferences on initial mount
		if (isInitialMount.current) return;

		const preferences: TablePreferences = {
			columnOrder,
			columnVisibility,
			columnSizing,
			sortState: sorting,
			rowSelection,
			expanded,
			scrollPosition,
			// Save pagination preferences
			pagination: enablePagination ? pagination : undefined,
		};
		saveTablePreferences(tableId, preferences);
	}, [
		tableId,
		columnOrder,
		columnVisibility,
		columnSizing,
		sorting,
		rowSelection,
		expanded,
		scrollPosition,
		// Add pagination to dependencies
		enablePagination,
		pagination,
	]);

	// Notify parent of expanded state changes
	React.useEffect(() => {
		onExpandedChange?.(expanded);
	}, [expanded, onExpandedChange]);

	const table = useReactTable({
		data,
		columns,
		state: {
			...(enableSorting ? { sorting } : {}),
			columnVisibility,
			...(enableColumnReordering ? { columnOrder } : {}),
			...(enableColumnResizing ? { columnSizing } : {}),
			...(enableFiltering ? { columnFilters } : {}),
			...(enableGlobalFilter ? { globalFilter } : {}),
			...(enableColumnPinning ? { columnPinning } : {}),
			...(enableRowSelection ? { rowSelection } : {}),
			...(enableRowExpansion ? { expanded } : {}),
			...(enablePagination ? { pagination } : {}),
		},
		...(enableColumnResizing
			? {
					columnResizeMode: 'onChange',
					onColumnSizingChange: setColumnSizing,
				}
			: {}),
		// Note: We handle column reordering manually via drag and drop
		// Don't use TanStack's built-in column ordering to avoid conflicts
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		...(enableGlobalFilter ? { onGlobalFilterChange: setGlobalFilter } : {}),
		...(enableColumnPinning ? { onColumnPinningChange: setColumnPinning } : {}),
		...(enableRowSelection
			? {
					onRowSelectionChange: (updater) => {
						if (selectionMode === SelectionMode.Single) {
							setRowSelection((prev) => {
								const next = typeof updater === 'function' ? updater(prev) : updater;
								const selectedIds = Object.keys(next);
								if (selectedIds.length > 1) {
									// Find the id that was just toggled on
									const newSelectedId = selectedIds.find((id) => !prev[id]);
									return newSelectedId ? { [newSelectedId]: true } : { [selectedIds[0]]: true };
								}
								// If the same row is clicked again, deselect it
								if (selectedIds.length === 1 && prev[selectedIds[0]]) {
									return {};
								}
								return next;
							});
						} else {
							setRowSelection(updater);
						}
					},
				}
			: {}),
		...(enableRowExpansion
			? {
					getExpandedRowModel: getExpandedRowModel(),
					onExpandedChange: setExpanded,
					getRowCanExpand,
				}
			: {}),
		...(enablePagination
			? {
					onPaginationChange: (updater) => {
						const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
						setPagination(newPagination);
						if (serverSidePagination) {
							onPaginationChange?.(newPagination);
						}
					},
					...(serverSidePagination
						? {
								manualPagination: true,
								pageCount: Math.ceil(totalCount / pagination.pageSize),
							}
						: {
								getPaginationRowModel: getPaginationRowModel(),
							}),
				}
			: {}),
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		enableSorting,
		enableFilters: enableFiltering,
		enableRowSelection,
		defaultColumn: {
			minSize: minColumnWidth,
			maxSize: maxColumnWidth,
			size: defaultColumnWidth,
		},
	});

	// Virtualization setup
	const { rows } = table.getRowModel();
	const virtualizer = useVirtualizer({
		count: enableVirtualization ? rows.length : 0,
		getScrollElement: () => tableRef.current,
		estimateSize: () => estimateRowSize || rowHeight,
		overscan: overscan,
		enabled: enableVirtualization,
		// Add dynamic row height measurement like TanStack example
		measureElement:
			enableDynamicRowHeights &&
			typeof window !== 'undefined' &&
			navigator.userAgent.indexOf('Firefox') === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
	});

	// Set up virtualizer ref and callback
	React.useEffect(() => {
		if (virtualizerRef) {
			virtualizerRef.current = virtualizer;
		}
		onVirtualizerChange?.(virtualizer);
	}, [virtualizer, virtualizerRef, onVirtualizerChange]);

	// Set up scroll to index functionality
	const scrollToIndex = React.useCallback(
		(rowIndex: number, options?: { align?: 'start' | 'center' | 'end' }) => {
			if (enableVirtualization && virtualizer) {
				// Use virtualizer's scrollToIndex method
				virtualizer.scrollToIndex(rowIndex, options);
			} else if (tableRef.current) {
				// For non-virtualized tables, calculate position and scroll manually
				const rowHeight = estimateRowSize || 40;
				const scrollTop = rowIndex * rowHeight;
				tableRef.current.scrollTop = scrollTop;
			}
		},
		[enableVirtualization, virtualizer, estimateRowSize]
	);

	// Expose scroll to index function through ref
	React.useEffect(() => {
		if (scrollToIndexRef) {
			scrollToIndexRef.current = scrollToIndex;
		}
	}, [scrollToIndex, scrollToIndexRef]);

	// Emit column order changes (covers initialization, preference load, and DnD)
	React.useEffect(() => {
		if (onColumnOrderChange) {
			onColumnOrderChange(getOrderedColumns(columnOrder));
		}
	}, [columnOrder, onColumnOrderChange, getOrderedColumns]);

	const getSortIcon = (isSorted: false | 'asc' | 'desc') => {
		if (!isSorted) return <ArrowUpDown className={styles['data-table__header-button-icon']} />;
		return isSorted === 'asc' ? (
			<ChevronUp className={styles['data-table__header-button-icon']} />
		) : (
			<ChevronDown className={styles['data-table__header-button-icon']} />
		);
	};

	const handleDragStart = (columnId: string) => (e: React.DragEvent) => {
		// Don't start drag if we're currently resizing
		if (isResizing) {
			e.preventDefault();
			return;
		}

		e.dataTransfer.setData('text/plain', columnId);
		setDraggedColumn(columnId);
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleDragOver = (columnId: string) => (e: React.DragEvent) => {
		e.preventDefault();
		if (columnId !== draggedColumn) {
			setDropTarget(columnId);
		}
	};

	const handleDragEnd = () => {
		setDraggedColumn(null);
		setDropTarget(null);
	};

	const handleDrop = (columnId: string) => (e: React.DragEvent) => {
		e.preventDefault();
		const sourceColumnId = e.dataTransfer.getData('text/plain');

		if (sourceColumnId && columnId !== sourceColumnId) {
			const newColumnOrder = [...columnOrder];
			const sourceIndex = newColumnOrder.indexOf(sourceColumnId);
			const targetIndex = newColumnOrder.indexOf(columnId);

			if (sourceIndex !== -1 && targetIndex !== -1) {
				newColumnOrder.splice(sourceIndex, 1);
				newColumnOrder.splice(targetIndex, 0, sourceColumnId);
				setColumnOrder(newColumnOrder);
				// Notify listener with the reordered columns
				onColumnOrderChange?.(getOrderedColumns(newColumnOrder));
			}
		}

		setDraggedColumn(null);
		setDropTarget(null);
	};

	const toggleFilter = (columnId: string) => {
		setVisibleFilters((prev) => {
			const next = new Set(prev);
			if (next.has(columnId)) {
				next.delete(columnId);
			} else {
				next.add(columnId);
			}
			return next;
		});
	};

	const togglePin = (columnId: string) => {
		setColumnPinning((prev) => {
			// Use type-safe property access with optional chaining
			const currentPin = prev.left?.includes(columnId)
				? 'left'
				: prev.right?.includes(columnId)
					? 'right'
					: false;

			if (currentPin === 'left') {
				return {
					...prev,
					left: prev.left?.filter((id) => id !== columnId) || [],
					right: [...(prev.right || []), columnId],
				};
			}
			if (currentPin === 'right') {
				return {
					...prev,
					right: prev.right?.filter((id) => id !== columnId) || [],
				};
			}
			return {
				...prev,
				left: [...(prev.left || []), columnId],
			};
		});
	};

	// Notify parent component of selection changes
	React.useEffect(() => {
		if (onRowSelectionChange) {
			const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
			onRowSelectionChange(selectedRows);
		}
	}, [onRowSelectionChange, table]);

	// Add scroll handler for infinite scroll with hysteresis to avoid repeated triggers near bottom
	const loadRequestedRef = React.useRef(false);
	const LOAD_MORE_THRESHOLD = 300; // px from bottom to trigger
	const RESET_THRESHOLD_MULTIPLIER = 2; // must scroll away this much to allow next trigger

	const handleScroll = React.useCallback(
		throttle(
			(e: React.UIEvent<HTMLDivElement>) => {
				if (!e.currentTarget) return;
				const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
				const newPosition = { top: scrollTop, left: e.currentTarget.scrollLeft };
				setScrollPosition(newPosition);
				onScroll?.(newPosition);

				// Infinite scroll trigger with hysteresis
				if (enableInfiniteScroll && hasMore && !loadingMore) {
					const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
					if (distanceFromBottom < LOAD_MORE_THRESHOLD && !loadRequestedRef.current) {
						loadRequestedRef.current = true;
						onLoadMore?.();
					} else if (distanceFromBottom > LOAD_MORE_THRESHOLD * RESET_THRESHOLD_MULTIPLIER) {
						// reset once user scrolls away sufficiently from bottom
						loadRequestedRef.current = false;
					}
				}
			},
			100,
			{ leading: false, trailing: true }
		),
		[]
	);

	// Reset loadRequested flag when data grows
	const prevRowCountRef = React.useRef(rows.length);
	React.useEffect(() => {
		if (rows.length > prevRowCountRef.current) {
			loadRequestedRef.current = false;
		}
		prevRowCountRef.current = rows.length;
	}, [rows.length]);

	// Also observe virtualizer range to catch fast scrolls that skip bottom scroll event
	React.useEffect(() => {
		if (!enableInfiniteScroll || !hasMore || loadingMore) return;
		const virtualItems = virtualizer.getVirtualItems();
		const last = virtualItems[virtualItems.length - 1];
		const nearEndByIndex = last
			? last.index >= rows.length - Math.max(5, Math.floor(overscan / 2))
			: false;
		let nearEndByScroll = false;
		const el = tableRef.current;
		if (el) {
			const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
			nearEndByScroll = distanceFromBottom < LOAD_MORE_THRESHOLD;
		}
		if ((nearEndByIndex || nearEndByScroll) && !loadRequestedRef.current) {
			loadRequestedRef.current = true;
			onLoadMore?.();
		}
	}, [enableInfiniteScroll, hasMore, loadingMore, virtualizer, rows.length, overscan, onLoadMore]);

	// Restore scroll position
	React.useEffect(() => {
		const el = tableRef.current as unknown as {
			scrollTo?: (x: number, y: number) => void;
		} | null;
		if (
			el &&
			typeof el.scrollTo === 'function' &&
			enableScrollRestoration &&
			!isInitialMount.current
		) {
			el.scrollTo(scrollPosition.left, scrollPosition.top);
		}
	}, [scrollPosition, enableScrollRestoration]);

	// IntersectionObserver-based load more for jiggle-free infinite scroll
	React.useEffect(() => {
		if (
			!enableInfiniteScroll ||
			!hasMore ||
			!sentinelRef.current ||
			!tableRef.current ||
			typeof IntersectionObserver === 'undefined'
		) {
			return;
		}
		const root = tableRef.current;
		const sentinel = sentinelRef.current;
		let pending = false;
		let observer: IntersectionObserver | null = null;
		try {
			observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (entry.isIntersecting && !pending && !loadingMore) {
						pending = true;
						onLoadMore?.();
						// Release the pending flag on next tick
						setTimeout(() => {
							pending = false;
						}, 0);
					}
				},
				{
					root,
					rootMargin: '300px 0px 600px 0px',
					threshold: 0,
				}
			);
			observer.observe(sentinel);
		} catch {
			// no-op: fail safe in environments without IO
		}
		return () => observer?.disconnect();
	}, [enableInfiniteScroll, hasMore, loadingMore, onLoadMore]);

	// Compute pinned offsets for sticky columns
	const getPinnedOffset = React.useCallback(
		(col: Column<TData, unknown>, side: 'left' | 'right'): number => {
			const leafColumns = table.getAllLeafColumns();
			if (side === 'left') {
				let offset = 0;
				for (const c of leafColumns) {
					if (c.getIsPinned() === 'left') {
						if (c.id === col.id) break;
						offset += c.getSize();
					}
				}
				return offset;
			}
			// right side: accumulate sizes of right-pinned columns after this column
			let offset = 0;
			for (let i = leafColumns.length - 1; i >= 0; i -= 1) {
				const c = leafColumns[i];
				if (c.getIsPinned() === 'right') {
					if (c.id === col.id) break;
					offset += c.getSize();
				}
			}
			return offset;
		},
		[table]
	);

	return (
		<div className={styles['data-table__root']} data-testid={testId}>
			{enableGlobalFilter && (
				<Input
					placeholder="Search all columns"
					value={globalFilter ?? ''}
					onChange={(e) => setGlobalFilter(e.target.value)}
					prefix={<Search className={styles['data-table__search-icon']} />}
					suffix={
						globalFilter && (
							<Button
								type="button"
								variant="ghost"
								color="none"
								size="icon"
								onClick={() => setGlobalFilter('')}
								suffix={<X />}
							/>
						)
					}
				/>
			)}
			<div className={styles['data-table__container']}>
				<Table
					style={{ tableLayout: 'fixed', width: '100%' }}
					fixedHeight={fixedHeight}
					containerRef={tableRef}
					containerProps={{
						onScroll: handleScroll as unknown as React.UIEventHandler<HTMLDivElement>,
						role: 'region',
						'aria-label': 'Table data',
						tabIndex: 0,
						onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
							// Keyboard navigation for scrolling
							const scrollAmount = 50;
							switch (e.key) {
								case 'ArrowUp':
									e.preventDefault();
									if (tableRef.current) {
										tableRef.current.scrollTop -= scrollAmount;
									}
									break;
								case 'ArrowDown':
									e.preventDefault();
									if (tableRef.current) {
										tableRef.current.scrollTop += scrollAmount;
									}
									break;
								case 'ArrowLeft':
									e.preventDefault();
									if (tableRef.current) {
										tableRef.current.scrollLeft -= scrollAmount;
									}
									break;
								case 'ArrowRight':
									e.preventDefault();
									if (tableRef.current) {
										tableRef.current.scrollLeft += scrollAmount;
									}
									break;
								case 'PageUp':
									e.preventDefault();
									if (tableRef.current) {
										tableRef.current.scrollTop -= tableRef.current.clientHeight;
									}
									break;
								case 'PageDown':
									e.preventDefault();
									if (tableRef.current) {
										tableRef.current.scrollTop += tableRef.current.clientHeight;
									}
									break;
								case 'Home':
									e.preventDefault();
									if (tableRef.current) {
										tableRef.current.scrollTop = 0;
									}
									break;
								case 'End':
									e.preventDefault();
									if (tableRef.current) {
										tableRef.current.scrollTop = tableRef.current.scrollHeight;
									}
									break;
							}
						},
					}}
				>
					{showHeaders && (
						<TableHeader sticky={enableStickyHeaders}>
							{table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
								<TableRow key={headerGroup.id}>
									{enableRowSelection && (
										<TableHead className={styles['data-table__action-cell']}>
											{selectionMode === SelectionMode.Multiple && (
												<input
													type="checkbox"
													aria-label="Select all rows"
													checked={table.getIsAllRowsSelected()}
													onChange={table.getToggleAllRowsSelectedHandler()}
													className={styles['data-table__checkbox']}
													tabIndex={0}
												/>
											)}
										</TableHead>
									)}
									{enableRowExpansion && (
										<TableHead className={styles['data-table__action-cell']} />
									)}
									{headerGroup.headers.map((header) => {
										const column = header.column;
										const isSorted = column.getIsSorted();
										const isDragging = draggedColumn === header.id;
										const isDropTarget = dropTarget === header.id;
										const canFilter = enableFiltering && column.getCanFilter();
										const filterValue = column.getFilterValue();
										const isFilterVisible = visibleFilters.has(header.id);
										const isPinned = column.getIsPinned();

										return (
											<TableHead
												key={header.id}
												style={{
													width: header.getSize(),
													...(isPinned === 'left'
														? {
																left: getPinnedOffset(
																	column as unknown as Column<TData, unknown>,
																	'left'
																),
															}
														: {}),
													...(isPinned === 'right'
														? {
																right: getPinnedOffset(
																	column as unknown as Column<TData, unknown>,
																	'right'
																),
															}
														: {}),
												}}
												className={cn(
													isDragging && styles['data-table__header_dragging'],
													isDropTarget && styles['data-table__header_drop-target'],
													isPinned === 'left' && styles['data-table__header_pinned-left'],
													isPinned === 'right' && styles['data-table__header_pinned-right']
												)}
												draggable={enableColumnReordering && !isResizing}
												onDragStart={
													enableColumnReordering ? handleDragStart(header.id) : undefined
												}
												onDragOver={
													enableColumnReordering && !isResizing
														? handleDragOver(header.id)
														: undefined
												}
												onDrop={
													enableColumnReordering && !isResizing ? handleDrop(header.id) : undefined
												}
												onDragEnd={enableColumnReordering ? handleDragEnd : undefined}
											>
												<div className={styles['data-table__header-content']}>
													<div className={styles['data-table__header-row']}>
														{enableColumnReordering && !isPinned && (
															<GripVertical className={styles['data-table__grip-icon']} />
														)}
														{header.isPlaceholder
															? null
															: flexRender(header.column.columnDef.header, header.getContext())}
														{enableSorting && column.getCanSort() && (
															<button
																onClick={column.getToggleSortingHandler()}
																className={cn(
																	styles['data-table__header-button'],
																	isSorted && styles['data-table__header-button_active']
																)}
															>
																{getSortIcon(isSorted)}
															</button>
														)}
														{canFilter && (
															<button
																onClick={() => toggleFilter(header.id)}
																className={cn(
																	styles['data-table__header-button'],
																	(filterValue || isFilterVisible) &&
																		styles['data-table__header-button_active']
																)}
															>
																<Filter className={styles['data-table__header-button-icon']} />
															</button>
														)}
														{enableColumnPinning && (
															<button
																onClick={() => togglePin(header.id)}
																className={cn(
																	styles['data-table__header-button'],
																	isPinned && styles['data-table__header-button_active']
																)}
															>
																{isPinned ? (
																	<Pin className={styles['data-table__header-button-icon']} />
																) : (
																	<PinOff className={styles['data-table__header-button-icon']} />
																)}
															</button>
														)}
													</div>
													{canFilter && isFilterVisible && (
														<Input
															className={styles['data-table__filter-input']}
															placeholder={
																typeof header.column.columnDef.header === 'string'
																	? `Filter ${header.column.columnDef.header}...`
																	: 'Filter values...'
															}
															value={(filterValue ?? '') as string}
															onChange={(e) => column.setFilterValue(e.target.value)}
															suffix={
																filterValue ? (
																	<Button
																		type="button"
																		variant="ghost"
																		color="none"
																		onClick={() => column.setFilterValue('')}
																		suffix={<X />}
																	/>
																) : null
															}
														/>
													)}
												</div>
												{enableColumnResizing && (
													<div
														{...{
															onDoubleClick: () => header.column.resetSize(),
															onMouseDown: (e: React.MouseEvent) => {
																setIsResizing(true);
																header.getResizeHandler()(e);
																const onMouseUp = () => {
																	setIsResizing(false);
																	document.removeEventListener('mouseup', onMouseUp);
																};
																document.addEventListener('mouseup', onMouseUp, { once: true });
															},
															onTouchStart: (e: React.TouchEvent) => {
																setIsResizing(true);
																header.getResizeHandler()(e);
																const onTouchEnd = () => {
																	setIsResizing(false);
																	document.removeEventListener('touchend', onTouchEnd);
																};
																document.addEventListener('touchend', onTouchEnd, {
																	once: true,
																});
															},
															style: {
																display: !header.column.getCanResize() ? 'none' : '',
															},
															className: cn(
																styles['data-table__resizer'],
																header.column.getIsResizing() &&
																	styles['data-table__resizer_resizing']
															),
														}}
													/>
												)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
					)}
					{enableVirtualization ? (
						// Virtualized table body
						<VirtualizedTableBody
							table={table}
							virtualizer={virtualizer}
							enableRowSelection={enableRowSelection}
							enableRowExpansion={enableRowExpansion}
							enableDynamicRowHeights={enableDynamicRowHeights}
							onRowClick={onRowClick}
							onRowDoubleClick={onRowDoubleClick}
							onCellClick={onCellClick}
							onCellDoubleClick={onCellDoubleClick}
							stopPropagationOnRowClick={stopPropagationOnRowClick}
							stopPropagationOnCellClick={stopPropagationOnCellClick}
							expandOnRowClick={expandOnRowClick}
							renderSubComponent={renderSubComponent}
							sentinelRef={enableInfiniteScroll ? sentinelRef : undefined}
						/>
					) : (
						// Regular table body
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={
											columns.length + (enableRowSelection ? 1 : 0) + (enableRowExpansion ? 1 : 0)
										}
										className={styles['data-table__loading-cell']}
									>
										<div className={styles['data-table__loading-overlay']}>
											<div className={styles['data-table__loading-content']}>
												<LoaderCircle />
												<span>Loading...</span>
											</div>
										</div>
									</TableCell>
								</TableRow>
							) : table.getRowModel().rows?.length ? (
								<>
									{table.getRowModel().rows.map((row) => (
										<React.Fragment key={row.id}>
											{renderRow ? (
												renderRow({
													row,
													children: (
														<TableRow
															className={cn(
																row.getIsSelected() && styles['data-table__row_selected'],
																styles['data-table__row_clickable'],
																enableRowExpansion &&
																	row.getCanExpand() &&
																	styles['data-table__row_expandable']
															)}
															style={{
																height: enableDynamicRowHeights ? 'auto' : `${rowHeight}px`,
																minHeight: `${rowHeight}px`,
															}}
															onClick={(e) => {
																if (stopPropagationOnRowClick) {
																	e.stopPropagation();
																}
																if (enableRowSelection) {
																	row.toggleSelected();
																}
																if (enableRowExpansion && expandOnRowClick && row.getCanExpand()) {
																	row.toggleExpanded();
																}
																onRowClick?.(row, e);
															}}
															onDoubleClick={(e) => {
																if (stopPropagationOnRowClick) {
																	e.stopPropagation();
																}
																onRowDoubleClick?.(row, e);
															}}
															aria-selected={row.getIsSelected()}
															tabIndex={0}
															onKeyDown={(e) => {
																if (enableRowSelection && (e.key === ' ' || e.key === 'Enter')) {
																	e.preventDefault();
																	row.toggleSelected();
																}
																if (
																	enableRowExpansion &&
																	(e.key === ' ' || e.key === 'Enter') &&
																	row.getCanExpand()
																) {
																	e.preventDefault();
																	row.toggleExpanded();
																}
															}}
														>
															{enableRowSelection && (
																<TableCell className={styles['data-table__action-cell']}>
																	<input
																		type="checkbox"
																		aria-label={`Select row ${row.id}`}
																		checked={row.getIsSelected()}
																		onChange={row.getToggleSelectedHandler()}
																		onClick={(e) => e.stopPropagation()}
																		className={styles['data-table__checkbox']}
																		tabIndex={0}
																	/>
																</TableCell>
															)}
															{enableRowExpansion && (
																<TableCell className={styles['data-table__action-cell']}>
																	{row.getCanExpand() && (
																		<button
																			onClick={(e) => {
																				e.stopPropagation();
																				row.toggleExpanded();
																			}}
																			className={cn(
																				styles['data-table__expand-button'],
																				row.getIsExpanded() &&
																					styles['data-table__expand-button_expanded']
																			)}
																		>
																			<ChevronRight className={styles['data-table__expand-icon']} />
																		</button>
																	)}
																</TableCell>
															)}
															{row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
																const isPinned = cell.column.getIsPinned();
																return (
																	<TableCell
																		key={cell.id}
																		style={{
																			width: cell.column.getSize(),
																			height: enableDynamicRowHeights ? 'auto' : `${rowHeight}px`,
																			minHeight: `${rowHeight}px`,
																			...(isPinned === 'left'
																				? {
																						left: getPinnedOffset(
																							cell.column as Column<TData, unknown>,
																							'left'
																						),
																					}
																				: {}),
																			...(isPinned === 'right'
																				? {
																						right: getPinnedOffset(
																							cell.column as Column<TData, unknown>,
																							'right'
																						),
																					}
																				: {}),
																		}}
																		className={cn(
																			styles['data-table__cell-padding'],
																			isPinned === 'left' && styles['data-table__cell_pinned-left'],
																			isPinned === 'right' &&
																				styles['data-table__cell_pinned-right']
																		)}
																		onClick={(e) => {
																			if (stopPropagationOnCellClick) {
																				e.stopPropagation();
																			}
																			onCellClick?.(cell, e);
																		}}
																		onDoubleClick={(e) => {
																			if (stopPropagationOnCellClick) {
																				e.stopPropagation();
																			}
																			onCellDoubleClick?.(cell, e);
																		}}
																	>
																		{flexRender(cell.column.columnDef.cell, cell.getContext())}
																	</TableCell>
																);
															})}
														</TableRow>
													),
												})
											) : (
												<TableRow
													className={cn(
														row.getIsSelected() && styles['data-table__row_selected'],
														styles['data-table__row_clickable'],
														enableRowExpansion &&
															row.getCanExpand() &&
															styles['data-table__row_expandable']
													)}
													style={{
														height: enableDynamicRowHeights ? 'auto' : `${rowHeight}px`,
														minHeight: `${rowHeight}px`,
													}}
													onClick={(e) => {
														if (stopPropagationOnRowClick) {
															e.stopPropagation();
														}
														if (enableRowSelection) {
															row.toggleSelected();
														}
														if (enableRowExpansion && expandOnRowClick && row.getCanExpand()) {
															row.toggleExpanded();
														}
														onRowClick?.(row, e);
													}}
													onDoubleClick={(e) => {
														if (stopPropagationOnRowClick) {
															e.stopPropagation();
														}
														onRowDoubleClick?.(row, e);
													}}
													aria-selected={row.getIsSelected()}
													tabIndex={0}
													onKeyDown={(e) => {
														if (enableRowSelection && (e.key === ' ' || e.key === 'Enter')) {
															e.preventDefault();
															row.toggleSelected();
														}
														if (
															enableRowExpansion &&
															(e.key === ' ' || e.key === 'Enter') &&
															row.getCanExpand()
														) {
															e.preventDefault();
															row.toggleExpanded();
														}
													}}
												>
													{enableRowSelection && (
														<TableCell className={styles['data-table__action-cell']}>
															<input
																type="checkbox"
																aria-label={`Select row ${row.id}`}
																checked={row.getIsSelected()}
																onChange={row.getToggleSelectedHandler()}
																onClick={(e) => e.stopPropagation()}
																className={styles['data-table__checkbox']}
																tabIndex={0}
															/>
														</TableCell>
													)}
													{enableRowExpansion && (
														<TableCell className={styles['data-table__action-cell']}>
															{row.getCanExpand() && (
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		row.toggleExpanded();
																	}}
																	className={cn(
																		styles['data-table__expand-button'],
																		row.getIsExpanded() &&
																			styles['data-table__expand-button_expanded']
																	)}
																>
																	<ChevronRight className={styles['data-table__expand-icon']} />
																</button>
															)}
														</TableCell>
													)}
													{row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
														const isPinned = cell.column.getIsPinned();
														return (
															<TableCell
																key={cell.id}
																style={{
																	width: cell.column.getSize(),
																	height: enableDynamicRowHeights ? 'auto' : `${rowHeight}px`,
																	minHeight: `${rowHeight}px`,
																	...(isPinned === 'left'
																		? {
																				left: getPinnedOffset(
																					cell.column as Column<TData, unknown>,
																					'left'
																				),
																			}
																		: {}),
																	...(isPinned === 'right'
																		? {
																				right: getPinnedOffset(
																					cell.column as Column<TData, unknown>,
																					'right'
																				),
																			}
																		: {}),
																}}
																className={cn(
																	styles['data-table__cell-padding'],
																	isPinned === 'left' && styles['data-table__cell_pinned-left'],
																	isPinned === 'right' && styles['data-table__cell_pinned-right']
																)}
																onClick={(e) => {
																	if (stopPropagationOnCellClick) {
																		e.stopPropagation();
																	}
																	onCellClick?.(cell, e);
																}}
																onDoubleClick={(e) => {
																	if (stopPropagationOnCellClick) {
																		e.stopPropagation();
																	}
																	onCellDoubleClick?.(cell, e);
																}}
															>
																{flexRender(cell.column.columnDef.cell, cell.getContext())}
															</TableCell>
														);
													})}
												</TableRow>
											)}
											{enableRowExpansion && row.getIsExpanded() && renderSubComponent && (
												<AnimatedRow isExpanded={row.getIsExpanded()}>
													<TableCell
														colSpan={
															row.getVisibleCells().length +
															(enableRowSelection ? 1 : 0) +
															(enableRowExpansion ? 1 : 0)
														}
														className={styles['data-table__sub-row']}
													>
														{renderSubComponent({ row })}
													</TableCell>
												</AnimatedRow>
											)}
										</React.Fragment>
									))}
									{enableInfiniteScroll && hasMore && (
										<TableRow>
											<TableCell
												colSpan={
													columns.length +
													(enableRowSelection ? 1 : 0) +
													(enableRowExpansion ? 1 : 0)
												}
												className={styles['data-table__infinite-scroll-cell']}
											>
												<div className={styles['data-table__infinite-scroll-content']}>
													{loadingMore ? (
														<div className={styles['data-table__pagination-left']}>
															<LoaderCircle />
															<span>Loading more...</span>
														</div>
													) : null}
												</div>
											</TableCell>
										</TableRow>
									)}
								</>
							) : (
								<TableRow>
									<TableCell
										colSpan={
											columns.length + (enableRowSelection ? 1 : 0) + (enableRowExpansion ? 1 : 0)
										}
										className={styles['data-table__empty-cell']}
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					)}
				</Table>
			</div>
			{enablePagination && (
				<div className={styles['data-table__pagination']}>
					<div className={styles['data-table__pagination-left']}>
						<p className={styles['data-table__pagination-label']}>Rows per page</p>
						<select
							value={table.getState().pagination.pageSize}
							onChange={(e) => {
								const newPageSize = Number(e.target.value);
								table.setPageSize(newPageSize);
								onPageSizeChange?.(newPageSize);
								if (serverSidePagination) {
									onPaginationChange?.({
										pageIndex: 0,
										pageSize: newPageSize,
									});
								}
							}}
							disabled={isLoading}
							className={styles['data-table__pagination-select']}
						>
							{pageSizeOptions.map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</div>
					<div className={styles['data-table__pagination-right']}>
						<div className={styles['data-table__pagination-info']}>
							{isLoading ? (
								<div className={styles['data-table__pagination-left']}>
									<LoaderCircle />
									<span>Loading...</span>
								</div>
							) : (
								`Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`
							)}
						</div>
						<div className={styles['data-table__pagination-buttons']}>
							<button
								className={styles['data-table__pagination-button']}
								onClick={() => {
									table.setPageIndex(0);
									onPageChange?.(0);
									if (serverSidePagination) {
										onPaginationChange?.({
											pageIndex: 0,
											pageSize: pagination.pageSize,
										});
									}
								}}
								disabled={!table.getCanPreviousPage() || isLoading}
							>
								<ChevronsLeft className={styles['data-table__pagination-button-icon']} />
							</button>
							<button
								className={styles['data-table__pagination-button']}
								onClick={() => {
									table.previousPage();
									onPageChange?.(table.getState().pagination.pageIndex - 1);
									if (serverSidePagination) {
										onPaginationChange?.({
											pageIndex: table.getState().pagination.pageIndex - 1,
											pageSize: pagination.pageSize,
										});
									}
								}}
								disabled={!table.getCanPreviousPage() || isLoading}
							>
								<ChevronLeft className={styles['data-table__pagination-button-icon']} />
							</button>
							<button
								className={styles['data-table__pagination-button']}
								onClick={() => {
									table.nextPage();
									onPageChange?.(table.getState().pagination.pageIndex + 1);
									if (serverSidePagination) {
										onPaginationChange?.({
											pageIndex: table.getState().pagination.pageIndex + 1,
											pageSize: pagination.pageSize,
										});
									}
								}}
								disabled={!table.getCanNextPage() || isLoading}
							>
								<ChevronRight className={styles['data-table__pagination-button-icon']} />
							</button>
							<button
								className={styles['data-table__pagination-button']}
								onClick={() => {
									table.setPageIndex(table.getPageCount() - 1);
									onPageChange?.(table.getPageCount() - 1);
									if (serverSidePagination) {
										onPaginationChange?.({
											pageIndex: table.getPageCount() - 1,
											pageSize: pagination.pageSize,
										});
									}
								}}
								disabled={!table.getCanNextPage() || isLoading}
							>
								<ChevronsRight className={styles['data-table__pagination-button-icon']} />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
