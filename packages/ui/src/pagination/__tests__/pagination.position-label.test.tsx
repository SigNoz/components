import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Pagination } from '../pagination.js';
import { positionOf } from './pagination.test-utils.js';

describe('Pagination position label', () => {
	it('writes the range with an em dash and the total', () => {
		render(<Pagination total={100} pageSize={20} testId="p" />);

		expect(positionOf('p-total')).toBe('1 \u2014 20 of 100');
	});

	it('uses U+2014 with a space on each side', () => {
		render(<Pagination total={100} pageSize={20} testId="p" />);

		expect(positionOf('p-total')).toMatch(/^1 \u2014 20 of 100$/);
		expect(positionOf('p-total')).not.toContain('–');
		expect(positionOf('p-total')).not.toContain('-');
	});

	it('follows the page and stops the last range at the total', async () => {
		render(<Pagination total={95} testId="p" />);

		await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
		expect(positionOf('p-total')).toBe('11 \u2014 20 of 95');

		await userEvent.click(screen.getByRole('button', { name: 'Page 10' }));
		expect(positionOf('p-total')).toBe('91 \u2014 95 of 95');
	});

	it('groups numbers above 999 with a comma', () => {
		const { rerender } = render(<Pagination total={12345} current={1} testId="p" />);

		expect(positionOf('p-total')).toBe('1 \u2014 10 of 12,345');

		rerender(<Pagination total={12345} current={1235} testId="p" />);

		expect(positionOf('p-total')).toBe('12,341 \u2014 12,345 of 12,345');
	});

	it('does not group 999', () => {
		render(<Pagination total={999} pageSize={999} pageSizeOptions testId="p" />);

		expect(positionOf('p-total')).toBe('1 \u2014 999 of 999');
	});

	it('writes the showTotalLabel after the total', () => {
		render(<Pagination total={100} pageSize={20} showTotalLabel="pods" testId="p" />);

		expect(positionOf('p-total')).toBe('1 \u2014 20 of 100 pods');
	});

	it('is a polite live region that the screen reader reads whole', () => {
		render(<Pagination total={100} testId="p" />);

		expect(screen.getByTestId('p-total')).toHaveAttribute('aria-live', 'polite');
		expect(screen.getByTestId('p-total')).toHaveAttribute('aria-atomic', 'true');
	});

	it('keeps the invisible copy that holds its width out of the accessibility tree', () => {
		render(<Pagination total={100} pageSize={20} testId="p" />);

		const label = screen.getByTestId('p-total');
		const copy = label.querySelector('[aria-hidden="true"]');

		expect(copy).toHaveTextContent('81 \u2014 100 of 100');
		expect(copy).not.toBeVisible();
	});

	it('shows no position label with showTotal false', () => {
		render(<Pagination total={100} showTotal={false} testId="p" />);

		expect(screen.queryByTestId('p-total')).toBeNull();
		expect(document.querySelector('[data-slot="pagination-total"]')).toBeNull();
	});

	it('shows it by default', () => {
		render(<Pagination total={100} testId="p" />);

		expect(screen.getByTestId('p-total')).toHaveAttribute('data-slot', 'pagination-total');
	});

	it('shows the page number in a Cursor bar', async () => {
		render(<Pagination.Cursor hasNextPage defaultCurrent={3} testId="p" />);

		expect(positionOf('p-total')).toBe('Page 3');

		await userEvent.click(screen.getByRole('button', { name: 'Next' }));

		expect(positionOf('p-total')).toBe('Page 4');
	});

	it('still shows the range while disabled', () => {
		render(<Pagination total={100} pageSize={20} disabled disabledTooltip="Loading" testId="p" />);

		expect(positionOf('p-total')).toBe('1 \u2014 20 of 100');
	});
});
