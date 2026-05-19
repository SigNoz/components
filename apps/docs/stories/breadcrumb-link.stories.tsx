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
	title: 'Components/Breadcrumb/BreadcrumbLink',
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

export const WithIcon: Story = {
	args: {
		href: '#',
		icon: <Home size={16} />,
		children: 'Home',
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

export const IconOnly: Story = {
	args: {
		href: '#',
		icon: <Home size={16} />,
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

export const WithOnClick: Story = {
	args: {
		href: '#',
		children: 'Click Me',
		onClick: fn(),
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

export const MultipleWithIcons: Story = {
	render: () => (
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
	),
};

export const WithExternalLink: Story = {
	args: {
		href: 'https://example.com',
		target: '_blank',
		rel: 'noopener noreferrer',
		children: 'External Link',
		title: 'Opens in new tab',
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

export const WithAriaLabel: Story = {
	args: {
		href: '#',
		children: 'Home',
		'aria-label': 'Go to home page',
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
