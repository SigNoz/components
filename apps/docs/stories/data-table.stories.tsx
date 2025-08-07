import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DataTable as BaseDataTable } from '@signozhq/table';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@signozhq/badge';
import { Button } from '@signozhq/button';
import {
	CheckCircle,
	Clock,
	XCircle,
	AlertCircle,
	Eye,
	Edit,
	Trash2,
} from 'lucide-react';

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
type User = {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'user' | 'moderator' | 'guest';
	status: 'active' | 'inactive' | 'pending' | 'suspended';
	lastLogin: string;
	createdAt: string;
	avatar?: string;
	department: string;
	salary: number;
	performance: number;
};

// Enhanced sample data
const users: User[] = [
	{
		id: '1',
		name: 'Sarah Johnson',
		email: 'sarah.johnson@company.com',
		role: 'admin',
		status: 'active',
		lastLogin: '2024-01-15T10:30:00Z',
		createdAt: '2023-03-15',
		avatar:
			'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
		department: 'Engineering',
		salary: 95000,
		performance: 95,
	},
	{
		id: '2',
		name: 'Michael Chen',
		email: 'michael.chen@company.com',
		role: 'user',
		status: 'active',
		lastLogin: '2024-01-14T15:45:00Z',
		createdAt: '2023-06-20',
		avatar:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
		department: 'Marketing',
		salary: 75000,
		performance: 88,
	},
	{
		id: '3',
		name: 'Emily Rodriguez',
		email: 'emily.rodriguez@company.com',
		role: 'moderator',
		status: 'pending',
		lastLogin: '2024-01-10T09:15:00Z',
		createdAt: '2023-09-10',
		avatar:
			'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
		department: 'Support',
		salary: 65000,
		performance: 92,
	},
	{
		id: '4',
		name: 'David Kim',
		email: 'david.kim@company.com',
		role: 'user',
		status: 'inactive',
		lastLogin: '2024-01-05T14:20:00Z',
		createdAt: '2023-11-05',
		avatar:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
		department: 'Sales',
		salary: 80000,
		performance: 78,
	},
	{
		id: '5',
		name: 'Lisa Wang',
		email: 'lisa.wang@company.com',
		role: 'admin',
		status: 'active',
		lastLogin: '2024-01-15T11:00:00Z',
		createdAt: '2023-01-20',
		avatar:
			'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
		department: 'Product',
		salary: 110000,
		performance: 98,
	},
	{
		id: '6',
		name: 'James Wilson',
		email: 'james.wilson@company.com',
		role: 'guest',
		status: 'suspended',
		lastLogin: '2024-01-02T16:30:00Z',
		createdAt: '2023-12-01',
		avatar:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
		department: 'Engineering',
		salary: 85000,
		performance: 65,
	},
];

// Enhanced columns with better visual presentation
const enhancedColumns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: 'Employee',
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
						{user.name
							.split(' ')
							.map((n) => n[0])
							.join('')}
					</div>
					<div className="flex flex-col">
						<span className="font-medium text-sm">{user.name}</span>
						<span className="text-xs text-muted-foreground">{user.email}</span>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: 'role',
		header: 'Role',
		cell: ({ row }) => {
			const role = row.getValue('role') as User['role'];
			const roleMap = {
				admin: {
					label: 'Admin',
					className: 'bg-purple-100 text-purple-800 border-purple-200',
				},
				user: {
					label: 'User',
					className: 'bg-blue-100 text-blue-800 border-blue-200',
				},
				moderator: {
					label: 'Moderator',
					className: 'bg-orange-100 text-orange-800 border-orange-200',
				},
				guest: {
					label: 'Guest',
					className: 'bg-gray-100 text-gray-800 border-gray-200',
				},
			};
			const roleInfo = roleMap[role];
			return (
				<Badge variant="outline" className={roleInfo.className}>
					{roleInfo.label}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.getValue('status') as User['status'];
			const statusMap = {
				active: {
					label: 'Active',
					icon: CheckCircle,
					className: 'bg-green-100 text-green-800 border-green-200',
				},
				inactive: {
					label: 'Inactive',
					icon: XCircle,
					className: 'bg-red-100 text-red-800 border-red-200',
				},
				pending: {
					label: 'Pending',
					icon: Clock,
					className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
				},
				suspended: {
					label: 'Suspended',
					icon: AlertCircle,
					className: 'bg-gray-100 text-gray-800 border-gray-200',
				},
			};
			const statusInfo = statusMap[status];
			const Icon = statusInfo.icon;
			return (
				<div className="flex items-center gap-2">
					<Icon className="h-4 w-4" />
					<Badge variant="outline" className={statusInfo.className}>
						{statusInfo.label}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'department',
		header: 'Department',
		cell: ({ row }) => {
			const department = row.getValue('department') as string;
			return <span className="font-medium text-sm">{department}</span>;
		},
	},
	{
		accessorKey: 'salary',
		header: 'Salary',
		cell: ({ row }) => {
			const salary = parseFloat(row.getValue('salary'));
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}).format(salary);
			return <div className="font-medium text-sm text-green-700">{formatted}</div>;
		},
	},
	{
		accessorKey: 'performance',
		header: 'Performance',
		cell: ({ row }) => {
			const performance = parseFloat(row.getValue('performance'));
			const getPerformanceColor = (score: number) => {
				if (score >= 90) return 'text-green-600';
				if (score >= 80) return 'text-blue-600';
				if (score >= 70) return 'text-yellow-600';
				return 'text-red-600';
			};
			return (
				<div className="flex items-center gap-2">
					<div className="flex-1 bg-gray-200 rounded-full h-2">
						<div
							className={`h-2 rounded-full ${getPerformanceColor(performance)}`}
							style={{ width: `${performance}%` }}
						/>
					</div>
					<span
						className={`text-sm font-medium ${getPerformanceColor(performance)}`}
					>
						{performance}%
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'lastLogin',
		header: 'Last Login',
		cell: ({ row }) => {
			const date = new Date(row.getValue('lastLogin'));
			const formatted = date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
			return <span className="text-sm text-muted-foreground">{formatted}</span>;
		},
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: () => {
			return (
				<div className="flex items-center gap-1">
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
						<Eye className="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
						<Edit className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			);
		},
	},
];

// Simple columns for reorder testing
const simpleColumns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
					{row.original.name
						.split(' ')
						.map((n) => n[0])
						.join('')}
				</div>
				<span className="font-medium">{row.original.name}</span>
			</div>
		),
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => (
			<span className="text-sm text-muted-foreground">{row.original.email}</span>
		),
	},
	{
		accessorKey: 'role',
		header: 'Role',
		cell: ({ row }) => {
			const role = row.original.role;
			const roleMap = {
				admin: { label: 'Admin', className: 'bg-purple-100 text-purple-800' },
				user: { label: 'User', className: 'bg-blue-100 text-blue-800' },
				moderator: {
					label: 'Moderator',
					className: 'bg-orange-100 text-orange-800',
				},
				guest: { label: 'Guest', className: 'bg-gray-100 text-gray-800' },
			};
			const roleInfo = roleMap[role];
			return <Badge className={roleInfo.className}>{roleInfo.label}</Badge>;
		},
	},
];

// Story: Basic DataTable with essential features
export const Basic: StoryObj<typeof DataTable<User>> = {
	render: (args) => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Employee Directory
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					A basic data table with sorting, filtering, and pagination capabilities.
				</p>
				<DataTable {...args} />
			</div>
		</div>
	),
	args: {
		columns: enhancedColumns,
		data: users,
		tableId: 'basic-employees-table',
		enableSorting: true,
		enableFiltering: true,
		enableGlobalFilter: true,
		enableColumnReordering: false,
		enableColumnResizing: false,
		enableColumnPinning: false,
		enableRowSelection: false,
		enablePagination: true,
		pageSize: 5,
		showHeaders: true,
	},
};

// Story: Advanced DataTable with all features
export const Advanced: StoryObj<typeof DataTable<User>> = {
	render: (args) => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Advanced Employee Management
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					Full-featured data table with column reordering, resizing, pinning, row
					selection, and more.
				</p>
				<DataTable {...args} />
			</div>
		</div>
	),
	args: {
		columns: enhancedColumns,
		data: users,
		tableId: 'advanced-employees-table',
		enableSorting: true,
		enableFiltering: true,
		enableGlobalFilter: true,
		enableColumnReordering: true,
		enableColumnResizing: true,
		enableColumnPinning: true,
		enableRowSelection: true,
		enablePagination: true,
		pageSize: 5,
		showHeaders: true,
	},
};

// Story: Column Reordering Demo
export const ColumnReordering: StoryObj<typeof DataTable<User>> = {
	render: (args) => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Column Reordering Demo
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					Drag and drop column headers to reorder them. Try dragging the
					&quot;Name&quot; column to different positions.
				</p>
				<DataTable {...args} />
			</div>
		</div>
	),
	args: {
		columns: simpleColumns,
		data: users,
		tableId: 'reorder-demo-table',
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

// Story: Row Selection Demo
export const RowSelection: StoryObj<typeof DataTable<User>> = {
	render: (args) => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Row Selection Demo
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					Select individual rows or use the header checkbox to select all rows.
					Selected rows are highlighted.
				</p>
				<DataTable {...args} />
			</div>
		</div>
	),
	args: {
		columns: enhancedColumns,
		data: users,
		tableId: 'selection-demo-table',
		enableSorting: true,
		enableFiltering: true,
		enableGlobalFilter: false,
		enableColumnReordering: false,
		enableColumnResizing: false,
		enableColumnPinning: false,
		enableRowSelection: true,
		enablePagination: true,
		pageSize: 5,
		showHeaders: true,
	},
};

// Story: Compact View
export const Compact: StoryObj<typeof DataTable<User>> = {
	render: (args) => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Compact Employee List
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					A compact view with essential information only, perfect for mobile or
					space-constrained layouts.
				</p>
				<DataTable {...args} />
			</div>
		</div>
	),
	args: {
		columns: [
			{
				accessorKey: 'name',
				header: 'Employee',
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
							{row.original.name
								.split(' ')
								.map((n) => n[0])
								.join('')}
						</div>
						<span className="font-medium text-sm">{row.original.name}</span>
					</div>
				),
			},
			{
				accessorKey: 'role',
				header: 'Role',
				cell: ({ row }) => {
					const role = row.original.role;
					const roleMap = {
						admin: { label: 'Admin', className: 'bg-purple-100 text-purple-800' },
						user: { label: 'User', className: 'bg-blue-100 text-blue-800' },
						moderator: { label: 'Mod', className: 'bg-orange-100 text-orange-800' },
						guest: { label: 'Guest', className: 'bg-gray-100 text-gray-800' },
					};
					const roleInfo = roleMap[role];
					return (
						<Badge className={`text-xs ${roleInfo.className}`}>
							{roleInfo.label}
						</Badge>
					);
				},
			},
			{
				accessorKey: 'status',
				header: 'Status',
				cell: ({ row }) => {
					const status = row.original.status;
					const statusMap = {
						active: { icon: CheckCircle, className: 'text-green-600' },
						inactive: { icon: XCircle, className: 'text-red-600' },
						pending: { icon: Clock, className: 'text-yellow-600' },
						suspended: { icon: AlertCircle, className: 'text-gray-600' },
					};
					const statusInfo = statusMap[status];
					const Icon = statusInfo.icon;
					return <Icon className={`h-4 w-4 ${statusInfo.className}`} />;
				},
			},
		],
		data: users,
		tableId: 'compact-employees-table',
		enableSorting: true,
		enableFiltering: false,
		enableGlobalFilter: false,
		enableColumnReordering: false,
		enableColumnResizing: false,
		enableColumnPinning: false,
		enableRowSelection: false,
		enablePagination: true,
		pageSize: 10,
		showHeaders: true,
	},
};

const meta: Meta<typeof DataTable<User>> = {
	title: 'Components/DataTable',
	component: DataTable,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `
## DataTable Component

The DataTable component is a powerful, feature-rich table built on top of TanStack Table. It provides advanced functionality including:

### Key Features
- **Sorting**: Click column headers to sort data
- **Filtering**: Filter data by individual columns or globally
- **Column Reordering**: Drag and drop columns to reorder them
- **Column Resizing**: Resize columns by dragging their edges
- **Column Pinning**: Pin columns to the left or right
- **Row Selection**: Select individual or all rows
- **Pagination**: Navigate through large datasets
- **Virtualization**: Efficient rendering of large datasets
- **Row Expansion**: Expand rows to show additional content
- **Custom Cells**: Fully customizable cell rendering
- **State Persistence**: Automatically saves user preferences

### Usage Examples
- **Basic**: Simple table with essential features
- **Advanced**: Full-featured table with all capabilities
- **Column Reordering**: Demo of drag-and-drop column reordering
- **Row Selection**: Interactive row selection with highlighting
- **Compact**: Space-efficient view for mobile or constrained layouts

### Props
The DataTable accepts all standard table features as props, allowing you to enable or disable specific functionality based on your needs.
				`,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		enableSorting: {
			control: 'boolean',
			description: 'Enable column sorting functionality',
		},
		enableFiltering: {
			control: 'boolean',
			description: 'Enable individual column filtering',
		},
		enableGlobalFilter: {
			control: 'boolean',
			description: 'Enable global search across all columns',
		},
		enableColumnReordering: {
			control: 'boolean',
			description: 'Enable drag-and-drop column reordering',
		},
		enableColumnResizing: {
			control: 'boolean',
			description: 'Enable column width resizing',
		},
		enableColumnPinning: {
			control: 'boolean',
			description: 'Enable column pinning to left or right',
		},
		enableRowSelection: {
			control: 'boolean',
			description: 'Enable row selection with checkboxes',
		},
		enablePagination: {
			control: 'boolean',
			description: 'Enable pagination controls',
		},
		pageSize: {
			control: 'number',
			description: 'Number of rows per page',
		},
		showHeaders: {
			control: 'boolean',
			description: 'Show or hide table headers',
		},
	},
};

export default meta;
