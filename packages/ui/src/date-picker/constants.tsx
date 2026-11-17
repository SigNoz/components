/**
 * The fixed English strings of the date picker. The spec keeps them fixed until a call site needs
 * another language.
 *
 * @access private
 */
export const DatePickerText = {
	Apply: 'Apply',
	Clear: 'Clear date',
	ChooseDate: 'Choose date',
	ChooseDateAndTime: 'Choose date and time',
	Time: 'Time',
	Hours: 'Hours',
	Minutes: 'Minutes',
	Seconds: 'Seconds',
	Timezone: 'Time zone',
	TimezonePlaceholder: 'Select a time zone',
	TimezoneSearch: 'Search time zones',
} as const;

/**
 * What the trigger shows when `formatValue` returns an empty string.
 */
export const DATE_PICKER_EMPTY_LABEL = '<No label>';

/**
 * The parts of the time row, in the order the focus moves through them.
 *
 * @access private
 */
export const DatePickerTimeUnit = {
	Hours: 'hours',
	Minutes: 'minutes',
	Seconds: 'seconds',
} as const;

/**
 * The largest value of each part of the time row, in 24-hour form.
 *
 * @access private
 */
export const DATE_PICKER_TIME_MAX = {
	hours: 23,
	minutes: 59,
	seconds: 59,
} as const;

/**
 * The gap between the trigger and the popup, in pixels. The same as Select and Combobox.
 *
 * @access private
 */
export const DATE_PICKER_SIDE_OFFSET = 4;
