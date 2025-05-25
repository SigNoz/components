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
	// Sample data with nested items and varying content lengths
	const data = [
		{
			id: 'INV001',
			name: 'John Doe',
			status: 'Pending' as 'Paid' | 'Pending' | 'Overdue',
			amount: '125.50',
			hasChildren: true,
			notes: 'This is a short note.',
			items: [
				{
					id: 'INV001-1',
					description: 'Web Development Services',
					quantity: 1,
					unitPrice: 100.0,
					total: 100.0,
				},
				{
					id: 'INV001-2',
					description: 'Hosting (Monthly)',
					quantity: 1,
					unitPrice: 25.5,
					total: 25.5,
				},
			],
		},
		{
			id: 'INV002',
			name: 'Jane Smith',
			status: 'Paid',
			amount: '350.00',
			hasChildren: true,
			notes:
				'This is a longer note that will test dynamic row heights. It contains multiple lines of text to demonstrate how the table handles varying content lengths. The row should expand to accommodate this text while maintaining readability.',
			items: [
				{
					id: 'INV002-1',
					description: 'UI/UX Design',
					quantity: 1,
					unitPrice: 250.0,
					total: 250.0,
				},
				{
					id: 'INV002-2',
					description: 'Consultation',
					quantity: 2,
					unitPrice: 50.0,
					total: 100.0,
				},
			],
		},
		// Add more data to test scrolling
		...Array.from({ length: 20 }, (_, i) => ({
			id: `INV${(i + 3).toString().padStart(3, '0')}`,
			name: `Customer ${i + 3}`,
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
					id: `INV${(i + 3).toString().padStart(3, '0')}-1`,
					description: 'Service A',
					quantity: Math.floor(Math.random() * 5) + 1,
					unitPrice: Math.random() * 100,
					total: 0, // Will be calculated
				},
				{
					id: `INV${(i + 3).toString().padStart(3, '0')}-2`,
					description: 'Service B',
					quantity: Math.floor(Math.random() * 5) + 1,
					unitPrice: Math.random() * 100,
					total: 0, // Will be calculated
				},
			],
		})),
	].map((invoice) => ({
		...invoice,
		items: invoice.items?.map((item) => ({
			...item,
			total: item.quantity * item.unitPrice,
		})),
	}));

	// Custom row component with hover effect and actions
	// const CustomRow = ({
	// 	row,
	// 	children,
	// }: {
	// 	row: any;
	// 	children: React.ReactNode;
	// }) => {
	// 	const [showActions, setShowActions] = React.useState(false);
	// 	console.log('uncaught row', row);

	// 	return (
	// 		<div
	// 			className="relative group flex items-center"
	// 			onMouseEnter={() => setShowActions(true)}
	// 			onMouseLeave={() => setShowActions(false)}
	// 		>
	// 			{children} Jabba
	// 			{showActions && (
	// 				<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
	// 					<button className="p-1 hover:bg-slate-100 rounded-full">
	// 						<Edit className="h-4 w-4" />
	// 					</button>
	// 				</div>
	// 			)}
	// 		</div>
	// 	);
	// };

	return (
		<div className="p-8">
			{/* <div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold">Button Component</h1>
				<ThemeSwitcher />
			</div>

			<hr /> */}

			<div className="my-8">
				<h2 className="text-2xl font-bold mb-4">
					Table Component with Dynamic Heights and Scroll Features
				</h2>
				<DataTable
					tableId="invoices-table"
					enableColumnReordering={true}
					enableColumnResizing={false}
					enableGlobalFilter={true}
					enableRowSelection={true}
					selectionMode="multiple"
					enableDynamicRowHeights={true}
					rowHeight={10}
					enableScrollRestoration={true}
					enablePagination={true}
					pageSize={10}
					pageSizeOptions={[5, 10, 20, 50]}
					onPageChange={(page) => {
						console.log('Page changed:', page);
					}}
					onPageSizeChange={(pageSize) => {
						console.log('Page size changed:', pageSize);
					}}
					onScroll={(position) => {
						console.log('Scroll position:', position);
					}}
					onRowSelectionChange={(selectedRows) => {
						console.log('Selected rows:', selectedRows);
					}}
					onRowClick={(row, event) => {
						console.log('Row clicked:', row.original);
					}}
					onRowDoubleClick={(row, event) => {
						console.log('Row double clicked:', row.original);
					}}
					onCellClick={(cell, event) => {
						console.log('Cell clicked:', cell.getValue());
					}}
					onCellDoubleClick={(cell, event) => {
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
						{
							id: 'notes',
							accessorKey: 'notes',
							header: 'Notes',
							enableSorting: true,
							cell: ({ row }) => {
								const notes = row.getValue('notes') as string;
								return (
									<div className="text-sm text-gray-600 whitespace-pre-wrap">
										{notes}
									</div>
								);
							},
						},
					]}
					data={data}
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
