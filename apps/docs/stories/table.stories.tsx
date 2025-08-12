import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableCaption,
} from '@signozhq/table';
import { Badge } from '@signozhq/badge';
import { Button } from '@signozhq/button';
import {
	CheckCircle,
	XCircle,
	Clock,
	AlertCircle,
	Eye,
	Edit,
	Trash2,
	Upload,
} from 'lucide-react';

// Enhanced sample data
const users = [
	{
		id: '1',
		name: 'Sarah Johnson',
		email: 'sarah.johnson@company.com',
		role: 'admin',
		status: 'active',
		department: 'Engineering',
		lastLogin: '2024-01-15T10:30:00Z',
		avatar: 'SJ',
	},
	{
		id: '2',
		name: 'Michael Chen',
		email: 'michael.chen@company.com',
		role: 'user',
		status: 'active',
		department: 'Marketing',
		lastLogin: '2024-01-14T15:45:00Z',
		avatar: 'MC',
	},
	{
		id: '3',
		name: 'Emily Rodriguez',
		email: 'emily.rodriguez@company.com',
		role: 'moderator',
		status: 'pending',
		department: 'Support',
		lastLogin: '2024-01-10T09:15:00Z',
		avatar: 'ER',
	},
	{
		id: '4',
		name: 'David Kim',
		email: 'david.kim@company.com',
		role: 'user',
		status: 'inactive',
		department: 'Sales',
		lastLogin: '2024-01-05T14:20:00Z',
		avatar: 'DK',
	},
	{
		id: '5',
		name: 'Lisa Wang',
		email: 'lisa.wang@company.com',
		role: 'admin',
		status: 'active',
		department: 'Product',
		lastLogin: '2024-01-15T11:00:00Z',
		avatar: 'LW',
	},
];

const meta: Meta<typeof Table> = {
	title: 'Components/Basic Table',
	component: Table,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `
## Basic Table Components

The basic table components provide a simple, semantic HTML table structure with consistent styling. These components are perfect for:

### Use Cases
- **Simple data display**: When you need to show basic tabular data
- **Static content**: Tables that don't require advanced features
- **Lightweight implementation**: Minimal JavaScript overhead
- **Accessibility**: Semantic HTML structure for screen readers
- **Custom styling**: Full control over appearance and behavior

### Components
- **Table**: The main table container
- **TableHeader**: Header section of the table
- **TableBody**: Body section containing the data rows
- **TableRow**: Individual table rows
- **TableHead**: Header cells (th elements)
- **TableCell**: Data cells (td elements)
- **TableCaption**: Optional caption for the table

### Key Features
- **Semantic HTML**: Proper table structure for accessibility
- **Responsive design**: Works well on different screen sizes
- **Customizable styling**: Easy to style with CSS classes
- **TypeScript support**: Full type safety for all components
- **Consistent theming**: Integrates with your design system

### When to Use
- Simple data presentation
- Static content that doesn't change frequently
- When you need full control over styling and behavior
- Lightweight applications where bundle size matters
- Accessibility-focused implementations
				`,
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

// Simple table with basic data
export const Simple: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Simple User Table
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					A basic table with clean, minimal styling for simple data display.
				</p>
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
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell className="font-medium">{user.name}</TableCell>
								<TableCell className="text-muted-foreground">{user.email}</TableCell>
								<TableCell className="capitalize">{user.role}</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className={
											user.status === 'active'
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'
										}
									>
										{user.status}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	),
};

// Enhanced table with more features
export const Enhanced: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Enhanced User Table
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					A more detailed table with avatars, status indicators, and action buttons.
				</p>
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/50">
							<TableHead className="font-semibold">User</TableHead>
							<TableHead className="font-semibold">Department</TableHead>
							<TableHead className="font-semibold">Role</TableHead>
							<TableHead className="font-semibold">Status</TableHead>
							<TableHead className="font-semibold">Last Login</TableHead>
							<TableHead className="font-semibold">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user, index) => (
							<TableRow
								key={user.id}
								className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
							>
								<TableCell>
									<div className="flex items-center gap-3">
										<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
											{user.avatar}
										</div>
										<div className="flex flex-col">
											<span className="font-medium text-sm">{user.name}</span>
											<span className="text-xs text-muted-foreground">{user.email}</span>
										</div>
									</div>
								</TableCell>
								<TableCell className="text-sm">{user.department}</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className={
											user.role === 'admin'
												? 'bg-purple-100 text-purple-800 border-purple-200'
												: user.role === 'moderator'
													? 'bg-orange-100 text-orange-800 border-orange-200'
													: 'bg-blue-100 text-blue-800 border-blue-200'
										}
									>
										{user.role}
									</Badge>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										{user.status === 'active' && (
											<CheckCircle className="h-4 w-4 text-green-600" />
										)}
										{user.status === 'inactive' && (
											<XCircle className="h-4 w-4 text-red-600" />
										)}
										{user.status === 'pending' && (
											<Clock className="h-4 w-4 text-yellow-600" />
										)}
										<Badge
											variant="outline"
											className={
												user.status === 'active'
													? 'bg-green-100 text-green-800 border-green-200'
													: user.status === 'inactive'
														? 'bg-red-100 text-red-800 border-red-200'
														: 'bg-yellow-100 text-yellow-800 border-yellow-200'
											}
										>
											{user.status}
										</Badge>
									</div>
								</TableCell>
								<TableCell className="text-sm text-muted-foreground">
									{new Date(user.lastLogin).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</TableCell>
								<TableCell>
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
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	),
};

// Table with caption and summary
export const WithCaption: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Table with Caption
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					A table with a caption and summary information for better accessibility.
				</p>
				<Table>
					<TableCaption>
						A list of all users in the system with their current status and role
						information.
					</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Department</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell className="font-medium">{user.name}</TableCell>
								<TableCell>{user.department}</TableCell>
								<TableCell className="capitalize">{user.role}</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className={
											user.status === 'active'
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'
										}
									>
										{user.status}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	),
};

// Empty state table
export const Empty: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">Empty State</h3>
				<p className="text-sm text-muted-foreground mb-4">
					How the table looks when there&apos;s no data to display.
				</p>
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
							<TableCell colSpan={4} className="text-center py-12">
								<div className="flex flex-col items-center gap-2">
									<AlertCircle className="h-8 w-8 text-muted-foreground" />
									<p className="text-sm font-medium text-foreground">No users found</p>
									<p className="text-sm text-muted-foreground">
										Get started by creating a new user.
									</p>
									<Button size="sm" className="mt-2">
										<Upload className="h-4 w-4 mr-2" />
										Add User
									</Button>
								</div>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	),
};

// Compact table for mobile
export const Compact: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Compact Table
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					A compact version perfect for mobile devices or space-constrained layouts.
				</p>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-sm">User</TableHead>
							<TableHead className="text-sm">Role</TableHead>
							<TableHead className="text-sm">Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.slice(0, 3).map((user) => (
							<TableRow key={user.id}>
								<TableCell>
									<div className="flex items-center gap-2">
										<div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
											{user.avatar}
										</div>
										<div className="flex flex-col">
											<span className="font-medium text-sm">{user.name}</span>
											<span className="text-xs text-muted-foreground">{user.email}</span>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge className="text-xs capitalize">{user.role}</Badge>
								</TableCell>
								<TableCell>
									{user.status === 'active' && (
										<CheckCircle className="h-4 w-4 text-green-600" />
									)}
									{user.status === 'inactive' && (
										<XCircle className="h-4 w-4 text-red-600" />
									)}
									{user.status === 'pending' && (
										<Clock className="h-4 w-4 text-yellow-600" />
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	),
};

// Table with fixed height and overflow
export const WithFixedHeight: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Table with Fixed Height
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					A table with a fixed height of 300px. When the content exceeds this height,
					it becomes scrollable while keeping the headers sticky.
				</p>
				<Table fixedHeight={300}>
					<TableHeader sticky>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Department</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell className="font-medium">{user.name}</TableCell>
								<TableCell className="text-muted-foreground">{user.email}</TableCell>
								<TableCell className="capitalize">{user.role}</TableCell>
								<TableCell>{user.department}</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className={
											user.status === 'active'
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'
										}
									>
										{user.status}
									</Badge>
								</TableCell>
							</TableRow>
						))}
						{/* Add more rows to demonstrate overflow */}
						{Array.from({ length: 15 }, (_, i) => ({
							id: `extra-${i + 1}`,
							name: `Extra User ${i + 1}`,
							email: `extra${i + 1}@example.com`,
							role: 'user',
							department: 'Engineering',
							status: 'active',
						})).map((user) => (
							<TableRow key={user.id}>
								<TableCell className="font-medium">{user.name}</TableCell>
								<TableCell className="text-muted-foreground">{user.email}</TableCell>
								<TableCell className="capitalize">{user.role}</TableCell>
								<TableCell>{user.department}</TableCell>
								<TableCell>
									<Badge variant="outline" className="bg-green-100 text-green-800">
										{user.status}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: `
## Table with Fixed Height

This example demonstrates how to create a table with a fixed height that handles overflow gracefully.

### Key Features:
- **Fixed Height**: The table container has a defined height of 300px
- **Vertical Scrolling**: When content exceeds the height, it becomes scrollable
- **Sticky Headers**: Headers remain visible while scrolling through the data
- **Custom Scrollbars**: Styled scrollbars for better user experience
- **No Layout Shift**: Headers maintain perfect alignment during scroll

### Usage:
\`\`\`tsx
<Table fixedHeight={300}>
  <TableHeader sticky>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {/* Your table rows */}
  </TableBody>
</Table>
\`\`\`

### Props:
- **\`fixedHeight\`**: Accepts a string (e.g., "400px") or number (e.g., 400) for the container height
- **\`sticky\`**: When true on TableHeader, keeps headers visible during scroll

### CSS Classes Applied:
- **\`.table-scroll-container\`**: Container with overflow handling
- **\`.sticky-header-table\`**: Table with sticky header support
- **\`.sticky-header\`**: Sticky header styling
				`,
			},
		},
	},
};
