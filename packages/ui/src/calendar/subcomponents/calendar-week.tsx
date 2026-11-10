import type { ReactElement } from 'react';
import styles from '../calendar.module.scss';
import { useCalendarContext } from '../calendar-context.js';
import type { GridWeek } from '../month-grid.js';
import { CalendarDay } from './calendar-day.js';
import { CalendarWeekNumber } from './calendar-week-number.js';

/**
 * One row of the grid: the week number when asked for, then the seven days.
 *
 * @access private
 */
export function CalendarWeek({
	week,
	testIdStem,
}: {
	week: GridWeek;
	testIdStem: string | undefined;
}): ReactElement {
	const { showWeekNumber } = useCalendarContext();

	return (
		<tr className={styles['calendar__week']}>
			{showWeekNumber && (
				<CalendarWeekNumber weekNumber={week.weekNumber} testIdStem={testIdStem} />
			)}
			{week.days.map((day) => (
				<CalendarDay
					key={`${day.isoDate}_${day.displayMonthId}`}
					day={day}
					testIdStem={testIdStem}
				/>
			))}
		</tr>
	);
}
