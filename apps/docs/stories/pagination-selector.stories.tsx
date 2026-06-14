import { PaginationSelector } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

const meta: Meta<typeof PaginationSelector> = {
	title: 'Primitive Components/Pagination/PaginationSelector',
	component: PaginationSelector,
	argTypes: {
		label: {
			control: 'text',
			description: 'The label to display next to the selector.',
			table: {
				category: 'Content',
				type: { summary: 'string' },
				defaultValue: { summary: 'Rows per page' },
			},
		},
		value: {
			control: 'number',
			description: 'The current page size value.',
			table: { category: 'State', type: { summary: 'number' } },
		},
		options: {
			control: 'object',
			description: 'Options for the page size selector.',
			table: {
				category: 'Behavior',
				type: { summary: 'number[]' },
				defaultValue: { summary: '[10, 20, 30, 40, 50]' },
			},
		},
		onChange: {
			control: false,
			description: 'The function to call when the page size changes.',
			table: { category: 'Events', type: { summary: '(pageSize: number) => void' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the pagination selector',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PaginationSelector>;

export const Default: Story = {
	args: {
		value: 10,
		options: [10, 20, 30, 40, 50],
		label: 'Rows per page',
	},
	render: (args) => {
		const [value, setValue] = useState(args.value ?? 10);

		useEffect(() => {
			if (args.value !== undefined) {
				setValue(args.value);
			}
		}, [args.value]);

		return (
			<div style={{ padding: '24px' }}>
				<PaginationSelector
					{...args}
					value={value}
					onChange={(newSize) => {
						setValue(newSize);
						args.onChange?.(newSize);
					}}
				/>
			</div>
		);
	},
};
