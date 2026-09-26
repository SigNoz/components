import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import type {
	Chevron,
	DayButton,
	DayPickerProps,
	MonthsDropdown,
	WeekNumber,
} from 'react-day-picker';
import type { CalendarButtonVariant } from './constants.js';

type OriginalDayButtonProps = ComponentProps<typeof DayButton>;
type OriginalChevronProps = ComponentProps<typeof Chevron>;
type OriginalDropdownProps = ComponentProps<typeof MonthsDropdown>;
type OriginalWeekNumberProps = ComponentProps<typeof WeekNumber>;

/**
 * @access private
 */
export type CalendarButtonVariantType =
	(typeof CalendarButtonVariant)[keyof typeof CalendarButtonVariant];

export type CalendarProps = DayPickerProps & {
	/**
	 * What `selected` and `onSelect` are: one `Date`, a `Date[]` or a `DateRange`.
	 *
	 * Required, unlike upstream. The day states (today, outside, disabled, selected) are painted on
	 * the day button, and react-day-picker renders no button for a calendar without a `mode`.
	 */
	mode: NonNullable<DayPickerProps['mode']>;
	/**
	 * Forwarded to the calendar's root element as `data-testid`, and the stem every part below
	 * derives its own from: `{testId}-nav-previous`, `{testId}-dropdown-month`,
	 * `{testId}-week-number-{week}` and `{testId}-button-{DD-MM-YYYY}` for a day.
	 *
	 * Without it none of them carry a `data-testid` at all.
	 */
	testId?: string;
};

/**
 * The square button every clickable part of the calendar is built from.
 *
 * A plain `<button>` passthrough: it owns the look and nothing else, so react-day-picker keeps
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

/**
 * Everything react-day-picker hands `components.Chevron`, so a prop it adds upstream shows up here
 * rather than being dropped unnoticed.
 *
 * @access private
 */
export type CalendarChevronProps = OriginalChevronProps;

/**
 * @access private
 */
export type CalendarNavButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * @access private
 */
export type CalendarWeekNumberProps = OriginalWeekNumberProps;

/**
 * @access private
 */
export type CalendarDropdownProps = OriginalDropdownProps;

/**
 * What {@link CalendarDayButton} takes. Everything but `prefix`, `suffix` and `testId` is
 * react-day-picker's, handed to `components.DayButton`.
 *
 * @access private
 */
export type CalendarDayButtonProps = Pick<
	OriginalDayButtonProps,
	| 'children'
	| 'className'
	| 'style'
	| 'disabled'
	| 'tabIndex'
	| 'aria-label'
	| 'aria-disabled'
	| 'onClick'
	| 'onBlur'
	| 'onFocus'
	| 'onKeyDown'
	| 'onMouseEnter'
	| 'onMouseLeave'
> & {
	/**
	 * The day this button stands for, as react-day-picker's own `CalendarDay`. Its date is written
	 * to `data-day` as `YYYY-MM-DD`, through the calendar's date library, so `numerals` and a
	 * non-Gregorian `dateLib` change it.
	 */
	day: OriginalDayButtonProps['day'];
	/**
	 * Which of react-day-picker's modifiers are on for this day. Selection, range position and
	 * `focused` are read from here; the rest are left to the cell around the button.
	 */
	modifiers: OriginalDayButtonProps['modifiers'];
	/**
	 * Rendered before the day number, for a marker such as a dot on a day that has data.
	 */
	prefix?: ReactNode;
	/**
	 * Rendered after the day number, for a marker such as a dot on a day that has data.
	 */
	suffix?: ReactNode;
	/**
	 * Forwarded to the rendered `<button>` as `data-testid`. Defaults to
	 * `{calendar testId}-button-{DD-MM-YYYY}`, and to nothing at all when the calendar has no
	 * `testId`.
	 */
	testId?: string;
};
