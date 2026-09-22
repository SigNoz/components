import { type ComponentProps, type ReactElement, useMemo } from 'react';
import type { Month } from 'react-day-picker';
import { CalendarMonthContext } from '../calendar-context.js';

/**
 * One displayed month: its caption and its grid.
 *
 * It exists to tell the parts inside which of the displayed months they are in, which nothing below
 * `Month` is given and every `data-testid` down there needs once `numberOfMonths` is above one.
 *
 * `calendarMonth` is react-day-picker's own object and is dropped here rather than spread, because
 * React would otherwise write it to the DOM as an attribute.
 *
 * @access private
 */
export function CalendarMonth({
	calendarMonth,
	displayIndex,
	...props
}: ComponentProps<typeof Month>): ReactElement {
	const value = useMemo(() => ({ displayIndex }), [displayIndex]);

	return (
		<CalendarMonthContext.Provider value={value}>
			<div data-slot="calendar-month" {...props} />
		</CalendarMonthContext.Provider>
	);
}
