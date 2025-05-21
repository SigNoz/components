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
} from '@tanstack/react-table';
import { cn } from './lib/utils';
import {
	getTablePreferences,
	saveTablePreferences,
	TablePreferences,
} from './lib/preferences';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
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
	enableColumnResizing?: boolean;
	enableSorting?: boolean;
	enableFiltering?: boolean;
	enableColumnReordering?: boolean;
	defaultColumnWidth?: number;
	minColumnWidth?: number;
	maxColumnWidth?: number;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	tableId,
	enableColumnResizing = true,
	enableSorting = true,
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

	// Load preferences on mount
	React.useEffect(() => {
		const preferences = getTablePreferences(tableId);
		if (preferences.columnOrder) setColumnOrder(preferences.columnOrder);
		if (preferences.columnVisibility)
			setColumnVisibility(preferences.columnVisibility);
		if (preferences.columnSizing) setColumnSizing(preferences.columnSizing);
		if (preferences.sortState) setSorting(preferences.sortState);
	}, [tableId]);

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
			columnOrder,
			columnSizing,
		},
		columnResizeMode: 'onChange',
		onSortingChange: setSorting,
		onColumnSizingChange: setColumnSizing,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		enableSorting,
		enableColumnResizing,
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

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const column = header.column;
								const isSorted = column.getIsSorted();

								return (
									<TableHead
										key={header.id}
										style={{
											width: header.getSize(),
										}}
										className="relative"
									>
										<div className="flex items-center gap-2">
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
								{row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
									<TableCell
										key={cell.id}
										style={{
											width: cell.column.getSize(),
										}}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
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
	);
}
