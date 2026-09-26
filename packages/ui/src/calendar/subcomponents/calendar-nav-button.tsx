import { type ReactElement, useContext } from 'react';
import { CalendarContext } from '../calendar-context.js';
import { CalendarButtonVariant } from '../constants.js';
import type { CalendarNavButtonProps } from '../types.js';
import { CalendarButton } from './calendar-button.js';

/**
 * The arrow that moves the calendar one month back.
 *
 * react-day-picker renders it with its own label, click handler and `aria-disabled`, so this only
 * picks the look and says which way it points.
 *
 * @access private
 */
export function CalendarPreviousMonthButton(props: CalendarNavButtonProps): ReactElement {
	const { testId } = useContext(CalendarContext);

	return (
		<CalendarButton
			variant={CalendarButtonVariant.Nav}
			data-direction="previous"
			testId={testId === undefined ? undefined : `${testId}-nav-previous`}
			{...props}
		/>
	);
}

/**
 * The arrow that moves the calendar one month forward.
 *
 * @access private
 */
export function CalendarNextMonthButton(props: CalendarNavButtonProps): ReactElement {
	const { testId } = useContext(CalendarContext);

	return (
		<CalendarButton
			variant={CalendarButtonVariant.Nav}
			data-direction="next"
			testId={testId === undefined ? undefined : `${testId}-nav-next`}
			{...props}
		/>
	);
}
