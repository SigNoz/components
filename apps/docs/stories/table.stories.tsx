import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@signozhq/table';

// Sample data for basic table
const basicData = [
	{
		id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		role: 'Admin',
		status: 'Active',
	},
	{
		id: '2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		role: 'User',
		status: 'Active',
	},
	{
		id: '3',
		name: 'Bob Johnson',
		email: 'bob@example.com',
		role: 'Moderator',
		status: 'Inactive',
	},
	{
		id: '4',
		name: 'Alice Brown',
		email: 'alice@example.com',
		role: 'User',
		status: 'Active',
	},
];

const meta: Meta<typeof Table> = {
	title: 'Components/Basic Table',
	component: Table,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

// Simple table with basic data
export const Simple: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{basicData.map((user) => (
					<TableRow key={user.id}>
						<TableCell>{user.name}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>{user.role}</TableCell>
						<TableCell>
							<span
								className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
									user.status === 'Active'
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800'
								}`}
							>
								{user.status}
							</span>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	),
};

// Table with more complex styling
export const Styled: Story = {
	render: () => (
		<Table className="border border-gray-200 rounded-lg">
			<TableHeader>
				<TableRow className="bg-gray-50">
					<TableHead className="font-semibold">Name</TableHead>
					<TableHead className="font-semibold">Email</TableHead>
					<TableHead className="font-semibold">Role</TableHead>
					<TableHead className="font-semibold">Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{basicData.map((user, index) => (
					<TableRow
						key={user.id}
						className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
					>
						<TableCell className="font-medium">{user.name}</TableCell>
						<TableCell className="text-gray-600">{user.email}</TableCell>
						<TableCell>
							<span
								className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
									user.role === 'Admin'
										? 'bg-purple-100 text-purple-800'
										: user.role === 'Moderator'
											? 'bg-blue-100 text-blue-800'
											: 'bg-gray-100 text-gray-800'
								}`}
							>
								{user.role}
							</span>
						</TableCell>
						<TableCell>
							<span
								className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
									user.status === 'Active'
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800'
								}`}
							>
								{user.status}
							</span>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	),
};

// Empty state table
export const Empty: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell colSpan={4} className="text-center py-8 text-gray-500">
						No data available
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	),
};
