/**
 * Where a component meets the app's date type. `createCalendar` takes one and returns a calendar
 * whose dates are `TDate`.
 *
 * A component works on `Date` inside. A `Date` that crosses the adapter holds a wall clock in its
 * local fields (year, month, day, hours, minutes, seconds), read in the browser's zone.
 *
 * @example
 * ```ts
 * import dayjs, { type Dayjs } from 'dayjs';
 *
 * const dayjsAdapter: DateAdapter<Dayjs, true> = {
 *   supportsTimezone: true,
 *   toDate: (value, timezone) => {
 *     const v = timezone ? value.tz(timezone) : value;
 *     return new Date(v.year(), v.month(), v.date(), v.hour(), v.minute(), v.second());
 *   },
 *   fromDate: (date, timezone) => {
 *     const wallClock = dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
 *     return timezone ? dayjs.tz(wallClock, timezone) : dayjs(wallClock);
 *   },
 * };
 * ```
 */
export type DateAdapter<TDate, TTimezone extends boolean = false> = {
	/**
	 * Returns the wall clock of `value` in `timezone`, as a `Date` whose local fields hold it.
	 * `undefined` is the browser's zone.
	 *
	 * @note Runs for every date a component receives as a prop. A `Date` that is not valid makes
	 * the value count as no value.
	 */
	toDate: (value: TDate, timezone: string | undefined) => Date;
	/**
	 * Returns the instant of the wall clock held in the local fields of `date`, in `timezone`.
	 *
	 * @note Runs for every date a component reports or hands to a callback.
	 */
	fromDate: (date: Date, timezone: string | undefined) => TDate;
} & (TTimezone extends true
	? {
			/**
			 * Declares that `toDate` and `fromDate` read `timezone`. A component accepts a time zone
			 * prop only with it.
			 */
			supportsTimezone: true;
		}
	: { supportsTimezone?: never });

/**
 * The adapter for a plain `Date`, which already is a wall clock in its local fields.
 *
 * @access private
 */
export const nativeDateAdapter: DateAdapter<Date> = {
	toDate: (value) => value,
	fromDate: (date) => date,
};
