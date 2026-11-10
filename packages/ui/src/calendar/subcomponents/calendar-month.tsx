import type { ReactElement } from 'react';
import { partTestId } from '../../lib/utils.js';
import { useCalendarContext } from '../calendar-context.js';
import styles from '../calendar.module.scss';
import type { GridMonth } from '../month-grid.js';
import { CalendarCaption } from './calendar-caption.js';
import { CalendarMonthGrid } from './calendar-month-grid.js';

/**
 * One displayed month: its caption and its grid.
 *
 * It works out the stem every part below derives its `data-testid` from. That is the calendar's own
 * `testId` while one month is displayed, and `{testId}-month-{n}` while several are, so a
 * single-month calendar keeps the short names and a multi-month one stays addressable a month at a
 * time.
 *
 * @access private
 */
export function CalendarMonth({
	month,
	displayIndex,
}: {
	month: GridMonth;
	displayIndex: number;
}): ReactElement {
	const { testId, months } = useCalendarContext();
	const testIdStem = months.length > 1 ? partTestId(testId, `month-${displayIndex + 1}`) : testId;

	return (
		<div data-slot="calendar-month" className={styles['calendar__month']}>
			<div className={styles['calendar__month-caption']}>
				<CalendarCaption month={month} testIdStem={testIdStem} />
			</div>
			<CalendarMonthGrid month={month} testIdStem={testIdStem} />
		</div>
	);
}
