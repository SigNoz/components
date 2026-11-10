import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { cdp } from 'vitest/browser';
import { Calendar } from '../calendar.js';
import { JUNE_11_2025, dayButton, isoDay, june, navButtons } from './calendar.test-utils.js';

describe('Calendar months', () => {
	it('starts on the default month and reads it once', () => {
		const { rerender } = render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		expect(screen.getByText('June 2025')).toBeInTheDocument();

		rerender(<Calendar mode="single" defaultMonth={new Date(2026, 0, 1)} />);

		expect(screen.getByText('June 2025')).toBeInTheDocument();
	});

	it('reports the first day of the month the arrow goes to', async () => {
		const user = userEvent.setup();
		const onMonthChange = vi.fn();

		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} onMonthChange={onMonthChange} />);

		await user.click(navButtons().next);
		await user.click(navButtons().previous);
		await user.click(navButtons().previous);

		expect(onMonthChange.mock.calls.map(([month]) => isoDay(month as Date))).toEqual([
			'2025-07-01',
			'2025-06-01',
			'2025-05-01',
		]);
	});

	it('stays on the month it is given, and only reports where the user wants to go', async () => {
		const user = userEvent.setup();
		const onMonthChange = vi.fn();

		const { rerender } = render(
			<Calendar mode="single" month={JUNE_11_2025} onMonthChange={onMonthChange} />,
		);

		await user.click(navButtons().next);

		expect(onMonthChange).toHaveBeenCalledTimes(1);
		expect(screen.getByText('June 2025')).toBeInTheDocument();

		rerender(<Calendar mode="single" month={new Date(2025, 6, 1)} onMonthChange={onMonthChange} />);

		expect(screen.getByText('July 2025')).toBeInTheDocument();
	});

	it('lays out the months side by side, and counts the weeks that two of them share twice', () => {
		render(
			<Calendar mode="single" defaultMonth={JUNE_11_2025} numberOfMonths={2} testId="calendar" />,
		);

		expect(screen.getByText('June 2025')).toBeInTheDocument();
		expect(screen.getByText('July 2025')).toBeInTheDocument();
		expect(document.querySelectorAll('[data-slot="calendar-month"]')).toHaveLength(2);
		expect(document.querySelectorAll('[data-day="2025-06-30"]')).toHaveLength(4);
		expect(screen.getByTestId('calendar')).toHaveAttribute('data-multiple-months', 'true');
	});

	it('pulls the first month back so that every month fits before endMonth', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={new Date(2025, 11, 1)}
				endMonth={new Date(2025, 11, 1)}
				numberOfMonths={3}
			/>,
		);

		expect(screen.getByText('October 2025')).toBeInTheDocument();
		expect(screen.getByText('December 2025')).toBeInTheDocument();
		expect(navButtons().next).toHaveAttribute('aria-disabled', 'true');
	});

	it('hides the days outside startMonth and endMonth, leaving empty cells', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				startMonth={new Date(2025, 5, 1)}
				endMonth={new Date(2025, 5, 1)}
			/>,
		);

		const cell = document.querySelector('td[data-day="2025-07-01"]');

		expect(cell).toHaveAttribute('data-hidden', 'true');
		expect(cell?.querySelector('button')).toBeNull();
	});
});

describe('Calendar month dropdowns', () => {
	it('moves to the month and the year that are picked', async () => {
		const user = userEvent.setup();
		const onMonthChange = vi.fn();

		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				captionLayout="dropdown"
				startMonth={new Date(2024, 0, 1)}
				endMonth={new Date(2026, 11, 1)}
				onMonthChange={onMonthChange}
			/>,
		);

		await user.selectOptions(screen.getByRole('combobox', { name: /month/i }), 'Sep');
		expect(isoDay(onMonthChange.mock.lastCall?.[0] as Date)).toBe('2025-09-01');

		await user.selectOptions(screen.getByRole('combobox', { name: /year/i }), '2026');
		expect(isoDay(onMonthChange.mock.lastCall?.[0] as Date)).toBe('2026-09-01');
	});

	it('disables the months outside the range the user can reach', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				captionLayout="dropdown-months"
				startMonth={new Date(2025, 2, 1)}
				endMonth={new Date(2025, 8, 1)}
			/>,
		);

		const options = [
			...screen.getByRole('combobox', { name: /month/i }).querySelectorAll('option'),
		];

		expect(options.filter((option) => option.disabled).map((option) => option.textContent)).toEqual(
			['Jan', 'Feb', 'Oct', 'Nov', 'Dec'],
		);
	});

	it('writes the other half of the caption as text', () => {
		const { rerender } = render(
			<Calendar mode="single" defaultMonth={JUNE_11_2025} captionLayout="dropdown-months" />,
		);

		expect(screen.getByRole('combobox', { name: /month/i })).toBeInTheDocument();
		expect(screen.queryByRole('combobox', { name: /year/i })).toBeNull();
		expect(screen.getByText('2025')).toBeInTheDocument();

		rerender(<Calendar mode="single" defaultMonth={JUNE_11_2025} captionLayout="dropdown-years" />);

		expect(screen.queryByRole('combobox', { name: /month/i })).toBeNull();
		expect(screen.getByRole('combobox', { name: /year/i })).toBeInTheDocument();
	});

	it('lists the years from 100 years before today to the end of its year without bounds', () => {
		render(
			<Calendar
				mode="single"
				today={JUNE_11_2025}
				defaultMonth={JUNE_11_2025}
				captionLayout="dropdown"
			/>,
		);

		const years = [...screen.getByRole('combobox', { name: /year/i }).querySelectorAll('option')];

		expect(years[0]).toHaveTextContent('1925');
		expect(years.at(-1)).toHaveTextContent('2025');
		expect(years).toHaveLength(101);
	});
});

describe('Calendar keyboard', () => {
	it('skips the disabled days, so a week of them is crossed in one press', async () => {
		const user = userEvent.setup();

		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				disabled={[{ dayOfWeek: [0, 6] }]}
				onSelect={vi.fn()}
			/>,
		);

		dayButton(june(13)).focus();

		await user.keyboard('{ArrowRight}');
		expect(document.activeElement).toHaveAttribute('data-day', isoDay(june(16)));

		await user.keyboard('{ArrowLeft}');
		expect(document.activeElement).toHaveAttribute('data-day', isoDay(june(13)));
	});

	it('goes to the start and the end of the week, and by month and year', async () => {
		const user = userEvent.setup();

		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} onSelect={vi.fn()} />);

		dayButton(JUNE_11_2025).focus();

		await user.keyboard('{Home}');
		expect(document.activeElement).toHaveAttribute('data-day', isoDay(june(8)));

		await user.keyboard('{End}');
		expect(document.activeElement).toHaveAttribute('data-day', isoDay(june(14)));

		await user.keyboard('{PageDown}');
		expect(document.activeElement).toHaveAttribute('data-day', '2025-07-14');
		expect(screen.getByText('July 2025')).toBeInTheDocument();

		await user.keyboard('{Shift>}{PageUp}{/Shift}');
		expect(document.activeElement).toHaveAttribute('data-day', '2024-07-14');
		expect(screen.getByText('July 2024')).toBeInTheDocument();
	});

	it('lands on the last day of a shorter month', async () => {
		const user = userEvent.setup();

		render(<Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} onSelect={vi.fn()} />);

		dayButton(new Date(2025, 0, 31)).focus();

		await user.keyboard('{PageDown}');

		expect(document.activeElement).toHaveAttribute('data-day', '2025-02-28');
	});

	it('stops at startMonth and endMonth', async () => {
		const user = userEvent.setup();

		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				startMonth={new Date(2025, 5, 1)}
				endMonth={new Date(2025, 5, 1)}
				onSelect={vi.fn()}
			/>,
		);

		dayButton(june(30)).focus();
		await user.keyboard('{ArrowRight}');
		expect(document.activeElement).toHaveAttribute('data-day', isoDay(june(30)));

		dayButton(june(1)).focus();
		await user.keyboard('{ArrowLeft}{ArrowUp}{PageUp}');
		expect(document.activeElement).toHaveAttribute('data-day', isoDay(june(1)));
	});

	it('keeps the month still with disableNavigation, and moves only over what is shown', async () => {
		const user = userEvent.setup();

		render(
			<Calendar mode="single" defaultMonth={JUNE_11_2025} disableNavigation onSelect={vi.fn()} />,
		);

		dayButton(june(30)).focus();
		await user.keyboard('{ArrowRight}{PageDown}');

		expect(screen.getByText('June 2025')).toBeInTheDocument();
		expect(navButtons().next).toHaveAttribute('aria-disabled', 'true');
		expect(navButtons().previous).toHaveAttribute('aria-disabled', 'true');
	});

	it.each([
		['the selected day', june(11), june(20), isoDay(june(20))],
		['today without a selection', june(11), undefined, isoDay(june(11))],
		['the first day when today is not shown', new Date(2030, 0, 1), undefined, isoDay(june(1))],
	])('puts one day in the tab order: %s', (_name, today, selected, expected) => {
		render(
			<Calendar mode="single" today={today} defaultMonth={JUNE_11_2025} selected={selected} />,
		);

		const tabStops = [...document.querySelectorAll('[data-variant="day"][tabindex="0"]')].map(
			(button) => button.getAttribute('data-day'),
		);

		expect(tabStops).toEqual([expected]);
	});

	it('keeps a disabled day that holds the focus reachable, with aria-disabled', () => {
		const { rerender } = render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		dayButton(june(12)).focus();
		rerender(<Calendar mode="single" defaultMonth={JUNE_11_2025} disabled={[june(12)]} />);

		const focused = dayButton(june(12));

		expect(document.activeElement).toBe(focused);
		expect(focused).toHaveAttribute('aria-disabled', 'true');
		expect(focused).not.toBeDisabled();
		expect(dayButton(june(13))).not.toHaveAttribute('aria-disabled');

		act(() => dayButton(june(13)).focus());

		expect(dayButton(june(12))).toBeDisabled();
		expect(dayButton(june(12))).not.toHaveAttribute('aria-disabled');
	});
});

describe('Calendar options', () => {
	it('drops the weekday names with hideWeekdays', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} hideWeekdays showWeekNumber />);

		expect(document.querySelector('thead')).toBeNull();
		expect(document.querySelectorAll('[data-slot="calendar-week-number"]')).toHaveLength(5);
	});

	it('leaves the weekday names out of the accessibility tree, with their full names on them', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		const header = document.querySelector('thead');

		expect(header).toHaveAttribute('aria-hidden', 'true');
		expect([...document.querySelectorAll('thead th')].map((th) => th.textContent)).toEqual([
			'Su',
			'Mo',
			'Tu',
			'We',
			'Th',
			'Fr',
			'Sa',
		]);
		expect(document.querySelector('thead th')).toHaveAttribute('aria-label', 'Sunday');
	});

	it('starts the week on weekStartsOn, and on the first day of the locale without it', () => {
		const { rerender } = render(
			<Calendar mode="single" defaultMonth={JUNE_11_2025} weekStartsOn={3} />,
		);

		expect(document.querySelector('thead th')).toHaveTextContent('We');

		rerender(<Calendar mode="single" defaultMonth={JUNE_11_2025} locale="en-GB" />);
		expect(document.querySelector('thead th')).toHaveTextContent('Mo');

		rerender(
			<Calendar mode="single" defaultMonth={JUNE_11_2025} locale="en-GB" weekStartsOn={0} />,
		);
		expect(document.querySelector('thead th')).toHaveTextContent('Su');
	});

	it('writes the names in the language of the locale, and marks the root with it', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} locale="pt-BR" testId="calendar" />);

		expect(screen.getByText('junho de 2025')).toBeInTheDocument();
		expect(dayButton(JUNE_11_2025)).toHaveAccessibleName('quarta-feira, 11 de junho de 2025');
		expect(screen.getByTestId('calendar')).toHaveAttribute('lang', 'pt-BR');
	});

	it('lets lang set the language of the root without changing the locale', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} lang="fr" testId="calendar" />);

		expect(screen.getByTestId('calendar')).toHaveAttribute('lang', 'fr');
		expect(screen.getByText('June 2025')).toBeInTheDocument();
	});

	it('names today, and the selected day, in the label of a day', () => {
		render(
			<Calendar
				mode="single"
				today={JUNE_11_2025}
				defaultMonth={JUNE_11_2025}
				selected={JUNE_11_2025}
			/>,
		);

		expect(dayButton(JUNE_11_2025)).toHaveAccessibleName(
			'Today, Wednesday, June 11th, 2025, selected',
		);
	});

	it('renders a footer in a live region, and none without one', () => {
		const { rerender } = render(
			<Calendar mode="single" defaultMonth={JUNE_11_2025} footer="Pick a day" />,
		);

		const footer = screen.getByText('Pick a day');

		expect(footer).toHaveAttribute('role', 'status');
		expect(footer).toHaveAttribute('aria-live', 'polite');

		rerender(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		expect(screen.queryByRole('status', { name: 'Pick a day' })).toBeNull();
	});

	it('marks the root with the state it is in, and passes id, aria and data attributes through', () => {
		render(
			<Calendar
				mode="range"
				required
				numberOfMonths={2}
				showWeekNumber
				defaultMonth={JUNE_11_2025}
				selected={undefined}
				id="window"
				title="Window"
				aria-label="Report window"
				data-qa="calendar"
				testId="calendar"
			/>,
		);

		const root = screen.getByTestId('calendar');

		expect(root).toHaveAttribute('data-mode', 'range');
		expect(root).toHaveAttribute('data-required', 'true');
		expect(root).toHaveAttribute('data-multiple-months', 'true');
		expect(root).toHaveAttribute('data-week-numbers', 'true');
		expect(root).toHaveAttribute('id', 'window');
		expect(root).toHaveAttribute('title', 'Window');
		expect(root).toHaveAttribute('aria-label', 'Report window');
		expect(root).toHaveAttribute('data-qa', 'calendar');
	});

	it('keeps its own data-slot, and drops a className or a style that gets past the types', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				testId="calendar"
				data-slot="mine"
				{...({ className: 'stray', style: { color: 'red' } } as object)}
			/>,
		);

		const root = screen.getByTestId('calendar');

		expect(root).toHaveAttribute('data-slot', 'calendar');
		expect(root).not.toHaveClass('stray');
		expect(root.style.color).toBe('');
	});
});

describe('Calendar in a time zone that changes its clocks', () => {
	it.each([
		['America/Sao_Paulo', 2018, 10, 30],
		['America/New_York', 2026, 2, 31],
		['Europe/London', 2026, 9, 31],
		['Australia/Lord_Howe', 2026, 9, 31],
	] as const)('lays out %s without a day lost or repeated', async (timeZone, year, month, days) => {
		await cdp().send('Emulation.setTimezoneOverride', { timezoneId: timeZone });

		try {
			render(
				<Calendar
					mode="single"
					showOutsideDays={false}
					defaultMonth={new Date(year, month, 1)}
					today={new Date(year, month, 1)}
				/>,
			);

			const shown = [...document.querySelectorAll('[data-variant="day"]')].map((button) =>
				Number(button.getAttribute('data-day')?.slice(8)),
			);

			expect(shown).toEqual(Array.from({ length: days }, (_, index) => index + 1));
		} finally {
			await cdp().send('Emulation.setTimezoneOverride', { timezoneId: '' });
		}
	});
});
