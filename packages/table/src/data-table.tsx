import * as React from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	HeaderGroup,
	Table as ReactTable,
	Cell,
	SortingState,
	getSortedRowModel,
	VisibilityState,
	ColumnOrderState,
	getFilteredRowModel,
	ColumnFiltersState,
	ColumnPinningState,
	RowSelectionState,
	ExpandedState,
	getExpandedRowModel,
	Row,
	getPaginationRowModel,
} from '@tanstack/react-table';
import { useVirtualizer, Virtualizer } from '@tanstack/react-virtual';
import { cn } from './lib/utils';
import {
	getTablePreferences,
	saveTablePreferences,
	TablePreferences,
} from './lib/preferences';
import {
	ArrowUpDown,
	ChevronDown,
	ChevronUp,
	GripVertical,
	Search,
	X,
	Filter,
	Pin,
	PinOff,
	ChevronRight,
	ChevronLeft,
	ChevronsLeft,
	ChevronsRight,
	Loader2,
} from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './table';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	tableId: string;
	initialColumnOrder?: string[];
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
	selectionMode?: 'single' | 'multiple';
	onRowSelectionChange?: (selectedRows: TData[]) => void;
	enableRowExpansion?: boolean;
	renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
	initialExpanded?: ExpandedState;
	onExpandedChange?: (expanded: ExpandedState) => void;
	getRowCanExpand?: (row: Row<TData>) => boolean;
	expandOnRowClick?: boolean;
	renderRow?: (props: {
		row: Row<TData>;
		children: React.ReactNode;
	}) => React.ReactNode;
	onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void;
	onRowDoubleClick?: (row: Row<TData>, event: React.MouseEvent) => void;
	onCellClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
	onCellDoubleClick?: (
		cell: Cell<TData, unknown>,
		event: React.MouseEvent,
	) => void;
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
	onPaginationChange?: (pagination: {
		pageIndex: number;
		pageSize: number;
	}) => void;
	enableInfiniteScroll?: boolean;
	hasMore?: boolean;
	onLoadMore?: () => void;
	loadingMore?: boolean;
	// Virtualization props
	enableVirtualization?: boolean;
	estimateRowSize?: number;
	overscan?: number;
	onVirtualizerChange?: (
		virtualizer: Virtualizer<HTMLDivElement, Element>,
	) => void;
	virtualizerRef?: React.MutableRefObject<
		Virtualizer<HTMLDivElement, Element> | undefined
	>;
	// Header visibility prop
	showHeaders?: boolean;
}

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
}: {
	table: ReactTable<TData>;
	virtualizer: Virtualizer<HTMLDivElement, Element>;
	enableRowSelection?: boolean;
	enableRowExpansion?: boolean;
	enableDynamicRowHeights?: boolean;
	onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void;
	onRowDoubleClick?: (row: Row<TData>, event: React.MouseEvent) => void;
	onCellClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
	onCellDoubleClick?: (
		cell: Cell<TData, unknown>,
		event: React.MouseEvent,
	) => void;
	stopPropagationOnRowClick?: boolean;
	stopPropagationOnCellClick?: boolean;
	expandOnRowClick?: boolean;
	renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
}): JSX.Element {
	const { rows } = table.getRowModel();

	return (
		<TableBody>
			{/* Spacer for rows before virtual window */}
			{virtualizer.getVirtualItems().length > 0 &&
				virtualizer.getVirtualItems()[0].start > 0 && (
					<tr>
						<td
							style={{
								height: `${virtualizer.getVirtualItems()[0].start}px`,
								padding: 0,
								border: 'none',
							}}
							colSpan={
								table.getAllColumns().length +
								(enableRowSelection ? 1 : 0) +
								(enableRowExpansion ? 1 : 0)
							}
						/>
					</tr>
				)}

			{/* Virtual rows */}
			{virtualizer.getVirtualItems().map((virtualRow) => {
				const row = rows[virtualRow.index];
				if (!row) return null;

				return (
					<React.Fragment key={virtualRow.key}>
						<TableRow
							className={cn(
								row.getIsSelected() && 'bg-muted/50',
								'cursor-pointer',
								enableRowExpansion && row.getCanExpand() && 'hover:bg-muted/30',
							)}
							style={{
								height: enableDynamicRowHeights ? 'auto' : `${virtualRow.size}px`,
								minHeight: `${virtualRow.size}px`,
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
								<TableCell className="w-[48px]">
									<input
										type="checkbox"
										aria-label={`Select row ${row.id}`}
										checked={row.getIsSelected()}
										onChange={row.getToggleSelectedHandler()}
										onClick={(e) => e.stopPropagation()}
										className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
										tabIndex={0}
									/>
								</TableCell>
							)}
							{enableRowExpansion && (
								<TableCell className="w-[48px]">
									{row.getCanExpand() && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												row.toggleExpanded();
											}}
											className={cn(
												'transform transition-transform duration-200',
												row.getIsExpanded() ? 'rotate-90' : '',
											)}
										>
											<ChevronRight className="h-4 w-4" />
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
											height: enableDynamicRowHeights ? 'auto' : `${virtualRow.size}px`,
											minHeight: `${virtualRow.size}px`,
											padding: '0.75rem',
											verticalAlign: 'top',
										}}
										className={cn(
											isPinned === 'left' && 'sticky left-0 z-10 bg-background',
											isPinned === 'right' && 'sticky right-0 z-10 bg-background',
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
									className="bg-muted/30"
								>
									{renderSubComponent({ row })}
								</TableCell>
							</TableRow>
						)}
					</React.Fragment>
				);
			})}

			{/* Spacer for rows after virtual window */}
			{virtualizer.getVirtualItems().length > 0 &&
				(() => {
					const lastItem =
						virtualizer.getVirtualItems()[virtualizer.getVirtualItems().length - 1];
					const remainingHeight =
						virtualizer.getTotalSize() - (lastItem.start + lastItem.size);
					return remainingHeight > 0 ? (
						<tr>
							<td
								style={{
									height: `${remainingHeight}px`,
									padding: 0,
									border: 'none',
								}}
								colSpan={
									table.getAllColumns().length +
									(enableRowSelection ? 1 : 0) +
									(enableRowExpansion ? 1 : 0)
								}
							/>
						</tr>
					) : null;
				})()}
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
				'transition-all duration-200 ease-in-out',
				isExpanded ? 'opacity-100' : 'opacity-0',
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
	selectionMode = 'multiple',
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
	// Header visibility prop
	showHeaders = true,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);
	const [columnSizing, setColumnSizing] = React.useState<Record<string, number>>(
		{},
	);
	const [draggedColumn, setDraggedColumn] = React.useState<string | null>(null);
	const [dropTarget, setDropTarget] = React.useState<string | null>(null);
	const [isResizing, setIsResizing] = React.useState(false);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [globalFilter, setGlobalFilter] = React.useState('');
	const [visibleFilters, setVisibleFilters] = React.useState<Set<string>>(
		new Set(),
	);
	const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
		{},
	);
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
	const [expanded, setExpanded] = React.useState<ExpandedState>(initialExpanded);
	const [scrollPosition, setScrollPosition] = React.useState({
		top: 0,
		left: 0,
	});
	const tableRef = React.useRef<HTMLDivElement>(null);
	const isInitialMount = React.useRef(true);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: pageSize,
	});

	// Initialise Column Order Array
	React.useEffect(() => {
		setColumnOrder(
			initialColumnOrder || columns.map((column) => column.id as string),
		);
	}, [columns, initialColumnOrder]);

	// Load preferences on mount
	React.useEffect(() => {
		const preferences = getTablePreferences(tableId);

		// Only set preferences if they exist and we're on initial mount
		if (isInitialMount.current) {
			if (preferences.columnOrder?.length) {
				// Only use saved column order if it contains all current columns
				const currentColumnIds = new Set(columns.map((col) => col.id as string));
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
	}, [tableId, columns]);

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
		...(enableColumnReordering
			? {
					onColumnOrderChange: setColumnOrder,
				}
			: {}),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		...(enableGlobalFilter ? { onGlobalFilterChange: setGlobalFilter } : {}),
		...(enableColumnPinning ? { onColumnPinningChange: setColumnPinning } : {}),
		...(enableRowSelection
			? {
					onRowSelectionChange: (updater) => {
						if (selectionMode === 'single') {
							setRowSelection((prev) => {
								const next = typeof updater === 'function' ? updater(prev) : updater;
								const selectedIds = Object.keys(next);
								if (selectedIds.length > 1) {
									// Find the id that was just toggled on
									const newSelectedId = selectedIds.find((id) => !prev[id]);
									return newSelectedId
										? { [newSelectedId]: true }
										: { [selectedIds[0]]: true };
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
						const newPagination =
							typeof updater === 'function' ? updater(pagination) : updater;
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
	});

	// Set up virtualizer ref and callback
	React.useEffect(() => {
		if (virtualizerRef) {
			virtualizerRef.current = virtualizer;
		}
		onVirtualizerChange?.(virtualizer);
	}, [virtualizer, virtualizerRef, onVirtualizerChange]);

	const getSortIcon = (isSorted: false | 'asc' | 'desc') => {
		if (!isSorted) return <ArrowUpDown className="h-4 w-4" />;
		return isSorted === 'asc' ? (
			<ChevronUp className="h-4 w-4" />
		) : (
			<ChevronDown className="h-4 w-4" />
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
			const selectedRows = table
				.getSelectedRowModel()
				.rows.map((row) => row.original);
			onRowSelectionChange(selectedRows);
		}
	}, [rowSelection, onRowSelectionChange, table]);

	// Add scroll handler for infinite scroll
	const handleScroll = React.useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
			const newPosition = { top: scrollTop, left: e.currentTarget.scrollLeft };
			setScrollPosition(newPosition);
			onScroll?.(newPosition);

			// Check if we've scrolled to the bottom
			if (
				enableInfiniteScroll &&
				hasMore &&
				!loadingMore &&
				scrollHeight - scrollTop - clientHeight < 100 // Load more when within 100px of bottom
			) {
				onLoadMore?.();
			}
		},
		[enableInfiniteScroll, hasMore, loadingMore, onLoadMore, onScroll],
	);

	// Restore scroll position
	React.useEffect(() => {
		if (tableRef.current && enableScrollRestoration && !isInitialMount.current) {
			tableRef.current.scrollTo(scrollPosition.left, scrollPosition.top);
		}
	}, [scrollPosition, enableScrollRestoration]);

	return (
		<div className="space-y-4">
			{enableGlobalFilter && (
				<div className="flex items-center gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<input
							placeholder="Search all columns..."
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
							className="w-full rounded-md border pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
						{globalFilter && (
							<button
								onClick={() => setGlobalFilter('')}
								className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
							>
								<X className="h-4 w-4" />
							</button>
						)}
					</div>
				</div>
			)}
			<div
				ref={tableRef}
				className="rounded-md border overflow-auto relative"
				onScroll={handleScroll}
				style={{
					maxHeight: 'calc(100vh - 200px)',
					scrollBehavior: 'smooth',
				}}
			>
				<Table
					style={{
						tableLayout: enableVirtualization ? 'fixed' : 'auto',
					}}
				>
					{showHeaders && (
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
								<TableRow key={headerGroup.id}>
									{enableRowSelection && (
										<TableHead className="w-[48px]">
											{selectionMode === 'multiple' && (
												<input
													type="checkbox"
													aria-label="Select all rows"
													checked={table.getIsAllRowsSelected()}
													onChange={table.getToggleAllRowsSelectedHandler()}
													className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
													tabIndex={0}
												/>
											)}
										</TableHead>
									)}
									{enableRowExpansion && <TableHead className="w-[48px]" />}
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
												}}
												className={cn(
													'relative',
													isDragging && 'opacity-50',
													isDropTarget && 'border-l-2 border-primary',
													isPinned === 'left' && 'sticky left-0 z-20 bg-background',
													isPinned === 'right' && 'sticky right-0 z-20 bg-background',
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
													enableColumnReordering && !isResizing
														? handleDrop(header.id)
														: undefined
												}
												onDragEnd={enableColumnReordering ? handleDragEnd : undefined}
											>
												<div className="flex flex-col gap-2">
													<div className="flex items-center gap-2">
														{enableColumnReordering && (
															<GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
														)}
														{header.isPlaceholder
															? null
															: flexRender(
																	header.column.columnDef.header,
																	header.getContext(),
																)}
														{enableSorting && column.getCanSort() && (
															<button
																onClick={column.getToggleSortingHandler()}
																className={cn(
																	'ml-2 hover:bg-muted/50 rounded p-1',
																	isSorted && 'bg-muted/50',
																)}
															>
																{getSortIcon(isSorted)}
															</button>
														)}
														{canFilter && (
															<button
																onClick={() => toggleFilter(header.id)}
																className={cn(
																	'ml-2 hover:bg-muted/50 rounded p-1',
																	filterValue ? 'bg-muted/50' : '',
																	isFilterVisible && 'bg-muted/50',
																)}
															>
																<Filter className="h-4 w-4" />
															</button>
														)}
														{enableColumnPinning && (
															<button
																onClick={() => togglePin(header.id)}
																className={cn(
																	'ml-2 hover:bg-muted/50 rounded p-1',
																	isPinned && 'bg-muted/50',
																)}
															>
																{isPinned ? (
																	<Pin className="h-4 w-4" />
																) : (
																	<PinOff className="h-4 w-4" />
																)}
															</button>
														)}
													</div>
													{canFilter && isFilterVisible && (
														<div className="relative">
															<input
																placeholder={`Filter ${header.column.columnDef.header as string}...`}
																value={(filterValue ?? '') as string}
																onChange={(e) => column.setFilterValue(e.target.value)}
																className="w-full rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
															/>
															{filterValue != null && (
																<button
																	onClick={() => column.setFilterValue('')}
																	className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
																>
																	<X className="h-3 w-3" />
																</button>
															)}
														</div>
													)}
												</div>
												{enableColumnResizing && (
													<div
														{...{
															onDoubleClick: () => header.column.resetSize(),
															onMouseDown: (e: React.MouseEvent) => {
																setIsResizing(true);
																header.getResizeHandler()(e);
																// Add global mouse up listener to detect when resizing ends
																const onMouseUp = () => {
																	setIsResizing(false);
																	document.removeEventListener('mouseup', onMouseUp);
																};
																document.addEventListener('mouseup', onMouseUp, { once: true });
															},
															onTouchStart: (e: React.TouchEvent) => {
																setIsResizing(true);
																header.getResizeHandler()(e);
																// Add global touch end listener to detect when resizing ends
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
																'absolute top-0 right-0 h-full w-1 cursor-col-resize select-none touch-none bg-muted/50 hover:bg-muted',
																header.column.getIsResizing() && 'bg-primary',
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
						/>
					) : (
						// Regular table body
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={
											columns.length +
											(enableRowSelection ? 1 : 0) +
											(enableRowExpansion ? 1 : 0)
										}
										className="h-[400px] relative"
									>
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-md shadow-sm">
												<Loader2 className="h-4 w-4 animate-spin" />
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
																row.getIsSelected() && 'bg-muted/50',
																'cursor-pointer',
																enableRowExpansion && row.getCanExpand() && 'hover:bg-muted/30',
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
																if (
																	enableRowExpansion &&
																	expandOnRowClick &&
																	row.getCanExpand()
																) {
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
																if (
																	enableRowSelection &&
																	(e.key === ' ' || e.key === 'Enter')
																) {
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
																<TableCell className="w-[48px]">
																	<input
																		type="checkbox"
																		aria-label={`Select row ${row.id}`}
																		checked={row.getIsSelected()}
																		onChange={row.getToggleSelectedHandler()}
																		onClick={(e) => e.stopPropagation()}
																		className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
																		tabIndex={0}
																	/>
																</TableCell>
															)}
															{enableRowExpansion && (
																<TableCell className="w-[48px]">
																	{row.getCanExpand() && (
																		<button
																			onClick={(e) => {
																				e.stopPropagation();
																				row.toggleExpanded();
																			}}
																			className={cn(
																				'transform transition-transform duration-200',
																				row.getIsExpanded() ? 'rotate-90' : '',
																			)}
																		>
																			<ChevronRight className="h-4 w-4" />
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
																			padding: '0.75rem',
																			verticalAlign: 'top',
																		}}
																		className={cn(
																			isPinned === 'left' && 'sticky left-0 z-10 bg-background',
																			isPinned === 'right' && 'sticky right-0 z-10 bg-background',
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
														row.getIsSelected() && 'bg-muted/50',
														'cursor-pointer',
														enableRowExpansion && row.getCanExpand() && 'hover:bg-muted/30',
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
														if (
															enableRowExpansion &&
															expandOnRowClick &&
															row.getCanExpand()
														) {
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
														<TableCell className="w-[48px]">
															<input
																type="checkbox"
																aria-label={`Select row ${row.id}`}
																checked={row.getIsSelected()}
																onChange={row.getToggleSelectedHandler()}
																onClick={(e) => e.stopPropagation()}
																className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
																tabIndex={0}
															/>
														</TableCell>
													)}
													{enableRowExpansion && (
														<TableCell className="w-[48px]">
															{row.getCanExpand() && (
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		row.toggleExpanded();
																	}}
																	className={cn(
																		'transform transition-transform duration-200',
																		row.getIsExpanded() ? 'rotate-90' : '',
																	)}
																>
																	<ChevronRight className="h-4 w-4" />
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
																	padding: '0.75rem',
																	verticalAlign: 'top',
																}}
																className={cn(
																	isPinned === 'left' && 'sticky left-0 z-10 bg-background',
																	isPinned === 'right' && 'sticky right-0 z-10 bg-background',
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
														className="bg-muted/30"
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
												className="h-16"
											>
												<div className="flex items-center justify-center">
													{loadingMore ? (
														<div className="flex items-center gap-2">
															<Loader2 className="h-4 w-4 animate-spin" />
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
											columns.length +
											(enableRowSelection ? 1 : 0) +
											(enableRowExpansion ? 1 : 0)
										}
										className="h-24 text-center"
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
				<div className="flex items-center justify-between px-2">
					<div className="flex items-center gap-2">
						<p className="text-sm text-muted-foreground">Rows per page</p>
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
							className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{pageSizeOptions.map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</div>
					<div className="flex items-center gap-6 lg:gap-8">
						<div className="flex w-[100px] items-center justify-center text-sm font-medium">
							{isLoading ? (
								<div className="flex items-center gap-2">
									<Loader2 className="h-3 w-3 animate-spin" />
									<span>Loading...</span>
								</div>
							) : (
								`Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`
							)}
						</div>
						<div className="flex items-center gap-2">
							<button
								className="inline-flex items-center justify-center rounded-md p-1 text-sm font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
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
								<ChevronsLeft className="h-4 w-4" />
							</button>
							<button
								className="inline-flex items-center justify-center rounded-md p-1 text-sm font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
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
								<ChevronLeft className="h-4 w-4" />
							</button>
							<button
								className="inline-flex items-center justify-center rounded-md p-1 text-sm font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
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
								<ChevronRight className="h-4 w-4" />
							</button>
							<button
								className="inline-flex items-center justify-center rounded-md p-1 text-sm font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
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
								<ChevronsRight className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
