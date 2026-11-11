import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentProps, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from '../index.js';
import {
	at,
	dayButton,
	expectClosed,
	getPopup,
	getTrigger,
	NOV_6_2026,
	openDatePicker,
	pickZone,
	ZONE_OPTIONS,
	ZonedDatePicker,
} from './date-picker.test-utils.js';

function formOf(): HTMLFormElement {
	return screen.getByTestId('form') as HTMLFormElement;
}

function submitted(): Array<[string, string]> {
	return [...new FormData(formOf()).entries()].map(([key, value]) => [key, String(value)]);
}

function inputOf(name: string): HTMLInputElement {
	return document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
}

type PickerProps = Partial<ComponentProps<typeof DatePicker>>;

function renderInForm(props: PickerProps = {}, formProps: { onSubmit?: () => void } = {}) {
	return render(
		<form
			data-testid="form"
			onSubmit={(event) => {
				event.preventDefault();
				formProps.onSubmit?.();
			}}
		>
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				name="expiry"
				testId="dp"
				{...props}
			/>
			<button type="submit">Save</button>
			<button type="reset">Reset</button>
		</form>,
	);
}

describe('DatePicker form value', () => {
	it('submits YYYY-MM-DD without showTime', () => {
		renderInForm({ defaultValue: new Date(2026, 0, 5, 23, 59, 59) });

		expect(submitted()).toEqual([['expiry', '2026-01-05']]);
	});

	it('submits YYYY-MM-DDTHH:mm:ss with showTime, the format of a datetime-local input', () => {
		renderInForm({ showTime: true, defaultValue: new Date(2026, 0, 5, 3, 4, 5) });

		expect(submitted()).toEqual([['expiry', '2026-01-05T03:04:05']]);
	});

	it('submits an empty string while there is no value', () => {
		renderInForm();

		expect(submitted()).toEqual([['expiry', '']]);
	});

	it('submits nothing without a name', () => {
		renderInForm({ name: undefined, defaultValue: NOV_6_2026 });

		expect(submitted()).toEqual([]);
	});

	it('follows a pick', async () => {
		renderInForm({ defaultValue: NOV_6_2026 });
		await openDatePicker();

		await userEvent.click(dayButton(new Date(2026, 10, 10)));

		expect(submitted()).toEqual([['expiry', '2026-11-10']]);
	});

	it('follows Apply, and not the draft before it', async () => {
		renderInForm({ showTime: true, defaultValue: new Date(2026, 10, 6, 9, 30) });
		await openDatePicker();

		await userEvent.click(dayButton(new Date(2026, 10, 10)));

		expect(submitted()).toEqual([['expiry', '2026-11-06T09:30:00']]);

		await userEvent.click(screen.getByTestId('dp-apply'));

		expect(submitted()).toEqual([['expiry', '2026-11-10T09:30:00']]);
	});

	it('follows a clear', async () => {
		renderInForm({ defaultValue: NOV_6_2026, allowClear: true });

		await userEvent.click(screen.getByTestId('dp-clear'));

		expect(submitted()).toEqual([['expiry', '']]);
	});

	it('follows the value the parent gives', () => {
		const { rerender } = render(
			<form data-testid="form">
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="expiry"
					value={NOV_6_2026}
				/>
			</form>,
		);

		expect(submitted()).toEqual([['expiry', '2026-11-06']]);

		rerender(
			<form data-testid="form">
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="expiry"
					value={new Date(2027, 1, 3)}
				/>
			</form>,
		);

		expect(submitted()).toEqual([['expiry', '2027-02-03']]);
	});

	it('submits the wall clock in the selected zone', () => {
		const instant = at('kolkata', 2026, 11, 6, 9);
		const { unmount } = render(
			<form data-testid="form">
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="start"
					showTime
					showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'kolkata' }}
					defaultValue={instant}
				/>
			</form>,
		);

		expect(submitted()).toEqual([
			['start', '2026-11-06T09:00:00'],
			['start-timezone', 'kolkata'],
		]);
		unmount();

		render(
			<form data-testid="form">
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="start"
					showTime
					showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'utc' }}
					defaultValue={instant}
				/>
			</form>,
		);

		expect(submitted()).toEqual([
			['start', '2026-11-06T03:30:00'],
			['start-timezone', 'utc'],
		]);
	});

	it('renders one field named after the prop, whether the popup is open or not', async () => {
		renderInForm({ defaultValue: NOV_6_2026 });

		expect(document.querySelectorAll('[name="expiry"]')).toHaveLength(1);

		await openDatePicker();

		expect(document.querySelectorAll('[name="expiry"]')).toHaveLength(1);
	});

	it('keeps the field out of the tab order and hidden from assistive technology', () => {
		renderInForm({ defaultValue: NOV_6_2026 });

		expect(inputOf('expiry')).toHaveAttribute('tabindex', '-1');
		expect(inputOf('expiry')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.queryByRole('textbox')).toBeNull();
	});

	it('does not submit the form when the trigger is pressed', async () => {
		const onSubmit = vi.fn();
		renderInForm({}, { onSubmit });

		await userEvent.click(getTrigger());
		await screen.findByRole('dialog');
		await userEvent.keyboard('{Escape}');
		await expectClosed();
		await userEvent.keyboard('{Enter}');
		await screen.findByRole('dialog');

		expect(onSubmit).not.toHaveBeenCalled();
	});
});

describe('DatePicker form attribute', () => {
	it('submits with a form it is not rendered inside, through the form prop', () => {
		render(
			<>
				<form id="settings" data-testid="form" />
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="expiry"
					form="settings"
					defaultValue={NOV_6_2026}
				/>
			</>,
		);

		expect(inputOf('expiry')).toHaveAttribute('form', 'settings');
		expect(submitted()).toEqual([['expiry', '2026-11-06']]);
	});

	it('puts the form on the time zone field too', () => {
		render(
			<>
				<form id="settings" data-testid="form" />
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="start"
					form="settings"
					showTime
					showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'utc' }}
					defaultValue={at('utc', 2026, 11, 6, 9)}
				/>
			</>,
		);

		expect(inputOf('start-timezone')).toHaveAttribute('form', 'settings');
		expect(submitted()).toEqual([
			['start', '2026-11-06T09:00:00'],
			['start-timezone', 'utc'],
		]);
	});

	it('does not submit with a form that is not the one it names', () => {
		render(
			<>
				<form id="settings" data-testid="form" />
				<form id="other" data-testid="other" />
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="expiry"
					form="other"
					defaultValue={NOV_6_2026}
				/>
			</>,
		);

		expect(submitted()).toEqual([]);
	});
});

describe('DatePicker time zone field', () => {
	function renderZoned(props: Partial<ComponentProps<typeof ZonedDatePicker>> = {}) {
		return render(
			<form data-testid="form">
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="start"
					showTime
					showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'kolkata' }}
					defaultValue={at('kolkata', 2026, 11, 6, 9)}
					testId="dp"
					{...(props as object)}
				/>
			</form>,
		);
	}

	it('submits the zone as <name>-timezone, by its value and not its label', () => {
		renderZoned();

		expect(inputOf('start-timezone')).toHaveAttribute('type', 'hidden');
		expect(inputOf('start-timezone').value).toBe('kolkata');
	});

	it('submits an empty string while no zone is picked', () => {
		renderZoned({ showTimezone: { options: ZONE_OPTIONS }, defaultValue: undefined });

		expect(submitted()).toEqual([
			['start', ''],
			['start-timezone', ''],
		]);
	});

	it('follows the zone committed with Apply, and not the one in the draft', async () => {
		renderZoned();
		await openDatePicker();

		await pickZone('Pacific/Honolulu');

		expect(inputOf('start-timezone').value).toBe('kolkata');

		await userEvent.click(screen.getByTestId('dp-apply'));

		expect(submitted()).toEqual([
			['start', '2026-11-06T09:00:00'],
			['start-timezone', 'honolulu'],
		]);
	});

	it('follows a controlled zone', () => {
		const { rerender } = renderZoned({ showTimezone: { options: ZONE_OPTIONS, value: 'utc' } });

		expect(inputOf('start-timezone').value).toBe('utc');

		rerender(
			<form data-testid="form">
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="start"
					showTime
					showTimezone={{ options: ZONE_OPTIONS, value: 'honolulu' }}
					defaultValue={at('kolkata', 2026, 11, 6, 9)}
				/>
			</form>,
		);

		expect(inputOf('start-timezone').value).toBe('honolulu');
	});

	it('renders no zone field without showTimezone', () => {
		renderInForm({ showTime: true, defaultValue: new Date(2026, 10, 6, 9) });

		expect(document.querySelector('input[name="expiry-timezone"]')).toBeNull();
		expect(submitted()).toEqual([['expiry', '2026-11-06T09:00:00']]);
	});

	it('renders no zone field without a name', () => {
		renderZoned({ name: undefined });

		expect(document.querySelector('input[type="hidden"]')).toBeNull();
		expect(submitted()).toEqual([]);
	});

	it('leaves the zone out of a disabled date picker, and keeps it for a readOnly one', () => {
		const { unmount } = renderZoned({ disabled: true, disabledTooltip: 'No access' });

		expect(submitted()).toEqual([]);
		unmount();

		renderZoned({ readOnly: true, readOnlyTooltip: 'Locked' });

		expect(submitted()).toEqual([
			['start', '2026-11-06T09:00:00'],
			['start-timezone', 'kolkata'],
		]);
	});
});

describe('DatePicker required', () => {
	it('marks the trigger aria-required, and only while required', () => {
		const { rerender } = renderInForm({ required: true });

		expect(getTrigger()).toHaveAttribute('aria-required', 'true');

		rerender(
			<form data-testid="form">
				<DatePicker placeholder="Select date" aria-label="Expiry" name="expiry" />
			</form>,
		);

		expect(getTrigger()).not.toHaveAttribute('aria-required');
	});

	it('blocks the submit of an empty date picker and focuses the trigger', async () => {
		const onSubmit = vi.fn();
		renderInForm({ required: true }, { onSubmit });

		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).not.toHaveBeenCalled();
		expect(formOf().checkValidity()).toBe(false);
		expect(getTrigger()).toHaveFocus();
	});

	it('does not open the popup on the failed submit', async () => {
		renderInForm({ required: true });

		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('lets a date picker with a value submit', async () => {
		const onSubmit = vi.fn();
		renderInForm({ required: true, defaultValue: NOV_6_2026 }, { onSubmit });

		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(formOf().checkValidity()).toBe(true);
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('lets the form submit once a day is picked', async () => {
		const onSubmit = vi.fn();
		renderInForm({ required: true, defaultValue: undefined }, { onSubmit });

		await userEvent.click(screen.getByRole('button', { name: 'Save' }));
		expect(onSubmit).not.toHaveBeenCalled();

		await openDatePicker();
		await userEvent.click(dayButton(new Date(new Date().getFullYear(), new Date().getMonth(), 15)));
		await expectClosed();
		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('blocks the submit again after the value is cleared', async () => {
		const onSubmit = vi.fn();
		renderInForm({ required: true, defaultValue: NOV_6_2026, allowClear: true }, { onSubmit });

		await userEvent.click(screen.getByTestId('dp-clear'));
		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('does not block the submit of a date picker that is not required', async () => {
		const onSubmit = vi.fn();
		renderInForm({}, { onSubmit });

		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('does not validate a disabled date picker', async () => {
		const onSubmit = vi.fn();
		renderInForm({ required: true, disabled: true, disabledTooltip: 'No access' }, { onSubmit });

		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('sends the focus of the field to the trigger', () => {
		renderInForm({ required: true });

		inputOf('expiry').focus();

		expect(getTrigger()).toHaveFocus();
	});
});

describe('DatePicker disabled and readOnly in a form', () => {
	it('leaves a disabled date picker out of the submit', () => {
		renderInForm({ defaultValue: NOV_6_2026, disabled: true, disabledTooltip: 'No access' });

		expect(inputOf('expiry')).toBeDisabled();
		expect(submitted()).toEqual([]);
	});

	it('submits a readOnly date picker, since its value is real', () => {
		renderInForm({ defaultValue: NOV_6_2026, readOnly: true, readOnlyTooltip: 'Locked' });

		expect(inputOf('expiry')).not.toBeDisabled();
		expect(submitted()).toEqual([['expiry', '2026-11-06']]);
	});

	it('does not block the submit of an empty readOnly date picker that is required', async () => {
		const onSubmit = vi.fn();
		renderInForm({ required: true, readOnly: true, readOnlyTooltip: 'Locked' }, { onSubmit });

		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('submits a date picker that is both, since it is only readOnly', () => {
		renderInForm({
			defaultValue: NOV_6_2026,
			disabled: true,
			disabledTooltip: 'No access',
			readOnly: true,
			readOnlyTooltip: 'Locked',
		});

		expect(submitted()).toEqual([['expiry', '2026-11-06']]);
	});

	it('submits again once a disabled date picker is usable', () => {
		const { rerender } = renderInForm({
			defaultValue: NOV_6_2026,
			disabled: true,
			disabledTooltip: 'No access',
		});

		expect(submitted()).toEqual([]);

		rerender(
			<form data-testid="form">
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="expiry"
					defaultValue={NOV_6_2026}
					disabled={false}
					disabledTooltip={undefined}
				/>
			</form>,
		);

		expect(submitted()).toEqual([['expiry', '2026-11-06']]);
	});
});

describe('DatePicker form reset', () => {
	it('brings an uncontrolled date picker back to defaultValue', async () => {
		const onChange = vi.fn();
		renderInForm({ defaultValue: NOV_6_2026, onChange });
		await openDatePicker();
		await userEvent.click(dayButton(new Date(2026, 10, 10)));
		await expectClosed();

		expect(getTrigger()).toHaveTextContent('2026-11-10');

		await userEvent.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(getTrigger()).toHaveTextContent('2026-11-06');
		});
		expect(submitted()).toEqual([['expiry', '2026-11-06']]);
	});

	it('empties a date picker that has no defaultValue', async () => {
		renderInForm({ allowClear: false });
		await openDatePicker();
		await userEvent.click(dayButton(new Date(new Date().getFullYear(), new Date().getMonth(), 15)));
		await expectClosed();

		await userEvent.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(getTrigger()).toHaveTextContent('Select date');
		});
		expect(submitted()).toEqual([['expiry', '']]);
	});

	it('brings back a value that was cleared', async () => {
		renderInForm({ defaultValue: NOV_6_2026, allowClear: true });
		await userEvent.click(screen.getByTestId('dp-clear'));

		await userEvent.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(getTrigger()).toHaveTextContent('2026-11-06');
		});
	});

	it('brings the zone back to the defaultValue of showTimezone, with the value', async () => {
		render(
			<form data-testid="form">
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="start"
					showTime
					showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'kolkata' }}
					defaultValue={at('kolkata', 2026, 11, 6, 9)}
					testId="dp"
				/>
				<button type="reset">Reset</button>
			</form>,
		);
		await openDatePicker();
		await pickZone('UTC');
		await userEvent.click(screen.getByTestId('dp-apply'));
		await expectClosed();

		expect(getTrigger()).toHaveTextContent('2026-11-06 09:00:00 UTC');

		await userEvent.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(getTrigger()).toHaveTextContent('2026-11-06 09:00:00 Asia/Kolkata');
		});
		expect(submitted()).toEqual([
			['start', '2026-11-06T09:00:00'],
			['start-timezone', 'kolkata'],
		]);
	});

	it('keeps the value when the form cancels the reset', async () => {
		render(
			<form data-testid="form" onReset={(event) => event.preventDefault()}>
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="expiry"
					defaultValue={NOV_6_2026}
					testId="dp"
				/>
				<button type="reset">Reset</button>
			</form>,
		);
		await openDatePicker();
		await userEvent.click(dayButton(new Date(2026, 10, 10)));
		await expectClosed();

		await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
		// The reset is read after the event, on a timer.
		await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

		expect(getTrigger()).toHaveTextContent('2026-11-10');
		expect(submitted()).toEqual([['expiry', '2026-11-10']]);
	});

	it('drops the draft of an open popup, which then shows the reset value', async () => {
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="expiry"
					showTime
					defaultValue={new Date(2026, 10, 6, 9)}
					onChange={onChange}
					testId="dp"
				/>
			</form>,
		);
		await openDatePicker();
		await userEvent.click(dayButton(new Date(2026, 10, 10)));

		expect(dayButton(new Date(2026, 10, 10))).toHaveAttribute('data-selected-single');

		act(() => formOf().reset());

		await waitFor(() => {
			expect(dayButton(NOV_6_2026)).toHaveAttribute('data-selected-single');
		});
		expect(dayButton(new Date(2026, 10, 10))).not.toHaveAttribute('data-selected-single');

		await userEvent.click(within(getPopup()).getByTestId('dp-apply'));

		expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 10, 6, 9), { timezone: undefined });
	});

	it('leaves a controlled date picker to the parent', async () => {
		function Controlled() {
			const [value, setValue] = useState<Date | undefined>(NOV_6_2026);

			return (
				<form data-testid="form">
					<DatePicker
						placeholder="Select date"
						aria-label="Expiry"
						name="expiry"
						value={value}
						onChange={setValue}
						testId="dp"
					/>
					<button type="reset">Reset</button>
				</form>
			);
		}
		render(<Controlled />);
		await openDatePicker();
		await userEvent.click(dayButton(new Date(2026, 10, 10)));
		await expectClosed();

		await userEvent.click(screen.getByRole('button', { name: 'Reset' }));

		expect(getTrigger()).toHaveTextContent('2026-11-10');
		expect(submitted()).toEqual([['expiry', '2026-11-10']]);
	});

	it('listens to the form it names, and not only the one it sits in', async () => {
		render(
			<>
				<form id="settings" data-testid="form">
					<button type="reset">Reset</button>
				</form>
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					name="expiry"
					form="settings"
					defaultValue={NOV_6_2026}
					allowClear
					testId="dp"
				/>
			</>,
		);
		await userEvent.click(screen.getByTestId('dp-clear'));

		await userEvent.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(getTrigger()).toHaveTextContent('2026-11-06');
		});
	});
});
