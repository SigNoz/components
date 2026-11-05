import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '../pagination.js';
import type { PaginationProps } from '../types.js';
import { slotsOf } from './pagination.test-utils.js';

type HarnessProps = Partial<PaginationProps> & { initial?: number };

function Harness({ initial = 1, ...props }: HarnessProps) {
	const [page, setPage] = useState(initial);

	return <Pagination total={200} current={page} onPageChange={setPage} testId="p" {...props} />;
}

function CursorHarness({ initial = 1, lastPage = 3 }: { initial?: number; lastPage?: number }) {
	const [page, setPage] = useState(initial);

	return (
		<Pagination.Cursor
			current={page}
			onPageChange={setPage}
			hasNextPage={page < lastPage}
			testId="p"
		/>
	);
}

function pressed(name: string): HTMLElement {
	return screen.getByRole('button', { name });
}

describe('Pagination focus after a page press', () => {
	it('puts focus on the button of the page that was pressed', async () => {
		render(<Harness initial={1} />);

		await userEvent.click(pressed('Page 5'));

		expect(pressed('Page 5')).toHaveFocus();
		expect(pressed('Page 5')).toHaveAttribute('aria-current', 'page');
	});

	it('follows the page into its new slot', async () => {
		render(<Harness initial={10} />);

		expect(slotsOf('p')).toEqual(['1', '-', '9', '10', '11', '-', '20']);

		await userEvent.click(pressed('Page 11'));

		expect(slotsOf('p')).toEqual(['1', '-', '10', '11', '12', '-', '20']);
		expect(pressed('Page 11')).toHaveFocus();
	});

	it('follows a page that moves to the side of the list', async () => {
		render(<Harness initial={10} />);

		await userEvent.click(pressed('Page 9'));

		expect(slotsOf('p')).toEqual(['1', '-', '8', '9', '10', '-', '20']);
		expect(pressed('Page 9')).toHaveFocus();
	});

	it('follows the first and the last page', async () => {
		render(<Harness initial={10} />);

		await userEvent.click(pressed('Page 20'));

		expect(slotsOf('p')).toEqual(['1', '-', '16', '17', '18', '19', '20']);
		expect(pressed('Page 20')).toHaveFocus();

		await userEvent.click(pressed('Page 1'));

		expect(slotsOf('p')).toEqual(['1', '2', '3', '4', '5', '-', '20']);
		expect(pressed('Page 1')).toHaveFocus();
	});

	it('follows a press made with the keyboard, so the same key can go on', async () => {
		render(<Harness initial={10} />);

		pressed('Page 11').focus();
		await userEvent.keyboard('{Enter}');

		expect(pressed('Page 11')).toHaveFocus();

		await userEvent.keyboard('{Enter}');

		expect(pressed('Page 11')).toHaveFocus();
		expect(document.querySelector('[aria-current="page"]')).toHaveTextContent('11');
	});

	it('follows a press made with Space', async () => {
		render(<Harness initial={10} />);

		pressed('Page 9').focus();
		await userEvent.keyboard(' ');

		expect(document.querySelector('[aria-current="page"]')).toHaveTextContent('9');
		expect(pressed('Page 9')).toHaveFocus();
	});

	it('keeps focus on the current page when it is pressed, and does nothing', async () => {
		const onPageChange = vi.fn();
		render(<Harness initial={10} onPageChange={onPageChange} />);

		pressed('Page 10').focus();
		await userEvent.keyboard('{Enter}');

		expect(onPageChange).not.toHaveBeenCalled();
		expect(pressed('Page 10')).toHaveFocus();
	});

	it('follows the page when the pagination keeps its own page', async () => {
		render(<Pagination total={200} defaultCurrent={10} testId="p" />);

		await userEvent.click(pressed('Page 11'));

		expect(pressed('Page 11')).toHaveFocus();
	});
});

describe('Pagination focus after an arrow press', () => {
	it('keeps focus on Next while it stays enabled', async () => {
		render(<Harness initial={10} />);

		pressed('Next page').focus();

		for (const page of [11, 12, 13]) {
			await userEvent.keyboard('{Enter}');

			expect(document.querySelector('[aria-current="page"]')).toHaveTextContent(String(page));
			expect(pressed('Next page')).toHaveFocus();
		}
	});

	it('keeps focus on Previous while it stays enabled', async () => {
		render(<Harness initial={10} />);

		await userEvent.click(pressed('Previous page'));

		expect(document.querySelector('[aria-current="page"]')).toHaveTextContent('9');
		expect(pressed('Previous page')).toHaveFocus();
	});

	it('moves focus to the current page when Next disables on the last page', async () => {
		render(<Harness initial={19} />);

		pressed('Next page').focus();
		await userEvent.keyboard('{Enter}');

		expect(pressed('Next page')).toBeDisabled();
		expect(pressed('Page 20')).toHaveFocus();
		expect(pressed('Page 20')).toHaveAttribute('aria-current', 'page');
	});

	it('moves focus to the current page when Previous disables on the first page', async () => {
		render(<Harness initial={2} />);

		pressed('Previous page').focus();
		await userEvent.keyboard('{Enter}');

		expect(pressed('Previous page')).toBeDisabled();
		expect(pressed('Page 1')).toHaveFocus();
	});

	it('lets Previous take over from the first page, with the same key', async () => {
		render(<Harness initial={3} />);

		pressed('Previous page').focus();
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard('{Enter}');

		expect(pressed('Page 1')).toHaveFocus();

		await userEvent.keyboard('{Enter}');

		expect(document.querySelector('[aria-current="page"]')).toHaveTextContent('1');
		expect(pressed('Page 1')).toHaveFocus();
	});
});

describe('Pagination focus while disabled', () => {
	it('keeps focus on Previous at the first page when the bar re-renders', () => {
		const { rerender } = render(
			<Pagination total={200} current={1} disabled disabledTooltip="Loading" />,
		);

		pressed('Previous page').focus();

		expect(pressed('Previous page')).toHaveFocus();

		rerender(<Pagination total={200} current={1} disabled disabledTooltip="Still loading" />);

		expect(pressed('Previous page')).toHaveFocus();
	});

	it('keeps focus on Next at the last page when the bar re-renders', () => {
		const { rerender } = render(
			<Pagination total={200} current={20} disabled disabledTooltip="Loading" />,
		);

		pressed('Next page').focus();
		rerender(<Pagination total={200} current={20} disabled disabledTooltip="Still loading" />);

		expect(pressed('Next page')).toHaveFocus();
	});
});

describe('Pagination focus in the compact controls', () => {
	it('keeps focus on Next while it shows', async () => {
		render(<Harness variant="compact" initial={1} total={100} />);

		pressed('Next').focus();
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard('{Enter}');

		expect(document.querySelector('[data-slot="pagination-total"] span')).toHaveTextContent(
			'21 \u2014 30 of 100',
		);
		expect(pressed('Next')).toHaveFocus();
	});

	it('moves focus to Previous when Next hides on the last page', async () => {
		render(<Harness variant="compact" initial={9} total={100} />);

		pressed('Next').focus();
		await userEvent.keyboard('{Enter}');

		expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
		expect(pressed('Previous')).toHaveFocus();
	});

	it('moves focus to Next when Previous hides on the first page', async () => {
		render(<Harness variant="compact" initial={2} total={100} />);

		pressed('Previous').focus();
		await userEvent.keyboard('{Enter}');

		expect(screen.queryByRole('button', { name: 'Previous' })).toBeNull();
		expect(pressed('Next')).toHaveFocus();
	});

	it('moves focus to the other button when an outside change hides the focused one', () => {
		const { rerender } = render(
			<Pagination total={100} variant="compact" current={9} testId="p" />,
		);

		pressed('Next').focus();

		rerender(<Pagination total={100} variant="compact" current={10} testId="p" />);

		expect(pressed('Previous')).toHaveFocus();
	});
});

describe('Pagination.Cursor focus', () => {
	it('keeps focus on Next while there is a next page', async () => {
		render(<CursorHarness initial={1} lastPage={5} />);

		pressed('Next').focus();
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard('{Enter}');

		expect(pressed('Next')).toHaveFocus();
	});

	it('moves focus to Previous when hasNextPage turns false', async () => {
		render(<CursorHarness initial={2} lastPage={3} />);

		pressed('Next').focus();
		await userEvent.keyboard('{Enter}');

		expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
		expect(pressed('Previous')).toHaveFocus();
	});

	it('moves focus to Previous when hasNextPage turns false after the page changed', async () => {
		function Slow() {
			const [page, setPage] = useState(2);
			const [hasNext, setHasNext] = useState(true);

			return (
				<Pagination.Cursor
					current={page}
					hasNextPage={hasNext}
					onPageChange={(next) => {
						setPage(next);
						setTimeout(() => setHasNext(false), 30);
					}}
					testId="p"
				/>
			);
		}

		render(<Slow />);

		pressed('Next').focus();
		await userEvent.keyboard('{Enter}');

		await waitFor(() => expect(screen.queryByRole('button', { name: 'Next' })).toBeNull());
		expect(pressed('Previous')).toHaveFocus();
	});

	it('moves focus to Next when Previous hides on page 1', async () => {
		render(<CursorHarness initial={2} lastPage={5} />);

		pressed('Previous').focus();
		await userEvent.keyboard('{Enter}');

		expect(screen.queryByRole('button', { name: 'Previous' })).toBeNull();
		expect(pressed('Next')).toHaveFocus();
	});
});

describe('Pagination focus while the page loads', () => {
	function Slow() {
		const [page, setPage] = useState(10);

		return (
			<>
				<input aria-label="Search" />
				<Pagination
					total={200}
					current={page}
					onPageChange={(next) => {
						setTimeout(() => setPage(next), 60);
					}}
					testId="p"
				/>
			</>
		);
	}

	it('follows the press once the page arrives', async () => {
		render(<Slow />);

		await userEvent.click(pressed('Page 11'));
		await waitFor(() =>
			expect(document.querySelector('[aria-current="page"]')).toHaveTextContent('11'),
		);

		expect(pressed('Page 11')).toHaveFocus();
	});

	it('leaves focus where the user put it in the meantime', async () => {
		render(<Slow />);

		await userEvent.click(pressed('Page 11'));
		screen.getByRole('textbox', { name: 'Search' }).focus();

		await waitFor(() =>
			expect(document.querySelector('[aria-current="page"]')).toHaveTextContent('11'),
		);

		expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
	});

	it('does not move focus when the consumer ignores the press', async () => {
		const onPageChange = vi.fn();
		const { rerender } = render(
			<Pagination total={200} current={10} onPageChange={onPageChange} />,
		);

		pressed('Next page').focus();
		await userEvent.keyboard('{Enter}');

		expect(onPageChange).toHaveBeenCalledWith(11);

		screen.getByRole('button', { name: 'Page 1' }).focus();

		await act(async () => {
			rerender(<Pagination total={200} current={20} onPageChange={onPageChange} />);
		});

		expect(pressed('Page 1')).toHaveFocus();
	});

	it('does not pull focus in for a later page change that the user did not press', async () => {
		const onPageChange = vi.fn();
		const { rerender } = render(<Pagination total={200} current={3} onPageChange={onPageChange} />);

		await userEvent.click(pressed('Page 5'));

		expect(onPageChange).toHaveBeenCalledWith(5);

		(document.activeElement as HTMLElement).blur();

		await act(async () => {
			rerender(<Pagination total={200} current={4} onPageChange={onPageChange} />);
		});

		expect(document.body).toHaveFocus();
	});
});

describe('Pagination tab order', () => {
	it('goes through the controls in visual order, the separators skipped', async () => {
		render(<Pagination total={200} current={10} pageSizeOptions testId="p" />);

		const order = [
			'Previous page',
			'Page 1',
			'Page 9',
			'Page 10',
			'Page 11',
			'Page 20',
			'Next page',
		];

		for (const name of order) {
			await userEvent.tab();
			expect(pressed(name), name).toHaveFocus();
		}

		await userEvent.tab();

		expect(screen.getByRole('combobox', { name: 'Rows per page' })).toHaveFocus();
	});

	it('puts the selector first with pageSizeOptions position start', async () => {
		render(<Pagination total={200} current={10} pageSizeOptions={{ position: 'start' }} />);

		await userEvent.tab();

		expect(screen.getByRole('combobox', { name: 'Rows per page' })).toHaveFocus();

		await userEvent.tab();

		expect(pressed('Previous page')).toHaveFocus();
	});

	it('does not use roving focus: every control is a tab stop', () => {
		render(<Pagination total={200} current={10} />);

		for (const button of screen.getAllByRole('button')) {
			expect(button).not.toHaveAttribute('tabindex', '-1');
		}
	});

	it('keeps the current page in the tab order', async () => {
		render(<Pagination total={200} current={10} />);

		pressed('Page 9').focus();
		await userEvent.tab();

		expect(pressed('Page 10')).toHaveFocus();
	});
});
