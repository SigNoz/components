import * as React from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	HeaderGroup,
	Cell,
	SortingState,
	getSortedRowModel,
	VisibilityState,
	ColumnOrderState,
	getFilteredRowModel,
	ColumnFiltersState,
	ColumnPinningState,
} from '@tanstack/react-table';
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
}

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

	// Initialise Column Order Array
	React.useEffect(() => {
		setColumnOrder(
			initialColumnOrder || columns.map((column) => column.id as string),
		);
	}, [columns, initialColumnOrder]);

	// Load preferences on mount
	React.useEffect(() => {
		const preferences = getTablePreferences(tableId);
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
		if (preferences.columnVisibility)
			setColumnVisibility(preferences.columnVisibility);
		if (preferences.columnSizing) setColumnSizing(preferences.columnSizing);
		if (preferences.sortState) setSorting(preferences.sortState);
	}, [tableId, columns]);

	// Save preferences when they change
	React.useEffect(() => {
		const preferences: TablePreferences = {
			columnOrder,
			columnVisibility,
			columnSizing,
			sortState: sorting,
		};
		saveTablePreferences(tableId, preferences);
	}, [tableId, columnOrder, columnVisibility, columnSizing, sorting]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			...(enableColumnReordering ? { columnOrder } : {}),
			...(enableColumnResizing ? { columnSizing } : {}),
			...(enableFiltering ? { columnFilters } : {}),
			...(enableGlobalFilter ? { globalFilter } : {}),
			...(enableColumnPinning ? { columnPinning } : {}),
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

	const getSortIcon = (isSorted: false | 'asc' | 'desc') => {
		if (!isSorted) return <ArrowUpDown className="h-4 w-4" />;
		return isSorted === 'asc' ? (
			<ChevronUp className="h-4 w-4" />
		) : (
			<ChevronDown className="h-4 w-4" />
		);
	};

	const handleDragStart = (columnId: string) => (e: React.DragEvent) => {
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
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
							<TableRow key={headerGroup.id}>
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
											draggable={enableColumnReordering}
											onDragStart={handleDragStart(header.id)}
											onDragOver={handleDragOver(header.id)}
											onDragEnd={handleDragEnd}
											onDrop={handleDrop(header.id)}
										>
											<div className="flex flex-col gap-2">
												<div className="flex items-center gap-2">
													{enableColumnReordering && (
														<GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
													)}
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
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
														onMouseDown: header.getResizeHandler(),
														onTouchStart: header.getResizeHandler(),
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
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
										const isPinned = cell.column.getIsPinned();
										return (
											<TableCell
												key={cell.id}
												style={{
													width: cell.column.getSize(),
												}}
												className={cn(
													isPinned === 'left' && 'sticky left-0 z-10 bg-background',
													isPinned === 'right' && 'sticky right-0 z-10 bg-background',
												)}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										);
									})}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
