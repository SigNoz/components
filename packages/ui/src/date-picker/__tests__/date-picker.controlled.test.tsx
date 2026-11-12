import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DatePicker } from '../index.js';
import { dayButton, getTrigger, NOV_6_2026, openDatePicker } from './date-picker.test-utils.js';

const NOV_10_2026 = new Date(2026, 10, 10);
const NOV_12_2026 = new Date(2026, 10, 12);

type PlainProps = {
	value?: Date;
	defaultValue?: Date;
	onChange?: (value: Date | undefined) => void;
	allowClear?: boolean;
};

// Spreading the props keeps a `value` that is left out apart from one written as `undefined`.
function Plain(props: PlainProps) {
	return <DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" {...props} />;
}

type NullableProps = {
	value?: Date | null;
	onChange?: (value: Date | null) => void;
	allowClear?: boolean;
};

function Nullable(props: NullableProps) {
	return (
		<DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" nullable {...props} />
	);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('DatePicker value rule', () => {
	it('keeps its own state and starts at defaultValue while value is undefined on the first render', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onChange = vi.fn();
		render(<Plain value={undefined} defaultValue={NOV_6_2026} onChange={onChange} />);

		expect(getTrigger()).toHaveTextContent('2026-11-06');

		await openDatePicker();
		await userEvent.click(dayButton(NOV_10_2026));

		expect(onChange).toHaveBeenCalledWith(NOV_10_2026, { timezone: undefined });
		expect(getTrigger()).toHaveTextContent('2026-11-10');
		expect(warn).not.toHaveBeenCalled();
	});

	it('follows a value that arrives later, and warns once', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const { rerender } = render(<Plain value={undefined} />);

		rerender(<Plain value={NOV_10_2026} />);
		rerender(<Plain value={NOV_12_2026} />);

		expect(getTrigger()).toHaveTextContent('2026-11-12');
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn.mock.calls[0]?.[0]).toContain(
			'DatePicker: `value` was `undefined` on the first render and is set now',
		);
	});

	it('stays controlled once set, so value={undefined} then shows no date', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onChange = vi.fn();
		const { rerender } = render(<Plain value={NOV_6_2026} onChange={onChange} />);

		rerender(<Plain value={undefined} onChange={onChange} />);

		expect(getTrigger()).toHaveTextContent('Select date');

		await openDatePicker();
		await userEvent.click(dayButton(NOV_10_2026));

		expect(onChange).toHaveBeenCalledWith(NOV_10_2026, { timezone: undefined });
		expect(getTrigger()).toHaveTextContent('Select date');
		expect(warn).not.toHaveBeenCalled();
	});
});

describe('DatePicker nullable', () => {
	it('takes null as a controlled date picker with no date, without a warning', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onChange = vi.fn();
		render(<Nullable value={null} onChange={onChange} />);

		expect(getTrigger()).toHaveTextContent('Select date');
		expect(getTrigger()).toHaveAttribute('data-empty');

		await openDatePicker();
		await userEvent.click(dayButton(NOV_10_2026));

		expect(onChange).toHaveBeenCalledWith(NOV_10_2026, { timezone: undefined });
		expect(getTrigger()).toHaveTextContent('Select date');
		expect(warn).not.toHaveBeenCalled();
	});

	it('follows a date that replaces null, without a warning', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const { rerender } = render(<Nullable value={null} />);

		rerender(<Nullable value={NOV_10_2026} />);

		expect(getTrigger()).toHaveTextContent('2026-11-10');
		expect(warn).not.toHaveBeenCalled();
	});

	it('reports null when the date is cleared', async () => {
		const onChange = vi.fn();
		render(<Nullable value={NOV_6_2026} allowClear onChange={onChange} />);
		getTrigger().focus();

		await userEvent.keyboard('{Delete}');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(null, { timezone: undefined });
	});

	it('still reports undefined when the date is cleared without nullable', async () => {
		const onChange = vi.fn();
		render(<Plain value={NOV_6_2026} allowClear onChange={onChange} />);
		getTrigger().focus();

		await userEvent.keyboard('{Delete}');

		expect(onChange).toHaveBeenCalledWith(undefined, { timezone: undefined });
	});
});
