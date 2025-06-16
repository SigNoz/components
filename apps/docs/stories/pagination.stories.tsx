import type { Meta, StoryObj } from '@storybook/react';
import Pagination from '@signozhq/pagination';
import React, { useState } from 'react';
import type { ComponentProps } from 'react'; // Import ComponentProps
import { generateDocs } from '../utils/generateDocs';

const paginationExamples = [
	`import Pagination from '@signozhq/pagination';
import { useState } from 'react';

export default function MyComponent() {
	const [currentPage, setCurrentPage] = useState(1);
	
	return (
		<Pagination
			total={100}
			pageSize={10}
			current={currentPage}
			onPageChange={(page) => setCurrentPage(page)}
			align="center"
		/>
	);
}`,
];

const paginationDocs = generateDocs({
	packageName: '@signozhq/pagination',
	description:
		'A flexible pagination component for navigating through multi-page content.',
	examples: paginationExamples,
});

const meta: Meta<typeof Pagination> = {
	title: 'Components/Pagination',
	component: Pagination,
	argTypes: {
		current: {
			control: 'number',
			description: 'Current selected page',
			table: {
				disable: true,
			},
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
		docs: {
			description: {
				component: paginationDocs,
			},
		},
	},
};

export default meta;

type PaginationProps = ComponentProps<typeof Pagination>;
type Story = StoryObj<typeof Pagination>;

// Helper render function for controlled stories
const ControlledPagination = (
	args: PaginationProps,
	initialPage: number,
): JSX.Element => {
	const [currentPage, setCurrentPage] = useState(initialPage);

	return (
		<Pagination
			{...args}
			current={currentPage}
			onPageChange={(page): void => {
				setCurrentPage(page);
				args.onPageChange?.(page);
			}}
		/>
	);
};

export const Default: Story = {
	render: (args) => {
		const [currentPages, setCurrentPages] = useState({
			p1: 1,
			p2: 2,
			p3: 1,
			p4: 7,
			p5: 3,
			p6: 4,
			p7: 10,
		});

		const handlePageChange = (
			key: keyof typeof currentPages,
			page: number,
		): void => {
			setCurrentPages((prev) => ({ ...prev, [key]: page }));
			args.onPageChange?.(page);
		};

		return (
			<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
				<div>
					<p className="mb-2 text-sm text-gray-400">3 Pages - First Selected</p>
					<Pagination
						total={30}
						pageSize={10}
						current={currentPages.p1}
						onPageChange={(page): void => handlePageChange('p1', page)}
					/>
				</div>

				<div className="mt-6">
					{' '}
					<p className="mb-2 text-sm text-gray-400">3 Pages - Second Selected</p>
					<Pagination
						total={30}
						pageSize={10}
						current={currentPages.p2}
						onPageChange={(page): void => handlePageChange('p2', page)}
					/>
				</div>

				<div className="mt-6">
					{' '}
					<p className="mb-2 text-sm text-gray-400">10 Pages - First Selected</p>
					<Pagination
						total={100}
						pageSize={10}
						current={currentPages.p3}
						onPageChange={(page): void => handlePageChange('p3', page)}
					/>
				</div>

				<div className="mt-6">
					<p className="mb-2 text-sm text-gray-400">
						10 Pages - Middle Selected (Page 7)
					</p>
					<Pagination
						total={100}
						pageSize={10}
						current={currentPages.p4}
						onPageChange={(page): void => handlePageChange('p4', page)}
					/>
				</div>

				<div className="mt-6">
					<p className="mb-2 text-sm text-gray-400">5 Pages - Center Aligned</p>
					<Pagination
						total={50}
						pageSize={10}
						current={currentPages.p5}
						onPageChange={(page): void => handlePageChange('p5', page)}
						align="center"
					/>
				</div>

				<div className="mt-6">
					<p className="mb-2 text-sm text-gray-400">5 Pages - End Aligned</p>
					<Pagination
						total={50}
						pageSize={10}
						current={currentPages.p6}
						onPageChange={(page): void => handlePageChange('p6', page)}
						align="end"
					/>
				</div>

				<div className="mt-6">
					<p className="mb-2 text-sm text-gray-400">10 Pages - Last Selected</p>
					<Pagination
						total={100}
						pageSize={10}
						current={currentPages.p7}
						onPageChange={(page): void => handlePageChange('p7', page)}
					/>
				</div>
			</div>
		);
	},
};

export const CustomPageSize: Story = {
	args: {
		total: 100,
		pageSize: 5,
	},
	render: (args) => {
		const [currentPage, setCurrentPage] = useState(1);
		return (
			<Pagination
				{...args}
				current={currentPage}
				onPageChange={(page): void => {
					setCurrentPage(page);
					args.onPageChange?.(page);
				}}
			/>
		);
	},
};

export const CenterAligned: Story = {
	args: {
		total: 50,
		align: 'center',
	},
	render: (args) => {
		const [currentPage, setCurrentPage] = useState(1);
		return (
			<Pagination
				{...args}
				current={currentPage}
				onPageChange={(page): void => {
					setCurrentPage(page);
					args.onPageChange?.(page);
				}}
			/>
		);
	},
};

export const EndAligned: Story = {
	args: {
		total: 50,
		align: 'end',
	},
	render: (args) => {
		const [currentPage, setCurrentPage] = useState(1);
		return (
			<Pagination
				{...args}
				current={currentPage}
				onPageChange={(page): void => {
					setCurrentPage(page);
					args.onPageChange?.(page);
				}}
			/>
		);
	},
};

export const WithPageChangeHandler: Story = {
	args: {
		total: 50,
	},
	render: (args) => {
		const [currentPage, setCurrentPage] = useState(1); // Initial page set to 1
		return (
			<Pagination
				{...args}
				current={currentPage}
				onPageChange={(page): void => {
					setCurrentPage(page);
					args.onPageChange?.(page);
					console.log(`Page changed to ${page}`);
				}}
			/>
		);
	},
};

export const ThreePages_FirstSelected: Story = {
	args: {
		total: 30,
	},
	render: (args) => ControlledPagination(args, 1),
};

export const ThreePages_SecondSelected: Story = {
	args: {
		total: 30,
	},
	render: (args) => ControlledPagination(args, 2),
};

export const TenPages_FirstSelected: Story = {
	args: {
		total: 100,
	},
	render: (args) => ControlledPagination(args, 1),
};

export const TenPages_LastSelected: Story = {
	args: {
		total: 100,
	},
	render: (args) => ControlledPagination(args, 10),
};
