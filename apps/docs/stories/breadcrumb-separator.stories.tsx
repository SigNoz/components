import { ChevronRight, Minus } from '@signozhq/icons';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof BreadcrumbSeparator> = {
	title: 'Components/Breadcrumb/BreadcrumbSeparator',
	component: BreadcrumbSeparator,
	argTypes: {
		id: {
			control: 'text',
			description: 'The id to apply to the separator element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the separator.',
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
		children: {
			control: 'text',
			description: 'Custom separator content. Defaults to chevron icon.',
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
type Story = StoryObj<typeof BreadcrumbSeparator>;

export const Default: Story = {
	args: {
		testId: 'breadcrumb-separator',
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator {...args} />
				<BreadcrumbItem>
					<BreadcrumbPage>Current</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const SlashSeparator: Story = {
	args: {
		children: '/',
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator {...args} />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Products</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator {...args} />
				<BreadcrumbItem>
					<BreadcrumbPage>Current</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const ChevronSeparator: Story = {
	args: {
		children: <ChevronRight size={14} />,
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator {...args} />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Products</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator {...args} />
				<BreadcrumbItem>
					<BreadcrumbPage>Current</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const CustomTextSeparator: Story = {
	args: {
		children: '→',
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator {...args} />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Products</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator {...args} />
				<BreadcrumbItem>
					<BreadcrumbPage>Current</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const IconSeparator: Story = {
	args: {
		children: <Minus size={14} />,
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator {...args} />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Products</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator {...args} />
				<BreadcrumbItem>
					<BreadcrumbPage>Current</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

export const ColonSeparator: Story = {
	args: {
		children: ':',
	},
	render: (args) => (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Location</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator {...args} />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Building</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator {...args} />
				<BreadcrumbItem>
					<BreadcrumbPage>Room</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};
