import type { ReactElement } from 'react';
import { useCalendarTestIdStem } from '../calendar-context.js';
import styles from '../calendar.module.scss';
import type { CalendarWeekNumberProps } from '../types.js';

/**
 * The week-number cell at the start of a row, shown while `showWeekNumber` is set.
 *
 * The number is wrapped in a box that fills the row, so it lines up with the days beside it, which
 * a bare cell in a flex row does not.
 *
 * It stays the `<th scope="row">` react-day-picker renders, because the day cells in the row are
 * headed by it.
 *
 * `week` is react-day-picker's own object and is dropped here rather than spread, because React
 * would otherwise write it to the DOM as an attribute.
 *
 * @access private
 */
export function CalendarWeekNumber({
	week,
	children,
	...props
}: CalendarWeekNumberProps): ReactElement {
	const stem = useCalendarTestIdStem();

	return (
		<th {...props}>
			<div
				data-slot="calendar-week-number"
				className={styles['calendar__week-number-cell']}
				{...(stem === undefined ? {} : { 'data-testid': `${stem}-week-number-${week.weekNumber}` })}
			>
				{children}
			</div>
		</th>
	);
}
