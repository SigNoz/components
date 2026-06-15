import { Folder, Home, Settings } from '@signozhq/icons';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

const meta: Meta<typeof BreadcrumbLink> = {
	title: 'Primitive Components/Breadcrumb/BreadcrumbLink',
	component: BreadcrumbLink,
	argTypes: {
		href: {
			control: 'text',
			description: 'The URL the link navigates to.',
			table: { category: 'Navigation', type: { summary: 'string' } },
		},
		target: {
			control: 'select',
			options: ['_self', '_blank', '_parent', '_top'],
			description: 'Where to open the linked URL.',
			table: { category: 'Navigation', type: { summary: 'string' } },
		},
		rel: {
			control: 'text',
			description: 'Relationship between current and linked document.',
			table: { category: 'Navigation', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'The id to apply to the link element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the link.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles applied to the link.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for automated testing.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		title: {
			control: 'text',
			description: 'Tooltip text shown on hover.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-label': {
			control: 'text',
			description: 'Accessible label for the link.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description: 'ID of element that labels this link.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-describedby': {
			control: 'text',
			description: 'ID of element that describes this link.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		icon: {
			control: false,
			description: 'Icon to display before the link text.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		onClick: {
			control: false,
			description: 'Click handler for the link.',
			table: { category: 'Events', type: { summary: '(e: MouseEvent) => void' } },
		},
		children: {
			control: 'text',
			description: 'The link text content.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
	},
	parameters: {
		layout: 'padded',
		backgrounds: { default: 'dark' },
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BreadcrumbLink>;

export const Default: Story = {
	args: {
		href: '#',
		children: 'Home',
		testId: 'breadcrumb-link',
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink {...args} />
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Current</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const Preview: Story = {
	render: () => (
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
					With Icon
				</h3>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#" icon={<Home size={16} />}>
								Home
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Current</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
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
					Icon Only
				</h3>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#" icon={<Home size={16} />} />
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Current</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
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
					With On Click
				</h3>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#" onClick={fn()}>
								Click Me
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Current</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
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
					Multiple With Icons
				</h3>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#" icon={<Home size={16} />}>
								Home
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="#" icon={<Folder size={16} />}>
								Documents
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="#" icon={<Settings size={16} />}>
								Settings
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Current</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
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
					With External Link
				</h3>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								href="https://example.com"
								target="_blank"
								rel="noopener noreferrer"
								title="Opens in new tab"
							>
								External Link
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Current</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
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
					With Aria Label
				</h3>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#" aria-label="Go to home page">
								Home
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Current</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</section>
		</div>
	),
};
