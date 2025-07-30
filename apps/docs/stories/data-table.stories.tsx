import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DataTable as BaseDataTable } from '@signozhq/table';
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
					className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}
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
			return <div className="font-medium">{formatted}</div>;
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
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'role',
		header: 'Role',
	},
];

// Simple columns for reorder testing
const simpleColumns: ColumnDef<Payment>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'role',
		header: 'Role',
	},
];

// Simple story for testing reorder functionality
export const ReorderTest: StoryObj<typeof DataTable<Payment>> = {
	render: (args) => <DataTable {...args} />,
	args: {
		columns: simpleColumns,
		data,
		tableId: 'reorder-test-table',
		enableColumnReordering: true,
		enableColumnResizing: false,
		enableSorting: false,
		enableFiltering: false,
		enableGlobalFilter: false,
		enableColumnPinning: false,
		enableRowSelection: false,
		enablePagination: false,
		showHeaders: true,
	},
};

// DataTable Story
export const AdvancedDataTable: StoryObj<typeof DataTable<Payment>> = {
	render: (args) => <DataTable {...args} />,
	args: {
		columns,
		data,
		tableId: 'payments-table',
		enableSorting: true,
		enableFiltering: true,
		enableGlobalFilter: true,
		enableColumnReordering: true,
		enableColumnResizing: true,
		enableColumnPinning: true,
		enableRowSelection: true,
		enablePagination: true,
		pageSize: 5,
	},
};

const meta: Meta<typeof DataTable<Payment>> = {
	title: 'Components/DataTable',
	component: DataTable,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		enableSorting: {
			control: 'boolean',
		},
		enableFiltering: {
			control: 'boolean',
		},
		enableGlobalFilter: {
			control: 'boolean',
		},
		enableColumnReordering: {
			control: 'boolean',
		},
		enableColumnResizing: {
			control: 'boolean',
		},
		enableColumnPinning: {
			control: 'boolean',
		},
		enableRowSelection: {
			control: 'boolean',
		},
		enablePagination: {
			control: 'boolean',
		},
	},
};

export default meta;
