import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '@signozhq/pagination';

const meta: Meta<typeof Pagination> = {
	title: 'Components/Pagination',
	component: Pagination,
	argTypes: {
		current: {
			control: 'number',
			description: 'Current selected page (optional)',
		},
		total: {
			control: 'number',
			description: 'Total number of items',
			required: true,
		},
		pageSize: {
			control: 'number',
			description: 'Number of items per page',
			defaultValue: 10,
		},
		defaultCurrent: {
			control: 'number',
			description: 'Initial page number when uncontrolled',
			defaultValue: 1,
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description: 'Alignment of pagination component',
			defaultValue: 'start',
		},
		onPageChange: {
			action: 'page changed',
			description: 'Callback when page changes',
		},
	},
	parameters: {
		backgrounds: {
			default: 'dark',
		},
		design: [
			{
				name: 'Figma',
				type: 'figma',
				url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=40-1657&node-type=frame&t=RGQXgBfSXKWsYAz9-0',
			},
		],
	},
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
	args: {
		total: 50,
		current: 1,
	},
};

export const CustomPageSize: Story = {
	args: {
		total: 100,
		pageSize: 5,
		current: 1,
	},
};

export const CenterAligned: Story = {
	args: {
		total: 50,
		align: 'center',
		current: 1,
	},
};

export const EndAligned: Story = {
	args: {
		total: 50,
		align: 'end',
		current: 1,
	},
};

export const UncontrolledWithDefaultCurrent: Story = {
	args: {
		total: 50,
		defaultCurrent: 3,
	},
};

export const WithPageChangeHandler: Story = {
	args: {
		total: 50,
		current: 1,
		onPageChange: (page: number) => console.log(`Page changed to ${page}`),
	},
};

export const ThreePages_FirstSelected: Story = {
	args: {
		total: 30,
		current: 1,
	},
};

export const ThreePages_SecondSelected: Story = {
	args: {
		total: 30,
		current: 2,
	},
};

export const TenPages_FirstSelected: Story = {
	args: {
		total: 100,
		current: 1,
	},
};

export const TenPages_LastSelected: Story = {
	args: {
		total: 100,
		current: 10,
	},
};
