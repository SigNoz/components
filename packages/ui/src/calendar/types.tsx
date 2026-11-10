import type {
	AriaAttributes,
	ButtonHTMLAttributes,
	ComponentProps,
	ForwardRefExoticComponent,
	KeyboardEvent,
	MouseEvent,
	PropsWithoutRef,
	ReactNode,
	RefAttributes,
} from 'react';
import type { CalendarButtonVariant } from './constants.js';

/**
 * @access private
 */
export type CalendarButtonVariantType =
	(typeof CalendarButtonVariant)[keyof typeof CalendarButtonVariant];

/**
 * A day of the week, `0` being Sunday.
 */
export type CalendarWeekdayType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * How the month and the year in the caption read: as plain text, or as native dropdowns.
 */
export type CalendarCaptionLayoutType = 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';

/**
 * The states a day is in, by name. Every key is `true` or `false`: `today`, `outside`, `disabled`,
 * `hidden`, `focused` and `selected`, and in `range` mode `range_start`, `range_middle` and
 * `range_end` as well.
 */
export type Modifiers = Record<string, boolean>;

/**
 * A run of days, both ends included. A range that has only `from` is picked and waiting for its
 * end.
 */
export type DateRange<TDate = Date> = {
	/**
	 * The first day of the range.
	 */
	from: TDate | undefined;
	/**
	 * The last day of the range.
	 */
	to?: TDate | undefined;
};

/**
 * Picks the days a prop applies to. One of:
 *
 * - `true` for every day, or a function that gets a day and returns whether it matches.
 * - A date, or an array of dates.
 * - `{ from, to }`, both ends included. With only one end, that day alone.
 * - `{ before }`, `{ after }`, or `{ before, after }`. With both, the days between them are
 *   matched when `before` is the later one, and the days outside them when it is the earlier.
 * - `{ dayOfWeek }`, one day of the week or several, `0` being Sunday.
 *
 * Only the day counts, never the time of day.
 */
export type Matcher<TDate = Date> =
	| boolean
	| ((date: TDate) => boolean)
	| TDate
	| TDate[]
	| DateRange<TDate>
	| { before: TDate }
	| { after: TDate }
	| { before: TDate; after: TDate }
	| { dayOfWeek: number | number[] };

/**
 * What `onSelect` is called with, besides the new selection.
 */
type CalendarSelectHandler<TSelected, TDate> = (
	selected: TSelected,
	triggerDate: TDate,
	modifiers: Modifiers,
	event: MouseEvent | KeyboardEvent,
) => void;

type CalendarBaseProps<TDate> = Pick<ComponentProps<'div'>, 'id' | 'title' | 'lang'> &
	Pick<AriaAttributes, 'aria-label' | 'aria-labelledby'> & {
		/**
		 * Overrides what the root element is announced as. Left out, it has no role.
		 */
		role?: 'application' | 'dialog';
		/**
		 * Forwarded to the calendar's root element as `data-testid`, and the stem every part below
		 * derives its own from: `{testId}-nav-previous`, `{testId}-dropdown-month`,
		 * `{testId}-week-number-{week}` and `{testId}-button-{DD-MM-YYYY}` for a day.
		 *
		 * Without it none of them carry a `data-testid` at all.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the root.
		 */
		[key: `data-${string}`]: unknown;
		/**
		 * The month shown first while the calendar is uncontrolled. Read once, on the first render.
		 *
		 * @default today
		 */
		defaultMonth?: TDate;
		/**
		 * The month shown first, which makes the calendar controlled: it stays on this month until
		 * the prop changes, and `onMonthChange` reports where the user wants to go.
		 */
		month?: TDate;
		/**
		 * Called with the first day of the month the user moved to, by an arrow, a dropdown or the
		 * keyboard. It runs also when the month asked for is the one already shown.
		 */
		onMonthChange?: (month: TDate) => void;
		/**
		 * The earliest month the user can reach. Days before it are hidden, and the previous-month
		 * arrow stops there.
		 *
		 * @note With a year dropdown and no `startMonth`, the calendar starts 100 years before
		 * `today`.
		 */
		startMonth?: TDate | undefined;
		/**
		 * The latest month the user can reach. Days after it are hidden, and the next-month arrow
		 * stops there.
		 *
		 * @note With a year dropdown and no `endMonth`, the calendar ends with the year of `today`.
		 */
		endMonth?: TDate;
		/**
		 * How many months are laid out side by side.
		 *
		 * @default 1
		 */
		numberOfMonths?: number;
		/**
		 * The day treated as today, for the today marker and as the first day to land on. Left out,
		 * it is the current day.
		 */
		today?: TDate;
		/**
		 * Whether the month and the year in the caption read as plain text or as native dropdowns.
		 * `dropdown-months` and `dropdown-years` swap only one of them and leave the other as text.
		 *
		 * @default 'label'
		 */
		captionLayout?: CalendarCaptionLayoutType;
		/**
		 * Whether the first and last week of a month show the days of the neighbouring months. When
		 * `false`, those cells stay empty.
		 *
		 * @default true
		 */
		showOutsideDays?: boolean;
		/**
		 * Always lays out six weeks, so the calendar keeps its height from one month to the next.
		 */
		fixedWeeks?: boolean;
		/**
		 * Adds a column with the number of each week. The week that holds 1 January is week 1, so the
		 * last days of December can be week 1 of the next year.
		 */
		showWeekNumber?: boolean;
		/**
		 * The day a week starts on, `0` being Sunday.
		 *
		 * @default the first day of the week in `locale`
		 */
		weekStartsOn?: CalendarWeekdayType | undefined;
		/**
		 * The language of the month and weekday names and of the day labels, as a BCP 47 tag. `en`
		 * in any region reads the same English.
		 *
		 * The words of the arrows, the dropdowns and the week numbers are always English, and the
		 * first day of the week follows the region unless `weekStartsOn` is set.
		 *
		 * @default 'en-US'
		 */
		locale?: string;
		/**
		 * Rendered under the grid, in a polite live region, so a screen reader announces it when it
		 * changes.
		 */
		footer?: ReactNode;
		/**
		 * The days that cannot be picked. They are skipped by the keyboard as well, and their
		 * button is disabled, except while it holds the focus.
		 */
		disabled?: Matcher<TDate> | Matcher<TDate>[] | undefined;
		/**
		 * Drops the month arrows.
		 */
		hideNavigation?: boolean;
		/**
		 * Drops the row of weekday names above the grid.
		 */
		hideWeekdays?: boolean;
		/**
		 * Keeps the calendar on the month it shows: the arrows and the dropdowns are disabled, and
		 * the keyboard stops at the edge of what is shown.
		 */
		disableNavigation?: boolean;
	};

type CalendarSelectionProps<TDate> =
	| {
			/**
			 * One day is selected. Picking the selected day again clears it, unless `required` is set.
			 */
			mode: 'single';
			/**
			 * Stops the selection from being cleared, so `onSelect` never gets `undefined`.
			 */
			required?: false | undefined;
			/**
			 * The selected day.
			 */
			selected?: TDate | undefined;
			/**
			 * Called with the new selection, the day that was picked, the states that day was in and
			 * the event. Without it, the calendar keeps the selection itself, starting from `selected`.
			 */
			onSelect?: CalendarSelectHandler<TDate | undefined, TDate>;
	  }
	| {
			mode: 'single';
			required: true;
			selected: TDate | undefined;
			onSelect?: CalendarSelectHandler<TDate, TDate>;
	  }
	| {
			/**
			 * Any number of days are selected. Picking a selected day removes it.
			 */
			mode: 'multiple';
			required?: false | undefined;
			/**
			 * The selected days.
			 */
			selected?: TDate[] | undefined;
			onSelect?: CalendarSelectHandler<TDate[] | undefined, TDate>;
	  }
	| {
			mode: 'multiple';
			/**
			 * The last selected day stays: picking it again does nothing, and `onSelect` is not
			 * called.
			 */
			required: true;
			selected: TDate[] | undefined;
			onSelect?: CalendarSelectHandler<TDate[], TDate>;
	  }
	| {
			/**
			 * One run of days is selected: the first pick sets its start, the second its end.
			 */
			mode: 'range';
			required?: false | undefined;
			/**
			 * The selected range.
			 */
			selected?: DateRange<TDate> | undefined;
			onSelect?: CalendarSelectHandler<DateRange<TDate> | undefined, TDate>;
	  }
	| {
			mode: 'range';
			required: true;
			selected: DateRange<TDate> | undefined;
			onSelect?: CalendarSelectHandler<DateRange<TDate>, TDate>;
	  };

/**
 * The props of `Calendar`, with the dates held as `TDate`. `CalendarProps` alone is the `Date`
 * version.
 *
 * It is a union on `mode` and `required`, which decide what `selected` and `onSelect` are:
 * `onSelect` never gets `undefined` once `required` is set.
 */
export type CalendarProps<TDate = Date> = CalendarBaseProps<TDate> & CalendarSelectionProps<TDate>;

/**
 * The calendar `createCalendar` returns: `Calendar` with its dates held as `TDate`, and a ref to
 * the root `<div>`.
 */
export type CalendarComponent<TDate = Date> = ForwardRefExoticComponent<
	PropsWithoutRef<CalendarProps<TDate>> & RefAttributes<HTMLDivElement>
>;

/**
 * The props that restyle the calendar from the call site, which it does not accept.
 *
 * @access private
 */
export type CalendarStyleProp =
	| 'className'
	| 'classNames'
	| 'style'
	| 'styles'
	| 'modifiersClassNames'
	| 'modifiersStyles';

/**
 * The square button every clickable part of the calendar is built from.
 *
 * A plain `<button>` passthrough: it owns the look and nothing else, so the calendar keeps
 * handling focus, keyboard navigation and the click itself.
 *
 * `type` is not among them. Nothing in a calendar submits a form, so it is always `"button"`.
 *
 * @access private
 */
export type CalendarButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
	/**
	 * What this button is for. Lands on `data-variant`, which is what the stylesheet sizes and
	 * paints from.
	 */
	variant: CalendarButtonVariantType;
	/**
	 * Forwarded to the rendered `<button>` as `data-testid`.
	 */
	testId?: string;
};
