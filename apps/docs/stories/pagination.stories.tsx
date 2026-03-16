import { Pagination } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { useState } from 'react';

type PaginationProps = ComponentProps<typeof Pagination>;

const ControlledPagination = (args: PaginationProps, initialPage: number): JSX.Element => {
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

const meta: Meta<typeof Pagination> = {
	title: 'Components/Pagination/Pagination',
	component: Pagination,
	argTypes: {
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
		current: {
			control: 'number',
			description: 'Current page (controlled mode)',
			table: { category: 'State', type: { summary: 'number' } },
		},
		defaultCurrent: {
			control: 'number',
			description: 'Initial page when uncontrolled',
			table: { category: 'State', type: { summary: 'number' }, defaultValue: { summary: '1' } },
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
		onPageChange: {
			control: false,
			description: 'Callback when the page changes',
			table: { category: 'Events', type: { summary: '(page: number) => void' } },
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
		design: [
			{
				name: 'Figma',
				type: 'figma',
				url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=40-1657&node-type=frame&t=RGQXgBfSXKWsYAz9-0',
			},
		],
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

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

		const handlePageChange = (key: keyof typeof currentPages, page: number): void => {
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
					<p className="mb-2 text-sm text-gray-400">3 Pages - Second Selected</p>
					<Pagination
						total={30}
						pageSize={10}
						current={currentPages.p2}
						onPageChange={(page): void => handlePageChange('p2', page)}
					/>
				</div>

				<div className="mt-6">
					<p className="mb-2 text-sm text-gray-400">10 Pages - First Selected</p>
					<Pagination
						total={100}
						pageSize={10}
						current={currentPages.p3}
						onPageChange={(page): void => handlePageChange('p3', page)}
					/>
				</div>

				<div className="mt-6">
					<p className="mb-2 text-sm text-gray-400">10 Pages - Middle Selected (Page 7)</p>
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

export const CenterAligned: Story = {
	args: {
		total: 50,
		pageSize: 10,
		align: 'center',
	},
	render: (args) => {
		const [current, setCurrent] = useState(1);
		return <Pagination {...args} current={current} onPageChange={setCurrent} />;
	},
};

export const EndAligned: Story = {
	args: {
		total: 50,
		pageSize: 10,
		align: 'end',
	},
	render: (args) => {
		const [current, setCurrent] = useState(1);
		return <Pagination {...args} current={current} onPageChange={setCurrent} />;
	},
};

export const CustomPageSize: Story = {
	args: {
		total: 100,
		pageSize: 5,
	},
	render: (args) => {
		const [current, setCurrent] = useState(1);
		return <Pagination {...args} current={current} onPageChange={setCurrent} />;
	},
};

export const WithPageChangeHandler: Story = {
	args: {
		total: 50,
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
