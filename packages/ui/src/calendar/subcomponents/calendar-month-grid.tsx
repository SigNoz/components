import type { ReactElement } from 'react';
import styles from '../calendar.module.scss';
import { useCalendarContext } from '../calendar-context.js';
import { CalendarText } from '../constants.js';
import type { GridMonth } from '../month-grid.js';
import { CalendarWeek } from './calendar-week.js';

/**
 * The `<table>` of one displayed month: the weekday names, then its weeks.
 *
 * @access private
 */
export function CalendarMonthGrid({
	month,
	testIdStem,
}: {
	month: GridMonth;
	testIdStem: string | undefined;
}): ReactElement {
	const { mode, formatter, showWeekNumber, hideWeekdays, weekdays } = useCalendarContext();

	return (
		<table
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role -- a date grid, which a plain table does not announce as one.
			role="grid"
			aria-multiselectable={mode === 'multiple' || mode === 'range'}
			aria-label={formatter.caption(month.date)}
			className={styles['calendar__month-grid']}
		>
			{!hideWeekdays && (
				<thead aria-hidden="true">
					<tr className={styles['calendar__weekdays']}>
						{showWeekNumber && (
							<th
								aria-label={CalendarText.WeekNumberHeader}
								className={styles['calendar__week-number-header']}
								scope="col"
							/>
						)}
						{weekdays.map((weekday) => (
							<th
								key={weekday.getDay()}
								aria-label={formatter.weekdayLong(weekday)}
								className={styles['calendar__weekday']}
								scope="col"
							>
								{formatter.weekdayShort(weekday)}
							</th>
						))}
					</tr>
				</thead>
			)}
			<tbody>
				{month.weeks.map((week) => (
					<CalendarWeek key={week.weekNumber} week={week} testIdStem={testIdStem} />
				))}
			</tbody>
		</table>
	);
}
