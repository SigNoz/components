import { render, screen } from '@testing-library/react';
import { ptBR } from 'react-day-picker/locale';
import { describe, expect, it } from 'vitest';
import { Calendar } from '../calendar.js';
import { JUNE_11_2025, dayButton } from './calendar.test-utils.js';

describe('Calendar rendering', () => {
	it('renders the root as the element the calendar is styled on', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} testId="calendar" />);

		const root = screen.getByTestId('calendar');

		expect(root).toHaveAttribute('data-slot', 'calendar');
		expect(root).toHaveClass('rdp-root');
	});

	it('mirrors the selection mode on the root', () => {
		render(<Calendar mode="range" defaultMonth={JUNE_11_2025} testId="calendar" />);

		expect(screen.getByTestId('calendar')).toHaveAttribute('data-mode', 'range');
	});

	it('renders one day button per day in the month', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} showOutsideDays={false} />);

		expect(document.querySelectorAll('[data-variant="day"]')).toHaveLength(30);
	});

	it('fills the first and last week with neighbouring days by default', () => {
		const { rerender } = render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		// June 2025 starts on a Sunday and runs 30 days, so five rows hold it with one day of July.
		expect(document.querySelectorAll('[data-variant="day"]')).toHaveLength(35);
		expect(dayButton(new Date(2025, 6, 1))).toBeInTheDocument();

		rerender(<Calendar mode="single" defaultMonth={JUNE_11_2025} showOutsideDays={false} />);

		expect(document.querySelectorAll('[data-variant="day"]')).toHaveLength(30);
	});

	it('renders the caption as a label by default', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		expect(screen.getByText('June 2025')).toBeInTheDocument();
		expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
	});

	it('renders month and year dropdowns when captionLayout asks for them', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} captionLayout="dropdown" />);

		expect(screen.getByRole('combobox', { name: /month/i })).toBeInTheDocument();
		expect(screen.getByRole('combobox', { name: /year/i })).toBeInTheDocument();
	});

	it('shortens the month names in the dropdown', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} captionLayout="dropdown" />);

		const months = screen.getByRole('combobox', { name: /month/i });

		expect(months).toHaveTextContent('Jun');
		expect(months).not.toHaveTextContent('June');
	});

	it('shortens the month names in the locale the calendar was given', () => {
		render(
			<Calendar mode="single" defaultMonth={JUNE_11_2025} captionLayout="dropdown" locale={ptBR} />,
		);

		// The shortened name goes through react-day-picker's date library, so it follows `locale`
		// the way the caption and the aria labels do rather than the host's default.
		expect(screen.getByRole('option', { name: 'fev' })).toBeInTheDocument();
		expect(screen.queryByRole('option', { name: 'Feb' })).toBeNull();
	});

	it('lets a formatter of its own replace the shortened month names', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				captionLayout="dropdown"
				formatters={{ formatMonthDropdown: (date) => `M${date.getMonth() + 1}` }}
			/>,
		);

		expect(screen.getByRole('combobox', { name: /month/i })).toHaveTextContent('M6');
	});

	it('renders the week number as the row header, and only when asked', () => {
		const { rerender } = render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		expect(document.querySelector('[data-slot="calendar-week-number"]')).toBeNull();

		rerender(<Calendar mode="single" defaultMonth={JUNE_11_2025} showWeekNumber />);

		const weekNumber = document.querySelector('[data-slot="calendar-week-number"]');
		const header = weekNumber?.closest('th');

		expect(weekNumber).toBeInTheDocument();
		expect(header).toHaveAttribute('scope', 'row');
		// `week` is react-day-picker's own object, not a DOM attribute.
		expect(header).not.toHaveAttribute('week');
	});

	it('lets a consumer replace one of react-day-picker components', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				components={{
					DayButton: ({ day }) => <button type="button">day {day.date.getDate()}</button>,
				}}
			/>,
		);

		expect(screen.getByRole('button', { name: 'day 11' })).toBeInTheDocument();
		expect(document.querySelector('[data-variant="day"]')).toBeNull();
	});
});
