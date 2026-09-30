import { render } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from '../calendar.js';
import { JUNE_11_2025, dayButton, june } from './calendar.test-utils.js';

/**
 * A grid with real gaps, so two neighbouring days sit 20px apart (5px of margin on each cell and
 * 10px between the columns), and one colour per range position.
 */
const GRID = {
	'--calendar-cell-size': '32px',
	'--calendar-week-gap': '10px',
	'--calendar-day-margin': '5px',
	'--radius-2': '4px',
	'--radius-3': '6px',
	'--calendar-button-background': 'rgb(1, 1, 1)',
	'--calendar-day-range-edge-background': 'rgb(3, 3, 3)',
	'--calendar-day-range-middle-background': 'rgb(4, 4, 4)',
} as CSSProperties;

/** The horizontal offset of each `box-shadow` layer on an element, in pixels. */
function shadowOffsets(element: Element): number[] {
	const boxShadow = getComputedStyle(element).boxShadow;

	if (boxShadow === 'none') {
		return [];
	}

	// Layers are split on the commas outside a colour's parentheses. The first length in a layer is
	// its x offset.
	return boxShadow.split(/,(?![^(]*\))/).map((layer) => Number(layer.match(/(-?[\d.]+)px/)?.[1]));
}

/** How far a day's paint runs horizontally: its own box together with every shadow layer. */
function paintedExtent(element: Element): { left: number; right: number } {
	const box = element.getBoundingClientRect();
	const offsets = shadowOffsets(element);

	return {
		left: Math.min(box.left, ...offsets.map((offset) => box.left + offset)),
		right: Math.max(box.right, ...offsets.map((offset) => box.right + offset)),
	};
}

/** Both days, ordered by where they sit on screen rather than in time. */
function onScreen(a: Element, b: Element): [Element, Element] {
	return a.getBoundingClientRect().left < b.getBoundingClientRect().left ? [a, b] : [b, a];
}

/** Expects the band to run from one day to the next without a visible gap. */
function expectBridged(a: Element, b: Element): void {
	const [left, right] = onScreen(a, b);

	// The buttons themselves are apart, so the band is what closes the gap.
	expect(right.getBoundingClientRect().left - left.getBoundingClientRect().right).toBe(20);
	expect(paintedExtent(left).right).toBeCloseTo(paintedExtent(right).left, 0);
}

/** Tuesday the 10th to Thursday the 19th, so the range wraps from one week row into the next. */
const TWO_WEEK_RANGE = { from: june(10), to: june(19) };

describe('Calendar range band', () => {
	it('paints a range across the gaps the grid variables leave between its days', () => {
		render(
			<div style={GRID}>
				<Calendar
					mode="range"
					selected={TWO_WEEK_RANGE}
					onSelect={vi.fn()}
					defaultMonth={JUNE_11_2025}
				/>
			</div>,
		);

		for (const [from, to] of [
			[10, 11],
			[11, 12],
			[12, 13],
			[13, 14],
			[15, 16],
			[16, 17],
			[17, 18],
			[18, 19],
		] as const) {
			expectBridged(dayButton(june(from)), dayButton(june(to)));
		}
	});

	it('rounds all four corners of a range of one day, and reaches nowhere', () => {
		render(
			<div style={{ ...GRID, '--calendar-range-edge-border-radius': '8px' } as CSSProperties}>
				<Calendar
					mode="range"
					selected={{ from: june(11), to: june(11) }}
					onSelect={vi.fn()}
					defaultMonth={JUNE_11_2025}
				/>
			</div>,
		);

		const day = dayButton(june(11));

		expect(getComputedStyle(day).borderRadius).toBe('8px');
		expect(paintedExtent(day)).toEqual({
			left: day.getBoundingClientRect().left,
			right: day.getBoundingClientRect().right,
		});
	});

	it('paints outside days no other displayed month shows, and skips the ones one does', () => {
		render(
			<div style={GRID}>
				<Calendar
					mode="range"
					numberOfMonths={2}
					selected={{ from: new Date(2025, 5, 30), to: new Date(2025, 7, 2) }}
					onSelect={vi.fn()}
					defaultMonth={JUNE_11_2025}
				/>
			</div>,
		);

		const paint = (iso: string): string[] =>
			[...document.querySelectorAll(`[data-variant="day"][data-day="${iso}"]`)].map(
				(day) => getComputedStyle(day).backgroundColor,
			);

		// August is not displayed, so July's grid is the only place its first two days show.
		expect(paint('2025-08-01')).toEqual(['rgb(4, 4, 4)']);
		expect(paint('2025-08-02')).toEqual(['rgb(3, 3, 3)']);
		expectBridged(dayButton(new Date(2025, 6, 31)), dayButton(new Date(2025, 7, 1)));

		// June 30 shows in June's grid and again as July's leading outside day. Only June paints it.
		const [inJune, inJuly] = document.querySelectorAll(
			'[data-variant="day"][data-day="2025-06-30"]',
		);

		expect(paint('2025-06-30')).toEqual(['rgb(3, 3, 3)', 'rgb(1, 1, 1)']);
		expect(inJune).not.toHaveAttribute('data-duplicate');
		expect(inJuly).toHaveAttribute('data-duplicate', 'true');
	});
});
