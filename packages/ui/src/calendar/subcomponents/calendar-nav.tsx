import type { ReactElement } from 'react';
import styles from '../calendar.module.scss';
import { CalendarText } from '../constants.js';
import { CalendarNavButton } from './calendar-nav-button.js';

/**
 * The two month arrows, laid over the captions of the displayed months.
 *
 * @access private
 */
export function CalendarNav(): ReactElement {
	return (
		<nav aria-label={CalendarText.Navigation} className={styles['calendar__nav']}>
			<CalendarNavButton direction="previous" />
			<CalendarNavButton direction="next" />
		</nav>
	);
}
