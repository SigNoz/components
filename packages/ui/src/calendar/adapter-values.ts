import type { DateAdapter } from '../lib/date-adapter.js';
import type { SelectionState } from './selection.js';
import type { DateRange, Matcher } from './types.js';

/**
 * The two functions of an adapter, which are all the calendar reads: it never asks whether the
 * adapter knows time zones, since it always passes `undefined`.
 */
export type DateAdapterFns<TDate> = Pick<DateAdapter<TDate, boolean>, 'toDate' | 'fromDate'>;

/**
 * A `Date` the calendar can work on, or `undefined` for a missing one and for one that is not
 * valid.
 */
export function toDay<TDate>(
	adapter: DateAdapterFns<TDate>,
	value: TDate | null | undefined,
): Date | undefined {
	if (value === undefined || value === null) {
		return undefined;
	}

	const date = adapter.toDate(value, undefined);

	return Number.isNaN(date.getTime()) ? undefined : date;
}

function toDays<TDate>(adapter: DateAdapterFns<TDate>, values: TDate[]): Date[] {
	return values.flatMap((value) => toDay(adapter, value) ?? []);
}

function toRange<TDate>(adapter: DateAdapterFns<TDate>, range: DateRange<TDate>): DateRange {
	return { from: toDay(adapter, range.from), to: toDay(adapter, range.to) };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const prototype: unknown = Object.getPrototypeOf(value);

	return prototype === Object.prototype || prototype === null;
}

/**
 * One matcher with every date in it turned into a `Date`, and a matcher function that gets a
 * `TDate` turned into one that gets a `Date`.
 *
 * A matcher is told apart from a date by its shape, since a `TDate` can be anything: a plain
 * object with `from`, `before`, `after` or `dayOfWeek` is a matcher, a function is a matcher, an
 * array is a list of dates, and what is left is a date.
 */
function toMatcher<TDate>(adapter: DateAdapterFns<TDate>, matcher: Matcher<TDate>): Matcher {
	if (typeof matcher === 'boolean') {
		return matcher;
	}

	if (typeof matcher === 'function') {
		const test = matcher as (date: TDate) => boolean;

		return (date) => test(adapter.fromDate(date, undefined));
	}

	if (Array.isArray(matcher)) {
		return toDays(adapter, matcher as TDate[]);
	}

	if (isPlainObject(matcher)) {
		if ('from' in matcher) {
			return toRange(adapter, matcher as DateRange<TDate>);
		}

		if ('dayOfWeek' in matcher) {
			return matcher as { dayOfWeek: number | number[] };
		}

		if ('before' in matcher || 'after' in matcher) {
			const bounds = matcher as { before?: TDate; after?: TDate };
			const before = toDay(adapter, bounds.before);
			const after = toDay(adapter, bounds.after);

			if (('before' in bounds && !before) || ('after' in bounds && !after)) {
				return false;
			}

			return { ...(before && { before }), ...(after && { after }) } as Matcher;
		}

		// Half a range, which has no `from` to start from, matches nothing.
		if ('to' in matcher) {
			return false;
		}
	}

	return toDay(adapter, matcher as TDate) ?? false;
}

/**
 * The matchers of a prop, in the `Date` form the calendar matches against, or `undefined` for none.
 */
export function toMatchers<TDate>(
	adapter: DateAdapterFns<TDate>,
	matchers: Matcher<TDate> | Matcher<TDate>[] | undefined,
): Matcher[] | undefined {
	if (matchers === undefined) {
		return undefined;
	}

	return (Array.isArray(matchers) ? (matchers as Matcher<TDate>[]) : [matchers]).map((matcher) =>
		toMatcher(adapter, matcher),
	);
}

/**
 * The selection the calendar was given, as `Date`s.
 */
export function toSelection<TDate>(
	adapter: DateAdapterFns<TDate>,
	mode: SelectionState['mode'],
	selected: TDate | TDate[] | DateRange<TDate> | undefined,
): SelectionState {
	switch (mode) {
		case 'single':
			return { mode, selected: toDay(adapter, selected as TDate | undefined) };
		case 'multiple':
			return {
				mode,
				selected: selected === undefined ? undefined : toDays(adapter, selected as TDate[]),
			};
		case 'range':
			return {
				mode,
				selected:
					selected === undefined ? undefined : toRange(adapter, selected as DateRange<TDate>),
			};
	}
}

/**
 * The value a selection holds, as `TDate`s, for `onSelect`.
 */
export function fromSelection<TDate>(
	adapter: DateAdapterFns<TDate>,
	state: SelectionState,
): TDate | TDate[] | DateRange<TDate> | undefined {
	const convert = (date: Date): TDate => adapter.fromDate(date, undefined);

	switch (state.mode) {
		case 'single':
			return state.selected && convert(state.selected);
		case 'multiple':
			return state.selected?.map(convert);
		case 'range':
			return (
				state.selected && {
					from: state.selected.from && convert(state.selected.from),
					to: state.selected.to && convert(state.selected.to),
				}
			);
	}
}
