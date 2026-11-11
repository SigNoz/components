import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent as pointer } from 'vitest/browser';
import { queryOpenTooltip, setTokens } from '../../__tests__/test-utils.js';
import { ForceOpenProvider } from '../../testing/index.js';
import { DatePicker } from '../index.js';
import {
	dayButton,
	expectClosed,
	getPopup,
	getTrigger,
	NOV_6_2026,
	openDatePicker,
	readTimeRow,
	ZONE_OPTIONS,
	ZonedDatePicker,
} from './date-picker.test-utils.js';

// `userEvent` of Testing Library only dispatches events, so it never sets `:hover`. These cases read
// the hover rules of the stylesheet, so they move the real pointer.
afterEach(async () => {
	await pointer.unhover(document.body);
});

const LONG_FORMAT =
	'Friday the sixth of November, two thousand and twenty six, at nine thirty in the morning';

function rootOf(): HTMLElement {
	return document.querySelector('[data-slot="date-picker"]') as HTMLElement;
}

describe('DatePicker disabled', () => {
	function renderDisabled(onChange = vi.fn()) {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				allowClear
				disabled
				disabledTooltip="You have no access"
				onChange={onChange}
				testId="dp"
			/>,
		);

		return onChange;
	}

	it('marks the trigger and the root, and never writes the native disabled', () => {
		renderDisabled();
		const trigger = getTrigger();

		expect(trigger).toHaveAttribute('aria-disabled', 'true');
		expect(trigger).toHaveAttribute('data-disabled');
		expect(trigger).not.toBeDisabled();
		expect(trigger).not.toHaveAttribute('disabled');
		expect(trigger).not.toHaveAttribute('aria-readonly');
		expect(trigger).not.toHaveAttribute('data-readonly');
		expect(rootOf()).toHaveAttribute('data-disabled');
	});

	it('stays focusable, and shows its value', async () => {
		renderDisabled();

		await userEvent.tab();

		expect(getTrigger()).toHaveFocus();
		expect(getTrigger()).toHaveTextContent('2026-11-06');
	});

	it('does not open on a click or on a key, and leaves the focus where it is', async () => {
		const onChange = renderDisabled();
		const trigger = getTrigger();

		await userEvent.click(trigger);
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');
		await userEvent.keyboard('{ArrowDown}');

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('does not clear on Delete or Backspace, and renders no clear button', async () => {
		const onChange = renderDisabled();

		getTrigger().focus();
		await userEvent.keyboard('{Delete}{Backspace}');

		expect(onChange).not.toHaveBeenCalled();
		expect(getTrigger()).toHaveTextContent('2026-11-06');
		expect(screen.queryByTestId('dp-clear')).toBeNull();
		expect(document.querySelector('[data-slot="date-picker-clear"]')).toBeNull();
	});

	it('lets Tab through, since the keys on the trigger do nothing else', async () => {
		render(
			<>
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					disabled
					disabledTooltip="No access"
				/>
				<button type="button">After</button>
			</>,
		);
		getTrigger().focus();

		await userEvent.tab();

		expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
	});

	it('leaves the keys it has no use for to the browser, such as reload and find', () => {
		renderDisabled();
		const trigger = getTrigger();

		trigger.focus();

		expect(fireEvent.keyDown(trigger, { key: 'F5' })).toBe(true);
		expect(fireEvent.keyDown(trigger, { key: 'f', ctrlKey: true })).toBe(true);
		expect(fireEvent.keyDown(trigger, { key: 'ArrowLeft', altKey: true })).toBe(true);
	});

	it('shows the reason on hover', async () => {
		renderDisabled();

		await userEvent.hover(getTrigger());

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('You have no access');
		});
	});

	it('shows the reason on keyboard focus', async () => {
		renderDisabled();

		await userEvent.tab();

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('You have no access');
		});
	});

	it.each([
		['null', null],
		['an empty string', ''],
		['undefined', undefined],
	])('shows no tooltip when the reason is %s', async (_name, disabledTooltip) => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				disabled
				disabledTooltip={disabledTooltip}
			/>,
		);

		await userEvent.hover(getTrigger());

		expect(queryOpenTooltip()).toBeNull();
	});

	it('fades the trigger and shows the not-allowed cursor', () => {
		renderDisabled();
		const style = getComputedStyle(getTrigger());

		expect(style.opacity).toBe('0.6');
		expect(style.cursor).toBe('not-allowed');
	});

	it('leaves the border where it was on hover', async () => {
		setTokens(
			'--date-picker-trigger-border: rgb(10, 10, 10); --date-picker-trigger-border-hover: rgb(200, 200, 200);',
		);
		renderDisabled();

		await pointer.hover(getTrigger());
		await new Promise((resolve) => setTimeout(resolve, 250));

		expect(getTrigger().matches(':hover')).toBe(true);
		expect(getComputedStyle(getTrigger()).borderTopColor).toBe('rgb(10, 10, 10)');
	});
});

describe('DatePicker readOnly', () => {
	function renderReadOnly(onChange = vi.fn()) {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				allowClear
				readOnly
				readOnlyTooltip="Managed by your admin"
				onChange={onChange}
				testId="dp"
			/>,
		);

		return onChange;
	}

	it('marks the trigger and the root, and never writes the native disabled', () => {
		renderReadOnly();
		const trigger = getTrigger();

		expect(trigger).toHaveAttribute('aria-readonly', 'true');
		expect(trigger).toHaveAttribute('data-readonly');
		expect(trigger).not.toBeDisabled();
		expect(trigger).not.toHaveAttribute('aria-disabled');
		expect(trigger).not.toHaveAttribute('data-disabled');
		expect(rootOf()).toHaveAttribute('data-readonly');
		expect(rootOf()).not.toHaveAttribute('data-disabled');
	});

	it('stays focusable, and keeps the value readable', async () => {
		renderReadOnly();

		await userEvent.tab();

		expect(getTrigger()).toHaveFocus();
		expect(getTrigger()).toHaveTextContent('2026-11-06');
	});

	it('does not open on a click or on a key', async () => {
		const onChange = renderReadOnly();
		const trigger = getTrigger();

		await userEvent.click(trigger);
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');
		await userEvent.keyboard('{ArrowDown}');

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('does not clear on Delete or Backspace, and renders no clear button', async () => {
		const onChange = renderReadOnly();

		getTrigger().focus();
		await userEvent.keyboard('{Delete}{Backspace}');

		expect(onChange).not.toHaveBeenCalled();
		expect(getTrigger()).toHaveTextContent('2026-11-06');
		expect(screen.queryByTestId('dp-clear')).toBeNull();
	});

	it('shows the reason on hover and on keyboard focus', async () => {
		renderReadOnly();

		await userEvent.hover(getTrigger());

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Managed by your admin');
		});
	});

	it('shows the reason on keyboard focus', async () => {
		renderReadOnly();

		await userEvent.tab();

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Managed by your admin');
		});
	});

	it('shows no tooltip when the reason is undefined', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				readOnly
				readOnlyTooltip={undefined}
			/>,
		);

		await userEvent.hover(getTrigger());

		expect(queryOpenTooltip()).toBeNull();
	});

	it('fades less than disabled, shows the not-allowed cursor and hides the calendar icon', () => {
		renderReadOnly();
		const style = getComputedStyle(getTrigger());
		const icon = getTrigger().querySelector('[data-slot="date-picker-icon"]') as HTMLElement;

		expect(style.opacity).toBe('0.8');
		expect(style.cursor).toBe('not-allowed');
		expect(getComputedStyle(icon).visibility).toBe('hidden');
	});

	it('keeps the icon of a date picker that can be used', () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" />);
		const icon = getTrigger().querySelector('[data-slot="date-picker-icon"]') as HTMLElement;

		expect(getComputedStyle(icon).visibility).toBe('visible');
	});

	it('leaves the border where it was on hover', async () => {
		setTokens(
			'--date-picker-trigger-border: rgb(10, 10, 10); --date-picker-trigger-border-hover: rgb(200, 200, 200);',
		);
		renderReadOnly();

		await pointer.hover(getTrigger());
		await new Promise((resolve) => setTimeout(resolve, 250));

		expect(getTrigger().matches(':hover')).toBe(true);
		expect(getComputedStyle(getTrigger()).borderTopColor).toBe('rgb(10, 10, 10)');
	});
});

describe('DatePicker disabled and readOnly together', () => {
	function renderBoth() {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				allowClear
				disabled
				disabledTooltip="You have no access"
				readOnly
				readOnlyTooltip="Managed by your admin"
				testId="dp"
			/>,
		);
	}

	it('is only readOnly', () => {
		renderBoth();
		const trigger = getTrigger();

		expect(trigger).toHaveAttribute('aria-readonly', 'true');
		expect(trigger).toHaveAttribute('data-readonly');
		expect(trigger).not.toHaveAttribute('aria-disabled');
		expect(trigger).not.toHaveAttribute('data-disabled');
		expect(rootOf()).not.toHaveAttribute('data-disabled');
		expect(getComputedStyle(trigger).opacity).toBe('0.8');
	});

	it('shows only the readOnly reason', async () => {
		renderBoth();

		await userEvent.hover(getTrigger());

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Managed by your admin');
		});
		expect(queryOpenTooltip()).not.toHaveTextContent('You have no access');
	});

	it('stays closed, and keeps the keys inert', async () => {
		renderBoth();
		getTrigger().focus();

		await userEvent.keyboard('{Enter}{ArrowDown}{Delete}');

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(getTrigger()).toHaveTextContent('2026-11-06');
		expect(screen.queryByTestId('dp-clear')).toBeNull();
	});
});

describe('DatePicker turning inert', () => {
	function renderWith(props: { disabled?: boolean; readOnly?: boolean }): ReactElement {
		return (
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				defaultValue={new Date(2026, 10, 6, 9, 30)}
				{...(props.disabled === undefined
					? {}
					: { disabled: props.disabled, disabledTooltip: 'You have no access' })}
				{...(props.readOnly === undefined
					? {}
					: { readOnly: props.readOnly, readOnlyTooltip: 'Managed by your admin' })}
				testId="dp"
			/>
		);
	}

	it.each([
		['disabled', (on: boolean) => ({ disabled: on })],
		['readOnly', (on: boolean) => ({ readOnly: on })],
	])(
		'closes an open popup when it turns %s, and does not reopen it when it turns back',
		async (_name, props) => {
			const { rerender } = render(renderWith(props(false)));
			await openDatePicker();

			rerender(renderWith(props(true)));

			await expectClosed();
			expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');

			rerender(renderWith(props(false)));

			expect(screen.queryByRole('dialog')).toBeNull();
			expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
		},
	);

	it.each([
		['disabled', (on: boolean) => ({ disabled: on })],
		['readOnly', (on: boolean) => ({ readOnly: on })],
	])('drops the draft when it turns %s', async (_name, props) => {
		const onChange = vi.fn();
		const { rerender } = render(renderWith(props(false)));
		await openDatePicker();
		await userEvent.click(dayButton(new Date(2026, 10, 12)));

		rerender(renderWith(props(true)));
		await expectClosed();
		rerender(renderWith(props(false)));
		await openDatePicker();

		expect(onChange).not.toHaveBeenCalled();
		expect(dayButton(NOV_6_2026)).toHaveAttribute('data-selected-single');
		expect(dayButton(new Date(2026, 10, 12))).not.toHaveAttribute('data-selected-single');
		expect(readTimeRow()).toBe('09:30:00');
	});

	it('keeps the trigger and its focus while it toggles', () => {
		const { rerender } = render(renderWith({ disabled: false }));
		const trigger = getTrigger();

		trigger.focus();
		rerender(renderWith({ disabled: true }));

		expect(getTrigger()).toBe(trigger);
		expect(trigger).toHaveFocus();

		rerender(renderWith({ disabled: false }));

		expect(getTrigger()).toBe(trigger);
		expect(trigger).toHaveFocus();
	});

	it('opens again with the keys once it is usable again', async () => {
		const { rerender } = render(renderWith({ disabled: true }));
		getTrigger().focus();

		await userEvent.keyboard('{Enter}');
		expect(screen.queryByRole('dialog')).toBeNull();

		rerender(renderWith({ disabled: false }));
		await userEvent.keyboard('{Enter}');

		await screen.findByRole('dialog');
	});

	it('shows the clear button again once it is usable again', () => {
		const { rerender } = render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				allowClear
				readOnly
				readOnlyTooltip="Locked"
				testId="dp"
			/>,
		);

		expect(screen.queryByTestId('dp-clear')).toBeNull();

		rerender(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				allowClear
				readOnly={false}
				readOnlyTooltip={undefined}
				testId="dp"
			/>,
		);

		expect(screen.getByTestId('dp-clear')).toBeInTheDocument();
	});
});

describe('DatePicker under ForceOpenProvider', () => {
	it('holds the popup open, not the list of the time zone field inside it', async () => {
		render(
			<ZonedDatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'utc' }}
				testId="dp"
			/>,
			{ wrapper: ForceOpenProvider },
		);
		await screen.findByRole('dialog', { name: 'Choose date and time' });

		expect(screen.getByRole('combobox', { name: 'Time zone' })).not.toHaveAttribute(
			'data-popup-open',
		);
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('keeps the popup on screen whatever the user does', async () => {
		const onChange = vi.fn();
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				onChange={onChange}
				testId="dp"
			/>,
			{ wrapper: ForceOpenProvider },
		);
		await screen.findByRole('dialog', { name: 'Choose date' });

		await userEvent.click(dayButton(new Date(2026, 10, 10)));
		await userEvent.keyboard('{Escape}');

		expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 10), { timezone: undefined });
		expect(getPopup()).toBeInTheDocument();
		expect(getTrigger()).toHaveAttribute('data-popup-open');
	});

	it('keeps a showTime popup on screen after Apply', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				defaultValue={new Date(2026, 10, 6, 9)}
				testId="dp"
			/>,
			{ wrapper: ForceOpenProvider },
		);
		await screen.findByRole('dialog', { name: 'Choose date and time' });

		await userEvent.click(screen.getByTestId('dp-apply'));

		expect(getPopup()).toBeInTheDocument();
	});

	it('leaves a disabled or read-only date picker closed', () => {
		render(
			<>
				<DatePicker
					placeholder="Select date"
					aria-label="Disabled"
					disabled
					disabledTooltip="No access"
				/>
				<DatePicker
					placeholder="Select date"
					aria-label="Read-only"
					readOnly
					readOnlyTooltip="Locked"
				/>
			</>,
			{ wrapper: ForceOpenProvider },
		);

		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('closes the popup when it turns inert, and holds it open again when it turns back', async () => {
		function renderWith(disabled: boolean): ReactElement {
			return (
				<ForceOpenProvider>
					<DatePicker
						placeholder="Select date"
						aria-label="Expiry"
						disabled={disabled}
						disabledTooltip="No access"
					/>
				</ForceOpenProvider>
			);
		}
		const { rerender } = render(renderWith(false));
		await screen.findByRole('dialog');

		rerender(renderWith(true));

		await expectClosed();

		rerender(renderWith(false));

		await screen.findByRole('dialog');
	});

	it('opens several date pickers side by side', async () => {
		render(
			<>
				<DatePicker placeholder="Select date" aria-label="Start" testId="start" />
				<DatePicker placeholder="Select date" aria-label="End" testId="end" />
			</>,
			{ wrapper: ForceOpenProvider },
		);

		await waitFor(() => {
			expect(screen.getAllByRole('dialog')).toHaveLength(2);
		});
	});
});

describe('DatePicker trigger tooltip', () => {
	it('shows the full value of a trigger that does not fit', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				formatValue={() => LONG_FORMAT}
				width={160}
			/>,
		);
		const trigger = getTrigger();

		// The value is measured after the first paint, and the tooltip mounts with it. A pointer that
		// was already over the trigger by then would never have entered it.
		await waitFor(() => {
			expect(trigger.querySelector('[data-slot="date-picker-value"]')).toHaveAttribute(
				'data-truncated',
				'true',
			);
		});
		await userEvent.hover(trigger);

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent(LONG_FORMAT);
		});
	});

	it('leaves a value that fits unmarked and opens no tooltip', async () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" defaultValue={NOV_6_2026} />);
		const trigger = getTrigger();

		await userEvent.hover(trigger);

		expect(trigger.querySelector('[data-slot="date-picker-value"]')).not.toHaveAttribute(
			'data-truncated',
		);
		expect(queryOpenTooltip()).toBeNull();
	});

	it('truncates the placeholder the same way and shows it in full', async () => {
		render(
			<DatePicker
				placeholder="Pick the day this key stops working, in the time zone of the cluster"
				aria-label="Expiry"
				width={160}
			/>,
		);
		const trigger = getTrigger();

		await waitFor(() => {
			expect(trigger.querySelector('[data-slot="date-picker-placeholder"]')).toHaveAttribute(
				'data-truncated',
				'true',
			);
		});
		await userEvent.hover(trigger);

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Pick the day this key stops working');
		});
	});

	it('stacks the reason above the full value', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				formatValue={() => LONG_FORMAT}
				readOnly
				readOnlyTooltip="Managed by your admin"
				width={160}
			/>,
		);
		const trigger = getTrigger();

		await waitFor(() => {
			expect(trigger.querySelector('[data-slot="date-picker-value"]')).toHaveAttribute(
				'data-truncated',
				'true',
			);
		});
		await userEvent.hover(trigger);

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent(LONG_FORMAT);
		});
		const text = queryOpenTooltip()?.textContent ?? '';

		expect(text.indexOf('Managed by your admin')).toBeGreaterThanOrEqual(0);
		expect(text.indexOf('Managed by your admin')).toBeLessThan(text.indexOf(LONG_FORMAT));
	});

	it('shows a one-line trigger, cut at the end with an ellipsis', () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				formatValue={() => LONG_FORMAT}
				width={160}
			/>,
		);
		const value = getTrigger().querySelector('[data-slot="date-picker-value"]') as HTMLElement;
		const style = getComputedStyle(value);

		expect(style.whiteSpace).toBe('nowrap');
		expect(style.textOverflow).toBe('ellipsis');
		expect(getTrigger().getBoundingClientRect().height).toBe(32);
		expect(getTrigger().getBoundingClientRect().width).toBe(160);
	});
});

describe('DatePicker invalid and open', () => {
	it('paints the border of an invalid trigger in the destructive colour, hovered or not', async () => {
		setTokens(
			'--date-picker-trigger-border: rgb(10, 10, 10); --date-picker-trigger-border-hover: rgb(200, 200, 200); --destructive: rgb(255, 0, 0);',
		);
		render(<DatePicker placeholder="Select date" aria-label="Expiry" aria-invalid />);

		expect(getComputedStyle(getTrigger()).borderTopColor).toBe('rgb(255, 0, 0)');

		await pointer.hover(getTrigger());
		await new Promise((resolve) => setTimeout(resolve, 250));

		expect(getTrigger().matches(':hover')).toBe(true);
		expect(getComputedStyle(getTrigger()).borderTopColor).toBe('rgb(255, 0, 0)');
	});

	it('changes the border on hover, and keeps it while the popup is open', async () => {
		setTokens(
			'--date-picker-trigger-border: rgb(10, 10, 10); --date-picker-trigger-border-hover: rgb(200, 200, 200);',
		);
		render(<DatePicker placeholder="Select date" aria-label="Expiry" />);

		expect(getComputedStyle(getTrigger()).borderTopColor).toBe('rgb(10, 10, 10)');

		await pointer.hover(getTrigger());

		await waitFor(() => {
			expect(getComputedStyle(getTrigger()).borderTopColor).toBe('rgb(200, 200, 200)');
		});

		await userEvent.click(getTrigger());
		await screen.findByRole('dialog');
		await pointer.unhover(document.body);

		expect(getTrigger().matches(':hover')).toBe(false);
		await new Promise((resolve) => setTimeout(resolve, 250));
		expect(getComputedStyle(getTrigger()).borderTopColor).toBe('rgb(200, 200, 200)');
	});
});
