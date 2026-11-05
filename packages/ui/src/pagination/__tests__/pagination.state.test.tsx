import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Pagination } from '../pagination.js';
import { positionOf, slotsOf } from './pagination.test-utils.js';

function currentPage(): string | null {
	return document.querySelector('[aria-current="page"]')?.textContent ?? null;
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Pagination current page', () => {
	it('starts on page 1', () => {
		render(<Pagination total={100} />);

		expect(currentPage()).toBe('1');
	});

	it('starts on defaultCurrent and keeps its own page', async () => {
		const onPageChange = vi.fn();
		render(<Pagination total={200} defaultCurrent={3} onPageChange={onPageChange} />);

		expect(currentPage()).toBe('3');

		await userEvent.click(screen.getByRole('button', { name: 'Page 5' }));

		expect(onPageChange).toHaveBeenCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(5);
		expect(currentPage()).toBe('5');
	});

	it('moves with Previous and Next when it keeps its own page', async () => {
		render(<Pagination total={200} defaultCurrent={3} />);

		await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
		expect(currentPage()).toBe('4');

		await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
		await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
		expect(currentPage()).toBe('2');
	});

	it('follows current and reports the press without moving, when controlled', async () => {
		const onPageChange = vi.fn();
		const { rerender } = render(<Pagination total={200} current={3} onPageChange={onPageChange} />);

		await userEvent.click(screen.getByRole('button', { name: 'Page 5' }));

		expect(onPageChange).toHaveBeenCalledWith(5);
		expect(currentPage()).toBe('3');

		rerender(<Pagination total={200} current={5} onPageChange={onPageChange} />);

		expect(currentPage()).toBe('5');
	});

	it('does nothing when the current page is pressed', async () => {
		const onPageChange = vi.fn();
		render(<Pagination total={200} defaultCurrent={3} onPageChange={onPageChange} />);

		await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));

		expect(onPageChange).not.toHaveBeenCalled();
		expect(currentPage()).toBe('3');
	});

	it('does not call onPageChange when nothing was pressed', () => {
		const onPageChange = vi.fn();
		const { rerender } = render(<Pagination total={200} current={3} onPageChange={onPageChange} />);

		rerender(<Pagination total={200} current={4} onPageChange={onPageChange} />);

		expect(onPageChange).not.toHaveBeenCalled();
	});

	it('disables Previous on the first page and Next on the last, and never hides them', () => {
		const { rerender } = render(<Pagination total={200} current={1} />);

		expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Previous page' })).toBeVisible();
		expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();

		rerender(<Pagination total={200} current={20} />);

		expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Next page' })).toBeVisible();
		expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
	});
});

describe('Pagination page size', () => {
	it('defaults to 10 items per page', () => {
		render(<Pagination total={95} testId="p" />);

		expect(slotsOf('p').at(-1)).toBe('10');
	});

	it('starts on defaultPageSize', () => {
		render(<Pagination total={100} defaultPageSize={25} testId="p" />);

		expect(slotsOf('p')).toEqual(['1', '2', '3', '4']);
	});

	it('follows pageSize when controlled', () => {
		const { rerender } = render(<Pagination total={100} pageSize={50} testId="p" />);

		expect(slotsOf('p')).toEqual(['1', '2']);

		rerender(<Pagination total={100} pageSize={20} testId="p" />);

		expect(slotsOf('p')).toEqual(['1', '2', '3', '4', '5']);
	});
});

describe('Pagination single page', () => {
	const EMPTY = '0 — 0 of 0';

	it.each([
		['the items fit one page', 10, '1 — 10 of 10'],
		['there are fewer items than a page', 3, '1 — 3 of 3'],
		['the total is a fraction that floors to one page', 10.9, '1 — 10 of 10'],
		['there are no items', 0, EMPTY],
		['the total is negative', -20, EMPTY],
		['the total is NaN', Number.NaN, EMPTY],
		['the total is Infinity', Number.POSITIVE_INFINITY, EMPTY],
	])('still renders page 1 with both arrows disabled when %s', (_name, total, label) => {
		render(<Pagination total={total} testId="p" />);

		expect(screen.getByRole('navigation')).toBeInTheDocument();
		expect(positionOf('p-total')).toBe(label);
		expect(slotsOf('p')).toEqual(['1']);
		expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
	});

	it('enables Next from the first item that needs a second page', () => {
		render(<Pagination total={11} testId="p" />);

		expect(slotsOf('p')).toEqual(['1', '2']);
		expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
	});

	it.each([
		['a single page', 30, '1 — 30 of 30'],
		['a total of 0', 0, EMPTY],
	])('keeps the page size selector for %s', (_name, total, label) => {
		render(<Pagination total={total} pageSize={50} pageSizeOptions testId="p" />);

		expect(positionOf('p-total')).toBe(label);
		expect(slotsOf('p')).toEqual(['1']);
		expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
		expect(screen.getByRole('combobox', { name: 'Rows per page' })).toBeInTheDocument();
	});
});

describe('Pagination normalization', () => {
	it.each([0, -5, 2.5, Number.NaN, Number.POSITIVE_INFINITY])(
		'falls back to 10 per page for a page size of %s, and warns',
		(pageSize) => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
			render(<Pagination total={95} pageSize={pageSize} testId="p" />);

			expect(slotsOf('p').at(-1)).toBe('10');
			expect(warn).toHaveBeenCalledTimes(1);
			expect(warn.mock.calls[0]?.[0]).toContain('pageSize');
		},
	);

	it('warns for an invalid defaultPageSize too', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(<Pagination total={95} defaultPageSize={-1} testId="p" />);

		expect(slotsOf('p').at(-1)).toBe('10');
		expect(warn).toHaveBeenCalledTimes(1);
	});

	it('does not warn for a valid page size, or none', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(
			<>
				<Pagination total={95} />
				<Pagination total={95} pageSize={25} />
				<Pagination total={95} defaultPageSize={25} />
			</>,
		);

		expect(warn).not.toHaveBeenCalled();
	});

	it('warns once per invalid value, not on every render', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { rerender } = render(<Pagination total={95} pageSize={0} />);

		rerender(<Pagination total={96} pageSize={0} />);
		rerender(<Pagination total={97} pageSize={0} />);

		expect(warn).toHaveBeenCalledTimes(1);
	});

	it('renders page 1 for a current that is not a number', () => {
		render(<Pagination total={95} current={Number.NaN} />);

		expect(currentPage()).toBe('1');
	});

	it('truncates a fractional current', () => {
		const onPageChange = vi.fn();
		render(<Pagination total={95} current={2.7} onPageChange={onPageChange} />);

		expect(currentPage()).toBe('2');
		expect(onPageChange).toHaveBeenCalledWith(2);
	});
});

describe('Pagination out-of-range page', () => {
	it('renders the last page and calls onPageChange once with it, when controlled', () => {
		const onPageChange = vi.fn();
		render(<Pagination total={50} current={99} onPageChange={onPageChange} />);

		expect(currentPage()).toBe('5');
		expect(onPageChange).toHaveBeenCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(5);
	});

	it.each([0, -3])('renders page 1 for a current of %s', (current) => {
		const onPageChange = vi.fn();
		render(<Pagination total={50} current={current} onPageChange={onPageChange} />);

		expect(currentPage()).toBe('1');
		expect(onPageChange).toHaveBeenCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(1);
	});

	it('does not call onPageChange again while the consumer keeps the old page', () => {
		const onPageChange = vi.fn();
		const { rerender } = render(<Pagination total={50} current={99} onPageChange={onPageChange} />);

		rerender(<Pagination total={50} current={99} onPageChange={vi.fn()} />);
		rerender(<Pagination total={50} current={99} onPageChange={onPageChange} />);

		expect(onPageChange).toHaveBeenCalledTimes(1);
	});

	it('does not call onPageChange for a page in range', () => {
		const onPageChange = vi.fn();
		render(<Pagination total={50} current={5} onPageChange={onPageChange} />);

		expect(onPageChange).not.toHaveBeenCalled();
	});

	it('calls onPageChange once when the total shrinks under the current page', () => {
		const onPageChange = vi.fn();
		const { rerender } = render(
			<Pagination total={100} current={10} onPageChange={onPageChange} />,
		);

		expect(onPageChange).not.toHaveBeenCalled();

		rerender(<Pagination total={30} current={10} onPageChange={onPageChange} />);

		expect(currentPage()).toBe('3');
		expect(onPageChange).toHaveBeenCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(3);
	});

	it('is quiet once the consumer follows the corrected page', () => {
		const onPageChange = vi.fn();
		const { rerender } = render(
			<Pagination total={100} current={10} onPageChange={onPageChange} />,
		);

		rerender(<Pagination total={30} current={10} onPageChange={onPageChange} />);
		rerender(<Pagination total={30} current={3} onPageChange={onPageChange} />);

		expect(onPageChange).toHaveBeenCalledTimes(1);
	});

	it('moves its own page into range and calls onPageChange once, when uncontrolled', () => {
		const onPageChange = vi.fn();
		const { rerender } = render(
			<Pagination total={100} defaultCurrent={10} onPageChange={onPageChange} />,
		);

		rerender(<Pagination total={30} defaultCurrent={10} onPageChange={onPageChange} />);

		expect(currentPage()).toBe('3');
		expect(onPageChange).toHaveBeenCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(3);

		rerender(<Pagination total={100} defaultCurrent={10} onPageChange={onPageChange} />);

		expect(currentPage()).toBe('3');
		expect(onPageChange).toHaveBeenCalledTimes(1);
	});

	it('corrects an out-of-range defaultCurrent', () => {
		const onPageChange = vi.fn();
		render(<Pagination total={50} defaultCurrent={99} onPageChange={onPageChange} />);

		expect(currentPage()).toBe('5');
		expect(onPageChange).toHaveBeenCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(5);
	});

	it('corrects a page past the only page, and renders page 1', () => {
		const onPageChange = vi.fn();
		render(<Pagination total={5} current={4} onPageChange={onPageChange} testId="p" />);

		expect(slotsOf('p')).toEqual(['1']);
		expect(currentPage()).toBe('1');
		expect(onPageChange).toHaveBeenCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(1);
	});

	it('shows page 1 and keeps the page while the total is 0, then renders it once the total arrives', () => {
		const onPageChange = vi.fn();
		const { rerender } = render(
			<Pagination total={0} current={7} onPageChange={onPageChange} testId="p" />,
		);

		expect(slotsOf('p')).toEqual(['1']);
		expect(currentPage()).toBe('1');
		expect(positionOf('p-total')).toBe('0 — 0 of 0');
		expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
		expect(onPageChange).not.toHaveBeenCalled();

		rerender(<Pagination total={200} current={7} onPageChange={onPageChange} testId="p" />);

		expect(currentPage()).toBe('7');
		expect(onPageChange).not.toHaveBeenCalled();
	});

	it('keeps its own page while the total is 0, when uncontrolled', () => {
		const onPageChange = vi.fn();
		const { rerender } = render(
			<Pagination total={0} defaultCurrent={7} onPageChange={onPageChange} />,
		);

		expect(currentPage()).toBe('1');

		rerender(<Pagination total={200} defaultCurrent={7} onPageChange={onPageChange} />);

		expect(currentPage()).toBe('7');
		expect(onPageChange).not.toHaveBeenCalled();
	});

	it('still moves a page below 1 while the total is 0', () => {
		const onPageChange = vi.fn();
		render(<Pagination total={0} current={-2} onPageChange={onPageChange} />);

		expect(onPageChange).toHaveBeenCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(1);
	});

	it('corrects the page when the page size grows', () => {
		const onPageChange = vi.fn();
		const { rerender } = render(
			<Pagination total={100} current={10} pageSize={10} onPageChange={onPageChange} />,
		);

		rerender(<Pagination total={100} current={10} pageSize={50} onPageChange={onPageChange} />);

		expect(currentPage()).toBe('2');
		expect(onPageChange).toHaveBeenCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(2);
	});
});
