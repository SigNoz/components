import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from '../calendar.js';
// From the public entry point, because that is where a consumer marking days reaches it.
import { CalendarDayButton, type CalendarDayButtonProps } from '../index.js';
import { JUNE_11_2025, dayButton, june } from './calendar.test-utils.js';

/** Declared here so react-day-picker is handed the same component on every render. */
function MarkedDayButton(props: CalendarDayButtonProps): ReactElement {
	return <CalendarDayButton {...props} prefix="<" suffix=">" />;
}

describe('CalendarDayButton', () => {
	it('renders as a day-variant button that never submits a form', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		const day = dayButton(JUNE_11_2025);

		expect(day).toHaveAttribute('data-slot', 'calendar-button');
		expect(day).toHaveAttribute('data-variant', 'day');
		expect(day).toHaveAttribute('type', 'button');
	});

	it('writes the day it stands for in a format that does not follow the locale', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		// Padded, year first, and read off the local calendar: the same string wherever it runs.
		expect(dayButton(june(1))).toHaveAttribute('data-day', '2025-06-01');
		expect(dayButton(JUNE_11_2025)).toHaveAttribute('data-day', '2025-06-11');
	});

	it('wraps the day number in its own label slot', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		const label = dayButton(JUNE_11_2025).querySelector('[data-slot="calendar-day-button-label"]');

		expect(label).toHaveTextContent('11');
	});

	it('marks the day states the stylesheet paints from', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				today={JUNE_11_2025}
				disabled={[june(5)]}
			/>,
		);

		expect(dayButton(JUNE_11_2025)).toHaveAttribute('data-today', 'true');
		expect(dayButton(new Date(2025, 6, 1))).toHaveAttribute('data-outside', 'true');
		expect(dayButton(june(12))).not.toHaveAttribute('data-today');
		expect(dayButton(june(12))).not.toHaveAttribute('data-outside');
		expect(dayButton(june(5))).toBeDisabled();
	});

	it('marks a single selection, and nothing else', () => {
		render(
			<Calendar
				mode="single"
				selected={JUNE_11_2025}
				defaultMonth={JUNE_11_2025}
				onSelect={vi.fn()}
			/>,
		);

		const day = dayButton(JUNE_11_2025);

		expect(day).toHaveAttribute('data-selected-single', 'true');
		expect(day).not.toHaveAttribute('data-range-start');
		expect(day).not.toHaveAttribute('data-range-middle');
		expect(day).not.toHaveAttribute('data-range-end');
	});

	it('marks the three positions of a range apart', () => {
		render(
			<Calendar
				mode="range"
				selected={{ from: june(10), to: june(12) }}
				defaultMonth={JUNE_11_2025}
				onSelect={vi.fn()}
			/>,
		);

		expect(dayButton(june(10))).toHaveAttribute('data-range-start', 'true');
		expect(dayButton(june(11))).toHaveAttribute('data-range-middle', 'true');
		expect(dayButton(june(12))).toHaveAttribute('data-range-end', 'true');
		expect(dayButton(june(11))).not.toHaveAttribute('data-selected-single');
	});

	it('marks every day of a multiple selection', () => {
		render(
			<Calendar
				mode="multiple"
				selected={[june(3), june(11)]}
				defaultMonth={JUNE_11_2025}
				onSelect={vi.fn()}
			/>,
		);

		expect(dayButton(june(3))).toHaveAttribute('data-selected-single', 'true');
		expect(dayButton(june(11))).toHaveAttribute('data-selected-single', 'true');
		expect(dayButton(june(4))).not.toHaveAttribute('data-selected-single');
	});

	it('disables a day the matcher rules out, and does not report a click on it', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				disabled={[JUNE_11_2025]}
				onSelect={onSelect}
			/>,
		);

		const day = dayButton(JUNE_11_2025);

		expect(day).toBeDisabled();
		expect(getComputedStyle(day).cursor).toBe('not-allowed');

		await user.click(day);

		expect(onSelect).not.toHaveBeenCalled();
	});

	it('reports the selected date to onSelect', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} onSelect={onSelect} />);

		await user.click(dayButton(JUNE_11_2025));

		expect(onSelect).toHaveBeenCalledTimes(1);

		const selected = onSelect.mock.calls[0][0] as Date;

		expect(selected).toBeInstanceOf(Date);
		expect(selected.getDate()).toBe(11);
		expect(selected.getMonth()).toBe(5);
	});

	it('renders a prefix and a suffix around the day number when given one', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				components={{ DayButton: MarkedDayButton }}
			/>,
		);

		const day = dayButton(JUNE_11_2025);

		expect(day.querySelector('[data-slot="calendar-day-button-prefix"]')).toHaveTextContent('<');
		expect(day.querySelector('[data-slot="calendar-day-button-suffix"]')).toHaveTextContent('>');
		expect(day).toHaveTextContent('<11>');
	});

	it('leaves the prefix and suffix slots out when it has nothing to put in them', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		const day = dayButton(JUNE_11_2025);

		expect(day.querySelector('[data-slot="calendar-day-button-prefix"]')).toBeNull();
		expect(day.querySelector('[data-slot="calendar-day-button-suffix"]')).toBeNull();
	});

	it('names every day for a screen reader', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		const day = screen.getByRole('button', { name: /June 11(th)?,? 2025/ });

		expect(day).toBe(dayButton(JUNE_11_2025));
	});
});
