import type { ReactElement } from 'react';
import { CalendarDayButton } from '../../calendar/subcomponents/calendar-day-button.js';
import type { CalendarDayButtonProps } from '../../calendar/types.js';

/**
 * The name of the react-day-picker modifier the date picker marks a day it cannot pick with.
 *
 * Not react-day-picker's own `disabled`: that one takes the day out of the keyboard, and the focus
 * of the date picker skips no day, so it never gets stuck at a limit.
 *
 * @access private
 */
export const UNAVAILABLE_MODIFIER = 'unavailable';

/**
 * A date cell of the date picker's calendar: the Calendar one, with `aria-disabled` and
 * `data-disabled` on a day that cannot be picked, and `aria-current="date"` on today. The day
 * stays focusable.
 *
 * @access private
 */
export function DatePickerDayButton(props: CalendarDayButtonProps): ReactElement {
	const isUnavailable = props.modifiers[UNAVAILABLE_MODIFIER] === true;

	return (
		<CalendarDayButton
			{...props}
			aria-disabled={isUnavailable || props['aria-disabled']}
			data-disabled={isUnavailable || undefined}
			aria-current={props.modifiers.today ? 'date' : undefined}
		/>
	);
}
