import {
	CircleAlert,
	CircleCheck,
	CircleX,
	Clock,
	Eye,
	Pencil,
	Trash2,
	Upload,
} from '@signozhq/icons';
import {
	Badge,
	Button,
	ButtonColor,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
	title: 'Old Components/Basic Table',
	component: Table,
	argTypes: {
		testId: {
			control: 'text',
			description: 'Test ID for the table.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the table.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles applied to custom styling.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
	},
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
					Simple User Table
				</h3>
				<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
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
								<TableCell style={{ fontWeight: 500 }}>{user.name}</TableCell>
								<TableCell style={{ color: 'var(--muted-foreground)' }}>{user.email}</TableCell>
								<TableCell style={{ textTransform: 'capitalize' }}>{user.role}</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										style={
											user.status === 'active'
												? { backgroundColor: '#dcfce7', color: '#166534' }
												: { backgroundColor: '#f3f4f6', color: '#1f2937' }
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
					Enhanced User Table
				</h3>
				<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
					A more detailed table with avatars, status indicators, and action buttons.
				</p>
				<Table>
					<TableHeader>
						<TableRow
							style={{ backgroundColor: 'color-mix(in srgb, var(--muted) 50%, transparent)' }}
						>
							<TableHead style={{ fontWeight: 600 }}>User</TableHead>
							<TableHead style={{ fontWeight: 600 }}>Department</TableHead>
							<TableHead style={{ fontWeight: 600 }}>Role</TableHead>
							<TableHead style={{ fontWeight: 600 }}>Status</TableHead>
							<TableHead style={{ fontWeight: 600 }}>Last Login</TableHead>
							<TableHead style={{ fontWeight: 600 }}>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user, index) => (
							<TableRow
								key={user.id}
								style={{
									backgroundColor:
										index % 2 === 0
											? 'var(--background)'
											: 'color-mix(in srgb, var(--muted) 30%, transparent)',
								}}
							>
								<TableCell>
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
											{user.avatar}
										</div>
										<div style={{ display: 'flex', flexDirection: 'column' }}>
											<span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{user.name}</span>
											<span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
												{user.email}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell style={{ fontSize: '0.875rem' }}>{user.department}</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										style={
											user.role === 'admin'
												? { backgroundColor: '#f3e8ff', color: '#6b21a8', borderColor: '#e9d5ff' }
												: user.role === 'moderator'
													? { backgroundColor: '#ffedd5', color: '#9a3412', borderColor: '#fed7aa' }
													: { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' }
										}
									>
										{user.role}
									</Badge>
								</TableCell>
								<TableCell>
									<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
										{user.status === 'active' && (
											<CircleCheck size={16} style={{ color: '#16a34a' }} />
										)}
										{user.status === 'inactive' && (
											<CircleX size={16} style={{ color: '#dc2626' }} />
										)}
										{user.status === 'pending' && <Clock size={16} style={{ color: '#ca8a04' }} />}
										<Badge
											variant="outline"
											style={
												user.status === 'active'
													? { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }
													: user.status === 'inactive'
														? {
																backgroundColor: '#fee2e2',
																color: '#991b1b',
																borderColor: '#fecaca',
															}
														: {
																backgroundColor: '#fef9c3',
																color: '#854d0e',
																borderColor: '#fef08a',
															}
											}
										>
											{user.status}
										</Badge>
									</div>
								</TableCell>
								<TableCell style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
									{new Date(user.lastLogin).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</TableCell>
								<TableCell>
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
					Table with Caption
				</h3>
				<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
					A table with a caption and summary information for better accessibility.
				</p>
				<Table>
					<TableCaption>
						A list of all users in the system with their current status and role information.
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
								<TableCell style={{ fontWeight: 500 }}>{user.name}</TableCell>
								<TableCell>{user.department}</TableCell>
								<TableCell style={{ textTransform: 'capitalize' }}>{user.role}</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										style={
											user.status === 'active'
												? { backgroundColor: '#dcfce7', color: '#166534' }
												: { backgroundColor: '#f3f4f6', color: '#1f2937' }
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
					Empty State
				</h3>
				<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
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
							<TableCell
								colSpan={4}
								style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										gap: '0.5rem',
									}}
								>
									<CircleAlert size={32} style={{ color: 'var(--muted-foreground)' }} />
									<p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)' }}>
										No users found
									</p>
									<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
										Get started by creating a new user.
									</p>
									<Button
										size="sm"
										style={{ marginTop: '0.5rem' }}
										variant="ghost"
										color={ButtonColor.None}
										prefix={<Upload />}
									>
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
					Compact Table
				</h3>
				<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
					A compact version perfect for mobile devices or space-constrained layouts.
				</p>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead style={{ fontSize: '0.875rem' }}>User</TableHead>
							<TableHead style={{ fontSize: '0.875rem' }}>Role</TableHead>
							<TableHead style={{ fontSize: '0.875rem' }}>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.slice(0, 3).map((user) => (
							<TableRow key={user.id}>
								<TableCell>
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
											{user.avatar}
										</div>
										<div style={{ display: 'flex', flexDirection: 'column' }}>
											<span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{user.name}</span>
											<span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
												{user.email}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
										{user.role}
									</Badge>
								</TableCell>
								<TableCell>
									{user.status === 'active' && (
										<CircleCheck size={16} style={{ color: '#16a34a' }} />
									)}
									{user.status === 'inactive' && <CircleX size={16} style={{ color: '#dc2626' }} />}
									{user.status === 'pending' && <Clock size={16} style={{ color: '#ca8a04' }} />}
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
					Table with Fixed Height
				</h3>
				<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
					A table with a fixed height of 300px. When the content exceeds this height, it becomes
					scrollable while keeping the headers sticky.
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
								<TableCell style={{ fontWeight: 500 }}>{user.name}</TableCell>
								<TableCell style={{ color: 'var(--muted-foreground)' }}>{user.email}</TableCell>
								<TableCell style={{ textTransform: 'capitalize' }}>{user.role}</TableCell>
								<TableCell>{user.department}</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										style={
											user.status === 'active'
												? { backgroundColor: '#dcfce7', color: '#166534' }
												: { backgroundColor: '#f3f4f6', color: '#1f2937' }
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
								<TableCell style={{ fontWeight: 500 }}>{user.name}</TableCell>
								<TableCell style={{ color: 'var(--muted-foreground)' }}>{user.email}</TableCell>
								<TableCell style={{ textTransform: 'capitalize' }}>{user.role}</TableCell>
								<TableCell>{user.department}</TableCell>
								<TableCell>
									<Badge variant="outline" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
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
