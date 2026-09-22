import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from '../calendar.js';
import { CalendarDayButton } from '../subcomponents/calendar-day-button.js';
import { JUNE_11_2025, dayButton, june, navButtons } from './calendar.test-utils.js';

describe('Calendar testId', () => {
	it('names the root, the arrows and the dropdowns from the one prop', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				captionLayout="dropdown"
				testId="report-start"
			/>,
		);

		expect(screen.getByTestId('report-start')).toHaveAttribute('data-slot', 'calendar');
		expect(screen.getByTestId('report-start-nav-previous')).toBe(navButtons().previous);
		expect(screen.getByTestId('report-start-nav-next')).toBe(navButtons().next);
		expect(screen.getByTestId('report-start-dropdown-month')).toBe(
			screen.getByRole('combobox', { name: /month/i }),
		);
		expect(screen.getByTestId('report-start-dropdown-year')).toBe(
			screen.getByRole('combobox', { name: /year/i }),
		);
	});

	it('names every date cell after the day it stands for', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} testId="report-start" />);

		// Day first, as the calendar reads it out: 11 June 2025.
		expect(screen.getByTestId('report-start-button-11-06-2025')).toBe(dayButton(JUNE_11_2025));
		// Padded, so every day of the month is the same length.
		expect(screen.getByTestId('report-start-button-01-06-2025')).toBe(dayButton(june(1)));
	});

	it('names a week number after the week', () => {
		render(
			<Calendar mode="single" defaultMonth={JUNE_11_2025} showWeekNumber testId="report-start" />,
		);

		const weekNumbers = screen.getAllByTestId(/^report-start-week-number-/);

		expect(weekNumbers).toHaveLength(5);
		expect(weekNumbers[0]).toHaveTextContent('23');
		expect(weekNumbers[0]).toHaveAttribute('data-testid', 'report-start-week-number-23');
	});

	it('lets a day carry a testId of its own instead', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				testId="report-start"
				components={{
					DayButton: (props) => (
						<CalendarDayButton
							{...props}
							testId={props.day.date.getDate() === 11 ? 'the-eleventh' : undefined}
						/>
					),
				}}
			/>,
		);

		expect(screen.getByTestId('the-eleventh')).toBe(dayButton(JUNE_11_2025));
		expect(screen.queryByTestId('report-start-button-11-06-2025')).toBeNull();
		expect(screen.getByTestId('report-start-button-12-06-2025')).toBe(dayButton(june(12)));
	});

	it('names the parts of each displayed month apart once more than one is shown', () => {
		render(
			<Calendar
				mode="range"
				defaultMonth={JUNE_11_2025}
				numberOfMonths={2}
				captionLayout="dropdown"
				showWeekNumber
				testId="report-start"
			/>,
		);

		// A caption, a week number and a day button are rendered per displayed month, so the stem
		// carries the month or the three of them collide.
		expect(screen.getByTestId('report-start-month-1-dropdown-month')).toBeInTheDocument();
		expect(screen.getByTestId('report-start-month-2-dropdown-year')).toBeInTheDocument();

		// June 29 to July 5 is one week, and both grids show it.
		expect(screen.getByTestId('report-start-month-1-week-number-27')).toHaveTextContent('27');
		expect(screen.getByTestId('report-start-month-2-week-number-27')).toHaveTextContent('27');

		// July 1 is an outside day of June and a real day of July.
		expect(screen.getByTestId('report-start-month-1-button-01-07-2025')).toBeInTheDocument();
		expect(screen.getByTestId('report-start-month-2-button-01-07-2025')).toBeInTheDocument();

		expect(screen.queryByTestId('report-start-dropdown-month')).toBeNull();
	});

	it('leaves every part unnamed when the calendar has no testId', () => {
		const { container } = render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				captionLayout="dropdown"
				showWeekNumber
				onSelect={vi.fn()}
			/>,
		);

		// The icons carry one of their own, and they are mocked here, so only the calendar's own
		// parts are counted.
		const named = container.querySelectorAll(
			'[data-slot][data-testid], [data-testid] > select, [role="combobox"][data-testid]',
		);

		expect(named).toHaveLength(0);
		expect(container.querySelector('.rdp-root')).not.toHaveAttribute('data-testid');
	});
});
