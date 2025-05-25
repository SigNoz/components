import React from 'react';
// import { Button } from '@signozhq/button';
import './App.css';
// import { ThemeSwitcher } from '@signozhq/theme';
// import { Code } from 'lucide-react';
import { DataTable } from '@signozhq/table/data-table';

// const VARIANTS = ['solid', 'outlined', 'dashed', 'ghost', 'link'] as const;
// const COLORS = ['primary', 'destructive', 'warning', 'secondary'] as const;

// Define types for our data
interface InvoiceItem {
	id: string;
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
}

interface Invoice {
	id: string;
	name: string;
	status: 'Paid' | 'Pending' | 'Overdue';
	amount: string;
	items?: InvoiceItem[];
	hasChildren?: boolean;
}

function App() {
	// Sample data with nested items
	const data: Invoice[] = [
		{
			id: 'INV001',
			name: 'John Doe',
			status: 'Pending',
			amount: '125.50',
			hasChildren: true,
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
		{
			id: 'INV003',
			name: 'Robert Johnson',
			status: 'Overdue',
			amount: '780.25',
			hasChildren: true,
			items: [
				{
					id: 'INV003-1',
					description: 'Software License',
					quantity: 1,
					unitPrice: 500.0,
					total: 500.0,
				},
				{
					id: 'INV003-2',
					description: 'Technical Support',
					quantity: 5,
					unitPrice: 56.05,
					total: 280.25,
				},
			],
		},
		{
			id: 'INV004',
			name: 'Emily Davis',
			status: 'Paid',
			amount: '210.75',
			hasChildren: true,
			items: [
				{
					id: 'INV004-1',
					description: 'Content Writing',
					quantity: 1,
					unitPrice: 150.0,
					total: 150.0,
				},
				{
					id: 'INV004-2',
					description: 'SEO Services',
					quantity: 1,
					unitPrice: 60.75,
					total: 60.75,
				},
			],
		},
	];

	// Nested table columns for invoice items
	// const itemColumns = [
	// 	{
	// 		id: 'description',
	// 		accessorKey: 'description',
	// 		header: 'Description',
	// 	},
	// 	{
	// 		id: 'quantity',
	// 		accessorKey: 'quantity',
	// 		header: 'Quantity',
	// 		cell: ({ row }: { row: any }) => {
	// 			return <div className="text-right">{row.getValue('quantity')}</div>;
	// 		},
	// 	},
	// 	{
	// 		id: 'unitPrice',
	// 		accessorKey: 'unitPrice',
	// 		header: 'Unit Price',
	// 		cell: ({ row }: { row: any }) => {
	// 			const price = parseFloat(row.getValue('unitPrice'));
	// 			return <div className="text-right">${price.toFixed(2)}</div>;
	// 		},
	// 	},
	// 	{
	// 		id: 'total',
	// 		accessorKey: 'total',
	// 		header: 'Total',
	// 		cell: ({ row }: { row: any }) => {
	// 			const total = parseFloat(row.getValue('total'));
	// 			return <div className="text-right font-medium">${total.toFixed(2)}</div>;
	// 		},
	// 	},
	// ];

	return (
		<div className="p-8">
			{/* <div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold">Button Component</h1>
				<ThemeSwitcher />
			</div>

			<hr /> */}

			<div className="my-8">
				<h2 className="text-2xl font-bold mb-4">
					Table Component with Row Expansion
				</h2>
				<DataTable
					tableId="invoices-table"
					enableColumnReordering={true}
					enableColumnResizing={false}
					enableGlobalFilter={true}
					enableRowSelection={true}
					enableRowExpansion={true}
					getRowCanExpand={(row) => row.original.hasChildren || false}
					expandOnRowClick={true}
					selectionMode="multiple"
					onRowSelectionChange={(selectedRows) => {
						console.log('Selected rows:', selectedRows);
					}}
					renderSubComponent={() => {
						// const invoice = row.original as Invoice;
						return (
							<div className="p-4">
								<h3 className="text-lg font-semibold mb-4">Invoice Items</h3>
								{/* <DataTable
									tableId={`invoice-items-${invoice.id}`}
									columns={itemColumns}
									data={invoice.items || []}
									enableColumnResizing={false}
									enableSorting={true}
									enableRowSelection={true}
								/> */}
							</div>
						);
					}}
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
								const status = row.getValue('status') as string;
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
