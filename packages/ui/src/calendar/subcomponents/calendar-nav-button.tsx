import type { ReactElement } from 'react';
import { CalendarText, CalendarButtonVariant } from '../constants.js';
import { partTestId } from '../../lib/utils.js';
import { useCalendarContext } from '../calendar-context.js';
import { CalendarButton } from './calendar-button.js';
import { CalendarChevron } from './calendar-chevron.js';

/**
 * The arrow that moves the calendar one month back or forward.
 *
 * It stays in place at the edge of the months the user can reach, marked `aria-disabled` and out
 * of the tab order, so the layout does not shift.
 *
 * @access private
 */
export function CalendarNavButton({ direction }: { direction: 'previous' | 'next' }): ReactElement {
	const { testId, previousMonth, nextMonth, goToMonth } = useCalendarContext();
	const month = direction === 'previous' ? previousMonth : nextMonth;

	return (
		<CalendarButton
			variant={CalendarButtonVariant.Nav}
			data-direction={direction}
			testId={partTestId(testId, `nav-${direction}`)}
			tabIndex={month ? undefined : -1}
			aria-disabled={month ? undefined : true}
			aria-label={direction === 'previous' ? CalendarText.PreviousMonth : CalendarText.NextMonth}
			onClick={() => {
				if (month) {
					goToMonth(month);
				}
			}}
		>
			<CalendarChevron orientation={direction === 'previous' ? 'left' : 'right'} />
		</CalendarButton>
	);
}
