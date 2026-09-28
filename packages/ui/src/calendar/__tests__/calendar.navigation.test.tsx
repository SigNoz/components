import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from '../calendar.js';
import { JUNE_11_2025, dayButton, isoDay, june, navButtons } from './calendar.test-utils.js';

describe('Calendar navigation', () => {
	it('renders both arrows as nav-variant calendar buttons', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		const { previous, next } = navButtons();

		expect(previous).toHaveAttribute('data-slot', 'calendar-button');
		expect(previous).toHaveAttribute('data-variant', 'nav');
		expect(next).toHaveAttribute('data-variant', 'nav');
	});

	it('names both arrows for a screen reader', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
	});

	it('moves one month per click, and says so', async () => {
		const user = userEvent.setup();
		const onMonthChange = vi.fn();

		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} onMonthChange={onMonthChange} />);

		await user.click(navButtons().next);
		expect(screen.getByText('July 2025')).toBeInTheDocument();

		await user.click(navButtons().previous);
		await user.click(navButtons().previous);
		expect(screen.getByText('May 2025')).toBeInTheDocument();

		expect(onMonthChange).toHaveBeenCalledTimes(3);
		expect((onMonthChange.mock.calls[0][0] as Date).getMonth()).toBe(6);
	});

	it('marks an arrow aria-disabled at the edge of the allowed range, and stays there', async () => {
		const user = userEvent.setup();

		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				startMonth={new Date(2025, 5, 1)}
				endMonth={new Date(2025, 6, 31)}
			/>,
		);

		const { previous } = navButtons();

		// aria-disabled rather than disabled, so the arrow keeps its place in the tab order.
		expect(previous).toHaveAttribute('aria-disabled', 'true');
		expect(previous).not.toBeDisabled();

		await user.click(previous);

		expect(screen.getByText('June 2025')).toBeInTheDocument();
	});

	it('drops the arrows entirely when navigation is hidden', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} hideNavigation />);

		expect(document.querySelector('[data-variant="nav"]')).toBeNull();
	});

	it('moves focus across the grid with the arrow keys', async () => {
		const user = userEvent.setup();

		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} onSelect={vi.fn()} />);

		dayButton(JUNE_11_2025).focus();

		await user.keyboard('{ArrowRight}');
		expect(document.activeElement).toHaveAttribute('data-day', isoDay(june(12)));

		await user.keyboard('{ArrowDown}');
		expect(document.activeElement).toHaveAttribute('data-day', isoDay(june(19)));

		await user.keyboard('{ArrowLeft}{ArrowUp}');
		expect(document.activeElement).toHaveAttribute('data-day', isoDay(june(11)));
	});

	it('walks into the next month when the arrow keys run off the grid', async () => {
		const user = userEvent.setup();

		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} onSelect={vi.fn()} />);

		dayButton(june(30)).focus();

		await user.keyboard('{ArrowRight}');

		expect(screen.getByText('July 2025')).toBeInTheDocument();
		expect(document.activeElement).toHaveAttribute('data-day', '2025-07-01');
	});

	it('picks the focused day with the keyboard', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} onSelect={onSelect} />);

		dayButton(JUNE_11_2025).focus();

		await user.keyboard('{ArrowRight}{Enter}');

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect((onSelect.mock.calls[0][0] as Date).getDate()).toBe(12);
	});
});
