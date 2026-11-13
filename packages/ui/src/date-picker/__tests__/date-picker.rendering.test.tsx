import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setTokens } from '../../__tests__/test-utils.js';
import { Dialog } from '../../dialog/index.js';
import { Popover } from '../../popover/index.js';
import { DATE_PICKER_EMPTY_LABEL, DatePicker } from '../index.js';
import {
	at,
	dayButton,
	expectClosed,
	getPopup,
	getTrigger,
	NOV_6_2026,
	openDatePicker,
	StampDatePicker,
	stamp,
	ZONE_OPTIONS,
	ZonedDatePicker,
} from './date-picker.test-utils.js';

const SIX_NOV_NINE_THIRTY = new Date(2026, 10, 6, 9, 30, 15);

function rootOf(): HTMLElement {
	return document.querySelector('[data-slot="date-picker"]') as HTMLElement;
}

describe('DatePicker rendering', () => {
	it('names the trigger with the placeholder when nothing else names it', () => {
		render(<DatePicker placeholder="Select date" />);

		expect(screen.getByRole('combobox', { name: 'Select date' })).toBeInTheDocument();
	});

	it('renders the root around the trigger and the trigger as a button', () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" />);
		const trigger = screen.getByTestId('dp');

		expect(rootOf()).toContainElement(trigger);
		expect(trigger).toBeInstanceOf(HTMLButtonElement);
		expect(trigger).toHaveAttribute('type', 'button');
		expect(trigger).toHaveAttribute('data-slot', 'date-picker-trigger');
	});

	it('shows the placeholder while there is no value', () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" />);
		const trigger = getTrigger();

		expect(trigger).toHaveTextContent('Select date');
		expect(trigger).toHaveAttribute('data-empty');
		expect(trigger.querySelector('[data-slot="date-picker-placeholder"]')).toHaveTextContent(
			'Select date',
		);
		expect(trigger.querySelector('[data-slot="date-picker-value"]')).toBeNull();
	});

	it('draws the calendar icon in the trigger, hidden from assistive technology', () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" />);
		const icon = getTrigger().querySelector('[data-slot="date-picker-icon"]');

		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute('aria-hidden', 'true');
	});

	it('shows the value as YYYY-MM-DD by default', () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={new Date(2026, 0, 5, 23, 59, 59)}
			/>,
		);
		const trigger = getTrigger();

		expect(trigger).toHaveTextContent('2026-01-05');
		expect(trigger).not.toHaveTextContent('23');
		expect(trigger).not.toHaveAttribute('data-empty');
		expect(trigger.querySelector('[data-slot="date-picker-value"]')).toHaveTextContent(
			'2026-01-05',
		);
		expect(trigger.querySelector('[data-slot="date-picker-placeholder"]')).toBeNull();
	});

	it('shows the value as YYYY-MM-DD HH:mm:ss by default with showTime', () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				defaultValue={new Date(2026, 0, 5, 3, 4, 5)}
			/>,
		);

		expect(getTrigger()).toHaveTextContent('2026-01-05 03:04:05');
	});

	it('shows a controlled value, and follows it when the parent changes it', () => {
		const { rerender } = render(
			<DatePicker placeholder="Select date" aria-label="Expiry" value={NOV_6_2026} />,
		);

		expect(getTrigger()).toHaveTextContent('2026-11-06');

		rerender(
			<DatePicker placeholder="Select date" aria-label="Expiry" value={new Date(2027, 1, 3)} />,
		);

		expect(getTrigger()).toHaveTextContent('2027-02-03');

		rerender(<DatePicker placeholder="Select date" aria-label="Expiry" value={undefined} />);

		expect(getTrigger()).toHaveTextContent('Select date');
	});

	it('follows the zone of the selected option in the default format', () => {
		render(
			<ZonedDatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'kolkata' }}
				defaultValue={at('kolkata', 2026, 11, 6, 9)}
			/>,
		);

		expect(getTrigger()).toHaveTextContent('2026-11-06 09:00:00 Asia/Kolkata');
	});

	it('shows the zone as it is when no option carries it', () => {
		render(
			<ZonedDatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				showTimezone={{ options: [{ value: 'kolkata', label: 'Asia/Kolkata' }], value: 'utc' }}
				defaultValue={at('utc', 2026, 11, 6, 9)}
			/>,
		);

		expect(getTrigger()).toHaveTextContent('2026-11-06 09:00:00 utc');
	});

	it('shows no zone label while no zone is selected', () => {
		render(
			<ZonedDatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				showTimezone={{ options: ZONE_OPTIONS }}
				defaultValue={new Date(2026, 10, 6, 9)}
			/>,
		);

		expect(getTrigger()).toHaveTextContent(/^2026-11-06 09:00:00$/);
	});

	describe('formatValue', () => {
		it('replaces the text of the trigger with what it returns', () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					formatValue={(value) => `Expires ${value.getDate()}/${value.getMonth() + 1}`}
				/>,
			);

			expect(getTrigger()).toHaveTextContent('Expires 6/11');
			expect(getTrigger()).not.toHaveTextContent('2026-11-06');
		});

		it('gets the value and the zone of the date picker', () => {
			const formatValue = vi.fn(() => 'formatted');
			const { rerender } = render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={SIX_NOV_NINE_THIRTY}
					formatValue={formatValue}
				/>,
			);

			expect(formatValue).toHaveBeenCalledWith(SIX_NOV_NINE_THIRTY, { timezone: undefined });

			const zoned = vi.fn(() => 'zoned');
			const instant = at('kolkata', 2026, 11, 6, 9);
			rerender(
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'kolkata' }}
					defaultValue={instant}
					formatValue={zoned}
				/>,
			);

			expect(zoned).toHaveBeenCalledWith(instant, { timezone: 'kolkata' });
		});

		it('is not called without a value', () => {
			const formatValue = vi.fn(() => 'formatted');
			render(
				<DatePicker placeholder="Select date" aria-label="Expiry" formatValue={formatValue} />,
			);

			expect(formatValue).not.toHaveBeenCalled();
			expect(getTrigger()).toHaveTextContent('Select date');
		});

		it('takes the date of the adapter the date picker was made with', () => {
			const formatValue = vi.fn((value: { readonly ms: number }) => `ms ${value.ms}`);
			const value = stamp(NOV_6_2026);
			render(
				<StampDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={value}
					formatValue={formatValue}
				/>,
			);

			expect(formatValue).toHaveBeenCalledWith(value, { timezone: undefined });
			expect(getTrigger()).toHaveTextContent(`ms ${NOV_6_2026.getTime()}`);
		});

		it('leaves out the zone label the default format would add', () => {
			render(
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'kolkata' }}
					defaultValue={at('kolkata', 2026, 11, 6, 9)}
					formatValue={() => 'custom'}
				/>,
			);

			expect(getTrigger()).toHaveTextContent(/^custom$/);
		});

		it('shows <No label> and marks the trigger when it returns an empty string', () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					formatValue={() => ''}
				/>,
			);
			const trigger = getTrigger();

			expect(DATE_PICKER_EMPTY_LABEL).toBe('<No label>');
			expect(trigger).toHaveTextContent('<No label>');
			expect(trigger).toHaveAttribute('data-empty-label');
			expect(trigger).not.toHaveAttribute('data-empty');
		});

		it('leaves data-empty-label off a trigger with a label', () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					formatValue={() => 'Nov 6'}
				/>,
			);

			expect(getTrigger()).not.toHaveAttribute('data-empty-label');
		});
	});

	describe('an invalid value', () => {
		it('shows the placeholder and warns once', () => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const { rerender } = render(
				<DatePicker placeholder="Select date" aria-label="Expiry" value={new Date(Number.NaN)} />,
			);
			const trigger = getTrigger();

			expect(trigger).toHaveTextContent('Select date');
			expect(trigger).toHaveAttribute('data-empty');
			expect(warn).toHaveBeenCalledTimes(1);
			expect(warn).toHaveBeenCalledWith(expect.stringContaining('invalid date'));

			rerender(
				<DatePicker placeholder="Select date" aria-label="Expiry" value={new Date(Number.NaN)} />,
			);

			expect(warn).toHaveBeenCalledTimes(1);
			warn.mockRestore();
		});

		it('treats a date the adapter reads as invalid the same way', () => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
			render(
				<StampDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={{ ms: Number.NaN }}
					formatValue={() => 'never called'}
				/>,
			);

			expect(getTrigger()).toHaveTextContent('Select date');
			expect(getTrigger()).not.toHaveTextContent('never called');
			expect(warn).toHaveBeenCalledTimes(1);
			warn.mockRestore();
		});

		it('submits an empty value and opens on today', async () => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
			render(
				<form data-testid="form">
					<DatePicker
						placeholder="Select date"
						aria-label="Expiry"
						name="expiry"
						value={new Date(Number.NaN)}
					/>
				</form>,
			);

			expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('expiry')).toBe('');

			await openDatePicker();

			expect(document.querySelector('[data-selected-single]')).toBeNull();
			expect(document.querySelector('[data-today]')).toHaveAttribute(
				'data-day',
				expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
			);
			warn.mockRestore();
		});

		it('does not warn for a missing value', () => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
			render(<DatePicker placeholder="Select date" aria-label="Expiry" value={undefined} />);

			expect(warn).not.toHaveBeenCalled();
			warn.mockRestore();
		});
	});

	it('forwards id, aria-* and data-* to the trigger', () => {
		render(
			<DatePicker
				placeholder="Select date"
				id="expiry"
				aria-label="Expiry"
				aria-describedby="hint"
				aria-invalid
				data-track="expiry-picker"
				testId="dp"
			/>,
		);
		const trigger = screen.getByTestId('dp');

		expect(trigger).toHaveAttribute('id', 'expiry');
		expect(trigger).toHaveAttribute('aria-describedby', 'hint');
		expect(trigger).toHaveAttribute('aria-invalid', 'true');
		expect(trigger).toHaveAttribute('data-track', 'expiry-picker');
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('keeps forwarded aria-* and data-* off the root', () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" data-track="expiry-picker" />);

		expect(rootOf()).not.toHaveAttribute('data-track');
		expect(rootOf()).not.toHaveAttribute('aria-label');
	});

	it('drops className and style that get past the types', () => {
		const props = { className: 'stray', style: { color: 'red' } } as object;
		render(<DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" {...props} />);

		expect(document.querySelector('.stray')).toBeNull();
		expect(screen.getByTestId('dp').style.color).toBe('');
		expect(rootOf().style.color).toBe('');
	});

	describe('size', () => {
		it('writes width and maxWidth as custom properties on the root', () => {
			render(
				<DatePicker placeholder="Select date" aria-label="Expiry" width={240} maxWidth="50%" />,
			);

			expect(rootOf().style.getPropertyValue('--date-picker-internal-width')).toBe('240px');
			expect(rootOf().style.getPropertyValue('--date-picker-internal-max-width')).toBe('50%');
		});

		it('writes a string width as it is', () => {
			render(<DatePicker placeholder="Select date" aria-label="Expiry" width="20rem" />);

			expect(rootOf().style.getPropertyValue('--date-picker-internal-width')).toBe('20rem');
		});

		it('writes no custom property without width and maxWidth', () => {
			render(<DatePicker placeholder="Select date" aria-label="Expiry" />);

			expect(rootOf().style.getPropertyValue('--date-picker-internal-width')).toBe('');
			expect(rootOf().style.getPropertyValue('--date-picker-internal-max-width')).toBe('');
		});

		it('fills its parent without width', () => {
			render(
				<div style={{ width: 400 }}>
					<DatePicker placeholder="Select date" aria-label="Expiry" />
				</div>,
			);

			expect(rootOf().getBoundingClientRect().width).toBe(400);
			expect(getTrigger().getBoundingClientRect().width).toBe(400);
		});

		it('is as wide as width says', () => {
			render(
				<div style={{ width: 400 }}>
					<DatePicker placeholder="Select date" aria-label="Expiry" width={240} />
				</div>,
			);

			expect(rootOf().getBoundingClientRect().width).toBe(240);
		});

		it('never grows past maxWidth', () => {
			render(
				<div style={{ width: 400 }}>
					<DatePicker placeholder="Select date" aria-label="Expiry" maxWidth={180} />
				</div>,
			);

			expect(rootOf().getBoundingClientRect().width).toBe(180);
		});

		it('never grows past its parent by default, even with a wider width', () => {
			render(
				<div style={{ width: 400 }}>
					<DatePicker placeholder="Select date" aria-label="Expiry" width={900} />
				</div>,
			);

			expect(rootOf().getBoundingClientRect().width).toBe(400);
		});

		it('is one line and 32px high', () => {
			render(
				<div style={{ width: 120 }}>
					<DatePicker
						placeholder="Select date"
						aria-label="Expiry"
						showTime
						defaultValue={SIX_NOV_NINE_THIRTY}
					/>
				</div>,
			);

			expect(getTrigger().getBoundingClientRect().height).toBe(32);
		});
	});

	describe('data attributes', () => {
		it('marks showTime and showTimezone on the trigger', () => {
			const { rerender } = render(<DatePicker placeholder="Select date" aria-label="Expiry" />);

			expect(getTrigger()).not.toHaveAttribute('data-show-time');
			expect(getTrigger()).not.toHaveAttribute('data-show-timezone');

			rerender(<DatePicker placeholder="Select date" aria-label="Expiry" showTime />);

			expect(getTrigger()).toHaveAttribute('data-show-time');
			expect(getTrigger()).not.toHaveAttribute('data-show-timezone');

			rerender(
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					showTimezone={{ options: ZONE_OPTIONS }}
				/>,
			);

			expect(getTrigger()).toHaveAttribute('data-show-time');
			expect(getTrigger()).toHaveAttribute('data-show-timezone');
		});

		it('marks the root and the trigger while the popup is open', async () => {
			render(<DatePicker placeholder="Select date" aria-label="Expiry" />);

			expect(rootOf()).not.toHaveAttribute('data-popup-open');
			expect(getTrigger()).not.toHaveAttribute('data-popup-open');

			await openDatePicker();

			expect(rootOf()).toHaveAttribute('data-popup-open');
			expect(getTrigger()).toHaveAttribute('data-popup-open');
			expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');

			await userEvent.keyboard('{Escape}');
			await expectClosed();

			expect(rootOf()).not.toHaveAttribute('data-popup-open');
			expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
		});

		it('marks data-empty only while there is no value', () => {
			const { rerender } = render(
				<DatePicker placeholder="Select date" aria-label="Expiry" value={undefined} />,
			);

			expect(getTrigger()).toHaveAttribute('data-empty');

			rerender(<DatePicker placeholder="Select date" aria-label="Expiry" value={NOV_6_2026} />);

			expect(getTrigger()).not.toHaveAttribute('data-empty');
		});

		it('marks the day buttons with the attributes of Calendar', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					minDate={new Date(2026, 10, 3)}
					testId="dp"
				/>,
			);
			await openDatePicker();

			expect(dayButton(NOV_6_2026)).toHaveAttribute('data-day', '2026-11-06');
			expect(dayButton(NOV_6_2026)).toHaveAttribute('data-selected-single');
			expect(dayButton(new Date(2026, 10, 2))).toHaveAttribute('data-disabled');
			expect(dayButton(new Date(2026, 10, 4))).not.toHaveAttribute('data-disabled');
		});
	});

	describe('slots', () => {
		it('names the parts of a closed date picker', () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					allowClear
				/>,
			);

			expect(document.querySelector('[data-slot="date-picker"]')).toBeInTheDocument();
			expect(document.querySelector('[data-slot="date-picker-trigger"]')).toBeInTheDocument();
			expect(document.querySelector('[data-slot="date-picker-value"]')).toBeInTheDocument();
			expect(document.querySelector('[data-slot="date-picker-icon"]')).toBeInTheDocument();
			expect(document.querySelector('[data-slot="date-picker-clear"]')).toBeInTheDocument();
			expect(document.querySelector('[data-slot="date-picker-popup"]')).toBeNull();
			expect(document.querySelector('[data-slot="date-picker-positioner"]')).toBeNull();
		});

		it('names the parts of an open popup without a time row', async () => {
			render(<DatePicker placeholder="Select date" aria-label="Expiry" />);
			const popup = await openDatePicker();

			expect(popup).toHaveAttribute('data-slot', 'date-picker-popup');
			expect(popup.closest('[data-slot="date-picker-positioner"]')).toBeInTheDocument();
			expect(popup.querySelector('[data-slot="date-picker-calendar"]')).toBeInTheDocument();
			expect(popup.querySelector('[data-slot="calendar"]')).toBeInTheDocument();
			expect(popup.querySelector('[data-slot="calendar-button"]')).toBeInTheDocument();
			expect(popup.querySelector('[data-slot="date-picker-footer"]')).toBeNull();
			expect(popup.querySelector('[data-slot="date-picker-time"]')).toBeNull();
			expect(popup.querySelector('[data-slot="date-picker-apply"]')).toBeNull();
			expect(popup.querySelector('[data-slot="date-picker-timezone"]')).toBeNull();
		});

		it('names the parts of an open popup with a time row', async () => {
			render(<DatePicker placeholder="Select date" aria-label="Expiry" showTime />);
			const popup = await openDatePicker();

			expect(popup.querySelector('[data-slot="date-picker-footer"]')).toBeInTheDocument();
			expect(popup.querySelector('[data-slot="date-picker-time"]')).toBeInTheDocument();
			expect(popup.querySelectorAll('[data-slot="date-picker-time-field"]')).toHaveLength(3);
			expect(popup.querySelector('[data-slot="date-picker-apply"]')).toBeInTheDocument();
			expect(popup.querySelector('[data-slot="date-picker-timezone"]')).toBeNull();
		});

		it('names the time zone field with showTimezone', async () => {
			render(
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					showTimezone={{ options: ZONE_OPTIONS }}
				/>,
			);
			const popup = await openDatePicker();

			expect(popup.querySelector('[data-slot="date-picker-timezone"]')).toBeInTheDocument();
		});

		it('leaves the clear button out without allowClear or without a value', () => {
			const { rerender } = render(
				<DatePicker placeholder="Select date" aria-label="Expiry" defaultValue={NOV_6_2026} />,
			);

			expect(document.querySelector('[data-slot="date-picker-clear"]')).toBeNull();

			rerender(
				<DatePicker placeholder="Select date" aria-label="Expiry" allowClear value={undefined} />,
			);

			expect(document.querySelector('[data-slot="date-picker-clear"]')).toBeNull();
		});
	});

	describe('testId', () => {
		it('names the trigger and every part of the popup from the one prop', async () => {
			render(
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					showTimezone={{ options: ZONE_OPTIONS }}
					defaultValue={at('utc', 2026, 11, 6, 9)}
					allowClear
					testId="start"
				/>,
			);

			expect(screen.getByTestId('start')).toBe(getTrigger());
			expect(screen.getByTestId('start-clear')).toHaveAttribute('data-slot', 'date-picker-clear');

			await openDatePicker();

			expect(screen.getByTestId('start-popup')).toBe(getPopup());
			expect(screen.getByTestId('start-calendar')).toHaveAttribute('data-slot', 'calendar');
			expect(screen.getByTestId('start-calendar-nav-previous')).toBeInTheDocument();
			expect(screen.getByTestId('start-calendar-nav-next')).toBeInTheDocument();
			expect(screen.getByTestId('start-calendar-button-06-11-2026')).toHaveAttribute(
				'data-day',
				'2026-11-06',
			);
			expect(screen.getByTestId('start-time-hours')).toHaveAccessibleName('Hours');
			expect(screen.getByTestId('start-time-minutes')).toHaveAccessibleName('Minutes');
			expect(screen.getByTestId('start-time-seconds')).toHaveAccessibleName('Seconds');
			expect(screen.getByTestId('start-timezone')).toHaveAccessibleName('Time zone');
			expect(screen.getByTestId('start-apply')).toHaveTextContent('Apply');
		});

		it('leaves every part unnamed without it', async () => {
			render(
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					showTimezone={{ options: ZONE_OPTIONS }}
					defaultValue={at('utc', 2026, 11, 6, 9)}
					allowClear
				/>,
			);
			const popup = await openDatePicker();
			const named = [
				...popup.querySelectorAll('[data-testid]'),
				...document.querySelectorAll('[data-slot="date-picker"] [data-testid]'),
			].filter((element) => element.tagName.toLowerCase() !== 'svg');

			expect(getTrigger()).not.toHaveAttribute('data-testid');
			expect(popup).not.toHaveAttribute('data-testid');
			expect(named.map((element) => element.getAttribute('data-testid'))).toEqual([]);
		});
	});

	describe('container', () => {
		it('portals the popup into the container it is given', async () => {
			const outside = document.createElement('div');
			document.body.append(outside);
			render(<DatePicker placeholder="Select date" aria-label="Expiry" container={outside} />);
			const popup = await openDatePicker();

			expect(outside.contains(popup)).toBe(true);
			outside.remove();
		});

		it('portals into the body by default', async () => {
			const { container } = render(<DatePicker placeholder="Select date" aria-label="Expiry" />);
			const popup = await openDatePicker();

			expect(container.contains(popup)).toBe(false);
			expect(document.body.contains(popup)).toBe(true);
		});

		it('opens the popup below the trigger, aligned to its start, and not over it', async () => {
			render(
				<div style={{ padding: 40, width: 360 }}>
					<DatePicker placeholder="Select date" aria-label="Expiry" />
				</div>,
			);
			const popup = await openDatePicker();
			const trigger = getTrigger().getBoundingClientRect();
			const box = popup.getBoundingClientRect();

			expect(box.top).toBeGreaterThanOrEqual(trigger.bottom);
			expect(Math.abs(box.left - trigger.left)).toBeLessThanOrEqual(1);
		});

		it('is as wide as one month of the calendar, whatever the width of the trigger', async () => {
			const { unmount } = render(
				<div style={{ width: 600 }}>
					<DatePicker placeholder="Select date" aria-label="Expiry" showTime />
				</div>,
			);
			const wide = (await openDatePicker()).getBoundingClientRect().width;

			unmount();
			render(
				<div style={{ width: 120 }}>
					<DatePicker placeholder="Select date" aria-label="Expiry" showTime />
				</div>,
			);
			const narrow = (await openDatePicker()).getBoundingClientRect().width;

			expect(narrow).toBe(wide);
			expect(wide).toBeLessThan(600);
		});
	});
});

describe('DatePicker clear button layout', () => {
	it('sits between the value and the icon, which stays at the end of the trigger', () => {
		setTokens('--spacing-4: 8px;');
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				allowClear
				defaultValue={NOV_6_2026}
				width={240}
				testId="dp"
			/>,
		);
		const trigger = screen.getByTestId('dp').getBoundingClientRect();
		const value = screen.getByText('2026-11-06').getBoundingClientRect();
		const icon = (
			document.querySelector('[data-slot="date-picker-icon"]') as HTMLElement
		).getBoundingClientRect();
		const clear = screen.getByTestId('dp-clear').getBoundingClientRect();

		// The icon keeps its place at the end, inside the end padding and the border.
		expect(trigger.right - icon.right).toBe(9);
		expect(clear.right).toBeLessThanOrEqual(icon.left);
		expect(clear.left).toBeGreaterThanOrEqual(value.right);
	});
});

describe('DatePicker inside a dialog', () => {
	function renderInDialog(onClose = vi.fn()) {
		render(
			<Dialog open onClose={onClose} title="Settings">
				<DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" />
			</Dialog>,
		);

		return onClose;
	}

	it('portals into the dialog panel and keeps the days pickable', async () => {
		renderInDialog();
		await userEvent.click(getTrigger());
		const popup = await screen.findByRole('dialog', { name: 'Choose date' });
		const panel = document.querySelector('[data-slot="dialog-popup"]') as HTMLElement;

		expect(panel.contains(popup)).toBe(true);

		await userEvent.click(within(popup).getByTestId('dp-calendar-button-10-11-2026'));

		expect(getTrigger()).toHaveTextContent('2026-11-10');
	});

	it('closes only the popup on Escape', async () => {
		const onClose = renderInDialog();
		await userEvent.click(getTrigger());
		await screen.findByRole('dialog', { name: 'Choose date' });

		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('dialog', { name: 'Choose date' })).toBeNull();
		});
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
	});

	// The focused day is removed with the popup. Unless the focus is already back on the trigger by
	// then, the dialog moves it to its panel a moment later.
	it.each([
		['Escape', () => userEvent.keyboard('{Escape}')],
		['a pick', () => userEvent.click(screen.getByTestId('dp-calendar-button-10-11-2026'))],
	])('gives the focus back to the trigger after %s', async (_, close) => {
		renderInDialog();
		await userEvent.click(getTrigger());
		await screen.findByRole('dialog', { name: 'Choose date' });
		await waitFor(() => {
			expect(screen.getByRole('dialog', { name: 'Choose date' })).toContainElement(
				document.activeElement as HTMLElement,
			);
		});

		await close();

		await waitFor(() => {
			expect(screen.queryByRole('dialog', { name: 'Choose date' })).toBeNull();
		});
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(getTrigger()).toHaveFocus();
	});
});

// The popup stays in the body. Base UI counts a nested popup as part of the popover, so a press in
// the calendar is not a press outside it and no `container` is needed.
describe('DatePicker inside a popover', () => {
	async function renderInPopover() {
		render(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				trigger={<button type="button">Schedule</button>}
				testId="popover"
			>
				<DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" />
			</Popover>,
		);
		await userEvent.click(screen.getByRole('button', { name: 'Schedule' }));
		await screen.findByTestId('popover-popup');
	}

	// The popover is a dialog too, so `expectClosed` would wait for it as well.
	async function expectPickerClosed() {
		await waitFor(() => {
			expect(screen.queryByRole('dialog', { name: 'Choose date' })).toBeNull();
		});
	}

	it('keeps the popover open on a pick with the mouse', async () => {
		await renderInPopover();
		await userEvent.click(getTrigger());

		await userEvent.click(await screen.findByTestId('dp-calendar-button-10-11-2026'));

		await expectPickerClosed();
		expect(getTrigger()).toHaveTextContent('2026-11-10');
		expect(screen.getByTestId('popover-popup')).toBeInTheDocument();
	});

	it('keeps the popover open on a pick with the keyboard', async () => {
		await renderInPopover();
		getTrigger().focus();
		await userEvent.keyboard('{Enter}');
		const popup = await screen.findByRole('dialog', { name: 'Choose date' });
		await waitFor(() => {
			expect(popup).toContainElement(document.activeElement as HTMLElement);
		});

		// From today, the 24th.
		await userEvent.keyboard('{ArrowRight}{Enter}');

		await expectPickerClosed();
		expect(getTrigger()).toHaveTextContent('2026-11-25');
		expect(screen.getByTestId('popover-popup')).toBeInTheDocument();
	});

	it('closes only the date picker popup on Escape', async () => {
		await renderInPopover();
		await userEvent.click(getTrigger());
		await screen.findByRole('dialog', { name: 'Choose date' });

		await userEvent.keyboard('{Escape}');

		await expectPickerClosed();
		expect(screen.getByTestId('popover-popup')).toBeInTheDocument();
		expect(getTrigger()).toHaveFocus();
	});

	it('closes both on a press outside the popover', async () => {
		await renderInPopover();
		await userEvent.click(getTrigger());
		await screen.findByRole('dialog', { name: 'Choose date' });

		await userEvent.click(document.body);

		await expectPickerClosed();
		await waitFor(() => {
			expect(screen.queryByTestId('popover-popup')).toBeNull();
		});
	});
});

// A modal from another library, such as antd's, has no panel to portal into. The popup goes to the
// body and has to stack above the layer its trigger sits in.
describe('DatePicker inside a layer from another library', () => {
	it('stacks the popup above the layer', async () => {
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" />
			</div>,
		);
		await openDatePicker();
		const day = dayButton(new Date(new Date().getFullYear(), new Date().getMonth(), 15));
		const { left, top, width, height } = day.getBoundingClientRect();

		expect(day.contains(document.elementFromPoint(left + width / 2, top + height / 2))).toBe(true);
	});
});
