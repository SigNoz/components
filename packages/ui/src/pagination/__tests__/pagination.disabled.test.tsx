import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '../pagination.js';
import { positionOf, slotsOf } from './pagination.test-utils.js';

const REASON = 'Loading the next page';

function settle(ms = 450): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

describe('Pagination disabled', () => {
	it('blocks every page change and the page size selector', async () => {
		const onPageChange = vi.fn();
		const onPageSizeChange = vi.fn();
		render(
			<Pagination
				total={200}
				current={10}
				pageSizeOptions
				disabled
				disabledTooltip={REASON}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
				testId="p"
			/>,
		);
		const before = slotsOf('p');

		for (const name of ['Page 1', 'Page 9', 'Page 11', 'Page 20', 'Page 10']) {
			await userEvent.click(screen.getByRole('button', { name }));
		}

		await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
		await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
		await userEvent.click(screen.getByRole('combobox', { name: 'Rows per page' }));

		expect(screen.queryByRole('listbox')).toBeNull();
		expect(onPageChange).not.toHaveBeenCalled();
		expect(onPageSizeChange).not.toHaveBeenCalled();
		expect(slotsOf('p')).toEqual(before);
		expect(document.querySelector('[aria-current="page"]')).toHaveTextContent('10');
	});

	it('blocks the keyboard too', async () => {
		const onPageChange = vi.fn();
		render(
			<Pagination
				total={200}
				current={10}
				disabled
				disabledTooltip={REASON}
				onPageChange={onPageChange}
			/>,
		);

		for (const name of ['Page 9', 'Previous page', 'Next page']) {
			screen.getByRole('button', { name }).focus();
			await userEvent.keyboard('{Enter}');
			await userEvent.keyboard(' ');
		}

		expect(onPageChange).not.toHaveBeenCalled();
	});

	it('does not move uncontrolled pages either', async () => {
		render(<Pagination total={200} defaultCurrent={10} disabled disabledTooltip={REASON} />);

		await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
		await userEvent.click(screen.getByRole('button', { name: 'Page 11' }));

		expect(document.querySelector('[aria-current="page"]')).toHaveTextContent('10');
	});

	it('blocks the compact buttons', async () => {
		const onPageChange = vi.fn();
		render(
			<Pagination
				total={200}
				variant="compact"
				current={10}
				disabled
				disabledTooltip={REASON}
				onPageChange={onPageChange}
			/>,
		);

		await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
		await userEvent.click(screen.getByRole('button', { name: 'Next' }));

		expect(onPageChange).not.toHaveBeenCalled();
	});

	it('keeps every control in its slot', () => {
		const { rerender } = render(<Pagination total={200} current={10} pageSizeOptions testId="p" />);
		const rects = () =>
			Array.from(
				screen.getByTestId('p').querySelectorAll('button, [data-slot="pagination-separator"]'),
			).map((element) => element.getBoundingClientRect().left);
		const before = rects();

		rerender(<Pagination total={200} current={10} pageSizeOptions disabled testId="p" />);

		expect(rects()).toEqual(before);
	});

	it('marks the root and keeps every control focusable', async () => {
		render(
			<Pagination
				total={200}
				current={10}
				pageSizeOptions
				disabled
				disabledTooltip={REASON}
				testId="p"
			/>,
		);

		expect(screen.getByTestId('p')).toHaveAttribute('data-disabled', 'true');

		const controls = [
			'Previous page',
			'Page 1',
			'Page 9',
			'Page 10',
			'Page 11',
			'Page 20',
			'Next page',
		];

		for (const name of controls) {
			const button = screen.getByRole('button', { name });

			expect(button).toHaveAttribute('aria-disabled', 'true');
			expect(button).toBeEnabled();
			await userEvent.tab();
			expect(button).toHaveFocus();
		}

		await userEvent.tab();

		expect(screen.getByRole('combobox', { name: 'Rows per page' })).toHaveFocus();
		expect(screen.getByRole('combobox', { name: 'Rows per page' })).toHaveAttribute(
			'aria-disabled',
			'true',
		);
	});

	it('still shows the current range', () => {
		render(<Pagination total={200} current={10} pageSize={10} disabled testId="p" />);

		expect(positionOf('p-total')).toBe('91 \u2014 100 of 200');
	});

	it('does not mark the root while enabled', () => {
		render(<Pagination total={200} testId="p" />);

		expect(screen.getByTestId('p')).not.toHaveAttribute('data-disabled');
		expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
			'aria-disabled',
			'false',
		);
	});
});

describe('Pagination disabledTooltip', () => {
	it.each(['Page 1', 'Page 9', 'Page 10', 'Page 11', 'Page 20', 'Previous page', 'Next page'])(
		'shows the reason on hover over %s',
		async (name) => {
			const user = userEvent.setup();
			render(<Pagination total={200} current={10} disabled disabledTooltip={REASON} />);

			await user.hover(screen.getByRole('button', { name }));

			expect(await screen.findByRole('tooltip')).toHaveTextContent(REASON);
		},
	);

	it('shows the reason on hover over the page size selector', async () => {
		const user = userEvent.setup();
		render(
			<Pagination total={200} current={10} pageSizeOptions disabled disabledTooltip={REASON} />,
		);

		await user.hover(screen.getByRole('combobox', { name: 'Rows per page' }));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(REASON);
	});

	it.each(['Previous', 'Next'])('shows the reason on hover over compact %s', async (name) => {
		const user = userEvent.setup();
		render(
			<Pagination total={200} variant="compact" current={10} disabled disabledTooltip={REASON} />,
		);

		await user.hover(screen.getByRole('button', { name }));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(REASON);
	});

	it('shows the reason on keyboard focus', async () => {
		const user = userEvent.setup();
		render(<Pagination total={200} current={10} disabled disabledTooltip={REASON} />);

		await user.tab();

		expect(screen.getByRole('button', { name: 'Previous page' })).toHaveFocus();
		expect(await screen.findByRole('tooltip')).toHaveTextContent(REASON);
	});

	it('ties the control to the popup with aria-describedby', async () => {
		const user = userEvent.setup();
		render(<Pagination total={200} current={10} disabled disabledTooltip={REASON} />);
		const button = screen.getByRole('button', { name: 'Page 11' });

		await user.hover(button);

		const tooltip = await screen.findByRole('tooltip');

		expect(button).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('hides the reason when the pointer leaves', async () => {
		const user = userEvent.setup();
		render(<Pagination total={200} current={10} disabled disabledTooltip={REASON} />);
		const button = screen.getByRole('button', { name: 'Page 11' });

		await user.hover(button);
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		await user.unhover(button);

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('renders a rich reason', async () => {
		const user = userEvent.setup();
		render(
			<Pagination
				total={200}
				current={10}
				disabled
				disabledTooltip={<span data-testid="reason">Ask an admin</span>}
			/>,
		);

		await user.hover(screen.getByRole('button', { name: 'Page 11' }));

		expect(await screen.findByTestId('reason')).toBeInTheDocument();
	});

	it('says nothing while the pagination is enabled', async () => {
		const user = userEvent.setup();
		render(<Pagination total={200} current={10} pageSizeOptions disabledTooltip={REASON} />);

		await user.hover(screen.getByRole('button', { name: 'Page 11' }));
		await user.hover(screen.getByRole('button', { name: 'Next page' }));
		await user.hover(screen.getByRole('combobox', { name: 'Rows per page' }));
		await settle();

		expect(screen.queryByRole('tooltip')).toBeNull();
	});

	it('stops saying it the moment the pagination is enabled again', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<Pagination total={200} current={10} disabled disabledTooltip={REASON} />,
		);

		await user.hover(screen.getByRole('button', { name: 'Page 11' }));
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		rerender(<Pagination total={200} current={10} disabledTooltip={REASON} />);

		expect(screen.queryByRole('tooltip')).toBeNull();
	});

	it.each([null, undefined, '', false])('shows no tooltip for a reason of %s', async (reason) => {
		const user = userEvent.setup();
		render(<Pagination total={200} current={10} disabled disabledTooltip={reason} />);

		await user.hover(screen.getByRole('button', { name: 'Page 11' }));
		await settle();

		expect(screen.queryByRole('tooltip')).toBeNull();
	});

	it('gives the arrows at the ends of the range no tooltip while enabled', async () => {
		const user = userEvent.setup();
		render(<Pagination total={200} current={1} disabledTooltip={REASON} />);

		const previous = screen.getByRole('button', { name: 'Previous page' });

		expect(previous).toBeDisabled();

		await user.hover(previous);
		await settle();

		expect(screen.queryByRole('tooltip')).toBeNull();
	});

	it('shows the reason on an arrow at the end of the range while disabled', async () => {
		const user = userEvent.setup();
		render(<Pagination total={200} current={1} disabled disabledTooltip={REASON} />);

		const previous = screen.getByRole('button', { name: 'Previous page' });

		expect(previous).toHaveAttribute('aria-disabled', 'true');

		await user.hover(previous);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(REASON);
	});

	it('does not tell the end-of-range arrows apart from other disabled controls for assistive tech', () => {
		render(<Pagination total={200} current={1} />);

		expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Previous page' })).not.toHaveAttribute(
			'aria-describedby',
		);
	});

	it('shows no tooltip on the position label', async () => {
		const user = userEvent.setup();
		render(<Pagination total={200} current={10} disabled disabledTooltip={REASON} testId="p" />);

		await user.hover(screen.getByTestId('p-total'));
		await settle();

		expect(screen.queryByRole('tooltip')).toBeNull();
	});
});
