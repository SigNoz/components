import type { ReactElement } from 'react';
import { cn } from '../../lib/utils.js';
import { useCalendarContext } from '../calendar-context.js';
import styles from '../calendar.module.scss';
import type { GridDay } from '../month-grid.js';
import { CalendarDayButton } from './calendar-day-button.js';

/**
 * The `<td>` of a day, which carries the day's state as data attributes, and the button inside it.
 * A hidden day keeps its cell, so the week stays seven wide, and has no button.
 *
 * @access private
 */
export function CalendarDay({
	day,
	testIdStem,
}: {
	day: GridDay;
	testIdStem: string | undefined;
}): ReactElement {
	const { getModifiers } = useCalendarContext();
	const modifiers = getModifiers(day);

	return (
		<td
			className={cn(styles['calendar__day'], modifiers.hidden && styles['calendar__hidden'])}
			// eslint-disable-next-line jsx-a11y/no-redundant-roles -- written out, the way the grid has always been marked up.
			role="gridcell"
			aria-selected={modifiers.selected || undefined}
			data-day={day.isoDate}
			data-month={day.outside ? day.dateMonthId : undefined}
			data-selected={modifiers.selected || undefined}
			data-disabled={modifiers.disabled || undefined}
			data-hidden={modifiers.hidden || undefined}
			data-outside={day.outside || undefined}
			data-focused={modifiers.focused || undefined}
			data-today={modifiers.today || undefined}
		>
			{!modifiers.hidden && (
				<CalendarDayButton day={day} modifiers={modifiers} testIdStem={testIdStem} />
			)}
		</td>
	);
}
