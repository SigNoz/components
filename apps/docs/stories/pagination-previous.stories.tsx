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

const meta: Meta<typeof PaginationPrevious> = {
	title: 'Components/Pagination/PaginationPrevious',
	component: PaginationPrevious,
	argTypes: buttonArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PaginationPrevious>;

export const Default: Story = {
	args: {
		disabled: false,
	},
	render: (args) => {
		const [current, setCurrent] = useState(2);

		return (
			<PaginationContainer>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							{...args}
							disabled={args.disabled ?? current === 1}
							onClick={() => setCurrent((p) => Math.max(1, p - 1))}
						/>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink isActive={current === 1} onClick={() => setCurrent(1)}>
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
