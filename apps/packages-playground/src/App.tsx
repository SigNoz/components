import React from 'react';
// import { Button } from '@signozhq/button';
import './App.css';
// import { ThemeSwitcher } from '@signozhq/theme';
// import { Code } from 'lucide-react';
import { DataTable } from '@signozhq/table/data-table';

// const VARIANTS = ['solid', 'outlined', 'dashed', 'ghost', 'link'] as const;
// const COLORS = ['primary', 'destructive', 'warning', 'secondary'] as const;

function App() {
	return (
		<div className="p-8">
			{/* <div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold">Button Component</h1>
				<ThemeSwitcher />
			</div>

			<hr /> */}

			<div className="my-8">
				<h2 className="text-2xl font-bold mb-4">Table Component</h2>
				<DataTable
					tableId="invoices-table"
					enableColumnReordering={true}
					enableGlobalFilter={true}
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
					data={[
						{
							id: 'INV001',
							name: 'John Doe',
							status: 'Pending',
							amount: '125.50',
						},
						{
							id: 'INV002',
							name: 'Jane Smith',
							status: 'Paid',
							amount: '350.00',
						},
						{
							id: 'INV003',
							name: 'Robert Johnson',
							status: 'Overdue',
							amount: '780.25',
						},
						{
							id: 'INV004',
							name: 'Emily Davis',
							status: 'Paid',
							amount: '210.75',
						},
					]}
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
