import {
	PaginationContainer,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof PaginationContainer> = {
	title: 'Components/Pagination/PaginationContainer',
	component: PaginationContainer,
	argTypes: {
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
type Story = StoryObj<typeof PaginationContainer>;

export const Default: Story = {
	args: {
		align: 'start',
	},
	render: (args) => {
		const [current, setCurrent] = useState(1);
		const totalPages = 10;

		return (
			<PaginationContainer {...args}>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={() => setCurrent((p) => Math.max(1, p - 1))}
							disabled={current === 1}
						/>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink isActive={current === 1} onClick={() => setCurrent(1)}>
							1
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink
							isActive={current === totalPages}
							onClick={() => setCurrent(totalPages)}
						>
							{totalPages}
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext
							onClick={() => setCurrent((p) => Math.min(totalPages, p + 1))}
							disabled={current === totalPages}
						/>
					</PaginationItem>
				</PaginationContent>
			</PaginationContainer>
		);
	},
};
