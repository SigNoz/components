import type { ReactElement } from 'react';
import { useCalendarContext } from '../calendar-context.js';
import styles from '../calendar.module.scss';
import { CalendarText } from '../constants.js';

/**
 * The week-number cell at the start of a row, shown while `showWeekNumber` is set.
 *
 * The number is wrapped in a box that fills the row, so it lines up with the days beside it, which
 * a bare cell in a flex row does not.
 *
 * It stays a `<th scope="row">`, because the day cells in the row are headed by it.
 *
 * @access private
 */
export function CalendarWeekNumber({
	weekNumber,
	testIdStem,
}: {
	weekNumber: number;
	testIdStem: string | undefined;
}): ReactElement {
	const { formatter } = useCalendarContext();

	return (
		<th
			aria-label={CalendarText.weekNumber(weekNumber)}
			className={styles['calendar__week-number']}
			scope="row"
			// eslint-disable-next-line jsx-a11y/no-redundant-roles -- written out, the way the grid has always been marked up.
			role="rowheader"
		>
			<div
				data-slot="calendar-week-number"
				className={styles['calendar__week-number-cell']}
				{...(testIdStem === undefined
					? {}
					: { 'data-testid': `${testIdStem}-week-number-${weekNumber}` })}
			>
				{formatter.weekNumber(weekNumber)}
			</div>
		</th>
	);
}
