import { PaginationUrl } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NuqsAdapter } from 'nuqs/adapters/react';

const meta: Meta<typeof PaginationUrl> = {
	title: 'Components/Pagination/PaginationUrl',
	component: PaginationUrl,
	argTypes: {
		urlKey: {
			control: 'text',
			description: 'Query parameter key for the current page in the URL',
			table: {
				category: 'Behavior',
				type: { summary: 'string' },
				defaultValue: { summary: "'page'" },
			},
		},
		total: {
			control: 'number',
			description: 'Total number of items',
			table: { category: 'Content', type: { summary: 'number' } },
		},
		pageSize: {
			control: 'number',
			description: 'Number of items per page',
			table: { category: 'Content', type: { summary: 'number' }, defaultValue: { summary: '10' } },
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description: 'Alignment of the pagination container',
			table: {
				category: 'Appearance',
				type: { summary: "'start' | 'center' | 'end'" },
				defaultValue: { summary: "'start'" },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the pagination container',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PaginationUrl>;

export const Default: Story = {
	args: {
		urlKey: 'page',
		total: 100,
		pageSize: 10,
		align: 'start',
	},
	decorators: [
		(Story) => (
			<NuqsAdapter>
				<Story />
			</NuqsAdapter>
		),
	],
};

export const CustomUrlKey: Story = {
	args: {
		urlKey: 'logs-page',
		total: 500,
		pageSize: 25,
		align: 'center',
	},
	decorators: [
		(Story) => (
			<NuqsAdapter>
				<Story />
			</NuqsAdapter>
		),
	],
};
