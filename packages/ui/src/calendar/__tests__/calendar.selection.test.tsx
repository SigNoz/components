import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactElement, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from '../calendar.js';
import type { DateRange } from '../types.js';
import { JUNE_11_2025, dayButton, june } from './calendar.test-utils.js';

function RangeHost({
	onSelect,
}: {
	onSelect?: (range: DateRange | undefined) => void;
}): ReactElement {
	const [range, setRange] = useState<DateRange | undefined>();

	return (
		<Calendar
			mode="range"
			defaultMonth={JUNE_11_2025}
			selected={range}
			onSelect={(next) => {
				setRange(next);
				onSelect?.(next);
			}}
		/>
	);
}

describe('Calendar single selection', () => {
	it('selects the picked day and reports it with the day that was picked', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} onSelect={onSelect} />);

		await user.click(dayButton(june(18)));

		expect(onSelect).toHaveBeenCalledTimes(1);

		const [selected, triggerDate, modifiers, event] = onSelect.mock.calls[0] as [
			Date,
			Date,
			Record<string, boolean | undefined>,
			Event,
		];

		expect(selected).toEqual(june(18));
		expect(triggerDate).toEqual(june(18));
		expect(modifiers).toMatchObject({
			today: false,
			outside: false,
			disabled: false,
			hidden: false,
		});
		expect(modifiers['range_start']).toBeUndefined();
		expect(event.type).toBe('click');
	});

	it('clears the selection when the selected day is picked again', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				selected={june(18)}
				onSelect={onSelect}
			/>,
		);

		await user.click(dayButton(june(18)));

		expect(onSelect.mock.calls[0]?.[0]).toBeUndefined();
		expect(onSelect.mock.calls[0]?.[1]).toEqual(june(18));
	});

	it('keeps the selection when it is required', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(
			<Calendar
				mode="single"
				required
				defaultMonth={JUNE_11_2025}
				selected={june(18)}
				onSelect={onSelect}
			/>,
		);

		await user.click(dayButton(june(18)));

		expect(onSelect.mock.calls[0]?.[0]).toEqual(june(18));
	});

	it('keeps the selection itself without onSelect, starting from `selected`', async () => {
		const user = userEvent.setup();

		const { rerender } = render(
			<Calendar mode="single" defaultMonth={JUNE_11_2025} selected={june(18)} />,
		);

		expect(dayButton(june(18))).toHaveAttribute('data-selected-single', 'true');

		await user.click(dayButton(june(19)));

		expect(dayButton(june(19))).toHaveAttribute('data-selected-single', 'true');
		expect(dayButton(june(18))).not.toHaveAttribute('data-selected-single');

		// A new `selected` is not read again, the calendar owns the selection from the first render.
		rerender(<Calendar mode="single" defaultMonth={JUNE_11_2025} selected={june(24)} />);

		expect(dayButton(june(19))).toHaveAttribute('data-selected-single', 'true');
		expect(dayButton(june(24))).not.toHaveAttribute('data-selected-single');
	});

	it('shows only what `selected` says once onSelect is given', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} onSelect={onSelect} />);

		await user.click(dayButton(june(18)));

		expect(onSelect).toHaveBeenCalled();
		expect(document.querySelector('[data-selected-single]')).toBeNull();
	});

	it('marks the selected day on its cell and in its name', () => {
		render(
			<Calendar mode="single" defaultMonth={JUNE_11_2025} selected={june(18)} onSelect={vi.fn()} />,
		);

		const cell = dayButton(june(18)).closest('td');

		expect(cell).toHaveAttribute('aria-selected', 'true');
		expect(cell).toHaveAttribute('data-selected', 'true');
		expect(dayButton(june(18))).toHaveAccessibleName('Wednesday, June 18th, 2025, selected');
		expect(dayButton(june(19)).closest('td')).not.toHaveAttribute('aria-selected');
	});

	it('does not report a click on a disabled day', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(
			<Calendar
				mode="single"
				defaultMonth={JUNE_11_2025}
				disabled={[{ dayOfWeek: [0] }]}
				onSelect={onSelect}
			/>,
		);

		await user.click(dayButton(june(15)));

		expect(onSelect).not.toHaveBeenCalled();
	});

	it('picks a day of the next month through its outside copy, and shows that month', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(<Calendar mode="single" defaultMonth={JUNE_11_2025} onSelect={onSelect} />);

		await user.click(dayButton(new Date(2025, 6, 1)));

		expect(onSelect.mock.calls[0]?.[0]).toEqual(new Date(2025, 6, 1));
		expect(onSelect.mock.calls[0]?.[2]).toMatchObject({ outside: true });
	});
});

describe('Calendar multiple selection', () => {
	it('adds a picked day to the days already selected, and removes a day picked again', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		const { rerender } = render(
			<Calendar
				mode="multiple"
				defaultMonth={JUNE_11_2025}
				selected={[june(3)]}
				onSelect={onSelect}
			/>,
		);

		await user.click(dayButton(june(9)));

		expect(onSelect.mock.calls[0]?.[0]).toEqual([june(3), june(9)]);

		rerender(
			<Calendar
				mode="multiple"
				defaultMonth={JUNE_11_2025}
				selected={[june(3), june(9)]}
				onSelect={onSelect}
			/>,
		);

		await user.click(dayButton(june(3)));

		expect(onSelect.mock.calls[1]?.[0]).toEqual([june(9)]);
	});

	it('does not call onSelect for the last selected day when it is required', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(
			<Calendar
				mode="multiple"
				required
				defaultMonth={JUNE_11_2025}
				selected={[june(3)]}
				onSelect={onSelect}
			/>,
		);

		await user.click(dayButton(june(3)));

		expect(onSelect).not.toHaveBeenCalled();
	});

	it('removes a day from a required selection that holds several', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(
			<Calendar
				mode="multiple"
				required
				defaultMonth={JUNE_11_2025}
				selected={[june(3), june(9)]}
				onSelect={onSelect}
			/>,
		);

		await user.click(dayButton(june(3)));

		expect(onSelect.mock.calls[0]?.[0]).toEqual([june(9)]);
	});
});

describe('Calendar range selection', () => {
	it('goes from one day, to a range, to a range moved by the next pick', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(<RangeHost onSelect={onSelect} />);

		await user.click(dayButton(june(10)));
		expect(onSelect.mock.lastCall?.[0]).toEqual({ from: june(10), to: june(10) });

		await user.click(dayButton(june(14)));
		expect(onSelect.mock.lastCall?.[0]).toEqual({ from: june(10), to: june(14) });

		await user.click(dayButton(june(20)));
		expect(onSelect.mock.lastCall?.[0]).toEqual({ from: june(10), to: june(20) });

		await user.click(dayButton(june(5)));
		expect(onSelect.mock.lastCall?.[0]).toEqual({ from: june(5), to: june(20) });
	});

	it('reports the range position of the picked day among its modifiers', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(
			<Calendar
				mode="range"
				defaultMonth={JUNE_11_2025}
				selected={{ from: june(10), to: june(14) }}
				onSelect={onSelect}
			/>,
		);

		await user.click(dayButton(june(12)));

		expect(onSelect.mock.calls[0]?.[2]).toMatchObject({
			selected: true,
			range_start: false,
			range_middle: true,
			range_end: false,
		});
	});

	it('clears a range of one day when it is picked again, unless it is required', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		const range = { from: june(10), to: june(10) };

		const { rerender } = render(
			<Calendar mode="range" defaultMonth={JUNE_11_2025} selected={range} onSelect={onSelect} />,
		);

		await user.click(dayButton(june(10)));
		expect(onSelect.mock.calls[0]?.[0]).toBeUndefined();

		rerender(
			<Calendar
				mode="range"
				required
				defaultMonth={JUNE_11_2025}
				selected={range}
				onSelect={onSelect}
			/>,
		);

		await user.click(dayButton(june(10)));
		expect(onSelect.mock.calls[1]?.[0]).toEqual(range);
	});

	it('ends a range that has only a start on the picked day', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(
			<Calendar
				mode="range"
				defaultMonth={JUNE_11_2025}
				selected={{ from: june(10), to: undefined }}
				onSelect={onSelect}
			/>,
		);

		// A start alone counts as one selected day, not as a range.
		expect(dayButton(june(10))).toHaveAttribute('data-selected-single', 'true');

		await user.click(dayButton(june(4)));

		expect(onSelect.mock.calls[0]?.[0]).toEqual({ from: june(4), to: june(10) });
	});
});
