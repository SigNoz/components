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
import { buttonArgTypes } from './shared/button-arg-types.js';

const meta: Meta<typeof PaginationLink> = {
	title: 'Components/Pagination/PaginationLink',
	component: PaginationLink,
	argTypes: {
		isActive: {
			control: 'boolean',
			description: 'Whether this link represents the current page',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		...buttonArgTypes,
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PaginationLink>;

export const Default: Story = {
	args: {
		isActive: false,
	},
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
					<PaginationItem>
						<PaginationLink
							{...args}
							isActive={args.isActive ?? current === 1}
							onClick={() => setCurrent(1)}
						>
							1
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink isActive={current === 2} onClick={() => setCurrent(2)}>
							2
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
