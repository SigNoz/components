import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from '../calendar.js';
import { JUNE_11_2025, dayButton, june, navButtons } from './calendar.test-utils.js';

/** The tokens a theme would supply, so a computed colour is something the test chose. */
const COLOURS = {
	'--calendar-button-background': 'rgb(1, 1, 1)',
	'--calendar-day-selected-background': 'rgb(2, 2, 2)',
	'--calendar-day-range-edge-background': 'rgb(3, 3, 3)',
	'--calendar-day-range-middle-background': 'rgb(4, 4, 4)',
} as CSSProperties;

/** A week row and a day cell measure off these, and so must the weekday header above them. */
const GRID_TRACKS = {
	'--calendar-cell-size': '32px',
	'--calendar-week-gap': '10px',
	'--calendar-day-margin': '5px',
} as CSSProperties;

/** One colour per day state, so a computed label colour says which rule painted it. */
const LABELS = {
	'--calendar-button-label': 'rgb(11, 11, 11)',
	'--calendar-day-outside-label': 'rgb(22, 22, 22)',
	'--calendar-day-disabled-label': 'rgb(33, 33, 33)',
	'--calendar-day-today-label': 'rgb(44, 44, 44)',
	'--calendar-day-selected-label': 'rgb(55, 55, 55)',
} as CSSProperties;

describe('Calendar styling', () => {
	it('sizes a date cell, a month arrow and the week-number column off one variable', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				showWeekNumber
				style={{ '--calendar-cell-size': '40px' } as CSSProperties}
				testId="calendar"
			/>,
		);

		const weekNumber = document.querySelector('[data-slot="calendar-week-number"]');

		expect(dayButton(JUNE_11_2025).getBoundingClientRect().height).toBe(40);
		expect(navButtons().next.getBoundingClientRect().height).toBe(40);
		expect(weekNumber?.getBoundingClientRect().width).toBe(40);
	});

	it('sizes the chevron apart from the arrow it sits in', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				style={
					{ '--calendar-cell-size': '32px', '--calendar-chevron-size': '16px' } as CSSProperties
				}
			/>,
		);

		const arrow = navButtons().next;
		const chevron = arrow.querySelector('svg')?.getBoundingClientRect();

		// The arrow is a pointer target and keeps WCAG 2.5.8's 24 by 24; the icon inside it is
		// smaller, so the button has something to paint around on hover.
		expect(arrow.getBoundingClientRect().width).toBe(32);
		expect(chevron?.width).toBe(16);
	});

	it('centres the week number against the days in its row', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} showWeekNumber />);

		const dayCell = dayButton(june(11));
		const weekNumber = dayCell
			.closest('tr')
			?.querySelector('[data-slot="calendar-week-number"]')
			?.getBoundingClientRect();
		const day = dayCell.getBoundingClientRect();

		expect(weekNumber).toBeDefined();

		const weekNumberCentre = (weekNumber?.top ?? 0) + (weekNumber?.height ?? 0) / 2;

		expect(Math.abs(weekNumberCentre - (day.top + day.height / 2))).toBeLessThanOrEqual(1);
	});

	it('paints a selected day from the selection token, not the button one', () => {
		render(
			<Calendar
				mode="single"
				selected={JUNE_11_2025}
				onSelect={vi.fn()}
				defaultMonth={JUNE_11_2025}
				style={COLOURS}
			/>,
		);

		expect(getComputedStyle(dayButton(JUNE_11_2025)).backgroundColor).toBe('rgb(2, 2, 2)');
		expect(getComputedStyle(dayButton(june(12))).backgroundColor).toBe('rgb(1, 1, 1)');
	});

	it('paints the three positions of a range apart', () => {
		render(
			<Calendar
				mode="range"
				selected={{ from: june(10), to: june(12) }}
				onSelect={vi.fn()}
				defaultMonth={JUNE_11_2025}
				style={COLOURS}
			/>,
		);

		expect(getComputedStyle(dayButton(june(10))).backgroundColor).toBe('rgb(3, 3, 3)');
		expect(getComputedStyle(dayButton(june(11))).backgroundColor).toBe('rgb(4, 4, 4)');
		expect(getComputedStyle(dayButton(june(12))).backgroundColor).toBe('rgb(3, 3, 3)');
	});

	it('reads the day number at full opacity', () => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} />);

		const label = dayButton(JUNE_11_2025).querySelector('[data-slot="calendar-day-button-label"]');

		expect(label).toBeDefined();
		expect(getComputedStyle(label as Element).opacity).toBe('1');
	});

	it('paints the day number of an outside, a today and a disabled day apart', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				today={june(11)}
				disabled={[june(5)]}
				style={LABELS}
			/>,
		);

		// The colour has to land on the button: it declares one of its own, which beats anything the
		// cell around it hands down.
		expect(getComputedStyle(dayButton(june(12))).color).toBe('rgb(11, 11, 11)');
		expect(getComputedStyle(dayButton(new Date(2025, 6, 1))).color).toBe('rgb(22, 22, 22)');
		expect(getComputedStyle(dayButton(june(5))).color).toBe('rgb(33, 33, 33)');
		expect(getComputedStyle(dayButton(june(11))).color).toBe('rgb(44, 44, 44)');
	});

	it('paints a selected day as selected even on today', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				today={june(11)}
				selected={june(11)}
				onSelect={vi.fn()}
				style={LABELS}
			/>,
		);

		expect(getComputedStyle(dayButton(june(11))).color).toBe('rgb(55, 55, 55)');
	});

	it('dims a disabled day once, on the button', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				disabled={[june(5)]}
				style={{ '--calendar-button-disabled-opacity': '0.6' } as CSSProperties}
			/>,
		);

		const day = dayButton(june(5));

		// Opacity multiplies down the tree, so a second one on the cell would take the day number
		// below any contrast floor.
		expect(getComputedStyle(day).opacity).toBe('0.6');
		expect(getComputedStyle(day.closest('td') as Element).opacity).toBe('1');
	});

	it.each([
		['the gaps a theme sets', GRID_TRACKS],
		['no room to breathe', {} as CSSProperties],
	])('sits each weekday header over the column it names, with %s', (_name, style) => {
		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} style={style} />);

		const headers = [...document.querySelectorAll('thead th')];
		const firstWeek = dayButton(june(1)).closest('tr') as HTMLElement;
		const days = [...firstWeek.querySelectorAll('td')];

		expect(headers).toHaveLength(7);
		expect(days).toHaveLength(7);

		for (const [index, header] of headers.entries()) {
			const headerBox = header.getBoundingClientRect();
			const dayBox = (days[index] as HTMLElement).getBoundingClientRect();
			const drift = headerBox.left + headerBox.width / 2 - (dayBox.left + dayBox.width / 2);

			expect(Math.abs(drift)).toBeLessThanOrEqual(1);
		}
	});

	it('merges a style of its own onto the root', () => {
		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				testId="calendar"
				style={{ padding: '3px' }}
			/>,
		);

		expect(getComputedStyle(screen.getByTestId('calendar')).padding).toBe('3px');
	});
});
