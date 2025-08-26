import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
	DataTable as BaseDataTable,
	type ColumnDef,
	type Row,
} from '@signozhq/table';
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
import type { LucideIcon } from 'lucide-react';

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
	{
		id: '7',
		name: 'John Doe',
		email: 'john.doe@company.com',
		role: 'admin',
		status: 'active',
		lastLogin: '2024-01-02T16:30:00Z',
		createdAt: '2023-12-01',
		avatar:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
		department: 'Engineering',
		salary: 85000,
		performance: 65,
	},
	{
		id: '8',
		name: 'John Doe',
		email: 'john.doe@company.com',
		role: 'admin',
		status: 'active',
		lastLogin: '2024-01-02T16:30:00Z',
		createdAt: '2023-12-01',
		avatar:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
		department: 'Engineering',
		salary: 85000,
		performance: 65,
	},
	{
		id: '9',
		name: 'John Doe',
		email: 'john.doe@company.com',
		role: 'admin',
		status: 'active',
		lastLogin: '2024-01-02T16:30:00Z',
		createdAt: '2023-12-01',
		avatar:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
		department: 'Engineering',
		salary: 85000,
		performance: 65,
	},
	{
		id: '10',
		name: 'John Doe',
		email: 'john.doe@company.com',
		role: 'admin',
		status: 'active',
		lastLogin: '2024-01-02T16:30:00Z',
		createdAt: '2023-12-01',
		avatar:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
		department: 'Engineering',
		salary: 85000,
		performance: 65,
	},
	{
		id: '11',
		name: 'John Doe',
		email: 'john.doe@company.com',
		role: 'admin',
		status: 'active',
		lastLogin: '2024-01-02T16:30:00Z',
		createdAt: '2023-12-01',
		avatar:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
		department: 'Engineering',
		salary: 85000,
		performance: 65,
	},
	{
		id: '12',
		name: 'John Doe',
		email: 'john.doe@company.com',
		role: 'admin',
		status: 'active',
		lastLogin: '2024-01-02T16:30:00Z',
		createdAt: '2023-12-01',
		avatar:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
		department: 'Engineering',
		salary: 85000,
		performance: 65,
	},
];

// Enhanced columns with better visual presentation and individual width constraints
const enhancedColumns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: 'Employee',
		size: 250, // Default width
		minSize: 200, // Minimum width
		maxSize: 350, // Maximum width
		cell: ({ row }: { row: Row<User> }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
						{user.name
							.split(' ')
							.map((n: string) => n[0])
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
		size: 120, // Default width
		minSize: 100, // Minimum width
		maxSize: 150, // Maximum width
		cell: ({ row }: { row: Row<User> }) => {
			const role = row.getValue('role') as User['role'];
			const roleMap: Record<User['role'], { label: string; className: string }> = {
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
		size: 140, // Default width
		minSize: 120, // Minimum width
		maxSize: 180, // Maximum width
		cell: ({ row }: { row: Row<User> }) => {
			const status = row.getValue('status') as User['status'];
			const statusMap: Record<
				User['status'],
				{ label: string; icon: LucideIcon; className: string }
			> = {
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
		size: 150, // Default width
		minSize: 120, // Minimum width
		maxSize: 200, // Maximum width
		cell: ({ row }: { row: Row<User> }) => {
			const department = row.getValue('department') as string;
			return <span className="font-medium text-sm">{department}</span>;
		},
	},
	{
		accessorKey: 'salary',
		header: 'Salary',
		size: 120, // Default width
		minSize: 100, // Minimum width
		maxSize: 150, // Maximum width
		cell: ({ row }: { row: Row<User> }) => {
			const salary = parseFloat(row.getValue('salary') as string);
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
		size: 180, // Default width
		minSize: 150, // Minimum width
		maxSize: 250, // Maximum width
		cell: ({ row }: { row: Row<User> }) => {
			const performance = parseFloat(row.getValue('performance') as string);
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
		size: 140, // Default width
		minSize: 120, // Minimum width
		maxSize: 180, // Maximum width
		cell: ({ row }: { row: Row<User> }) => {
			const date = new Date(row.getValue('lastLogin') as string);
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
		cell: ({ row }: { row: Row<User> }) => (
			<div className="flex items-center gap-2">
				<div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
					{row.original.name
						.split(' ')
						.map((n: string) => n[0])
						.join('')}
				</div>
				<span className="font-medium">{row.original.name}</span>
			</div>
		),
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }: { row: Row<User> }) => (
			<span className="text-sm text-muted-foreground">{row.original.email}</span>
		),
	},
	{
		accessorKey: 'role',
		header: 'Role',
		cell: ({ row }: { row: Row<User> }) => {
			const role = row.original.role;
			const roleMap: Record<User['role'], { label: string; className: string }> = {
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
				cell: ({ row }: { row: Row<User> }) => (
					<div className="flex items-center gap-2">
						<div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
							{row.original.name
								.split(' ')
								.map((n: string) => n[0])
								.join('')}
						</div>
						<span className="font-medium text-sm">{row.original.name}</span>
					</div>
				),
			},
			{
				accessorKey: 'role',
				header: 'Role',
				cell: ({ row }: { row: Row<User> }) => {
					const role = row.original.role;
					const roleMap: Record<User['role'], { label: string; className: string }> =
						{
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
				cell: ({ row }: { row: Row<User> }) => {
					const status = row.original.status;
					const statusMap: Record<
						User['status'],
						{ icon: LucideIcon; className: string }
					> = {
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

// Story: Column Resizing Demo
export const ColumnResizing: StoryObj<typeof DataTable<User>> = {
	render: (args) => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Column Resizing Demo
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					Hover over column headers to see the resize handle. Drag the right edge of
					column headers to resize them. Double-click the resize handle to reset
					column width.
				</p>
				<DataTable {...args} />
			</div>
		</div>
	),
	args: {
		columns: [
			{
				accessorKey: 'name',
				header: 'Employee Name',
				cell: ({ row }: { row: Row<User> }) => (
					<div className="flex items-center gap-2">
						<div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
							{row.original.name
								.split(' ')
								.map((n: string) => n[0])
								.join('')}
						</div>
						<span className="font-medium">{row.original.name}</span>
					</div>
				),
			},
			{
				accessorKey: 'email',
				header: 'Email Address',
				cell: ({ row }: { row: Row<User> }) => (
					<span className="text-sm text-muted-foreground">{row.original.email}</span>
				),
			},
			{
				accessorKey: 'role',
				header: 'Role',
				cell: ({ row }: { row: Row<User> }) => {
					const role = row.original.role;
					const roleMap: Record<User['role'], { label: string; className: string }> =
						{
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
			{
				accessorKey: 'department',
				header: 'Department',
				cell: ({ row }: { row: Row<User> }) => (
					<span className="font-medium text-sm">{row.original.department}</span>
				),
			},
			{
				accessorKey: 'salary',
				header: 'Salary',
				cell: ({ row }: { row: Row<User> }) => {
					const salary = parseFloat(row.getValue('salary') as string);
					const formatted = new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					}).format(salary);
					return (
						<div className="font-medium text-sm text-green-700">{formatted}</div>
					);
				},
			},
		],
		data: users,
		tableId: 'resize-demo-table',
		enableColumnResizing: true,
		enableSorting: false,
		enableFiltering: false,
		enableGlobalFilter: false,
		enableColumnReordering: false,
		enableColumnPinning: false,
		enableRowSelection: false,
		enablePagination: false,
		showHeaders: true,
		defaultColumnWidth: 200,
		minColumnWidth: 100,
		maxColumnWidth: 400,
	},
};

// Story: All Features Demo
export const AllFeatures: StoryObj<typeof DataTable<User>> = {
	render: (args) => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					All Features Demo
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					This table demonstrates all available features: column reordering,
					resizing, sorting, filtering, pinning, row selection, and pagination. Try
					hovering over headers to see resize handles, drag columns to reorder, click
					headers to sort, use the filter buttons, and select rows with checkboxes.
				</p>
				<DataTable {...args} />
			</div>
		</div>
	),
	args: {
		columns: [
			{
				id: 'serial',
				header: '#',
				cell: ({ row }: { row: Row<User> }) => (
					<div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-medium">
						{row.index + 1}
					</div>
				),
				size: 60,
			},
			{
				accessorKey: 'name',
				header: 'Employee Name',
				cell: ({ row }: { row: Row<User> }) => (
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
							{row.original.name
								.split(' ')
								.map((n: string) => n[0])
								.join('')}
						</div>
						<div className="flex flex-col">
							<span className="font-medium text-sm">{row.original.name}</span>
							<span className="text-xs text-muted-foreground">
								{row.original.email}
							</span>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'role',
				header: 'Role',
				cell: ({ row }: { row: Row<User> }) => {
					const role = row.original.role;
					const roleMap: Record<User['role'], { label: string; className: string }> =
						{
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
				cell: ({ row }: { row: Row<User> }) => {
					const status = row.original.status;
					const statusMap: Record<
						User['status'],
						{ label: string; icon: React.ComponentType; className: string }
					> = {
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
							<Icon />
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
				cell: ({ row }: { row: Row<User> }) => (
					<span className="font-medium text-sm">{row.original.department}</span>
				),
			},
			{
				accessorKey: 'salary',
				header: 'Salary',
				cell: ({ row }: { row: Row<User> }) => {
					const salary = parseFloat(row.getValue('salary') as string);
					const formatted = new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					}).format(salary);
					return (
						<div className="font-medium text-sm text-green-700">{formatted}</div>
					);
				},
			},
			{
				accessorKey: 'performance',
				header: 'Performance',
				cell: ({ row }: { row: Row<User> }) => {
					const performance = parseFloat(row.getValue('performance') as string);
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
				cell: ({ row }: { row: Row<User> }) => {
					const date = new Date(row.getValue('lastLogin') as string);
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
		],
		data: users,
		tableId: 'all-features-table',
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
		defaultColumnWidth: 180,
		minColumnWidth: 100,
		maxColumnWidth: 400,
	},
};

// Generate large dataset for virtualization demo (supports offset for unique ids)
const generateLargeDataset = (count: number, startIndex = 0): User[] => {
	const departments = [
		'Engineering',
		'Marketing',
		'Sales',
		'Support',
		'Product',
		'Design',
		'Finance',
		'HR',
	];
	const roles = ['admin', 'user', 'moderator', 'guest'] as const;
	const statuses = ['active', 'inactive', 'pending', 'suspended'] as const;

	return Array.from({ length: count }, (_, index) => ({
		id: `${startIndex + index + 1}`,
		name: `User ${startIndex + index + 1}`,
		email: `user${startIndex + index + 1}@company.com`,
		role: roles[index % roles.length],
		status: statuses[index % statuses.length],
		lastLogin: new Date(
			Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
		).toISOString(),
		createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split('T')[0],
		avatar: `https://images.unsplash.com/photo-${1500000000000 + index}?w=32&h=32&fit=crop&crop=face`,
		department: departments[index % departments.length],
		salary: 50000 + Math.floor(Math.random() * 100000),
		performance: 60 + Math.floor(Math.random() * 40),
	}));
};

const largeDataset = generateLargeDataset(1000, 0);

// Story: Virtualization with All Features
export const VirtualizationWithFeatures: StoryObj<typeof DataTable<User>> = {
	render: (args) => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Virtualization with All Features
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					This table demonstrates virtualization with 1000 rows, plus all interactive
					features: column reordering, resizing, sorting, filtering, and row
					selection. The table uses virtual scrolling for optimal performance with
					large datasets. Try scrolling, resizing columns, reordering, and selecting
					rows to see how virtualization maintains smooth performance.
				</p>
				<DataTable {...args} fixedHeight={600} />
			</div>
		</div>
	),
	args: {
		columns: [
			{
				accessorKey: 'name',
				header: 'Employee Name',
				cell: ({ row }: { row: Row<User> }) => (
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
							{row.original.name
								.split(' ')
								.map((n: string) => n[0])
								.join('')}
						</div>
						<div className="flex flex-col">
							<span className="font-medium text-sm">{row.original.name}</span>
							<span className="text-xs text-muted-foreground">
								{row.original.email}
							</span>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'role',
				header: 'Role',
				cell: ({ row }: { row: Row<User> }) => {
					const role = row.original.role;
					const roleMap: Record<User['role'], { label: string; className: string }> =
						{
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
				cell: ({ row }: { row: Row<User> }) => {
					const status = row.original.status;
					const statusMap: Record<
						User['status'],
						{ label: string; icon: React.ComponentType; className: string }
					> = {
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
							<Icon />
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
				cell: ({ row }: { row: Row<User> }) => (
					<span className="font-medium text-sm">{row.original.department}</span>
				),
			},
			{
				accessorKey: 'salary',
				header: 'Salary',
				cell: ({ row }: { row: Row<User> }) => {
					const salary = parseFloat(row.getValue('salary') as string);
					const formatted = new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					}).format(salary);
					return (
						<div className="font-medium text-sm text-green-700">{formatted}</div>
					);
				},
			},
			{
				accessorKey: 'performance',
				header: 'Performance',
				cell: ({ row }: { row: Row<User> }) => {
					const performance = parseFloat(row.getValue('performance') as string);
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
				cell: ({ row }: { row: Row<User> }) => {
					const date = new Date(row.getValue('lastLogin') as string);
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
		],
		data: largeDataset,
		tableId: 'virtualization-features-table',
		enableSorting: true,
		enableFiltering: true,
		enableGlobalFilter: true,
		enableColumnReordering: true,
		enableColumnResizing: true,
		enableColumnPinning: true,
		enableRowSelection: true,
		enablePagination: false, // Disable pagination for virtualization demo
		showHeaders: true,
		defaultColumnWidth: 180,
		minColumnWidth: 100,
		maxColumnWidth: 400,
		// Virtualization settings
		enableVirtualization: true,
		estimateRowSize: 60,
		overscan: 10,
		rowHeight: 60,
		enableDynamicRowHeights: false,
	},
};

// Story: Infinite Scroll with Load More
export const InfiniteScroll: StoryObj<typeof DataTable<User>> = {
	render: (args) => {
		const [data, setData] = React.useState<User[]>([]);
		const [loading, setLoading] = React.useState(false);
		const [hasMore, setHasMore] = React.useState(true);
		const [page, setPage] = React.useState(0);
		const itemsPerPage = 50;
		const maxItems = 200;

		// Load initial data
		React.useEffect(() => {
			const initialData = generateLargeDataset(itemsPerPage, 0);
			setData(initialData);
			setPage(1);
		}, []);

		// Simulate loading more data
		const loadMore = React.useCallback(() => {
			if (loading || !hasMore) return;

			setLoading(true);
			setTimeout(() => {
				const offset = page * itemsPerPage;
				const remaining = Math.max(0, maxItems - offset);
				const take = Math.min(itemsPerPage, remaining);
				const newData = take > 0 ? generateLargeDataset(take, offset) : [];
				setData((prev) => [...prev, ...newData]);
				const nextPage = page + 1;
				setPage(nextPage);
				setLoading(false);
				if (nextPage * itemsPerPage >= maxItems) {
					setHasMore(false);
				}
			}, 1000);
		}, [loading, hasMore, page]);

		return (
			<div className="space-y-4">
				<div className="border rounded-lg p-6 bg-background">
					<h3 className="text-lg font-semibold mb-2 text-foreground">
						Infinite Scroll with Load More
					</h3>
					<p className="text-sm text-muted-foreground mb-4">
						This table demonstrates infinite scrolling with 50 items loaded initially.
						Scroll to the bottom to automatically load more items. The table maintains
						all interactive features while efficiently loading data on demand.
					</p>
					<div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
						<span>Loaded: {data.length} items</span>
						<span>Page: {page}</span>
						{loading && (
							<span className="flex items-center gap-2">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
								Loading more...
							</span>
						)}
						{!hasMore && <span className="text-green-600">All items loaded</span>}
					</div>
					<DataTable
						{...args}
						data={data}
						tableId="infinite-scroll-table"
						enableInfiniteScroll={true}
						hasMore={hasMore}
						onLoadMore={loadMore}
						loadingMore={loading}
					/>
				</div>
			</div>
		);
	},
	args: {
		columns: [
			{
				accessorKey: 'name',
				header: 'Employee Name',
				cell: ({ row }: { row: Row<User> }) => (
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
							{row.original.name
								.split(' ')
								.map((n: string) => n[0])
								.join('')}
						</div>
						<div className="flex flex-col">
							<span className="font-medium text-sm">{row.original.name}</span>
							<span className="text-xs text-muted-foreground">
								{row.original.email}
							</span>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'role',
				header: 'Role',
				cell: ({ row }: { row: Row<User> }) => {
					const role = row.original.role;
					const roleMap: Record<User['role'], { label: string; className: string }> =
						{
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
				cell: ({ row }: { row: Row<User> }) => {
					const status = row.original.status;
					const statusMap: Record<
						User['status'],
						{ label: string; icon: React.ComponentType; className: string }
					> = {
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
							<Icon />
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
				cell: ({ row }: { row: Row<User> }) => (
					<span className="font-medium text-sm">{row.original.department}</span>
				),
			},
			{
				accessorKey: 'salary',
				header: 'Salary',
				cell: ({ row }: { row: Row<User> }) => {
					const salary = parseFloat(row.getValue('salary') as string);
					const formatted = new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					}).format(salary);
					return (
						<div className="font-medium text-sm text-green-700">{formatted}</div>
					);
				},
			},
			{
				accessorKey: 'performance',
				header: 'Performance',
				cell: ({ row }: { row: Row<User> }) => {
					const performance = parseFloat(row.getValue('performance') as string);
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
				cell: ({ row }: { row: Row<User> }) => {
					const date = new Date(row.getValue('lastLogin') as string);
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
		],
		tableId: 'infinite-scroll-table',
		enableSorting: true,
		enableFiltering: true,
		enableGlobalFilter: true,
		enableColumnReordering: true,
		enableColumnResizing: true,
		enableColumnPinning: true,
		enableRowSelection: true,
		enablePagination: false, // Disable pagination for infinite scroll
		showHeaders: true,
		defaultColumnWidth: 180,
		minColumnWidth: 100,
		maxColumnWidth: 400,
		// Virtualization settings for smooth scrolling
		enableVirtualization: true,
		estimateRowSize: 60,
		overscan: 10,
		rowHeight: 60,
		enableDynamicRowHeights: false,
	},
};

// Story: Virtualized Infinite Scroll with Resize + Reorder
export const VirtualizedInfiniteScrollDndResize: StoryObj<
	typeof DataTable<User>
> = {
	render: (args) => {
		const [data, setData] = React.useState<User[]>([]);
		const [loading, setLoading] = React.useState(false);
		const [hasMore, setHasMore] = React.useState(true);
		const [page, setPage] = React.useState(0);
		const itemsPerPage = 100;
		const maxItems = 1000;
		const [orderedColumns, setOrderedColumns] = React.useState<ColumnDef<User>[]>(
			[],
		);

		React.useEffect(() => {
			setData(generateLargeDataset(itemsPerPage, 0));
			setPage(1);
		}, []);

		const loadMore = React.useCallback(() => {
			if (loading || !hasMore) return;
			setLoading(true);
			// Simulate API latency
			setTimeout(() => {
				const offset = page * itemsPerPage;
				const remaining = Math.max(0, maxItems - offset);
				const take = Math.min(itemsPerPage, remaining);
				const newData = take > 0 ? generateLargeDataset(take, offset) : [];
				setData((prev) => [...prev, ...newData]);
				const nextPage = page + 1;
				setPage(nextPage);
				setLoading(false);
				if (nextPage * itemsPerPage >= maxItems) setHasMore(false);
			}, 600);
		}, [loading, hasMore, page]);

		return (
			<div className="space-y-4">
				<div className="border rounded-lg p-6 bg-background">
					<h3 className="text-lg font-semibold mb-2 text-foreground">
						Virtualized Infinite Scroll + Reorder + Resize
					</h3>
					<p className="text-sm text-muted-foreground mb-4">
						Large dataset with virtualized rows, drag-and-drop column reordering, and
						on-change column resizing. Scroll to load more.
					</p>
					<div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
						<span>Rows: {data.length}</span>
						<span>Page: {page}</span>
						{loading && <span>Loading…</span>}
						{!hasMore && <span className="text-green-600">All items loaded</span>}
						{orderedColumns.length > 0 && (
							<span className="truncate">
								Order:{' '}
								{orderedColumns
									.map((c) =>
										String(
											(c as { id?: string; accessorKey?: string }).id ??
												(c as { accessorKey?: string }).accessorKey ??
												'?',
										),
									)
									.join(' | ')}
							</span>
						)}
					</div>
					<DataTable
						{...args}
						data={data}
						hasMore={hasMore}
						onLoadMore={loadMore}
						loadingMore={loading}
						onColumnOrderChange={setOrderedColumns}
					/>
				</div>
			</div>
		);
	},
	args: {
		columns: [
			{
				id: 'serial',
				header: '#',
				size: 72,
				cell: ({ row }: { row: Row<User> }) => row.index + 1,
			},
			{
				accessorKey: 'name',
				header: 'Name',
				size: 220,
				minSize: 120,
				maxSize: 360,
			},
			{
				accessorKey: 'email',
				header: 'Email',
				size: 260,
				minSize: 160,
				maxSize: 460,
			},
			{
				accessorKey: 'role',
				header: 'Role',
				size: 140,
				minSize: 100,
				maxSize: 220,
			},
			{
				accessorKey: 'status',
				header: 'Status',
				size: 160,
				minSize: 120,
				maxSize: 240,
			},
			{
				accessorKey: 'department',
				header: 'Department',
				size: 180,
				minSize: 120,
				maxSize: 280,
			},
			{
				accessorKey: 'salary',
				header: 'Salary',
				size: 140,
				minSize: 100,
				maxSize: 220,
			},
			{
				accessorKey: 'performance',
				header: 'Performance',
				size: 200,
				minSize: 120,
				maxSize: 300,
			},
			{
				accessorKey: 'lastLogin',
				header: 'Last Login',
				size: 180,
				minSize: 120,
				maxSize: 260,
			},
		],
		tableId: 'virtualized-infinite-reorder-resize',
		enableSorting: false,
		enableFiltering: true,
		enableGlobalFilter: false,
		enableColumnReordering: true,
		enableColumnResizing: true,
		enableColumnPinning: true,
		enableRowSelection: true,
		enablePagination: false,
		showHeaders: true,
		defaultColumnWidth: 180,
		minColumnWidth: 80,
		maxColumnWidth: 480,
		// Virtualization + Infinite Scroll
		enableVirtualization: true,
		estimateRowSize: 56,
		overscan: 10,
		rowHeight: 56,
		enableInfiniteScroll: true,
		enableScrollRestoration: false,
		fixedHeight: 600,
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
		enableStickyHeaders: {
			control: 'boolean',
			description: 'Enable sticky headers that remain visible when scrolling',
		},
		fixedHeight: {
			control: 'text',
			description: 'Fixed height for the table container (e.g., "400px" or 400)',
		},
	},
};

export default meta;

export const StickyHeaders: StoryObj<typeof DataTable<User>> = {
	args: {
		columns: [
			{
				accessorKey: 'id',
				header: 'ID',
				size: 80,
			},
			{
				accessorKey: 'name',
				header: 'Employee Name',
				size: 200,
				cell: ({ row }: { row: Row<User> }) => (
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
							{row.original.name
								.split(' ')
								.map((n) => n[0])
								.join('')
								.toUpperCase()}
						</div>
						<div className="flex flex-col">
							<span className="font-medium text-sm">{row.original.name}</span>
							<span className="text-xs text-muted-foreground">
								{row.original.email}
							</span>
						</div>
					</div>
				),
			},
			{
				accessorKey: 'role',
				header: 'Role',
				size: 120,
				cell: ({ row }: { row: Row<User> }) => {
					const roleMap: Record<User['role'], { label: string; className: string }> =
						{
							admin: { label: 'Admin', className: 'bg-red-100 text-red-800' },
							user: { label: 'User', className: 'bg-blue-100 text-blue-800' },
							moderator: {
								label: 'Moderator',
								className: 'bg-yellow-100 text-yellow-800',
							},
							guest: { label: 'Guest', className: 'bg-gray-100 text-gray-800' },
						};
					const role = roleMap[row.original.role];
					return <Badge className={role.className}>{role.label}</Badge>;
				},
			},
			{
				accessorKey: 'status',
				header: 'Status',
				size: 120,
				cell: ({ row }: { row: Row<User> }) => {
					const statusMap: Record<
						User['status'],
						{ icon: LucideIcon; className: string }
					> = {
						active: { icon: CheckCircle, className: 'text-green-600' },
						inactive: { icon: XCircle, className: 'text-red-600' },
						pending: { icon: Clock, className: 'text-yellow-600' },
						suspended: { icon: AlertCircle, className: 'text-orange-600' },
					};
					const status = statusMap[row.original.status];
					const Icon = status.icon;
					return (
						<div className="flex items-center gap-2">
							<Icon className="h-4 w-4" />
							<span className="capitalize text-sm">{row.original.status}</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'department',
				header: 'Department',
				size: 150,
			},
			{
				accessorKey: 'salary',
				header: 'Annual Salary',
				size: 140,
				cell: ({ row }: { row: Row<User> }) => (
					<span className="font-mono text-sm">
						${row.original.salary.toLocaleString()}
					</span>
				),
			},
			{
				accessorKey: 'performance',
				header: 'Performance',
				size: 120,
				cell: ({ row }: { row: Row<User> }) => {
					const score = row.original.performance;
					const getPerformanceColor = (score: number) => {
						if (score >= 90) return 'text-green-600';
						if (score >= 80) return 'text-blue-600';
						if (score >= 70) return 'text-yellow-600';
						return 'text-red-600';
					};
					return (
						<div className="flex items-center gap-3">
							<span className={`font-medium text-sm ${getPerformanceColor(score)}`}>
								{score}%
							</span>
							<div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
								<div
									className={`h-2 rounded-full transition-all duration-300 ${getPerformanceColor(score).replace('text-', 'bg-')}`}
									style={{ width: `${score}%` }}
								/>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: 'lastLogin',
				header: 'Last Active',
				size: 140,
				cell: ({ row }: { row: Row<User> }) => (
					<span className="text-sm text-muted-foreground">
						{new Date(row.original.lastLogin).toLocaleDateString()}
					</span>
				),
			},
		],
		data: generateLargeDataset(100), // More rows to better demonstrate scrolling
		tableId: 'sticky-headers-table',
		enableSorting: true,
		enableFiltering: true,
		enableColumnResizing: true,
		enableColumnReordering: true,
		enableColumnPinning: true,
		enableRowSelection: true,
		enableStickyHeaders: true,
		fixedHeight: 600, // Taller for better demo
		showHeaders: true,
		defaultColumnWidth: 150,
		minColumnWidth: 80,
		maxColumnWidth: 800, // Increased to allow full width usage
	},
	parameters: {
		docs: {
			description: {
				story: `
## Sticky Headers

This example demonstrates the sticky headers feature with an employee directory. The table has a fixed height of 500px, and when you scroll through the data, the headers remain visible at the top.

### Key Features:
- **Sticky Headers**: Headers stay visible while scrolling through 100+ employee records
- **Fixed Height**: Table container has a defined height with smooth scrolling
- **Rich Data Display**: Shows employee avatars, performance bars, and status indicators
- **All Interactive Features**: Includes sorting, filtering, column resizing, and row selection
- **No Layout Shift**: Headers maintain perfect alignment during scroll

### Visual Improvements:
- **Employee Cards**: Name and email displayed together with avatar
- **Performance Bars**: Visual progress bars for performance scores
- **Status Indicators**: Icons with color-coded status
- **Better Typography**: Improved text hierarchy and spacing

### Usage:
\`\`\`tsx
<DataTable
  columns={columns}
  data={data}
  tableId="sticky-table"
  enableStickyHeaders={true}
  fixedHeight={500}
  enableSorting={true}
  enableFiltering={true}
  enableColumnResizing={true}
  enableRowSelection={true}
/>
\`\`\`
				`,
			},
		},
	},
};

// Story: Scroll to Index Functionality
export const ScrollToIndex: StoryObj<typeof DataTable<User>> = {
	args: {
		columns: enhancedColumns,
		data: generateLargeDataset(200), // Generate more data for better scrolling demo
		tableId: 'scroll-to-index-table',
		enableVirtualization: true,
		enableStickyHeaders: true,
		fixedHeight: 500,
		enableSorting: true,
		enableFiltering: true,
		enableColumnResizing: true,
		enableRowSelection: true,
		estimateRowSize: 60,
		overscan: 5,
	},
	render: (args) => {
		const ScrollToIndexDemo = () => {
			const scrollToIndexRef = React.useRef<
				| ((
						rowIndex: number,
						options?: { align?: 'start' | 'center' | 'end' },
				  ) => void)
				| undefined
			>();

			const handleScrollToUser = (userId: string) => {
				const userIndex = args.data.findIndex((user) => user.id === userId);
				console.log(
					`[Virtualized] Looking for user ID: ${userId}, found at index: ${userIndex}`,
				);
				console.log(
					'[Virtualized] Available users:',
					args.data.slice(0, 5).map((u) => ({ id: u.id, name: u.name })),
				);
				if (userIndex !== -1 && scrollToIndexRef.current) {
					console.log(`[Virtualized] Scrolling to index: ${userIndex}`);
					scrollToIndexRef.current(userIndex, { align: 'center' });
				} else {
					console.log(
						`[Virtualized] User with ID ${userId} not found or scrollToIndexRef not available`,
					);
				}
			};

			const handleScrollToRandom = () => {
				if (scrollToIndexRef.current) {
					const randomIndex = Math.floor(Math.random() * args.data.length);
					scrollToIndexRef.current(randomIndex, { align: 'center' });
				}
			};

			return (
				<div className="space-y-4">
					<div className="flex flex-wrap gap-2">
						<Button
							onClick={() => handleScrollToUser('1')}
							variant="outlined"
							size="sm"
						>
							Scroll to User 1
						</Button>
						<Button
							onClick={() => handleScrollToUser('50')}
							variant="outlined"
							size="sm"
						>
							Scroll to User 50
						</Button>
						<Button
							onClick={() => handleScrollToUser('100')}
							variant="outlined"
							size="sm"
						>
							Scroll to User 100
						</Button>
						<Button
							onClick={() => handleScrollToUser('150')}
							variant="outlined"
							size="sm"
						>
							Scroll to User 150
						</Button>
						<Button
							onClick={() => handleScrollToUser('200')}
							variant="outlined"
							size="sm"
						>
							Scroll to Last User
						</Button>
						<Button onClick={handleScrollToRandom} variant="outlined" size="sm">
							Scroll to Random User
						</Button>
					</div>
					<DataTable {...args} scrollToIndexRef={scrollToIndexRef} />
				</div>
			);
		};

		return <ScrollToIndexDemo />;
	},
	parameters: {
		docs: {
			description: {
				story: `
## Scroll to Index Functionality

This example demonstrates the new scroll to index functionality that allows you to programmatically scroll to specific rows in the table.

### Key Features:
- **Programmatic Scrolling**: Scroll to any row by its index
- **Alignment Options**: Choose how the row is positioned in the viewport
- **Virtualization Support**: Works seamlessly with virtualized tables
- **Interactive Controls**: Buttons to test different scroll scenarios

### Scroll Options:
- **\`align: 'start'\`**: Align row to the top of the viewport
- **\`align: 'center'\`**: Align row to the center of the viewport (default)
- **\`align: 'end'\`**: Align row to the bottom of the viewport

### Usage:
\`\`\`tsx
import { useRef } from 'react';

function MyTable({ users }) {
  const scrollToIndexRef = useRef<((rowIndex: number, options?: { align?: 'start' | 'center' | 'end' }) => void) | undefined>();

  const scrollToUser = (userId: string) => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1 && scrollToIndexRef.current) {
      scrollToIndexRef.current(userIndex, { align: 'center' });
    }
  };

  return (
    <DataTable
      columns={columns}
      data={users}
      tableId="my-table"
      fixedHeight={500}
      enableVirtualization={true}
      scrollToIndexRef={scrollToIndexRef}
    />
  );
}
\`\`\`

### Benefits:
- **User Experience**: Allow users to quickly navigate to specific data
- **Search Integration**: Perfect for highlighting search results
- **Navigation**: Build custom navigation controls
- **Performance**: Efficient scrolling even with large datasets
				`,
			},
		},
	},
};

export const IndividualColumnWidths: StoryObj<typeof DataTable<User>> = {
	args: {
		columns: enhancedColumns, // Uses columns with individual size/minSize/maxSize
		data: users,
		tableId: 'individual-widths-table',
		enableColumnResizing: true,
		defaultColumnWidth: 150,
		fixedHeight: 600,
		minColumnWidth: 80,
		maxColumnWidth: 400,
	},
	parameters: {
		docs: {
			description: {
				story: `
## Individual Column Width Constraints

This example demonstrates how to set individual width constraints for each column using TanStack Table's built-in properties.

### Column Width Properties:
- **\`size\`**: Default width of the column
- **\`minSize\`**: Minimum width the column can be resized to
- **\`maxSize\`**: Maximum width the column can be resized to

### Example Configuration:
\`\`\`tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Employee',
    size: 250,        // Default width
    minSize: 200,     // Minimum width
    maxSize: 350,     // Maximum width
    cell: ({ row }) => { /* ... */ }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    size: 120,        // Default width
    minSize: 100,     // Minimum width
    maxSize: 150,     // Maximum width
    cell: ({ row }) => { /* ... */ }
  },
  // ... more columns
];
\`\`\`

### Benefits:
- **Precise Control**: Each column can have its own width constraints
- **Better UX**: Prevents columns from becoming too narrow or too wide
- **Responsive Design**: Columns maintain appropriate proportions
- **Override Globals**: Individual constraints override global minColumnWidth/maxColumnWidth

### Current Column Constraints:
- **Employee**: 200-350px (default: 250px)
- **Role**: 100-150px (default: 120px)
- **Status**: 120-180px (default: 140px)
- **Department**: 120-200px (default: 150px)
- **Salary**: 100-150px (default: 120px)
- **Performance**: 150-250px (default: 180px)
- **Last Login**: 120-180px (default: 140px)
				`,
			},
		},
	},
};
