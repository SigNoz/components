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

const meta: Meta<typeof PaginationEllipsis> = {
	title: 'Components/Pagination/PaginationEllipsis',
	component: PaginationEllipsis,
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS classes',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the ellipsis',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PaginationEllipsis>;

export const Default: Story = {
	args: {},
	render: (args) => {
		const [current, setCurrent] = useState(5);
		const totalPages = 10;

		return (
			<PaginationContainer>
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
						<PaginationEllipsis {...args} />
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
