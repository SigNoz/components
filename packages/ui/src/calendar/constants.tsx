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
 * The react-day-picker props that restyle the calendar from the call site. `CalendarProps` omits
 * them and the calendar drops them before it spreads the rest onto `DayPicker`.
 *
 * @access private
 */
export const DAY_PICKER_STYLE_PROPS = [
	'className',
	'classNames',
	'style',
	'styles',
	'modifiersClassNames',
	'modifiersStyles',
] as const;
