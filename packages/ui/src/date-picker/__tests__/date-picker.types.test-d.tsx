/**
 * Type-level tests for the props of {@link DatePicker} and of a date picker made with
 * `createDatePicker`. Run by `vitest --typecheck` and by `pnpm type-check`. See
 * `dropdown.types.test-d.tsx` for how the cases are written.
 */
import { createRef } from 'react';
import { assertType, describe, expectTypeOf, test } from 'vitest';
import {
	createDatePicker,
	DatePicker,
	type DateAdapter,
	type DatePickerChangeDetailsType,
	type DatePickerProps,
	type DatePickerTimezoneType,
} from '../index.js';

const ref = createRef<HTMLButtonElement>();
const wrongRef = createRef<HTMLDivElement>();

declare const maybeDisabled: boolean | undefined;
declare const maybeReadOnly: boolean | undefined;

class Instant {
	constructor(readonly epoch: number) {}
}

type Epoch = number & { readonly __epoch: unique symbol };

const instantAdapter: DateAdapter<Instant, true> = {
	supportsTimezone: true,
	toDate: (value) => new Date(value.epoch),
	fromDate: (date) => new Instant(date.getTime()),
};
const InstantPicker = createDatePicker(instantAdapter);

const epochAdapter: DateAdapter<Epoch> = {
	toDate: (value) => new Date(value),
	fromDate: (date) => date.getTime() as Epoch,
};
const EpochPicker = createDatePicker(epochAdapter);

const ZONES: DatePickerTimezoneType['options'] = [{ value: 'utc', label: 'UTC' }];

describe('root props', () => {
	test('accepts a placeholder, plus a ref', () => {
		assertType(<DatePicker placeholder="Select date" ref={ref} />);
	});

	test('accepts the props of a form field', () => {
		assertType(
			<DatePicker
				placeholder="Select date"
				id="expiry"
				value={new Date()}
				defaultValue={new Date()}
				onChange={(value, details) => {
					expectTypeOf(value).toEqualTypeOf<Date | undefined>();
					expectTypeOf(details).toEqualTypeOf<DatePickerChangeDetailsType>();
				}}
				showTime
				formatValue={(value, details) => {
					expectTypeOf(value).toEqualTypeOf<Date>();
					expectTypeOf(details.timezone).toEqualTypeOf<string | undefined>();

					return value.toISOString();
				}}
				minDate={new Date()}
				maxDate={new Date()}
				disabledDate={(date) => {
					expectTypeOf(date).toEqualTypeOf<Date>();

					return date.getDay() === 0;
				}}
				allowClear
				name="expiry"
				form="settings"
				required
				container={document.body}
				width={240}
				maxWidth="100%"
				testId="expiry"
			/>,
		);
	});

	test('rejects a date picker with no placeholder', () => {
		assertType(
			// @ts-expect-error - the trigger has to show something while nothing is selected
			<DatePicker aria-label="Expiry" />,
		);
	});

	test('rejects a ref that is not the trigger', () => {
		assertType(
			// @ts-expect-error - the ref lands on the trigger, a button
			<DatePicker placeholder="Select date" ref={wrongRef} />,
		);
	});

	test('rejects className and style, the size comes from width and maxWidth', () => {
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - `className` is not a prop
				className="x"
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - `style` is not a prop
				style={{}}
			/>,
		);
	});

	test('rejects a raw data-testid', () => {
		assertType(
			// @ts-expect-error - the prop is called `testId`
			<DatePicker placeholder="Select date" data-testid="x" />,
		);
	});

	test('accepts any other data-* prop', () => {
		assertType(<DatePicker placeholder="Select date" data-track="expiry" data-flag />);
	});

	test('rejects a prop it does not have', () => {
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - `colour` is not a prop
				colour="red"
			/>,
		);
	});

	test('rejects the props of the antd DatePicker it replaces', () => {
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - `format` is replaced by `formatValue`
				format="YYYY-MM-DD"
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - `timeZone` is replaced by `showTimezone`
				timeZone="UTC"
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - the date picker owns its open state, there is no `open`
				open
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - a story or a test holds it open with `ForceOpenProvider`
				defaultOpen
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - the date picker owns its open state, there is no `onOpenChange`
				onOpenChange={() => undefined}
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - the date picker picks one day, there is no `picker`
				picker="week"
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - the date picker picks one day, there is no `multiple`
				multiple
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - the trigger has one height
				size="large"
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - a field that failed validation passes `aria-invalid`
				status="error"
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - `getPopupContainer` is replaced by `container`
				getPopupContainer={() => document.body}
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - the popup takes no class
				popupClassName="x"
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - the popup has no Now shortcut
				showNow={false}
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - `showTime` always confirms with Apply
				needConfirm
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - no call site limits the time of day
				disabledTime={() => ({})}
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - the popup opens below the trigger
				placement="topLeft"
			/>,
		);
		assertType(
			<DatePicker
				placeholder="Select date"
				// @ts-expect-error - the trigger takes no typed text
				inputReadOnly
			/>,
		);
	});

	test('accepts width and maxWidth as a number or a string', () => {
		assertType(<DatePicker placeholder="Select date" width={240} maxWidth="100%" />);
		assertType(<DatePicker placeholder="Select date" width="20rem" maxWidth={400} />);
	});

	test('accepts a container as an element, a ref or null', () => {
		assertType(<DatePicker placeholder="Select date" container={document.body} />);
		assertType(<DatePicker placeholder="Select date" container={{ current: null }} />);
		assertType(<DatePicker placeholder="Select date" container={null} />);
	});
});

describe('value', () => {
	test('takes a Date, and reports a Date or undefined', () => {
		assertType(
			<DatePicker
				placeholder="Select date"
				value={new Date()}
				onChange={(value: Date | undefined) => value}
			/>,
		);
	});

	test('takes undefined, which is a controlled date picker with nothing in it', () => {
		assertType(<DatePicker placeholder="Select date" value={undefined} />);
	});

	test('rejects a value that is not a Date', () => {
		assertType(
			// @ts-expect-error - `value` holds a native `Date` with the built-in adapter
			<DatePicker placeholder="Select date" value="2026-11-06" />,
		);
		assertType(
			// @ts-expect-error - `defaultValue` holds a native `Date` with the built-in adapter
			<DatePicker placeholder="Select date" defaultValue={1_793_000_000_000} />,
		);
	});

	test('rejects a limit that is not a Date', () => {
		assertType(
			// @ts-expect-error - `minDate` is a `Date` too
			<DatePicker placeholder="Select date" minDate="2026-11-06" />,
		);
		assertType(
			// @ts-expect-error - `maxDate` is a `Date` too
			<DatePicker placeholder="Select date" maxDate={20} />,
		);
	});

	test('rejects null, which is not how a value is cleared', () => {
		assertType(
			// @ts-expect-error - no value is `undefined`
			<DatePicker placeholder="Select date" value={null} />,
		);
	});

	test('rejects an onChange that takes the other shape', () => {
		assertType(
			// @ts-expect-error - the handler is called with `undefined` when the value is cleared
			<DatePicker placeholder="Select date" onChange={(value: Date) => value} />,
		);
		assertType(
			// @ts-expect-error - the handler gets a `Date`, not a string
			<DatePicker placeholder="Select date" onChange={(value: string | undefined) => value} />,
		);
	});

	test('rejects a formatValue and a disabledDate that take the wrong type', () => {
		assertType(
			// @ts-expect-error - the formatter gets a `Date`
			<DatePicker placeholder="Select date" formatValue={(value: string) => value} />,
		);
		assertType(
			// @ts-expect-error - the predicate gets a `Date`
			<DatePicker placeholder="Select date" disabledDate={(date: string) => date === ''} />,
		);
	});

	test('rejects a formatValue that does not return text', () => {
		assertType(
			// @ts-expect-error - the trigger shows a string
			<DatePicker placeholder="Select date" formatValue={() => 1} />,
		);
	});
});

describe('disabled and readOnly', () => {
	test('rejects a disabled date picker with no reason', () => {
		assertType(
			// @ts-expect-error - a disabled date picker has to tell the user why
			<DatePicker placeholder="Select date" disabled />,
		);
	});

	test('rejects a disabled reason with no disabled', () => {
		assertType(
			// @ts-expect-error - `disabledTooltip` only renders while `disabled` is set
			<DatePicker placeholder="Select date" disabledTooltip="Why" />,
		);
	});

	test('rejects a readOnly date picker with no reason', () => {
		assertType(
			// @ts-expect-error - a read-only date picker has to tell the user why
			<DatePicker placeholder="Select date" readOnly />,
		);
	});

	test('rejects a readOnly reason with no readOnly', () => {
		assertType(
			// @ts-expect-error - `readOnlyTooltip` only renders while `readOnly` is set
			<DatePicker placeholder="Select date" readOnlyTooltip="Why" />,
		);
	});

	test('accepts each with its reason, or with an explicit undefined', () => {
		assertType(<DatePicker placeholder="Select date" disabled disabledTooltip="No access" />);
		assertType(<DatePicker placeholder="Select date" readOnly readOnlyTooltip={undefined} />);
		assertType(
			<DatePicker
				placeholder="Select date"
				disabled={maybeDisabled}
				disabledTooltip={undefined}
				readOnly={maybeReadOnly}
				readOnlyTooltip="Managed by your admin"
			/>,
		);
	});

	test('accepts both at once, each with its reason', () => {
		assertType(
			<DatePicker
				placeholder="Select date"
				disabled
				disabledTooltip="No access"
				readOnly
				readOnlyTooltip="Managed by your admin"
			/>,
		);
	});
});

describe('aria props', () => {
	test('accepts the ones that pass through', () => {
		assertType(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				aria-labelledby="expiry-label"
				aria-describedby="expiry-error"
				aria-invalid
			/>,
		);
	});

	test('rejects the ones the date picker writes itself', () => {
		assertType(
			// @ts-expect-error - `aria-haspopup` is `dialog`, written by the trigger
			<DatePicker placeholder="Select date" aria-haspopup="menu" />,
		);
		assertType(
			// @ts-expect-error - `aria-expanded` follows the popup
			<DatePicker placeholder="Select date" aria-expanded />,
		);
		assertType(
			// @ts-expect-error - `aria-controls` names the popup
			<DatePicker placeholder="Select date" aria-controls="popup" />,
		);
		assertType(
			// @ts-expect-error - use `readOnly`
			<DatePicker placeholder="Select date" aria-readonly />,
		);
		assertType(
			// @ts-expect-error - use `disabled`
			<DatePicker placeholder="Select date" aria-disabled />,
		);
		assertType(
			// @ts-expect-error - use `required`
			<DatePicker placeholder="Select date" aria-required />,
		);
	});
});

describe('showTimezone', () => {
	test('is rejected by the built-in date picker, whose adapter does no zone math', () => {
		assertType(
			<DatePicker
				placeholder="Select date"
				showTime
				// @ts-expect-error - the built-in `Date` adapter cannot honor a zone
				showTimezone={{ options: ZONES }}
			/>,
		);
	});

	test('is accepted by a date picker made with an adapter that supports zones', () => {
		assertType(
			<InstantPicker
				placeholder="Select date"
				showTime
				showTimezone={{ options: ZONES, value: 'utc', defaultValue: 'utc' }}
			/>,
		);
		assertType(<InstantPicker placeholder="Select date" showTime showTimezone={{ options: [] }} />);
	});

	test('reports the picked zone next to the date', () => {
		assertType(
			<InstantPicker
				placeholder="Select date"
				showTime
				showTimezone={{ options: ZONES }}
				onChange={(value, details) => {
					expectTypeOf(value).toEqualTypeOf<Instant | undefined>();
					expectTypeOf(details.timezone).toEqualTypeOf<string | undefined>();
				}}
			/>,
		);
	});

	test('needs showTime', () => {
		assertType(
			// @ts-expect-error - without the time row a pick closes the popup at once
			<InstantPicker placeholder="Select date" showTimezone={{ options: ZONES }} />,
		);
		assertType(
			// @ts-expect-error - `showTime` has to be true to give the zone a step to be picked in
			<InstantPicker
				placeholder="Select date"
				showTime={false}
				showTimezone={{ options: ZONES }}
			/>,
		);
	});

	test('needs its options', () => {
		assertType(
			// @ts-expect-error - the zone field lists `options`
			<InstantPicker placeholder="Select date" showTime showTimezone={{ value: 'utc' }} />,
		);
	});

	test('takes options that carry a value and a label', () => {
		assertType(
			<InstantPicker
				placeholder="Select date"
				showTime
				// @ts-expect-error - every zone has a label
				showTimezone={{ options: [{ value: 'utc' }] }}
			/>,
		);
		assertType(
			<InstantPicker
				placeholder="Select date"
				showTime
				// @ts-expect-error - a zone is a string the adapter reads
				showTimezone={{ options: [{ value: 0, label: 'UTC' }] }}
			/>,
		);
	});

	test('is rejected by a date picker whose adapter does not declare supportsTimezone', () => {
		assertType(
			<EpochPicker
				placeholder="Select date"
				showTime
				// @ts-expect-error - this adapter declares no `supportsTimezone`
				showTimezone={{ options: ZONES }}
			/>,
		);
	});

	test('accepts showTime on its own on a date picker that supports zones', () => {
		assertType(<InstantPicker placeholder="Select date" showTime />);
		assertType(<InstantPicker placeholder="Select date" />);
	});
});

describe('createDatePicker', () => {
	test('takes the dates of the adapter', () => {
		assertType(
			<InstantPicker
				placeholder="Select date"
				value={new Instant(0)}
				defaultValue={new Instant(0)}
				minDate={new Instant(0)}
				maxDate={new Instant(1)}
				onChange={(value) => expectTypeOf(value).toEqualTypeOf<Instant | undefined>()}
				formatValue={(value) => {
					expectTypeOf(value).toEqualTypeOf<Instant>();

					return String(value.epoch);
				}}
				disabledDate={(date) => {
					expectTypeOf(date).toEqualTypeOf<Instant>();

					return date.epoch < 0;
				}}
			/>,
		);
	});

	test('rejects a native Date where the adapter holds a wrapper', () => {
		assertType(
			// @ts-expect-error - this date picker holds an `Instant`
			<InstantPicker placeholder="Select date" value={new Date()} />,
		);
		assertType(
			// @ts-expect-error - the limits are `Instant`s too
			<InstantPicker placeholder="Select date" minDate={new Date()} />,
		);
		assertType(
			// @ts-expect-error - the handler gets an `Instant`, not a `Date`
			<InstantPicker placeholder="Select date" onChange={(value: Date | undefined) => value} />,
		);
		assertType(
			<InstantPicker
				placeholder="Select date"
				// @ts-expect-error - the predicate gets an `Instant`, not a `Date`
				disabledDate={(date: Date) => date.getDay() === 0}
			/>,
		);
	});

	test('rejects a wrapper where the built-in date picker holds a Date', () => {
		assertType(
			// @ts-expect-error - the built-in date picker holds a `Date`
			<DatePicker placeholder="Select date" value={new Instant(0)} />,
		);
	});

	test('follows a branded type the same way', () => {
		assertType(
			<EpochPicker
				placeholder="Select date"
				value={0 as Epoch}
				onChange={(value) => expectTypeOf(value).toEqualTypeOf<Epoch | undefined>()}
			/>,
		);
		assertType(
			// @ts-expect-error - a bare number is not an `Epoch`
			<EpochPicker placeholder="Select date" value={0} />,
		);
		assertType(
			// @ts-expect-error - a `Date` is not an `Epoch`
			<EpochPicker placeholder="Select date" value={new Date()} />,
		);
	});

	test('keeps the other props of the built-in date picker', () => {
		assertType(
			// @ts-expect-error - `className` is not a prop of a made date picker either
			<InstantPicker placeholder="Select date" className="x" />,
		);
		assertType(
			// @ts-expect-error - a disabled date picker has to tell the user why
			<InstantPicker placeholder="Select date" disabled />,
		);
		assertType(
			// @ts-expect-error - the prop is called `testId`
			<InstantPicker placeholder="Select date" data-testid="x" />,
		);
		assertType(<InstantPicker placeholder="Select date" ref={ref} testId="x" />);
	});

	test('takes an adapter with or without supportsTimezone', () => {
		assertType(
			createDatePicker({
				supportsTimezone: true,
				toDate: (value: Date) => value,
				fromDate: (date: Date) => date,
			}),
		);
		assertType(
			createDatePicker({ toDate: (value: Date) => value, fromDate: (date: Date) => date }),
		);
	});

	test('rejects an adapter that is missing a side', () => {
		assertType(
			// @ts-expect-error - the adapter needs `fromDate`
			createDatePicker({ toDate: (value: Date) => value }),
		);
		assertType(
			// @ts-expect-error - the adapter needs `toDate`
			createDatePicker({ fromDate: (date: Date) => date }),
		);
	});

	test('rejects an adapter that does not hand back a Date', () => {
		assertType(
			createDatePicker({
				// @ts-expect-error - `toDate` hands the date picker a native `Date`
				toDate: (value: Instant) => value.epoch,
				fromDate: (date: Date) => new Instant(date.getTime()),
			}),
		);
	});

	test('rejects supportsTimezone set to false', () => {
		assertType(
			createDatePicker({
				// @ts-expect-error - `supportsTimezone` is `true` or left out
				supportsTimezone: false,
				toDate: (value: Date) => value,
				fromDate: (date: Date) => date,
			}),
		);
	});
});

describe('exported types', () => {
	test('DatePickerProps takes the date type and whether zones are supported', () => {
		expectTypeOf<DatePickerProps['value']>().toEqualTypeOf<Date | undefined>();
		expectTypeOf<DatePickerProps<Instant>['value']>().toEqualTypeOf<Instant | undefined>();
		expectTypeOf<DatePickerProps<Instant, true>['value']>().toEqualTypeOf<Instant | undefined>();
		expectTypeOf<DatePickerProps['showTimezone']>().toEqualTypeOf<undefined>();
	});

	test('DateAdapter reads and writes a Date', () => {
		expectTypeOf<DateAdapter<Instant>['toDate']>().toEqualTypeOf<
			(value: Instant, timezone: string | undefined) => Date
		>();
		expectTypeOf<DateAdapter<Instant>['fromDate']>().toEqualTypeOf<
			(date: Date, timezone: string | undefined) => Instant
		>();
		expectTypeOf<DateAdapter<Instant, true>['supportsTimezone']>().toEqualTypeOf<true>();
	});
});
