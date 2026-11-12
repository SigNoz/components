import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FocusEvent, ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from '../index.js';
import { DatePickerField } from '../presets/date-picker-field.js';
import {
	expectClosed,
	getTrigger,
	NOV_6_2026,
	openDatePicker,
	openWithKeyboard,
	pickZone,
	timeField,
	ZONE_OPTIONS,
	ZonedDatePicker,
} from './date-picker.test-utils.js';

/**
 * The blur is judged one task after the focus moved. A check that it was not called has to wait
 * past that task, or it passes before the call could happen.
 */
function settle(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, 50));
}

function renderPicker(onBlur: (event: FocusEvent<HTMLElement>) => void): ReactElement {
	return (
		<div>
			<button type="button">Before</button>
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				allowClear
				onBlur={onBlur}
				testId="dp"
			/>
			<button type="button">After</button>
			<p>Outside text</p>
		</div>
	);
}

describe('DatePicker onBlur', () => {
	it('stays quiet while the popup opens and closes, and fires once when Tab leaves', async () => {
		const onBlur = vi.fn();
		render(renderPicker(onBlur));

		await openWithKeyboard();
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.keyboard('{Escape}');
		await expectClosed();
		await waitFor(() => {
			expect(getTrigger()).toHaveFocus();
		});
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.tab();

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
		expect(onBlur.mock.calls[0]?.[0].currentTarget).toBe(
			getTrigger().closest('[data-slot="date-picker"]'),
		);
	});

	it('stays quiet when a pick closes the popup and hands the focus back', async () => {
		const onBlur = vi.fn();
		render(renderPicker(onBlur));

		await openDatePicker();
		await userEvent.keyboard('{ArrowRight}{Enter}');
		await expectClosed();
		await waitFor(() => {
			expect(getTrigger()).toHaveFocus();
		});
		await settle();

		expect(onBlur).not.toHaveBeenCalled();
	});

	it('stays quiet while the focus moves through the time row and the time zone field', async () => {
		const onBlur = vi.fn();
		render(
			<div>
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'utc' }}
					onBlur={onBlur}
					testId="dp"
				/>
				<button type="button">After</button>
			</div>,
		);

		await openDatePicker();
		await userEvent.click(timeField('Hours'));
		await pickZone('Asia/Kolkata');
		await settle();

		expect(onBlur).not.toHaveBeenCalled();
	});

	it('fires once on a press outside the open popup', async () => {
		const onBlur = vi.fn();
		render(renderPicker(onBlur));

		await openDatePicker();
		await userEvent.click(screen.getByText('Outside text'));

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
		await settle();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it('fires once when the focus leaves the closed trigger', async () => {
		const onBlur = vi.fn();
		render(renderPicker(onBlur));

		getTrigger().focus();
		await userEvent.tab({ shift: true });

		expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
	});
});

describe('DatePickerField onBlur', () => {
	it('fires once when the focus leaves the date picker, and takes a handler with no argument', async () => {
		const onBlur = vi.fn<() => void>();
		render(
			<div>
				<DatePickerField label="Expiry" placeholder="Select date" onBlur={onBlur} testId="dp" />
				<button type="button">After</button>
			</div>,
		);

		await openWithKeyboard();
		await userEvent.keyboard('{Escape}');
		await expectClosed();
		await waitFor(() => {
			expect(getTrigger()).toHaveFocus();
		});
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.tab();

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
	});
});
