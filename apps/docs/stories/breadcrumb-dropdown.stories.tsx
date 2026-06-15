import { Home } from '@signozhq/icons';
import {
	Breadcrumb,
	BreadcrumbDropdown,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

const meta: Meta<typeof BreadcrumbDropdown> = {
	title: 'Primitive Components/Breadcrumb/BreadcrumbDropdown',
	component: BreadcrumbDropdown,
	argTypes: {
		items: {
			control: 'object',
			description: 'The dropdown menu items. Each item has title, href, and onClick.',
			table: { category: 'Content', type: { summary: 'BreadcrumbDropdownItem[]' } },
		},
		id: {
			control: 'text',
			description: 'The id to apply to the dropdown trigger.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the dropdown trigger.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles applied to the dropdown trigger.',
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
			description: 'Accessible label for the dropdown.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description: 'ID of element that labels this dropdown.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-describedby': {
			control: 'text',
			description: 'ID of element that describes this dropdown.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description: 'The trigger text content.',
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
type Story = StoryObj<typeof BreadcrumbDropdown>;

export const Default: Story = {
	args: {
		children: 'Components',
		items: [
			{ title: 'Button', href: '#' },
			{ title: 'Input', href: '#' },
			{ title: 'Select', href: '#' },
		],
		testId: 'breadcrumb-dropdown',
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbDropdown {...args} />
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
		children: 'Category',
		items: [
			{ title: 'Option 1', onClick: fn() },
			{ title: 'Option 2', onClick: fn() },
			{ title: 'Option 3', onClick: fn() },
		],
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbDropdown {...args} />
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Current</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const ManyItems: Story = {
	args: {
		children: 'Select Category',
		items: [
			{ title: 'Documentation', href: '#' },
			{ title: 'Components', href: '#' },
			{ title: 'Themes', href: '#' },
			{ title: 'Examples', href: '#' },
			{ title: 'GitHub', href: '#' },
		],
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbDropdown {...args} />
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Current</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const WithIconsInPath: Story = {
	args: {
		children: 'Components',
		items: [
			{ title: 'General', href: '#' },
			{ title: 'Layout', href: '#' },
			{ title: 'Navigation', href: '#' },
		],
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
					<BreadcrumbDropdown {...args} />
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Breadcrumb</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Dropdown</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const MultipleDropdowns: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbDropdown
						items={[
							{ title: 'Category A', href: '#' },
							{ title: 'Category B', href: '#' },
						]}
					>
						Categories
					</BreadcrumbDropdown>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbDropdown
						items={[
							{ title: 'Subcategory 1', href: '#' },
							{ title: 'Subcategory 2', href: '#' },
						]}
					>
						Subcategories
					</BreadcrumbDropdown>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Item</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};
