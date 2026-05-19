import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Breadcrumb> = {
	title: 'Components/Breadcrumb/Breadcrumb',
	component: Breadcrumb,
	argTypes: {
		id: {
			control: 'text',
			description: 'The id to apply to the breadcrumb nav element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the breadcrumb container.',
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
			description: 'Accessible label for the breadcrumb navigation.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description: 'ID of element that labels this breadcrumb.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-describedby': {
			control: 'text',
			description: 'ID of element that describes this breadcrumb.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		children: {
			control: false,
			description: 'The breadcrumb content (typically BreadcrumbList).',
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
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
	args: {
		testId: 'breadcrumb-nav',
	},
	render: (args) => (
		<Breadcrumb {...args}>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Products</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Current Page</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const WithCustomClassName: Story = {
	args: {
		className: 'custom-breadcrumb-class',
	},
	render: (args) => (
		<Breadcrumb {...args}>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Current</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const SingleItem: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbPage>Dashboard</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const DeepNesting: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Category</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Subcategory</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Product Type</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Product Details</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};
