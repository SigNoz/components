import type { Popover as BasePopover } from '@base-ui/react/popover';
import type { AriaAttributes, CSSProperties, ReactElement, ReactNode, RefAttributes } from 'react';
import type { DatePickerTimeUnit } from './constants.js';

type OriginalPortalProps = BasePopover.Portal.Props;

/**
 * @access private
 */
export type DatePickerTimeUnitType = (typeof DatePickerTimeUnit)[keyof typeof DatePickerTimeUnit];

/**
 * Where a date picker meets the app's date type. `createDatePicker` takes one and returns a date
 * picker whose dates are `TDate`.
 *
 * The date picker works on `Date` inside, the way `Calendar` does. A `Date` that crosses the
 * adapter holds a wall clock in its local fields (year, month, day, hours, minutes, seconds), read
 * in the browser's zone.
 *
 * @example
 * ```ts
 * import dayjs, { type Dayjs } from 'dayjs';
 *
 * const dayjsAdapter: DateAdapter<Dayjs, true> = {
 *   supportsTimezone: true,
 *   toDate: (value, timezone) => {
 *     const v = timezone ? value.tz(timezone) : value;
 *     // `new Date(year, ...)` reads a year from 0 to 99 as 1900 to 1999.
 *     const date = new Date(0);
 *     date.setFullYear(v.year(), v.month(), v.date());
 *     date.setHours(v.hour(), v.minute(), v.second(), 0);
 *     return date;
 *   },
 *   fromDate: (date, timezone) => {
 *     if (!timezone) {
 *       return dayjs(date);
 *     }
 *     return dayjs.tz(dayjs(date).format('YYYY-MM-DDTHH:mm:ss'), timezone);
 *   },
 * };
 * ```
 */
export type DateAdapter<TDate, TTimezone extends boolean = false> = {
	/**
	 * Returns the wall clock of `value` in `timezone`, as a `Date` whose local fields hold it.
	 * `undefined` is the browser's zone.
	 *
	 * @note Runs for `value`, `defaultValue`, `minDate`, `maxDate` and today. A `Date` that is not
	 * valid makes the value count as no value.
	 */
	toDate: (value: TDate, timezone: string | undefined) => Date;
	/**
	 * Returns the instant of the wall clock held in the local fields of `date`, in `timezone`.
	 *
	 * @note Runs for `onChange`, for each drawn day passed to `disabledDate`, and for today.
	 */
	fromDate: (date: Date, timezone: string | undefined) => TDate;
} & (TTimezone extends true
	? {
			/**
			 * Declares that `toDate` and `fromDate` read `timezone`. A date picker accepts
			 * `showTimezone` only with it.
			 */
			supportsTimezone: true;
		}
	: { supportsTimezone?: never });

/**
 * The second argument of `onChange` and `formatValue`.
 */
export type DatePickerChangeDetailsType = {
	/**
	 * The zone picked in the popup with `showTimezone`, `undefined` without it.
	 */
	timezone: string | undefined;
};

/**
 * One zone the time zone field offers.
 */
export type DatePickerTimezoneOptionType = {
	/**
	 * Handed to the adapter and back to `onChange`. The date picker never parses it.
	 */
	value: string;
	/**
	 * What the field and its list show. Also what typing filters on.
	 */
	label: string;
};

/**
 * The time zone field of the popup.
 */
export type DatePickerTimezoneType = {
	/**
	 * The zones the field offers, in the order they are listed.
	 */
	options: ReadonlyArray<DatePickerTimezoneOptionType>;
	/**
	 * The selected zone. Writing it makes the zone controlled, even with `undefined`.
	 */
	value?: string;
	/**
	 * The zone selected on the first render, for a zone the date picker keeps itself.
	 */
	defaultValue?: string;
};

type DatePickerWrittenAria =
	| 'aria-haspopup'
	| 'aria-expanded'
	| 'aria-controls'
	| 'aria-readonly'
	| 'aria-disabled'
	| 'aria-required';

type DatePickerBaseProps<TDate> = Omit<AriaAttributes, DatePickerWrittenAria> & {
	[K in DatePickerWrittenAria]?: never;
} & {
	/**
	 * Lands on the trigger, so a `<label htmlFor>` names it.
	 */
	id?: string;
	/**
	 * The selected date. Without `showTime` it is the start of the picked day.
	 *
	 * @note Writing the prop makes the component controlled, even with `undefined`. Leave it out
	 * entirely for an uncontrolled date picker.
	 *
	 * @note A value outside `minDate` and `maxDate`, or on a day `disabledDate` disables, is shown
	 * as it is. The date picker never calls `onChange` to correct it.
	 */
	value?: TDate;
	/**
	 * The date selected on the first render, for a date picker that keeps its own state. A form
	 * reset brings it back.
	 */
	defaultValue?: TDate;
	/**
	 * Called with the new date when a day is picked, when `Apply` is pressed with `showTime`, and
	 * with `undefined` when the value is cleared.
	 *
	 * @note `details.timezone` is the zone picked with `showTimezone`, and the date is the instant
	 * of the picked day and time in that zone.
	 */
	onChange?: (value: TDate | undefined, details: DatePickerChangeDetailsType) => void;
	/**
	 * The text the trigger shows while there is no value. Also the trigger's accessible name when
	 * no `aria-label`, `aria-labelledby` or `<label for>` names it.
	 */
	placeholder: string;
	/**
	 * Formats the value for the trigger and for its accessible value.
	 *
	 * @note Without it the trigger shows `YYYY-MM-DD`, or `YYYY-MM-DD HH:mm:ss` with `showTime`,
	 * followed by the label of the selected zone with `showTimezone`.
	 *
	 * @note An empty string shows `<No label>`, and the trigger carries `data-empty-label`.
	 */
	formatValue?: (value: TDate, details: DatePickerChangeDetailsType) => string;
	/**
	 * The first day that can be picked, included. The days before it are disabled, and the month
	 * arrows stop at its month.
	 *
	 * @note Compares calendar days in the selected zone, so any time of the day allows the whole day.
	 */
	minDate?: TDate;
	/**
	 * The last day that can be picked, included. The days after it are disabled, and the month
	 * arrows stop at its month.
	 */
	maxDate?: TDate;
	/**
	 * Disables single days inside `minDate` and `maxDate`, eg: weekends or holidays.
	 *
	 * @note Called with the start of each day the calendar draws, in the selected zone, and only
	 * for the days inside the limits. Keep it cheap and pure: it runs for every drawn day on every
	 * render. It never moves the month arrows.
	 */
	disabledDate?: (date: TDate) => boolean;
	/**
	 * Shows a clear button in the trigger while there is a value. `Delete` and `Backspace` on the
	 * trigger clear it too.
	 *
	 * @default false
	 */
	allowClear?: boolean;
	/**
	 * Identifies the field when the owning form is submitted. It submits `YYYY-MM-DD`, or
	 * `YYYY-MM-DDTHH:mm:ss` with `showTime`, and an empty string without a value.
	 *
	 * @note With `showTimezone`, a second field named `<name>-timezone` submits the zone.
	 */
	name?: string;
	/**
	 * The id of the owning form, for a date picker rendered outside the `<form>` element.
	 */
	form?: string;
	/**
	 * When true, an empty date picker fails the form's validation, and the trigger carries
	 * `aria-required`.
	 *
	 * @default false
	 */
	required?: boolean;
	/**
	 * When true, the popup does not open, and the trigger carries `aria-disabled` and
	 * `data-disabled`. The date picker is left out of the form submit.
	 *
	 * @note Requires `disabledTooltip`.
	 *
	 * @note `readOnly` outranks it: with both, the date picker is only read-only.
	 *
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Why the date picker cannot be used. Shown in a tooltip on the trigger, and only while
	 * `disabled` is true and `readOnly` is not.
	 *
	 * @note Only allowed alongside `disabled`. Pass `undefined` explicitly when there is no reason
	 * to give.
	 */
	disabledTooltip?: ReactNode;
	/**
	 * When true, the popup does not open and the value cannot change. The trigger carries
	 * `aria-readonly` and `data-readonly`, keeps its colours, fades a little and hides its icon.
	 * The date picker is still submitted.
	 *
	 * @note Requires `readOnlyTooltip`.
	 *
	 * @default false
	 */
	readOnly?: boolean;
	/**
	 * Why the date picker cannot be changed. Shown in a tooltip on the trigger, and only while
	 * `readOnly` is true.
	 *
	 * @note Only allowed alongside `readOnly`. Pass `undefined` explicitly when there is no reason
	 * to give.
	 */
	readOnlyTooltip?: ReactNode;
	/**
	 * The element the popup is portalled into. The time zone list of `showTimezone` opens there
	 * too.
	 *
	 * @note Inside a `Dialog` or `Drawer` the default is an element in its panel, where the focus
	 * trap of the modal lets the keyboard reach the calendar.
	 *
	 * @default document.body
	 */
	container?: OriginalPortalProps['container'];
	/**
	 * The width of the date picker. Written as the `--date-picker-internal-width` custom property.
	 * Numbers are written as `px`.
	 *
	 * @default '100%'
	 */
	width?: CSSProperties['width'];
	/**
	 * The max-width of the date picker. Written as the `--date-picker-internal-max-width` custom
	 * property. Numbers are written as `px`.
	 *
	 * @default '100%'
	 */
	maxWidth?: CSSProperties['maxWidth'];
	/**
	 * Forwarded to the trigger as `data-testid`, and the stem every part is named from.
	 */
	testId?: string;
	/**
	 * Any `data-*` prop is accepted and forwarded to the trigger, alongside `aria-*`.
	 */
	[key: `data-${string}`]: unknown;
};

type DatePickerWithoutTimezoneProps = {
	/**
	 * Adds a time row under the calendar and an `Apply` button that commits the day and the time
	 * together.
	 *
	 * @default false
	 */
	showTime?: boolean;
	showTimezone?: never;
};

type DatePickerWithTimezoneProps = {
	showTime: true;
	/**
	 * Adds a time zone field under the time row. The picked zone comes back in `onChange` as
	 * `details.timezone`, and the adapter does the time zone math.
	 *
	 * @note Only with `showTime`, and only on a date picker made with an adapter that declares
	 * `supportsTimezone`.
	 *
	 * @note Changing the zone keeps the wall clock of the draft: `09:00` stays `09:00`, and `Apply`
	 * commits 09:00 in the new zone.
	 */
	showTimezone: DatePickerTimezoneType;
};

/**
 * The props of a date picker whose dates are `TDate`. `DatePicker` takes
 * `DatePickerProps<Date>`. `TTimezone` is true for a date picker made with an adapter that
 * declares `supportsTimezone`, which is what lets it take `showTimezone`.
 */
export type DatePickerProps<
	TDate = Date,
	TTimezone extends boolean = false,
> = DatePickerBaseProps<TDate> &
	(TTimezone extends true
		? DatePickerWithoutTimezoneProps | DatePickerWithTimezoneProps
		: DatePickerWithoutTimezoneProps);

interface ADisabledDatePickerMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface ADisabledReasonNeedsADisabledDatePicker {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

interface AReadOnlyDatePickerMustSayWhy {
	'`readOnly` needs `readOnlyTooltip`, a read-only control has to tell the user why it cannot be changed': never;
}

interface AReadOnlyReasonNeedsAReadOnlyDatePicker {
	'`readOnlyTooltip` only renders while `readOnly` is set, add `readOnly` or drop the tooltip': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which lands on the trigger and names every part': never;
}

/**
 * Extra constraints layered on top of {@link DatePickerProps} at the call site.
 *
 * Resolves to `unknown` while the props are valid, and to a rule object when they are not. The
 * pairing rules look at which props the call site writes, not at their values:
 * `disabledTooltip={undefined}` is the explicit opt-out.
 */
export type ValidateDatePickerProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledDatePickerMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledDatePicker
		: unknown) &
	(T extends { readOnly: boolean | undefined }
		? T extends { readOnlyTooltip: ReactNode }
			? unknown
			: AReadOnlyDatePickerMustSayWhy
		: unknown) &
	(T extends { readOnlyTooltip: ReactNode }
		? T extends { readOnly: boolean | undefined }
			? unknown
			: AReadOnlyReasonNeedsAReadOnlyDatePicker
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

/**
 * A date picker whose dates are `TDate`, as `createDatePicker` returns it. The ref lands on the
 * trigger.
 */
export type DatePickerComponentType<TDate, TTimezone extends boolean = false> = <
	T extends DatePickerProps<TDate, TTimezone>,
>(
	props: T &
		ValidateDatePickerProps<T> &
		// `T` is inferred from the call site, so `T extends DatePickerProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<
			Exclude<
				keyof T,
				keyof DatePickerProps<TDate, TTimezone> | keyof RefAttributes<HTMLButtonElement>
			>,
			never
		> &
		RefAttributes<HTMLButtonElement>,
) => ReactElement;

/**
 * The props the one implementation behind every date picker takes: the public props on `unknown`
 * dates, and the adapter the date picker was made with.
 *
 * @access private
 */
export type DatePickerImplProps = DatePickerProps<unknown, true> & {
	adapter: DateAdapter<unknown, boolean>;
};

/**
 * The time of day the time row edits, in 24-hour form.
 *
 * @access private
 */
export type DatePickerTimeType = Record<DatePickerTimeUnitType, number>;

/**
 * What the popup edits with `showTime` until `Apply` commits it.
 *
 * @access private
 */
export type DatePickerDraftType = {
	/**
	 * The picked day, at the start of the day, as a wall clock.
	 */
	day: Date | undefined;
	time: DatePickerTimeType;
	timezone: string | undefined;
};
