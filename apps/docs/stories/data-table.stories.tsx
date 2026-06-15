import { CircleAlert, CircleCheck, CircleX, Clock, Eye, Pencil, Trash2 } from '@signozhq/icons';
import {
	Badge,
	DataTable as BaseDataTable,
	Button,
	ButtonColor,
	type ColumnDef,
	type Row,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

type IconComponent = React.ComponentType<{ style?: React.CSSProperties; size?: number }>;

import * as React from 'react';

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
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
					<div
						style={{
							height: '2rem',
							width: '2rem',
							borderRadius: '9999px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: '#ffffff',
							fontSize: '0.75rem',
							fontWeight: 500,
							backgroundImage: 'linear-gradient(to bottom right, #3b82f6, #9333ea)',
						}}
					>
						{user.name
							.split(' ')
							.map((n: string) => n[0])
							.join('')}
					</div>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{user.name}</span>
						<span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
							{user.email}
						</span>
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
			const roleMap: Record<User['role'], { label: string; style: React.CSSProperties }> = {
				admin: {
					label: 'Admin',
					style: { backgroundColor: '#f3e8ff', color: '#6b21a8', borderColor: '#e9d5ff' },
				},
				user: {
					label: 'User',
					style: { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' },
				},
				moderator: {
					label: 'Moderator',
					style: { backgroundColor: '#ffedd5', color: '#9a3412', borderColor: '#fed7aa' },
				},
				guest: {
					label: 'Guest',
					style: { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' },
				},
			};
			const roleInfo = roleMap[role];
			return (
				<Badge variant="outline" style={roleInfo.style}>
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
				{ label: string; icon: IconComponent; style: React.CSSProperties }
			> = {
				active: {
					label: 'Active',
					icon: CircleCheck,
					style: { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' },
				},
				inactive: {
					label: 'Inactive',
					icon: CircleX,
					style: { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' },
				},
				pending: {
					label: 'Pending',
					icon: Clock,
					style: { backgroundColor: '#fef9c3', color: '#854d0e', borderColor: '#fef08a' },
				},
				suspended: {
					label: 'Suspended',
					icon: CircleAlert,
					style: { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' },
				},
			};
			const statusInfo = statusMap[status];
			const Icon = statusInfo.icon;
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					<Icon size={16} />
					<Badge variant="outline" style={statusInfo.style}>
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
			return <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{department}</span>;
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
			return (
				<div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#15803d' }}>{formatted}</div>
			);
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
				if (score >= 90) return '#16a34a';
				if (score >= 80) return '#2563eb';
				if (score >= 70) return '#ca8a04';
				return '#dc2626';
			};
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					<div
						style={{
							flex: '1 1 0%',
							borderRadius: '9999px',
							height: '0.5rem',
							backgroundColor: '#e5e7eb',
						}}
					>
						<div
							style={{
								width: `${performance}%`,
								height: '0.5rem',
								borderRadius: '9999px',
								backgroundColor: getPerformanceColor(performance),
							}}
						/>
					</div>
					<span
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							color: getPerformanceColor(performance),
						}}
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
			return (
				<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{formatted}</span>
			);
		},
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: () => {
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
					<Button
						variant="ghost"
						color={ButtonColor.None}
						size="sm"
						style={{ height: '2rem', width: '2rem', padding: 0 }}
					>
						<Eye size={16} />
					</Button>
					<Button
						variant="ghost"
						color={ButtonColor.None}
						size="sm"
						style={{ height: '2rem', width: '2rem', padding: 0 }}
					>
						<Pencil size={16} />
					</Button>
					<Button
						variant="ghost"
						color="destructive"
						size="sm"
						style={{ height: '2rem', width: '2rem', padding: 0 }}
					>
						<Trash2 size={16} />
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
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<div
					style={{
						height: '1.5rem',
						width: '1.5rem',
						borderRadius: '9999px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#ffffff',
						fontSize: '0.75rem',
						fontWeight: 500,
						backgroundImage: 'linear-gradient(to bottom right, #3b82f6, #9333ea)',
					}}
				>
					{row.original.name
						.split(' ')
						.map((n: string) => n[0])
						.join('')}
				</div>
				<span style={{ fontWeight: 500 }}>{row.original.name}</span>
			</div>
		),
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }: { row: Row<User> }) => (
			<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				{row.original.email}
			</span>
		),
	},
	{
		accessorKey: 'role',
		header: 'Role',
		cell: ({ row }: { row: Row<User> }) => {
			const role = row.original.role;
			const roleMap: Record<User['role'], { label: string; style: React.CSSProperties }> = {
				admin: { label: 'Admin', style: { backgroundColor: '#f3e8ff', color: '#6b21a8' } },
				user: { label: 'User', style: { backgroundColor: '#dbeafe', color: '#1e40af' } },
				moderator: {
					label: 'Moderator',
					style: { backgroundColor: '#ffedd5', color: '#9a3412' },
				},
				guest: { label: 'Guest', style: { backgroundColor: '#f3f4f6', color: '#1f2937' } },
			};
			const roleInfo = roleMap[role];
			return <Badge style={roleInfo.style}>{roleInfo.label}</Badge>;
		},
	},
];

// Story: Basic DataTable with essential features
export const Basic: StoryObj<typeof DataTable<User>> = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<div
				style={{
					border: '1px solid var(--border)',
					borderRadius: '0.5rem',
					padding: '1.5rem',
					backgroundColor: 'var(--background)',
				}}
			>
				<h3
					style={{
						fontSize: '1.125rem',
						fontWeight: 600,
						marginBottom: '0.5rem',
						color: 'var(--foreground)',
					}}
				>
					Employee Directory
				</h3>
				<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
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

const compactColumns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: 'Employee',
		cell: ({ row }: { row: Row<User> }) => (
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<div
					style={{
						height: '1.5rem',
						width: '1.5rem',
						borderRadius: '9999px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#ffffff',
						fontSize: '0.75rem',
						fontWeight: 500,
						backgroundImage: 'linear-gradient(to bottom right, #3b82f6, #9333ea)',
					}}
				>
					{row.original.name
						.split(' ')
						.map((n: string) => n[0])
						.join('')}
				</div>
				<span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.original.name}</span>
			</div>
		),
	},
	{
		accessorKey: 'role',
		header: 'Role',
		cell: ({ row }: { row: Row<User> }) => {
			const role = row.original.role;
			const roleMap: Record<User['role'], { label: string; style: React.CSSProperties }> = {
				admin: { label: 'Admin', style: { backgroundColor: '#f3e8ff', color: '#6b21a8' } },
				user: { label: 'User', style: { backgroundColor: '#dbeafe', color: '#1e40af' } },
				moderator: { label: 'Mod', style: { backgroundColor: '#ffedd5', color: '#9a3412' } },
				guest: { label: 'Guest', style: { backgroundColor: '#f3f4f6', color: '#1f2937' } },
			};
			const roleInfo = roleMap[role];
			return <Badge style={{ fontSize: '0.75rem', ...roleInfo.style }}>{roleInfo.label}</Badge>;
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }: { row: Row<User> }) => {
			const status = row.original.status;
			const statusMap: Record<User['status'], { icon: IconComponent; style: React.CSSProperties }> =
				{
					active: { icon: CircleCheck, style: { color: '#16a34a' } },
					inactive: { icon: CircleX, style: { color: '#dc2626' } },
					pending: { icon: Clock, style: { color: '#ca8a04' } },
					suspended: { icon: CircleAlert, style: { color: '#4b5563' } },
				};
			const statusInfo = statusMap[status];
			const Icon = statusInfo.icon;
			return <Icon style={{ height: '1rem', width: '1rem', ...statusInfo.style }} />;
		},
	},
];

const columnResizingColumns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: 'Employee Name',
		cell: ({ row }: { row: Row<User> }) => (
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<div
					style={{
						height: '1.5rem',
						width: '1.5rem',
						borderRadius: '9999px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#ffffff',
						fontSize: '0.75rem',
						fontWeight: 500,
						backgroundImage: 'linear-gradient(to bottom right, #3b82f6, #9333ea)',
					}}
				>
					{row.original.name
						.split(' ')
						.map((n: string) => n[0])
						.join('')}
				</div>
				<span style={{ fontWeight: 500 }}>{row.original.name}</span>
			</div>
		),
	},
	{
		accessorKey: 'email',
		header: 'Email Address',
		cell: ({ row }: { row: Row<User> }) => (
			<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				{row.original.email}
			</span>
		),
	},
	{
		accessorKey: 'role',
		header: 'Role',
		cell: ({ row }: { row: Row<User> }) => {
			const role = row.original.role;
			const roleMap: Record<User['role'], { label: string; style: React.CSSProperties }> = {
				admin: { label: 'Admin', style: { backgroundColor: '#f3e8ff', color: '#6b21a8' } },
				user: { label: 'User', style: { backgroundColor: '#dbeafe', color: '#1e40af' } },
				moderator: {
					label: 'Moderator',
					style: { backgroundColor: '#ffedd5', color: '#9a3412' },
				},
				guest: { label: 'Guest', style: { backgroundColor: '#f3f4f6', color: '#1f2937' } },
			};
			const roleInfo = roleMap[role];
			return <Badge style={roleInfo.style}>{roleInfo.label}</Badge>;
		},
	},
	{
		accessorKey: 'department',
		header: 'Department',
		cell: ({ row }: { row: Row<User> }) => (
			<span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.original.department}</span>
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
				<div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#15803d' }}>{formatted}</div>
			);
		},
	},
];

const allFeaturesColumns: ColumnDef<User>[] = [
	{
		id: 'serial',
		header: '#',
		cell: ({ row }: { row: Row<User> }) => (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '2rem',
					height: '2rem',
					borderRadius: '9999px',
					backgroundColor: 'var(--muted)',
					color: 'var(--muted-foreground)',
					fontSize: '0.875rem',
					fontWeight: 500,
				}}
			>
				{row.index + 1}
			</div>
		),
		size: 60,
	},
	{
		accessorKey: 'name',
		header: 'Employee Name',
		cell: ({ row }: { row: Row<User> }) => (
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
				<div
					style={{
						height: '2rem',
						width: '2rem',
						borderRadius: '9999px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#ffffff',
						fontSize: '0.75rem',
						fontWeight: 500,
						backgroundImage: 'linear-gradient(to bottom right, #3b82f6, #9333ea)',
					}}
				>
					{row.original.name
						.split(' ')
						.map((n: string) => n[0])
						.join('')}
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.original.name}</span>
					<span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
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
			const roleMap: Record<User['role'], { label: string; style: React.CSSProperties }> = {
				admin: {
					label: 'Admin',
					style: { backgroundColor: '#f3e8ff', color: '#6b21a8', borderColor: '#e9d5ff' },
				},
				user: {
					label: 'User',
					style: { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' },
				},
				moderator: {
					label: 'Moderator',
					style: { backgroundColor: '#ffedd5', color: '#9a3412', borderColor: '#fed7aa' },
				},
				guest: {
					label: 'Guest',
					style: { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' },
				},
			};
			const roleInfo = roleMap[role];
			return (
				<Badge variant="outline" style={roleInfo.style}>
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
				{ label: string; icon: React.ComponentType; style: React.CSSProperties }
			> = {
				active: {
					label: 'Active',
					icon: CircleCheck,
					style: { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' },
				},
				inactive: {
					label: 'Inactive',
					icon: CircleX,
					style: { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' },
				},
				pending: {
					label: 'Pending',
					icon: Clock,
					style: { backgroundColor: '#fef9c3', color: '#854d0e', borderColor: '#fef08a' },
				},
				suspended: {
					label: 'Suspended',
					icon: CircleAlert,
					style: { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' },
				},
			};
			const statusInfo = statusMap[status];
			const Icon = statusInfo.icon;
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					<Icon />
					<Badge variant="outline" style={statusInfo.style}>
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
			<span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.original.department}</span>
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
				<div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#15803d' }}>{formatted}</div>
			);
		},
	},
	{
		accessorKey: 'performance',
		header: 'Performance',
		cell: ({ row }: { row: Row<User> }) => {
			const performance = parseFloat(row.getValue('performance') as string);
			const getPerformanceColor = (score: number) => {
				if (score >= 90) return '#16a34a';
				if (score >= 80) return '#2563eb';
				if (score >= 70) return '#ca8a04';
				return '#dc2626';
			};
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					<div
						style={{
							flex: '1 1 0%',
							borderRadius: '9999px',
							height: '0.5rem',
							backgroundColor: '#e5e7eb',
						}}
					>
						<div
							style={{
								width: `${performance}%`,
								height: '0.5rem',
								borderRadius: '9999px',
								backgroundColor: getPerformanceColor(performance),
							}}
						/>
					</div>
					<span
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							color: getPerformanceColor(performance),
						}}
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
			return (
				<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{formatted}</span>
			);
		},
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: () => {
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
					<Button
						variant="ghost"
						color={ButtonColor.None}
						size="sm"
						style={{ height: '2rem', width: '2rem', padding: 0 }}
					>
						<Eye size={16} />
					</Button>
					<Button
						variant="ghost"
						color={ButtonColor.None}
						size="sm"
						style={{ height: '2rem', width: '2rem', padding: 0 }}
					>
						<Pencil size={16} />
					</Button>
					<Button
						variant="ghost"
						color="destructive"
						size="sm"
						style={{ height: '2rem', width: '2rem', padding: 0 }}
					>
						<Trash2 size={16} />
					</Button>
				</div>
			);
		},
	},
];

const virtualizationColumns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: 'Employee Name',
		cell: ({ row }: { row: Row<User> }) => (
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
				<div
					style={{
						height: '2rem',
						width: '2rem',
						borderRadius: '9999px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#ffffff',
						fontSize: '0.75rem',
						fontWeight: 500,
						backgroundImage: 'linear-gradient(to bottom right, #3b82f6, #9333ea)',
					}}
				>
					{row.original.name
						.split(' ')
						.map((n: string) => n[0])
						.join('')}
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.original.name}</span>
					<span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
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
			const roleMap: Record<User['role'], { label: string; style: React.CSSProperties }> = {
				admin: {
					label: 'Admin',
					style: { backgroundColor: '#f3e8ff', color: '#6b21a8', borderColor: '#e9d5ff' },
				},
				user: {
					label: 'User',
					style: { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' },
				},
				moderator: {
					label: 'Moderator',
					style: { backgroundColor: '#ffedd5', color: '#9a3412', borderColor: '#fed7aa' },
				},
				guest: {
					label: 'Guest',
					style: { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' },
				},
			};
			const roleInfo = roleMap[role];
			return (
				<Badge variant="outline" style={roleInfo.style}>
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
				{ label: string; icon: React.ComponentType; style: React.CSSProperties }
			> = {
				active: {
					label: 'Active',
					icon: CircleCheck,
					style: { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' },
				},
				inactive: {
					label: 'Inactive',
					icon: CircleX,
					style: { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' },
				},
				pending: {
					label: 'Pending',
					icon: Clock,
					style: { backgroundColor: '#fef9c3', color: '#854d0e', borderColor: '#fef08a' },
				},
				suspended: {
					label: 'Suspended',
					icon: CircleAlert,
					style: { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' },
				},
			};
			const statusInfo = statusMap[status];
			const Icon = statusInfo.icon;
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					<Icon />
					<Badge variant="outline" style={statusInfo.style}>
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
			<span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.original.department}</span>
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
				<div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#15803d' }}>{formatted}</div>
			);
		},
	},
	{
		accessorKey: 'performance',
		header: 'Performance',
		cell: ({ row }: { row: Row<User> }) => {
			const performance = parseFloat(row.getValue('performance') as string);
			const getPerformanceColor = (score: number) => {
				if (score >= 90) return '#16a34a';
				if (score >= 80) return '#2563eb';
				if (score >= 70) return '#ca8a04';
				return '#dc2626';
			};
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					<div
						style={{
							flex: '1 1 0%',
							borderRadius: '9999px',
							height: '0.5rem',
							backgroundColor: '#e5e7eb',
						}}
					>
						<div
							style={{
								width: `${performance}%`,
								height: '0.5rem',
								borderRadius: '9999px',
								backgroundColor: getPerformanceColor(performance),
							}}
						/>
					</div>
					<span
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							color: getPerformanceColor(performance),
						}}
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
			return (
				<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{formatted}</span>
			);
		},
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: () => {
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
					<Button
						variant="ghost"
						color={ButtonColor.None}
						size="sm"
						style={{ height: '2rem', width: '2rem', padding: 0 }}
					>
						<Eye size={16} />
					</Button>
					<Button
						variant="ghost"
						color={ButtonColor.None}
						size="sm"
						style={{ height: '2rem', width: '2rem', padding: 0 }}
					>
						<Pencil size={16} />
					</Button>
					<Button
						variant="ghost"
						color="destructive"
						size="sm"
						style={{ height: '2rem', width: '2rem', padding: 0 }}
					>
						<Trash2 size={16} />
					</Button>
				</div>
			);
		},
	},
];

const stickyHeadersColumns: ColumnDef<User>[] = [
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
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
				<div
					style={{
						height: '2rem',
						width: '2rem',
						borderRadius: '9999px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#ffffff',
						fontSize: '0.75rem',
						fontWeight: 500,
						backgroundImage: 'linear-gradient(to bottom right, #3b82f6, #9333ea)',
					}}
				>
					{row.original.name
						.split(' ')
						.map((n) => n[0])
						.join('')
						.toUpperCase()}
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.original.name}</span>
					<span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
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
			const roleMap: Record<User['role'], { label: string; style: React.CSSProperties }> = {
				admin: { label: 'Admin', style: { backgroundColor: '#fee2e2', color: '#991b1b' } },
				user: { label: 'User', style: { backgroundColor: '#dbeafe', color: '#1e40af' } },
				moderator: {
					label: 'Moderator',
					style: { backgroundColor: '#fef9c3', color: '#854d0e' },
				},
				guest: { label: 'Guest', style: { backgroundColor: '#f3f4f6', color: '#1f2937' } },
			};
			const role = roleMap[row.original.role];
			return <Badge style={role.style}>{role.label}</Badge>;
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		size: 120,
		cell: ({ row }: { row: Row<User> }) => {
			const statusMap: Record<User['status'], { icon: IconComponent; style: React.CSSProperties }> =
				{
					active: { icon: CircleCheck, style: { color: '#16a34a' } },
					inactive: { icon: CircleX, style: { color: '#dc2626' } },
					pending: { icon: Clock, style: { color: '#ca8a04' } },
					suspended: { icon: CircleAlert, style: { color: '#ea580c' } },
				};
			const status = statusMap[row.original.status];
			const Icon = status.icon;
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					<Icon size={16} />
					<span style={{ textTransform: 'capitalize', fontSize: '0.875rem' }}>
						{row.original.status}
					</span>
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
			<span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
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
				if (score >= 90) return '#16a34a';
				if (score >= 80) return '#2563eb';
				if (score >= 70) return '#ca8a04';
				return '#dc2626';
			};
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
					<span
						style={{ fontWeight: 500, fontSize: '0.875rem', color: getPerformanceColor(score) }}
					>
						{score}%
					</span>
					<div
						style={{
							width: '5rem',
							borderRadius: '9999px',
							height: '0.5rem',
							overflow: 'hidden',
							backgroundColor: '#e5e7eb',
						}}
					>
						<div
							style={{
								height: '0.5rem',
								borderRadius: '9999px',
								transition: 'all 300ms',
								backgroundColor: getPerformanceColor(score),
								width: `${score}%`,
							}}
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
			<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				{new Date(row.original.lastLogin).toLocaleDateString()}
			</span>
		),
	},
];

const infiniteScrollColumns: ColumnDef<User>[] = [
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
];

const fixedDate = 1771949360343; // 2026-02-24T16:09:20.343Z

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
		lastLogin: new Date(fixedDate + 60 * 1000 * index).toISOString(),
		createdAt: new Date(fixedDate - 60 * 1000 * index).toISOString().split('T')[0],
		avatar: `https://images.unsplash.com/photo-${1500000000000 + index}?w=32&h=32&fit=crop&crop=face`,
		department: departments[index % departments.length],
		salary: 50000 + 1000 * index,
		performance: 60 + (index % 40),
	}));
};

const largeDataset = generateLargeDataset(1000, 0);

const meta: Meta<typeof DataTable<User>> = {
	title: 'Composed Components/DataTable',
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

export const Preview: StoryObj<typeof DataTable<User>> = {
	parameters: {
		chromatic: {
			disableSnapshot: false,
			pauseAnimationAtEnd: true,
		},
	},
	render: function DataTablePreview() {
		const itemsPerPage = 100;
		const maxItems = 1000;
		const scrollToIndexData = generateLargeDataset(200);

		const [infiniteScrollData, setInfiniteScrollData] = React.useState<User[]>(() =>
			generateLargeDataset(itemsPerPage, 0)
		);
		const [infiniteScrollLoading, setInfiniteScrollLoading] = React.useState(false);
		const [infiniteScrollHasMore, setInfiniteScrollHasMore] = React.useState(true);
		const [infiniteScrollPage, setInfiniteScrollPage] = React.useState(1);
		const [infiniteScrollOrderedColumns, setInfiniteScrollOrderedColumns] = React.useState<
			ColumnDef<User>[]
		>([]);

		const loadMoreInfiniteScroll = React.useCallback(() => {
			if (infiniteScrollLoading || !infiniteScrollHasMore) return;
			setInfiniteScrollLoading(true);
			setTimeout(() => {
				const offset = infiniteScrollPage * itemsPerPage;
				const remaining = Math.max(0, maxItems - offset);
				const take = Math.min(itemsPerPage, remaining);
				const newData = take > 0 ? generateLargeDataset(take, offset) : [];
				setInfiniteScrollData((prev) => [...prev, ...newData]);
				const nextPage = infiniteScrollPage + 1;
				setInfiniteScrollPage(nextPage);
				setInfiniteScrollLoading(false);
				if (nextPage * itemsPerPage >= maxItems) setInfiniteScrollHasMore(false);
			}, 600);
		}, [infiniteScrollLoading, infiniteScrollHasMore, infiniteScrollPage]);

		const scrollToIndexRef = React.useRef<
			((rowIndex: number, options?: { align?: 'start' | 'center' | 'end' }) => void) | undefined
		>();

		const handleScrollToUser = (userId: string) => {
			const userIndex = scrollToIndexData.findIndex((user) => user.id === userId);
			if (userIndex !== -1 && scrollToIndexRef.current) {
				scrollToIndexRef.current(userIndex, { align: 'center' });
			}
		};

		const handleScrollToRandom = () => {
			if (scrollToIndexRef.current) {
				const randomIndex = Math.floor(Math.random() * scrollToIndexData.length);
				scrollToIndexRef.current(randomIndex, { align: 'center' });
			}
		};

		return (
			<div
				style={{
					padding: '2rem',
					display: 'flex',
					flexDirection: 'column',
					gap: '2.5rem',
					backgroundColor: 'var(--background)',
				}}
			>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Advanced
					</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<div
							style={{
								border: '1px solid var(--border)',
								borderRadius: '0.5rem',
								padding: '1.5rem',
								backgroundColor: 'var(--background)',
							}}
						>
							<h3
								style={{
									fontSize: '1.125rem',
									fontWeight: 600,
									marginBottom: '0.5rem',
									color: 'var(--foreground)',
								}}
							>
								Advanced Employee Management
							</h3>
							<p
								style={{
									fontSize: '0.875rem',
									color: 'var(--muted-foreground)',
									marginBottom: '1rem',
								}}
							>
								Full-featured data table with column reordering, resizing, pinning, row selection,
								and more.
							</p>
							<DataTable
								columns={enhancedColumns}
								data={users}
								tableId="advanced-employees-table"
								enableSorting
								enableFiltering
								enableGlobalFilter
								enableColumnReordering
								enableColumnResizing
								enableColumnPinning
								enableRowSelection
								enablePagination
								pageSize={5}
								showHeaders
							/>
						</div>
					</div>
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Column Reordering
					</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<div
							style={{
								border: '1px solid var(--border)',
								borderRadius: '0.5rem',
								padding: '1.5rem',
								backgroundColor: 'var(--background)',
							}}
						>
							<h3
								style={{
									fontSize: '1.125rem',
									fontWeight: 600,
									marginBottom: '0.5rem',
									color: 'var(--foreground)',
								}}
							>
								Column Reordering Demo
							</h3>
							<p
								style={{
									fontSize: '0.875rem',
									color: 'var(--muted-foreground)',
									marginBottom: '1rem',
								}}
							>
								Drag and drop column headers to reorder them. Try dragging the &quot;Name&quot;
								column to different positions.
							</p>
							<DataTable
								columns={simpleColumns}
								data={users}
								tableId="reorder-demo-table"
								enableColumnReordering
								enableColumnResizing={false}
								enableSorting={false}
								enableFiltering={false}
								enableGlobalFilter={false}
								enableColumnPinning={false}
								enableRowSelection={false}
								enablePagination={false}
								showHeaders
							/>
						</div>
					</div>
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Row Selection
					</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<div
							style={{
								border: '1px solid var(--border)',
								borderRadius: '0.5rem',
								padding: '1.5rem',
								backgroundColor: 'var(--background)',
							}}
						>
							<h3
								style={{
									fontSize: '1.125rem',
									fontWeight: 600,
									marginBottom: '0.5rem',
									color: 'var(--foreground)',
								}}
							>
								Row Selection Demo
							</h3>
							<p
								style={{
									fontSize: '0.875rem',
									color: 'var(--muted-foreground)',
									marginBottom: '1rem',
								}}
							>
								Select individual rows or use the header checkbox to select all rows. Selected rows
								are highlighted.
							</p>
							<DataTable
								columns={enhancedColumns}
								data={users}
								tableId="selection-demo-table"
								enableSorting
								enableFiltering
								enableGlobalFilter={false}
								enableColumnReordering={false}
								enableColumnResizing={false}
								enableColumnPinning={false}
								enableRowSelection
								enablePagination
								pageSize={5}
								showHeaders
							/>
						</div>
					</div>
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Compact
					</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<div
							style={{
								border: '1px solid var(--border)',
								borderRadius: '0.5rem',
								padding: '1.5rem',
								backgroundColor: 'var(--background)',
							}}
						>
							<h3
								style={{
									fontSize: '1.125rem',
									fontWeight: 600,
									marginBottom: '0.5rem',
									color: 'var(--foreground)',
								}}
							>
								Compact Employee List
							</h3>
							<p
								style={{
									fontSize: '0.875rem',
									color: 'var(--muted-foreground)',
									marginBottom: '1rem',
								}}
							>
								A compact view with essential information only, perfect for mobile or
								space-constrained layouts.
							</p>
							<DataTable
								columns={compactColumns}
								data={users}
								tableId="compact-employees-table"
								enableSorting
								enableFiltering={false}
								enableGlobalFilter={false}
								enableColumnReordering={false}
								enableColumnResizing={false}
								enableColumnPinning={false}
								enableRowSelection={false}
								enablePagination
								pageSize={10}
								showHeaders
							/>
						</div>
					</div>
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Column Resizing
					</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<div
							style={{
								border: '1px solid var(--border)',
								borderRadius: '0.5rem',
								padding: '1.5rem',
								backgroundColor: 'var(--background)',
							}}
						>
							<h3
								style={{
									fontSize: '1.125rem',
									fontWeight: 600,
									marginBottom: '0.5rem',
									color: 'var(--foreground)',
								}}
							>
								Column Resizing Demo
							</h3>
							<p
								style={{
									fontSize: '0.875rem',
									color: 'var(--muted-foreground)',
									marginBottom: '1rem',
								}}
							>
								Hover over column headers to see the resize handle. Drag the right edge of column
								headers to resize them. Double-click the resize handle to reset column width.
							</p>
							<DataTable
								columns={columnResizingColumns}
								data={users}
								tableId="resize-demo-table"
								enableColumnResizing
								enableSorting={false}
								enableFiltering={false}
								enableGlobalFilter={false}
								enableColumnReordering={false}
								enableColumnPinning={false}
								enableRowSelection={false}
								enablePagination={false}
								showHeaders
								defaultColumnWidth={200}
								minColumnWidth={100}
								maxColumnWidth={400}
							/>
						</div>
					</div>
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						All Features
					</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<div
							style={{
								border: '1px solid var(--border)',
								borderRadius: '0.5rem',
								padding: '1.5rem',
								backgroundColor: 'var(--background)',
							}}
						>
							<h3
								style={{
									fontSize: '1.125rem',
									fontWeight: 600,
									marginBottom: '0.5rem',
									color: 'var(--foreground)',
								}}
							>
								All Features Demo
							</h3>
							<p
								style={{
									fontSize: '0.875rem',
									color: 'var(--muted-foreground)',
									marginBottom: '1rem',
								}}
							>
								This table demonstrates all available features: column reordering, resizing,
								sorting, filtering, pinning, row selection, and pagination.
							</p>
							<DataTable
								columns={allFeaturesColumns}
								data={users}
								tableId="all-features-table"
								enableSorting
								enableFiltering
								enableGlobalFilter
								enableColumnReordering
								enableColumnResizing
								enableColumnPinning
								enableRowSelection
								enablePagination
								pageSize={5}
								showHeaders
								defaultColumnWidth={180}
								minColumnWidth={100}
								maxColumnWidth={400}
							/>
						</div>
					</div>
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Virtualization With Features
					</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<div
							style={{
								border: '1px solid var(--border)',
								borderRadius: '0.5rem',
								padding: '1.5rem',
								backgroundColor: 'var(--background)',
							}}
						>
							<h3
								style={{
									fontSize: '1.125rem',
									fontWeight: 600,
									marginBottom: '0.5rem',
									color: 'var(--foreground)',
								}}
							>
								Virtualization with All Features
							</h3>
							<p
								style={{
									fontSize: '0.875rem',
									color: 'var(--muted-foreground)',
									marginBottom: '1rem',
								}}
							>
								This table demonstrates virtualization with 1000 rows, plus all interactive
								features.
							</p>
							<DataTable
								columns={virtualizationColumns}
								data={largeDataset}
								tableId="virtualization-features-table"
								enableSorting
								enableFiltering
								enableGlobalFilter
								enableColumnReordering
								enableColumnResizing
								enableColumnPinning
								enableRowSelection
								enablePagination={false}
								showHeaders
								defaultColumnWidth={180}
								minColumnWidth={100}
								maxColumnWidth={400}
								enableVirtualization
								estimateRowSize={60}
								overscan={10}
								rowHeight={60}
								enableDynamicRowHeights={false}
								fixedHeight={600}
							/>
						</div>
					</div>
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Virtualized Infinite Scroll Dnd Resize
					</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<div
							style={{
								border: '1px solid var(--border)',
								borderRadius: '0.5rem',
								padding: '1.5rem',
								backgroundColor: 'var(--background)',
							}}
						>
							<h3
								style={{
									fontSize: '1.125rem',
									fontWeight: 600,
									marginBottom: '0.5rem',
									color: 'var(--foreground)',
								}}
							>
								Virtualized Infinite Scroll + Reorder + Resize
							</h3>
							<p
								style={{
									fontSize: '0.875rem',
									color: 'var(--muted-foreground)',
									marginBottom: '1rem',
								}}
							>
								Large dataset with virtualized rows, drag-and-drop column reordering, and on-change
								column resizing. Scroll to load more.
							</p>
							<div
								style={{
									marginBottom: '1rem',
									display: 'flex',
									alignItems: 'center',
									gap: '1rem',
									fontSize: '0.875rem',
									color: 'var(--muted-foreground)',
								}}
							>
								<span>Rows: {infiniteScrollData.length}</span>
								<span>Page: {infiniteScrollPage}</span>
								{infiniteScrollLoading && <span>Loading…</span>}
								{!infiniteScrollHasMore && (
									<span style={{ color: '#16a34a' }}>All items loaded</span>
								)}
								{infiniteScrollOrderedColumns.length > 0 && (
									<span
										style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
									>
										Order:{' '}
										{infiniteScrollOrderedColumns
											.map((c) =>
												String(
													(c as { id?: string; accessorKey?: string }).id ??
														(c as { accessorKey?: string }).accessorKey ??
														'?'
												)
											)
											.join(' | ')}
									</span>
								)}
							</div>
							<DataTable
								columns={infiniteScrollColumns}
								data={infiniteScrollData}
								tableId="virtualized-infinite-reorder-resize"
								enableSorting={false}
								enableFiltering
								enableGlobalFilter={false}
								enableColumnReordering
								enableColumnResizing
								enableColumnPinning
								enableRowSelection
								enablePagination={false}
								showHeaders
								defaultColumnWidth={180}
								minColumnWidth={80}
								maxColumnWidth={480}
								enableVirtualization
								estimateRowSize={56}
								overscan={10}
								rowHeight={56}
								enableInfiniteScroll
								enableScrollRestoration={false}
								fixedHeight={600}
								hasMore={infiniteScrollHasMore}
								onLoadMore={loadMoreInfiniteScroll}
								loadingMore={infiniteScrollLoading}
								onColumnOrderChange={setInfiniteScrollOrderedColumns}
							/>
						</div>
					</div>
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Sticky Headers
					</h3>
					<DataTable
						columns={stickyHeadersColumns}
						data={generateLargeDataset(100)}
						tableId="sticky-headers-table"
						enableSorting
						enableFiltering
						enableColumnResizing
						enableColumnReordering
						enableColumnPinning
						enableRowSelection
						enableStickyHeaders
						fixedHeight={600}
						showHeaders
						defaultColumnWidth={150}
						minColumnWidth={80}
						maxColumnWidth={800}
					/>
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Scroll To Index
					</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
							<Button
								onClick={() => handleScrollToUser('1')}
								variant="outlined"
								color={ButtonColor.None}
								size="sm"
							>
								Scroll to User 1
							</Button>
							<Button
								onClick={() => handleScrollToUser('50')}
								variant="outlined"
								color={ButtonColor.None}
								size="sm"
							>
								Scroll to User 50
							</Button>
							<Button
								onClick={() => handleScrollToUser('100')}
								variant="outlined"
								color={ButtonColor.None}
								size="sm"
							>
								Scroll to User 100
							</Button>
							<Button
								onClick={() => handleScrollToUser('150')}
								variant="outlined"
								color={ButtonColor.None}
								size="sm"
							>
								Scroll to User 150
							</Button>
							<Button
								onClick={() => handleScrollToUser('200')}
								variant="outlined"
								color={ButtonColor.None}
								size="sm"
							>
								Scroll to Last User
							</Button>
							<Button
								onClick={handleScrollToRandom}
								variant="outlined"
								color={ButtonColor.None}
								size="sm"
							>
								Scroll to Random User
							</Button>
						</div>
						<DataTable
							columns={enhancedColumns}
							data={scrollToIndexData}
							tableId="scroll-to-index-table"
							enableVirtualization
							enableStickyHeaders
							fixedHeight={500}
							enableSorting
							enableFiltering
							enableColumnResizing
							enableRowSelection
							estimateRowSize={60}
							overscan={5}
							scrollToIndexRef={scrollToIndexRef}
						/>
					</div>
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Individual Column Widths
					</h3>
					<DataTable
						columns={enhancedColumns}
						data={users}
						tableId="individual-widths-table"
						enableColumnResizing
						defaultColumnWidth={150}
						fixedHeight={600}
						minColumnWidth={80}
						maxColumnWidth={400}
					/>
				</section>
			</div>
		);
	},
};
