import {
	PaginationContainer,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof PaginationItem> = {
	title: 'Components/Pagination/PaginationItem',
	component: PaginationItem,
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS classes',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the pagination item',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PaginationItem>;

export const Default: Story = {
	args: {},
	render: (args) => {
		const [current, setCurrent] = useState(1);

		return (
			<PaginationContainer>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={() => setCurrent((p) => Math.max(1, p - 1))}
							disabled={current === 1}
						/>
					</PaginationItem>
					<PaginationItem {...args}>
						<PaginationLink isActive={current === 1} onClick={() => setCurrent(1)}>
							1
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext
							onClick={() => setCurrent((p) => Math.min(3, p + 1))}
							disabled={current === 3}
						/>
					</PaginationItem>
				</PaginationContent>
			</PaginationContainer>
		);
	},
};
