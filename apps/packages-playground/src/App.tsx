import React from 'react';
// import { Button } from '@signozhq/button';
import './App.css';
// import { ThemeSwitcher } from '@signozhq/theme';
// import { Code } from 'lucide-react';
import { DataTable } from '@signozhq/table/data-table';
// import { Row, Cell } from '@tanstack/react-table';
// import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

// const VARIANTS = ['solid', 'outlined', 'dashed', 'ghost', 'link'] as const;
// const COLORS = ['primary', 'destructive', 'warning', 'secondary'] as const;

// Define types for our data
// interface InvoiceItem {
// 	id: string;
// 	description: string;
// 	quantity: number;
// 	unitPrice: number;
// 	total: number;
// }

// interface Invoice {
// 	id: string;
// 	name: string;
// 	status: 'Paid' | 'Pending' | 'Overdue';
// 	amount: string;
// 	items?: InvoiceItem[];
// 	hasChildren?: boolean;
// 	notes?: string; // Added for testing dynamic heights
// }

function App() {
	const [data, setData] = React.useState<any[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [loadingMore, setLoadingMore] = React.useState(false);
	const [hasMore, setHasMore] = React.useState(true);
	const [page, setPage] = React.useState(1);
	const pageSize = 20;

	// Large dataset for virtualization demo
	const [virtualizedData, setVirtualizedData] = React.useState<any[]>([]);

	// State for virtualized table with infinite scroll and BE pagination
	const [virtualizedInfiniteData, setVirtualizedInfiniteData] = React.useState<
		any[]
	>([]);
	const [virtualizedIsLoading, setVirtualizedIsLoading] = React.useState(false);
	const [virtualizedLoadingMore, setVirtualizedLoadingMore] =
		React.useState(false);
	const [virtualizedHasMore, setVirtualizedHasMore] = React.useState(true);
	const [virtualizedPage, setVirtualizedPage] = React.useState(1);
	const virtualizedPageSize = 50; // Larger page size for virtualization

	// State for server-side pagination table
	const [serverData, setServerData] = React.useState<any[]>([]);
	const [serverIsLoading, setServerIsLoading] = React.useState(false);
	const [serverTotalCount, setServerTotalCount] = React.useState(0);
	const [serverPagination, setServerPagination] = React.useState({
		pageIndex: 0,
		pageSize: 25,
	});

	// Generate large dataset for virtualization
	React.useEffect(() => {
		const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
			id: `ROW${(i + 1).toString().padStart(5, '0')}`,
			name: `User ${i + 1}`,
			email: `user${i + 1}@example.com`,
			status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
			score: Math.floor(Math.random() * 100),
			department: ['Engineering', 'Sales', 'Marketing', 'Support'][
				Math.floor(Math.random() * 4)
			],
			joinDate: new Date(
				2020 + Math.floor(Math.random() * 4),
				Math.floor(Math.random() * 12),
				Math.floor(Math.random() * 28) + 1,
			).toLocaleDateString(),
		}));
		setVirtualizedData(largeDataset);
	}, []);

	// Simulate server-side data fetching
	const fetchData = React.useCallback(
		async (pageNumber: number, isLoadMore: boolean = false) => {
			if (isLoadMore) {
				setLoadingMore(true);
			} else {
				setIsLoading(true);
			}

			try {
				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Generate data for the current page
				const startIndex = (pageNumber - 1) * pageSize;
				const pageData = Array.from({ length: pageSize }, (_, i) => ({
					id: `INV${(startIndex + i + 1).toString().padStart(3, '0')}`,
					name: `Customer ${startIndex + i + 1}`,
					status: ['Paid', 'Pending', 'Overdue'][Math.floor(Math.random() * 3)] as
						| 'Paid'
						| 'Pending'
						| 'Overdue',
					amount: (Math.random() * 1000).toFixed(2),
					hasChildren: true,
					notes:
						i % 3 === 0
							? 'This is a short note.'
							: i % 3 === 1
								? 'This is a medium length note that will test dynamic row heights.'
								: 'This is a very long note that will test dynamic row heights. It contains multiple lines of text to demonstrate how the table handles varying content lengths. The row should expand to accommodate this text while maintaining readability.',
					items: [
						{
							id: `INV${(startIndex + i + 1).toString().padStart(3, '0')}-1`,
							description: 'Service A',
							quantity: Math.floor(Math.random() * 5) + 1,
							unitPrice: Math.random() * 100,
							total: 0,
						},
						{
							id: `INV${(startIndex + i + 1).toString().padStart(3, '0')}-2`,
							description: 'Service B',
							quantity: Math.floor(Math.random() * 5) + 1,
							unitPrice: Math.random() * 100,
							total: 0,
						},
					],
				})).map((invoice) => ({
					...invoice,
					items: invoice.items?.map((item) => ({
						...item,
						total: item.quantity * item.unitPrice,
					})),
				}));

				// Simulate reaching the end of data after 5 pages
				if (pageNumber >= 5) {
					setHasMore(false);
				}

				setData((prev) => (isLoadMore ? [...prev, ...pageData] : pageData));
				setPage(pageNumber);
			} finally {
				setIsLoading(false);
				setLoadingMore(false);
			}
		},
		[],
	);

	// Simulate server-side data fetching for virtualized infinite scroll
	const fetchVirtualizedData = React.useCallback(
		async (pageNumber: number, isLoadMore: boolean = false) => {
			if (isLoadMore) {
				setVirtualizedLoadingMore(true);
			} else {
				setVirtualizedIsLoading(true);
			}

			try {
				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 800));

				// Generate data for the current page
				const startIndex = (pageNumber - 1) * virtualizedPageSize;
				const pageData = Array.from({ length: virtualizedPageSize }, (_, i) => ({
					id: `VIR${(startIndex + i + 1).toString().padStart(5, '0')}`,
					name: `Virtual User ${startIndex + i + 1}`,
					email: `virtual.user${startIndex + i + 1}@example.com`,
					status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
					score: Math.floor(Math.random() * 100),
					department: [
						'Engineering',
						'Sales',
						'Marketing',
						'Support',
						'HR',
						'Finance',
					][Math.floor(Math.random() * 6)],
					joinDate: new Date(
						2020 + Math.floor(Math.random() * 4),
						Math.floor(Math.random() * 12),
						Math.floor(Math.random() * 28) + 1,
					).toLocaleDateString(),
					salary: Math.floor(Math.random() * 100000) + 50000,
					location: ['New York', 'San Francisco', 'London', 'Tokyo', 'Berlin'][
						Math.floor(Math.random() * 5)
					],
				}));

				// Simulate reaching the end of data after 20 pages (1000 total records)
				if (pageNumber >= 20) {
					setVirtualizedHasMore(false);
				}

				setVirtualizedInfiniteData((prev) =>
					isLoadMore ? [...prev, ...pageData] : pageData,
				);
				setVirtualizedPage(pageNumber);
			} finally {
				setVirtualizedIsLoading(false);
				setVirtualizedLoadingMore(false);
			}
		},
		[],
	);

	// Simulate server-side pagination data fetching
	const fetchServerData = React.useCallback(
		async (pagination: { pageIndex: number; pageSize: number }) => {
			setServerIsLoading(true);

			try {
				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Simulate total count of 500 records
				const totalCount = 500;
				setServerTotalCount(totalCount);

				// Generate data for the current page
				const startIndex = pagination.pageIndex * pagination.pageSize;
				const pageData = Array.from({ length: pagination.pageSize }, (_, i) => {
					const globalIndex = startIndex + i;
					if (globalIndex >= totalCount) return null;

					return {
						id: `SRV${(globalIndex + 1).toString().padStart(4, '0')}`,
						name: `Server User ${globalIndex + 1}`,
						email: `server.user${globalIndex + 1}@example.com`,
						status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
						score: Math.floor(Math.random() * 100),
						department: ['Engineering', 'Sales', 'Marketing', 'Support', 'HR'][
							Math.floor(Math.random() * 5)
						],
						joinDate: new Date(
							2020 + Math.floor(Math.random() * 4),
							Math.floor(Math.random() * 12),
							Math.floor(Math.random() * 28) + 1,
						).toLocaleDateString(),
						role: ['Developer', 'Manager', 'Analyst', 'Designer'][
							Math.floor(Math.random() * 4)
						],
					};
				}).filter(Boolean);

				setServerData(pageData);
			} finally {
				setServerIsLoading(false);
			}
		},
		[],
	);

	// Initial data fetch
	React.useEffect(() => {
		fetchData(1);
		fetchVirtualizedData(1);
		fetchServerData(serverPagination);
	}, [fetchData, fetchVirtualizedData, fetchServerData]);

	// Handle load more
	const handleLoadMore = React.useCallback(() => {
		if (!loadingMore && hasMore) {
			fetchData(page + 1, true);
		}
	}, [fetchData, loadingMore, hasMore, page]);

	// Handle virtualized load more
	const handleVirtualizedLoadMore = React.useCallback(() => {
		if (!virtualizedLoadingMore && virtualizedHasMore) {
			fetchVirtualizedData(virtualizedPage + 1, true);
		}
	}, [
		fetchVirtualizedData,
		virtualizedLoadingMore,
		virtualizedHasMore,
		virtualizedPage,
	]);

	// Handle server pagination change
	const handleServerPaginationChange = React.useCallback(
		(pagination: { pageIndex: number; pageSize: number }) => {
			setServerPagination(pagination);
			fetchServerData(pagination);
		},
		[fetchServerData],
	);

	return (
		<div className="p-8">
			{/* <div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold">Button Component</h1>
				<ThemeSwitcher />
			</div>

			<hr /> */}

			<div className="my-8">
				<h2 className="text-2xl font-bold mb-4">
					Table Component with Infinite Scroll
				</h2>
				<DataTable
					tableId="invoices-table"
					enableColumnReordering={true}
					enableColumnResizing={true}
					enableGlobalFilter={true}
					enableRowSelection={true}
					selectionMode="multiple"
					enableDynamicRowHeights={true}
					rowHeight={10}
					enableScrollRestoration={true}
					enableInfiniteScroll={true}
					hasMore={hasMore}
					loadingMore={loadingMore}
					onLoadMore={handleLoadMore}
					isLoading={isLoading}
					onScroll={(position) => {
						console.log('Scroll position:', position);
					}}
					onRowSelectionChange={(selectedRows) => {
						console.log('Selected rows:', selectedRows);
					}}
					onRowClick={(row) => {
						console.log('Row clicked:', row.original);
					}}
					onRowDoubleClick={(row) => {
						console.log('Row double clicked:', row.original);
					}}
					onCellClick={(cell) => {
						console.log('Cell clicked:', cell.getValue());
					}}
					onCellDoubleClick={(cell) => {
						console.log('Cell double clicked:', cell.getValue());
					}}
					stopPropagationOnRowClick={false}
					stopPropagationOnCellClick={false}
					columns={[
						{
							id: 'id',
							accessorKey: 'id',
							header: 'ID',
							enableSorting: true,
							filterFn: 'includesString',
						},
						{
							id: 'name',
							accessorKey: 'name',
							header: 'Name',
							enableSorting: true,
							enableColumnFilter: false,
						},
						{
							id: 'status',
							accessorKey: 'status',
							header: 'Status',
							enableSorting: true,
							cell: ({ row }) => {
								const status = row.getValue('status') as 'Paid' | 'Pending' | 'Overdue';
								return (
									<div
										className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
											status === 'Paid'
												? 'bg-green-100 text-green-800'
												: status === 'Pending'
													? 'bg-yellow-100 text-yellow-800'
													: status === 'Overdue'
														? 'bg-red-100 text-red-800'
														: ''
										}`}
									>
										{status}
									</div>
								);
							},
						},
						{
							id: 'amount',
							accessorKey: 'amount',
							header: 'Amount',
							enableSorting: true,
							cell: ({ row }) => {
								const amount = parseFloat(row.getValue('amount'));
								return (
									<div className="text-right font-medium">${amount.toFixed(2)}</div>
								);
							},
						},
						// {
						// 	id: 'notes',
						// 	accessorKey: 'notes',
						// 	header: 'Notes',
						// 	enableSorting: true,
						// 	cell: ({ row }) => {
						// 		const notes = row.getValue('notes') as string;
						// 		return (
						// 			<div className="text-sm text-gray-600 whitespace-pre-wrap">
						// 				{notes}
						// 			</div>
						// 		);
						// 	},
						// },
					]}
					data={data}
				/>
			</div>

			<div className="my-8">
				<h2 className="text-2xl font-bold mb-4">
					Virtualized Table Component (10,000 rows)
				</h2>
				<p className="text-gray-600 mb-4">
					This table demonstrates virtualization with 10,000 rows. Only visible rows
					are rendered for optimal performance.
				</p>
				<DataTable
					tableId="virtualized-table"
					enableVirtualization={true}
					estimateRowSize={50}
					overscan={10}
					enableColumnReordering={false}
					enableColumnResizing={true}
					enableGlobalFilter={true}
					enableRowSelection={true}
					selectionMode="multiple"
					rowHeight={50}
					onVirtualizerChange={(virtualizer) => {
						console.log('Virtualizer instance:', virtualizer);
					}}
					onRowSelectionChange={(selectedRows) => {
						console.log('Selected virtualized rows:', selectedRows);
					}}
					columns={[
						{
							id: 'id',
							accessorKey: 'id',
							header: 'ID',
							enableSorting: true,
							size: 120,
						},
						{
							id: 'name',
							accessorKey: 'name',
							header: 'Name',
							enableSorting: true,
							size: 150,
						},
						{
							id: 'email',
							accessorKey: 'email',
							header: 'Email',
							enableSorting: true,
							size: 200,
						},
						{
							id: 'status',
							accessorKey: 'status',
							header: 'Status',
							enableSorting: true,
							size: 100,
							cell: ({ row }) => {
								const status = row.getValue('status') as
									| 'Active'
									| 'Inactive'
									| 'Pending';
								return (
									<div
										className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
											status === 'Active'
												? 'bg-green-100 text-green-800'
												: status === 'Inactive'
													? 'bg-gray-100 text-gray-800'
													: 'bg-yellow-100 text-yellow-800'
										}`}
									>
										{status}
									</div>
								);
							},
						},
						{
							id: 'score',
							accessorKey: 'score',
							header: 'Score',
							enableSorting: true,
							size: 80,
							cell: ({ row }) => {
								const score = row.getValue('score') as number;
								return <div className="text-right font-medium">{score}</div>;
							},
						},
						{
							id: 'department',
							accessorKey: 'department',
							header: 'Department',
							enableSorting: true,
							size: 120,
						},
						{
							id: 'joinDate',
							accessorKey: 'joinDate',
							header: 'Join Date',
							enableSorting: true,
							size: 120,
						},
					]}
					data={virtualizedData}
				/>
			</div>

			<div className="my-8">
				<h2 className="text-2xl font-bold mb-4">
					Virtualized Table with Infinite Scroll & Backend Pagination
				</h2>
				<p className="text-gray-600 mb-4">
					This table combines virtualization with infinite scroll and backend
					pagination. Data is fetched in chunks of {virtualizedPageSize} rows as you
					scroll. Currently showing {virtualizedInfiniteData.length} rows.
				</p>
				<DataTable
					tableId="virtualized-infinite-table"
					enableVirtualization={true}
					estimateRowSize={60}
					overscan={15}
					enableColumnReordering={false}
					enableColumnResizing={true}
					enableGlobalFilter={true}
					enableRowSelection={true}
					selectionMode="multiple"
					rowHeight={60}
					enableInfiniteScroll={true}
					hasMore={virtualizedHasMore}
					loadingMore={virtualizedLoadingMore}
					onLoadMore={handleVirtualizedLoadMore}
					isLoading={virtualizedIsLoading}
					onVirtualizerChange={(virtualizer) => {
						console.log('Virtualized infinite scroll virtualizer:', virtualizer);
					}}
					onRowSelectionChange={(selectedRows) => {
						console.log('Selected virtualized infinite rows:', selectedRows);
					}}
					onScroll={(position) => {
						console.log('Virtualized infinite scroll position:', position);
					}}
					columns={[
						{
							id: 'id',
							accessorKey: 'id',
							header: 'ID',
							enableSorting: true,
							size: 120,
						},
						{
							id: 'name',
							accessorKey: 'name',
							header: 'Name',
							enableSorting: true,
							size: 150,
						},
						{
							id: 'email',
							accessorKey: 'email',
							header: 'Email',
							enableSorting: true,
							size: 220,
						},
						{
							id: 'status',
							accessorKey: 'status',
							header: 'Status',
							enableSorting: true,
							size: 100,
							cell: ({ row }) => {
								const status = row.getValue('status') as
									| 'Active'
									| 'Inactive'
									| 'Pending';
								return (
									<div
										className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
											status === 'Active'
												? 'bg-green-100 text-green-800'
												: status === 'Inactive'
													? 'bg-gray-100 text-gray-800'
													: 'bg-yellow-100 text-yellow-800'
										}`}
									>
										{status}
									</div>
								);
							},
						},
						{
							id: 'score',
							accessorKey: 'score',
							header: 'Score',
							enableSorting: true,
							size: 80,
							cell: ({ row }) => {
								const score = row.getValue('score') as number;
								return <div className="text-right font-medium">{score}</div>;
							},
						},
						{
							id: 'department',
							accessorKey: 'department',
							header: 'Department',
							enableSorting: true,
							size: 120,
						},
						{
							id: 'salary',
							accessorKey: 'salary',
							header: 'Salary',
							enableSorting: true,
							size: 120,
							cell: ({ row }) => {
								const salary = row.getValue('salary') as number;
								return (
									<div className="text-right font-medium">
										${salary.toLocaleString()}
									</div>
								);
							},
						},
						{
							id: 'location',
							accessorKey: 'location',
							header: 'Location',
							enableSorting: true,
							size: 120,
						},
					]}
					data={virtualizedInfiniteData}
				/>
			</div>

			<div className="my-8">
				<h2 className="text-2xl font-bold mb-4">
					Virtualized Table with Server-Side Pagination
				</h2>
				<p className="text-gray-600 mb-4">
					This table demonstrates virtualization with traditional server-side
					pagination. Total records: {serverTotalCount}. Use pagination controls to
					navigate.
				</p>
				<DataTable
					tableId="server-pagination-table"
					enableVirtualization={true}
					estimateRowSize={55}
					overscan={10}
					showHeaders={false}
					enableColumnReordering={false}
					enableColumnResizing={true}
					enableGlobalFilter={false}
					enableRowSelection={true}
					selectionMode="multiple"
					rowHeight={55}
					enablePagination={true}
					serverSidePagination={true}
					totalCount={serverTotalCount}
					pageSize={serverPagination.pageSize}
					pageSizeOptions={[10, 25, 50, 100]}
					isLoading={serverIsLoading}
					onPaginationChange={handleServerPaginationChange}
					onVirtualizerChange={(virtualizer) => {
						console.log('Server pagination virtualizer:', virtualizer);
					}}
					onRowSelectionChange={(selectedRows) => {
						console.log('Selected server pagination rows:', selectedRows);
					}}
					columns={[
						{
							id: 'id',
							accessorKey: 'id',
							header: 'ID',
							enableSorting: true,
							size: 100,
						},
						{
							id: 'name',
							accessorKey: 'name',
							header: 'Name',
							enableSorting: true,
							size: 150,
						},
						{
							id: 'email',
							accessorKey: 'email',
							header: 'Email',
							enableSorting: true,
							size: 200,
						},
						{
							id: 'status',
							accessorKey: 'status',
							header: 'Status',
							enableSorting: true,
							size: 100,
							cell: ({ row }) => {
								const status = row.getValue('status') as
									| 'Active'
									| 'Inactive'
									| 'Pending';
								return (
									<div
										className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
											status === 'Active'
												? 'bg-green-100 text-green-800'
												: status === 'Inactive'
													? 'bg-gray-100 text-gray-800'
													: 'bg-yellow-100 text-yellow-800'
										}`}
									>
										{status}
									</div>
								);
							},
						},
						{
							id: 'score',
							accessorKey: 'score',
							header: 'Score',
							enableSorting: true,
							size: 80,
							cell: ({ row }) => {
								const score = row.getValue('score') as number;
								return <div className="text-right font-medium">{score}</div>;
							},
						},
						{
							id: 'department',
							accessorKey: 'department',
							header: 'Department',
							enableSorting: true,
							size: 120,
						},
						{
							id: 'role',
							accessorKey: 'role',
							header: 'Role',
							enableSorting: true,
							size: 120,
						},
						{
							id: 'joinDate',
							accessorKey: 'joinDate',
							header: 'Join Date',
							enableSorting: true,
							size: 120,
						},
					]}
					data={serverData}
				/>
			</div>

			{/* <div className="space-y-12">
				{COLORS.map((color) => (
					<div key={color} className="space-y-4">
						<h2
							className=""
							style={{ textAlign: 'left', fontSize: '16px', fontWeight: '600' }}
						>
							{color}
						</h2>
						<div className="grid gap-4" style={{ display: 'flex' }}>
							{VARIANTS.map((variant) => (
								<div key={variant} className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Button
											variant={variant}
											color={color}
											prefixIcon={<Code />}
											suffixIcon={<Code />}
										>
											{variant}
										</Button>
										<p className="text-sm text-slate-500">Normal state</p>
									</div>
									<div className="space-y-2">
										<Button
											variant={variant}
											color={color}
											prefixIcon={<Code />}
											suffixIcon={<Code />}
											disabled
										>
											{variant}
										</Button>
										<p className="text-sm text-slate-500">Disabled state</p>
									</div>
									<div className="space-y-2">
										<Button
											variant={variant}
											color={color}
											prefixIcon={<Code />}
											suffixIcon={<Code />}
											loading
										>
											{variant}
										</Button>
										<p className="text-sm text-slate-500">Loading state</p>
									</div>
								</div>
							))}
						</div>
						<hr />
					</div>
				))}
			</div> */}
		</div>
	);
}

export default App;
