/**
 * What a calendar button is for.
 *
 * Both are the same square, borderless button. `day` is a date cell in the grid and carries the
 * selection state, `nav` is the arrow that moves the calendar one month.
 *
 * @access private
 */
export const CalendarButtonVariant = {
	Day: 'day',
	Nav: 'nav',
} as const;

/**
 * The language the calendar reads in when no `locale` is given.
 *
 * @access private
 */
export const DEFAULT_LOCALE = 'en-US';

/**
 * The words the calendar speaks for its own controls. They are English whatever the `locale`:
 * only dates and names follow it.
 *
 * @access private
 */
export const CalendarText = {
	Navigation: 'Navigation bar',
	PreviousMonth: 'Go to the Previous Month',
	NextMonth: 'Go to the Next Month',
	ChooseMonth: 'Choose the Month',
	ChooseYear: 'Choose the Year',
	WeekNumberHeader: 'Week Number',
	Today: 'Today',
	Selected: 'selected',
	weekNumber: (weekNumber: number): string => `Week ${weekNumber}`,
} as const;
