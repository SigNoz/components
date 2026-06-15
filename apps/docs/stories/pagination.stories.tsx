import { Pagination } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';

type PaginationProps = ComponentProps<typeof Pagination>;

function ControlledPagination({
	initialPage,
	...args
}: PaginationProps & { initialPage: number }): JSX.Element {
	const [currentPage, setCurrentPage] = useState(args.current ?? initialPage);

	useEffect(() => {
		if (args.current !== undefined) {
			setCurrentPage(args.current);
		}
	}, [args.current]);

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
}

function PaginationWithPageChangeHandler(args: PaginationProps) {
	const [currentPage, setCurrentPage] = useState(args.current ?? 1);

	useEffect(() => {
		if (args.current !== undefined) {
			setCurrentPage(args.current);
		}
	}, [args.current]);

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
}

function PaginationWithPageSizeSelector(
	args: PaginationProps & { pageSizePosition?: 'left' | 'right' }
) {
	const [current, setCurrent] = useState(args.current ?? 1);
	const [pageSize, setPageSize] = useState(args.pageSize ?? 10);

	useEffect(() => {
		if (args.current !== undefined) {
			setCurrent(args.current);
		}
	}, [args.current]);

	useEffect(() => {
		if (args.pageSize !== undefined) {
			setPageSize(args.pageSize);
		}
	}, [args.pageSize]);

	return (
		<Pagination
			{...args}
			current={current}
			onPageChange={setCurrent}
			pageSize={pageSize}
			onPageSizeChange={(newSize) => {
				setPageSize(newSize);
				args.onPageSizeChange?.(newSize);
			}}
		/>
	);
}

const meta: Meta<typeof Pagination> = {
	title: 'Composed Components/Pagination',
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
		enablePageSize: {
			control: 'boolean',
			description: 'Whether to enable the page size selector',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		pageSizeOptions: {
			control: 'object',
			description: 'Options for the page size selector',
			table: {
				category: 'Behavior',
				type: { summary: 'number[]' },
				defaultValue: { summary: '[10, 20, 30, 40, 50]' },
			},
		},
		onPageSizeChange: {
			control: false,
			description: 'Callback when the page size changes',
			table: { category: 'Events', type: { summary: '(pageSize: number) => void' } },
		},
		pageSizePosition: {
			control: 'select',
			options: ['left', 'right'],
			description: 'Position of the page size selector relative to pagination controls',
			table: {
				category: 'Behavior',
				type: { summary: "'left' | 'right'" },
				defaultValue: { summary: "'right'" },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles for custom styling.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
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
	args: {
		total: 100,
		pageSize: 10,
	},
	render: (args) => <ControlledPagination {...args} initialPage={1} />,
};

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => (
		<div
			style={{
				padding: '2rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Center Aligned
				</h3>
				<ControlledPagination total={50} pageSize={10} align="center" initialPage={1} />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					End Aligned
				</h3>
				<ControlledPagination total={50} pageSize={10} align="end" initialPage={1} />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Custom Page Size
				</h3>
				<ControlledPagination total={100} pageSize={5} initialPage={1} />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Page Change Handler
				</h3>
				<PaginationWithPageChangeHandler total={50} />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Three Pages First Selected
				</h3>
				<ControlledPagination total={30} initialPage={1} />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Three Pages Second Selected
				</h3>
				<ControlledPagination total={30} initialPage={2} />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Ten Pages First Selected
				</h3>
				<ControlledPagination total={100} initialPage={1} />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Ten Pages Last Selected
				</h3>
				<ControlledPagination total={100} initialPage={10} />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Page Size Selector
				</h3>
				<PaginationWithPageSizeSelector total={100} pageSize={10} enablePageSize />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Page Size Selector Left
				</h3>
				<PaginationWithPageSizeSelector
					total={100}
					pageSize={10}
					enablePageSize
					pageSizePosition="left"
				/>
			</section>
		</div>
	),
};
