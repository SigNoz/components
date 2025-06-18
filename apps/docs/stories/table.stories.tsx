import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DataTable as BaseDataTable } from '@signozhq/table/data-table';
import type { ColumnDef } from '@tanstack/react-table';

// Create a properly typed wrapper component
const DataTable = <TData,>({
	columns,
	data,
	tableId,
	...props
}: React.ComponentProps<typeof BaseDataTable<TData, unknown>>) => (
	<BaseDataTable columns={columns} data={data} tableId={tableId} {...props} />
);

// Define the type for our data
type Payment = {
	id: string;
	email: string;
	status: 'pending' | 'processing' | 'success' | 'failed';
	amount: number;
	date: string;
	paymentMethod: string;
	name: string;
	role: string;
};

// Sample data
const data: Payment[] = [
	{
		id: 'm5gr84i9',
		amount: 316,
		status: 'success',
		email: 'ken99@example.com',
		date: '2023-05-15',
		paymentMethod: 'Credit Card',
		name: 'John Doe',
		role: 'Admin',
	},
	{
		id: '3u1reuv4',
		amount: 242,
		status: 'success',
		email: 'alice@example.com',
		date: '2023-05-16',
		paymentMethod: 'PayPal',
		name: 'Jane Doe',
		role: 'User',
	},
	{
		id: 'derv1ws0',
		amount: 837,
		status: 'processing',
		email: 'bob@example.com',
		date: '2023-05-17',
		paymentMethod: 'Credit Card',
		name: 'Bob Smith',
		role: 'Moderator',
	},
	{
		id: '5kma53ae',
		amount: 874,
		status: 'success',
		email: 'john@example.com',
		date: '2023-05-17',
		paymentMethod: 'Bank Transfer',
		name: 'John Smith',
		role: 'Admin',
	},
	{
		id: 'bhqecj4p',
		amount: 721,
		status: 'failed',
		email: 'jane@example.com',
		date: '2023-05-18',
		paymentMethod: 'Credit Card',
		name: 'Jane Smith',
		role: 'User',
	},
];

// Define columns
const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.getValue('status') as Payment['status'];
			const statusMap = {
				success: { label: 'Success', className: 'bg-green-100 text-green-800' },
				processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800' },
				pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
				failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
			};
			const statusInfo = statusMap[status] || {
				label: status,
				className: 'bg-gray-100 text-gray-800',
			};

			return (
				<div
					className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo.className}`}
				>
					{statusInfo.label}
				</div>
			);
		},
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('amount'));
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount);

			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: 'date',
		header: 'Date',
	},
	{
		accessorKey: 'paymentMethod',
		header: 'Payment Method',
	},
];

// Meta configuration
const meta: Meta<typeof DataTable<Payment>> = {
	title: 'Components/DataTable',
	component: DataTable,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		data: { control: false },
		columns: { control: false },
		enableRowSelection: { control: 'boolean' },
		enableSorting: { control: 'boolean' },
		enableColumnResizing: { control: 'boolean' },
		enableColumnReordering: { control: 'boolean' },
		enablePagination: { control: 'boolean' },
		enableVirtualization: { control: 'boolean' },
	},
};

// Define the story type
type Story = StoryObj<typeof DataTable<Payment>>;

export default meta;

// Basic Table Story
export const Basic: Story = {
	args: {
		data,
		columns,
		tableId: 'basic-table',
		enablePagination: true,
	},
};

// Table with Row Selection
export const WithRowSelection: Story = {
	args: {
		data,
		columns,
		tableId: 'row-selection-table',
		enableRowSelection: true,
		enablePagination: true,
	},
};

// Table with Sorting
export const WithSorting: Story = {
	args: {
		data,
		columns,
		tableId: 'sorting-table',
		enableSorting: true,
		enablePagination: true,
	},
};

// Table with Column Resizing
export const WithColumnResizing: Story = {
	args: {
		data,
		columns,
		tableId: 'resizing-table',
		enableColumnResizing: true,
		defaultColumnWidth: 180,
		minColumnWidth: 100,
		maxColumnWidth: 300,
		enablePagination: true,
	},
};

// Table with Column Reordering
export const WithColumnReordering: Story = {
	args: {
		data,
		columns,
		tableId: 'reordering-table',
		enableColumnReordering: true,
		enablePagination: true,
	},
};

// Virtualized Table
export const Virtualized: Story = {
	args: {
		data: Array.from({ length: 1000 }, (_, i) => ({
			id: `row-${i}`,
			email: `user${i}@example.com`,
			status: ['pending', 'processing', 'success', 'failed'][
				Math.floor(Math.random() * 4)
			],
			amount: Math.floor(Math.random() * 1000) + 100,
			date: new Date(
				Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
			)
				.toISOString()
				.split('T')[0],
			method: ['Credit Card', 'PayPal', 'Bank Transfer', 'Crypto'][
				Math.floor(Math.random() * 4)
			],
		})),
		columns,
		tableId: 'virtualized-table',
		enableVirtualization: true,
		estimateRowSize: 50, // Estimated row height in pixels
		enablePagination: false,
	},
};

// Table with Server-side Pagination
export const WithServerSidePagination: Story = {
	args: {
		data,
		columns,
		tableId: 'server-pagination-table',
		enablePagination: true,
		serverSidePagination: true,
		totalCount: 100, // Total number of items on the server
		onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => {
			console.log('Pagination changed:', pagination);
			// In a real app, you would fetch data from the server here
		},
	},
};

// Table with Infinite Scroll
export const WithInfiniteScroll: Story = {
	args: {
		data: Array.from({ length: 50 }, (_, i) => ({
			id: `row-${i}`,
			email: `user${i}@example.com`,
			status: ['pending', 'processing', 'success', 'failed'][
				Math.floor(Math.random() * 4)
			],
			amount: Math.floor(Math.random() * 1000) + 100,
			date: new Date(
				Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
			)
				.toISOString()
				.split('T')[0],
			method: ['Credit Card', 'PayPal', 'Bank Transfer', 'Crypto'][
				Math.floor(Math.random() * 4)
			],
		})),
		columns,
		tableId: 'infinite-scroll-table',
		enablePagination: false,
		enableInfiniteScroll: true,
		hasMore: true,
		onLoadMore: () => {
			console.log('Loading more data...');
			// In a real app, you would fetch more data here
		},
	},
};
