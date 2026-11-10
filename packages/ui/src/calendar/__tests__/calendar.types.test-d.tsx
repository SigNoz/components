/**
 * Type-level tests for the props of {@link Calendar} and for what {@link createCalendar} returns.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it either
 * compiles, or it is marked `@ts-expect-error` because we refuse that prop. TypeScript reports an
 * unused `@ts-expect-error` as an error of its own, so loosening a constraint by accident fails the
 * build instead of passing silently.
 *
 * The comment suppresses the line directly below it, so it sits inside the `assertType(...)` call,
 * right above its argument, or above the prop it is about.
 */
import { createRef, type KeyboardEvent, type MouseEvent } from 'react';
import { assertType, describe, expectTypeOf, test } from 'vitest';
import type { DateAdapter } from '../../lib/date-adapter.js';
import { Calendar } from '../calendar.js';
import { createCalendar } from '../create-calendar.js';
import type { CalendarComponent, DateRange, Matcher, Modifiers } from '../types.js';

type Boxed = { readonly boxed: Date };

const boxedAdapter: DateAdapter<Boxed> = {
	toDate: (value) => value.boxed,
	fromDate: (date) => ({ boxed: date }),
};

// Written out as a variable so the type is the one `createCalendar` infers from the adapter.
const BoxedCalendar = createCalendar(boxedAdapter);

const rootRef = createRef<HTMLDivElement>();
const day = new Date(2026, 8, 7);
const boxedDay: Boxed = { boxed: day };

describe('createCalendar', () => {
	test('takes the date type from the adapter', () => {
		expectTypeOf(BoxedCalendar).toEqualTypeOf<CalendarComponent<Boxed>>();
		expectTypeOf(Calendar).toEqualTypeOf<CalendarComponent<Date>>();
	});

	test('takes an adapter that reads time zones too', () => {
		const zoned: DateAdapter<Boxed, true> = {
			supportsTimezone: true,
			toDate: (value) => value.boxed,
			fromDate: (date) => ({ boxed: date }),
		};

		expectTypeOf(createCalendar(zoned)).toEqualTypeOf<CalendarComponent<Boxed>>();
	});

	test('holds every date as the adapter type', () => {
		assertType(
			<BoxedCalendar
				mode="single"
				selected={boxedDay}
				today={boxedDay}
				month={boxedDay}
				defaultMonth={boxedDay}
				startMonth={boxedDay}
				endMonth={boxedDay}
				disabled={[
					boxedDay,
					[boxedDay],
					{ from: boxedDay, to: boxedDay },
					{ before: boxedDay },
					{ after: boxedDay },
					{ before: boxedDay, after: boxedDay },
					(date) => {
						expectTypeOf(date).toEqualTypeOf<Boxed>();

						return false;
					},
				]}
				onMonthChange={(month) => {
					expectTypeOf(month).toEqualTypeOf<Boxed>();
				}}
				onSelect={(selected, triggerDate) => {
					expectTypeOf(selected).toEqualTypeOf<Boxed | undefined>();
					expectTypeOf(triggerDate).toEqualTypeOf<Boxed>();
				}}
			/>,
		);
	});

	test('rejects a Date where the adapter type is expected', () => {
		assertType(
			<BoxedCalendar
				mode="single"
				// @ts-expect-error - `selected` is a `Boxed` for this calendar, not a `Date`
				selected={day}
			/>,
		);
		assertType(
			<BoxedCalendar
				mode="single"
				// @ts-expect-error - `today` is a `Boxed` for this calendar, not a `Date`
				today={day}
			/>,
		);
		assertType(
			<BoxedCalendar
				mode="range"
				// @ts-expect-error - the ends of a range are `Boxed` for this calendar
				selected={{ from: day, to: day }}
			/>,
		);
	});
});

describe('mode and required', () => {
	test('needs a mode', () => {
		assertType(
			// @ts-expect-error - without a `mode` no day can be picked, so a calendar has to say which
			<Calendar />,
		);
	});

	test('single hands onSelect a Date or undefined, and a Date once required', () => {
		assertType(
			<Calendar
				mode="single"
				selected={day}
				onSelect={(selected, triggerDate, modifiers, event) => {
					expectTypeOf(selected).toEqualTypeOf<Date | undefined>();
					expectTypeOf(triggerDate).toEqualTypeOf<Date>();
					expectTypeOf(modifiers).toEqualTypeOf<Modifiers>();
					expectTypeOf(event).toEqualTypeOf<MouseEvent | KeyboardEvent>();
				}}
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				required
				selected={day}
				onSelect={(selected) => {
					expectTypeOf(selected).toEqualTypeOf<Date>();
				}}
			/>,
		);
	});

	test('multiple hands onSelect an array, and a defined one once required', () => {
		assertType(
			<Calendar
				mode="multiple"
				selected={[day]}
				onSelect={(selected) => {
					expectTypeOf(selected).toEqualTypeOf<Date[] | undefined>();
				}}
			/>,
		);
		assertType(
			<Calendar
				mode="multiple"
				required
				selected={[day]}
				onSelect={(selected) => {
					expectTypeOf(selected).toEqualTypeOf<Date[]>();
				}}
			/>,
		);
	});

	test('range hands onSelect a range, and a defined one once required', () => {
		assertType(
			<Calendar
				mode="range"
				selected={{ from: day, to: undefined }}
				onSelect={(selected) => {
					expectTypeOf(selected).toEqualTypeOf<DateRange | undefined>();
				}}
			/>,
		);
		assertType(
			<Calendar
				mode="range"
				required
				selected={{ from: day }}
				onSelect={(selected) => {
					expectTypeOf(selected).toEqualTypeOf<DateRange>();
				}}
			/>,
		);
	});

	test('needs `selected` once required, even when there is nothing selected yet', () => {
		assertType(<Calendar mode="single" required selected={undefined} />);
		assertType(
			// @ts-expect-error - a required selection has to be passed, so the calendar never has none to hand back
			<Calendar mode="single" required />,
		);
		assertType(
			// @ts-expect-error - a required selection has to be passed
			<Calendar mode="range" required />,
		);
	});

	test('rejects a selection that is not the shape of the mode', () => {
		assertType(
			// @ts-expect-error - one day is a `Date`, not a list
			<Calendar mode="single" selected={[day]} />,
		);
		assertType(
			// @ts-expect-error - several days are a list, not one `Date`
			<Calendar mode="multiple" selected={day} />,
		);
		assertType(
			// @ts-expect-error - a range is `{ from, to }`, not a `Date`
			<Calendar mode="range" selected={day} />,
		);
	});
});

describe('accepted props', () => {
	test('accepts the props it declares, aria and data attributes, and a ref', () => {
		assertType(
			<Calendar
				mode="single"
				ref={rootRef}
				testId="calendar"
				id="calendar"
				title="Pick a day"
				lang="pt-BR"
				// eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- a prop of Calendar, not an element
				role="dialog"
				aria-label="Pick a day"
				aria-labelledby="heading"
				data-row="first"
				defaultMonth={day}
				month={day}
				onMonthChange={() => undefined}
				startMonth={day}
				endMonth={day}
				numberOfMonths={2}
				today={day}
				captionLayout="dropdown-years"
				showOutsideDays={false}
				fixedWeeks
				showWeekNumber
				weekStartsOn={1}
				locale="pt-BR"
				footer="Pick a day"
				hideNavigation
				hideWeekdays
				disableNavigation
			/>,
		);
	});

	test('accepts every kind of matcher for disabled', () => {
		const matchers: Matcher[] = [
			true,
			day,
			[day],
			{ from: day, to: day },
			{ before: day },
			{ after: day },
			{ before: day, after: day },
			{ dayOfWeek: 0 },
			{ dayOfWeek: [0, 6] },
			(date) => date.getDay() === 0,
		];

		assertType(<Calendar mode="single" disabled={matchers} />);
		assertType(<Calendar mode="single" disabled={{ dayOfWeek: [0, 6] }} />);
		assertType(<Calendar mode="single" disabled={false} />);
	});

	test('accepts the four caption layouts and no other', () => {
		assertType(<Calendar mode="single" captionLayout="label" />);
		assertType(<Calendar mode="single" captionLayout="dropdown" />);
		assertType(<Calendar mode="single" captionLayout="dropdown-months" />);
		assertType(<Calendar mode="single" captionLayout="dropdown-years" />);
		assertType(
			// @ts-expect-error - only the four layouts exist
			<Calendar mode="single" captionLayout="buttons" />,
		);
	});

	test('takes the first day of the week as a day number from 0 to 6', () => {
		assertType(<Calendar mode="single" weekStartsOn={0} />);
		assertType(<Calendar mode="single" weekStartsOn={6} />);
		assertType(
			// @ts-expect-error - days are numbered 0 to 6
			<Calendar mode="single" weekStartsOn={7} />,
		);
	});
});

describe('rejected props', () => {
	test('rejects className and style, the look comes from the custom properties', () => {
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - `className` is not a prop
				className="x"
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - `style` is not a prop
				style={{}}
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - `classNames` is not a prop
				classNames={{ day: 'x' }}
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - `styles` is not a prop
				styles={{ day: {} }}
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - `modifiersClassNames` is not a prop
				modifiersClassNames={{}}
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - `modifiersStyles` is not a prop
				modifiersStyles={{}}
			/>,
		);
	});

	test('rejects the props the calendar no longer has', () => {
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - the parts are not replaceable
				components={{}}
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - the text is formatted by the calendar
				formatters={{}}
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - the labels are not replaceable
				labels={{}}
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - there are no custom modifiers, `disabled` is the one matcher
				modifiers={{}}
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - days are read in the browser's zone, an adapter converts them
				timeZone="UTC"
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - a locale is a BCP 47 tag, not a date-fns object
				locale={{ code: 'pt-BR' }}
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - the grid does not run right to left
				dir="rtl"
			/>,
		);
		assertType(
			<Calendar
				mode="single"
				// @ts-expect-error - the calendar does not animate
				animate
			/>,
		);
		assertType(
			<Calendar
				mode="range"
				// @ts-expect-error - a range has no length limits
				min={2}
			/>,
		);
	});
});
