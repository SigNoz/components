import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Pagination } from '../pagination.js';
import type { PaginationProps } from '../types.js';

const LABEL = 'Rows per page';
const DEFAULT_SIZES = ['10', '20', '30', '40', '50'];

async function openPageSize(name = LABEL): Promise<HTMLElement> {
	await userEvent.click(screen.getByRole('combobox', { name }));

	return screen.findByRole('listbox');
}

function optionNames(listbox: HTMLElement): string[] {
	return within(listbox)
		.getAllByRole('option')
		.map((option) => option.textContent ?? '');
}

function follows(first: Element, second: Element): boolean {
	return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Pagination page size selector', () => {
	it('is not rendered without pageSizeOptions', () => {
		render(<Pagination total={100} testId="p" />);

		expect(screen.queryByRole('combobox')).toBeNull();
		expect(screen.queryByTestId('p-page-size')).toBeNull();
	});

	it('is not rendered with pageSizeOptions false', () => {
		render(<Pagination total={100} pageSizeOptions={false} testId="p" />);

		expect(screen.queryByRole('combobox')).toBeNull();
		expect(screen.queryByTestId('p-page-size')).toBeNull();
	});

	it('shows Rows per page and names the selector with it', () => {
		render(<Pagination total={100} pageSizeOptions testId="p" />);

		const wrapper = screen.getByTestId('p-page-size');

		expect(within(wrapper).getByText(LABEL)).toBeVisible();
		expect(screen.getByRole('combobox', { name: LABEL })).toBeInTheDocument();
	});

	it('names the selector through aria-labelledby', () => {
		render(<Pagination total={100} pageSizeOptions />);

		const select = screen.getByRole('combobox', { name: LABEL });
		const labelledBy = select.getAttribute('aria-labelledby');

		expect(labelledBy).toBeTruthy();
		expect(document.getElementById(labelledBy ?? '')).toHaveTextContent(LABEL);
	});

	it('takes the label from pageSizeOptions.label', () => {
		render(<Pagination total={100} pageSizeOptions={{ label: 'Items per page' }} />);

		expect(screen.getByRole('combobox', { name: 'Items per page' })).toBeInTheDocument();
		expect(screen.queryByRole('combobox', { name: LABEL })).toBeNull();
	});

	it('renders the selector with the defaults for pageSizeOptions true', async () => {
		render(<Pagination total={1000} pageSizeOptions testId="p" />);

		const wrapper = screen.getByTestId('p-page-size');

		expect(within(wrapper).getByText(LABEL)).toBeVisible();
		expect(follows(screen.getByTestId('p-next'), wrapper)).toBe(true);
		expect(optionNames(await openPageSize())).toEqual(DEFAULT_SIZES);
	});

	it('renders the selector with the defaults for an empty pageSizeOptions object', async () => {
		render(<Pagination total={1000} pageSizeOptions={{}} testId="p" />);

		const wrapper = screen.getByTestId('p-page-size');

		expect(within(wrapper).getByText(LABEL)).toBeVisible();
		expect(follows(screen.getByTestId('p-next'), wrapper)).toBe(true);
		expect(optionNames(await openPageSize())).toEqual(DEFAULT_SIZES);
	});

	it('keeps the default items and position when pageSizeOptions only sets the label', async () => {
		render(<Pagination total={1000} pageSizeOptions={{ label: 'Items per page' }} testId="p" />);

		expect(follows(screen.getByTestId('p-next'), screen.getByTestId('p-page-size'))).toBe(true);
		expect(optionNames(await openPageSize('Items per page'))).toEqual(DEFAULT_SIZES);
	});

	it('keeps the default label and items when pageSizeOptions only sets the position', async () => {
		render(<Pagination total={1000} pageSizeOptions={{ position: 'start' }} testId="p" />);

		const wrapper = screen.getByTestId('p-page-size');

		expect(within(wrapper).getByText(LABEL)).toBeVisible();
		expect(follows(wrapper, screen.getByTestId('p-previous'))).toBe(true);
		expect(optionNames(await openPageSize())).toEqual(DEFAULT_SIZES);
	});

	it('keeps the default label and position when pageSizeOptions only sets the items', async () => {
		render(<Pagination total={1000} pageSizeOptions={{ items: [10, 25, 100] }} testId="p" />);

		const wrapper = screen.getByTestId('p-page-size');

		expect(within(wrapper).getByText(LABEL)).toBeVisible();
		expect(follows(screen.getByTestId('p-next'), wrapper)).toBe(true);
		expect(optionNames(await openPageSize())).toEqual(['10', '25', '100']);
	});

	it('lists 10, 20, 30, 40 and 50 by default and selects the current size', async () => {
		render(<Pagination total={1000} pageSizeOptions />);

		const listbox = await openPageSize();

		expect(optionNames(listbox)).toEqual(['10', '20', '30', '40', '50']);
		expect(within(listbox).getByRole('option', { name: '10' })).toHaveAttribute(
			'aria-selected',
			'true',
		);
	});

	it('lists the options it is given', async () => {
		render(<Pagination total={1000} pageSizeOptions={{ items: [10, 25, 100] }} />);

		expect(optionNames(await openPageSize())).toEqual(['10', '25', '100']);
	});

	it.each([
		[5, ['5', '10', '20', '30', '40', '50']],
		[15, ['10', '15', '20', '30', '40', '50']],
		[35, ['10', '20', '30', '35', '40', '50']],
		[100, ['10', '20', '30', '40', '50', '100']],
	])(
		'inserts a page size of %i missing from the options in numeric order',
		async (pageSize, names) => {
			render(<Pagination total={1000} pageSizeOptions pageSize={pageSize} />);

			const listbox = await openPageSize();

			expect(optionNames(listbox)).toEqual(names);
			expect(within(listbox).getByRole('option', { name: String(pageSize) })).toHaveAttribute(
				'aria-selected',
				'true',
			);
		},
	);

	it('shows the label of an option in the list and its value once picked', async () => {
		render(
			<Pagination
				total={1000}
				pageSize={25}
				pageSizeOptions={{ items: [10, { value: 25, label: 'Auto (25)' }, 50] }}
			/>,
		);

		const select = screen.getByRole('combobox', { name: LABEL });

		expect(select).toHaveTextContent('25');
		expect(select).not.toHaveTextContent('Auto');

		const listbox = await openPageSize();

		expect(optionNames(listbox)).toEqual(['10', 'Auto (25)', '50']);
		expect(within(listbox).getByRole('option', { name: 'Auto (25)' })).toHaveAttribute(
			'aria-selected',
			'true',
		);
	});

	it('reports the value of a labelled option', async () => {
		const onPageSizeChange = vi.fn();
		render(
			<Pagination
				total={1000}
				pageSizeOptions={{ items: [10, { value: 25, label: 'Auto (25)' }, 50] }}
				onPageSizeChange={onPageSizeChange}
			/>,
		);

		const listbox = await openPageSize();

		await userEvent.click(within(listbox).getByRole('option', { name: 'Auto (25)' }));

		expect(onPageSizeChange).toHaveBeenCalledWith(25);
		expect(screen.getByRole('combobox', { name: LABEL })).toHaveTextContent('25');
	});

	it('drops a repeated value from the list and warns', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(
			<Pagination
				total={1000}
				pageSizeOptions={{ items: [10, { value: 10, label: 'Ten' }, 20] }}
			/>,
		);

		expect(optionNames(await openPageSize())).toEqual(['10', '20']);
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('two `pageSizeOptions.items` share a `value`'),
		);
	});

	it('drops a value that is not a positive integer from the list and warns', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(<Pagination total={1000} pageSizeOptions={{ items: [0, 10, 2.5, 20] }} />);

		expect(optionNames(await openPageSize())).toEqual(['10', '20']);
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('a `pageSizeOptions.items` value is not a positive integer'),
		);
	});

	it('renders no selector and logs nothing with pageSizeOptions false', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(<Pagination total={1000} pageSizeOptions={false} />);

		expect(screen.queryByRole('combobox')).toBeNull();
		expect(warn).not.toHaveBeenCalled();
	});

	it('calls onPageSizeChange with the size and then onPageChange with 1', async () => {
		const onPageSizeChange = vi.fn();
		const onPageChange = vi.fn();
		render(
			<Pagination
				total={1000}
				pageSizeOptions
				current={5}
				pageSize={10}
				onPageSizeChange={onPageSizeChange}
				onPageChange={onPageChange}
			/>,
		);

		const listbox = await openPageSize();

		await userEvent.click(within(listbox).getByRole('option', { name: '20' }));

		expect(onPageSizeChange).toHaveBeenCalledTimes(1);
		expect(onPageSizeChange).toHaveBeenCalledWith(20);
		expect(onPageChange).toHaveBeenCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(1);
		expect(onPageSizeChange.mock.invocationCallOrder[0]).toBeLessThan(
			onPageChange.mock.invocationCallOrder[0] ?? 0,
		);
	});

	it('keeps its own size and goes back to page 1, when uncontrolled', async () => {
		render(<Pagination total={1000} pageSizeOptions defaultCurrent={5} testId="p" />);

		const listbox = await openPageSize();

		await userEvent.click(within(listbox).getByRole('option', { name: '50' }));

		await waitFor(() => {
			expect(screen.getByRole('combobox', { name: LABEL })).toHaveTextContent('50');
		});
		expect(document.querySelector('[aria-current="page"]')).toHaveTextContent('1');
		expect(screen.getByTestId('p-total')).toHaveTextContent('1 \u2014 50 of 1,000');
	});

	it('leaves the size to the consumer, when controlled', async () => {
		const onPageSizeChange = vi.fn();
		const { rerender } = render(
			<Pagination
				total={1000}
				pageSizeOptions
				pageSize={10}
				current={5}
				onPageSizeChange={onPageSizeChange}
			/>,
		);

		const listbox = await openPageSize();

		await userEvent.click(within(listbox).getByRole('option', { name: '20' }));

		expect(screen.getByRole('combobox', { name: LABEL })).toHaveTextContent('10');
		expect(document.querySelector('[aria-current="page"]')).toHaveTextContent('5');

		rerender(
			<Pagination
				total={1000}
				pageSizeOptions
				pageSize={20}
				current={1}
				onPageSizeChange={onPageSizeChange}
			/>,
		);

		expect(screen.getByRole('combobox', { name: LABEL })).toHaveTextContent('20');
	});

	it('does not call anything when the picked size is the current one', async () => {
		const onPageSizeChange = vi.fn();
		const onPageChange = vi.fn();
		render(
			<Pagination
				total={1000}
				pageSizeOptions
				pageSize={10}
				onPageSizeChange={onPageSizeChange}
				onPageChange={onPageChange}
			/>,
		);

		const listbox = await openPageSize();

		await userEvent.click(within(listbox).getByRole('option', { name: '10' }));

		expect(onPageSizeChange).not.toHaveBeenCalled();
		expect(onPageChange).not.toHaveBeenCalled();
	});

	it('keeps the selector while the page size takes the list to a single page', async () => {
		function Harness(props: Partial<PaginationProps>) {
			const [size, setSize] = useState(10);

			return (
				<Pagination
					total={30}
					pageSizeOptions
					pageSize={size}
					onPageSizeChange={setSize}
					testId="p"
					{...props}
				/>
			);
		}

		render(<Harness />);

		const listbox = await openPageSize();

		await userEvent.click(within(listbox).getByRole('option', { name: '50' }));

		expect(screen.getByTestId('p')).toBeInTheDocument();
		expect(screen.getByRole('combobox', { name: LABEL })).toHaveTextContent('50');

		const reopened = await openPageSize();

		await userEvent.click(within(reopened).getByRole('option', { name: '10' }));

		expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
	});

	it('names the selector parts from the test id', async () => {
		render(<Pagination total={1000} pageSizeOptions testId="p" />);

		await userEvent.click(screen.getByTestId('p-page-size-select'));

		expect(await screen.findByTestId('p-page-size-select-item-20')).toBeInTheDocument();
	});

	it('names every row from the test id, the page size added to the list included', async () => {
		render(
			<Pagination
				total={1000}
				pageSize={25}
				pageSizeOptions={{ items: [10, { value: 50, label: 'Fifty' }] }}
				testId="p"
			/>,
		);

		const listbox = await openPageSize();

		expect(
			within(listbox)
				.getAllByRole('option')
				.map((option) => option.getAttribute('data-testid')),
		).toEqual([
			'p-page-size-select-item-10',
			'p-page-size-select-item-25',
			'p-page-size-select-item-50',
		]);
	});

	it("names a row with the item's own testId in place of the inherited one", async () => {
		render(
			<Pagination
				total={1000}
				pageSizeOptions={{ items: [10, { value: 20, label: '20', testId: 'twenty' }] }}
				testId="p"
			/>,
		);

		const listbox = await openPageSize();

		expect(within(listbox).getByTestId('twenty')).toHaveAccessibleName('20');
		expect(within(listbox).queryByTestId('p-page-size-select-item-20')).not.toBeInTheDocument();
		expect(within(listbox).getByTestId('p-page-size-select-item-10')).toBeInTheDocument();
	});

	it("names a row with the item's own testId when the pagination has none", async () => {
		render(
			<Pagination
				total={1000}
				pageSizeOptions={{ items: [{ value: 20, label: '20', testId: 'twenty' }, 50] }}
			/>,
		);

		const listbox = await openPageSize();

		expect(within(listbox).getByTestId('twenty')).toHaveAccessibleName('20');
		expect(within(listbox).getByRole('option', { name: '50' })).not.toHaveAttribute('data-testid');
	});
});

describe('Pagination page size position', () => {
	it('places the selector after the page controls by default', () => {
		render(<Pagination total={1000} pageSizeOptions testId="p" />);

		expect(follows(screen.getByTestId('p-next'), screen.getByTestId('p-page-size'))).toBe(true);
	});

	it('places the selector before the page controls with pageSizeOptions.position start', () => {
		render(<Pagination total={1000} pageSizeOptions={{ position: 'start' }} testId="p" />);

		expect(follows(screen.getByTestId('p-page-size'), screen.getByTestId('p-previous'))).toBe(true);
	});

	it('places the selector at the end for a value it does not know, such as the old left', () => {
		render(<Pagination total={1000} pageSizeOptions={{ position: 'left' as never }} testId="p" />);

		expect(follows(screen.getByTestId('p-next'), screen.getByTestId('p-page-size'))).toBe(true);
	});

	it('keeps the selector after the position label in both places', () => {
		render(<Pagination total={1000} pageSizeOptions={{ position: 'start' }} testId="p" />);

		expect(follows(screen.getByTestId('p-total'), screen.getByTestId('p-page-size'))).toBe(true);
	});

	it('places the selector next to the compact controls too', () => {
		const { unmount } = render(
			<Pagination total={1000} variant="compact" pageSizeOptions testId="p" />,
		);

		expect(follows(screen.getByTestId('p-next'), screen.getByTestId('p-page-size'))).toBe(true);
		unmount();

		render(
			<Pagination
				total={1000}
				variant="compact"
				pageSizeOptions={{ position: 'start' }}
				testId="p"
			/>,
		);

		expect(follows(screen.getByTestId('p-page-size'), screen.getByTestId('p-next'))).toBe(true);
	});
});
