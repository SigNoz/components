import { FileText, Home, Settings } from '@signozhq/icons';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof BreadcrumbPage> = {
	title: 'Components/Breadcrumb/BreadcrumbPage',
	component: BreadcrumbPage,
	argTypes: {
		id: {
			control: 'text',
			description: 'The id to apply to the page element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the page text.',
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
			description: 'Accessible label for the page.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description: 'ID of element that labels this page.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-describedby': {
			control: 'text',
			description: 'ID of element that describes this page.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		icon: {
			control: false,
			description: 'Icon to display before the page text.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		children: {
			control: 'text',
			description: 'The current page text.',
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
type Story = StoryObj<typeof BreadcrumbPage>;

export const Default: Story = {
	args: {
		children: 'Current Page',
		testId: 'breadcrumb-page',
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage {...args} />
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const WithIcon: Story = {
	args: {
		icon: <FileText size={16} />,
		children: 'Document',
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#" icon={<Home size={16} />}>
						Home
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage {...args} />
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const IconOnly: Story = {
	args: {
		icon: <Settings size={16} />,
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage {...args} />
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const LongText: Story = {
	args: {
		children: 'This is a very long page title that might overflow',
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage {...args} />
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const WithCustomClassName: Story = {
	args: {
		className: 'text-blue-400',
		children: 'Styled Page',
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage {...args} />
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};
